
/***********************************************
 * Soundcloud
 ***********************************************/
app.addOns.addon.pluginaudioradio_de = {

  key: 'pluginaudioradio_de',
  id: 'plugin.audio.radio_de',
  label: 'Radio Station',

  getAddon: function(){
    return app.addOns.getAddon(app.addOns.addon.pluginaudioradio_de.key);
  },

  getSearchPath: function(){
    return 'plugin://plugin.audio.radio_de/stations/search/';
  },

  /**
   * Parses a file record
   * @param record
   * @returns {*}
   */
  parseFileRecord: function(record){
    var self = app.addOns.addon.pluginaudioradio_de;
    if(self.isRadio(record)){
      if(record.filetype == 'file'){

      }
    }

    return record;
  },

  /**
   * Hook into file dir click
   * @param record
   * @returns {*}
   */
  clickDir: function(record){
    var self = app.addOns.addon.pluginaudioradio_de;
    if(self.isRadio(record)){
      // is search?
      if(record.file == self.getSearchPath()){
        app.xbmcController.inputRequestedDialog('Enter the name of a station');
      }
    }
    return record;
  },



  /**
   * This adds radio to the search page
   * @param $el
   * @param key
   * @returns {*}
   */
  searchAddons: function($container, key){

    var $el = $('<div></div>');

    var self = app.addOns.addon.pluginaudioradio_de,
      $nores = $('<div>', {class: 'addon-box', id: 'radio-search'}),
      sc = self.getAddon(),
      $heading = $( self.searchHeading(self.label + ' search for: <span>' + key + '</span>', 'radio')),
      cache = self.cache('get', key, false);

    // add logo to heading

    // if cache
    if(cache !== false){
      // just set results from cached view
      $el.html(cache.render().$el);
      $el.prepend($heading);
    } else {
      // no cache, do the search
      $nores.append( self.searchHeading('Search ' + self.label + 's for: <span>' + key + '</span>', 'radio can-click') );
      $el.append($nores);

      // click/search action
      $('#radio-search', $el).on('click', function(){
        // Loading
        $el.html( $(self.searchHeading('Searching ' + self.label + 's for: <span>' + key + '</span>', 'loading')) );
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
    var icon = '<i class="fa fa-rss entity-icon" style="background-color: #44aa5b"></i>';
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
    if(typeof app.cached.radioSearch == 'undefined'){
      app.cached.radioSearch = {};
    }
    switch (op){
      case 'get':
        return (typeof app.cached.radioSearch[key] == 'undefined' ? data : app.cached.radioSearch[key]);
      case 'set':
        app.cached.radioSearch[key] = data;
        return app.cached.radioSearch[key];
    }
  },



  /**
   * Get a radio search result view
   * @param query
   */
  getSearchResults: function(query, callback){

    // get search directory
    var self = app.addOns.addon.pluginaudioradio_de,
      dir = self.getSearchPath(),
      path = dir + encodeURIComponent(query);

    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({"sourcetype": 'music', "name": path, "success": function(result){

      // return view
      app.cached.fileListView = new app.FilesListView({model: result});
      callback(app.cached.fileListView);

    }});

  },


  /**
   * If radio file
   * @param record
   * @returns {*}
   */
  isRadio: function(record){
    return (record.file.indexOf('plugin.audio.radio_de') != -1);
  }


};