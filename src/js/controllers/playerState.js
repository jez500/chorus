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

