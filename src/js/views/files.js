app.FilesView = Backbone.View.extend({

  tagName:'ul',

  className:'files-list',

  initialize:function () {

    // get a mixed view for titles and icons
    this.mixedView = new app.MixedView({model: {key: 'filesPage'}});

  },

  events: {
    "click .entity-heading": "sidebarToggleContent"
  },


  render:function () {

    this.$el.empty();

    var $content = $('#content'),
      self = this,
      $filesContainer = $('#files-container', $content),
      $fc = $('<ul class="files-music"></ul>'),
      $sideContainer = $('<ul class="file-lists"></div>');

    // if no sidebar render the entire page and sources
    if($filesContainer.length === 0){

      // Init
      $content.html(this.template(this.model));

      // sources append
      _.each(this.model.models, function (file) {
        // headings
        if(file.attributes.type == 'heading'){
          $sideContainer.append(self.mixedView.getHeading(file.attributes.id, file.attributes.id));
        } else {
          // sources
          $sideContainer.append(new app.FileView({model:file}).render().el);
        }
      });

      app.helpers.setFirstSidebarContent($sideContainer);

    } else {
      // Returning a renderable list

      // Sort
      self.model.models.sort(function(a,b){
        return app.helpers.aphabeticalSort(a.attributes.title, b.attributes.title);
      });

      _.each(this.model.models, function (file) {

        if(file.attributes.filetype === '' || file.attributes.filetype == 'directory'){
          // is a dir
          this.$el.append(new app.FileView({model:file}).render().el);
        } else {
          // is a file
          $fc.append(new app.FileView({model:file}).render().el);
        }

      }, this);

      if($fc.html() !== ''){
        $filesContainer.html($fc);
      } else {
        $filesContainer.html('<p class="loading-box">No media found in this folder</p>');
      }
    }

    return this;
  },


  sidebarToggleContent: function(e){
    var $el = $(e.target);

  }

});


/**
 * Raw file list
 * @type {*|void|Object|extend|extend|extend}
 */
app.FilesListView = Backbone.View.extend({

  tagName:'ul',

  className:'files-list',

  initialize:function () {

  },

  render:function () {

    this.$el.empty();

    this.model.models.sort(function(a,b){
      return app.helpers.aphabeticalSort(a.attributes.title, b.attributes.title);
    });

    _.each(this.model.models, function (file) {
      this.$el.append(new app.FileView({model:file}).render().el);
    }, this);

    return this;
  }

});



app.FileView = Backbone.View.extend({

  tagName:"li",

  className:'file-row',

  events: {
    "dblclick .file-item": "playDir",
    "click .file-play": "playDir",
    "click .file-type-directory": "clickDir",
    "click .file-add": "addDir",
    "click .file-menu":  "menu"
  },

  initialize:function () {

  },

  render:function () {
    var model = this.model.attributes;
    // title
    model.title = (model.title === undefined ? model.name : model.title);
    // render
    this.$el.html(this.template(model));
    // post process file
    this.$el = app.addOns.invokeAll('postProcessFileView', this.$el, model);
    return this;
  },


  /**
   * Contextual Menu
   * @TODO add context menu for video
   *
   * @param e
   */
  menu: function(e){
    e.preventDefault();
    var file = this.model.attributes,
      self = this;
    self.getDialog();
  },

  getDialog: function(){
    var file = this.model.attributes,
      self = this;
    if(file.sourcetype == 'music'){
      file.label = file.title;
      app.helpers.menuDialog( app.helpers.menuTemplates('song', file) );
    } else {
      app.helpers.menuDialog( self.getVideoDialog(file ));
    }
  },

  getVideoDialog: function(model){

    return {
      title: model.label,
      key: 'video',
      omitwrapper: true,
      items: [
        {url: '#', class: 'video-download', title: 'Download URL', callback: function(){
          // do nothing, url in a tag
          // window.location = url;
          app.AudioController.downloadFile(file.file, function(url){
            app.helpers.info( 'Download Url', '<p>' + url + '</p>' );
          });
        }},
        {url: '#', class: 'video-stream', title: 'Stream Video', callback: function(){
          app.VideoController.stream('html5', model);

        }}
      ]
    };

  },


  /**
   * Dir was clicked
   *
   * @param e
   */
  clickDir:function(e){
    e.stopPropagation();

    var file = this.model.attributes,
      dir = file.file,
      self = this,
      $this = $(e.target).parent();

    // let addons tinker
    app.addOns.invokeAll('clickDir', file);

    $('#sidebar-first li').removeClass('lowest');
    $this.addClass('loading');

    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({"sourcetype": file.sourcetype, "name":dir, "success": function(res){

      // render content and get sidebar updated content
      var el = new app.FilesView({"model":res}).render().$el;

      // dont append if already appended
      if(self.$el.find('ul.files-list').length === 0){
        self.$el.append(el);
      }

      // add a class to the curent open tree
      $this.addClass('lowest').removeClass('loading');
      $('#folder-name').html(file.label);

    }});


  },


  /**
   * If the file has an id
   * @param file
   * @returns {{key: string, value: string}}
   */
  fileGetTypeId: function(file){

    var ret = {
      key: 'file',
      value: file.file
    };

    if(file.type == 'album' ||
      file.type == 'artist' ||
   //   file.type == 'song' ||
      file.type == 'movie' ||
      file.type == 'episode'){

      // if not a stream
      if(file.mimetype != "application/octet-stream"){
        ret.key = file.type + 'id';
        ret.value = file.id;
      }

    }

    if(file.type == "directory"){
      ret.key = file.type;
    }

    return ret;
  },


  playDir:function(e){
    e.stopPropagation();

    var file = this.model.attributes,
      controller = app[file.controller],
      typeid = this.fileGetTypeId(file);

//    if(file.mimetype == "application/octet-stream"){
//      // Is a stream (can't add it to the playlist)
//      controller.playerOpen('path', file.file, function(){
//        app.notification('Started playing ' + file.label);
//      });
//    } else {
      // Not a stream, default behaviour
      controller.insertAndPlay(typeid.key, typeid.value, function(result){
        app.notification(file.label + ' added to the playlist');
        controller.playlistRender();
      });

 //   }


  },



  addDir:function(e){
    e.stopPropagation();

    var file = this.model.attributes,
      typeid = this.fileGetTypeId(file),
      controller = app[file.controller];

    controller.playlistAdd( typeid.key, typeid.value, function(result){
      app.notification(file.label + ' added to the playlist');
      controller.playlistRender();
    });

  },

  downloadSong: function(e){
    var file = this.model.attributes.file;

    e.preventDefault();
    app.AudioController.downloadFile(file, function(url){
      window.location = url;
    });
  },

  addToCustomPlaylist: function(e){
    e.preventDefault();
    var file = this.model.attributes;
    app.playlists.saveCustomPlayListsDialog('file', [file]);
  }



});