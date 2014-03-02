
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

  // clear playlist
  app.VideoController.playlistClear(function(){

    // Add video to playlist based on type/id
    app.VideoController.addToPlaylist(id, type, 'add', function(data){

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


/**
 * Load an array of video ids
 * @TODO merge with audio version of this
 *
 * @param items
 *  an array of movieid's or objects with a file property
 * @param callback
 *  returns loaded items
 * @returns {Array}
 */
app.VideoController.movieLoadMultiple = function(items, callback){
  app.xbmcController.entityLoadMultiple('movie', items, callback);
};


/**
 * Adds multiple movies or episodes to the playlist
 * @param type
 *  eg. movieid, episodeid
 * @param ids
 *  value of type
 * @param callback
 */
app.VideoController.playlistAddMultiple = function(type, ids, callback){

  var commands = [],  id;
  for(var n in ids){
    param = {};
    id = ids[n];

    // used only for items not in the library
    if(type == 'mixed'){
      type = (typeof id == 'number' ? type : 'file');
    }
    param[type] = id;
    commands.push({method: 'Playlist.Add', params: [app.VideoController.playlistId, param]});
  }

  //add the album to the playlist
  app.xbmcController.multipleCommand(commands, function(data){

    //get playlist items
    app.VideoController.getPlaylistItems(function(result){

      //update cache
      app.VideoController.currentPlaylist = result;
      console.log('playing xxxx');
      callback(result);

    });
  });

};




/**
 * Append a tvshow, season or episode to the video playlist
 *
 * @param model
 *  must contain the `type` property
 *  @param callback
 */
app.VideoController.tvshowAdd = function(model, callback){

  var opt = {};

  console.log(model);

  // Add single episode, easy
  if(model.type == 'episode'){
    app.VideoController.addToPlaylist(model.episodeid, 'episodeid', 'add', callback);
    return;
  }

  // otherwise we must get a collection of episode ids to add
  var collection = new app.TvepisodeCollection(), items = [];

  // always has a tv id
  opt.tvshowid = parseInt(model.tvshowid);

  // add a season if required
  if(model.type == 'season'){
    opt.season = model.season;
  }

  // success
  opt.success = function(data){
    for(i in data.models){
      items.push(data.models[i].attributes.episodeid)
    }
    // Add the array and callback
    app.VideoController.playlistAddMultiple('episodeid', items, callback);
  };

  // do it!
  collection.fetch(opt);

};


/**
 * same as tvshowAdd but clears the playlist first and plays after
 *
 * @param model
 *  must contain the `type` property
 *  @param callback
 */
app.VideoController.tvshowPlay = function(model, callback){

  // clear
  app.VideoController.playlistClear(function(){

    // Add items
    app.VideoController.tvshowAdd(model, function(){

      // xbmc player
      app.playlists.changePlaylistView('xbmc');
      // play first pos
      console.log('playing 0');
      app.VideoController.playPlaylistPosition(0, function(data){
        //callback
        callback();
      });
    });
  });

};
