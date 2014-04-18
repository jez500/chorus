var app = {

  views: {},

  models: {},

  cached: {}, // for caching views and collections

  counts: {503: 0, '503total': 0}, // count defaults

  state: 'notconnected', // Not connected yet

  jsonRpcUrl: '/jsonrpc', // JsonRPC endpoint

  itemsPerPage: 60, // Our default pagination amount

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

  tvshowFields: [
    "title",
    "genre",
    "year",
    "rating",
    "plot",
    "studio",
    "mpaa",
    "cast",
    "playcount",
    "episode",
    "imdbnumber",
    "premiered",
    "votes",
    "lastplayed",
   // "fanart",
    "thumbnail",
    "file",
    "originaltitle",
    "sorttitle",
    "episodeguide",
    "season",
    "watchedepisodes",
    "dateadded",
    "tag",
    "art"
  ],

  tvepisodeFields: [
    "title",
    "plot",
    "votes",
    "rating",
    "writer",
    "firstaired",
    "playcount",
    "runtime",
    "director",
    "productioncode",
    "season",
    "episode",
    "originaltitle",
    "showtitle",
    "cast",
    "streamdetails",
    "lastplayed",
    "fanart",
    "thumbnail",
    "file",
    "resume",
    "tvshowid",
    "dateadded",
    "uniqueid",
    "art"
  ],

  tvseasonFields: [
    "season",
    "showtitle",
    "playcount",
    "episode",
    "fanart",
    "thumbnail",
    "tvshowid",
    "watchedepisodes",
    "art"
  ],

  fileFields: [
    'title', 'size', 'mimetype', 'file', 'dateadded', 'thumbnail', 'artistid', 'albumid', 'uniqueid'
  ],

  playlistItemFields: [
    "title",
    "artist",
    "albumartist",
    "genre",
    "year",
    "rating",
    "album",
    "track",
    "duration",
    "playcount",
    "director",
    "tagline",
    "plotoutline",
    "originaltitle",
    "lastplayed",
    "mpaa",
    "cast",
    "country",
    "imdbnumber",
    "premiered",
    "runtime",
    "showlink",
    "streamdetails",
    "votes",
    "firstaired",
    "season",
    "episode",
    "showtitle",
    "thumbnail",
    "fanart",
    "file",
    "resume",
    "artistid",
    "albumid",
    "tvshowid",
    "setid",
    "watchedepisodes",
    "disc",
    "tag",
    "art",
    "genreid",
    "displayartist",
    "albumartistid",
    "description",
    "theme",
    "mood",
    "style",
    "albumlabel",
    "sorttitle",
    "uniqueid",
    "dateadded",
    "channel",
    "channeltype",
    "hidden",
    "locked",
    "channelnumber",
    "starttime",
    "endtime"
  ],

  channelFields: [
    "thumbnail",
    "channeltype",
    "hidden",
    "locked",
    "channel",
    "lastplayed"
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
    "MovieView",
    "TvshowListItemView",
    "TvSeasonListItemView",
    "TvshowView",
    "RemoteView",
    "PvrChannelListItem"
  ],

  tpl: {} // for templates that are lazy loaded

};



