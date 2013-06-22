/*
 *
 * This handles the model mapping to xbmc jsonrpc
 *
 */



/****************************************************************
 *
 * Songs
 *
 ****************************************************************/


/*
 * get Song model
 */
app.Song = Backbone.Model.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function (error) {
      console.log('Code: ' + error.code + ' Message: ' + error.message);
    },
    namespaceDelimiter: ''
  }),
  //methods/params
  methods: {
    read:  ['AudioLibrary.GetSongDetails', 'id', 'fields']
  },
  //model defaults
  defaults: {
    songid: 1,
    label: 'nolabel',
    thumbnail: ''
  },
  //correct json root
  parse:  function(resp, xhr){
    if(typeof resp.artistdetails != 'undefined'){
      return resp.songdetails;
    } else {
      return resp;
    }
  }
});


/*
 * Get Song collection
 */
app.SongCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function (error) {
      console.log('Code: ' + error.code + ' Message: ' + error.message);
    },
    namespaceDelimiter: ''
  }),
  //model
  model: app.Song,
  //collection params
  arg1: app.songFields, //fields
  arg2: {"start": 0, "end": 5000}, //count
  arg3: {"sort": {"method": "artist"}},
  arg4: function(){
    return {"filter": [{"albumid": this.id}]};
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








/****************************************************************
 *
 * Albums
 *
 ****************************************************************/


/*
 * get Albums model
 */
app.Album = Backbone.Model.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function (error) {
      console.log('Code: ' + error.code + ' Message: ' + error.message);
    },
    namespaceDelimiter: ''
  }),
  //methods/params
  methods: {
    read:  ['AudioLibrary.GetAlbumDetails', 'id', 'fields']
  },
  //model defaults
  defaults: {
    albumid: 1,
    label: 'nolabel',
    thumbnail: ''
  },
  //correct json root
  parse:  function(resp, xhr){
    if(typeof resp.artistdetails != 'undefined'){
      return resp.albumdetails;
    } else {
      return resp;
    }
  }
});


/*
 * Get Albums collection

app.AlbumCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function (error) {
      console.log('Code: ' + error.code + ' Message: ' + error.message);
    },
    namespaceDelimiter: ''
  }),
  //model
  model: app.Album,

  //collection params
  arg1: app.albumFields, //fields
  arg2: {"start": 0, "end": 5000}, //count
  arg3: {"sort": {"method": "artist"}},
  //method/params
  methods: {
    read:  ['AudioLibrary.GetAlbums', 'arg1', 'arg2', 'arg3', 'filter']
  },
  //return the artists key from the result
  parse:  function(resp, xhr){
   return resp.albums;
  }
});
 */





/****************************************************************
 *
 * Artists
 *
 ****************************************************************/

/*
 * get artist model
 */
/*app.Artist = Backbone.Model.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function (error) {
      console.log('Code: ' + error.code + ' Message: ' + error.message);
    },
    namespaceDelimiter: ''
  }),
  //methods/params
  methods: {
    read:  ['AudioLibrary.GetArtistDetails', 'id', 'fields']
  },
  //model defaults
  defaults: {
    artistid: 1,
    label: 'nolabel',
    thumbnail: ''
  },
  //correct json root
  parse:  function(resp, xhr){
    if(typeof resp.artistdetails != 'undefined'){
      return resp.artistdetails;
    } else {
      return resp;
    }
  }
});*/


/*
 * Get artist collection
 */
/*app.ArtistCollection = Backbone.Collection.extend({
  //rpc deets
  url: app.jsonRpcUrl,
  rpc: new Backbone.Rpc({
    errorHandler: function (error) {
      console.log('Code: ' + error.code + ' Message: ' + error.message);
    },
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
});*/






/*
 * sync first time round
 */
var originalSync = Backbone.sync;
Backbone.sync = function (method, model, options) {
    if (method === "read") {
        options.dataType = "jsonp";
        return originalSync.apply(Backbone, arguments);
    }

};
