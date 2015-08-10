/**
 * Looks after all the logic behind current player state
 * eg. now playing, volume, etc.
 *
 * @type {}
 * app.playerState.xbmc.getNowPlaying
 */

app.playerState = {


  /*****************************************************
   * Remote XBMC player
   *****************************************************/
  xbmc: {

    /**
     * Gets a cached version of what is playing, no callback
     * This should be the way all things retrieve nowPlaying info
     * it keeps up to date by fetch()
     *
     * @param key
     * @returns {*}
     */
    getNowPlaying: function(key){
      // A empty shell of what should be populated
      var model = {
        activePlayer: 0,
        status: "notPlaying",
        playingItemChanged: false,
        volume: {
          volume: 50,
          muted: false
        },
        player: {
          repeat: "off",
          shuffled: false,
          partymode: false
        },
        item: {
          thumbnail: '', fanart: '', id: 0, label: 'Nothing Playing', songid: 0, episodeid: 0, album: '', albumid: 'file', file: '', duration: 0, type: 'song'
        }
      };

      // get cache
      var data = app.cached.nowPlaying;
      if(data !== undefined){
        // update model with cache
        model = $.extend(model, data);
      }

      // return key or all
      if(key !== undefined){
        return model[key];
      } else {
        return model;
      }

    },


    /**
     * Kick off a refresh of playing state, a wrapper for fetchData()
     * no callback
     */
    fetch: function(){

      // apply connected class
      //@TODO manage this better
      var $b = $('body'), nc = 'notconnected'; //set if connected or not
      if(app.state == nc){
        $b.addClass(nc);
      } else {
        $b.removeClass(nc);
      }

      // Do a lookup, pass websocket state
      app.playerState.xbmc.fetchRemote(function(data){
        app.shellView.updateState(data);
      }, !app.notifications.wsActive);

    },


    /**
     * Do a remote fetch to get the current playing data and player state
     *
     * @param callback
     * @param forceFull
     */
    fetchRemote: function(callback, forceFull){

      if(forceFull === undefined){
        forceFull = false;
      }

      // this is a rather hefty function that gets called every 5 sec so we throttle with error counts
      // only execute when 0

      // throttle skips this number of checks before checking again
      var throttle = 4;
      // 10 mins with no connection - increase throttle
      if(app.counts['503total'] > 30){
        throttle = 6;
        app.notification('No connection to Kodi for 10mins! I\'ll check if it\'s there less often now ');
      }
      // 30 mins with no connection - increase throttle ((20min * 60sec) / (6throttle * 5interval)) + 30previousThrottle = 40
      if(app.counts['503total'] > 70){
        throttle = 12;
        app.notification('No connection to Kodi for 30mins! I\'m pretty sure it has gone walkabout');
      }

      // reset count to 0 if at throttle
      if(app.counts[503] > throttle){
        app.counts[503] = 0;
        app.counts['503total']++;
      }

      if(app.counts[503] !== 0){
        // up the count and set the state
        app.counts[503]++;
        app.state = 'notconnected';
        if(app.counts[503] == 3){
          app.notification('Lost connection to Kodi');
        }
        return;
      } else {
        // up the count so gets checked on success
        app.counts[503] = 1;
      }


      // fields to get
      var fields = {
        item: app.fields.get('playlistItem'),
        player: [ "playlistid", "speed", "position", "totaltime", "time", "percentage", "shuffled", "repeat", "canrepeat", "canshuffle", "canseek", "partymode" ]
      };
      var ret = {'status':'notPlaying'},
        notPlayingRet = {'status':'notPlaying', 'item': {}, 'player': {}, 'activePlayer': 0, 'volume': 0},
        commands = [];

      // first commands to run

      commands = [
        {method: 'Player.GetActivePlayers', params: []}
      ];

      if(forceFull){
        commands.push({method: 'Application.GetProperties', params: [["volume", "muted"]]});
      }

      // first run
      app.xbmcController.multipleCommand(commands, function(data){

        var players = data[0];

        // success set count to 0
        app.counts[503] = 0;
        app.counts['503total'] = 0;
        app.state = 'connected';

        // set some values
        app.AudioController.activePlayers = players.result;

        if(forceFull){
          var properties = data[1];
          ret.volume = properties.result;
        }

        if(players.result.length > 0 || forceFull){
          //something is playing or forced
          ret.activePlayer = (players.result[0] !== undefined ? players.result[0].playerid : 0);

          app.state = 'playing';

          // second run commands
          commands = [
            {method: 'Player.GetProperties', params: [ret.activePlayer, fields.player]}
          ];

          // get item if full payload
          if(forceFull){
            commands.push({method: 'Player.GetItem', params: [ret.activePlayer, fields.item]});
          }

          // run second lot
          app.xbmcController.multipleCommand(commands, function(item){
            // get data
            ret.status = 'playing';
            ret.player = item[0].result;

            // update the item if full payload
            if(players.result.length > 0 && forceFull){
              ret.item = item[1].result.item;
              ret.item.list = 'xbmc';
            }

            // set cache
            app.cached.nowPlaying = $.extend(app.cached.nowPlaying, ret);

            // callback
            if(callback){
              callback( app.playerState.xbmc.getNowPlaying() );
            }

          });

        } else {

          //nothing playing
          app.cached.nowPlaying = $.extend(app.cached.nowPlaying, ret);
          callback( app.playerState.xbmc.getNowPlaying() );

        }

      });

    }


  },



  /******************************************************
   * Local Browser player
   *****************************************************/
  local: {

  },



  /******************************************************
   * Common helpers
   *****************************************************/
  common: {

  }


};

