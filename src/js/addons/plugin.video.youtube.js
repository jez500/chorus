/***********************************************
 * YouTube
 ***********************************************/
app.addOns.addon.pluginvideoyoutube = {
  getAddon: function(){
    return app.addOns.getAddon('pluginvideoyoutube');
  },

  matchId: function(text){
    var id = null;
    var regex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)?([a-zA-Z0-9_-]{6,11})/g;
    var match = regex.exec(text);
    if(match){
      id = match[1];
    }
    return id;
  },

  getSearchPath: function(query){
    return 'plugin://plugin.video.youtube/search/?q=' + query;
  },

  getPlayIdPath: function(id){
    return 'plugin://plugin.video.youtube/play/?video_id=' + id;
  },

  /**
   * Hook into file dir click
   * @param record
   * @returns {*}
   */
  clickDir: function(record){
    if(app.addOns.addon.pluginvideoyoutube.isYouTube(record)){
      if(record.title == 'Search'){

        app.addOns.addon.pluginvideoyoutube.doSearchDialog();
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
    var self = app.addOns.addon.pluginvideoyoutube;
    if(self.isYouTube(file)){
      var yt = self.getAddon();

      // if root item for addon
      if(file.file == yt.file){
        var $actions = $('.file-actions', $el);

        // replace play and add with open and search
        $actions.html(
          '<button class="btn" id="youtubeOpen"><i class="icon-folder-open"></i></button>' +
          '<button class="btn" id="youtubeSearch"><i class="icon-search"></i></button>'
        );

        $('#youtubeOpen', $actions).on('click', function(e){
          e.stopPropagation();
          self.doOpenDialog();
        });

        $('#youtubeSearch', $actions).on('click', function(e){
          e.stopPropagation();
          self.doSearchDialog();
        });

        // add class to show actions
        $el.find('.file-item').addClass('show-actions');
      }
    }
    return $el;
  },

  /**
   * This adds youtube to the search page
   * @param $el
   * @param key
   * @returns {*}
   */
  searchAddons: function($container, key){

    var $el = $('<div></div>');

    var self = app.addOns.addon.pluginvideoyoutube,
      $nores = $('<div>', {class: 'addon-box', id: 'yt-search'}),
      $heading = $( self.searchHeading('YouTube search for: <span>' + key + '</span>', 'youtube')),
      cache = self.cache('get', key, false);

    // if cache
    if(cache !== false){
      // just set results from cached view
      $el.html(new app.FilesListView({model: cache}).render().$el);
      $el.prepend($heading);
    } else {
      // no cache, do the search
      $nores.append( self.searchHeading('Search YouTube for: <span>' + key + '</span>', 'youtube can-click') );
      $el.append($nores);

      // click/search action
      $('#yt-search', $el).on('click', function(){
        // Loading
        $el.html( $(self.searchHeading('Searching YouTube for: <span>' + key + '</span>', 'loading')) );
        // Callback
        self.getSearchResults(key, function(result){
          app.cached.fileListView = new app.FilesListView({model: result});
          view = app.cached.fileListView;
          $el.html(view.render().$el);
          // add heading
          $el.prepend($heading);
          // set cache
          self.cache('set', key, result);
        });
      });
    }

    $('#search-addons').append($el);
  },

  // Heading creator
  searchHeading: function(text, classes){
    var icon = '<i class="fa fa-youtube-play entity-icon" style="background-color: #E5302B"></i>';
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
    if(typeof app.cached.youTubeSearch == 'undefined'){
      app.cached.youTubeSearch = {};
    }
    switch (op){
      case 'get':
        return (typeof app.cached.youTubeSearch[key] == 'undefined' ? data : app.cached.youTubeSearch[key]);
      case 'set':
        app.cached.youTubeSearch[key] = data;
        return app.cached.youTubeSearch[key];
    }
  },


  /**
   * Search dialog
   */
  doSearchDialog: function(){
    var self = app.addOns.addon.pluginvideoyoutube;
    app.helpers.prompt('Search', function(text){
      // set title and notify
      $('#folder-name').html('Search for "' + text + '"');
      var msg = 'Searching for ' + text;
      // set content while loading
      $('#files-container').html('<div class="loading-box">'+msg+'</div>');

      self.getSearchResults(text, function(result){
        app.cached.filesSearchView = new app.FilesView({"model":result}).render();
      });
    });
  },


  /**
   * Open dialog
   */
  doOpenDialog: function(){
    var self = app.addOns.addon.pluginvideoyoutube;
    app.helpers.prompt('Open link', {
      "Play": function(text){
        if(text.length < 1) return false;
        var id = self.matchId(text);
        if(id !== null)
          app.VideoController.insertAndPlay('file', self.getPlayIdPath(id), function(){});
        // TODO: Display an error if the video ID can't be parsed.
      },
      "Add": function(text){
        if(text.length < 1) return false;
        var id = self.matchId(text);
        if(id !== null)
          app.VideoController.addToPlaylist(self.getPlayIdPath(id), 'file', 'add', function(){});
      }
    });
  },

  /**
   * Get a youtube search result view
   * @param query
   */
  getSearchResults: function(query, callback){
    // get search directory
    var path = app.addOns.addon.pluginvideoyoutube.getSearchPath(query);

    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({"sourcetype": 'video', "name": path, "success": callback});
  },

  /**
   * If youtube file record
   * @param record
   * @returns {*}
   */
  isYouTube: function(record){
    return (record.file.indexOf('plugin.video.youtube') >= 0);
  }

};
