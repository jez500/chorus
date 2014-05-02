/**
 * The app.playlists object is a collection of methods and properties specifically for
 * custom playlist functionality and helpers
 *
 * @type {{storageKeyLists: string, storageKeyThumbsUp: string}}
 */
app.playlists = {
  storageKeyLists: 'playlist:lists',
  storageKeyThumbsUp: 'playlist:thumbsUp'
};


/**
 * Playlist Binds
 */
$(window).on('shellReady', function(){
  // cache thumbs up
  app.playlists.getThumbsUp();
  // set playlist menu
  $('.playlist-actions-wrapper', this.$el).html(
    app.helpers.makeDropdown( app.helpers.menuTemplates('playlistShell') )
  );

//  //add custom playlists to dom
//  app.playlists.addCustomPlayLists(function(view){
//    var $sb = $('#playlist-lists', self.$el);
//    $sb.html(view.render().el);
//  });

});


/**
 * The Super collection getter
 *
 * Get the contents of all major song collection types, eg. single song, artist, thumbs up list or the xbmc playlist.
 * Basically a wrapper for all song list types
 *
 * @param type
 *  type of playlist: xbmc, song, album, artist, list, thumbsup, items
 * @param delta
 *  depends on type type: 0, songid, albumid, artistid, customPlaylistId, [song, album, artist], [array of songids]
 * @param callback
 *
 * @return {song collection}
 *  A fully loaded backbone collection of songs
 *
 */
app.playlists.playlistGetItems = function(type, delta, callback){

  var items = [],
    plCollection = {};

  switch (type){
    case 'xbmc': // current xbmc playlist
      plCollection = new app.PlaylistCollection();
      plCollection.fetch({"success": function(res){
        res = app.playlists.addFileFieldToSongCollection(res);
        callback(res);
      }});
      break;

    case 'song':
      plCollection = new app.CustomSongCollection();
      plCollection.fetch({items: [delta], success: function(res){
        res = app.playlists.addFileFieldToSongCollection(res);
        callback(res);
      }});
      break;

    case 'album':
      plCollection = new app.SongFilteredXbmcCollection({"filter": {albumid: delta}});
      plCollection.fetch({"success": function(data){
        res = app.playlists.addFileFieldToSongCollection(data);
        callback(res);
      }});
      break;

    case 'artist':
      plCollection = new app.SongFilteredXbmcCollection({"filter": {artistid: delta}});
      plCollection.fetch({"success": function(data){
        res = app.playlists.addFileFieldToSongCollection(data);
        callback(res);
      }});
      break;

    case 'movie':
      plCollection = new app.CustomMovieCollection();
      plCollection.fetch({items: delta, success: function(res){
        callback(res);
      }});
      break;

    case 'tvshow':
      plCollection = new app.TvepisodeCollection();
      plCollection.fetch({tvshowid: delta, success: function(res){
        callback(res);
      }});
      break;

    case 'season':
      plCollection = new app.TvepisodeCollection();
      // format for delta is tvshowid:season
      var parts = delta.split(':');
      plCollection.fetch({tvshowid: parts[0], season: parts[1], success: function(res){
        callback(res);
      }});
      break;

    case 'list': // local playlist id = delta
      plCollection = new app.PlaylistCustomListSongCollection();
      plCollection.fetch({"name":delta, "success": function(res){
        res = app.playlists.addFileFieldToSongCollection(res);
        callback(res);
      }});
      break;

    case 'thumbsup': // thumbs up songs
      plCollection = new app.ThumbsUpCollection();
      plCollection.fetch({"name":delta, "success": function(res){
        res = app.playlists.addFileFieldToSongCollection(res);
        callback(res);
      }});
      break;

    case 'items': // return a collection based in an array of songids
      plCollection = new app.CustomSongCollection();
      plCollection.fetch({items: delta, success: function(res){
        res = app.playlists.addFileFieldToSongCollection(res);
        callback(res);
      }});
      break;


  }

  // callback
  if(callback){
    callback(items);
  } else {
    // will be empty on an xbmc call, so you MUST use the callback
    return items;
  }

};


/**
 * A global wrapper for adding items to a playlist
 *
 * @param playlist
 *  playlist to add the type[delta] to. Options: xbmc, local, lists
 * @param op
 *  append, replace (replace will play), new (for custom lists)
 * @param type
 *  @see plalistGetItems
 * @param delta
 *  @see plalistGetItems
 * @param callback
 *  @see plalistGetItems
 */
