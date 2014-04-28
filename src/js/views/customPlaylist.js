/**
 * Page View of custom playlist / thumbsup
 * @type {*|void|Object|extend|extend|extend}
 */
app.CustomPlaylistSongListView = Backbone.View.extend({

  tagName:'ul',

  className:'playlist-song-list',

  events: {
    "click .playlist-append": "appendPlaylist",
    "click .playlist-replace": "replacePlaylist",
    "click .playlist-browser-replace": "browserReplacePlaylist",
    "click .playlist-delete": "deleteCustomListPlaylist",
    "click .playlist-export": "exportCustomListPlaylist",
    "click .thumbsup-append": "appendThumbsup",
    "click .thumbsup-replace": "replaceThumbsup",
    "click .thumbsup-browser-replace": "browserReplacePlaylist"
  },

  initialize:function () {

  },


  render:function () {

    // save the list
    var args = app.helpers.arg();
    if(args[0] == 'playlist'){
      this.list = app.playlists.getCustomPlaylist(args[1]);
    }
    if(args[0] == 'thumbsup'){
      this.list = app.playlists.getThumbsUp('song');
    }

    this.$el.empty();
    var i = 0;
    _.each(this.model.models, function (song) {
      song.attributes.list = this.list;
      song.attributes.position = i;
      this.$el.append(new app.CustomPlaylistSongView({model:song}).render().el);
      i++;
    }, this);

    // sortable
    this.playlistBinds();

    // menu
    var menu = app.playlists.getDropdown();
    this.$el.prepend(menu);
    $('.playlist-actions', this.$el).prepend('<small>' + this.model.models.length + ' items</small>');

    return this;
  },


  playlistBinds:function(){

    var self = this;

    //sortable
    $sortableCustom = this.$el;

    $sortableCustom.sortable({
      placeholder: "playlist-item-placeholder",
      handle: ".song-title",
      items: "> li",
      axis: "y",

      update: function( event, ui ) {
        var list = [],
          listId = app.helpers.arg(0) == 'thumbsup' ? 'thumbsup' : app.helpers.arg(1),
          $container = $('ul.playlist-song-list, ul.song-thumbsup-list');

        // recreate the list using the original list + pos to rebuild
        $container.find('div.playlist-item').each(function(i,d){
          var item = self.list.items[$(d).data('pos')];
          list.push(item);
        });

        // Update the playlist order in storage
        app.playlists.replaceCustomPlayList(listId, list);

      }
    }).disableSelection();

  },


  /**
   * Append a custom playlist
   * @param e
   */
  appendPlaylist: function(e){
    e.preventDefault();
    // add list
    var list = app.playlists.getCustomPlaylist(this.list.id);

    this.addCustomListToPlaylist(list.items);
    app.notification('Playlist updated');
  },


  /**
   * Replace with a custom playlist
   * @param e
   */
  replacePlaylist: function(e){
    e.preventDefault();
    var listId = this.list.id,
      list = app.playlists.getCustomPlaylist(listId);
    this.replacePlaylistItems(list.items);
  },


  /**
   * Replace Browser player playlist with a custom playlist or thumbs up songs
   * @param e
   */
  browserReplacePlaylist: function(e){
    e.preventDefault();
    if(app.helpers.arg(0) == 'thumbsup'){
      // on thumbs up
      app.playlists.playlistAddItems('local', 'replace', 'thumbsup', 'song');
    } else {
      //on custom playlist
      app.playlists.playlistAddItems('local', 'replace', 'list', this.list.id);
    }
  },


  /**
   * Delete playlist
   * @param e
   */
  deleteCustomListPlaylist: function(e){
    e.preventDefault();
    // delete with confirm
    var model = this.list;
    app.helpers.confirm("Delete playlist for good? This cannot be undone", function(){

      // delete the list
      app.playlists.deleteCustomPlaylist(model.id);

      // clear the deleted playlist from content
      var $c = $('#content');
      if($c.find('.playlist-song-list').length > 0){
        $c.html('<div class="loading-box">Playlist removed</div>');
      }

    });
  },


  /**
   * Append thumbs up
   */
  appendThumbsup: function(e){
    e.preventDefault();
    var list = app.playlists.getThumbsUp('song');
    this.addCustomListToPlaylist(list.items);
    app.notification('Playlist updated');
  },


  /**
   * replace thumbs up
   */
  replaceThumbsup: function(e){
    e.preventDefault();
    var list = app.playlists.getThumbsUp('song');
    this.replacePlaylistItems(list.items);
  },


  /**
   * handler for replacing a playlist (used by thumbs up too)
   * @param items
   */
  replacePlaylistItems: function(items){
    var self = this;
    app.helpers.confirm("Replace the current xbmc playlist with this list?", function(){
      //Confirmed
      // clear list
      app.AudioController.playlistClear(function(res){
        // Add the list
        self.addCustomListToPlaylist(items, function(pldata){
          // play first song
          app.AudioController.playPlaylistPosition(0, function(data){
            //update playlist
            app.AudioController.playlistRender();
            //notify
            app.notification('Playlist updated and playing');
          });
        });
      });
    });
  },


  /**
   * Adds a custom playlist to the xbmc playlist
   * @param items
   * @param callback
   */
  addCustomListToPlaylist:function(items, callback) {
    for(var i in items){
      if(typeof items[i] != 'number'){
        items[i] = items[i].file;
      }
    }
    app.AudioController.playlistAddMultiple('mixed', items, function(result){
      // refresh playlist and switch to what got added
      app.AudioController.playlistRender();
      app.playlists.changePlaylistView('xbmc');
      if(callback){
        callback(result);
      }
    });
  },


  /**
   * Export a custom playlist
   */
  exportCustomListPlaylist: function(e){
    e.preventDefault();
    app.ui.featureNotBuiltDialog();
  }


});


