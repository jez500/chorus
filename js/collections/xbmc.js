/*
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
  arg1: app.songFields, //fields
  arg2: {"start": 0, "end": 500}, //count
  arg3: {"sort": {"method": "dateadded", "order": "descending"}},
  //method/params
  methods: {
    read:  ['AudioLibrary.GetSongs', 'arg1', 'arg2', 'arg3']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return resp.songs;
  }
});



/*
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
    console.log(this.models[0]);
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



/*
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
  arg2: {"start": 0, "end": 5000}, //count
  arg3: {"sort": {"method": "album"}},
  //method/params
  methods: {
    read:  ['AudioLibrary.GetAlbums', 'arg1', 'arg2', 'arg3']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return resp.albums;
  }
});



/*
 * Get Album collection
 */
app.AlbumRecentXbmcCollection = Backbone.Collection.extend({
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
    return resp.albums;
  }
});



/*
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
  arg3: {"start": 0, "end": 5000}, //count
  arg4: {"sort": {"method": "artist"}},
  //method/params
  methods: {
    read:  ['AudioLibrary.GetArtists', 'arg1', 'arg2', 'arg3', 'arg4']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
    return resp.artists;
  }
})