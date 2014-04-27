
/***********************************************
 * Soundcloud
 ***********************************************/
app.addOns.addon.pluginaudiosoundcloud = {

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
        'plugin://plugin.audio.soundcloud/' + encodeURIComponent(record.label) + '+'
      );
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
    var self = app.addOns.addon.pluginaudiosoundcloud;
    if(self.isSoundCloud(file)){
      var sc = self.getAddon();

      // if root item for addon
      if(file.file == sc.file){
        var $actions = $('.file-actions', $el);

        // replace play and add with search
        $actions.html('<button class="btn" id="soundcloudSearch"><i class="icon-search"></i></button>');

        // Bind
        $('#soundcloudSearch', $actions).on('click', function(e){
          e.stopPropagation();

          // trigger search
          self.doSearchDialog();
          var dir = self.getSearchPath();

          app.cached.fileCollection = new app.FileCollection();
          app.cached.fileCollection.fetch({"sourcetype": 'music', "name":dir, "success": function(res){
            // render page
            app.cached.filesSearchView = new app.FilesView({"model":res}).render();
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
  searchAddons: function($container, key){

    var $el = $('<div></div>');

    var self = app.addOns.addon.pluginaudiosoundcloud,
      $nores = $('<div>', {class: 'addon-box', id: 'sc-search'}),
      sc = self.getAddon(),
      $heading = $( self.searchHeading('SoundCloud search for: <span>' + key + '</span>', 'soundcloud')),
      cache = self.cache('get', key, false);

    // add logo to heading

    // if cache
    if(cache !== false){
      // just set results from cached view
      $el.html(cache.render().$el);
      $el.prepend($heading);
    } else {
      // no cache, do the search
      $nores.append( self.searchHeading('Search SoundCloud for: <span>' + key + '</span>', 'soundcloud can-click') );
      $el.append($nores);

      // click/search action
      $('#sc-search', $el).on('click', function(){
        // Loading
        $el.html( $(self.searchHeading('Searching SoundCloud for: <span>' + key + '</span>', 'loading')) );
        // Callback
        self.getSearchResults(key, function(view){
          $el.html(view.render().$el);
          // add heading
          $el.prepend($heading);
          // set cache
          self.cache('set', key, view);
        });
      });
    }

    $('#search-addons').append($el);
  },

  // Heading creator
  searchHeading: function(text, classes){
    var icon = '<i class="fa fa-cloud entity-icon" style="background-color: #FF4C00"></i>';
    return '<h3 class="search-heading entity-heading ' + classes + '">' + icon + text + '</h3>';
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
    var dir = app.addOns.addon.pluginaudiosoundcloud.getSearchPath(),
      // add the query string
      path = dir + '&q=' + query,
      $window = $(window);

    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({"sourcetype": 'music', "name": path, "success": function(result){

      // return view
      app.cached.fileListView = new app.FilesListView({model: result});
      callback(app.cached.fileListView);

    }});

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