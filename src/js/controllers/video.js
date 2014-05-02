
app.VideoController = {

  playlistId: 1, // video activePlayer
  currentPlaylist: [], // cache of current video playlist
  subtitle: 'on' // just for toggling, doesn't set anything

};


/**
 * Play Video
 * @param id
 *  int of id to add
 * @param type
 *  eg. movieid
 * @param model
 *  used for resume
 * @param callback
 *  result
 */
app.VideoController.playVideoId = function(id, type, model, callback){

  // clear playlist
  app.VideoController.playlistClear(function(){

    // Add video to playlist based on type/id
    app.VideoController.addToPlaylist(id, type, 'add', function(data){

      // play
      app.VideoController.playPlaylistPosition(0, function(play){

        // resume
        app.VideoController.resumeVideo( model, callback );

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
 * Wrapper for addToPlaylist to be interchangeable with AudioController
 *
 * @param type
 * @param id
 * @param callback
 */
app.VideoController.playlistAdd = function(type, id, callback){
  app.VideoController.addToPlaylist(id, type, 'add', callback);
};


/**
 * Play something from playlist
 *
 * @param position
 * @param callback
 */
app.VideoController.playPlaylistPosition = function(position, callback ){
  app.playlists.playlistPlayPosition(app.VideoController.playlistId, position, callback);
};


/**
 * Insert and play
 * @param type
 * @param id
 * @param callback
 */
app.VideoController.insertAndPlay = function(type, id, callback){
  app.playlists.insertAndPlay(app.VideoController.playlistId, type, id, callback);
};



/**
 * Player Open (raw call, avoids playlist)
 * Use sparingly
 *
 * @param type
 * @param value
 * @param callback
 */
app.VideoController.playerOpen = function(type, value, callback){
  app.playlists.playerOpen(app.VideoController.playlistId, type, id, callback);
};


/**
 * Clear the playlist
 *
 * @param callback
 */
app.VideoController.playlistClear = function(callback){
  app.playlists.playlistClear(app.VideoController.playlistId, callback);
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
app.VideoController.playlistSwap = function(pos1, pos2, callback, modelType){
  var idField = (modelType == 'movie' ? 'movieid' : 'episodeid');
  app.playlists.playlistSwap(app.VideoController.playlistId, idField, pos1, pos2, callback);
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
      callback(result);

    });
  });

};


/**
 * Party mode
 */
app.VideoController.setPartyMode = function(callback){
  app.playlists.setPartyMode(app.VideoController.playlistId, callback);
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
    for(var i in data.models){
      items.push(data.models[i].attributes.episodeid);
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
      app.VideoController.playPlaylistPosition(0, function(data){

        // resume
        app.VideoController.resumeVideo( model, callback );

      });
    });
  });

};


/**
 * Resume a video if resume data is available
 */
app.VideoController.resumeVideo = function(model, callback ){
  // if in progress, seek to that position
  if(model.resume !== undefined && model.resume.position > 0){
    app.VideoController.seek( Math.round((model.resume.position / model.resume.total) * 100), callback );
  } else {
    //callback - play, no seek
    if(callback){ callback(); }
  }
};



/**
 * Seek curently playing to a percentage
 */
app.VideoController.seek = function(position, callback ){
  app.xbmcController.command('Player.Seek', [app.VideoController.playlistId, position], function(result){
    if(app.helpers.exists(callback)){
      callback(result.result); // return items
    }
  });
};


/**
 * Set subtitle
 */
app.VideoController.toggleSubTitle = function(){
  var type = (app.VideoController.subtitle == 'on' ? 'off' : 'on');
  app.xbmcController.command('Player.SetSubtitle', [app.VideoController.playlistId, type], function(result){
    app.VideoController.subtitle = type;
  });
};



/**
 * Gets / Normalises watched status
 *
 * @param m
 *  tvshow or tv season model
 */
app.VideoController.watchedStatus = function(m){

  var watched = {
    status: 'no', // no, yes, progress
    progress: 0
  };

  switch(m.type){

    case 'movie':
    case 'episode':
      // in progress
      if(m.resume.position !== 0){
        watched.status = 'progress';
        watched.progress = Math.round( ( m.resume.position / m.resume.total ) * 100 );
      } else {
        // watched
        if(m.playcount > 0){
          watched.status = 'yes';
        }
      }
      break;

    case 'season':
    case 'tvshow':
      // season, with watched episodes
      if(m.watchedepisodes > 0){
        if(m.watchedepisodes == m.episode){
          watched.status = 'yes';
        } else {
          watched.status = 'progress';
          watched.progress = Math.round( ( m.watchedepisodes / m.episode ) * 100 );
        }
      }
      break;
  }

  return watched;
};




/**
 * Init a video stream popup
 *
 * @param player
 * @param model
 */
app.VideoController.stream = function(player, model){
  var winUrl = "videoPlayer.html?player=" + player,
    loaded = false;

  // if url preloaded
  if(model.downloadUrl !== undefined && model.downloadUrl !== ''){
    winUrl = winUrl + "&src=" + encodeURIComponent(model.downloadUrl);
    loaded = true;
  }

  // open the window (prevents popup blockers kicking in)
  var win = window.open(winUrl, "_blank", "toolbar=no, scrollbars=no, resizable=yes, width=925, height=545, top=100, left=100");

  // not loaded
  if(!loaded){
    // get the url and send the player window to it
    app.AudioController.downloadFile(model.file, function(url){
      win.location = winUrl + "&src=" + encodeURIComponent(url);
    });
  }

};


/**
 * Set if something is watched, or not.
 *
 * @param state
 *  bool, true = set as watched, false = set as not watched
 * @param type
 *  movie, episode
 * @param model
 *  the model object containing id and title
 */
app.VideoController.setWatched = function(state, type, model, callback){

  var id = model[type + 'id'],
    title = (model.title === undefined ? model.label : model.title),
    method = (type == 'episode' ? 'SetEpisodeDetails' : 'SetMovieDetails'),
    playcount = (state === true ? 1 : 0);

  app.xbmcController.command('VideoLibrary.' + method, [id, title, playcount], function(result){

    // we invalidate the cache so updates are reflected in lists
    app.VideoController.invalidateCache(type, model);

    // return state
    if(app.helpers.exists(callback)){
      callback(state);
    }

  });

};


/**
 * Toggle watched, uses setWatched()
 *
 * @param type
 * @param model
 *  must contain playcount property!
 * @param callback
 */
app.VideoController.toggleWatched = function(type, model, callback){

  var state = false;
  if(parseInt(model.playcount) === 0){
    state = true;
  }
  app.VideoController.setWatched(state, type, model, callback);

};




/**
 * Wipe a video cache
 *
 * @param type
 */
app.VideoController.invalidateCache = function(type, model){

  if(type == 'movie'){

    // wipe the movie list
    delete app.stores.movies;

  } else if(type == 'episode'){

    // wipe the episode and season lists
    var key;
    key = 'episodes:' + model.tvshowid + ':' + model.season;
    if(app.stores.TvEpisodes !== undefined && app.stores.TvEpisodes[key] !== undefined){
      delete app.stores.TvEpisodes[key];
    }
    key = 'seasons:' + model.tvshowid;
    if(app.stores.TvSeasons !== undefined && app.stores.TvSeasons[key] !== undefined){
      delete app.stores.TvSeasons[key];
    }

  }

};