app.playlists.playlistAddItems = function(playlist, op, type, delta, callback){

  app.playlists.playlistGetItems(type, delta, function(collection){

    // gate
    if(collection.length === 0){
      return;
    }

    var items = [];
    $.each(collection.models, function(i,d){
      if(d.attributes.songid){
        // is it a file
        if(d.attributes.songid == 'file'){
          items.push(d.attributes.file);
        } else {
          // or songid
          items.push(d.attributes.songid);
        }
      }
    });

    callback = (typeof callback != 'undefined' ? callback : function(){});

    switch(playlist){

      // Append / Replace xbmc playlist @TODO abstract elsewhere
      case 'xbmc':

        if(op == 'append'){
          // Add items
          app.AudioController.playlistAddMultiple('mixed', items, function(){
            app.AudioController.playlistRender();
            app.playlists.changePlaylistView('xbmc');
            callback();
          });
        } else {
          // Clear first then add items
          app.AudioController.playlistClear(function(){
            // Add items
            app.AudioController.playlistAddMultiple('mixed', items, function(){
              app.AudioController.playlistRender();
              app.playlists.changePlaylistView('xbmc');
              app.AudioController.playPlaylistPosition(i, function(data){
                //update playlist
                app.AudioController.playlistRender();
                //callback
                callback();
              });
            });
          });
        }

        break;

      // Append / Replace Local browser playlist
      case 'local':

        if(op == 'append'){
          app.audioStreaming.appendPlaylistItems(collection, callback);
        } else {
          // replace and play
          app.audioStreaming.replacePlaylistItems(collection, callback);
        }

        break;

      // Add to Custom Lists
      case 'lists':

        app.playlists.saveCustomPlayListsDialog('local', items);

        break;
    }

  });

};



/**
 * Need to ensure each item has a file field so we lookup.
 *
 * This is a bug with Xbmc Frodo where "file" field is not returned with "getSongDetails"
 * We kinda need the songs indexed for search so this just adds about 20% to that time/bandwidth
 * and as we need the songs on call, we cache all songs on page load.
 *
 * Ref:
 * http://trac.xbmc.org/ticket/14508
 * http://forum.xbmc.org/showthread.php?tid=111945
 *
 * @param collection
 * @returns {*}
 */
app.playlists.addFileFieldToSongCollection = function(collection){

  $.each(collection.models, function(i,d){
    // get song from dictionary
    var song = app.store.getSongBy('id', d.attributes.songid);
    // add the file field if we have it
    if(song !== null){
      d.attributes.file = song.file;
      // save
      collection.models[i] = d;
    }
  });

  // return parsed collection
  return collection;
};


app.playlists.sortableChangePlaylistPosition = function( event, ui ) {

  //the item just moved
  var $thisItem = $(ui.item[0]).find('div.playlist-item'),
    changed = {},
    $sortable = $thisItem.closest("ul.playlist"),
    type = ($thisItem.data('playlistId') == 1 ? 'video' : 'audio'),
    modelType = $thisItem.data('type');



  //loop over each playlist item to see what (if any has changed)
  $sortable.find('div.playlist-item').each(function(i,d){
    $d = $(d);
    //if this row store the position
    if($d.data('path') === $thisItem.data('path')){
      changed = {from: $thisItem.data('id'), to: i};
    }
  });

  //if an item has changed position, swap its position in xbmc
  if(changed.from !== undefined && changed.from !== changed.to){
    var controller = (type == 'audio' ? app.AudioController : app.VideoController);
    controller.playlistSwap(changed.from, changed.to, function(res){
      controller.playlistRender();
      // this will get added next poll
      $thisItem.removeClass('.playing-row');
    }, modelType);
  }
};


// doesnt seem to be in use
app.playlists.changeCustomPlaylistPosition = function( event, ui ) {

  //the item just moved
  var $thisItem = $(ui.item[0]).find('div.playlist-item'),
    changed = {},
    $sortable = $thisItem.closest("ul.playlist");

  //loop over each playlist item to see what (if any has changed)
  $sortable.find('div.playlist-item').each(function(i,d){
    $d = $(d);
    //if this row store the position
    if($d.data('path') === $thisItem.data('path')){
      changed = {from: $thisItem.data('path'), to: i};
    }
  });

  //if an item has changed position, swap its position in xbmc
  if(changed.from !== undefined && changed.from !== changed.to){
    app.AudioController.playlistSwap(changed.from, changed.to, function(res){
      app.AudioController.playlistRender();
    });
  }
};


