
/**
 * A collection of Artists.
 */
app.ArtistCollection = Backbone.Collection.extend({

  model: app.Artist,

  sync: function(method, model, options) {
    if (method === "read") {
      var type = (typeof options.type == 'undefined' ? 'all' : options.type);
      if(type == 'all'){
        app.store.allArtists(function(data){
          options.success(data.models);
        });
      }
      //random block
      if(type == 'rand'){
        app.store.randomArtists(function(data){

          options.success(data);
        });
      }
    }
  }

});


/**
 * A collection of Albums.
 */
app.AlbumsCollection = Backbone.Collection.extend({
  model: app.Album,

  sync: function(method, model, options) {
    if (method === "read") {
      app.notification('Loading Albums');
      app.store.allAlbums(function(data){
        options.success(data.models);
      });
    }
  }
});


/**
 * A single album and its songs.
 */
app.AlbumCollection = Backbone.Collection.extend({
  model: app.Album,

  sync: function(method, model, options) {
    if (method === "read") {
      app.notification('Loading ' + options.type + 's');
      app.store.getAlbums(parseInt(options.id), options.type, function(data){
        options.success(data);
      });
    }
  }
});


/**
 * Get every song, should not be rendered at once!
 * Its generally a big collection.
 */
app.SongCollection = Backbone.Collection.extend({
  model: app.Song,

  sync: function(method, model, options) {
    if (method === "read") {
      options.success(app.stores.allSongs.models);
    }
  }

});



app.PlaylistCollection = Backbone.Collection.extend({
  model: app.PlaylistItem,

  sync: function(method, model, options) {
    if (method === "read") {
      console.log('read');
      app.AudioController.getPlaylistItems(function(result){

        options.success(result.items);
      });

    }
  }

});



app.PlaylistCustomListCollection = Backbone.Collection.extend({

  model: app.PlaylistCustomListItem,

  sync: function(method, model, options) {
    if (method === "read") {
      // vars
      var lists = app.playlists.getCustomPlaylist(),
        o = [], i = 1;

      // success
      for(n in lists){
        var item = lists[n];
        item.id = i;
        o.push(item);
        i++;
      }

      options.success(o);

    }
  }

});



app.PlaylistCustomListSongCollection = Backbone.Collection.extend({

  model: app.PlaylistCustomListItemSong,

  sync: function(method, model, options) {
    if (method === "read") {

      var list = app.playlists.getCustomPlaylist(options.name);
      app.AudioController.songLoadMultiple(list.items, function(songs){
        console.log('%c loading playlist', app.helpers.consoleStyle(1), songs);
        options.success(songs);
      });

    }
  }

});


app.ThumbsUpCollection = Backbone.Collection.extend({

  model: app.PlaylistCustomListItemSong,

  sync: function(method, model, options) {
    if (method === "read") {

      var list = app.playlists.getThumbsUp(options.name);

      // no further parsing if empty
      if(list == null || list.length == 0){
        return {items: []};
      }

      switch(options.name){

        case 'song':
          // lookup songs
          app.AudioController.songLoadMultiple(list.items, function(songs){
            options.success(songs);
          });
          break;

        case 'artist':
          // get artists from cache
          app.store.multipleArtists(list.items, function(data){
            options.success(data);
          });
          break;

        case 'album':
          // get albums from cache
          app.store.multipleAlbums(list.items, function(data){
            options.success(data);
          });
          break;

      }

    }
  }

});







/**************************
 * Memory store
 * @param successCallback
 * @param errorCallback
 * @constructor
 ***************************/


