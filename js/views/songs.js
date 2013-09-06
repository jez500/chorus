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
    "click .song-add": "addSong"
  },

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

   playSong: function(event){
     console.log(event);
     var song = this.model.attributes;
     app.AudioController.playSongById(song.songid, 'albumid', song.albumid, true);
   },


    addSong: function(){
      var song = this.model.attributes;
      app.AudioController.playlistAdd( 'songid', song.songid, function(result){
        app.notification(song.label + ' added to the playlist');
        app.AudioController.playlistRefresh();
      });
    }

});