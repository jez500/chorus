var app = {

  views: {},

  models: {},

  cached: {}, //for caching views and collections

  counts: {503: 0, '503total': 0}, // count defaults

  state: 'notconnected', // Not connected yet

  jsonRpcUrl: '/jsonrpc', // JsonRPC endpoint

  itemsPerPage: 50, // Our default pagination amount

  nextPageLoading: false,

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
    "fanart",
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
  movieFields: [
    "title",
    "genre",
    "year",
    "rating",
    "director",
    "trailer",
    "tagline",
    "plot",
    "plotoutline",
    "originaltitle",
    "lastplayed",
    "playcount",
    "writer",
    "studio",
    "mpaa",
    "cast",
    "country",
    "imdbnumber",
    "runtime",
    "set",
    "showlink",
    "streamdetails",
    "top250",
    "votes",
    "fanart",
    "thumbnail",
    "file",
    "sorttitle",
    "resume",
    "setid",
    "dateadded",
    "tag",
    "art"
  ],

  fileFields: [
    'title', 'size', 'mimetype', 'file', 'dateadded', 'thumbnail', 'artistid', 'albumid', 'uniqueid'
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
    "AlbumItemSmallView",
    "AlbumArtistView",
    "PlaylistItemView",
    "PlaylistCustomListItemView",
    "CustomPlaylistSongView",
    "FilesView",
    "FileView",
    "MovieListItemView",
    "MovieView"
  ],

  tpl: {} // for templates that are lazy loaded

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
    "thumbsup":             "thumbsup",
    "files":                "files",
    "movies/page/:num":     "movies",
    "movies/genre/:genre":  "moviesGenre",
    "movies":               "moviesLanding",
    "movie/:id":            "movie",
    "xbmc/:op":             "xbmc"
  },


  /**
   * Setup shell (main page layout and controls)
   */
  initialize: function () {

    // create main layout
    app.shellView = new app.ShellView();
    $('body').html(app.shellView.render().el);

    // Let all that depends on shell being rendered hook in
    $(window).trigger('shellReady');

    // Set content area to var
    this.$content = $("#content");

  },


  /**
   * Homepage
   */
  home: function () { //Not in use atm

    var backstretchImage = '';

    // empty content
    this.$content.html('');

    // title
    app.helpers.setTitle('');

    // menu
    app.shellView.selectMenuItem('home', 'no-sidebar');

    // get now playing
    app.AudioController.getNowPlayingSong(function(data){

      if(app.audioStreaming.getPlayer() == 'local'){
        // get the local playing item
        var browserPlaying = app.audioStreaming.getNowPlayingSong();
        backstretchImage = (browserPlaying.fanart === undefined ? '' : browserPlaying.fanart);
      } else {
        // xbmc playing image
        backstretchImage = (data.item.fanart === undefined ? '' : data.item.fanart);
      }

      // Add Backstretch if image
      if($('.backstretch').length === 0){
        var fa = app.parseImage(backstretchImage, 'fanart');
        $.backstretch(fa);
      }

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

        // set menu
        app.shellView.selectMenuItem('artists', 'sidebar');
      }
    });

  },


  /**
   * Artists landing page
   */
  artists: function(){

    // render
    var $el = $('<div class="landing-page"></div>');
    app.artistsView = new app.ArtistsView();
    $el.html(app.artistsView.render().el);
    $('#content').html($el);

    // title
    app.helpers.setTitle('Artists', {addATag:"#artists"});

    // set menu
    app.shellView.selectMenuItem('artists', 'sidebar');
  },


  /**
   * A single album page
   * @param id
   */
  album: function (id) {

    // get album
    var model = {'attributes': {"albumid" : id}};
    app.cached.albumView = new app.AlbumView({"model": model, "type":"album"});

    // only render if not on album page already
    if($('.album-page').length === 0){
    $('#content').html(app.cached.albumView.render().el);
    } else {
      //just call render, don't update content
      app.cached.albumView.render();
    }

    // set menu
    app.shellView.selectMenuItem('albums', 'sidebar');

  },


  /**
   * Albums page
   *
   * @TODO abstract elsewhere
   */
  albums: function(){

    app.shellView.selectMenuItem('album', 'no-sidebar');
    var self = this;

    $('#content').html('<div class="loading-box">Loading Albums</div>');

    // first get recently added
    app.cached.recentlyAddedAlbums = new app.AlbumRecentlyAddedXbmcCollection();
    app.cached.recentlyAddedAlbums.fetch({"success": function(albumsAdded){

      // then get recently played
      app.cached.recentlyPlayedAlbums = new app.AlbumRecentlyPlayedXbmcCollection();
      app.cached.recentlyPlayedAlbums.fetch({"success": function(albumsPlayed){

        // mush them together
        var allAlbums = albumsPlayed.models,
          used = {},
          $el = $('<div class="landing-page"></div>');

        // prevent dupes
        _.each(allAlbums, function(r){
          used[r.attributes.albumid] = true;
        });
        // add played
        _.each(albumsAdded.models, function(r){
          if(!used[r.attributes.albumid]){
            allAlbums.push(r);
          }
        });

        // randomise
        allAlbums = app.helpers.shuffle(allAlbums);

        // add back to models
        albumsAdded.models = allAlbums;
        albumsAdded.length = allAlbums.length;
        // cache for later
        app.cached.recentlAlbums = albumsAdded;

        // render
        app.cached.recentAlbumsView = new app.SmallAlbumsList({model: albumsAdded, className:'album-list-landing'});
        $el.html(app.cached.recentAlbumsView.render().el);
        self.$content.html($el);

        // set title
        app.helpers.setTitle('Recent', {addATag:"#albums"});

        // set menu
        app.shellView.selectMenuItem('albums', 'no-sidebar');

        // add isotope (disabled)
        app.helpers.addFreewall('ul.album-list-landing');

      }});



    }});

  },

  /**
   * Files page
   */
  files: function(){


    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({"name":'sources', "success": function(sources){

      app.cached.fileAddonCollection = new app.FileCollection();
      app.cached.fileAddonCollection.fetch({"name":'addons', "success": function(addons){

        // set menu
        app.shellView.selectMenuItem('files', 'sidebar');

        // render page
        app.cached.filesView = new app.FilesView({"model":sources});
        var el = app.cached.filesView.render().$el;

        // append addons
        app.cached.filesAddonsView = new app.FilesView({"model":addons});
        if(addons.length > 0){
          el.append('<h3 class="sidebar-title">Addons</h3>');
          el.append(app.cached.filesAddonsView.render().$el);
        }


        app.helpers.setFirstSidebarContent(el);

        app.helpers.setTitle('<a href="#files">Files</a><span id="folder-name"></span>');

      }});

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

    var $content = $('#content'),
      $sidebar = app.helpers.getFirstSidebarContent();

    // so we get things in the correct order, we have lots of sub wrappers for the different lists
    $content.html('<div id="thumbs-up-page"><div id="tu-songs"></div></div>');
    app.helpers.setFirstSidebarContent('<div id="tu-artists"></div><div id="tu-albums"></div>');

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

    // Artist
    app.cached.thumbsUpCollection = new app.ThumbsUpCollection();
    app.cached.thumbsUpCollection.fetch({"name": 'artist', "success": function(res){

      // add the sidebar view
      app.cached.thumbsupArtists = new app.AristsListView({model: res, className: 'artist-thumbs-up'});
      $('#tu-artists',$sidebar).html(app.cached.thumbsupArtists.render().el);
      app.helpers.firstSidebarBinds();
    }});

    // Album
    app.cached.thumbsUpCollection = new app.ThumbsUpCollection();
    app.cached.thumbsUpCollection.fetch({"name": 'album', "success": function(res){

      // render
      app.cached.thumbsupAlbums = new app.SmallAlbumsList({model: res});
      $('#tu-albums',$sidebar).html(app.cached.thumbsupAlbums.render().el)
        .prepend('<h2 class="sidebar-title"><a href="#albums">Albums</a></h2>');
      app.helpers.firstSidebarBinds();
    }});
  },




  /**
   * Browse all movies
   * uses lazyload, infinite scroll and intelligent back button
   *
   */
  movies: function(num){

    // vars
    var $content = $('#content'),
      $results = $('ul.movie-list',$content),
      fullRange = false,
      scrolled = false,
      self = this,
      page = 'page';

    // init pager
    if($results.length === 0){
      // empty page
      if(num === 0){
        app.moviePageNum = 0;
      }
      // Loading
      $content.html('<div class="loading-box">Loading Movies</div>');
      // set title and add some tabs
      app.helpers.setTitle('All Movies', { addATag:'#movies/page/0', tabs: {'#movies': 'Recently Added'}, activeTab: 1});
      // set menu
      app.shellView.selectMenuItem('movies', 'no-sidebar');
      // direct to this page
      if(page && num){
        app.moviePageNum = num;
        fullRange = true;
      }
    } else {
      // appending to page no other setup required
      app.moviePageNum++;
      // force a page via url
      if(num !== undefined){
        app.moviePageNum = num;
      }
    }

    // init the collection
    app.cached.movieCollection = new app.MovieCollection();
    // fetch results
    app.cached.movieCollection.fetch({"fullRange": fullRange, "success": function(collection){
      // get the view of results
      collection.showNext = true;
      app.cached.movieListView = new app.MovieListView({model: collection});
      // do we append or replace
      if(app.moviePageNum === 0 || fullRange === true){
        $content.html(app.cached.movieListView.render().$el);

        // scroll to top
        $(window).scrollTo(0);

        // back from a movie, scrollto that movie
        if(fullRange === true && typeof app.vars.backHash != 'undefined'){
          var parts = app.vars.backHash.split('/');
          if(parts[0] == '#movie'){
            $(window).scrollTo( $('.movie-row-' + parts[1]) , 0, {offset: -200});
            scrolled = true;
          }
        }

        // scroll to page number
        if(fullRange === true && scrolled !== true && app.moviePageNum > 1){
          $(window).scrollTo( '85%' );
        }

        app.helpers.triggerContentLazy();

      } else {
        // if last page was empty, don't change hash
        // or render
        var $lastList = $('.video-list').last();
        if($lastList.find('li').length === 0){
          // dont render
          $lastList.remove();
        } else {
          // chnage the hash without triggering the router (for back action)
          app.router.navigate('movies/page/' + app.moviePageNum);
          // append new content
          $content.append(app.cached.movieListView.render().$el);
        }

      }

      app.helpers.triggerContentLazy();


    }}); // end get collection

  },


  /**
   * Movie landing page
   */
  moviesLanding: function () {

    var self = this;
    app.helpers.setTitle('Recently Added', { addATag:'#movies', tabs: {'#movies/page/0' : 'Browse All'}, activeTab: 1});

    // loading
    self.$content.html('<div class="loading-box">Loading Movies</div>');

    // get recent collection
    app.movieRecentCollection = new app.MovieRecentCollection();
    app.movieRecentCollection.fetch({"success": function(collection){

      app.cached.movieListView = new app.MovieListView({model: collection});
      // render
      self.$content.html(app.cached.movieListView.render().$el);
      // no pagination
      self.$content.find('.next-page').remove();
      // change class
      self.$content.find('ul').removeClass('movie-list').addClass('movie-recent-list');
      // set menu
      app.shellView.selectMenuItem('movies', 'no-sidebar');
      // lazyload
      app.helpers.triggerContentLazy();
      // scroll to top
      $(window).scrollTo(0);
    }});

  },



  /**
   * Movie landing page
   */
  moviesGenre: function (genre) {
    console.log(genre);

    var self = this;
    app.helpers.setTitle(genre, {
      addATag:'#movies/genre/' + genre,
      tabs: {'#movies/page/0' : 'Browse All', '#movies' : 'Recent'}

    });

    // loading
    self.$content.html('<div class="loading-box">Loading Movies</div>');

    // get recent collection
    app.movieFitleredCollection = new app.MovieFitleredCollection();
    app.movieFitleredCollection.fetch({"filter" : {'genre': genre}, "success": function(collection){

      app.cached.movieListView = new app.MovieListView({model: collection});
      // render
      self.$content.html(app.cached.movieListView.render().$el);
      // no pagination
      self.$content.find('.next-page').remove();
      // change class
      self.$content.find('ul').removeClass('movie-list').addClass('movie-genre-list');
      // set menu
      app.shellView.selectMenuItem('movies', 'no-sidebar');
      // lazyload
      app.helpers.triggerContentLazy();
      // scroll to top
      $(window).scrollTo(0);
    }});

  },


  /**
   * A single movie
   * @param id
   */
  movie: function (id) {

    var movie = new app.Movie({"id": parseInt(id)}),
      self = this;

    self.$content.html('<div class="loading-box">Loading Movie</div>');

    movie.fetch({
      success: function (data) {
        // render content
        self.$content.html(new app.MovieView({model: data}).render().el);
        app.helpers.setTitle( data.attributes.title + ' <span>' + data.attributes.year + '</span>');

        // set menu
        app.shellView.selectMenuItem('movie', 'sidebar');
      }
    });

  },







  /**
   * Scan for music
   *
   * @TODO remove from router, and bind to click instead
   *
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

  },


  /**
   * Used mainly for dev and stats, see xbmc view
   * @param op
   */
  xbmc: function(op){

    app.cached.xbmcView = new app.XbmcView({model: op});
    $('#content').html(app.cached.xbmcView.render().$el);

    // set title
    app.helpers.setTitle('<a href="#xbmc/home">XBMC</a>');

    // set menu
    app.shellView.selectMenuItem('xbmc', 'no-sidebar');
  }



});

//DOM Ready
$(document).on("ready", function () {

  app.helpers.loadTemplates(app.templates,
    function () {
      app.router = new app.Router();
      Backbone.history.start();
  });

  app.store.libraryCall(function(){
    $('body').addClass('artists-ready');
    app.notification('Artists loaded');
  },'artistsReady');


  app.store.libraryCall(function(){
    $('body').addClass('audio-library-ready');
    app.notification('Library loaded');
  },'songsReady');

});
