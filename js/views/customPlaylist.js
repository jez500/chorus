app.CustomPlaylistSongListView = Backbone.View.extend({

  tagName:'ul',

  className:'playlist-song-list',

  events: {
    "click .playlist-append": "appendPlaylist",
    "click .playlist-replace": "replacePlaylist",
    "click .playlist-delete": "deleteCustomListPlaylist",
    "click .thumbsup-append": "appendThumbsup",
    "click .thumbsup-replace": "replaceThumbsup"
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
          $container = $('ul.playlist-song-list');

        // recreate the list using the original list + pos to rebuild
        $container.find('div.playlist-item').each(function(i,d){
          var item = self.list.items[$(d).data('pos')];
          list.push(item);
        });
        console.log(list, listId);
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
    console.log(list.items);
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
            app.AudioController.playlistRefresh();
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
    for(i in items){
      if(typeof items[i] != 'number'){
        items[i] = items[i].file;
      }
    }
    app.AudioController.playlistAddMultiple('mixed', items, function(result){
      // refresh playlist and switch to what got added
      app.AudioController.playlistRefresh();
      app.playlists.changePlaylistView('xbmc');
      if(callback){
        callback(result);
      }
    });
  }
});

app.CustomPlaylistSongView = Backbone.View.extend({

  tagName:"li",

  className:'song-row',

  events: {
    "dblclick .song-title": "playSong",
    "click .song-play":     "playSong",
    "click .song-add":      "addSong",
    "click .song-thumbsup": "thumbsUp",
    "click .song-remove":   "removeSong",
    //menu
    "click .song-download":  "downloadSong",
    "click .song-custom-playlist": "addToCustomPlaylist"
  },

  initialize:function () {

  },

  render:function () {

    if(typeof this.model.attributes.position == 'undefined'){
      console.log('no position');
      return this;
    }

    // add if thumbs up
    if( app.playlists.isThumbsUp('song', this.model.attributes.songid) ) {
      this.$el.addClass('thumbs-up')
    }
    // render
    this.$el.html(this.template(this.model.attributes));

    // set playlist menu
    $('.song-actions', this.$el).append( app.helpers.makeDropdown( app.helpers.dropdownTemplates('song' ) ));

    return this;
  },

  /**
   * Inserts into next pos on playlist then plays
   * @param event
   */
  playSong: function(event){
   var song = this.model.attributes,
     key = app.helpers.getSongKey(song);

    app.playlists.changePlaylistView('xbmc');
    app.AudioController.insertAndPlaySong(key.type, key.id, function(){
      app.notification(song.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });
  },

  addSong: function(){
    var song = this.model.attributes,
      key = app.helpers.getSongKey(song);
    app.AudioController.playlistAdd(key.type, key.id, function(result){
      app.notification(song.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });
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
    var songid = this.model.attributes.songid,
      listid = this.model.attributes.list.id,
      $target = $(e.target);

    app.playlists.deleteCustomPlaylistSong(listid, songid);
    $target.closest('li').slideUp(function(){ $(this).remove(); });
  },

  downloadSong: function(e){
    var file = this.model.attributes.file;

    e.preventDefault();
    app.AudioController.downloadFile(file, function(url){
      window.location = url;
    })
  },

  addToCustomPlaylist: function(e){
    e.preventDefault();

    var song = this.model.attributes,
      key = app.helpers.getSongKey(song),
    // if file, gets the whole object
      id = (key.type == 'file' ? song : song.songid);
    console.log(id);
    app.playlists.saveCustomPlayListsDialog(key.type, [id]);
  }

});