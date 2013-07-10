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
    "dblclick .song-title": "playSong"
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
     app.AudioController.playSongById(song.songid, song.albumid, true);
   }

});