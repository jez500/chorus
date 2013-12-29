app.FilesView = Backbone.View.extend({

  tagName:'ul',

  className:'files-list',

  initialize:function () {

  },


  render:function () {

    this.$el.empty();

    var $content = $('#content'),
      $filesContainer = $('#files-container', $content),
      $fc = $('<ul class="files-music"></ul>');

    if($filesContainer.length == 0){
      $content.html(this.template(this.model));
    }

    this.model.models.sort(function(a,b){
      return app.helpers.aphabeticalSort(a.attributes.title, b.attributes.title)
    });

    _.each(this.model.models, function (file) {

      if(file.attributes.filetype == '' || file.attributes.filetype == 'directory'){
        // is a dir
        this.$el.append(new app.FileView({model:file}).render().el);
      } else {
        // is a file
        $fc.append(new app.FileView({model:file}).render().el);
      }

    }, this);

    if($fc.html() != ''){
      $filesContainer.html($fc);
    } else {
      $filesContainer.html('<p class="loading-box">No music found in this folder</p>');
    }

    return this;
  }


});

app.FileView = Backbone.View.extend({

  tagName:"li",

  events: {
    "dblclick .file-item": "playDir",
    "click .file-play": "playDir",
    "click .file-type-directory": "clickDir",
    "click .file-add": "addDir"
  },

  initialize:function () {

  },

  render:function () {

    // render
    this.$el.html(this.template(this.model.attributes));
    return this;

  },

  clickDir:function(e){
    e.stopPropagation();

    var file = this.model.attributes,
      dir = file.file,
      self = this,
      $this = $(e.target).parent();

    $('#sidebar-first li').removeClass('lowest');
    $this.addClass('loading');

    app.cached.fileCollection = new app.FileCollection();
    app.cached.fileCollection.fetch({"name":file.file, "success": function(res){
      console.log(file);
      // render content and get sidebar updated content
      var el = new app.FilesView({"model":res}).render().$el;

      // dont append if already appended
      if(self.$el.find('ul').length == 0){
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
      value = file.id
    }

    app.AudioController.insertAndPlaySong(key, value, function(result){
      app.notification(file.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });
  },



  addDir:function(e){
    e.stopPropagation();

    var file = this.model.attributes,
      key = 'file',
      value = file.file;

    if(file.type == 'album' || file.type == 'artist' || file.type == 'song'){
      key = file.type + 'id';
      value = file.id
    }

    app.AudioController.playlistAdd( key, value, function(result){
      app.notification(file.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });

  }


});