/**
 * Sidebar view of playlist (browser player list)
 * @type {*|void|Object|extend|extend|extend}
 */
app.CustomPlaylistSongSmallListView = Backbone.View.extend({
  tagName:'ul',
  className:'browser-playlist-song-list',

  render:function () {

    this.$el.empty();
    var i = 0;
    _.each(this.model.models, function (song) {
      // tweak model to suit xbmc item format
      var s = song.attributes;
      s.pos = i;
      s.items = [];
      s.list = 'local';
      if(!s.id){
        s.id = s.songid;
      }
      // append model
      song.attributes = s;
      this.$el.append(new app.PlaylistItemView({model:s, className:'playlist-item browser-player'}).render().$el);
      i++;
    }, this);

    this.playlistBinds();

    return this;
  },

  playlistBinds:function(){

    //sortable
    var $sortable = this.$el, self = this;
    $sortable.sortable({
      placeholder: "playlist-item-placeholder",
      handle: ".playlist-play",
      items: "> li",
      axis: "y",
      update: function( event, ui ) {
        var newList = [];
        self.$el.find('div.playlist-item').each(function(i,d){
          // recreate the list using old list and new position
          newList.push($(d).data('id'));
        });

        app.audioStreaming.sortableChangePlaylistPosition(newList);
      }
    }).disableSelection();

  }

});




/**
 * Custom Song Item view
 * @type {*|void|Object|extend|extend|extend}
 */
app.CustomPlaylistSongView = Backbone.View.extend({

  tagName:"li",

  className:'song-row',

  events: {
    "dblclick .song-title": "loadSong",
    "click .song-play":     "playSong",
    "click .song-add":      "addSong",
    "click .song-thumbsup": "thumbsUp",
    "click .song-remove":   "removeSong",
    "click .song-menu":   "menu"
  },


  initialize:function () {},


  /**
   * Render
   * @param e
   */
  render:function () {

    if(typeof this.model.attributes.position == 'undefined'){
      return this;
    }

    // add if thumbs up
    if( app.playlists.isThumbsUp('song', this.model.attributes.songid) ) {
      this.$el.addClass('thumbs-up');
    }
    // render
    this.$el.html(this.template(this.model.attributes));


    return this;
  },


  /**
   * Contextual Menu
   * @param e
   */
  menu: function(){
    app.helpers.menuDialog( app.helpers.menuTemplates('song',this.model.attributes));
  },


  /**
   * Inserts into next pos on playlist then plays
   * @param event
   */
  playSong: function(event){
   var song = this.model.attributes,
     key = app.helpers.getSongKey(song);

    if(app.audioStreaming.getPlayer() == 'local'){
      // add and play Local
      app.playlists.playlistAddItems('local', 'append', 'song', song.songid, function(){
        // play the last song in the list (what we just added)
        app.audioStreaming.playPosition((app.audioStreaming.playList.items.models.length - 1));
      });
    } else {
      app.playlists.changePlaylistView('xbmc');
      app.AudioController.insertAndPlay(key.type, key.id, function(){
        app.notification(song.label + ' added to the playlist');
        app.AudioController.playlistRender();
      });
    }

  },

  addSong: function(){
    var song = this.model.attributes,
      key = app.helpers.getSongKey(song);

    if(app.audioStreaming.getPlayer() == 'local'){
      // add to local
      app.playlists.playlistAddItems('local', 'append', 'song', song.songid, function(){ });
    } else {
      app.AudioController.playlistAdd(key.type, key.id, function(result){
        app.notification(song.label + ' added to the playlist');
        app.AudioController.playlistRender();
      });
    }
  },

  /**
   * Toggle thumbs up status
   */
  thumbsUp: function(e){
    var songid = this.model.attributes.songid,
      op = (app.playlists.isThumbsUp('song', songid) ? 'remove' : 'add'),
      $el = $(e.target).closest('li');
    app.playlists.setThumbsUp(op, 'song', songid);
    $el.toggleClass('thumbs-up');
  },


  removeSong: function(e){
    var position = this.model.attributes.position,
      listid = this.model.attributes.list.id,
      $target = $(e.target);

    app.playlists.deleteCustomPlaylistSong(listid, position);
    $target.closest('li').slideUp(function(){ $(this).remove(); });
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

    var song = this.model.attributes,
      key = app.helpers.getSongKey(song),
    // if file, gets the whole object
      id = (key.type == 'file' ? song : song.songid);

    app.playlists.saveCustomPlayListsDialog(key.type, [id]);
  }

});