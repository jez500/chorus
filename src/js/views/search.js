/**
 * Search view
 *
 * @type {*|void|Object|extend|extend|extend}
 */


app.searchView = Backbone.View.extend({

  initialize: function () {

    // create a new mixed view
    var model = {
      key: 'search',
      callbacks: {}
    };
    this.mixedView = new app.MixedView({model: model});

  },

  songsLoaded: false,

  /**
   * Render based on key in the model
   */
  render:function () {

    var key = this.model.key,
      self = this;

    if(key.length > 1){
      //set url without re-render
      app.router.navigate('#search/' + key);

      //set searching
      app.shellView.selectMenuItem('search', 'no-sidebar');

      // Set mixed view callbacks
      var callbacks = {
        song: function(){
          // search songs
          self.searchSongs(key);
        },
        artist: function(){
          // search Artists
          self.searchArtists(key);
        },
        album: function(){
          // search Albums
          self.searchAlbums(key);
        },
        tvshow: function(){
          // search Albums
          self.searchTv(key);
        },
        movie: function(){
        // search movies
          self.searchMovies(key);
        },
        addon: function(){
          // search addons
          self.searchAddOns(key);
        }
      };

      // update view
      self.mixedView.addEntity('addon');

      // update view
      self.mixedView.setCallbacks(callbacks);

      //empty content as we append
      var $content = $('#content'),
        $el = this.mixedView.render().$el ;

      // Render view
      $content.html( $el );

      // Title
      app.ui.setTitle('<a href="#search">Search </a>');

      // Search Addons
      self.searchAddOns(key);

    }

  },

  /**
   * Init artist search
   * @param key
   */
  searchAddOns: function(key){

    app.addOns.ready(function(){
      // get addons
      var $addons = $('#search-addons');
      $addons.empty();
      app.addOns.invokeAll('searchAddons', $addons, key);
    });

  },


  /**
   * Init artist search
   * @param key
   */
  searchArtists: function(key){

    // render result
    this.searchSectionPreLoadRender(key, 'artist', 'ArtistCollection', 'AristsRandView');

  },


  /**
   * Init album search
   * @param key
   */
  searchAlbums: function(key){

    // render result
    this.searchSectionPreLoadRender(key, 'album', 'AlbumsCollection', 'SmallAlbumsList');

  },


  /**
   * Init movie search
   * @param key
   */
  searchMovies: function(key){

    // vars
    var self = this;

    var allMovies = new app.MovieAllCollection();
    allMovies.fetch({"success": function(data){
      self.searchSectionRender(key, 'movie', 'MovieAllCollection', 'CustomMovieCollection', 'MovieListView');

    }});

  },

  /**
   * Init tv search
   * @param key
   */
  searchTv: function(key){

    // vars
    var self = this;
    self.searchSectionPreLoadRender(key, 'tvshow', 'TvshowAllCollection', 'TvshowListView');

  },

  /**
   * Init searching songs, could be dealing with lots o data
   * @param key
   */
  searchSongs: function(key){

    var self = this;

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

          // Render mixed mode with results
          _.defer(function(){
            self.mixedView.renderPane(type, d, viewName);
          });

        }});

      } else {

        // no results
        _.defer(function(){
          self.mixedView.noResult(type);
        });

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

    var // $el = $('#search-' + type + 's'),
      self = this,
      items = [];

    // Get ALL movies to filter
    app.cached['search' + collectionName] = new app[collectionName]();
    app.cached['search' + collectionName].fetch({success: function(data){

      // empty container
    //  $el.empty();

      // filter based on string match
      items = data.models.filter(function (element) {
        return self.stringMatchFilter(element, key);
      });

      // update model with new collection
      data.models = items;

      // render mixed mode results
      _.defer(function(){
        self.mixedView.renderPane(type, data, viewName);
      });


    }});

  }

});