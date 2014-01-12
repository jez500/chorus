/*
 * Large Album view
 */

app.AlbumsList = Backbone.View.extend({

  tagName:'div',

  className:'artist-list-view',

  initialize:function () {
    var self = this;
    this.model.on("reset", this.render, this);
    this.model.on("add", function (album) {
      self.$el.append(new app.AlbumItemView({model:album}).render().el);
    });
  },

  render:function () {
    this.$el.empty();
    _.each(this.model.models, function (album) {
      this.$el.append(new app.AlbumItemView({model:album}).render().el);
    }, this);
    return this;
  }
});

app.AlbumItemView = Backbone.View.extend({

  tagName:"div",

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    // thumbs up
    if(app.playlists.isThumbsUp('album', this.model.attributes.albumid)){
      $('.album-actions', this.$el).addClass('thumbs-up');
    }

    // songs
    this.songList = new app.SongListView({"model":this.model.attributes.songs});
    $(".tracks", this.$el).html(this.songList.render().el);
    return this;
  },


  events: {
    "click .album-play": "playAlbum",
    "click .album-add": "addAlbum",
    "click .album-thumbsup": "thumbsUp"
  },

  //play an album from start, replacing current playlist
  playAlbum: function(e){
    e.stopPropagation();
    // clear playlist. add artist, play first song
    var album = this.model.attributes;
    app.AudioController.playlistClearAdd( 'albumid', album.albumid, function(result){
      app.AudioController.playPlaylistPosition(0, function(){
        app.AudioController.playlistRefresh();
      });
    });

  },

  addAlbum: function(e){
    e.stopPropagation();
    // clear playlist. add artist, play first song
    var album = this.model.attributes;
    app.AudioController.playlistAdd( 'albumid', album.albumid, function(result){
      app.notification(album.album + ' added to the playlist');
      app.AudioController.playlistRefresh();
    });

  },


  thumbsUp: function(e){
    e.stopPropagation();
    var album = this.model.attributes,
      albumid = this.model.attributes.albumid,
      op = (app.playlists.isThumbsUp('album', albumid) ? 'remove' : 'add'),
      $el = $(e.target).closest('.album-actions');
    app.playlists.setThumbsUp(op, 'album', albumid);
    $el.toggleClass('thumbs-up');

  }



});

/*
 * Small Album view (no songs)
 */
app.SmallAlbumsList = Backbone.View.extend({

  tagName:'ul',

  className:'album-list-small',

  initialize:function () {

/*    this.model.on("add", function (album) {
      this.$el.append(new app.SmallAlbumItemView({model:album}).render().el);
    });*/
  },

  render:function () {

    this.$el.empty();
    _.each(this.model.models, function (album) {
      this.$el.append(new app.SmallAlbumItemView({model:album}).render().el);
    }, this);
    return this;

  }
});

app.SmallAlbumItemView = Backbone.View.extend({

  tagName:"li",
  className:'album-small-item',

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }

});


