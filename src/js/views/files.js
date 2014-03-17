app.FilesView = Backbone.View.extend({

  tagName:'ul',

  className:'files-list',

  initialize:function () {

  },


  render:function () {

    this.$el.empty();

    var $content = $('#content'),
      self = this,
      $filesContainer = $('#files-container', $content),
      $fc = $('<ul class="files-music"></ul>');

    // if no sidebar render the entire page and sources
    if($filesContainer.length === 0){

      // Init
      $content.html(this.template(this.model));
      var $sideContainer = $('<ul class="file-lists"></ul>');

      // sources append
      _.each(this.model.models, function (file) {
        $sideContainer.append(new app.FileView({model:file}).render().el);
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
        $filesContainer.html('<p class="loading-box">No music found in this folder</p>');
      }
    }

    return this;
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
   * @param e
   */
  menu: function(e){
    this.model.attributes.label = this.model.attributes.title;
    app.helpers.menuDialog( app.helpers.menuTemplates('song', this.model.attributes) );
  },


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
    app.cached.fileCollection.fetch({"name":dir, "success": function(res){

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


  playDir:function(e){
    e.stopPropagation();

    var file = this.model.attributes,
      key = 'file',
      value = file.file;

    if(file.type == 'album' || file.type == 'artist' || file.type == 'song'){
      key = file.type + 'id';
      value = file.id;
    }

    app.AudioController.insertAndPlaySong(key, value, function(result){
      app.notification(file.label + ' added to the playlist');
      app.AudioController.playlistRender();
    });
  },



  addDir:function(e){
    e.stopPropagation();

    var file = this.model.attributes,
      key = 'file',
      value = file.file;

    if(file.type == 'album' || file.type == 'artist' || file.type == 'song'){
      key = file.type + 'id';
      value = file.id;
    }

    app.AudioController.playlistAdd( key, value, function(result){
      app.notification(file.label + ' added to the playlist');
      app.AudioController.playlistRender();
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