/**
 * Album List View
 *
 * List of full album views
 * used in: artist album listings
 *
 * @type Backbone View
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


/**
 * Full Album View
 * Used as a wrapper to piece all the album sub views together
 *
 * @type Backbone View
 */
app.AlbumItemView = Backbone.View.extend({

  tagName:"div",

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));

    // meta / thumbnail
    $('.album-info', this.$el).html(new app.AlbumItemSmallView({model: this.model}).render().$el);

    // songs
    $(".tracks", this.$el).html(new app.SongListView({"model":{models: this.model.attributes.songs}}).render().el);

    return this;
  }

});


/**
 * List of Album Item Small Views
 * used in: album landing, search results
 *
 * @type Backbone View
 */
app.SmallAlbumsList = Backbone.View.extend({

  tagName:'ul',

  className:'album-list-small',

  render:function () {
    this.$el.empty();
    _.each(this.model.models, function (album) {
      this.$el.append(new app.AlbumItemSmallView({model:album}).render().el);
    }, this);
    return this;
  }

});


/**
 * Album Item Small
 *
 * This is the small view of an album, it includes artwork, title, artist and actions
 * used in: album landing, search results, called into full album template
 *
 * @type Backbone View
 */
app.AlbumItemSmallView = Backbone.View.extend({

  tagName:"li",
  className:'album-small-item card',

  events: {
    "click .album-play": "playAlbum",
    "click .album-add": "addAlbum",
    "click .album-thumbsup": "thumbsUp",
    "click .actions-wrapper": "viewAlbum",
    "click .album-menu": "menu"
  },

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    var model = this.model.attributes;

    // enrich the model
    model.title = ( typeof model.label != "undefined" ? model.label : model.album );
    model.url = '#album/' + model.albumid;
    model.img = app.image.url(model.thumbnail);
    model.recenttext = (typeof model.recent != 'undefined' ? 'Recently ' + model.recent : '');
    model.artisturl = (model.artistid !== '' ? '#artist/' + model.artistid : '#artists');

    // apply template
    this.$el.html(this.template(model));

    // classes
    if(!app.image.isDefaultImage(model.img)){
      this.$el.addClass('has-thumb');
    }
    if(app.playlists.isThumbsUp('album', model.albumid)){
      this.$el.addClass('thumbs-up');
    }
    if(typeof model.recent != 'undefined'){
      this.$el.addClass('recent');
    }

    return this;
  },


  /**
   * Contextual options
   * @param e
   */
  menu: function(e){
    e.stopPropagation();
    e.preventDefault();
    // build the menu template
    var menu = app.helpers.menuTemplates('album', this.model.attributes);
    // add dialog
    app.helpers.menuDialog(menu);
  },


  /**
   * play an album from start, replacing current playlist
   */
  playAlbum: function(e){
    e.stopPropagation();
    e.preventDefault();
    var album = this.model.attributes;

    if(app.audioStreaming.getPlayer() == 'local'){
      // local player add
      app.playlists.playlistAddItems('local', 'replace', 'album', album.albumid);
    } else {
      // clear xbmc playlist. add artist, play first song
      app.AudioController.playlistClearAdd( 'albumid', album.albumid, function(result){
        app.AudioController.playPlaylistPosition(0, function(){
          app.AudioController.playlistRender();
        });
      });
    }


  },

  /**
   * append to playlist
   */
  addAlbum: function(e){
    e.stopPropagation();
    e.preventDefault();
    var album = this.model.attributes;

    if(app.audioStreaming.getPlayer() == 'local'){
      // Append to xbmc playlist
      app.playlists.playlistAddItems('local', 'append', 'album', album.albumid);
    } else {
       // Append to xbmc playlist
      app.AudioController.playlistAdd( 'albumid', album.albumid, function(result){
        app.notification(album.album + ' added to the playlist');
        app.AudioController.playlistRender();
      });
    }


  },

  /**
   * toggle thumbs up
   */
  thumbsUp: function(e){
    e.stopPropagation();
    e.preventDefault();
    var album = this.model.attributes,
      albumid = album.albumid,
      op = (app.playlists.isThumbsUp('album', albumid) ? 'remove' : 'add'),
      $el = $(e.target).closest('.card');
    app.playlists.setThumbsUp(op, 'album', albumid);
    $el.toggleClass('thumbs-up');

  },

  /**
   * go to album page
   */
  viewAlbum: function(e){
    e.stopPropagation();
    e.preventDefault();
    var albumid = this.model.attributes.albumid;
    window.location = '#album/' + albumid;
  }

});
