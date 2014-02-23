/**
 * Handles all the updates to the dom in regard to the player state
 * eg. now playing, connection, etc.
 *
 * @type {*|void|Object|extend|extend|extend}
 */


app.playerStateView = Backbone.View.extend({

  initialize: function () {

    this.$body = $('body');
    this.$nowPlaying = $('#now-playing');

  },

  render:function () {

    // get model
    var data = this.model,
      $window = $(window),
      lastPlaying = app.helpers.varGet('lastPlaying', '');

    this.$songs = $('.song');

    // enrich
    data.playingItemChanged = (lastPlaying != data.item.file);
    data.status = (app.helpers.exists(data.player.speed) && data.player.speed == 0 ? 'paused' : data.status);
    app.state = data.status;

    // resave model
    this.model = data;

    // set current as last playing var
    app.helpers.varSet('lastPlaying', data.item.file);

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

    } else {
      this.notPlaying();
    }

    // init cron
    this.playerCron();

    $window.trigger('playerUpdate', data);

  },




  /***************************************
   * Helpers
   **************************************/


  /**
   * body classes
   */
  bodyClasses:function () {

    var data = this.model;

    this.$body
      // remove all old classes and list the options in use
      .removeClass('playing').removeClass('paused').removeClass('notPlaying')
      .removeClass('random-on').removeClass('random-off')
      .removeClass('repeat-off').removeClass('repeat-all').removeClass('repeat-one')
      // add active classes
      .addClass(data.status)
      .addClass( 'random-' + (data.player.shuffled === true ? 'on' : 'off') )
      .addClass( 'repeat-' + data.player.repeat );

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

    var data = this.model,
      // time stuff
      $time = $('#time'),
      cur = 0,
      dur = 0,
      // playlist stuff
      meta = app.helpers.parseArtistsArray(data.item),
      $playlistActive = $('.playlist .playing-row');

    //set playlist meta and playing row
    $('.playing-song-meta').html(meta);

    //set progress
    app.shellView.$progressSlider.slider( "value",data.player.percentage );

    // switch between audio / video formatting
    if(data.activePlayer == 1){
      // Video
      dur = data.player.totaltime.hours + ':' + data.player.totaltime.minutes + ':' + data.player.totaltime.seconds;
      cur = data.player.time.hours + ':' + data.player.time.minutes + ':' + data.player.time.seconds;
    } else if (data.activePlayer == 0){
      // Audio
      dur = app.helpers.secToTime(parseInt(data.item.duration));
      cur = app.helpers.secToTime(Math.floor((parseInt(data.player.percentage) / 100) * parseInt(data.item.duration)));
    }

    // set time
    $time.find('.time-cur').html(cur);
    $time.find('.time-total').html(dur);

  },


  /**
   * Now playing major update
   */
  nowPlayingMajor:function(){

    var data = this.model;

    //set thumb
    this.$nowPlaying.find('#playing-thumb')
      .css('background-image',"url('" + app.parseImage(data.item.thumbnail) + "')")
      .attr('title', data.item.album)
      .attr('href', '#album/' + data.item.albumid);

    if(app.cached.nowPlaying.activePlayer == 1){
      this.$nowPlaying.find('#playing-thumb').attr('href', '#' + data.item.type + '/' + data.item.albumid);
    }
    // set title
    $('.playing-song-title').html(data.item.label); //now playing


    // Backstretch
    // @TODO move to home view as bind
    if(location.hash == '#' || location.hash == '' && app.audioStreaming.getPlayer() == 'xbmc'){
      // if homepage backstretch exists and changed, update
      var $bs = $('.backstretch img'),
        origImg = $bs.attr('src'),
        newImg = app.parseImage(data.item.fanart, 'fanart');
      // if image is different
      if($bs.length > 0 && origImg != newImg){
        $.backstretch(newImg);
      }
    }

    // refresh playlist
    if(app.cached.nowPlaying.activePlayer == 0){
      app.AudioController.playlistRender();
    } else if(app.cached.nowPlaying.activePlayer == 1){
      app.VideoController.playlistRender();
    }

  },

  /**
   * Set a playing class on currently playing row
   */
  tagPlayingRow:function(){

    var data = this.model;

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
    var data = this.model, title = data.item.label;
    if(app.audioStreaming.getPlayer() == 'xbmc'){
      document.title = (data.status == 'playing' ? '▶ ' : '') + (title != undefined ? title + ' | ' : '') + 'Chorus.'; //doc
    }
  },


  notPlaying:function () {
    var data = this.model;
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
      .attr('src',app.parseImage(''))
      .attr('title', '')
      .parent().attr('href', '#albums');
    //time
    var $time = $('#time');
    $time.find('.time-cur').html('0');
    $time.find('.time-total').html('0:00');
  },


  /**
   * Runs every 5 sec
   */
  playerCron:function (){
    var data = this.model,
      lastState =  app.helpers.varGet('lastState', ''),
      noState = (typeof lastState == 'undefined' || typeof lastState.volume == 'undefined');

    //set volume, only if we must
    if(!$('a.ui-slider-handle', app.shellView.$volumeSlider).hasClass('.ui-slider-active')  // is the slider currently being moved?
      && (noState || lastState.volume.volume != data.volume.volume)){
      app.shellView.$volumeSlider.slider( "value",data.volume.volume );
      //muted class
      if(data.volume.volume == 0){
        $('body').addClass('muted');
      } else {
        $('body').removeClass('muted');
      }
    }

    // set repeat title text
    if(noState || typeof lastState.player == 'undefined' || lastState.player.repeat != data.player.repeat){
      var $t = $('.player-repeat'), t = $t.attr('title'),
        n = (data.player.repeat == 'off' ? 'Repeat is off' : 'Currently repeating ' + data.player.repeat);
      if(t != n){ $t.attr('title', n); }
    }

    // set random title text
    if(noState || lastState.player.shuffled != data.player.shuffled){
      var $t = $('.player-random'), t = $t.attr('title'),
        n = 'Random is ' + (data.player.shuffled === true ? 'On' : 'Off');
      if(t != n){ $t.attr('title', n); }
    }

    // Set last state to data
    app.helpers.varSet('lastState', data);
  }



});