/**
 * Change to playlist tab
 * @param type
 *  xbmc or local
 */
app.playlists.changePlaylistView = function(type){

  var $sb = $('#sidebar-second'),
      $at = $(".playlist-primary-tab[data-pane='" + type + "']");

  // active
  $(".playlist-primary-tab").removeClass("active");
  $at.addClass('active');

  $('.sidebar-pane', $sb).hide();
  $('#playlist-' + type, $sb).show();

  // toggle between players
  if(type == 'local' || type == 'xbmc'){
    app.audioStreaming.setPlayer(type);
  }

};


/**
 * Save Current xbmc playlist Dialog
 *
 * @param type
 *  Source list type: xbmc or local
 * @param items
 *  No used on xbmc, on local it is an array of songids
 * @param hideList
 *  set to true if you only want the add new option
 */
app.playlists.saveCustomPlayListsDialog = function(type, items, hideList, redirect){

  // validate type & items
  type = (typeof type == 'undefined' ? 'xbmc' : type);
  items = (typeof items == 'undefined' ? [] : items);
  redirect = (typeof redirect == 'undefined' ? true : redirect);

  // vars
  var lists = app.playlists.getCustomPlaylist(),
    htmlList = '';

  for(var i in lists){
    htmlList += '<li data-id="' + lists[i].id + '">' + lists[i].name + '</li>';
  }

  // for when we want to force create a new list
  if(typeof hideList != 'undefined' && hideList === true){
    htmlList = '';
  }

  var content = '<p>Create a new playlist<br />' +
    '<input class="form-text" type="text" id="newlistname" /> <button class="btn bind-enter" id="savenewlist">Save</button></p>' +
    (htmlList !== '' ? '<p>Or add to an existing list</p><ul id="existinglists">' + htmlList + '</ul>' : '');

  // Create Dialog
  app.helpers.dialog(content, {
    title: 'Add to a playlist'
  });

  // save new bind
  $('#savenewlist').on('click', function(e){
    var name = $('#newlistname').val(),
      pl = app.playlists.saveCustomPlayLists('new', name, type, items);
    app.helpers.dialogClose();
    if(redirect){
      document.location = '#playlist/' + pl.id;
    }
    app.notification('Playlist updated');
  });

  // add to existing
  $('#existinglists li').on('click', function(e){
    var id = $(this).data('id'),
      pl = app.playlists.saveCustomPlayLists('existing', id, type, items);
    app.helpers.dialogClose();
    if(redirect){
      document.location = '#playlist/' + pl.id;
    }
    app.notification('Playlist updated');
  });

};


/**
 * Save Current xbmc playlist to storage playlist
 * called by dialog
 *
 * @param op
 *  new, existing
 * @param id
 *  new name / existing id
 * @param source
 *  xbmc, local
 * @param newItems
 *  an array of songids
 */
app.playlists.saveCustomPlayLists = function(op, id, source, newItems){

  // vars
  var items = [],
    lists = app.playlists.getCustomPlaylist(),
    lastId = 0,
    plObj = {},
    i = 0;

  if(source == 'xbmc'){

    _.each(app.cached.xbmcPlaylist, function(d){
      if(d.id == 'file'){
        // let addons tinker
        d = app.addOns.invokeAll('parseFileRecord', d);
        // if there is no song id, we must cache the whole
        // object as we can't look it up later
        items.push(d);
      } else {
        items.push(d.id);
      }
    });

  } else {
    // load from var
    items = newItems;
  }


  // what do we do with the result
  switch (op){

    // Add a new list
    case 'new':

      // Get lastId
      for(i in lists){
        var list = lists[i];
        if(lastId < list.id){
          lastId = list.id;
        }
      }

      // This id is the next number up
      var thisId = lastId + 1;

      // plobj
      plObj = {
        items: items,
        name: id,
        id: thisId
      };

      // add result
      lists.push(plObj);

      break;

    // Add to existing list
    case 'existing':

      // find matching id and append
      for(i in lists){
        if(id == lists[i].id){
          // append to matching list
          for(var n in items){
            lists[i].items.push(items[n]);
          }
          // plobj
          plObj = lists[i];
        }
      }

      break;
  }

  //save playlist
  app.storageController.setStorage(app.playlists.storageKeyLists, lists);

  // update list of playlists
  app.playlists.updateCustomPlayLists();

  // return saved list obj
  return plObj;
};



/**
 * Get the rendered view ready to be added to dom in callback
 * @param callback
 */
