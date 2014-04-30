/**
 * Binds
 * =====================================================================
 */



// html5 audio doesn't work in firefox because it requires a strict mime type of audio/mpeg
// XBMC supplies the type as audio/mpeg3 resulting in html5 audio throwing errors and just
// not playing anything.
//
// In light of this we switch to flash, which has its own problems, namely not working after
// you refresh your page! seems to be a cache issue but same occurs in chrome :(
// First load is generally good so it is at least better than nothing - but maybe more frustrating?
//var preferFlash = (app.helpers.getBrowser() == 'firefox');
//console.log(preferFlash);

// setup soundmanager
soundManager.setup({
  url: 'lib/soundmanager/swf/',
  flashVersion: 9,
  preferFlash: false,
  useHTML5Audio: true,
  useFlashBlock: false,
  flashLoadTimeout: 3000,
  debugMode: false,
  noSWFCache: true,
  debugFlash: false,
  onready: function(){
    app.audioStreaming.init();
  },
  ontimeout: function(){
    console.log('timeout');
    soundManager.flashLoadTimeout = 0; // When restarting, wait indefinitely for flash
    soundManager.onerror = {}; // Prevent an infinite loop, in case it's not flashblock
    soundManager.reboot(); // and, go!
  }
});


/**
 * On Shell ready
 * Browser player binds and load last playlist from local storage
 */
$(window).on('shellReady', function(){



  // browser player setup
  app.audioStreaming.$body = $('body');
  app.audioStreaming.$window = $(window);

  // create a local browser playlist object that will contain local player information
  // most importantly is the current playlist
  app.audioStreaming.playList = {
    items: [],
    playingPosition: 0,
    id: 0,
    repeat: 'off',
    random: 'off',
    mute: false
  };

});


/**
 * On Playback start
 * Browser player has started (or resumed playback)
 */
$(window).on('browserPlayerStart', function(song){
  app.audioStreaming.playbackInProgress = true;
  app.audioStreaming.setTitle('playing', song.label);
});


/**
 * On Playback stop
 * Browser player has stopped (or paused)
 */
$(window).on('browserPlayerStop', function(){
  app.audioStreaming.playbackInProgress = false;
  app.audioStreaming.setTitle('stop', 'Nothing Playing');
});



/**
 * audioStreaming object
 * =====================================================================
 */

/**
 * Handles local audio streaming in the browser
 * @type {{}}
 */
