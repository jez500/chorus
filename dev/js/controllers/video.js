
app.VideoController = {

  playlistId: 1, // video activePlayer
  currentPlaylist: [] // cache of current video playlist

};


/**
 * Play Video
 * @param id
 *  int of id to add
 * @param type
 *  eg. movieid
 * @param callback
 *  result
 */
app.VideoController.playVideoId = function(id, type, callback){
  console.log(type);
  // clear playlist
  app.VideoController.playlistClear(function(){
    console.log('cleard');
    // Add video to playlist based on type/id
    app.VideoController.addToPlaylist(id, type, 'add', function(data){
      console.log(data);
      app.VideoController.playPlaylistPosition(0, function(play){
        callback(data.result);
      });
    });
  });

};


/**
 * Play something from playlist
 *
 * @param id
 *  int of id to add
 * @param type
 *  eg. movieid
 * @param position
 *  add to append, or an int to insert at that position
 * @param callback
 *  result
 */
app.VideoController.addToPlaylist = function(id, type, position, callback ){
  var f = {};
  f[type] = id;
  console.log(f);

  if(position == 'add'){
    app.xbmcController.command('Playlist.Add', [app.VideoController.playlistId, f], function(result){
      callback(result.result); // return items
    });
  }

};


/**
 * Play something from playlist
 *
 * @param position
 * @param callback
 */
app.VideoController.playPlaylistPosition = function(position, callback ){
  app.xbmcController.command('Player.Open', [{"playlistid": app.VideoController.playlistId,"position":position}], function(result){
    callback(result.result); // return items
  });
};



/**
 * Clear the playlist
 *
 * @param callback
 */
app.VideoController.playlistClear = function(callback){
  // clear playlist
  app.xbmcController.command('Playlist.Clear', [app.VideoController.playlistId], function(data){
    if(callback){
      callback(data);
    }
  });
};


/**
 * Get items from playlist
 */
app.VideoController.getPlaylistItems = function(callback){
  app.playlists.getXbmcPlaylist(app.VideoController.playlistId, callback);
};

/**
 * Refresh the playlist
 * @param callback
 */
app.VideoController.playlistRender = function(callback){
  app.playlists.renderXbmcPlaylist(app.VideoController.playlistId, callback);
};


/**
 * Remove something from playlist
 */
app.VideoController.removePlaylistPosition = function(position, callback ){
  app.xbmcController.command('Playlist.Remove', [app.VideoController.playlistId, position], function(result){
    callback(result.result); // return items
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
app.VideoController.playlistSwap = function(pos1, pos2, callback){
  app.playlists.playlistSwap(app.VideoController.playlistId, 'movieid', pos1, pos2, callback);
};
