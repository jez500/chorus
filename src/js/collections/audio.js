
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
      for (var n in lists){
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

      app.xbmcController.entityLoadMultiple('song', list.items, function(songs){
        options.success(songs);
      });

    }
  }

});


/**
 * Get thumbs up collections
 * @todo - move out of audio collection
 *
 * @type {*|void|Object|extend|extend|extend}
 */
app.ThumbsUpCollection = Backbone.Collection.extend({

  model: app.PlaylistCustomListItemSong,

  sync: function(method, model, options) {
    if (method === "read") {

      var list = app.playlists.getThumbsUp(options.name);

      // no further parsing if empty
      if(list === undefined || list === null || list.length === 0){
        options.success([]);
        return {items: []};
      }

      switch(options.name){

        case 'song':
          // lookup songs
          app.xbmcController.entityLoadMultiple('song', list.items, function(songs){
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

        case 'movie':
          // lookup movies
          app.xbmcController.entityLoadMultiple('movie', list.items, function(movies){
            options.success(movies);
          });
          break;

        case 'tvshow':
          // lookup movies
          app.xbmcController.entityLoadMultiple('tvshow', list.items, function(tvshows){
            options.success(tvshows);
          });
          break;

        case 'dir':
          // lookup folders

          break;
      }

    }
  }

});


/**
 * Get a list of song models based on an array of songids
 * @type {*|void|Object|extend|extend|extend}
 */
app.CustomSongCollection = Backbone.Collection.extend({

  model: app.Song,

  sync: function(method, model, options) {
    if (method === "read") {

      app.xbmcController.entityLoadMultiple('song', options.items, function(songs){
        options.success(songs);
      });
    }
  }

});


/**
 * Get recent albumbs.
 * @TODO optimize it is quite slow - use multi command and remove fields
 *
 * @type {added, played, all}
 */
app.RecentAlbumCollection = Backbone.Collection.extend({

  model: app.Song,

  sync: function(method, model, options) {
    if (method === "read") {

      var type = options.type;

      // If cache
      if(app.stores.recentAlbums !== undefined){
        options.success(app.stores.recentAlbums[type]);
        return;
      }

      // Get data
      var data = {added: [], played: [], all: []},
        used = {};
      // first get recently added
      app.cached.recentlyAddedAlbums = new app.AlbumRecentlyAddedXbmcCollection();
      app.cached.recentlyAddedAlbums.fetch({"success": function(albumsAdded){
        // store
        data.added = albumsAdded.models;
        // then get recently played
        app.cached.recentlyPlayedAlbums = new app.AlbumRecentlyPlayedXbmcCollection();
        app.cached.recentlyPlayedAlbums.fetch({"success": function(albumsPlayed){
          // store
          data.played = albumsPlayed.models;
          // combine
          $.each(data.added, function(i,d){
            data.all.push(d);
            used[d.attributes.albumid] = true;
          });
          $.each(data.played, function(i,d){
            // if not already added...
            if(used[d.attributes.albumid] === undefined){
              data.all.push(d);
            }
          });
          // save cache
          app.stores.recentAlbums = data;
          // call success!
          options.success(data[type]);
        }});

      }});

    }
  }

});



/**
 * Get a list of song models based on an array of songids
 * @type {*|void|Object|extend|extend|extend}
 */
app.AudioGenreCollection = Backbone.Collection.extend({

  model: app.Tag,

  sync: function(method, model, options) {
    if (method === "read") {

      // Get all genres

      // cache
      if(app.stores.audioGenres !== undefined){
        options.success(app.stores.audioGenres);
      }

      // get genres
      app.xbmcController.command('AudioLibrary.GetGenres', [['title'], {start: 0, end: 500000}, {method: 'label', order: 'ascending'}], function(data){

        $.each(data.result.genres, function(i,d){
          d.type = 'musicGenre';
          d.id = d.genreid;
          d.url = '#music/genres/' + d.id;
          data.result.genres[i] = d;
        });
        app.stores.audioGenres = data.result.genres;


        options.success(data.result.genres);
      });

    }
  }

});


/**
 * Get a list of song models based on an array of songids
 * @type {*|void|Object|extend|extend|extend}
 */
app.AudioYearCollection = Backbone.Collection.extend({

  model: app.Tag,

  sync: function(method, model, options) {
    if (method === "read") {

      app.store.getAlbumYears(function(data){
        options.success(data);
      });

    }
  }

});


/**
 * Get a list of song models based on an array of songids
 * @type {*|void|Object|extend|extend|extend}
 */
app.AlbumYearCollection = Backbone.Collection.extend({

  model: app.Album,

  sync: function(method, model, options) {
    if (method === "read") {

      app.store.getAlbumsByYear(options.year, function(data){
        options.success(data);
      });

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

 /**
  * Force sync songs with xbmc
  */
  this.syncAudio = function(successCallback){

    var self = this;


    self.songsIndexed = false;
    self.songsIndexing = false;
    self.albumsIndexed = false;
    self.albumsIndexed = false;

    this.allArtists();
    this.allAlbums();
    this.indexSongs();

  };


  this.indexSongs = function(successCallback){
    var self = this;

    if(self.songsIndexed === true){
      // return collection
      callLater(successCallback,  self);
    } else {

      // if not indexing, start
      if(self.songsIndexing !== true){

        //get all songs
        self.songsIndexing = true;
        this.allSongs = new app.SongXbmcCollection();

        // fetch all songs (very slow and locks up ui a bit)
        this.allSongs.fetch({"success": function(data){

          // assign to store
          // debug console.log(data);

          //cache
          app.stores.allSongs = data;

          //flag as indexed
          self.songsIndexed = true;

          self.state = {ready: true, msg: 'songs ready'};
          $(window).trigger('songsReady');

          // ready action
          callLater(successCallback,  self);
        }});
      }

    }

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
    if(artistIds.length === 0){
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
   * Get albumbs by genre
   */
  this.getAlbumsByGenre = function(genreid, callback){



    this.allAlbums(function(albums){
      // filter list by ids
      var filtered = albums.models.filter(function (element) {
        return ($.inArray(genreid, element.attributes.genreid) != -1);
      });

      callLater(callback, filtered);
    });

  };


  /**
   * Get albums by year
   */
  this.getAlbumsByYear = function(year, callback){

    this.allAlbums(function(albums){
      // filter list by ids
      var filtered = albums.models.filter(function (element) {
        return (year == element.attributes.year);
      });

      callLater(callback, filtered);
    });

  };


  /**
   * Get a list of years from albums
   */
  this.getAlbumYears = function(callback){

    var filtered = [], all = {};

    this.allAlbums(function(albums){
      $.each(albums.models, function(i,d){
        all[d.attributes.year] = true;
      });
      for(var year in all){
        filtered.push({label: year, id: year, type: 'year', url: '#music/years/' + year});
      }
      callLater(callback, filtered);
    });

  };



  /**
   * Get a song by type/delta
   *
   * @param type
   *  id, file, title, contains (using contains is: "title like %delta%")
   * @param delta
   *  songid, filename
   * @param callback
   *  a single shell song model
   */
  this.getSongBy = function(type, delta, callback){

   var songs = app.stores.allSongs.models;
   var song = null;

    // Loop over each until song found
    $.each(songs, function(i,d){

      // already have a song
      if(song !== null){
        return;
      }

      // model get attributes for this row
      var model = d.attributes;

      // switch on type
      if(type == 'id' && model.id == delta){  // ID
          song = model;
      } else if(type == 'file' && model.file == delta){  // FILE
          song = model;
      } else if(type == 'title' && model.label == delta){  // TITLE
          song = model;
      }else if(type == 'title'){  // TITLE CONTAINS
        if(model.label.toLowerCase().indexOf(delta.toLowerCase()) > -1){
          song = model;
        }
      }

    });

    // return song
    callLater(callback, song);
    return song;

  };


  /**
   * Load multiple albums by ids array
   * @param albumIds
   *  array
   * @param callback
   */
  this.multipleAlbums = function(albumIds, callback){
    if(albumIds.length === 0){
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
        var artists = data.models,
          randArtists = _.shuffle(artists),
          farts = [], count = 30, i = 0;

        // only add content with artwork
        _.each(randArtists,function(a){
          if(i < count){
            if(a.attributes.fanart.length !== 0 && a.attributes.thumbnail.length !== 0){
              farts.push(a);
              i++;
            }
          }
        });
        //topup with thumbs
        if(farts.length < count){
          _.each(randArtists,function(a){
            if(i < count){
              if(a.attributes.thumbnail.length !== 0){
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




  /**
   * Grab artist songs and parse them into albums
   * Will attempt to pull from cache first
   *
   *
   * @TODO: Clean this up!
   */
  this.getAlbums = function(id, type, callback){
    var data = {}, albums = [], self = this, key = type + id, filter = type + 'id', plural = type + 's';

    // if cache exists
    if(app.helpers.exists(app.stores[plural]) &&
      app.helpers.exists(app.stores[plural][key]) &&
      app.helpers.exists(app.stores[plural][key].albumsitems)
    ){
      // get cache?
      albums = app.stores[plural][key].albumsitems;
      callLater(callback,  albums);
    }
    // if no cache get/refresh a collection from xbmc
    if(albums.length === 0) {
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
    var albums = {}, ret = [];
    for(var i in songs){
      // vars
      var model = songs[i],
          item = (typeof model.attributes != 'undefined' ? model.attributes : {}),
          albumkey = 'album' + item.albumid;

      // parse into albums
      if(typeof albums[albumkey] == "undefined"){
        albums[albumkey] = {};

        // populate album info from first item
        var fields = ['album', 'albumid', 'thumbnail', 'artist', 'artistid'];

        // merge fields
        for(var f in fields){
          var field = fields[f];
          if(item[field] !== undefined){
            albums[albumkey][field] = item[field];
          }
        }

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


  // Used to simulate async calls. This is done to provide a consistent
  // interface with stores that use async data access APIs
  var callLater = function (callback, data) {
    if (callback) {
      setTimeout(function () {
        callback(data);
      });
    }
  };

};

app.store = new app.MemoryStore(function(){

});

