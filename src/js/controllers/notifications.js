/**
 * Deal with notifications from Kodi using web sockets
 * http://kodi.wiki/view/JSON-RPC_API/v6#Notifications_2
 *
 * NOTE: for this to work You need to "Allow programs on other systems to control Kodi"
 */


app.notifications = {

  // connection - note does not work if using IP when on localhost
  wsConn: 'ws://' + location.hostname + ':9090/jsonrpc?chorus',

  // other scripts check this to see if web sockets is handling things
  wsActive: false,

  // playlist add timeout object
  plTimeout: {},

  inputTimeout: false,

  /**
   * Kick off our connection and bind callbacks
   */
  init: function(){

    var self = app.notifications;

    // do we have web sockets?
    if ("WebSocket" in window) {

      // websocket obj
      var ws = new WebSocket(self.wsConn);

      // open connection
      ws.onopen = function(e){
        // do an initial update prior to setting sockets to active
        self.getNowPlaying();
        // websockets is working!
        console.log('Using Websockets');
        app.notifications.wsActive = true;
      };

      // bind errors
      ws.onerror = function(e){
        console.log('socket error', e);
      };

      // bind message
      ws.onmessage = function(e){
        self.onMessage( self.parseResponse(e) );

      };

      // bind close
      ws.onclose = function (e) {
        console.log('socket closed', e);
        app.notifications.wsActive = false;
      };

    }

  },


  /**
   * Get the data from response
   * @param response
   * @returns {*}
   */
  parseResponse: function(response){
    return jQuery.parseJSON(response.data);
  },


  /**
   * ws connection closed
   * @param e
   */
  onClose: function(e){
    // websockets not working
    app.notifications.wsActive = false;
  },


  /**
   * Deal with messages
   * @param data
   */
  onMessage: function(data){

    // if we are getting messages, xbmc is reachable
    app.counts[503] = 0;
    app.counts['503total'] = 0;
    app.state = 'connected';

    var self = app.notifications,
      $window = $(window);

    // Action based on method
    switch (data.method) {

      // playback started
      case 'Player.OnPlay':
        self.getNowPlaying();
        app.ui.timerStart();
        break;

      // playback stopped
      case 'Player.OnStop':
        self.getNowPlaying();
        app.ui.timerStop();
        break;

      // eg. shuffled, repeat, partymode
      case 'Player.OnPropertyChanged':
        console.log(data.params.data);
        app.cached.nowPlaying.player = $.extend(app.playerState.xbmc.getNowPlaying('player'), data.params.data.property);
        self.updateState();
        break;

      // playback pause
      case 'Player.OnPause':
        app.cached.nowPlaying.player.pause = 0;
        self.updateState();
        app.ui.timerStop();
        break;

      // progress changed
      case 'Player.OnSeek':
        self.getNowPlaying();
        break;

      // list cleared
      case 'Playlist.OnClear':
      // list add
      case 'Playlist.OnAdd':
      // list remove
      case 'Playlist.OnRemove':
        self.updatePlaylist(data.params.data.playlistid);
        break;

      // volume change
      case 'Application.OnVolumeChanged':
        app.cached.nowPlaying.volume = data.params.data;
        self.updateState();
        break;

      // Video Library scan
      case 'VideoLibrary.OnScanStarted':
        break;

      // Video Library scan end
      case 'VideoLibrary.OnScanFinished':
        app.notification('Video Library scan complete');
        if(app.helpers.arg(0) == 'scan'){
          $('#content').html('<div class="loading-box">Video Library Scan Complete</div>');
        }
        break;

      // Audio Library scan
      case 'AudioLibrary.OnScanStarted':
        break;

      // Audio Library scan end
      case 'AudioLibrary.OnScanFinished':
        app.notification('Audio Library scan complete');
        if(app.helpers.arg(0) == 'scan'){
          $('#content').html('<div class="loading-box">Audio Library Scan Complete</div>');
        }
        break;

      // input box has opened
      case 'Input.OnInputRequested':
        $window.trigger('Input.OnInputRequested');
        var wait = 60;

        // We set a timeout for {wait} seconds for a fallback for no input
        // this is to prevent an open dialog preventing api requests
        app.notifications.inputTimeout = setTimeout(function(){
          var msg = '<p>About ' + wait + ' seconds ago, an input dialog opened on Kodi and it is still open! To prevent ' +
            'a mainframe implosion, you should probably give me some text. I don\'t really care what it is at this point, ' +
            'why not be creative? Do you have a <a href="http://goo.gl/PGE7wg" target="_blank">word of the day</a>? I won\'t tell...</p>';
          app.xbmcController.inputRequestedDialog(msg);
        }, (1000 * wait));

        break;

      // input box has closed
      case 'Input.OnInputFinished':
        $window.trigger('Input.OnInputFinished');
        clearTimeout(app.notifications.inputTimeout);
        app.helpers.dialogClose();
        break;

      // xbmc shutdown
      case 'System.OnQuit':
        app.notification('Kodi has quit');
        break;
    }

  },


  /***************************************
   * Helpers
   **************************************/


  /**
  * call now a now playing update and state update
  * does a full load of current state
  */
  getNowPlaying: function(){
    app.playerState.xbmc.fetchRemote(function(data){
      app.shellView.updateState(data);
    }, true);
  },


  /**
  * update the player state based ion current app.cached.nowPlaying data
  */
  updateState: function(){
    app.shellView.updateState( app.playerState.xbmc.getNowPlaying() );
  },


  /**
  * update a given playlistId
  */
  updatePlaylist: function(playlistId){
    // defer for 1 second in case multiple items are being added
    clearTimeout(app.notifications.plTimeout);
    app.notifications.plTimeout = setTimeout(function(){
      // switch on playlist type
      if(playlistId === 0){
        app.AudioController.playlistRender();
      } else if(playlistId == 1){
        app.VideoController.playlistRender();
      }
    }, 1000);
  }


};