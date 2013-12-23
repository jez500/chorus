var app = {

  views: {},

  models: {},

  cached: {}, //for caching views and collections

  jsonRpcUrl: 'jsonrpc',


  // variables (settings defaults)
  vars: {
    lastHash: '#',
    defaultImage: 'theme/images/default.png'
  },

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
    "PlaylistItemView",
    "PlaylistCustomListItemView",
    "CustomPlaylistSongView",
    "FilesView",
    "FileView"
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
    "playlist/:id":         "playlist",
    "search/:q":            "search",
    "scan/:type":           "scan",
    "thumbsup":             "thumbsup"
  },


  /**
   * Setup shell (main page layout and controls)
   */
  initialize: function () {

    // create main layout
    app.shellView = new app.ShellView();
    $('body').html(app.shellView.render().el);

    // cache thumbs up
    app.playlists.getThumbsUp();

    this.$content = $("#content");
    this.$title = $('#title');
  },


  /**
   * Homepage
   */
  home: function () { //Not in use atm

    var self = this;
    app.AudioController.getNowPlaying(function(data){

      if(data.status == 'notPlaying'){

        // get a default fanart
        var fa = app.parseImage('', 'fanart');
        $.backstretch(fa);
        self.$content.html('');

      } else {
        // Something is playing
        var fa = app.parseImage(data.item.fanart, 'fanart');
        $.backstretch(fa);

        // render
        app.homelView = new app.HomeView({model:data.item});
        app.homelView.render();
        self.$content.html(app.homelView.el);
      }

      // title
      app.helpers.setTitle('');

      // menu
      app.shellView.selectMenuItem('home', 'no-sidebar');
    });
  },


  /**
   * Do a search
   * @param q
   */
  search: function (q) {

   $('#search').val(q);
   app.shellView.search(q);
  },


  /**
   * A single artist page
   * @param id
   * @param task
   *  defaults to viw
   */
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

        self.$content.html(new app.ArtistView({model: data}).render().el);
        app.helpers.setTitle('<a href="#/artists">Artists</a><b></b>' + data.attributes.artist);
      }
    });

  },


  /**
   * Artists landing page
   */
  artists: function(){

    // menu
    app.shellView.selectMenuItem('artist', 'sidebar');

    // render
    app.artistsView = new app.ArtistsView();
    $('#content').html(app.artistsView.render().el);

    // title
    app.helpers.setTitle('Artists', {addATag:true});
  },


  /**
   * A single album page
   * @param id
   */
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


  /**
   * Albums page
   */
  albums: function(){

    app.shellView.selectMenuItem('album', 'no-sidebar');
    var self = this;
    app.cached.recentlyAddedAlbums = new app.AlbumRecentXbmcCollection();
    app.cached.recentlyAddedAlbums.fetch({"success": function(albums){
      app.cached.recentAlbumsView = new app.SmallAlbumsList({model: albums, className:'album-list-landing'});
      self.$content.html(app.cached.recentAlbumsView.render().el);
      app.helpers.setTitle('Recently Added', {addATag:true});
      //add isotope
      app.helpers.addIsotope('ul.album-list-landing');
    }});

  },

  /**
   * playlist
   * @param type
   */
  playlist: function(id){

    app.cached.playlistCustomListSongCollection = new app.PlaylistCustomListSongCollection();
    app.cached.playlistCustomListSongCollection.fetch({"name":id, "success": function(res){

      // render page
      app.cached.customPlaylistSongListView = new app.CustomPlaylistSongListView({"model":res});
      $('#content').html(app.cached.customPlaylistSongListView.render().el);

      // set title
      var list = app.playlists.getCustomPlaylist(id);
      app.helpers.setTitle('<a href="#playlist/' + list.id + '">' + list.name + '</a>');

      // set menu
      app.shellView.selectMenuItem('playlist', 'no-sidebar');

    }});

  },



  thumbsup: function(){

    var $content = $('#content');

    $content.html('<div id="thumbs-up-page"><div id="tu-albums"></div><div id="tu-songs"></div></div>');

    // set title
    app.helpers.setTitle('<a href="#artists">Artists</a>Thumbs Up');

    // set menu
    app.shellView.selectMenuItem('thumbsup', 'sidebar');

    // Song
    app.cached.thumbsUpCollection = new app.ThumbsUpCollection();
    app.cached.thumbsUpCollection.fetch({"name": 'song', "success": function(res){

      // render
      app.cached.customPlaylistSongListView = new app.CustomPlaylistSongListView({"model":res});
      $('#tu-songs', $content).html(app.cached.customPlaylistSongListView.render().el);

    }});

    // Album
    app.cached.thumbsUpCollection = new app.ThumbsUpCollection();
    app.cached.thumbsUpCollection.fetch({"name": 'album', "success": function(res){

      // render
      app.cached.thumbsupAlbums = new app.SmallAlbumsList({model: res, className: 'album-generic-list'});
      $('#tu-albums', $content).html(app.cached.thumbsupAlbums.render().el);

    }});

    // Artist
    app.cached.thumbsUpCollection = new app.ThumbsUpCollection();
    app.cached.thumbsUpCollection.fetch({"name": 'artist', "success": function(res){

      // add the sidebar view
      app.cached.thumbsupArtists = new app.AristsListView({model: res, className: 'artist-thumbs-up'});
      app.helpers.setFirstSidebarContent(app.cached.thumbsupArtists.render().el);

    }});

  },


  /**
   * Scan for music
   * @param type
   *  audio
   */
  scan: function(type){

    //start music scan
    if(type == 'audio'){
      app.xbmcController.command('AudioLibrary.Scan', {}, function(d){
        app.notification('Started Audio Scan');
      });
    }

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