app.playlists.addCustomPlayLists = function(callback){

  //custom playlists
  app.cached.playlistCustomListsView = new app.PlaylistCustomListCollection();

  // fetch collection
  app.cached.playlistCustomListsView.fetch({"success": function(items){
    app.cached.playlistCustomListsView = new app.PlaylistCustomListsView({model: items});
    callback(app.cached.playlistCustomListsView);
  }});

};



/**
 * get playlist(s) from local storage
 */
app.playlists.getCustomPlaylist = function(id){

  // get lists
  var currentPlaylists = app.storageController.getStorage(app.playlists.storageKeyLists),
    listsRaw = (currentPlaylists !== null ? currentPlaylists : []),
    lists = [],
    n = 0;

  // ensure we have a clean data set
  for(n in listsRaw){
    var item = listsRaw[n];
    if(typeof item != 'undefined' && item !== null){
      lists.push(item);
    }
  }

  // If specific list
  if(typeof id != 'undefined'){
    for(n in lists){
      if(id == lists[n].id){
        return lists[n];
      }
    }
  }

  // All lists
  return lists;
};


/**
 * delete playlist from local storage
 */
app.playlists.deleteCustomPlaylist = function(id){
  var lists = app.playlists.getCustomPlaylist(),
    o = [];

  // add all but the removed to o
  for(var n in lists){
    item = lists[n];
    if(item.id != id){
      o[n] =  item;
    }
  }

  // Save new list
  app.storageController.setStorage(app.playlists.storageKeyLists, o);

  // reload playlists list
  app.playlists.updateCustomPlayLists();

};


/**
 * delete playlist Song
 */
app.playlists.deleteCustomPlaylistSong = function(listId, position){

  var list = app.playlists.getCustomPlaylist(listId),
    newList = [];

  // loop over all and only add items that != position
  for (var i in list.items){
   if(position != i){
     newList.push(list.items[i]);
   }
  }

  app.playlists.replaceCustomPlayList(listId, newList);

};


/**
 * replace custom playlist content
 */
app.playlists.updateCustomPlayLists = function(){

  //custom playlists
  app.playlists.addCustomPlayLists(function(view){
    $('#sidebar-after').html(view.render().el);
  });

};


/**
 * replace custom playlist items with new items - useful for for sorting
 */
app.playlists.replaceCustomPlayList = function(listId, items){
  var lists = {};

  // thumbs up - only songs are sortable
  if(listId == 'thumbsup'){

    lists = app.storageController.getStorage(app.playlists.storageKeyThumbsUp);

    lists.song = {items: items};

    // Save
    app.storageController.setStorage(app.playlists.storageKeyThumbsUp, lists);

  } else {

    // Get a full list then update our specific list
    listId = parseInt(listId);
    lists = app.playlists.getCustomPlaylist();

    if(items.length > 0){
      for(var i in lists){
        // if matching list, update
        if(lists[i].id == listId){
          lists[i].items = items;
        }
      }
    }

    // Save
    app.storageController.setStorage(app.playlists.storageKeyLists, lists);

  }

};


/**
 * Html for the sub tasks of a playlist
 * @todo use other function that does this
 *
 */
app.playlists.getDropdown = function(){

  var items = [],
    type = app.helpers.arg(0),
    buttons = {
      append: 'Add to playlist',
      replace: 'Replace playlist',
      'browser-replace': 'Play in browser',
      export: 'Export Playlist'
    };

  if(type != 'thumbsup'){
    buttons.delete = 'Delete';
  }

  for(var key in buttons){
    items.push({
      url: '#',
      class: type + '-' + key,
      title: buttons[key]
    });
  }

  return app.helpers.makeDropdown({
    key: type,
    items: items,
    pull: 'right'
  });

};




/**
 * save a thumbs up song
 *
 * @param op
 *  add, remove
 * @param type
 *  song, album, artist, dir
 * @param id
 *  int id of type. If dir is used, this is an object (file model attributes)
 */
