
app.AudioController = {

  // playlist defaults
  playlistId: 0, // 0 = audio

  currentPlaylist: {
    'items': [],
    'status': 'none'
  }

};



app.AudioController.refreshPlaylist = function(callback){

  app.AudioController.getPlaylistItems(function(result){

    app.playlistView = new app.PlaylistView({model:{models:result.items}});
    $('.sidebar-items').html(app.playlistView.render().el);

    app.AudioController.getNowPlaying(function(data){
      console.log('now playing',data);
    });

    if(app.helpers.exists(callback)){
      callback(result);
    }

  });

};

/**
 * Play Song
 */
app.AudioController.playSongById = function(songid, albumid, clearList){

  if(app.helpers.exists(clearList) && clearList === true){
    // clear playlist first
    app.xbmcController.command('Playlist.Clear', [app.AudioController.playlistId], function(data){
      app.notification('Playlist Cleared');
      app.AudioController.playSongInAlbum(songid, albumid);
    });
  } else {
    //just add the album
    app.AudioController.playSongInAlbum(songid, albumid);
  }



};

/**
 * Adds an album to the playlist and starts playing the given songid
 * @param songid
 * @param albumid
 */
app.AudioController.playSongInAlbum = function(songid, albumid){
  //add the album to the playlist
  app.xbmcController.command('Playlist.Add', [app.AudioController.playlistId,{'albumid':albumid}], function(data){

    //get playlist items
    app.AudioController.getPlaylistItems(function(result){

      //update cache
      app.AudioController.currentPlaylist = result;

      //find the song and play it
      var playing = false;
      $.each(app.AudioController.currentPlaylist.items, function(i,d){
        //matching song!
        if(d.id == songid && playing === false){
          app.AudioController.playPlaylistPosition(i, function(data){
            //update playlist
            app.AudioController.refreshPlaylist();
            //notify
            app.notification('Now playing "' + d.label + '"');
          });
          playing = true;
        }
      });

    })
  });
};


/**
 * Generic player command with to callback required
 */
app.AudioController.sendPlayerCommand = function(command, param){
  app.xbmcController.command(command, [ app.cached.nowPlaying.activePlayer, param], function(result){
    app.AudioController.updatePlayerState();
  });
};

/**
 * Play something
 */
app.AudioController.playPlaylistPosition = function(position, callback ){
  app.xbmcController.command('Player.Open', [{"playlistid": app.AudioController.playlistId,"position":position}], function(result){
    callback(result.result); // return items
  });
};


/**
 * Seek curently playing to a percentage
 */
app.AudioController.seek = function(position, callback ){
  app.xbmcController.command('Player.Seek', [app.AudioController.playlistId, position], function(result){
    if(app.helpers.exists(callback)){
      callback(result.result); // return items
    }
  });
};

/**
 * Get items from playlist
 */
app.AudioController.getPlaylistItems = function(callback){
  app.xbmcController.command('Playlist.GetItems', [app.AudioController.playlistId, ['albumid', 'artistid', 'thumbnail', 'file']], function(result){
    callback(result.result); // return items
  });
};

/**
 * Set Volume
 */
app.AudioController.setVolume = function(val){
  app.xbmcController.command('Application.SetVolume', [val], function(data){
    //volume set
    //app.AudioController.updatePlayerState();
  });
};


/**
 * Library Scan
 */
app.AudioController.audioLibraryScan = function(){

  app.xbmcController.command('AudioLibrary.Scan', [], function(data){
    console.log(data);
  });

};


/**
 * Get now playing
 */

app.AudioController.getNowPlaying = function(callback){

  var fields = {
    item: ["title", "artist", "artistid", "album", "albumid", "genre", "track", "duration", "year", "rating", "playcount", "albumartist", "file", "thumbnail"],
    player: [ "playlistid", "speed", "position", "totaltime", "time", "percentage", "shuffled", "repeat", "canrepeat", "canshuffle", "canseek" ]
  };
  var ret = {'status':'notPlaying', 'item': {}, 'player': {}, 'activePlayer': 0, 'volume': 0};

  app.xbmcController.command('Application.GetProperties', [["volume", "muted"]], function(properties){
    //get volume level
    ret.volume = properties.result;
    app.xbmcController.command('Player.GetActivePlayers', [], function(players){

      app.AudioController.activePlayers = players.result;

      if(players.result.length > 0){
        //something is playing
        ret.activePlayer = players.result[0].playerid;
        app.xbmcController.command('Player.GetItem', [ret.activePlayer, fields.item], function(item){
          ret.item = item.result.item;
          ret.status = 'playing';

          app.xbmcController.command('Player.GetProperties', [ret.activePlayer, fields.player], function(player){
            ret.player = player.result;
            app.cached.nowPlaying = ret;
            callback(ret);
          });

        });
      } else {
        //nothing playing
        app.cached.nowPlaying = ret;
        callback(ret);
      }

    });

  });



};

/**
 * Kick off a refresh of playing state
 */
var stateTimeout = {};
app.AudioController.updatePlayerState = function(){
  clearTimeout(stateTimeout);
  app.AudioController.getNowPlaying(function(data){
    app.shellView.updateState(data);
    stateTimeout = setTimeout(app.AudioController.updatePlayerState, 5000);
  });
};