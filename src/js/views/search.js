/**
 * Search view
 *
 * @type {*|void|Object|extend|extend|extend}
 */


app.searchView = Backbone.View.extend({

  initialize: function () {

  },

  songsLoaded: false,

  /**
   * Render based on key in the model
   * this is all a bit messy and could be refined
   *
   */
  render:function () {

    var key = this.model.key,
      self = this;

    if(key.length > 1){
      //set url without re-render
      app.router.navigate('#search/' + key);

      //set searching
      app.shellView.selectMenuItem('search', 'sidebar');

      //empty content as we append
      var $content = $('#content')
        $el = $('<div class="search-results-content"></div>');

      // Build containers for various search types
      $el.append('<div id="search-albums"></div>')
        .append('<div id="search-songs"></div>')
        .append('<div id="search-movies"></div>')
        .append('<div id="search-addons"></div>');

      // Render container to #content
      $content.empty().html($el);

      // Title
      app.helpers.setTitle('<a href="#">Search </a>' + key);

      // search Artists
      self.searchArtists(key);

      // search Albums
      self.searchAlbums(key);

      // search songs
      self.searchSongs(key);

      // search songs
      self.searchMovies(key);

      // invoke Addons
      self.searchAddOns(key);

    }

  },

  /**
   * Init artist search
   * @param key
   */
  searchAddOns: function(key){

    // get addons
    var $addons = $('#search-addons');
    $addons.empty();
    app.addOns.ready(function(){
      $addons = app.addOns.invokeAll('searchAddons', $addons, key);
    });

  },


  /**
   * Init artist search
   * @param key
   */
  searchArtists: function(key){

    // vars
    var self = this,
      items = [],
      notfoundartist = '<div class="noresult-box">No Artists found</div>';

    // get artists list (sidebar)
    app.cached.SearchArtistsList = new app.ArtistCollection();
    app.cached.SearchArtistsList.fetch({success: function(data){

      // filter based on string match
      items = data.models.filter(function (element) {
        return self.stringMatchFilter(element, key);
      });

      // update model with new collection
      data.models = items;

      //if result
      if(data.models.length > 0){
        // add the sidebar view
        app.cached.artistsListSearch = new app.AristsListView({model: data, className: 'artist-search-list'});
        app.helpers.setFirstSidebarContent(app.cached.artistsListSearch.render().el);
      } else {
        app.helpers.setFirstSidebarContent(notfoundartist);
      }

    }});

  },


  /**
   * Init album search
   * @param key
   */
  searchAlbums: function(key){

    // vars
    var self = this,
      type = 'album';

    // Add Loading
    self.loadingRender(type);

    // render result
    self.searchSectionPreLoadRender(key, type, 'AlbumsCollection', 'SmallAlbumsList');

  },


  /**
   * Init movie search
   * @param key
   */
  searchMovies: function(key){

    // vars
    var self = this,
      type = 'movie';

    // Add Loading
    self.loadingRender(type);

    var allMovies = new app.MovieAllCollection();
    allMovies.fetch({"success": function(data){
      self.searchSectionRender(key, type, 'MovieAllCollection', 'CustomMovieCollection', 'MovieListView');

    }});

  },


  /**
   * Init searching songs, could be dealing with lots o data
   * @param key
   */
  searchSongs: function(key){

    var self = this,
      type = 'song';

    // Add Loading
    self.loadingRender(type);

    if(self.songsLoaded === true){
      self.searchSectionRender(key, type, 'SongCollection', 'CustomSongCollection', 'SongListView');
    } else {
      app.store.libraryCall(function(){
        self.searchSectionRender(key, type, 'SongCollection', 'CustomSongCollection', 'SongListView');
        self.songsLoaded = true;
      }, 'songsReady');
    }

  },




  ///////////////////////////////////////////////
  // Helpers
  ///////////////////////////////////////////////


  // Get a generic logo/icon
  getLogo: function(type){
    return '<img src="theme/images/icons/icon-' + type + '.png" />';
  },

  // Get a generic logo/icon
  loadingRender: function(type){
    $('#search-' + type + 's').html('<div class="addon-box">' + this.getLogo(type) + '<span>Loading ' + type + 's</span></div>');
  },

  // Get a generic logo/icon
  headingHtml: function(type, key){
    return '<h3 class="search-heading">' + this.getLogo(type) + type + ' search for:<span>' + key + '</span></h3>';
  },

  // Get a generic logo/icon
  noResultsHtml: function(type){
    return '<div class="noresult-box empty">' + this.getLogo(type) + '<span>No ' + type + 's found</span></div>';
  },

  /**
   * Called when filtering a search key against a model label
   * @param element
   * @returns {boolean}
   */
  stringMatchFilter: function (element, key) {
    var label = element.attributes.label;
    return label.toLowerCase().indexOf(key.toLowerCase()) > -1;
  },

  /**
   * Force Lazy loading images
   */
  lazyLoadImages: function($el){
    $('img.content-lazy').each(function(i,d){
      $d = $(d);
      if($d.data('original') !== ''){
        $d.attr('src', $d.data('original'))
      }
    });
  },


  /**
   * Render a dynamic search section, this also does an extra lookup to fully populate the models
   *
   * @param key
   *  the search string
   * @param type
   *  eg. song, movie
   * @param allCollectionName
   *  All results from this collection, search is done via string match using .filter()
   * @param collectionName
   *  collection that populates each model
   * @param viewName
   *  how the collection is outputted
   */
  searchSectionRender: function(key, type, allCollectionName, collectionName, viewName){

    var $el = $('#search-' + type + 's'),
      self = this,
      ids = [],
      idKey = type + 'id';

    // Get ALL movies to filter
    app.cached['search' + allCollectionName] = new app[allCollectionName]();
    app.cached['search' + allCollectionName].fetch({success: function(data){

      // empty container
      $el.empty();

      // filter based on string match
      var items = data.models.filter(function (element) {
        return self.stringMatchFilter(element, key);
      });

      // get array of ids for multi-load
      _.each(items, function(item){
        ids.push(item.attributes[idKey]);
      });

      // Get a list of fully loaded models from id
      if(ids.length > 0){

        // lget a loaded collection to view
        var c = new app[collectionName]();
        c.fetch({items: ids, success: function(d){
          // heading
          $el.append( self.headingHtml(type, key) );

          // render view to content
          var v =  new app[viewName]({model: d, className: type + '-search-list ' + type + '-list'});
          $el.append( v.render().$el );

          // lazy load force
          self.lazyLoadImages($el);
        }});

      } else {
        // no results
        $el.html( self.noResultsHtml(type) );
      }

    }});

  },


  /**
   * Render a dynamic search section, assumes models will be returned fully loaded
   *
   * @param key
   *  the search string
   * @param type
   *  eg. song, movie
   * @param collectionName
   *  collection that populates each model
   * @param viewName
   *  how the collection is outputted
   */
  searchSectionPreLoadRender: function(key, type, collectionName, viewName){

    var $el = $('#search-' + type + 's'),
      self = this,
      items = [];

    // Get ALL movies to filter
    app.cached['search' + collectionName] = new app[collectionName]();
    app.cached['search' + collectionName].fetch({success: function(data){

      // empty container
      $el.empty();


      // filter based on string match
      items = data.models.filter(function (element) {
        return self.stringMatchFilter(element, key);
      });

      // update model with new collection
      data.models = items;

      //if result
      if(data.models.length > 0){

        // heading
        $el.append( self.headingHtml(type, key) );

        // render view to content
        var v =  new app[viewName]({model: data, className: type + '-search-list ' + type + '-list'});
        $el.append(v.render().$el);

        // lazy load force
        //self.lazyLoadImages($el);

      } else {
        // no results
        $el.html( self.noResultsHtml(type) );
      }

    }});

  }

});