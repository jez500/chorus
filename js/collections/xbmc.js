/****************************************************************************
 * AUDIO
 ****************************************************************************/

/**
 * Get Song collection
 */
app.SongXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc song call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Song,
  //collection params
  arg1: ["file"], //fields, keep this to an absolute minimum as adding fields makes it go real slow
  arg2: {"start": 0, "end": 50000}, //limit @todo move to settings
  arg3: {"sort": {"method": "dateadded", "order": "descending"}}, // doesn't appear to work? maybe lost in sorting elsewhere
  //method/params
  methods: {
    read:  ['AudioLibrary.GetSongs', 'arg1', 'arg2', 'arg3']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    // set the id as the songid
    $.each(resp.songs, function(i,d){
      resp.songs[i].id = d.songid;
    });
    return resp.songs;
  }
});



/**
 * Get Song collection
 */
app.SongFilteredXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc song filtered call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Song,
  //collection params
  arg1: app.songFields, //fields
  arg2: {"start": 0, "end": 500}, //count
  arg3: {"sort": {"method": "dateadded", "order": "descending"}},
  //apply our filter - Required! or call will fail
  arg4: function(){
    return this.models[0].attributes.filter;
  },
  //method/params
  methods: {
    read:  ['AudioLibrary.GetSongs', 'arg1', 'arg2', 'arg3', 'arg4']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return resp.songs;
  }
});



/**
 * Get Album collection
 */
app.AlbumXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc album call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Album,
  //collection params
  arg1: app.albumFields, //properties
  arg2: {"start": 0, "end": 15000}, //count
  arg3: {"sort": {"method": "dateadded", "order": "descending"}},
  //method/params
  methods: {
    read:  ['AudioLibrary.GetAlbums', 'arg1', 'arg2', 'arg3']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return resp.albums;
  }
});



/**
 * Get Recently Added Album collection
 */
app.AlbumRecentlyAddedXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc album call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Album,
  //collection params
  arg1: app.albumFields, //properties
  arg2: {"start": 0, "end": 200}, //count
  //method/params
  methods: {
    read:  ['AudioLibrary.GetRecentlyAddedAlbums', 'arg1', 'arg2']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    // mark as recently added in the model
    $.each(resp.albums, function(i,d){
      resp.albums[i].recent = 'added';
    });
    var a = app.helpers.shuffle(resp.albums);
    return a;
  }
});


/**
 * Get Recently Played Album collection
 */
app.AlbumRecentlyPlayedXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc album call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Album,
  //collection params
  arg1: app.albumFields, //properties
  arg2: {"start": 0, "end": 200}, //count
  //method/params
  methods: {
    read:  ['AudioLibrary.GetRecentlyPlayedAlbums', 'arg1', 'arg2']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    // mark as recently played in the model
    $.each(resp.albums, function(i,d){
      resp.albums[i].recent = 'played';
    });
    var a = app.helpers.shuffle(resp.albums);
    return app.helpers.buildUrls(a, 'album', 'albumid');
  }
});



/**
 * Get Artist collection
 */
app.ArtistXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc artist call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Artist,
  //collection params
  arg1: true, //albumartistsonly
  arg2: app.artistFields, //properties
  arg3: {"start": 0, "end": 10000}, //count
  arg4: {"sort": {"method": "artist"}},
  //method/params
  methods: {
    read:  ['AudioLibrary.GetArtists', 'arg1', 'arg2', 'arg3', 'arg4']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return app.helpers.buildUrls(resp.artists, 'artist', 'artistid');
  }
});


/****************************************************************************
 * VIDEO
 ****************************************************************************/


/**
 * Get Movie collection (all movies)
 */
app.MovieXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc artist call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Movie,
  //collection params
  arg1: ['year', 'thumbnail'], //properties
  arg2: function(){
    return this.models[0].attributes.range;
  },
  //method/params
  methods: {
    read:  ['VideoLibrary.GetMovies', 'arg1', 'arg2']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return app.helpers.buildUrls(resp.movies, 'movie', 'movieid');
  }
});


/**
 * Get Movie collection (all movies)
 */
app.AllMovieXbmcCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function(error){app.helpers.errorHandler('xbmc artist call',error);},
    namespaceDelimiter: ''
  }),
  //model
  model: app.Movie,
  //method/params
  methods: {
    read:  ['VideoLibrary.GetMovies']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return app.helpers.buildUrls(resp.movies, 'movie', 'movieid');
  }
});
