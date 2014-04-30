
app.AudioController = {

  // playlist defaults
  playlistId: 0, // 0 = audio

  currentPlaylist: {
    'items': [],
    'status': 'none'
  }

};


/**
 * Refresh the playlist
 * @param callback
 */
app.AudioController.playlistRender = function(callback){
  app.playlists.renderXbmcPlaylist(app.AudioController.playlistId, callback);
};




/**
 * Adds an artist/album/song to the playlist
 * @param type
 *  eg. artistid, albumid, songid
 * @param id
 *  value of type
 *
 */
app.AudioController.playlistAdd = function(type, id, callback){

  var filter = {};
  filter[type] = id;

  //add the album to the playlist
  app.xbmcController.command('Playlist.Add', [app.AudioController.playlistId,filter], function(data){

    //get playlist items
    app.AudioController.getPlaylistItems(function(result){

      //update cache
      app.AudioController.currentPlaylist = result;

      callback(result);

    });
  });

};


/**
 * Adds multiple artist/album/song to the playlist
 * @param type
 *  eg. artistid, albumid, songid
 * @param id
 *  value of type
 *
 */
app.AudioController.playlistAddMultiple = function(type, ids, callback){

  var commands = [],  id;
  for(var n in ids){
    param = {};
    id = ids[n];
    // used only for songs, switches between file and id depending on var type
    if(type == 'mixed'){
      type = (typeof id == 'number' ? 'songid' : 'file');
    }
    param[type] = id;
    commands.push({method: 'Playlist.Add', params: [app.AudioController.playlistId,param]});
  }

  //add the album to the playlist
  app.xbmcController.multipleCommand(commands, function(data){

    //get playlist items
    app.AudioController.getPlaylistItems(function(result){

      //update cache
      app.AudioController.currentPlaylist = result;

      callback(result);

    });
  });

};


/**
 * Swap the position of an item in the playlist
 *
 * @param pos1
 *  current playlist position
 * @param pos2
 *  new playlist position
 *  @param callback
 */
app.AudioController.playlistSwap = function(pos1, pos2, callback){
  app.playlists.playlistSwap(app.AudioController.playlistId, 'songid', pos1, pos2, callback);
};



/**
 * Clear then adds an artist/album/song to the playlist
 * @param type
 *  eg. artistid, albumid, songid
 * @param id
 *  value of type
 *
 */
app.AudioController.playlistClearAdd = function(type, id, callback){

  // clear playlist
  app.xbmcController.command('Playlist.Clear', [app.AudioController.playlistId], function(data){
    app.notification('Playlist Cleared');
    app.AudioController.playlistAdd(type, id, callback);
  });

};


/**
 * Clear the playlist
 */
app.AudioController.playlistClear = function(callback){
  // clear playlist
  app.xbmcController.command('Playlist.Clear', [app.AudioController.playlistId], function(data){
    if(callback){
      callback(data);
    }
  });
};


/**
 * Adds an an artist/album/song to the playlist then starts playing
 * @param playSongId
 *  song to play
 * @param type
 *  eg. artistid, albumid, songid
 * @param id
 *  value of type
 *
 */
app.AudioController.playlistPlaySongId = function(playSongId, callback){

    //@TODO: fix below to be nicer

    //find the song and play it
    var playing = false;
    $.each(app.AudioController.currentPlaylist.items, function(i,d){
      //matching song!
      if(d.id == playSongId && playing === false){
        app.AudioController.playPlaylistPosition(i, function(data){
          //update playlist
          app.AudioController.playlistRender();
          //notify
          app.notification('Now playing "' + d.label + '"');
        });
        playing = true;
      }
    });

};





/**
 * Play Song
 */
app.AudioController.playSongById = function(songid, type, id, clearList){

  if(app.helpers.exists(clearList) && clearList === true){
    // clear playlist first
    app.AudioController.playlistClearAdd( type, id, function(result){
      app.AudioController.playlistPlaySongId(songid);
    });
  } else {
    //just add
    app.AudioController.playlistAdd( type, id, function(result){
      app.AudioController.playlistPlaySongId(songid);
    });
  }

};


/**
 * Insert and play
 * @param type
 * @param id
 * @param callback
 */
app.AudioController.insertAndPlay = function(type, id, callback){
  app.playlists.insertAndPlay(app.AudioController.playlistId, type, id, callback);
};



/**
 * Player Open (raw call, avoids playlist)
 * Use sparingly
 *
 * @param type
 * @param id
 * @param callback
 */
app.AudioController.playerOpen = function(type, id, callback){
  app.playlists.playerOpen(app.AudioController.playlistId, type, id, callback);
};


/**
 * Gets a download url for a file
 * @param file
 * @param callback
 */
app.AudioController.downloadFile = function(file, callback){
  app.xbmcController.command('Files.PrepareDownload', [ file ], function(result){
    if(callback){
      callback(result.result.details.path);
    }
  });
};


/**
 * Generic player command with to callback required
 */
app.AudioController.sendPlayerCommand = function(command, param){
  app.xbmcController.command(command, [ app.playerState.xbmc.getNowPlaying('activePlayer'), param], function(result){
    app.AudioController.updatePlayerState();
  });
};

/**
 * Play something from playlist
 */
app.AudioController.playPlaylistPosition = function(position, callback ){
  app.xbmcController.command('Player.Open', [{"playlistid": app.AudioController.playlistId,"position":position}], function(result){
    callback(result.result); // return items
  });
};


/**
 * Remove something from playlist
 */
app.AudioController.removePlaylistPosition = function(position, callback ){
  app.xbmcController.command('Playlist.Remove', [app.AudioController.playlistId,position], function(result){
    callback(result.result); // return items
  });
};



/**
 * Seek curently playing to a percentage
 */
app.AudioController.seek = function(position, callback ){
  app.xbmcController.command('Player.Seek', [app.playerState.xbmc.getNowPlaying('activePlayer'), position], function(result){
    if(app.helpers.exists(callback)){
      callback(result.result); // return items
    }
  });
};

/**
 * Get items from playlist
 */
app.AudioController.getPlaylistItems = function(callback){
  app.playlists.getXbmcPlaylist(app.AudioController.playlistId, callback);
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

  });

};


/**
 * Party mode
 */
app.AudioController.setPartyMode = function(callback){
  app.playlists.setPartyMode(app.AudioController.playlistId, callback);
};



/**
 * Get now playing
 */

app.AudioController.getNowPlayingSong = function(callback, forceFull){

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
    app.notification('No connection to XBMC for 10mins! I\'ll check if it\'s there less often now ');
  }
  // 30 mins with no connection - increase throttle ((20min * 60sec) / (6throttle * 5interval)) + 30previousThrottle = 40
  if(app.counts['503total'] > 70){
    throttle = 12;
    app.notification('No connection to XBMC for 30mins! I\'m pretty sure it has gone walkabout');
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
    app.notification('Lost connection to XBMC');
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

};

/**
 * Kick off a refresh of playing state, using set interval
 */
var stateTimeout = {};
app.AudioController.updatePlayerState = function(){
  // apply connected class
  var $b = $('body'), nc = 'notconnected'; //set if connected or not
  if(app.state == nc){
    $b.addClass(nc);
  } else {
    $b.removeClass(nc);
  }

  // Do a lookup, pass websocket state
  app.AudioController.getNowPlayingSong(function(data){
    app.shellView.updateState(data);
  }, !app.notifications.wsActive);

};