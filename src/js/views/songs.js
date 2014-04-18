app.SongListView = Backbone.View.extend({

  tagName:'ul',

  className:'song-list',

  initialize:function () {

  },

  render:function () {
    this.$el.empty();
    _.each(this.model.models, function (song) {
      this.$el.append(new app.SongView({model:song}).render().$el);
    }, this);
    return this;
  }

});

app.SongView = Backbone.View.extend({

  tagName:"li",
  className:'song-row',


  events: {
    "dblclick .song-title": "playSong",
    "click .song-play": "playSong",
    "click .song-add": "addSong",
    "click .song-thumbsup": "thumbsUp",
    "click .song-menu": "menu"
  },


  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },


  render:function () {
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
  menu: function(e){
    // set song menu
    app.helpers.menuDialog( app.helpers.menuTemplates('song',this.model.attributes));
  },


  /**
   * Inserts into next pos on playlist then plays
   * @param event
   */
  playSong: function(event){
    var song = this.model.attributes;
    if(app.audioStreaming.getPlayer() == 'local'){
      // Replace and play Local
      app.playlists.playlistAddItems('local', 'append', 'song', song.songid, function(){
        // play the last song in the list (what we just added)
        app.audioStreaming.playPosition((app.audioStreaming.playList.items.models.length - 1));
      });
    } else {
      app.playlists.changePlaylistView('xbmc');
      app.AudioController.insertAndPlay('songid', song.songid, function(){
        app.notification(song.label + ' added to the playlist');
        app.AudioController.playlistRender();
      });
    }

  },


  /**
   * Append song
   */
  addSong: function(){
    var song = this.model.attributes;
    if(app.audioStreaming.getPlayer() == 'local'){
      // Replace and play Local
      app.playlists.playlistAddItems('local', 'append', 'song', song.songid);
    } else {
      // Append to XBMC playlist
      app.AudioController.playlistAdd( 'songid', song.songid, function(result){
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
  }

});