app.playlists.setThumbsUp = function(op, type, id){

  var allThumbsUp = app.playlists.getThumbsUp(),
    currentThumbsUp = allThumbsUp[type],
    newList = [],
    exists = false,
    itemTemplate = {items: []},
    i = 0;

  if(typeof currentThumbsUp == 'undefined' || typeof currentThumbsUp.items == 'undefined'){
    currentThumbsUp = itemTemplate;
  }

  // Add or remove
  switch (op){

    case 'add':
      // only add if not exists
      for(i in currentThumbsUp.items){
        if(currentThumbsUp.items[i] == id){
          exists = true;
        }
      }
      // add
      if(!exists){
        currentThumbsUp.items.push(id);
      }
      break;

    case 'remove':
      // loop and re add all but the id to remove
      for(i in currentThumbsUp.items){
        var item = currentThumbsUp.items[i];
        if(item !== null && app.playlists.getThumbsUpId(item) != id){
          newList.push(item);
        }
      }
      currentThumbsUp.items = newList;
      break;
  }

  // update for current thumbs up type
  allThumbsUp[type] = currentThumbsUp;

  // save storage
  app.storageController.setStorage(app.playlists.storageKeyThumbsUp, allThumbsUp);

  // update cache
  app.playlists.getThumbsUp();
};


/**
 * Thumbs up item can be a file model or a id, this generically returns the id (key) from the item
 */
app.playlists.getThumbsUpId = function(item){
  if(typeof item == 'object'){
    return item.id;
  }
  return item;
};


/**
 * get thumbs up
 *
 * @param type
 */
app.playlists.getThumbsUp = function(type){
  var currentThumbsUp = app.storageController.getStorage(app.playlists.storageKeyThumbsUp),
    lists = (currentThumbsUp !== null ? currentThumbsUp : {}),
    t = 0, n = 0;

  // save to cache for "isThumbsUp"
  app.cached.thumbsUp = {};
  for(t in lists){
    app.cached.thumbsUp[t] = {
      items: lists[t].items,
      lookup: {}
    };
    // make a dictionary lookup and ensure id is not null (which storage seems to do)
    var items = [];
    for(n in lists[t].items){
      var id = lists[t].items[n];
      if(id !== null){
        items.push(id);
        app.cached.thumbsUp[t].lookup[app.playlists.getThumbsUpId(id)] = true;
      }
    }
    lists[t].items = items;
  }

  // return all or one list
  if(typeof type != 'undefined'){
    // return specific type
    return lists[type];
  } else {
    // return all lists
    return lists;
  }

};


/**
 * get thumbs up
 *
 * @param type
 * @param id
 */
app.playlists.isThumbsUp = function(type, id){
  return (typeof app.cached.thumbsUp != 'undefined' &&
    typeof app.cached.thumbsUp[type] != 'undefined' &&
    typeof app.cached.thumbsUp[type].lookup[id] != 'undefined');
};


/**
 * Is there any thumbsup?
 * @returns {boolean}
 */
app.playlists.isAnyThumbsUp = function(){
  var tu = app.storageController.getStorage(app.playlists.storageKeyThumbsUp);
  return (tu !== null);
};






/***********************
 * XBMC Playlist helpers
 ************************/



/**
 * XBMC Playlist
 *
 * @param playlistId
 * @param callback
 */
app.playlists.getXbmcPlaylist = function(playlistId, callback){

  app.xbmcController.command('Playlist.GetItems',
    [
      playlistId,
      app.fields.get('playlistItem')
    ], function(result){
      var res = result.result;
      // set playlistId on models and collection
      res.playlistId = playlistId;
      if(res.items !== undefined){
        $.each(res.items, function(i,d){
          res.items[i].playlistId = playlistId;
        });
      }
      // return items
      callback(res);
    });


};

/**
 * Clear a XBMC Playlist
 *
 * @param playlistId
 * @param callback
 */
app.playlists.playlistClear = function(playlistId, callback){
  // clear playlist
  app.xbmcController.command('Playlist.Clear', [playlistId], function(data){
    if(callback){
      callback(data);
    }
  });
};


/**
 * Play an item on a XBMC Playlist
 *
 * @param playlistId
 * @param position
 * @param callback
 */
app.playlists.playlistPlayPosition = function(playlistId, position, callback){
  app.playlists.playerOpen(playlistId, "position", position, callback);
};



/**
 * Call Player.Open directly and does not add the item to the playlist
 * should only be called directly only if the item cannot be added to the
 * playlist. eg streams, partymode, etc.
 *
 * @param playlistId
 * @param type
 *  eg position
 * @param value
 *  eg 5
 * @param callback
 */
app.playlists.playerOpen = function(playlistId, type, value, callback){
  var data = {},
    params = [];
  // only l
  if(type == 'position'){
    data.playlistid = playlistId;
  }
  data[type] = value;
  params.push(data);

  // if video turn resume on - THIS DOES NOT WORK :( seems to be a broken feature. workarounds in video controller
  if(app.VideoController.playlistId == playlistId){
    params.push( { resume: true } );
  }

  app.xbmcController.command('Player.Open', params, function(result){
    if(callback){
      callback(result.result); // return items
    }
  });
};