app.Router = Backbone.Router.extend({

  routes: {
    "":                         "home",
    "contact":                  "contact",
    "artist/:id":               "artist",
    "artist/:id/:task":         "artist",
    "artists":                  "artists",
    "album/:id":                "album",
    "music/radio":              "pvr",
    "albums":                   "music",
    "mymusic":                  "music",
    "music/:page":              "music",
    "music/:page/:id":          "music",
    "playlist/:id":             "playlist",
    "search/:q":                "search",
    "search":                   "searchLanding",
    "scan/:type":               "scan",
    "thumbsup":                 "thumbsup",
    "files":                    "files",
    "movies/page/:num/:sort":   "moviesPage",
    "movies/:tag/:id":          "moviesTag",
    "movie-genre/:tag":         "movieGenre", // wrapper for moivesTag
    "movies/:tag":              "moviesTag",
    "movies":                   "moviesLanding",
    "mymovies":                 "moviesLanding",
    "movie/:id":                "movie",
    "tvshows/page/:num/:sort":  "tvshows",
    "tvshows":                  "tvshowsLanding",
    "tv/live":                  "pvr",
    "mytv":                     "tvshowsLanding",
    "tvshows/:tag/:id":         "tvshowTag",
    "tvshows/:tag":             "tvshowTag",
    "tvshow/:id":               "tvshow",
    "tvshow/:tvid/:seas":       "season",
    "tvshow/:tv/:s/:e":         "episode",
    "xbmc/:op":                 "xbmc",
    "remote":                   "remoteControl",
    "playlists":                "playlists"
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

    var backstretchImage = '',
      data = app.playlists.getNowPlaying();

    // empty content
    this.$content.html('');

    // title
    app.helpers.setTitle('');

    // menu
    app.shellView.selectMenuItem('home', 'no-sidebar');

    // get fanart based on player
    if(app.audioStreaming.getPlayer() == 'local'){
      // get the local playing item
      var browserPlaying = app.audioStreaming.getNowPlayingSong();
      backstretchImage = (browserPlaying.fanart === undefined ? '' : browserPlaying.fanart);
    } else {
      // xbmc playing image
      backstretchImage = (data === undefined || data.item === undefined || data.item.fanart === undefined ? '' : data.item.fanart);
    }

    // Add Backstretch it doesnt exist
    if($('.backstretch').length === 0){
      // on initial page load this will be empty but if playing, state will be updated onPlay
      var fa = app.image.url(backstretchImage, 'fanart');
      $.backstretch(fa);
    }

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
   * Start Search
   * @param q
   */
  searchLanding: function (q) {
    this.$content.html('<div class="loading-box">Type to search</div>');
    app.shellView.selectMenuItem('search', 'no-sidebar');
    $('#search').focus();
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

    this.$content.html('<div class="loading-box">Loading Artist</div>');

    app.artistsView = new app.ArtistsView();
    app.artistsView.render();

    var artist = new app.Artist({"id": parseInt(id), "fields":app.artistFields}),
          self = this;

    artist.fetch({
      success: function (data) {

        self.$content.html(new app.ArtistView({model: data}).render().el);
        app.helpers.setTitle('Artists', {addATag: '#artists', icon: 'microphone', subTitle: data.attributes.artist});

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
    app.helpers.setTitle('Artists', {addATag: '#artists', icon: 'microphone'});

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
   * Music Pages
   * @param page
   */
  music: function(page, id){

    if(page === undefined){
      page = 'recent';
    }

    // view vars
    var m = {page: page};
    if(id !== undefined){
      m.id = id;
    } else {
      this.$content.html('<div class="loading-box">Loading Music</div>');
      app.helpers.setFirstSidebarContent('');
    }
    // Set page state
    app.helpers.setTitle('Music', {addATag:"#mymusic"});
    app.shellView.selectMenuItem('music', 'sidebar');

    // menu
    app.filters.renderFilters('music');
    $('.music-filters').addClass('active-' + page);


    // pass the page to musicView to do rendering
    app.cached.musicView = new app.MusicView({model: m});
    app.cached.musicView.render();

  },


  /**
   * Files page
   */
  files: function(){

    // Get collection and Sources
    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({'name': 'sources', 'success': function(sources){

      // title / menu
      app.helpers.setTitle('Files', {addATag: '#files', icon: 'align-justify', subTitle: '<span id="folder-name"></span>'});
      app.shellView.selectMenuItem('files', 'sidebar');

      // the view writes to content,
      app.cached.filesView = new app.FilesView({"model":sources});
      app.cached.filesView.render();

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
      app.helpers.setTitle('Playlist', {addATag: '#playlist/' + list.id, icon: 'music', subTitle: list.name});

      // set menu
      app.shellView.selectMenuItem('playlist', 'no-sidebar');

    }});

  },


  /**
   * playlists
   */
  playlists: function(){
    app.helpers.setTitle('Playlists');
    // set menu
    app.shellView.selectMenuItem('playlists', 'no-sidebar');
  },


  /**
   * Thumbs up page
   */
  thumbsup: function(){

    app.cached.thumbsUpPage = new app.ThumbsupView();
    this.$content.html( app.cached.thumbsUpPage.render().$el );

  },


  /**
   * Browse all movies
   * uses lazyload, infinite scroll and intelligent back button
   * @todo abstract elsewhere.
   *
   * @param num
   *  page number to show
   * @param append
   *  if set to true will append only next page of contents
   */
  movies: function(num, append){

    // vars
    var $content = $('#content'),
      sort = app.helpers.getSortParams(),
      $results = $('ul.movie-page-list',$content),
      fullRange = false,
      scrolled = false,
      lastPageNum = app.moviePageNum,
      $window = $(window),
      isNewPage = ($results.length === 0);

    // clear page if sort changed
    if(sort != app.filters.movieLastSort){
      isNewPage = true;
    }
    app.filters.movieLastSort = sort;

    // do we append?
    append = (append !== undefined && append === true);
    fullRange = (append !== true);

    // force a page via url
    app.moviePageNum = parseInt(num);

    // change the hash without triggering the router (for back action)
    app.router.navigate('movies/page/' + num + '/' + sort);
    // remember last sort setting
    app.settings.set('movieSort', sort);

    // We have no content on the page so init pager
    if(isNewPage === true){

      // Loading
      $content.html('<div class="loading-box">Loading Movies</div>');
      app.helpers.setFirstSidebarContent('');

      // set title and add some tabs
      app.helpers.setTitle('Movies', {addATag: '#mymovies', icon: 'film', subTitle: 'All Movies'});

      // set menu
      app.shellView.selectMenuItem('movies', 'sidebar');

      // we always want fullrange with a fresh page
      fullRange = true;
    } else {
      if(app.moviePageNum === 0){
        // scroll to top
        $window.scrollTo(0);
        app.moviePageNum = lastPageNum;
        return;
      }
    }

    // init the collection
    app.cached.movieCollection = new app.MovieCollection();
    // fetch results
    app.cached.movieCollection.fetch({"fullRange": fullRange, "success": function(collection){

      // get the view of results
      collection.showNext = true;
      app.cached.movieListView = new app.MovieListView({model: collection});

      if(isNewPage === true || app.moviePageNum === 0 || append !== true){ // Replace content //

        // Render view
        $content.html(app.cached.movieListView.render().$el);

        // filters
        $content.prepend(app.filters.renderFilters('movie'));

        // scroll to top
        $window.scrollTo(0);

        // back from a movie, scrollTo that movie
        app.cached.movieListView.backFromMovie(fullRange, scrolled);

        // scrollTo page number
        if(fullRange === true && scrolled !== true && app.moviePageNum > 1){
          $window.scrollTo( '85%' );
          scrolled = true;
        }

        // trigger scroll for lazyLoad
        if(scrolled === false){
          app.image.triggerContentLazy();
        }

      } else { // Append to the current content //

        // if last page was empty, don't change hash or render
        var $lastList = $('.video-list').last();
        if($lastList.find('li').length === 0){

          // dont render, remove the element
          $lastList.remove();
        } else {

          // append new content
          $content.append(app.cached.movieListView.render().$el);
        }

      }

      app.image.triggerContentLazy();

    }}); // end get collection

  },


  /**
   * Page callback
   *
   * @param num
   */
  moviesPage: function(num, sort){
    this.movies(num, false);
  },


  /**
   * Movie landing page
   */
  moviesLanding: function () {

    var self = this;
    app.helpers.setTitle('Movies', {addATag: '#mymovies', icon: 'film', subTitle: 'Recently Added'});

    // loading
    self.$content.html('<div class="loading-box">Loading Movies</div>');

    // get recent collection
    app.movieRecentCollection = new app.MovieRecentCollection();
    app.movieRecentCollection.fetch({"success": function(collection){

      app.cached.movieListView = new app.MovieListView({model: collection});
      // render
      self.$content.html(app.cached.movieListView.render().$el);

      // filters
      self.$content.prepend(app.filters.renderFilters('movie'));

      // fanart
      self.$content.prepend(app.image.getFanartFromCollection(collection));

      // no pagination
      self.$content.find('.next-page').remove();
      // change class
      self.$content.find('ul').removeClass('movie-page-list').addClass('movie-recent-list');

      // set menu
      app.shellView.selectMenuItem('movies', 'sidebar');
      // lazyload
      app.image.triggerContentLazy();
      // scroll to top
      $(window).scrollTo(0);
    }});

  },



  /**
   * Movie tag filter list
   */
  moviesTag: function (tag, id) {

    app.cached.movieTagView = new app.MovieTagListView({model: {type: 'movie', tag: tag, id: id}});
    app.helpers.setTitle('Movies', {addATag: '#mymovies', icon: 'film'});

    if(id === undefined){
      // Loading
      this.$content.html('<div class="loading-box">Loading Movies</div>');
      // Full list
      app.cached.movieTagView.render();
    } else {
      // tag items
      app.cached.movieTagView.renderTagItems();
    }

  },


  /**
   * if it is a genre (string) do lookup for id then redirect
   * @TODO make... better, something other than this, problem is getMovies doesn't give you a genreid
   * http://wiki.xbmc.org/?title=JSON-RPC_API/v6#Video.Fields.Movie
   */
  movieGenre: function(name){

    this.$content.html('<div class="loading-box">Loading</div>');
    var id = 0, self = this;
    var genreList = new app.VideoGenreCollection();
    genreList.fetch({"type": "movie", "success": function(data){
      $.each(data.models, function(i,d){
        if(d.attributes.label == app.helpers.arg(1)){
          id = parseInt(d.attributes.id);
        }
      });
      if(id > 0){
        self.moviesTag('genreid', id);
      }
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

        app.helpers.setTitle('Movies', {
          addATag: '#mymovies',
          icon: 'film',
          subTitle: data.attributes.title + ' <span>' + data.attributes.year + '</span>'
        });

        // set menu
        app.shellView.selectMenuItem('movie', 'sidebar');

      }
    });

  },



  /**
   * A tvshow collection (no pager)
   */
  tvshows: function (pageNum, sort) {

    var $content = $('#content');

    // set menu
    app.shellView.selectMenuItem('tvshows', 'no-sidebar');
    $content.html('<div class="loading-box">Loading TV Shows</div>');
    app.helpers.setTitle('TVShows', { addATag: '#tvshows', icon: 'desktop', subTitle: 'All TV' });

    // init the collection
    app.cached.tvCollection = new app.TvshowAllCollection();

    // fetch results
    app.cached.tvCollection.fetch({"success": function(collection){

      // render collection
      app.cached.tvshowListView = new app.TvshowListView({model: collection});
      $content.html(app.cached.tvshowListView.render().$el);

      // filters
      $content.prepend(app.filters.renderFilters('tvshow'));


      // lazyload
      app.image.triggerContentLazy();

    }});

  },

  tvshowsLanding: function () {

    var $content = $('#content');

    // set menu
    app.shellView.selectMenuItem('tvshows', 'no-sidebar');
    $content.html('<div class="loading-box">Loading TV Shows</div>');
    app.helpers.setTitle('TVShows', { addATag: '#tvshows', icon: 'desktop', subTitle: 'Recently Added' });

    // init the collection
    app.cached.recentTvCollection = new app.RecentTvepisodeCollection();

    // fetch results
    app.cached.recentTvCollection.fetch({"success": function(collection){

      // render collection
      app.cached.recentTvshowListView = new app.TvSeasonListView({model: collection, className:'video-list recent-tv-list'});
      $content.html(app.cached.recentTvshowListView.render().$el);

      // filters
      $content.prepend(app.filters.renderFilters('tvshow'));

      // fanart
      $content.prepend(app.image.getFanartFromCollection(collection));

      // lazyload
      app.image.triggerContentLazy();

    }});

  },


  /**
   * TV tag filter list
   */
  tvshowTag: function (tag, id) {

    app.cached.tvTagView = new app.TvshowTagListView({model: {type: 'tvshow', tag: tag, id: id}});
    app.helpers.setTitle('TV', {addATag: '#tvshows', icon: 'desktop'});

    if(id === undefined){
      // Loading
      this.$content.html('<div class="loading-box">Loading TV</div>');
      // Full list
      app.cached.tvTagView.render();
    } else {
      // tag items
      app.cached.tvTagView.renderTagItems();
    }

  },


  /**
   * A single tvshow
   * @param id
   */
  tvshow: function (id) {

    var tv = new app.TVShow({"id": parseInt(id)}),
      self = this;

    self.$content.html('<div class="loading-box">Loading TV Show</div>');

    tv.fetch({
      success: function (data) {

        // render content
        self.$content.html(new app.TvshowView({model: data}).render().el);
        app.helpers.setTitle('TVShows', { addATag: '#tvshows', icon: 'desktop', subTitle: data.attributes.label });

        // set menu
        app.shellView.selectMenuItem('tvshow', 'sidebar');

      }
    });

  },


  /**
   * A season of a tv show
   * @param id
   */
  season: function (tvshowid, season) {

    var tv = new app.TVShow({"id": parseInt(tvshowid)}),
      self = this;

    self.$content.html('<div class="loading-box">Loading TV Show</div>');

    tv.fetch({
      success: function (data) {

        // force season view
        data.attributes.type = 'season';
        data.attributes.season = season;

        // Update image from cache
        var sc = app.stores.TvSeasons, key = 'seasons:' + tvshowid;
        if(sc !== undefined && sc[key] !== undefined && sc[key].length > 0){
          $.each(sc[key], function(i,d){
            if(d.season == season && d.thumbnail !== ''){
              data.attributes.thumbnail = d.thumbnail;
            }
          });
        }

        // render content
        self.$content.html(new app.TvshowView({model: data}).render().el);
        app.helpers.setTitle( '<i class="fa fa-desktop"></i>' +
          '<a href="#tvshow/' + data.attributes.tvshowid + '">' + data.attributes.label + '</a>Season ' + season);

        // set menu
        app.shellView.selectMenuItem('tvshow', 'sidebar');

      }
    });

  },


  /**
   * A season of a tv show episode
   * @param id
   */
  episode: function (tvshowid, season, episodeid) {

    var tv = new app.TVEpisode({"id": parseInt(episodeid)}),
      self = this;

    self.$content.html('<div class="loading-box">Loading TV Show</div>');

    tv.fetch({
      success: function (data) {

        // force ep view
        data.attributes.type = 'episode';
        data.attributes.tvshowid = tvshowid;
        data.attributes.season = season;

        // render content
        self.$content.html(new app.TvshowView({model: data}).render().el);

        // title
        app.helpers.setTitle( '<i class="fa fa-desktop"></i>' +
          '<a href="#tvshow/' + data.attributes.tvshowid + '">' + data.attributes.showtitle + '  Season ' + season + '</a>' +
          'E' + data.attributes.episode + '. ' + data.attributes.label);

        // set menu
        app.shellView.selectMenuItem('tvshow', 'sidebar');

      }
    });

  },


  /**
   * PVR
   *
   *  tv or radio
   */
  pvr: function(){

    var self = this,
      pvrType = app.pvr.getTypeFromPath();

    app.shellView.selectMenuItem('pvr', 'sidebar');
    app.ui.setLoading(pvrType.niceName + ' channels', true);

    // get channels
    app.cached.pvrChannelCollection = new app.PvrChannelCollection();
    app.cached.pvrChannelCollection.fetch({"type": pvrType.type, "success": function(collection){

      // render view
      app.cached.pvrChannelsView = new app.PvrChannelsView({model: collection});
      self.$content.html(app.cached.pvrChannelsView.render().$el);
      //title
      app.helpers.setTitle(pvrType.niceName, {addATag: '#tv/live'});
      // filters
      self.$content.prepend(app.filters.renderFilters(pvrType.filters));

      console.log(collection);
    }});



  },




  /**
   * Toggle Remote control
   */
  remoteControl: function(){
    // Set Player
    app.playlists.changePlaylistView('xbmc');
    // set title
    app.helpers.setTitle('Remote');
    // set menu
    app.shellView.selectMenuItem('remote', 'no-sidebar');
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

    var lib = (type == 'audio' ? 'AudioLibrary' : 'VideoLibrary'),
      self = this;
    app.xbmcController.command(lib + '.Scan', {}, function(d){
      app.notification('Started ' + type + ' Scan');
      app.shellView.selectMenuItem('scan', 'no-sidebar');
      self.$content.html('<div class="loading-box">Scanning ' + type + ' library</div>');
      app.helpers.setTitle('<i class="fa fa-refresh"></i> ' + type + ' scan');
    });

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
    // set last player
    if(app.settings.get('lastPlayer', 'xbmc') == 'local'){
      $('.local-tab').trigger('click');
    }

  },'songsReady');



});
