/**
 * Framework for including functionality for addons
 * eg. soundcloud
 * @type {{}}
 */

app.addOns = {addon: {}};

app.addOns.getSources = function(callback){

  app.xbmcController.command('Addons.GetAddons', ['xbmc.addon.audio', 'unknown', 'all', ["name", "thumbnail", "enabled"]], function(res){
    // add a title before return
    var sources = res.result.addons,
      addons = [];

    // parse
    for(var i in sources){
      var item = sources[i];
      if(item.enabled){
        item.file = 'plugin://' + item.addonid + '/';
        item.title = item.name;
        item.filetype = 'directory';
        item.id = item.addonid;
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








/*****************************************************************************
 * ADDONS BELOW
 * @TODO move to files
 ****************************************************************************/






/***********************************************
 * Soundcloud
 ***********************************************/
app.addOns.addon.pluginaudiosoundcloud = {

  // the time to wait before sending keyboard commands
  waitTime: 4000,

  getAddon: function(){
    return app.addOns.getAddon('pluginaudiosoundcloud');
  },

  getSearchPath: function(){
    return 'plugin://plugin.audio.soundcloud/SearchTracks?url=plugin%3A%2F%2Fmusic%2FSoundCloud%2Ftracks%2Fsearch&oauth_token=&mode=13';
  },

  /**
   * Parses a file record
   * @param record
   * @returns {*}
   */
  parseFileRecord: function(record){
    // is a soundcloud url
    if(app.addOns.addon.pluginaudiosoundcloud.isSoundCloud(record)){
      // rewrite the url to contain the label
      record.file = record.file.replace(
        'plugin://plugin.audio.soundcloud/',
        'plugin://plugin.audio.soundcloud/' + encodeURIComponent(record.label)
      );

      /* // add an icon if none - doesn't look much better than default icons
      if(typeof record.thumbnail == 'undefined' || record.thumbnail == ''){
        var sc = app.addOns.getAddon('pluginaudiosoundcloud');
        record.thumbnail = sc.thumbnail;
      } */

    }

    return record;
  },

  /**
   * Hook into file dir click
   * @param record
   * @returns {*}
   */
  clickDir: function(record){
    if(app.addOns.addon.pluginaudiosoundcloud.isSoundCloud(record)){
      if(record.title == 'Search'){
        console.log(record);
        app.addOns.addon.pluginaudiosoundcloud.doSearchDialog();
      }
    }
    return record;
  },


  /**
   * Hook into post file row creation
   * @param $el
   * @param file
   * @returns {*}
   */
  postProcessFileView: function($el, file){
    if(app.addOns.addon.pluginaudiosoundcloud.isSoundCloud(file)){
      var sc = app.addOns.addon.pluginaudiosoundcloud.getAddon();

      // if root item for addon
      if(file.file == sc.file){
        var $actions = $('.file-actions', $el);

        // replace play and add with search
        $actions.html('<button class="btn" id="soundcloudSearch"><i class="icon-search"></i></button>');

        // Bind
        $('#soundcloudSearch', $actions).on('click', function(e){
          e.stopPropagation();

          // trigger search
          app.addOns.addon.pluginaudiosoundcloud.doSearchDialog();
          var dir = app.addOns.addon.pluginaudiosoundcloud.getSearchPath();

          app.cached.fileCollection = new app.FileCollection();
          app.cached.fileCollection.fetch({"name":dir, "success": function(res){
            // render page
            console.log(res);
            app.cached.filesSearchView = new app.FilesView({"model":res}).render();
            //$('#files-container').html(app.cached.filesSearchView.$el);
          }});

        });

        // add class to show actions
        $el.find('.file-item').addClass('show-actions');

      }
    }
    return $el;
  },

  /**
   * This adds soundcloud to the search page
   * @param $el
   * @param key
   * @returns {*}
   */
  searchAddons: function($el, key){

    var $nores = $('<div>', {class: 'addon-box', id: 'sc-search'}),
      sc = app.addOns.addon.pluginaudiosoundcloud.getAddon(),
      logo = '<img src="' + app.parseImage(sc.thumbnail) + '">',
      $heading = $('<h3 class="search-heading">' + logo + 'SoundCloud search for: <span>' + key + '</span></h3>'),
      cache = app.addOns.addon.pluginaudiosoundcloud.cache('get', key, false);

    // add logo to heading

    // if cache
    if(cache !== false){
      // just set results from cached view
      $el.html(cache.render().$el);
      $el.prepend($heading);
    } else {
      // no cache, do the search
      $nores.append(logo + '<span>search soundcloud for: <strong>' + key + '</strong></span>');
      $el.append($nores);

      // click/search action
      $('#sc-search', $el).on('click', function(){
        // Loading
        $el.html($('<strong>', {class: 'addon-box', text: 'Searching SoundCloud for ' + key}).prepend($(logo)));
        // Callback
        app.addOns.addon.pluginaudiosoundcloud.getSearchResults(key, function(view){
          $el.html(view.render().$el);
          // add heading
          $el.prepend($heading);
          // set cache
          app.addOns.addon.pluginaudiosoundcloud.cache('set', key, view);
        });
      });
    }

    return $el;
  },

  /**
   * Get and set cache, when get, data is default
   * @param op
   * @param key
   * @param data
   * @returns {*}
   */
  cache:function(op, key, data){
    if(typeof app.cached.soundCloudSearch == 'undefined'){
      app.cached.soundCloudSearch = {};
    }
    switch (op){
      case 'get':
        return (typeof app.cached.soundCloudSearch[key] == 'undefined' ? data : app.cached.soundCloudSearch[key]);
      case 'set':
        app.cached.soundCloudSearch[key] = data;
        return app.cached.soundCloudSearch[key];
    }
  },


  /**
   * Search dialog
   */
  doSearchDialog: function(){
    app.helpers.prompt('What do you want to search for?', function(text){
      app.xbmcController.command('Input.SendText', [text], function(res){
        // set title and notify
        $('#folder-name').html('Search for "' + text + '"');
        var msg = 'Searching for ' + text;
        // set content while loading
        $('#files-container').html('<div class="loading-box">'+msg+'</div>');
      });
    });
  },


  /**
   * Get a soundcloud search result view
   * @param query
   */
  getSearchResults: function(query, callback){

    // get search directory
    var dir = app.addOns.addon.pluginaudiosoundcloud.getSearchPath();
    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({"name":dir, "success": function(result){
      // success only after text input complete which is flaky!
      // return view
      app.cached.fileListView = new app.FilesListView({model: result});
      callback(app.cached.fileListView);
    }});

    // yuk hack - it seems to need a bit of time to init the search dialog and cannot be in the dir callback
    window.setTimeout(function(){
      app.xbmcController.command('Input.SendText', [query], function(res){
        console.log(res);
      });
    }, app.addOns.addon.pluginaudiosoundcloud.waitTime);

  },


  /**
   * If soundcloud file record
   * @param record
   * @returns {*}
   */
  isSoundCloud: function(record){
    return (record.file.indexOf('plugin.audio.soundcloud') != -1);
  }


};