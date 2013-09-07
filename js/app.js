var app = {

  views: {},

  models: {},

  cached: {}, //for caching views and collections

  jsonRpcUrl: 'jsonrpc',

  // fields to grab from xbmc
  artistFields: [
    "instrument",
    "style",
    "mood",
    "born",
    "formed",
    "description",
    "genre",
    "died",
    "disbanded",
    "yearsactive",
    "musicbrainzartistid",
    "fanart",
    "thumbnail"
],
  albumFields: [
    "title",
    "description",
    "artist",
    "genre",
    "theme",
    "mood",
    "style",
    "type",
    "albumlabel",
    "rating",
    "year",
    //"musicbrainzalbumid",
    //"musicbrainzalbumartistid",
    "fanart",
    "thumbnail",
    "playcount",
    "genreid",
    "artistid",
    "displayartist"
  ],
  songFields: ["title",
    "artist",
    "albumartist",
    "genre",
    "year",
    "rating",
    "album",
    "track",
    "duration",
    //"comment",
    //"lyrics",
    //"musicbrainztrackid",
    //"musicbrainzartistid",
    //"musicbrainzalbumid",
    //"musicbrainzalbumartistid",
    "playcount",
    //"fanart",
    "thumbnail",
    "file",
    "albumid",
    "lastplayed",
    "disc",
    "genreid",
    "artistid",
    "displayartist",
    "albumartistid"
  ],

  // filters
  albumFilters: [],
  songFilters: [],

  // html templates
  templates: [
    "HomeView",
    "ContactView",
    "ShellView",
    "ArtistView",
    "ArtistSummaryView",
    "ArtistListItemView",
    "ArtistsView",
    "AlbumView",
    "AlbumItemView",
    "SongView",
    "AristsRandView",
    "ArtistLargeItemView",
    "SmallAlbumItemView",
    "AlbumArtistView",
    "PlaylistItemView"
  ]
};



app.Router = Backbone.Router.extend({

  routes: {
    "":                     "home",
    "contact":              "contact",
    "artist/:id":           "artist",
    "artist/:id/:task":     "artist",
    "artists":              "artists",
    "album/:id":            "album",
    "albums":               "albums",
    "search/:q":            "search"
  },

  initialize: function () {
    app.shellView = new app.ShellView();
    $('body').html(app.shellView.render().el);

    this.$content = $("#content");
    this.$title = $('#title');

  },

  home: function () { //Not in use atm

    var self = this;
    app.AudioController.getNowPlaying(function(data){
      // if something is playing, try and find some meta
      console.log(data);
      this.$bs = $.backstretch(app.parseImage(data.item.fanart));

      app.homelView = new app.HomeView({model:data.item});
      app.homelView.render();

      self.$content.html(app.homelView.el);
      self.$title.html('');
      app.shellView.selectMenuItem('home', 'no-sidebar');

    });

  },

  search: function (q) {
   $('#search').val(q);
   app.shellView.search(q);
  },


  artist: function (id, task) {

    app.shellView.selectMenuItem('artist', 'sidebar');

    if(typeof task == "undefined"){
      task = 'view';
    }

    app.artistsView = new app.ArtistsView();
    app.artistsView.render();

    var artist = new app.Artist({"id": parseInt(id), "fields":app.artistFields}),
          self = this;

    artist.fetch({
      success: function (data) {
        console.log(data);
        self.$content.html(new app.ArtistView({model: data}).render().el);
        self.$title.html('<a href="#/artists">Artists</a><b></b>' + data.attributes.artist);
      }
    });

  },


  //artists page
  artists: function(){
    app.shellView.selectMenuItem('artist', 'sidebar');

    // render
    app.artistsView = new app.ArtistsView();
    $('#content').html(app.artistsView.render().el);

    $('#title').html('Artists');


  },



  album: function (id) {
    app.shellView.selectMenuItem('album', 'sidebar');
    // get album
    var model = {'attributes': {"albumid" : id}};
    app.cached.albumView = new app.AlbumView({"model": model, "type":"album"});

    // only render if not on album page already
    if($('.album-page').length == 0){
    $('#content').html(app.cached.albumView.render().el);
    } else {
      //just call render, don't update content
      app.cached.albumView.render();
    }


  },


  albums: function(){
    app.shellView.selectMenuItem('album', 'no-sidebar');
    var self = this;
    app.cached.recentlyAddedAlbums = new app.AlbumRecentXbmcCollection();
    app.cached.recentlyAddedAlbums.fetch({"success": function(albums){
      app.cached.recentAlbumsView = new app.SmallAlbumsList({model: albums, className:'album-list-landing'});
      self.$content.html(app.cached.recentAlbumsView.render().el);
      self.$title.html('Recently Added');
      //add isotope
      app.helpers.addIsotope('ul.album-list-landing');
    }});
  }



});

//DOM Ready
$(document).on("ready", function () {
  app.loadTemplates(app.templates,
    function () {
      app.router = new app.Router();
      Backbone.history.start();
    });

  app.store.libraryCall(function(){
    $('body').addClass('artists-ready');
    app.notification('Artists loaded');
  },'artistsReady');


  app.store.libraryCall(function(){
    console.log('loaded stores:', app.stores);
    $('body').addClass('audio-library-ready');
    app.notification('Library loaded');
  },'songsReady');

});
