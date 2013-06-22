

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
          console.log(data);
          options.success(data);
        });
      }
    }
  }

});


/* a single album and its songs */
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


/* a single album and its songs */
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




app.SongCollection = Backbone.Collection.extend({
  model: app.Song,

  sync: function(method, model, options) {
    if (method === "read") {
      console.log(model,options);
      options.success(options.songs);
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

    //get all songs
    this.allSongs = new app.SongXbmcCollection();
    this.allXbmcArtists = new app.ArtistXbmcCollection();
    this.allXbmcAlbums = new app.AlbumXbmcCollection();

    // fetch all artists
    this.allXbmcArtists.fetch({"success": function(artists){

      // assign to memory
      app.stores.allArtists = artists;

      self.msg = 'artists ready';
      $(window).trigger('artistsReady');

    }});

    // fetch all songs
    this.allXbmcAlbums.fetch({"success": function(albums){

      // assign to memory
      app.stores.allAlbums = albums;

      self.msg = 'albums ready';
      $(window).trigger('albumsReady');

    }});

    // fetch all songs (slowest part)
    this.allSongs.fetch({"success": function(data){
      console.log('songs fetched', data);
      // assign to store
      self.parseAudio(data.models);

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

  this.allArtists = function(callback){
    // get the collection
      var collection = app.stores.allArtists;
      callLater(callback, collection);
    return collection;

  };

  this.allAlbums = function(callback){
    // get the collection
    var collection = app.stores.allAlbums;
    callLater(callback, collection);
    return collection;

  };

  /**
   * Get 20 random artists with artwork
   * @param callback
   */
  this.randomArtists = function(callback){

    // get a random collection
    var data = this.allArtists(),
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
  };

  this.getArtist = function(id, callback){
    var self = this;
    // get the collection
    $.each(app.stores.allArtists.models, function(i,data){
      if(typeof data.attributes != "undefined" && data.attributes.artistid == id){
        callLater(callback,  data);

      }
    });
  };

  /*
   * Grab artist songs and parse them into albums
   * Will attempt to pull from cache first
   */
  this.getAlbums = function(id, type, callback){
    var data = {}, albums = [], self = this, key = type + id, filter = type + 'id', plural = type + 's';
    console.log(id);
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
      console.log(data);
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

      // default albums
/*      if(typeof app.stores.albums[albumkey] == "undefined"){
        app.stores.albums[albumkey] = songsDefault;
      }*/

      // default songs
      if(typeof app.stores.songs[artistkey] == "undefined"){
        app.stores.songs[artistkey] = songsDefault;
      }

      // default artists get more parsing
      if(typeof app.stores.artists[artistkey] == "undefined"){
        app.stores.artists[artistkey] = songsDefault;        
      }


/*      // parse into albums
      if(typeof app.stores.artists[artistkey].albumsitems[albumkey] == "undefined"){
        app.stores.artists[artistkey].albumsitems[albumkey] = {};

        //populate album info from first item
        var fields = ['album', 'albumid', 'thumbnail', 'artist', 'artistid'];
        $.each(fields, function(b, field){
          if($.isArray(item[field])){
            item[field] = item[field][0];
          }
          app.stores.artists[artistkey].albumsitems[albumkey][field] = item[field];
        });

        //setup for songlist
        app.stores.artists[artistkey].albumsitems[albumkey].songs = [];
      }*/


      // default genres
      if(typeof app.stores.genres[genrekey] == "undefined"){
        app.stores.genres[genrekey] = songsDefault;
      }

/*      //add item to all respective areas
      if(typeof app.stores.artists[artistkey].albumsitems[albumkey] != "undefined"){
        app.stores.artists[artistkey].albumsitems[albumkey].songs.push(data);
      }*/

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







  /*
  this.allArtists = function(callback){
    callLater(callback, this.employees);
  };

  this.findByName = function (searchKey, callback) {

    var employees = this.employees.filter(function (element) {
      var fullName = element.firstName + " " + element.lastName;
      return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;

    });
    //var employees = this.employees;
    callLater(callback, employees);
  }

  this.findByManager = function (managerId, callback) {
    var employees = this.employees.filter(function (element) {
      return managerId === element.managerId;
    });
    callLater(callback, employees);
  }

  this.findById = function (id, callback) {
    var employees = this.employees;
    var employee = null;
    var l = employees.length;
    for (var i = 0; i < l; i++) {
      if (employees[i].id === id) {
        employee = employees[i];
        break;
      }
    }
    callLater(callback, employee);
  }



  this.employees = [
    {"id": 1, "firstName": "James", "lastName": "King", "managerId": 0, managerName: "", "title": "President and CEO", "department": "Corporate", "cellPhone": "617-000-0001", "officePhone": "781-000-0001", "email": "jking@fakemail.com", "city": "Boston, MA", "pic": "james_king.jpg", "twitterId": "@fakejking", "blog": "http://coenraets.org"},
    {"id": 2, "firstName": "Julie", "lastName": "Taylor", "managerId": 1, managerName: "James King", "title": "VP of Marketing", "department": "Marketing", "cellPhone": "617-000-0002", "officePhone": "781-000-0002", "email": "jtaylor@fakemail.com", "city": "Boston, MA", "pic": "julie_taylor.jpg", "twitterId": "@fakejtaylor", "blog": "http://coenraets.org"},
    {"id": 3, "firstName": "Eugene", "lastName": "Lee", "managerId": 1, managerName: "James King", "title": "CFO", "department": "Accounting", "cellPhone": "617-000-0003", "officePhone": "781-000-0003", "email": "elee@fakemail.com", "city": "Boston, MA", "pic": "eugene_lee.jpg", "twitterId": "@fakeelee", "blog": "http://coenraets.org"},
    {"id": 4, "firstName": "John", "lastName": "Williams", "managerId": 1, managerName: "James King", "title": "VP of Engineering", "department": "Engineering", "cellPhone": "617-000-0004", "officePhone": "781-000-0004", "email": "jwilliams@fakemail.com", "city": "Boston, MA", "pic": "john_williams.jpg", "twitterId": "@fakejwilliams", "blog": "http://coenraets.org"},
    {"id": 5, "firstName": "Ray", "lastName": "Moore", "managerId": 1, managerName: "James King", "title": "VP of Sales", "department": "Sales", "cellPhone": "617-000-0005", "officePhone": "781-000-0005", "email": "rmoore@fakemail.com", "city": "Boston, MA", "pic": "ray_moore.jpg", "twitterId": "@fakermoore", "blog": "http://coenraets.org"},
    {"id": 6, "firstName": "Paul", "lastName": "Jones", "managerId": 4, managerName: "John Williams", "title": "QA Manager", "department": "Engineering", "cellPhone": "617-000-0006", "officePhone": "781-000-0006", "email": "pjones@fakemail.com", "city": "Boston, MA", "pic": "paul_jones.jpg", "twitterId": "@fakepjones", "blog": "http://coenraets.org"},
    {"id": 7, "firstName": "Paula", "lastName": "Gates", "managerId": 4, managerName: "John Williams", "title": "Software Architect", "department": "Engineering", "cellPhone": "617-000-0007", "officePhone": "781-000-0007", "email": "pgates@fakemail.com", "city": "Boston, MA", "pic": "paula_gates.jpg", "twitterId": "@fakepgates", "blog": "http://coenraets.org"},
    {"id": 8, "firstName": "Lisa", "lastName": "Wong", "managerId": 2, managerName: "Julie Taylor", "title": "Marketing Manager", "department": "Marketing", "cellPhone": "617-000-0008", "officePhone": "781-000-0008", "email": "lwong@fakemail.com", "city": "Boston, MA", "pic": "lisa_wong.jpg", "twitterId": "@fakelwong", "blog": "http://coenraets.org"},
    {"id": 9, "firstName": "Gary", "lastName": "Donovan", "managerId": 2, managerName: "Julie Taylor", "title": "Marketing Manager", "department": "Marketing", "cellPhone": "617-000-0009", "officePhone": "781-000-0009", "email": "gdonovan@fakemail.com", "city": "Boston, MA", "pic": "gary_donovan.jpg", "twitterId": "@fakegdonovan", "blog": "http://coenraets.org"},
    {"id": 10, "firstName": "Kathleen", "lastName": "Byrne", "managerId": 5, managerName: "Ray Moore", "title": "Sales Representative", "department": "Sales", "cellPhone": "617-000-0010", "officePhone": "781-000-0010", "email": "kbyrne@fakemail.com", "city": "Boston, MA", "pic": "kathleen_byrne.jpg", "twitterId": "@fakekbyrne", "blog": "http://coenraets.org"},
    {"id": 11, "firstName": "Amy", "lastName": "Jones", "managerId": 5, managerName: "Ray Moore", "title": "Sales Representative", "department": "Sales", "cellPhone": "617-000-0011", "officePhone": "781-000-0011", "email": "ajones@fakemail.com", "city": "Boston, MA", "pic": "amy_jones.jpg", "twitterId": "@fakeajones", "blog": "http://coenraets.org"},
    {"id": 12, "firstName": "Steven", "lastName": "Wells", "managerId": 4, managerName: "John Williams", "title": "Software Architect", "department": "Engineering", "cellPhone": "617-000-0012", "officePhone": "781-000-0012", "email": "swells@fakemail.com", "city": "Boston, MA", "pic": "steven_wells.jpg", "twitterId": "@fakeswells", "blog": "http://coenraets.org"}
  ];

  callLater(successCallback);
  */
}

app.store = new app.MemoryStore(function(){


});

