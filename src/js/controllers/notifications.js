/**
 * Deal with notifications from xbmc using web sockets
 * http://wiki.xbmc.org/?title=JSON-RPC_API/v6#Notifications_2
 *
 * NOTE: for this to work You need to "Allow programs on other systems to control XBMC"
 */


app.notifications = {

  // connection - note does not work if using IP when on localhost
  wsConn: 'ws://' + location.hostname + ':9090/jsonrpc?chorus',

  // other scripts check this to see if web sockets is handling things
  wsActive: false,

  // playlist add timeout object
  plTimeout: {},

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
    console.log('socket message', data);

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
        break;

      // playback stopped
      case 'Player.OnStop':
        self.getNowPlaying();
        break;

      // eg. shuffled, repeat, partymode
      case 'Player.OnPropertyChanged':
        app.cached.nowPlaying.player = $.extend(app.cached.nowPlaying.player, data.params.data.property);
        self.updateState();
        break;

      // playback pause
      case 'Player.OnPause':
        app.cached.nowPlaying.player.pause = 0;
        self.updateState();
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
        console.log(data.params.data);
        app.cached.nowPlaying.volume = data.params.data;
        self.updateState();
        break;

      // Video Library scan
      case 'VideoLibrary.OnScanStarted':
        break;

      // Video Library scan end
      case 'VideoLibrary.OnScanFinished':
        app.notification('Video Library scan complete');
        break;

      // Audio Library scan
      case 'AudioLibrary.OnScanStarted':
        break;

      // Audio Library scan end
      case 'AudioLibrary.OnScanFinished':
        app.notification('Audio Library scan complete');
        break;

      // input box has opened
      case 'Input.OnInputRequested':
        $window.trigger('Input.OnInputRequested');
        break;

      // input box has closed
      case 'Input.OnInputFinished':
        $window.trigger('Input.OnInputFinished');
        break;

      // xbmc shutdown
      case 'System.OnQuit':
        app.notification('XBMC has quit');
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
    app.AudioController.getNowPlayingSong(function(data){
      app.shellView.updateState(data);
    }, true);
  },


  /**
  * update the player state based ion current app.cached.nowPlaying data
  */
  updateState: function(){
    app.shellView.updateState(app.cached.nowPlaying);
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