app.audioStreaming = {

  // init vars
  localPlay: false,
  nowplaying: { 'init': 1 },
  lastPos: 0,
  defaultVol: 60,
  progressEl: '#browser-progress-bar',
  volumeEl: '#browser-volume',
  playlistEl: '#playlist-local',
  playbackInProgress: false,
  currentPlaybackId: 'browser-none',

  // local storage
  lastListKey: 'lastBrowserList',

  // body class names
  classLocal: 'player-view-local',
  classXbmc: 'player-view-xbmc',
  classLocalPlaying: 'browser-playing',
  classLocalPaused: 'browser-paused',

  playerReady: function(){

  },


  /**
   * Load libs, etc.
   */
  init: function($context){

    $(window).trigger('soundManagerReady');

    // set a default (lower vol)
    soundManager.setVolume(app.audioStreaming.defaultVol);

    // Get last browser playlist collection, if any
    var lastList = app.storageController.getStorage(app.audioStreaming.lastListKey);
    if(lastList !== undefined && lastList !== null && lastList.length > 0){
      // when songs are ready, render them
      app.store.libraryCall(function(){
        // get collection based on songids
        app.playlists.playlistGetItems('items', lastList, function(collection){

          if(app.audioStreaming.playList !== undefined){
            app.audioStreaming.playList.items = collection;
            // render it too
            app.audioStreaming.renderPlaylistItems();
            // add as loaded song
            if(collection.models !== undefined && collection.models[0] !== undefined){
              // load the first song
              var song = collection.models[0];
              app.audioStreaming.loadSong(song);
              // update playing song details around the page
              app.audioStreaming.updatePlayingState(song.attributes);
            }
          }


        });
      }, 'songsReady');
    }

    // Wake up our sliders
    app.audioStreaming.progressInit();
    app.audioStreaming.volumeInit();
  },


  /**
   * Toggle what player we are using
   *
   * @param player
   */
  setPlayer: function(player){
    var song,
      $body = $('body');

    // Switch to XBMC Player
    if(player == 'xbmc'){
      $body.addClass(app.audioStreaming.classXbmc).removeClass(app.audioStreaming.classLocal);
      // Homepage Backstretch for xbmc (if applicable)
      song = app.playerState.xbmc.getNowPlaying('item');
      app.helpers.applyBackstretch(song.fanart, 'xbmc');
    }

    // Switch to Local Player
    if(player == 'local'){
      $body.removeClass(app.audioStreaming.classXbmc).addClass(app.audioStreaming.classLocal);
      // if empty, render
      if($('ul.browser-playlist-song-list').length === 0){
        app.audioStreaming.renderPlaylistItems();
      }
      // Homepage Backstretch for local (if applicable)
      song = app.audioStreaming.getNowPlayingSong();
      app.helpers.applyBackstretch((song.fanart !== undefined ? song.fanart : ''), 'local');
    }

  },


  /**
   * Get the current player
   */
  getPlayer: function(){
    // check if body has the local class
    if($('body').hasClass(app.audioStreaming.classLocal)){
      return 'local';
    } else {
      return 'xbmc';
    }
  },


  /**
   * Get currently playing song
   * @returns {*}
   */
  getNowPlayingSong: function(){
    if(app.audioStreaming.playList !== undefined &&
      app.audioStreaming.playList.items.models !== undefined &&
      app.audioStreaming.playList.items.models[app.audioStreaming.playList.playingPosition] !== undefined){
      var model = app.audioStreaming.playList.items.models[app.audioStreaming.playList.playingPosition];
      return model.attributes;
    } else {
      return {};
    }
  },


  /**
   * Plays a position in the current playlist
   * @param pos
   */
    playPosition: function(pos){

    // remove currently playing class
    $('li.browser-player div.playlist-item').removeClass('browser-playing-row');

    if(app.audioStreaming.playList.items.models.length > 0 &&
      app.audioStreaming.playList.items.models[parseInt(pos)] !== undefined){
        var model = app.audioStreaming.playList.items.models[parseInt(pos)].attributes;
        app.audioStreaming.playList.playingPosition = pos;
        app.audioStreaming.loadSong({attributes: model}, function(){
          // play
          app.audioStreaming.play();
          // notify
          app.notification('Playing ' + model.label + ' in the browser');

        });
      } else {
        app.audioStreaming.stop();
      }

    },


  /**
   * Set a collection of songs to be the current playlist
   * @param collection
   */
  setPlaylistItems: function(collection){

    // save ids to local storage
    var ids = [];
    $.each(collection.models, function(i,d){
      if(typeof d.attributes.songid != 'undefined'){
        ids.push(d.attributes.songid);
        collection.models[i].attributes.type = 'song';
      }
    });
    app.storageController.setStorage(app.audioStreaming.lastListKey, ids);

    // update in current playlist state
    app.audioStreaming.playList.items = collection;
  },


  /**
   *  Appends a new collection to the current playlist collection and re-render list
   *
   * @param newCollection
   */
  appendPlaylistItems: function(newCollection, callback){
    // update in current playlist state
    var collection;
    if(app.audioStreaming.playList === undefined){
      // no current playlist extists so just replace
      collection = newCollection;
    } else {
      // append new models to original collection
      collection = app.audioStreaming.playList.items;
      if(collection.models === undefined){
        collection.models = [];
      }
      $.each(newCollection.models, function(i,d){
        collection.models.push(d);
      });
      collection.length = collection.models.length;
    }
    // set this collection as currently playing
    app.audioStreaming.setPlaylistItems(collection);
    // re-render
    app.audioStreaming.renderPlaylistItems();
    // call callback
    if(callback){
      callback();
    }
  },



  /**
   *  Replaces collection / playlist and starts playing
   *
   * @param collection
   */
  replacePlaylistItems: function(collection, callback){
    // set this collection as currently playing
    app.audioStreaming.setPlaylistItems(collection);
    // re-render
    app.audioStreaming.renderPlaylistItems();
    // Load up the song in the first spot
    app.audioStreaming.loadSong(collection.models[0], function(){
      // change view
      app.playlists.changePlaylistView('local');
      // play song
      app.audioStreaming.playPosition(0);
      // call callback
      if(callback){
        callback();
      }
    });
  },


  /**
   * (re)Render browser playlist to screen
   */
  renderPlaylistItems: function(){

    // Protect from dirty data
    if(app.audioStreaming.playList === undefined){
      return;
    }

    // Get Song collection
    var collection = app.audioStreaming.playList.items;

    // items view
    var browserPlaylistItems = new app.CustomPlaylistSongSmallListView({model: collection}).render();
    $(app.audioStreaming.playlistEl).html(browserPlaylistItems.$el);

  },


  /**
   * Clear playlist
   */
  playlistClear: function(callback){
    var c = {models: []};
    app.audioStreaming.setPlaylistItems(c);
    if(callback){
      callback();
    }
  },

  /**
   * Render Playlist
   */
  playlistRender: function(){
    app.audioStreaming.renderPlaylistItems();
  },


  /**
   * Load a song into the browser player (like putting a cd single in the cd player)
   *
   * @param songModel
   *  the song model, must contain a file property
   * @param callback
   */
  loadSong: function(songModel, callback){

    // Stop anything currently playing
    app.audioStreaming.stop();

    // clone sound manager
    var sm = soundManager;

    // song
    var song = songModel.attributes;

    // Get download url
    app.AudioController.downloadFile(song.file, function(url){

      // save id
      app.audioStreaming.currentPlaybackId = 'browser-' + song.songid;

      //kick of soundmanager
      app.audioStreaming.localPlay = sm.createSound({

        // Options
        id: app.audioStreaming.currentPlaybackId,
        url: url,
        autoPlay: false,
        autoLoad: true,
        stream: true,

        // Callbacks
        onerror: function(status) {
          app.helpers.errorHandler('SoundManager failed to load: ' + status.type, status);
        },
        onplay: function(){
          // toggle classes
          $('body').addClass('browser-playing').removeClass('browser-paused');
          app.audioStreaming.updatePlayingState(song);
          // When we start playing a new song it resets the volume to max
          var level = $('#browser-volume').slider('value');
          app.audioStreaming.localPlay.setVolume(level);
          $(window).trigger('browserPlayerStart', [song]);
        },
        onstop: function(){
          // remove classes
          app.audioStreaming.playerStateStop();
        },
        onpause:  function(){
          // toggle classes
          $('body').removeClass('browser-playing').addClass('browser-paused');
          $(window).trigger('browserPlayerStop', [song]);
        },
        onresume:function(){
          // toggle classes
          $('body').addClass('browser-playing').removeClass('browser-paused');
          $(window).trigger('browserPlayerStart', [song]);
        },

        // What happens at then end of a track
        onfinish: function(){

          // vars
          var browserPlaylist = app.audioStreaming.playList,
            items = browserPlaylist.items.models,
            playingPosition = parseInt(browserPlaylist.playingPosition);

          // repeat one song
          if(browserPlaylist.repeat == 'one'){
            app.audioStreaming.playPosition(playingPosition);
          } else if(browserPlaylist.random == 'on') {
            // random
            var rand = app.helpers.getRandomInt(0, (items.length - 1));
            app.audioStreaming.playPosition(rand);
          } else if(browserPlaylist.repeat == 'all'){
            // play all again
            if(items.length == (playingPosition + 1) ){ //if last song
              app.audioStreaming.playPosition(0);  //back to the start
            }
          } else {
            // Normal playback, next track if exists in playlist
            if(items.length > playingPosition){
              // play it
              app.audioStreaming.playPosition((playingPosition + 1));
            } else {
              app.audioStreaming.stop();
            }
          }
        },

        // update player state
        whileplaying: function() {

          var pos = parseInt(this.position) / 1000,
            dur = parseInt(this.duration) / 1000,
            per = Math.round((pos / dur) * 100),
            $time = $('#browser-time'),
            $nowPlaying = $('#browser-now-playing'),
            buffered = Math.round((this.buffered[0] !== undefined ? ((this.buffered[0].end / this.duration) * 100) : 0));

          app.audioStreaming.nowplaying.player = {
            position : pos,
            duration : dur,
            percentage: per
          };

          // time
          $('.time-cur', $time).html(app.helpers.formatTime(app.helpers.secToTime(Math.floor(pos))));
          $('.time-total', $time).html(app.helpers.formatTime(app.helpers.secToTime(Math.floor(dur))));

          //update 100 times per song
          if(per != app.audioStreaming.lastPos){

            // buffer bar
            if(buffered > 0){
              $('#browser-progress-buffer').css('width', buffered + '%');
            }

            // slider
            $(app.audioStreaming.progressEl).slider('value', per );

            // update playing song details around the page
            app.audioStreaming.updatePlayingState(song);

          }
          app.audioStreaming.lastPos = per;

        }

      }); // end sound manager


      // init slider if required
      if(!$(app.audioStreaming.progressEl).hasClass('ui-slider')){
        // set a default (lower vol)
        app.audioStreaming.localPlay.setVolume(app.audioStreaming.defaultVol);
        // define sliders
        app.audioStreaming.progressInit();
        app.audioStreaming.volumeInit();
      }

      if(callback){
        callback();
      }

    }); // end download


  }, // end play song


  updatePlayingState: function(song){
    // image
    $('#browser-playing-thumb').attr('src', app.image.url(song.thumbnail));
    // title
    $('.browser-playing-song-title').html(song.label);
    $('.browser-playing-song-meta').html(song.artist[0]);

    // add playing class to correct item in playlist
    var $playingEl = $('li.browser-player .playlist-pos-' + app.audioStreaming.playList.playingPosition);
    if(!$playingEl.hasClass('browser-playing-row')){
      $playingEl.addClass('browser-playing-row');
    }

    // Set title and play icon
    app.audioStreaming.setTitle('playing', song.label);

    // Homepage Backstretch
    app.helpers.applyBackstretch((song.fanart !== undefined ? song.fanart : ''), 'local');

    // playing song (@todo flickers fix)
    //$('.song').removeClass('playing-row');
    //$('.song[data-id=' + song.songid + ']').addClass('playing-row');
  },


  /**
   * Adds body classes depending on rand/repeat state
   *
   * @param playlist
   */
  bodyRandRepeat: function(){
    var playlist = app.audioStreaming.playList;
    // exit if not init yet

    if(playlist.repeat === undefined){
      return;
    }
    // set repeat/rand state
    var $body = $('body');
    if(typeof app.audioStreaming.playList != 'undefined'){
      $body.removeClass('bp-repeat-one').removeClass('bp-repeat-all').removeClass('bp-repeat-off');
      $body.addClass('bp-repeat-' + playlist.repeat);

      $body.removeClass('bp-random-on').removeClass('bp-random-off');
      $body.addClass('bp-random-' + playlist.random);

      $body.removeClass('bp-mute');
      if(playlist.mute){
        $body.addClass('bp-mute');
      }

    }
  },


  /**
   * Set document title
   */
  setTitle:function (status, title) {
    if(app.audioStreaming.getPlayer() == 'local'){
      document.title = (status == 'playing' ? '▶ ' : '') + (title !== undefined ? title + ' | ' : '') + 'Chorus.'; //doc
    }
  },



  /**
   * Progress slider
   */
  progressInit: function(){

    $(app.audioStreaming.progressEl).slider({
      range: "min",
      step: 1,
      value: 0,
      min: 0,
      max: 100,
      stop: function( event, ui ) {

        // get the percentage then divide by duration
        var newpos = (ui.value / 100) * app.audioStreaming.localPlay.duration;
        newpos = Math.round(newpos);

        // Big thanks to viking@github for providing a solution to setPosition() not working
        // https://gist.github.com/viking/4949374

        var sound = soundManager.getSoundById(app.audioStreaming.currentPlaybackId);
        sound.setPosition(newpos);
//        sound.pause();
//
//
//        _.defer(function(){
//          sound.play({position: newpos});
//        });


       // console.log(app.audioStreaming.currentPlaybackId, newpos);
        // Pause an already loaded and playing song, change position, then resume.
        //var sound = soundManager.getSoundById(app.audioStreaming.currentPlaybackId);
        //sound.pause();

//        // Callback for position set to 0
//        var positionCallback = function(eventPosition) {
//         // this.stop();
//          console.log(this.id, newpos);
//          this.clearOnPosition(0, positionCallback);
//          //this.setPosition(newpos);
//          //this.play({position: newpos});
//          this.resume();
//          //sound.play({position: newpos});
//        };
//        sound.onPosition(0, positionCallback);
//        //sound.play({position: newpos});
//        sound.setPosition(newpos);

      }
    });
  },


  /**
   * Volume slider
   */
  volumeInit: function($context){

    $(app.audioStreaming.volumeEl).slider({
      range: "min",
      step: 5,
      value: app.audioStreaming.defaultVol,
      min: 0,
      max: 100,
      stop: function( event, ui ) {
        app.audioStreaming.localPlay.setVolume(ui.value);
      }
    });
  },


  /**
   * Helper, is playing?
   */
  isPlaying: function(){
    return $('body').hasClass('browser-playing');
  },


  /**
   * Toggle play / pause
   */
  togglePlay: function(){
    if(app.audioStreaming.localPlay !== false){
      // if playing, pause, else play
      if(app.audioStreaming.isPlaying()){
        app.audioStreaming.pause();
      } else {
        app.audioStreaming.play();
      }
    }
  },


  /**
   * a wrapper for playing the current song via sound manaher
   */
  play: function(){
    if(app.audioStreaming.localPlay !== false){
      //play existing with local player
      app.audioStreaming.localPlay.play();
      // switch to local view
      app.audioStreaming.setPlayer('local');
    }
  },


  /**
   * Stop playback of the soundManager object
   */
  stop: function(){
    if(app.audioStreaming.localPlay !== false){
      app.audioStreaming.playerStateStop();
      app.audioStreaming.localPlay.stop(); //stop existing
    }
  },


  /**
   * Set the player state to stopped
   */
  playerStateStop: function(){
    $('body').removeClass('browser-playing').removeClass('browser-paused');
    $(window).trigger('browserPlayerStop', []);
  },


  /**
   * Pause playback of the soundManager object
   */
  pause: function(){
    if(app.audioStreaming.localPlay !== false){
      app.audioStreaming.localPlay.pause(); //pause existing
    }
  },


  /**
   * Find previous song and play it
   */
  prev: function(){
    if(app.audioStreaming.localPlay !== false){
      var pl = app.audioStreaming.playList;
      // at 0 play again
      if(pl.playingPosition === 0){
        app.audioStreaming.playPosition(0);
      } else {
        app.audioStreaming.playPosition((pl.playingPosition - 1));
      }
    }
  },


  /**
   * Find next song and play it
   */
  next: function(){
    if(app.audioStreaming.localPlay !== false){
      var pl = app.audioStreaming.playList;

      // at end 0 is next
      if(pl.playingPosition == (pl.items.models.length - 1)){
        app.audioStreaming.playPosition(0);
      } else {
        app.audioStreaming.playPosition((pl.playingPosition + 1));
      }
    }
  },


  /**
   * mute volume
   */
  mute: function(){
    if(app.audioStreaming.localPlay !== false){

      // vars
      var mute = app.audioStreaming.playList.mute,
        vol =  $(app.audioStreaming.volumeEl).slider('value');

      // toggle
      if(mute){
        // is currently muted, changing to not
        var lastVol = app.helpers.varGet('localMuteLastVol', app.audioStreaming.defaultVol);
        app.audioStreaming.localPlay.setVolume(lastVol);
        $(app.audioStreaming.volumeEl).slider('value',lastVol);
      } else {
        // not muted, but will be
        app.helpers.varSet('localMuteLastVol',  (vol > 5 ? vol : app.audioStreaming.defaultVol));
        app.audioStreaming.localPlay.setVolume(0);
        $(app.audioStreaming.volumeEl).slider('value',0);
      }
      app.audioStreaming.playList.mute = (!mute);
      app.audioStreaming.bodyRandRepeat();
    }
  },


  /**
   * Set repeat state
   */
  repeat: function(){
    if(app.audioStreaming.localPlay !== false){
      var pl = app.audioStreaming.playList, newVal;
      // toggle between 3 different states
      switch(pl.repeat){
        case 'off':
          newVal = 'all';
          break;
        case 'all':
          newVal = 'one';
          break;
        case 'one':
          newVal = 'off';
          break;
      }
      app.audioStreaming.playList.repeat = newVal;

      // set body classes
      app.audioStreaming.bodyRandRepeat();
    }
  },

  /**
   * Set random state
   */
  random: function(){
    if(app.audioStreaming.localPlay !== false){
      // set the opposite
      var pl = app.audioStreaming.playList;
      app.audioStreaming.playList.random = (pl.random == 'off' ? 'on' : 'off');

      // set body classes
      app.audioStreaming.bodyRandRepeat();
    }
  },


  /**
   * delete browser playlist Song
   */
  deleteBrowserPlaylistSong: function(pos){

    var list = app.audioStreaming.playList.items,
      newItems = list.models.filter(function (element) {
        return (element.attributes.pos != pos);
      });

    list.models = newItems;
    list.length = newItems.length;

    app.audioStreaming.setPlaylistItems(list);

  },

  /**
   * Apply a reorder of the playlist
   *
   * @param newList
   *  array of positions as ints
   */
  sortableChangePlaylistPosition: function(newList){

    // reorder collection
    var list = [], collection = app.audioStreaming.playList.items;
    $.each(newList, function(i,d){
      list.push(collection.models[d]);
    });

    // rebuild collection
    collection.models = list;
    collection.length = list.length;

    // save
    app.audioStreaming.setPlaylistItems(collection);
    app.audioStreaming.renderPlaylistItems();
  }

};

