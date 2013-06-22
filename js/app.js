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
    "comment",
    "lyrics",
    //"musicbrainztrackid",
    //"musicbrainzartistid",
    //"musicbrainzalbumid",
    //"musicbrainzalbumartistid",
    "playcount",
    "fanart",
    "thumbnail",
    "file",
    "albumid",
    "lastplayed",
    "disc",
    "genreid",
    "artistid",
    "displayartist",
    "albumartistid"],

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
    "AlbumArtistView"
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
    "albums":               "albums"
  },

  initialize: function () {
    app.shellView = new app.ShellView();
    $('body').html(app.shellView.render().el);
    // Close the search dropdown on click anywhere in the UI
    $('body').click(function () {
      $('.dropdown').removeClass("open");
    });
    this.$content = $("#content");
    this.$sidebarFirst = $('#sidebar-first');
    this.$sidebarSecond = $('#sidebar-second');
    this.$mainContent = $('#main-content');
    this.$title = $('#title');
  },

  home: function () {
    // Since the home view never changes, we instantiate it and render it only once
    if (!app.homelView) {
      app.homelView = new app.HomeView();
      app.homelView.render();
    } else {
      console.log('reusing home view');
      app.homelView.delegateEvents(); // delegate events when the view is recycled
    }
    this.$content.html(app.homelView.el);

    this.$content.append();
    this.$title.html('Home');
    app.shellView.selectMenuItem('home-menu');
  },

  contact: function () {
    if (!app.contactView) {
      app.contactView = new app.ContactView();
      app.contactView.render();
    }
    this.$content.html(app.contactView.el);
    app.shellView.selectMenuItem('contact-menu');
  },


  artist: function (id, task) {
    if(typeof task == "undefined"){
      task = 'view';
    }
    console.log(task);
    app.store.libraryCall(function(){
      // load the artists view first
      if (!app.artistsView) {
        app.artistsView = new app.ArtistsView();
        app.artistsView.render();
      }
      // only load if not already rendered
      if($('.artist-view').length == 0){
        $('#content').html(app.artistsView.el);
      }

      var artist = new app.Artist({"id": parseInt(id), "fields":app.artistFields}),
          self = this;

      artist.fetch({
        success: function (data) {
          console.log(data);
          $('#main-content').html(new app.ArtistView({model: data}).render().el);
          $('#title').html('<a href="#/artists">Artists</a><b></b>' + data.attributes.artist);
        }
      });
    }, 'artistsReady');
    //app.shellView.selectMenuItem();
  },



  album: function (id) {

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
    var self = this;
    app.cached.recentlyAddedAlbums = new app.AlbumRecentXbmcCollection();
    app.cached.recentlyAddedAlbums.fetch({"success": function(albums){
      app.cached.recentAlbumsView = new app.SmallAlbumsList({model: albums, className:'album-list-landing'});
      self.$content.html(app.cached.recentAlbumsView.render().el);
      self.$title.html('Recently Added');
      //add isotope
      app.helpers.addIsotope('ul.album-list-landing');
    }});
  },


  //artists page
  artists: function(){

    //load library first
    app.store.libraryCall(function(){

      //cache
      if (!app.artistsView) {
        app.artistsView = new app.ArtistsView();
        //app.artistsView.render();
      }
      console.log(app.artistsView.el);
      $('#content').html(app.artistsView.render().el);
      //this.$sidebarFirst.html(app.artistsView.sideBar);
      $('#title').html('Artists');
      app.shellView.selectMenuItem('artists');

    },'artistsReady');
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
    console.log(app.stores);
    $('body').addClass('audio-library-ready');
    app.notification('Library loaded');
  },'songsReady');

});