app.MemoryStore = function (successCallback, errorCallback) {

  this.state = {
    ready: false,
    msg: "connecting"
  };

  // clear/declare
  app.stores = {
    songs: [],
    albums: [],
    artists: [],
    genres: [],
    all: [],
    allArtists: []
  };

 /*
  * Force sync songs with xbmc
  */
  this.syncAudio = function(successCallback){

    var self = this;


    self.songsIndexed = false;
    self.albumsIndexed = false;
    self.albumsIndexed = false;

    this.allArtists();
    this.allAlbums();
  };


  this.indexSongs = function(successCallback){
    var self = this;

    //get all songs
    this.allSongs = new app.SongXbmcCollection();

    // fetch all songs (very slow and locks up ui a bit)
    this.allSongs.fetch({"success": function(data){
      console.log('songs fetched', data);
      // assign to store
      self.parseAudio(data.models);

      //cache
      app.stores.allSongs = data;

      //flag as indexed
      self.songsIndexed = true;

      self.state = {ready: true, msg: 'songs ready'};
      $(window).trigger('songsReady');

      // ready action
      //successCallback();
      callLater(successCallback,  self)
    }});

  };

  /**
   * This is a wrapper for callbacks that rely on the library being present
   */
  this.libraryCall = function(callback, trigger){
    if(typeof trigger == 'undefined'){
      trigger = 'songsReady';
    }
    if(app.store.state.ready === true){
      callback();
    } else {
      //library is not ready, bind to when it is
      $(window).bind(trigger, callback);
    }
  };

  /**
   * Get all artists
   * @param callback
   * @returns {*}
   */
  this.allArtists = function(callback){
    var self = this;

    if(self.artistsIndexed === true){
      var collection = app.stores.allArtists;
      callLater(callback, collection);
      return collection;
    }

    // fetch all artists
    this.allXbmcArtists = new app.ArtistXbmcCollection();
    this.allXbmcArtists.fetch({"success": function(artists){


      artists.models.sort(function(a,b){ return app.helpers.aphabeticalSort(a.attributes.label, b.attributes.label);	});

      // assign to memory
      app.stores.allArtists = artists;

      self.msg = 'artists ready';

      $(window).trigger('artistsReady');

      self.artistsIndexed = true;

      // get the collection
      var collection = app.stores.allArtists;
      callLater(callback, collection);
      return collection;

    }});



  };

  this.allAlbums = function(callback){
    var self = this;

    if(self.albumsIndexed === true){
      var collection = app.stores.allAlbums;
      callLater(callback, collection);
      return collection;
    }

    // fetch all albums
    this.allXbmcAlbums = new app.AlbumXbmcCollection();
    this.allXbmcAlbums.fetch({"success": function(albums){

      // assign to memory
      app.stores.allAlbums = albums;

      self.msg = 'albums ready';
      $(window).trigger('albumsReady');

      self.albumsIndexed = true;

      var collection = app.stores.allAlbums;
      callLater(callback, collection);
      return collection;

    }});


  };

  /**
   * Load multiple artists by ids array
   * @param callback
   */
  this.multipleArtists = function(artistIds, callback){
    if(artistIds.length == 0){
      return;
    }
    this.allArtists(function(artists){
      // filter list by ids
      var filtered = artists.models.filter(function (element) {
        return ($.inArray(element.attributes.artistid, artistIds) != -1);
      });

      callLater(callback, filtered);
    });

  };



  /**
   * Load multiple albums by ids array
   * @param albumIds
   *  array
   * @param callback
   */
  this.multipleAlbums = function(albumIds, callback){
    if(albumIds.length == 0){
      return;
    }
    this.allAlbums(function(albums){
      var filtered = albums.models.filter(function (element) {
        return ($.inArray(element.attributes.albumid, albumIds) != -1);
      });

      callLater(callback, filtered);
    });

  };



  /**
   * Get 20 random artists with artwork
   * @param callback
   */
  this.randomArtists = function(callback){

    // get a random collection
    this.allArtists(function(data){
        artists = data.models,
          randArtists = _.shuffle(artists),
          farts = [], count = 30, i = 0;

        // only add content with artwork
        _.each(randArtists,function(a){
          if(i < count){
            if(a.attributes.fanart.length != 0 && a.attributes.thumbnail.length != 0){
              farts.push(a);
              i++;
            }
          }
        });
        //topup with thumbs
        if(farts.length < count){
          _.each(randArtists,function(a){
            if(i < count){
              if(a.attributes.thumbnail.length != 0){
                farts.push(a);
                i++;
              }
            }
          });
        }
        callLater(callback, farts);
      });

  };

  this.getArtist = function(id, callback){

    this.allArtists(function(){
      var self = this;
      // get the collection
      $.each(app.stores.allArtists.models, function(i,data){
        if(typeof data.attributes != "undefined" && data.attributes.artistid == id){
          callLater(callback,  data);

        }
      });
    });

  };

  /*
   * Grab artist songs and parse them into albums
   * Will attempt to pull from cache first
   */
  this.getAlbums = function(id, type, callback){
    var data = {}, albums = [], self = this, key = type + id, filter = type + 'id', plural = type + 's';

    // if cache exists
    if(app.helpers.exists(app.stores[plural])
      && app.helpers.exists(app.stores[plural][key])
      && app.helpers.exists(app.stores[plural][key].albumsitems)
    ){
      // get cache?
      albums = app.stores[plural][key].albumsitems;
      callLater(callback,  albums);
    }
    // if no cache get/refresh a collection from xbmc
    if(albums.length == 0) {
      // songs by filter
      data[filter] = id;

      var songs = new app.SongFilteredXbmcCollection({"filter": data});
      songs.fetch({"success": function(songs){
        //parse into albums
        albums = self.parseArtistSongsToAlbums(songs.models);
        //add to cache
        app.stores[plural][key] = {albumsitems: albums};
        callLater(callback,  albums);
      }});
    }
  };



  /* parse songs into albums */
  this.parseArtistSongsToAlbums = function(songs){
    albums = {}, ret = [];
    for(i in songs){
      // vars
      var model = songs[i],
          item = (typeof model.attributes != 'undefined' ? model.attributes : 0),
          albumkey = 'album' + item.albumid;

      // parse into albums
      if(typeof albums[albumkey] == "undefined"){
        albums[albumkey] = {};

        // populate album info from first item
        var fields = ['album', 'albumid', 'thumbnail', 'artist', 'artistid'];
        $.each(fields, function(b, field){
          if($.isArray(item[field])){
            item[field] = item[field][0];
          }
          albums[albumkey][field] = item[field];
        });

        // setup for songlist
        albums[albumkey].songs = [];
      }
      albums[albumkey].songs.push(model);
    }
    for(i in albums){
      ret.push(albums[i]);
    }
    return ret;
  };




  //  call it on construct
  this.syncAudio(successCallback);

  /*
   * Force sync songs with xbmc
   */
  this.parseAudio = function(songs){


    //loop over each song
    $.each(songs, function(i,data){

      //vars
      var item = data.attributes
        , songsDefault = { songs:[], artist: {}, albums: [], albumsitems: [] }
        , songkey = item.songid
        , albumid = (typeof item.albumid != "undefined" ? item.albumid : 0)
        , artistid = (typeof item.artistid != "undefined" ? item.artistid[0] : 0)
        , genreid = (typeof item.genreid != "undefined" ? item.genreid[0] : 0)
        , albumkey = 'album' + albumid
        , artistkey = 'artist' + artistid
        , genrekey = 'genre' + genreid
        ;

      // default songs
      if(typeof app.stores.songs[artistkey] == "undefined"){
        app.stores.songs[artistkey] = songsDefault;
      }

      // default artists get more parsing
      if(typeof app.stores.artists[artistkey] == "undefined"){
        app.stores.artists[artistkey] = songsDefault;        
      }

      // default genres
      if(typeof app.stores.genres[genrekey] == "undefined"){
        app.stores.genres[genrekey] = songsDefault;
      }

      //app.stores.albums[albumkey].songs.push(data);
      app.stores.songs[artistkey].songs.push(data);
      //app.stores.artists[artistkey].songs.push(data);
      app.stores.genres[genrekey].songs.push(data);
      app.stores.all.push(data);


    });

  };


  // Used to simulate async calls. This is done to provide a consistent
  // interface with stores that use async data access APIs
  var callLater = function (callback, data) {
    if (callback) {
      setTimeout(function () {
        callback(data);
      });
    }
  }

}

app.store = new app.MemoryStore(function(){

});

