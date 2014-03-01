
/**
 * A collection of Movies.
 *
 * a page number can be passed for pagination, when first init it caches a lightweight
 * version on all movies for placeholders that can be found here app.stores.movies
 *
 * A fully loaded and range limited collection is provided in success callback
 */
app.MovieCollection = Backbone.Collection.extend({
  model: app.Movie,

  cached: [],
  fullyLoaded: false,

  sync: function(method, model, options) {
    if (method === "read") {


      // Get a paginated
      var self = this,
        fullRange = (typeof options.fullRange != 'undefined' && options.fullRange === true);


      // load up a full cache for pagination
      app.cached.moviesPage = new app.MovieAllCollection();
      app.cached.moviesPage.fetch({"success": function(model){


        // return pagination from cache if exists
        var cache = self.cachedPagination(app.moviePageNum, fullRange);
        if(cache !== false){
          options.success(cache);
          return;
        }

        // else lookup from xbmc
        console.log(app.moviePageNum);

        // model for params
        var args = {
          range: app.helpers.createPaginationRange(app.moviePageNum, fullRange)
        };

        // CACHE GET
//        // empty cache if first load
//        if(app.moviePageNum === 0){
//          app.stores.movies = [];
//        }
        // prep empty cache
        if(typeof app.stores.movies == 'undefined'){
          app.stores.movies = {};
        }
        // set the container
        app.stores.movies[app.moviePageNum] = [];

//        // if fullrange called and cache exists
//        if(fullRange && app.stores.movies.length > 0){
//          // we always return cache
//          // Could do some more checking for edge cases but is a simple solution
//          options.success(app.stores.movies);
//          return;
//        }

        // init the xbmc collection
        app.cached.movieXbmcCollection = new app.MovieXbmcCollection(args);
        // fetch results
        app.cached.movieXbmcCollection.fetch({"success": function(data){

          if(!fullRange || app.moviePageNum === 0){
            console.log('caching');
            // add models to cache if not a fullRange
            $.each(data.models,function(i,d){
              app.stores.movies[app.moviePageNum].push(d);
            });
          }

          // if models less than ipp then must be the end
          if(data.models.length > app.itemsPerPage){
            self.fullyLoaded = true;
          }
          // return callback
          options.success(data.models);
          return data.models;
        }});




      }});

      //return this

    }
  },


  /**
   * Returns a set of results if in cache or false if a lookup is required
   * @param pageNum
   * @param fullRange
   */
  cachedPagination: function(pageNum, fullRange){


    // always lookup if no cache
    if(app.stores.movies === undefined ||
      app.stores.movies[pageNum] === undefined ||
      app.stores.movies[pageNum].length === 0){
      console.log('nocache');
        return false;
    }

    var cache = app.stores.movies[pageNum],
      full = [];
    console.log('cachehit', fullRange);

    // full range requires us to loop over each and append to a full array
    if(fullRange){
      for(i = 0; i <= pageNum; i++){
        // we are missing a page, lookup again
        if(app.stores.movies[i] === undefined){
          return false;
        }
        console.log('cachehit', app.stores.movies[i]);
        for(var n in app.stores.movies[i]){
          full.push(app.stores.movies[i][n]);
        }
      }
      cache = full;
    }

    return cache;

//
//    // at least one page is in cache
//    var cacheOK = false,
//      range = app.helpers.createPaginationRange(pageNum, fullRange);
//
//    if( app.stores.allMovies.length == app.stores.movies.length || app.stores.movies.length == range.end ){
//      // Full cache
//      cacheOK = true;
//    }
//
//    // build cache based on range
//    if(cacheOK){
//      var returnCache = [];
//      for(var i in app.stores.movies){
//        if(i >= range.start && i <= range.end){
//          returnCache.push(app.stores.movies[i]);
//        }
//      }
//
//      //return cache
//      return returnCache;
//    } else {
//      // nocache found
//      return false;
//    }

  }

});


/**
 * A collection of Recently added Movies.
 */
app.MovieRecentCollection = Backbone.Collection.extend({
  model: app.Movie,

  cached: [],
  fullyLoaded: false,

  sync: function(method, model, options) {

    var opt = [app.movieFields, {'end': 100, 'start': 0}];
    app.xbmcController.command('VideoLibrary.GetRecentlyAddedMovies', opt, function(data){
      console.log(data);
      options.success(data.result.movies);
    });

  }

});


/**
 * A collection of movies matching a filter
 */
app.MovieFitleredCollection = Backbone.Collection.extend({
  model: app.Movie,

  sync: function(method, model, options) {

    // init cache
    if(app.stores.moviesFiltered === undefined){
      app.stores.moviesFiltered = {};
    }

    var sort = {"sort": {"method": "title"}},
      opt = [app.movieFields, {'end': 500, 'start': 0}, sort, options.filter],
      key = 'movies:key:filter';

    // cache
    for(var k in options.filter){
      key = 'movies:' + k + ':' + options.filter[k];
    }

    // if cache use that
    if(app.stores.moviesFiltered[key] !== undefined){
      // return from cache
      options.success(app.stores.moviesFiltered[key]);
    } else {
      // else lookup
      app.xbmcController.command('VideoLibrary.GetMovies', opt, function(data){
        // save cache
        app.stores.moviesFiltered[key] = data.result.movies;
        // return
        options.success(data.result.movies);
      });
    }

  }

});


/**
 * A lightweight collection of all movies (cached).
 */
app.MovieAllCollection = Backbone.Collection.extend({
  model: app.Movie,

  sync: function(method, model, options) {

    if(typeof app.stores.allMovies == 'undefined'){

      // no cache, do a lookup
      var allMovies = new app.AllMovieXbmcCollection();
      allMovies.fetch({"success": function(data){
        console.log('all');
        // Sort
        data.models.sort(function(a,b){ return app.helpers.aphabeticalSort(a.attributes.label, b.attributes.label);	});

        // Make a dictionary and flag as not loaded
        app.stores.allMoviesLookup = {};
        for(var i in data.models){
          var m = data.models[i].attributes;
          m.loaded = false;
          app.stores.allMoviesLookup[m.movieid] = m;
          data.models[i].attributes = m;
        }
        // Cache
        app.stores.allMovies = data.models;
        // Return
        options.success(data.models);
        // trigger
        $(window).trigger('allMoviesCached');
      }});
    } else {
      // else return cache;
      options.success(app.stores.allMovies);
    }

  }

});


/**
* A collection of movies based on a custom array of movie ids
* requires an a property of items[] in options
*/
app.CustomMovieCollection = Backbone.Collection.extend({
  model: app.Movie,

  sync: function(method, model, options) {

    app.xbmcController.entityLoadMultiple('movie', options.items, function(movies){
      options.success(movies);
    });

  }

});


