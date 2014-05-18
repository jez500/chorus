app.ShellView = Backbone.View.extend({

  initialize: function () {

    /**
     * Maybe a more "backbone" way of doing this,
     * but basically want to bind to all page changes and trigger
     * this.pageChange()
     */
    var $window = $(window), $body = $('body'), self = this;

    // keyup timeout
    app.cached.keyupTimeout = 0;

    // init first page change to setup classes, etc.
    self.pageChange(location.hash, '#init');

    $window.bind('hashchange', function(e) {
      var newHash = location.hash,
          lastHash = app.vars.lastHash,
          back = (typeof lastHash == 'undefined' ? '#' : lastHash);

      // if page change
      if(newHash != back){
        self.pageChange(newHash, back);
      }

      // set last hash
      app.vars.backHash = lastHash;
      app.vars.lastHash = newHash;

      $(window).trigger('pageChange', [e, newHash, back]);
    });

    /**
     * Fades the header bg when at the top
      */
    $window.bind('scroll', function(e) {
      if( $window.scrollTop() > 50 ){
        $body.addClass('fixed-header');
      } else {
        $body.removeClass('fixed-header');
      }
    });

  },

  render: function () {
    this.$el.html(this.template());
    var self = this;

    // playlist
    app.AudioController.playlistRender();

    //init the progress bar
    this.$progressSlider = $( "#progress-bar", this.el );

    this.$progressSlider.slider({
      range: "min",
      value: 0,
      min: 0,
      max: 100,
      start: function(){
        app.ui.timerStop(); // stop timer while dragging
      },
      stop: function( event, ui ) {
        app.AudioController.seek(ui.value);
        app.ui.timerStart(); // start timer again
      }
    });


    //init the volume bar
    this.$volumeSlider = $( "#volume", this.el );
    this.$volumeSlider.slider({
      range: "min",
      value: 0,
      min: 0,
      max: 100,
      stop: function( event, ui ) {
        app.AudioController.setVolume(ui.value);
      }
    });

    // Init lazyload and add a trigger
    $("img.content-lazy").lazyload({
      event : "contentLazy"
    });


    // Init player state cycle, load up now playing first
    app.playerState.xbmc.fetchRemote(function(){
      // init polling
      setInterval(app.playerState.xbmc.fetch, 5000);
      // init timer
      app.ui.timerStart();
      // init web sockets
      app.notifications.init();
    }, true);

    // render remote
    this.$el.append(new app.RemoteView().render().$el);

    return this;
  },

  events: {
    // search
    "keyup #search": "onkeyupSearch",
    "click #search-this": "search",
    "keypress #search": "onkeypressSearch",
    // misc
    "click #logo": "home",
    // player
    "click .player-prev": "playerPrev",
    "click .player-next": "playerNext",
    "click .player-play": "playerPlay",
    "click .player-mute": "playerMute",
    "click .player-repeat": "playerRepeat",
    "click .player-random": "playerRandom",
    "click .song-image": "remoteControl",
    // tabs
    "click .playlist-primary-tab": "primaryTabClick",
    // menu
    "click .save-playlist": "savePlayList",
    "click .clear-playlist": "clearPlaylist",
    "click .refresh-playlist": "refreshPlaylist",
    "click .new-custom-playlist": "newCustomPlaylist",
    "click .party-mode": "partyMode",
    // bottom menu
    "click .about-dialog": "about",

    // browser player ///////////
    "click .browser-view-xbmc": "viewXbmc",
    "click .browser-view-local": "viewLocal",
    "click .browser-player-play": "localTogglePlay",
    "click .browser-player-prev": "localPrev",
    "click .browser-player-next": "localNext",
    "click .browser-player-repeat": "localRepeat",
    "click .browser-player-random": "localRandom",
    "click .browser-player-mute": "localMute",

    // Mobile menu
    "click .toggle-ss": "toggleSidebarSecondVisibility",
    "click .toggle-vol": "toggleVolumeVisibility",
    "click .toggle-search": "toggleSearchVisibility"

  },


  /**
   * Generic page change bind
   * @param event
   */
  pageChange: function(newHash, back){
    var key = app.helpers.arg(0);
    // Remove all classes starting with 'section'
    $("body").removeClass (function (index, css) {
      return (css.match (/\bsection\S+/g) || []).join(' ');
    })
      // Add the current page
      .addClass('section-'+ key);

  },

  /**
   * Playlist tab click
   * @param event
   * @param o
   */
  primaryTabClick:function(event){
    $thisTab = $(event.target);
    if(!$thisTab.hasClass('playlist-primary-tab')){
      $thisTab = $thisTab.closest('li.playlist-primary-tab');
    }
    // toggle based on tab class
    var view = $thisTab.data('pane');
    app.playlists.changePlaylistView(view);
    // remember
    if(view == 'xbmc' || view == 'local'){
      app.settings.set('lastPlayer', view);
    }
  },

  /**
   * Search artists, albums & songs
   * @see view/search.js
   * @param event
   */
  search: function (event) {

    var $search = $('#search');
    app.cached.searchView = new app.searchView({model: {'key': $search.val()}});
    app.cached.searchView.render();

  },

  onkeyupSearch: function (event) {

    // before rendering the entire search page we should give the user a chance to type in
    // something significant, in fact each time they press the key we should give them time
    // to press another before render.

    // the time we wait from key up, and this
    var keyDelay = 200, self = this;

    // set and clear timeout to leave a gap
    $('#search').on('input', function (e) {
    //  e.preventDefault();
      clearTimeout(app.cached.keyupTimeout); // doesn't matter if it's 0
      app.cached.keyupTimeout = setTimeout(function(){
        document.location = '#search/' + encodeURIComponent( $('#search').val() );
      }, keyDelay);
    });

  },


  onkeypressSearch: function (event) {
    if (event.keyCode === 13) { // enter key pressed
      event.preventDefault();
    }
  },


  /**
   * This acts as layout definer wrapper
   * @param menuItem
   * @param sidebar
   */
  selectMenuItem: function(menuItem, sidebar) {

    var $body = $('body'),
        state = (typeof sidebar != 'undefined' && sidebar == 'sidebar' ? 'open' : 'close');

    //sidebar - reset and add
    app.helpers.toggleSidebar(state);

    // layout changes for different pages
    if(menuItem == 'home'){

      //specific to home
      $body.addClass('home');

    } else {

      // ensure backstretch is gone
      if($('.backstretch').length > 0){
        $('.backstretch').remove();
        //$.backstretch("destroy", false);
      }
      $body.removeClass('home');

    }


    if (menuItem) {
      // Toggle the actual menu class based on menuItem
      var $nav = $('.mainnav', this.el),
        $active = $nav.find('li.nav-' + menuItem);
      $nav.find('li').removeClass('active');
      $active.addClass('active');
    }


  },


  //player commands
  playerPrev:function(){
    app.AudioController.sendPlayerCommand('Player.GoTo', 'previous');
  },
  playerNext:function(){
    app.AudioController.sendPlayerCommand('Player.GoTo', 'next');
  },
  playerPlay:function(){
    app.AudioController.sendPlayerCommand('Player.PlayPause', 'toggle');
  },
  playerRepeat:function(){
    app.AudioController.sendPlayerCommand('Player.SetRepeat', 'cycle');
  },
  playerRandom:function(){
    app.AudioController.sendPlayerCommand('Player.SetShuffle', 'toggle');
  },

  // toggle remote
  remoteControl: function(e){
    e.preventDefault();
    if(app.helpers.arg(0) == 'remote'){
      // same as using the back button
      window.history.back();
    } else {
      document.location = '#remote';
    }
  },

  //mute
  playerMute:function(){
    //get current vol
    var cur = this.$volumeSlider.slider( "value"), $body = $('body'), lastvol;
    if(cur > 0){
      //store current vol then set to 0
      this.lastVol = cur;
      app.AudioController.setVolume(0);
      this.$volumeSlider.slider( "value",0 );
      $body.addClass('muted');
    } else {
      //if last vol
      if(app.helpers.exists(this.lastVol) && this.lastVol > 0){
        lastvol = this.lastVol; //set back to last value
      } else {
        lastvol = 50; //default last vol to 50%
      }
      //set lastvol
      app.AudioController.setVolume(lastvol);
      this.$volumeSlider.slider( "value",lastvol );
      $body.removeClass('muted');
    }
  },


  // update the playing state
  updateState:function(data){
    app.cached.playerState = new app.playerStateView({model: data});
    app.cached.playerState.render();
  },



  /**
   * Save a playlist
   * @param e
   */
  savePlayList: function(e){
    e.preventDefault();
    // Save playlist
    app.playlists.saveCustomPlayListsDialog();
  },

  /**
   * refresh playlist
   */
  refreshPlaylist: function(e){
    e.preventDefault();
    this.getController().playlistRender();
  },


  /**
   * New Custom playlist
   */
  newCustomPlaylist: function(e){
    e.preventDefault();
    app.playlists.saveCustomPlayListsDialog('song', []);
  },


  /**
   * Toggle partyMode
   */
  partyMode: function(e){
    e.preventDefault();
    var self = this;
    this.getController().setPartyMode(function(){
      self.updateState();
    });
  },

  /**
   *  Clear a playlist
   */
  clearPlaylist: function(e){
    e.preventDefault();
    var controller = this.getController();
    // clear the list for the given collection
    controller.playlistClear(function(){
      controller.playlistRender();
    });
  },


  /**
   * Get controller based on what is visible in the shell
   * @returns {{}}
   */
  getController: function(){
    var controller = {};
    // Local Player
    if(app.audioStreaming.getPlayer() == 'local'){
      controller = app.audioStreaming;
    } else {
      // XBMC Player
      if($('.plid-1').length > 0){
        // video playlist
        controller = app.VideoController;
      } else {
        // audio playlist
        controller = app.AudioController;
      }
    }
    return controller;
  },


  /**
   *  About
   */
  about: function(e){
    e.preventDefault();
    app.helpers.aboutDialog();
  },

  /**
   * Scan Library
   * @param e
   */
  scanLibrary: function(e){

  },


  /*************************************
   * Local Browser Streaming below
   * @TODO Move
   ************************************/


  /**
   *  Change to xbmc view (default)
   */
  viewXbmc: function(e){
    e.preventDefault();
    app.audioStreaming.setPlayer('xbmc');
  },

  /**
   *  Change to local view
   */
  viewLocal: function(e){
    e.preventDefault();
    app.audioStreaming.setPlayer('local');
  },


  /**
   *  Play / Pause in browser
   */
  localTogglePlay: function(e){
    e.preventDefault();
    app.audioStreaming.togglePlay();
  },

  /**
   *  Prev song in browser
   */
  localPrev: function(e){
    e.preventDefault();
    app.audioStreaming.prev();
  },

  /**
   *  Next song in browser
   */
  localNext: function(e){
    e.preventDefault();
    app.audioStreaming.next();
  },

  /**
   *  Next song in browser
   */
  localRepeat: function(e){
    e.preventDefault();
    app.audioStreaming.repeat();
  },

  /**
   *  Next song in browser
   */
  localRandom: function(e){
    e.preventDefault();
    app.audioStreaming.random();
  },

  /**
   *  Next song in browser
   */
  localMute: function(e){
    e.preventDefault();
    app.audioStreaming.mute();
  },

  /**
   * Toggle sidebar-second visibility
   */
  toggleSidebarSecondVisibility: function(){
    $('body').toggleClass('ss-open');
  },

  /**
   * Toggle volume visibility
   */
  toggleVolumeVisibility: function(){
    $('body').toggleClass('vol-open');
  },

  /**
   * Toggle search visibility
   */
  toggleSearchVisibility: function(){
    $('body').toggleClass('search-open');
  }


});