/**
 * Refresh the playlist
 *
 * @param playlistId
 * @param callback
 */
app.playlists.renderXbmcPlaylist = function(playlistId, callback){

  // xbmc playlist
  app.playlists.getXbmcPlaylist(playlistId, function(result){

    //cache
    app.cached.xbmcPlaylist = result.items;
    var $pl = $('#playlist-xbmc');

    //create a new playlist view and render
    app.playlistView = new app.PlaylistView({model:{playlistId: playlistId, models:result.items}});
    $pl.html(app.playlistView.render().el);

    if(!app.notifications.wsActive){
      app.playerState.xbmc.fetchRemote(function(data){
        //update shell to now playing info
        app.shellView.updateState(data);
      });
    }


    if(app.helpers.exists(callback)){
      callback(result);
    }

  });

};


/**
 * Toggle party mode (auto playing of random songs)
 *
 * @param playlistId
 * @param callback
 */
app.playlists.setPartyMode = function(playlistId, callback){

  var data = app.playerState.xbmc.getNowPlaying('player');

  // partymode off, so start it!
  if(data.partymode === false){
    var type = (playlistId === 0 ? 'music' : 'video');
    app.playlists.playerOpen(playlistId, 'partymode', type, function(result){
      app.notification('Partymode on');
      if(callback){
        callback(result.result); // return items
      }
    });
  } else {
    // Stop partymode
    app.xbmcController.command('Player.setPartyMode', [ playlistId, false], function(result){
      app.notification('Partymode off');
      if(callback){
        callback(result.result); // return items
      }
    });
  }

};


/**
 * Swap the position of an item in the playlist
 *
 * This moves an item from one position to another
 * It does this by cloning pos1, remove original pos, insert pos1 clone into pos2
 * Not to be confused with xbmc playlist.swap which is fairly useless IMO
 *
 * @param playlistId
 *  xbmc playlistid
 * @param type
 *  eg. songid, movieid
 * @param pos1
 *  current playlist position
 * @param pos2
 *  new playlist position
 * @param callback
 */
app.playlists.playlistSwap = function(playlistId, type, pos1, pos2, callback){

  //get playlist items
  app.playlists.getXbmcPlaylist(playlistId, function(result){
    //clone for insert
    var clone = result.items[pos1],
      insert = {},
      controller = (playlistId == 1 ? app.VideoController : app.AudioController);

    //if songid found use that as a preference
    if(clone.id !== undefined && typeof clone.id == 'number'){
      insert[type] = clone.id;
    } else { //use filepath if no songid
      insert.file = clone.file;
    }

    //remove the original
    controller.removePlaylistPosition(pos1, function(result){
      //insert the clone
      app.xbmcController.command('Playlist.Insert', [playlistId, pos2, insert], function(data){
        //get playlist items
        controller.getPlaylistItems(function(result){
          //update cache
          controller.currentPlaylist = result;
          callback(result);
        });
      });
    });

  });
};


/**
 * Inserts a song in the playlist next and starts playing that song
 *
 * @param playlistId
 * @param type
 * @param id
 * @param callback
 */
app.playlists.insertAndPlay = function(playlistId, type, id, callback){

  var player = app.playerState.xbmc.getNowPlaying('player'),
    playingPos = (typeof player.position != 'undefined' ? player.position : 0),
    pos = playingPos + 1,
    insert = {};

  insert[type] = id;

  // if nothing is playing, we will clear the playlist first
  if(app.playerState.xbmc.getNowPlaying('status') == 'notPlaying' || app.playerState.xbmc.getNowPlaying('status') == 'stopped'){
    // clear
    app.playlists.playlistClear(playlistId, function(){
      // insert
      app.xbmcController.command('Playlist.Insert', [playlistId, pos, insert], function(data){
        // play
        app.playlists.playlistPlayPosition(playlistId, pos, function(){
          if(callback){
            callback(data);
          }
        });
      });
    });
  } else {
    // playing, insert
    app.xbmcController.command('Playlist.Insert', [playlistId, pos, insert], function(data){
      // play
      app.playlists.playlistPlayPosition(playlistId, pos, function(){
        if(callback){
          callback(data);
        }
      });
    });
  }

};




/**
 * Starts streaming something
 *
 * @param playlistId
 * @param url
 * @param callback
 */
app.playlists.playStream = function(playlistId, url, callback){

};
