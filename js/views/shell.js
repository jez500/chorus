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

    $window.bind('hashchange', function() {
      var newHash = location.hash,
          lastHash = app.vars.lastHash,
          back = (typeof lastHash == 'undefined' ? '#' : lastHash);

      // if page change
      if(newHash != back){
        self.pageChange(newHash, back);
      }

      // set last hash
      app.vars.lastHash = newHash;

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

    //set playlist
    app.AudioController.playlistRefresh(function(result){

    });

    //init the progress bar
    this.$progressSlider = $( "#progress-bar", this.el );

    this.$progressSlider.slider({
      range: "min",
      value: 0,
      min: 0,
      max: 100,
      stop: function( event, ui ) {
        app.AudioController.seek(ui.value);

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

    // Init player state cycle
    setInterval(app.AudioController.updatePlayerState, 5000);

    // set playlist menu
    $('.playlist-actions-wrapper', this.$el).html(
      app.helpers.makeDropdown( app.helpers.dropdownTemplates('playlistShell') )
    );

    //custom playlists
    app.playlists.addCustomPlayLists(function(view){
      var $sb = $('.alt-sidebar-items', self.$el);
      $sb.html(view.render().el);
    });

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
    // tabs
    "click .playlist-primary-tab": "primaryTabClick",
    // menu
    "click .save-playlist": "savePlayList",
    "click .clear-playlist": "clearPlaylist",
    "click .refresh-playlist": "refreshPlaylist",
    "click .new-custom-playlist": "newCustomPlaylist",
    // bottom menu
    "click .about-dialog": "about"
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
    // toggle based on tab class
    var view = ($thisTab.hasClass('local-playlist-tab') ? 'local' : 'xbmc');
    app.playlists.changePlaylistView(view);
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
    var keyDelay = 500, self = this;

    // set and clear timeout to leave a gap
    $('#search').keyup(function () {
      clearTimeout(app.cached.keyupTimeout); // doesn't matter if it's 0
      app.cached.keyupTimeout = setTimeout(function(){
        self.search();
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
        $.backstretch("destroy", false);
      }
      $body.removeClass('home');

      // specifics for non home pages
      switch (menuItem) {

        case 'playlist':
          // all this to open the sidebar playlist item
          app.playlists.changePlaylistView('local');
          $('ul.custom-lists .custom-playlist-item').each(function(i,d){
            var $d = $(d), $parent = $d.parent();
            if($d.data('id') == app.helpers.arg(1)){
              $parent.addClass('open');
            } else {
              $parent.removeClass('open')
            }
          });
          break;

        case 'thumbsup':
          $('.custom-lists li').removeClass('open');
          $('.thumbsup-link').addClass('open');
          app.playlists.changePlaylistView('local');
          break;
      }
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



  //mute
  playerMute:function(){
    //get current vol
    var cur = this.$volumeSlider.slider( "value"), $body = $('body');
    if(cur > 0){
      //store current vol then set to 0
      this.lastVol = cur;
      app.AudioController.setVolume(0);
      this.$volumeSlider.slider( "value",0 );
      $body.addClass('muted');
    } else {
      //if last vol
      if(app.helpers.exists(this.lastVol) && this.lastVol > 0){
        var lastvol = this.lastVol; //set back to last value
      } else {
        var lastvol = 50; //default last vol to 50%
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
    app.playlists.changePlaylistView('local');
  },

  /**
   * refresh playlist
   */
  refreshPlaylist: function(e){
    e.preventDefault();
    app.AudioController.playlistRefresh();
  },


  /**
   * New Custom playlist
   */
  newCustomPlaylist: function(e){
    e.preventDefault();
    app.playlists.saveCustomPlayListsDialog('song', []);
  },


  /**
   *  Clear a playlist
   */
  clearPlaylist: function(e){
    e.preventDefault();
    // Clear playlist
    app.AudioController.playlistClear(function(data){
      app.AudioController.playlistRefresh();
    });
  },


  /**
   *  About
   */
  about: function(e){
    e.preventDefault();
    app.helpers.aboutDialog();
  }




});