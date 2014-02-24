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
      var $content = $('#content'),
        $title = $('#title'),
        notfoundartist = '<div class="noresult-box">No Artists found</div>',
        $el = $('<div class="search-results-content"></div>');

      $el.append('<div id="search-albums"></div>')
        .append('<div id="search-songs"></div>')
        .append('<div id="search-movies"></div>')
        .append('<div id="search-addons"></div>');

      $content.empty().html($el);
      $title.html('<a href="#">Search </a>' + key);

      // get artists list (sidebar)
      app.cached.SearchArtistsList = new app.ArtistCollection();
      app.cached.SearchArtistsList.fetch({success: function(data){
        // filter based on string match
        var artists = data.models.filter(function (element) {
          var label = element.attributes.artist;
          return label.toLowerCase().indexOf(key.toLowerCase()) > -1;
        });
        // update model with new collection
        data.models = artists;
        //if result
        if(data.models.length > 0){
          // add the sidebar view
          app.cached.artistsListSearch = new app.AristsListView({model: data, className: 'artist-search-list'});
          app.helpers.setFirstSidebarContent(app.cached.artistsListSearch.render().el);
        } else {
          app.helpers.setFirstSidebarContent(notfoundartist);
        }

      }});


      //get albums
      var $albums = $('#search-albums'),
        loading = '<div class="noresult-box">' + self.getLogo('album') + '<span>Loading Albums</span></div>',
        notfoundalb = '<div class="noresult-box empty">' + self.getLogo('album') + '<span>No Albums found with "'+key+'" in the title<span></div>';

      $albums.html(loading);

      app.cached.SearchAlbumList = new app.AlbumsCollection();
      app.cached.SearchAlbumList.fetch({success: function(data){
        $albums.empty();
        // filter based on string match
        var albums = data.models.filter(function (element) {
          var label = element.attributes.label;
          return label.toLowerCase().indexOf(key.toLowerCase()) > -1;
        });
        // update model with new collection
        data.models = albums;
        //if result
        if(data.models.length > 0){
          // add to content
          app.cached.SearchAlbumListSmall = new app.SmallAlbumsList({model: data, className: 'album-generic-list'});
          $albums.append(app.cached.SearchAlbumListSmall.render().el);
          $albums.prepend('<h3 class="search-heading">' + self.getLogo('album') + 'Album search for:<span>' + key + '</span></h3>');
        } else {
          //no results
          $albums.html(notfoundalb);
        }

      }});


      // get addons
      var $addons = $('#search-addons');
      $addons.empty();
      app.addOns.ready(function(){
        $addons = app.addOns.invokeAll('searchAddons', $addons, key);
      });


      // search songs
      self.searchSongs(key);

      // search songs
      self.searchMovies(key);

    }

  },


  /**
   * Init movie search
   * @param key
   */
  searchMovies: function(key){

    // vars
    var sel = '#search-movies',
      $el = $(sel),
      self = this;

    // Loading
    $el.html('<div class="addon-box">' + self.getLogo('movie') + '<span>Loading Movies</span></div>');
    var self = this;

    var allMovies = new app.MovieAllCollection();
    allMovies.fetch({"success": function(data){
      self.searchSectionRender(key, 'movie', 'MovieAllCollection', 'CustomMovieCollection', 'MovieListView');

    }});

  },


  /**
   * Init searching songs, could be dealing with lots o data
   * @param key
   */
  searchSongs: function(key){

    var $songs = $('#search-songs'),
      self = this;

    // bind to songs ready
    $songs.html('<div class="addon-box">' + self.getLogo('song') + '<span>Loading Songs</span></div>');

    if(self.songsLoaded === true){
      self.searchSectionRender(key, 'song', 'SongCollection', 'CustomSongCollection', 'SongListView');
    } else {
      app.store.libraryCall(function(){
        self.searchSectionRender(key, 'song', 'SongCollection', 'CustomSongCollection', 'SongListView');
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
   * Render a dynamic search section
   *
   * @param key
   * @param type
   * @param allCollectionName
   * @param collectionName
   * @param viewName
   */
  searchSectionRender: function(key, type, allCollectionName, collectionName, viewName){

    var $el = $('#search-' + type + 's'),
      self = this,
      ids = [],
      idKey = type + 'id',
      heading = '<h3 class="search-heading">' + self.getLogo(type) + type + ' search for:<span>' + key + '</span></h3>',
      noRes = '<div class="noresult-box empty">' + self.getLogo(type) + '<span>No ' + type + 's found</span></div>';

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
          $el.append(heading);

          // render view to content
          var v =  new app[viewName]({model: d, className: type + '-search-list ' + type + '-list'});
          $el.append(v.render().$el);
          // lazy load force
          $el.find('img').each(function(i,d){
            if($(this).data('original')){
              $(this).attr('src', $(this).data('original'));
            }

          });
        }});

      } else {
        // no results
        $el.html(noRes);
      }

    }});

  }


});