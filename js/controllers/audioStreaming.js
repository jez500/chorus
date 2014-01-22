/**
 * Handles local audio streaming in the browser
 * @type {{}}
 */
app.audioStreaming = {

  // init vars
  localPlay: false,
  nowplaying: { 'init': 1 },
  lastPos: 0,
  progressEl: '#browser-progress-bar',
  volumeEl: '#browser-volume',
  playlistEl: '#playlist-local',

  // local storage
  lastListKey: 'lastBrowserList',

  // body class names
  classLocal: 'player-view-local',
  classXbmc: 'player-view-xbmc',
  classLocalPlaying: 'browser-playing',
  classLocalPaused: 'browser-paused',

  /**
   * Load libs, etc.
   */
  init: function($context){

    //sound manager
    soundManager.url = '/lib/soundmanager/swf/';
    soundManager.preferFlash = true;
    soundManager.flashVersion = 9; // optional: shiny features (default = 8)
    soundManager.useFlashBlock = false;
    soundManager.onready(function() {
      // Ready to use; soundManager.createSound() etc. can now be called.
    });

    app.audioStreaming.$body = $('body');
    app.audioStreaming.$window = $(window);

    // create a local browser playlist object that will contain local player information
    // most importantly is the current playlist
    // @TODO see if exists in local storage
    app.audioStreaming.playList = {
      items: [],
      playingPosition: 0,
      id: 0,
      repeat: 'off',
      random: 'off'
    };


    // Get last browser playlist collection, if any
    var lastList = app.storageController.getStorage(app.audioStreaming.lastListKey);
    console.log(lastList);
    if(lastList != undefined && lastList.length > 0){
      // when songs are ready, render them
      app.store.libraryCall(function(){
        // get collection based on songids
        app.playlists.playlistGetItems('items', lastList, function(collection){
          app.audioStreaming.playList.items = collection;
          console.log(collection);
          // render it too
          app.audioStreaming.renderPlaylistItems();
          // add as loaded song
          if(collection.models != undefined && collection.models[0] != undefined){
            // load the first song
            var song = collection.models[0];
            app.audioStreaming.loadSong(song);
            // update playing song details around the page
            app.audioStreaming.updatePlayingState(song.attributes);
          }

        });
      }, 'songsReady');
    }
  },


  /**
   * Toggle what player we are using
   *
   * @param player
   */
  setPlayer: function(player){

    if(player == undefined || player == ''){ //toggle
      app.audioStreaming.$body.toggleClass(app.audioStreaming.classXbmc).toggleClass(app.audioStreaming.classLocal);
    } else {
      if(player == 'xbmc'){
        app.audioStreaming.$body.addClass(app.audioStreaming.classXbmc).removeClass(app.audioStreaming.classLocal);
      }
      if(player == 'local'){
        app.audioStreaming.$body.removeClass(app.audioStreaming.classXbmc).addClass(app.audioStreaming.classLocal);
        app.audioStreaming.renderPlaylistItems();
      }
    }

  },


  /**
   * Plays a position in the current playlist
   * @param pos
   */
    playPosition: function(pos){

    // remove currently playing class
    $('li.browser-player div.playlist-item').removeClass('browser-playing-row');

    if(app.audioStreaming.playList.items.models.length > 0){
        var model = app.audioStreaming.playList.items.models[parseInt(pos)].attributes;
        app.audioStreaming.playList.playingPosition = pos;
        console.log(model);
        app.audioStreaming.loadSong({attributes: model}, function(){
          // play
          app.audioStreaming.play();
          // notify
          app.notification('Playing ' + model.label + ' in the browser');

        });
      }

    },


  /**
   * Set a collection of songs to be the current playlist
   * @param collection
   */
  setPlaylistItems: function(collection){

    // update in current playlist state
    app.audioStreaming.playList.items = collection;

    // save ids to local storage
    var ids = [];
    $.each(collection.models, function(i,d){
      if(typeof d.attributes.songid != 'undefined'){
        ids.push(d.attributes.songid);
      }
    });
    console.log('ids', ids);
    app.storageController.setStorage(app.audioStreaming.lastListKey, ids);
  },


  /**
   * (re)Render browser playlist to screen
   * @param collection
   */
  renderPlaylistItems: function(){

    // Get Song collection
    var collection = app.audioStreaming.playList.items;

    // items view
    var browserPlaylistItems = new app.CustomPlaylistSongSmallListView({model: collection}).render();
    $(app.audioStreaming.playlistEl).html(browserPlaylistItems.$el);

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

      //kick of soundmanager
      app.audioStreaming.localPlay = sm.createSound({

        // Options
        id:'browser-' + song.songid,
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
        },
        onstop: function(){
          // remove classes
          $('body').removeClass('browser-playing').removeClass('browser-paused');
        },
        onpause:  function(){
          // toggle classes
          $('body').removeClass('browser-playing').addClass('browser-paused');
        },
        onresume:function(){
          // toggle classes
          $('body').addClass('browser-playing').removeClass('browser-paused');
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
            }
          }
        },

        // update player state
        whileplaying: function() {

          var pos = parseInt(this.position) / 1000,
            dur = parseInt(this.duration) / 1000,
            per = Math.round((pos / dur) * 100),
            $time = $('#browser-time'),
            $nowPlaying = $('#browser-now-playing');

          app.audioStreaming.nowplaying.player = {
            position : pos,
            duration : dur,
            percentage: per
          };

          // init slider if required
          if(!$(app.audioStreaming.progressEl).hasClass('ui-slider')){
            // define sliders
            app.audioStreaming.progressInit();
            app.audioStreaming.volumeInit();
          }

          // time
          $('.time-cur', $time).html(app.helpers.secToTime(Math.floor(pos)));
          $('.time-total', $time).html(app.helpers.secToTime(Math.floor(dur)));

          //update 100 times per song
          if(per != app.audioStreaming.lastPos){

            // slider
            $(app.audioStreaming.progressEl).slider('value', per );

            // update playing song details around the page
            app.audioStreaming.updatePlayingState(song);

          }
          app.audioStreaming.lastPos = per;

        }

      }); // end sound manager

      console.log(app.audioStreaming.localPlay);
      //app.audioStreaming.localPlay.play();

      if(callback){
        callback();
      }

    }); // end download


  }, // end play song


  updatePlayingState: function(song){
    // image
    $('#browser-playing-thumb').attr('src', app.parseImage(song.thumbnail));
    // title
    $('.browser-playing-song-title').html(song.label);
    $('.browser-playing-song-meta').html(song.artist[0]);

    // add playing class to correct item in playlist
    var $playingEl = $('li.browser-player .playlist-pos-' + app.audioStreaming.playList.playingPosition);
    if(!$playingEl.hasClass('browser-playing-row')){
      $playingEl.addClass('browser-playing-row')
    }

    // playing song (@todo flickers fix)
    //$('.song').removeClass('playing-row');
    //$('.song[data-id=' + song.songid + ']').addClass('playing-row');
  },


  // Progress Bar
  progressInit: function($context){

    $(app.audioStreaming.progressEl).slider({
      range: "min",
      step: 1,
      value: 0,
      min: 0,
      max: 100,
      stop: function( event, ui ) {
        var params = {
          'playerid': 0,
          'value': ui.value
        };
        // get the percentage then divide by duration
        var newpos = (ui.value / 100) * app.audioStreaming.localPlay.duration;
        newpos = Math.round(newpos);

        app.audioStreaming.localPlay.setPosition(newpos);
      }
    });
  },

  // volume Bar
  volumeInit: function($context){

    $(app.audioStreaming.volumeEl).slider({
      range: "min",
      step: 5,
      value: 100,
      min: 0,
      max: 100,
      stop: function( event, ui ) {
        app.audioStreaming.localPlay.setVolume(ui.value);
      }
    });
    console.log('vol', $('#browser-volume'));
  },

  // is playing
  isPlaying: function(){
    return $('body').hasClass('browser-playing');
  },

  // Controls
  togglePlay: function(){
    if(app.audioStreaming.localPlay != false){
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
    if(app.audioStreaming.localPlay != false){
      //play existing with local player
      app.audioStreaming.localPlay.play();
      // switch to local view
      app.audioStreaming.setPlayer('local');
    }
  },

  stop: function(){
    if(app.audioStreaming.localPlay != false){
      app.audioStreaming.localPlay.stop(); //play existing
    }
  },

  pause: function(){
    if(app.audioStreaming.localPlay != false){
      app.audioStreaming.localPlay.pause(); //pause existing
    }
  },

  prev: function(){
    if(app.audioStreaming.localPlay != false){
      var pl = app.audioStreaming.playList;
      // at 0 play again
      if(pl.playingPosition == 0){
        app.audioStreaming.playPosition(0);
      } else {
        app.audioStreaming.playPosition((pl.playingPosition - 1));
      }
    }
  },

  next: function(){
    if(app.audioStreaming.localPlay != false){
      var pl = app.audioStreaming.playList;

      // at end 0 is next
      if(pl.playingPosition == (pl.items.models.length - 1)){
        app.audioStreaming.playPosition(0);
      } else {
        app.audioStreaming.playPosition((pl.playingPosition + 1));
      }
    }
  }




//  /**
//   * Adds a playlist id to the local browser playlist
//   * Then starts playing at a given position
//   *
//   * @param delta
//   *  playlist id
//   * @param position
//   *  position to play 0 = first
//   */
//  playInBrowser: function(type, delta, position){
//
//    app.playlists.playlistGetItems(type, delta, function(collection){
//
//      var items = [],
//        position = (typeof position != 'undefined' ? position : 0);
//
//      // parse from a collection into an array of data objects
//      _.each(collection.models, function(model){
//        items.push(model.attributes);
//      });
//
//      // Set the playlist
//      app.audioStreaming.playList.items = items;
//      app.audioStreaming.playList.id = type + ':' + delta;
//
//      // playing info
//      app.audioStreaming.playList.playingPosition = position;
//      app.audioStreaming.playList.playingItem = items[position];
//
//
//    });
//
//  },




};