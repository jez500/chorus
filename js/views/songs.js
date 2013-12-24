app.SongListView = Backbone.View.extend({

  tagName:'ul',

  className:'song-list',

  initialize:function () {

  },

  render:function () {
    this.$el.empty();
    _.each(this.model, function (song) {
      this.$el.append(new app.SongView({model:song}).render().el);
    }, this);
    return this;
  }

});

app.SongView = Backbone.View.extend({

  tagName:"li",

  events: {
    "dblclick .song-title": "playSong",
    "click .song-play": "playSong",
    "click .song-add": "addSong",
    "click .song-thumbsup": "thumbsUp"
  },

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    // add if thumbs up
    if( app.playlists.isThumbsUp(this.model.attributes.songid) ) {
      this.$el.addClass('thumbs-up')
    }
    // render
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  /**
   * Inserts into next pos on playlist then plays
   * @param event
   */
  playSong: function(event){
    var song = this.model.attributes;
    app.playlists.changePlaylistView('xbmc');
    app.AudioController.insertAndPlaySong('songid', song.songid, function(){
      app.notification(song.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });
  },

  addSong: function(){
    var song = this.model.attributes;
    app.AudioController.playlistAdd( 'songid', song.songid, function(result){
      app.notification(song.label + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });
  },

  /**
   * Toggle thumbs up status
   */
  thumbsUp: function(e){
    var songid = this.model.attributes.songid,
      op = (app.playlists.isThumbsUp(songid) ? 'remove' : 'add'),
      $el = $(e.target).closest('li');
    app.playlists.setThumbsUp(op, 'song', songid);
    $el.toggleClass('thumbs-up');
  }

});