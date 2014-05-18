/**
 * Handles all the updates to the dom in regard to the player state
 * eg. now playing, connection, etc.
 *
 * @type {*|void|Object|extend|extend|extend}
 */


app.playerStateView = Backbone.View.extend({

  // force a full refresh after this many runs (12 = 60sec)
  runForce: 12,

  initialize: function () {

    // how many times this has run until reset (runForce)
    if(app.counts.runCount === undefined){
      app.counts.runCount = 0;
    }

    this.$body = $('body');
    this.$nowPlaying = $('#now-playing');

  },

  render:function () {

    // get model
    var data = app.playerState.xbmc.getNowPlaying(),
      $window = $(window),
      lastPlaying = app.helpers.varGet('lastPlaying', '');

    this.$songs = $('.song');

    // force a refresh if playing a url stream and hit runForce count (will see the update next run)
    // there is no notification for song change :(
    if(data.status == 'playing' && this.isUrl(data.item.file) && this.runForce <= app.counts.runCount){
      app.playerState.xbmc.fetchRemote(function(){}, true);
      app.counts.runCount = 0;
    }

    // enrich
    data.playingItemChanged = (lastPlaying != this.playingKey(data));
    data.status = (data.status == 'notPlaying' ? 'stopped' : (app.helpers.exists(data.player.speed) && data.player.speed === 0 ? 'paused' : data.status));
    app.state = data.status;

    // resave model
    app.cached.nowPlaying = data;

    // set current as last playing var
    app.helpers.varSet('lastPlaying', this.playingKey(data));

    // body classes
    this.bodyClasses();

    // remove any playing classes
    this.$songs.removeClass('playing-row');

    // if playing
    if(data.status == 'playing' || data.status == 'paused'){

      this.nowPlayingMinor();

      // if playing has changed
      if(data.playingItemChanged){
        this.nowPlayingMajor();
        $window.trigger('playingItemChange', data);

      }

      // increase run count if playing
      if(data.status == 'playing'){
        app.counts.runCount++;
      }

    } else {
      this.notPlaying();
    }

    // init cron
    this.playerCron();

    $window.trigger('playerUpdate', data);

  },


  /**
   * Get a unique key for the playing item to determine if it has changed
   * @param data
   *  now playing object
   * @returns {key}
   */
  playingKey: function(data){
    // urls have changing labels so we check on that instead of file
    if(this.isUrl(data.item.file)){
      return data.item.label;
    }
    // otherwise a file/id is more reliable
    return (data.item !== undefined ?
      (data.item.file !== undefined ? data.item.file : data.item.type + data.item.id)
      : null);
  },


  /**
   * is a url?
   * @param str
   * @returns {boolean}
   */
  isUrl: function(str){
    return str !== undefined && ((str.lastIndexOf("http://", 0) === 0) || (str.lastIndexOf("https://", 0) === 0));
  },


  /***************************************
   * Helpers
   **************************************/

  /**
   * body classes
   */
  bodyClasses:function () {

    var data = app.playerState.xbmc.getNowPlaying();

    this.$body
      // remove all old classes and list the options in use
      .removeClass('playing').removeClass('paused').removeClass('notPlaying')
      .removeClass('random-on').removeClass('random-off').removeClass('partymode-on')
      .removeClass('repeat-off').removeClass('repeat-all').removeClass('repeat-one')
      // add active classes
      .addClass(data.status)
      .addClass( 'random-' + (data.player.shuffled === true ? 'on' : 'off') )
      .addClass( 'repeat-' + data.player.repeat );

    if(data.player.partymode === true){
      this.$body.addClass('partymode-on');
    }
    // Remove all classes starting with 'activePlayer'
    this.$body.removeClass (function (index, css) {
      return (css.match (/\bactivePlayer\S+/g) || []).join(' ');
    })
      // Add the current player / playlist
      .addClass('activePlayer-'+ data.activePlayer);
  },


  /**
   * Now playing minor update
   */
  nowPlayingMinor:function(){

    // add currently playing class
    this.tagPlayingRow();

    // set the title
    this.setTitle();

    var data = app.playerState.xbmc.getNowPlaying(),
      // time stuff
      $time = $('#time'),
      cur = 0,
      dur = 0,
      // playlist stuff
      meta = app.ui.getModelMeta(data.item),
      $playlistActive = $('.playlist .playing-row');

    //set playlist meta and playing row
    $('.playing-song-meta').html(meta);

    //set progress (done by timer)
    //app.shellView.$progressSlider.slider( "value",data.player.percentage );

    // update the progress if viewing model page
    $('.progress-' + data.item.type + '-' + data.item.id).css( 'width' , Math.ceil( data.player.percentage) + '%' );

    // switch between audio / video formatting
    if(data.activePlayer == 1){
      // Video
      dur = data.player.totaltime;
      cur = data.player.time;
    } else if (data.activePlayer === 0){
      // Audio
      dur = app.helpers.secToTime(parseInt(data.item.duration));
      cur = data.player.time;
      //cur = app.helpers.secToTime(Math.floor((parseInt(data.player.percentage) / 100) * parseInt(data.item.duration)));
    }

    // set time
    $time.find('.time-cur').html(app.helpers.formatTime(cur));
    $time.find('.time-total').html(app.helpers.formatTime(dur));

    // If episode is playing, remove cache so watched status is updated
    if(data.item.type == 'episode'){
      app.VideoController.invalidateCache('episode', data.item);
    }

  },


  /**
   * Now playing major update
   */
  nowPlayingMajor:function(){

    var data = app.playerState.xbmc.getNowPlaying();

    //set thumb
    this.$nowPlaying.find('#playing-thumb')
      .css('background-image',"url('" + app.image.url(data.item.thumbnail) + "')");

    if(app.cached.nowPlaying.activePlayer == 1){
      this.$nowPlaying.find('#playing-thumb').attr("#remote"); //('href', '#' + data.item.type + '/' + data.item.albumid);
    }
    // set title
    $('.playing-song-title').html(app.helpers.uncolorText(data.item.label))
      .attr('title', data.item.album)
      .attr('href', '#album/' + data.item.albumid); //now playing


    // Backstretch
    // @TODO move to home view as bind
    if(location.hash == '#' || location.hash === '' && app.audioStreaming.getPlayer() == 'xbmc'){
      // if homepage backstretch exists and changed, update
      var $bs = $('.backstretch img'),
        origImg = $bs.attr('src'),
        newImg = app.image.url(data.item.fanart, 'fanart');
      // if image is different
      if($bs.length > 0 && origImg != newImg){
        $.backstretch(newImg);
      }
    }

    $('.playing-fanart').css('background-image', 'url("' + app.image.url(data.item.fanart, 'fanart') + '")');

    // refresh playlist
    var controller;
    if(app.playerState.xbmc.getNowPlaying('activePlayer') === 0){
      controller = app.AudioController;
    } else {
      controller = app.VideoController;
    }
    controller.playlistRender(function(){
      // scroll to playing item
      $sb = $('#sidebar-second');
      //$('.sidebar-pane', $sb).scrollTo( $('.playing-row'), 1000, {offset: {top:-11}} );
      $('.playlist-pos-' + data.player.position, $sb).scrollTo( $('.playing-row'), 0, {offset: {top:-11}} );
    });

  },

  /**
   * Set a playing class on currently playing row
   */
  tagPlayingRow:function(){

    var data = app.playerState.xbmc.getNowPlaying();

    // playing row we should have a loaded item
    this.$songs.each(function(i,d){
      var $d = $(d);
      // correct song id
      if($d.attr('data-songid') == data.item.id && !$d.hasClass('playlist-item')){
        $d.addClass('playing-row');
      } else if($d.hasClass('playlist-item')){

        // match pos in xbmc list
        if($d.data('id') == data.player.position && !$d.parent().hasClass('browser-player') && $d.data('playlistId') == data.activePlayer){
          $d.addClass('playing-row');
        }
      }
    });
  },


  /**
   * Set document title
   */
  setTitle:function () {
    var data = app.cached.nowPlaying, title = app.helpers.uncolorText(data.item.label);
    if(app.audioStreaming.getPlayer() == 'xbmc'){
      document.title = (data.status == 'playing' ? '▶ ' : '') + (title !== undefined ? title + ' | ' : '') + 'Chorus.'; //doc
    }
  },


  notPlaying:function () {
    var data = app.cached.nowPlaying;
    //doc title
    document.title = 'Chorus.';
    //title and artist
    $('.playing-song-title').html('Nothing Playing');
    $('.playing-song-meta').html('');
    //playlist row
    $('ul.playlist div.playlist-item.playing-row').removeClass('playing-row');
    //progress
    app.shellView.$progressSlider.slider( "value",0);
    //set thumb
    this.$nowPlaying.find('#playing-thumb')
      .attr('src',app.image.url(''))
      .attr('title', '')
      .parent().attr('href', '#albums');
    //time
    var $time = $('#time');
    $time.find('.time-cur').html('0');
    $time.find('.time-total').html('0:00');
    // ensure volume set
    app.shellView.$volumeSlider.slider( "value",data.volume.volume );
  },


  /**
   * Runs every 5 sec
   */
  playerCron:function (){
    var data = app.cached.nowPlaying,
      lastState =  app.helpers.varGet('lastState', ''),
      noState = (typeof lastState == 'undefined' || typeof lastState.volume == 'undefined'),
      $t = {}, t = '', n ='';

    //set volume, only if we must
    if(!$('a.ui-slider-handle', app.shellView.$volumeSlider).hasClass('.ui-slider-active')){  // is the slider currently being moved?
      app.shellView.$volumeSlider.slider( "value",data.volume.volume );
      //muted class
      if(data.volume.volume === 0){
        $('body').addClass('muted');
      } else {
        $('body').removeClass('muted');
      }
    }

    // set repeat title text
    if(noState || typeof lastState.player == 'undefined' || lastState.player.repeat != data.player.repeat){
       $t = $('.player-repeat');
       t = $t.attr('title');
       n = (data.player.repeat == 'off' ? 'Repeat is off' : 'Currently repeating ' + data.player.repeat);
      if(t != n){ $t.attr('title', n); }
    }

    // set random title text
    if(noState || lastState.player.shuffled != data.player.shuffled){
        $t = $('.player-random');
        t = $t.attr('title');
        n = 'Random is ' + (data.player.shuffled === true ? 'On' : 'Off');
      if(t != n){ $t.attr('title', n); }
    }

    // Set last state to data
    app.helpers.varSet('lastState', data);
  }



});
