

/********************************************************************************
 * Handles all non library calls to xbmc
 ********************************************************************************/


$.jsonRPC.setup({
  endPoint: app.jsonRpcUrl
});


app.xbmcController = {};

/**
 * Generic command
 * @param command
 * @param options
 * @param callback
 */
app.xbmcController.command = function(command, options, callback, errorCallback){

  var settings = {
    success: function(result) {
      if(callback){
        callback(result);
      }
    },
    error: function(result) {
      app.helpers.errorHandler('xbmc command call: ' + command, [result, options]);
      if(errorCallback){
        errorCallback([result, options]);
      }
    }
  };

  if(options !== undefined && options.length > 0){
    settings.params = options;
  }

  $.jsonRPC.request(command, settings);

};


/**
 * Call an input command
 * http://kodi.wiki/view/JSON-RPC_API/v6#Input
 *
 * @param type
 * @param callback
 * @param errorCallback
 */
app.xbmcController.input = function(type, callback, errorCallback){
  app.xbmcController.command('Input.'+ type, [], callback, errorCallback);
};


/**
 * Generic command
 * @param commands
 * @param callback
 */
app.xbmcController.multipleCommand = function(commands, callback){

  $.jsonRPC.batchRequest(commands, {
    success: function(result) {
      for(var i in result){
        if(typeof result[i].error != 'undefined'){
          // suppress errors unless required
          //console.log(result, commands[i]);
          //app.helpers.errorHandler('xbmc multiple command call: ' + i, [result[i], commands[i]]);
        }
      }
      if(callback){
        callback(result);
      }
    },
    error: function(result) {
      // suppress errors unless required
     // app.helpers.errorHandler('xbmc multiple command call', [result, commands]);
    }
  });

};



/**
 * Generic command to get multiple items of a particular type based on their id and type
 *
 * All the api mapping should be done in this function so only a type is required when calling
 * It should always return robust results that exist in the library, however this may also
 * cache mismatch with local playlists so length might not always match
 *
 * @param type
 *  entity type, eg. song, movie
 * @param items
 *  an array of ids or objects with a file property
 * @param callback
 *  gets passed the return output
 */
app.xbmcController.entityLoadMultiple = function(type, items, callback){

  // this maps a generic model to associated namespaces
  var vars = {
    song: {
      method: 'AudioLibrary.GetSongDetails',
      id: 'songid',
      returnKey: 'songdetails',
      fields: app.fields.get('song')
    },
    movie: {
      method: 'VideoLibrary.GetMovieDetails',
      id: 'movieid',
      returnKey: 'moviedetails',
      fields: app.fields.get('movie')
    },
    tvshow: {
      method: 'VideoLibrary.GetTVShowDetails',
      id: 'tvshowid',
      returnKey: 'tvshowdetails',
      fields: app.fields.get('tvshow')
    }

  };


  //////////////////////////////////////////////
  // No entity type specific stuff happens below
  //////////////////////////////////////////////

  // no matching map or no items, exit
  if(vars[type] === undefined || items === undefined){
    return [];
  }

  // Commence parsing...
  var commands = [],
    map = vars[type],
    defaults = {};

  // Create commands
  for(var n in items){
    var rowData = items[n];

    // Check if numeric
    if(typeof rowData == 'number'){
      // Is a model.. hopefully

      // it has an id, add it as a command
      commands.push({
        method: map.method,
        params: [rowData, map.fields ]
      });

    } else {
      // Is a FILE

      // for a file add defaults
      defaults = {
          position: n,
          albumid: 'file', // we don't ever have this as a type
          artistid: 'file', // we don't ever have this as a type
          album: '',
          artist: '',
          duration: 0
        };

      // extend defaults with model
      item = $.extend(defaults, rowData);

      // add the file as an id
      item.id = rowData.file;

      // add unique id
      item[map.id] = 'file';

      // Update the items array with parsed item
      items[n] = item;
    }
  }


  //////////////////////////////////////////////
  // Hit up xbmc for some loaded models
  //////////////////////////////////////////////

  //if items to get
  if(commands.length > 0){

    // load all song data
    app.xbmcController.multipleCommand(commands, function(res){
      var dict = {}, payload = [];

      // parse each result into an array of song objects (models)
      _.each(res, function(r){
        if(typeof r.result != 'undefined'){
          // save to a local dictionary
          var m = r.result[map.returnKey];
          dict[m[map.id]] = m;
        }
      });

      // add songs back in their correct order using a dictionary
      for(var s in items){
        var sid = items[s];
        if(typeof sid == 'number' && typeof dict[sid] != 'undefined'){
          items[s] = dict[sid];
        }
      }

      // lastly, we clean up the output and ensure every item is an object
      // we also assign final position in the list
      var p = 0;
      for(var n in items){
        var item = items[n];
        if(typeof item == 'object'){
          item.position = p;
          payload.push(item);
          p++;
        }
      }
      // callback
      callback(payload);
    });

  } else {

    // No lookup required (all files)
    callback(items);
  }

  return items;
};


/**
 * Input requested from xbmc
 * Opens prompt dialog and sends the user input text to xbmc via Input.SendText
 *
 * @param msg
 */
app.xbmcController.inputRequestedDialog = function(msg){
  // If a dialog is not already open
  if($('.ui-widget-overlay').length === 0){
    // Prompt for input with the msg
    app.helpers.prompt(msg, function(text){
      app.xbmcController.command('Input.SendText', [text], function(res){
        app.notification(text + ' sent');
      });
    });
  }
};


