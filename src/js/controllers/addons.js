/**
 * Framework for including functionality for addons
 * eg. soundcloud
 *
 * To include support for a new addon, copy ../addons/plugin.audio.soundcloud.js to ../addons/[your addon name].js
 * and edit to suit your addon, it will get auto compiled but dev requires you add it to src/index.html manually
 *
 *
 * @type {{}}
 */

app.addOns = {addon: {}};

app.addOns.getSources = function(callback){

  var commands = [];
  var params = ['unknown', 'all', ["name", "thumbnail", "enabled", "extrainfo"]];
  commands.push({method: 'Addons.GetAddons', params: ['xbmc.addon.audio'].concat(params)});
  commands.push({method: 'Addons.GetAddons', params: ['xbmc.addon.video'].concat(params)});

  app.xbmcController.multipleCommand(commands, function(res){
    // add a title before return
    var sources = res[0].result.addons.concat(res[1].result.addons),
      addons = [];

    // parse
    for(var i in sources){
      var item = sources[i], defaults = {};

      // Attempt to determine content type from extrainfo
      var provides = 'music';
      for(var index in item.extrainfo){
        // Argh, why couldn't Kodi just serve us an object?
        if(item.extrainfo[index].key === 'provides'){
          provides = item.extrainfo[index].value;
          if(provides === 'audio') provides = 'music';
          break;
        }
      }

      if(item.enabled){
        // extend
        defaults = {
          file: 'plugin://' + item.addonid + '/',
          title: item.name,
          filetype: 'directory',
          id: item.addonid,
          sourcetype: provides,
          playlistId: app.AudioController.playlistId
        };
        item = $.extend(item, defaults);
        addons.push(item);
      }
    }
    app.cached.addonSources = addons;

    if(callback){
      callback(addons);
    }
  });

};

/**
 * Execute a addon callback when sources are ready
 * @param callback
 */
app.addOns.ready = function(callback){
  if(typeof app.cached.addonSources != 'undefined'){
    callback(app.cached.addonSources);
  } else {
    app.addOns.getSources(callback);
  }
};


/**
 * Gets a specific addon from cache
 * @param addonKey
 * @returns {*}
 */
app.addOns.getAddon = function(addonKey){
  if(typeof app.cached.addonSources != 'undefined'){
    for(var i in app.cached.addonSources){
      var item = app.cached.addonSources[i],
        itemAddonKey = app.addOns.slug(item);
      if(itemAddonKey == addonKey){
        return item;
      }
    }
  }
  return {};
};


/**
 * Invokes a function on a record, looks for available addon code, if found checks if function before executing
 * @param record
 * @param functionName
 * @returns {*}
 */
app.addOns.invokeAll = function(functionName, record, arg1, arg2){

  // this invokes other modules
  if(typeof app.cached.addonSources != 'undefined'){
    for(var i in app.cached.addonSources){
      var item = app.cached.addonSources[i],
        addonKey = app.addOns.slug(item);

      record = app.addOns.invoke(addonKey, functionName, record, arg1, arg2);
    }
  } else {
    // this doesnt give us an instant result but hopefully ready for next use
    app.addOns.getSources();
  }
  return record;

};


/**
 * Invokes a single addon hook
 * @param addonKey
 * @param functionName
 * @param record
 * @returns {*}
 */
app.addOns.invoke = function(addonKey, functionName, record, arg1, arg2){

  if(typeof app.addOns.addon[addonKey] != 'undefined' && typeof app.addOns.addon[addonKey][functionName] == 'function'){
    // addon code found, execute
    var func = app.addOns.addon[addonKey][functionName];
    record = func(record, arg1, arg2);
  }
  return record;

};


/**
 * Makes a slug that we use for addonKey, could be alot better but it works for now
 * @param addonObj
 * @returns {string}
 */
app.addOns.slug = function(addonObj){
 return addonObj.addonid.split('.').join('');
};

