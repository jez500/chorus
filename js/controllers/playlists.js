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







app.playlists.sortableChangePlaylistPosition = function( event, ui ) {

  //the item just moved
  var $thisItem = $(ui.item[0]).find('div.playlist-item'),
    changed = {},
    $sortable = $thisItem.closest("ul.playlist");

  //loop over each playlist item to see what (if any has changed)
  $sortable.find('div.playlist-item').each(function(i,d){
    $d = $(d);
    //if this row store the position
    if($d.data('path') === $thisItem.data('path')){
      changed = {from: $thisItem.data('id'), to: i};
    }
  });

  //if an item has changed position, swap its position in xbmc
  if(changed.from != undefined && changed.from !== changed.to){
    app.AudioController.playlistSwap(changed.from, changed.to, function(res){
      app.AudioController.playlistRefresh();
    })
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
  console.log(changed);
  //if an item has changed position, swap its position in xbmc
  if(changed.from != undefined && changed.from !== changed.to){
    app.AudioController.playlistSwap(changed.from, changed.to, function(res){
      app.AudioController.playlistRefresh();
    })
  }
};




/**
 * Change to playlist tab
 * @param type
 *  xbmc or local
 */
app.playlists.changePlaylistView = function(type){

  var $sb = $('#sidebar-second'),
      $at = $('.' + type + "-playlist-tab");

  // active
  $(".playlist-primary-tab").removeClass("active");
  $at.addClass('active');

  // toggle content with classes
  switch(type){
    case 'xbmc':
      $sb.removeClass('alt-view').addClass('normal-view');
      break;
    case 'local':
      $sb.addClass('alt-view').removeClass('normal-view');
      break;
  }

};


/**
 * Save Current xbmc playlist Dialog
 */
app.playlists.saveCustomPlayListsDialog = function(type, items){

  // validate type & items
  type = (typeof type == 'undefined' ? 'xbmc' : type);
  items= (typeof items == 'undefined' ? [] : items);

  // vars
  var lists = app.playlists.getCustomPlaylist(),
    htmlList = '';

  for(i in lists){
    htmlList += '<li data-id="' + lists[i].id + '">' + lists[i].name + '</li>';
  }

  var content = '<p>Create a new playlist<br />' +
    '<input class="form-text" type="text" id="newlistname" /> <button class="btn bind-enter" id="savenewlist">Save</button></p>' +
    (htmlList != '' ? '<p>Or add to an existing list</p><ul id="existinglists">' + htmlList + '</ul>' : '');

  // Create Dialog
  app.helpers.dialog(content, {
    title: 'Add to a playlist'
  });

  // save new bind
  $('#savenewlist').on('click', function(e){
    var name = $('#newlistname').val(),
      pl = app.playlists.saveCustomPlayLists('new', name, type, items);
    app.helpers.dialogClose();
    document.location = '#playlist/' + pl.id;
  });

  // add to existing
  $('#existinglists li').on('click', function(e){
    var id = $(this).data('id'),
      pl = app.playlists.saveCustomPlayLists('existing', id, type, items);
    app.helpers.dialogClose();
    document.location = '#playlist/' + pl.id;
  });

};



/**
 * Save Current xbmc playlist to storage
 */
app.playlists.saveCustomPlayLists = function(op, id, source, newItems){

  // vars
  var items = [],
    lists = app.playlists.getCustomPlaylist(),
    lastId = 0,
    plObj = {};

  if(source == 'xbmc'){

    console.log(app.cached.xbmcPlaylist);
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
          for(n in items){
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
    listsRaw = (currentPlaylists != null ? currentPlaylists : []),
    lists = [];

  // ensure we have a clean data set
  for(n in listsRaw){
    var item = listsRaw[n];
    if(typeof item != 'undefined' && item != null){
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
  for(n in lists){
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
app.playlists.deleteCustomPlaylistSong = function(listId, songId){

  var list = app.playlists.getCustomPlaylist(listId),
  newItems = list.items.filter(function (element) {
    return (songId != element);
  });

  app.playlists.replaceCustomPlayList(listId, newItems);

};


/**
 * replace custom playlist content
 */
app.playlists.updateCustomPlayLists = function(){

  //custom playlists
  app.playlists.addCustomPlayLists(function(view){
    $('.alt-sidebar-items').html(view.render().el);
  });

};


/**
 * replace custom playlist items with new items - useful for for sorting
 */
app.playlists.replaceCustomPlayList = function(listId, items){

  // thumbs up - only songs are sortable
  if(listId == 'thumbsup'){

    var lists = app.storageController.getStorage(app.playlists.storageKeyThumbsUp);

    lists.song = {items: items};

    // Save
    app.storageController.setStorage(app.playlists.storageKeyThumbsUp, lists);

    return;
  }

  // Get a full list then update our specific list
  listId = parseInt(listId);
  var lists = app.playlists.getCustomPlaylist();
  if(items.length > 0){
    for(i in lists){
      // if matching list, update
      if(lists[i].id == listId){
        lists[i].items = items;
      }
    }
  }

  // Save
  app.storageController.setStorage(app.playlists.storageKeyLists, lists);

};


/**
 * Html for the sub tasks of a playlist
 *
 */
app.playlists.getDropdown = function(){

  var items = [],
    type = app.helpers.arg(0),
    buttons = {
      append: 'Add to playlist',
      replace: 'Replace playlist'
    };

  if(type != 'thumbsup'){
    buttons.delete = 'Delete';
  }

  for(key in buttons){
    items.push({
      url: '#',
      class: type + '-' + key,
      title: buttons[key]
    })
  }

  return app.helpers.makeDropdown({
    key: type,
    items: items
  });

};




/**
 * save a thumbs up song
 *
 * @param op
 *  add, remove
 * @param type
 *  song, album, artist
 * @param id
 *  id of type
 */
app.playlists.setThumbsUp = function(op, type, id){

  var allThumbsUp = app.playlists.getThumbsUp(),
    currentThumbsUp = allThumbsUp[type],
    newList = [],
    exists = false,
    itemTemplate = {items: []};

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
        if(currentThumbsUp.items[i] != id && currentThumbsUp.items[i] != null){
          newList.push(currentThumbsUp.items[i])
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
  app.playlists.getThumbsUp()
};


/**
 * get thumbs up
 *
 * @param type
 */
app.playlists.getThumbsUp = function(type){
  var currentThumbsUp = app.storageController.getStorage(app.playlists.storageKeyThumbsUp),
    lists = (currentThumbsUp != null ? currentThumbsUp : {});

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
      if(id != null){
        items.push(id);
        app.cached.thumbsUp[t].lookup[id] = true;
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
 */
app.playlists.isThumbsUp = function(type, id){
  return (typeof app.cached.thumbsUp[type] != 'undefined' &&
    typeof app.cached.thumbsUp[type].lookup[id] != 'undefined');
};

