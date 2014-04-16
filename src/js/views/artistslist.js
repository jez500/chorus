/*
 * Sidebar artist list
 */
app.AristsListView = Backbone.View.extend({

  tagName:'ul',

  className:'nav nav-list',

  initialize:function () {
    var self = this;
    this.model.on("reset", this.render, this);
    this.model.on("add", function (artist) {
      self.$el.append(new app.ArtistListItemView({model:artist}).render().el);
    });
  },

  render:function () {
    this.$el.empty();

    _.each(this.model.models, function (artist) {
      this.$el.append(new app.ArtistListItemView({model:artist}).render().el);
    }, this);
    return this;
  }
});

app.ArtistListItemView = Backbone.View.extend({

  tagName:"li",

  className: 'artist',

  events:{
    "click .play-artist": "playArtist"
  },

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {

    var model = this.model.attributes;
    model.subtext = ( typeof model.genre != 'undefined' ? model.genre.join(', ') : '' );
    this.$el.html(this.template(model));

    return this;
  },

  playArtist: function(e){
    e.preventDefault();
    // clear playlist. add artist, play first song
    var artist = this.model.attributes;

    if(app.audioStreaming.getPlayer() == 'local'){
      // local player add
      app.playlists.playlistAddItems('local', 'replace', 'artist', artist.artistid);
    } else {
      app.AudioController.playlistClearAdd( 'artistid', artist.artistid, function(result){
        app.AudioController.playPlaylistPosition(0, function(){
          app.AudioController.playlistRender();
        });
      });
    }

  }

});



/*
 * Random Size Block view (ordering is still left to the model)
 */
app.AristsRandView = Backbone.View.extend({

  tagName:'ul',

  className:'random-block',

  initialize:function () {

    var self = this;
    this.model.on("reset", this.render, this);
    this.model.on("add", function (artist) {
      self.$el.append(new app.ArtistLargeItemView({model:artist}).render().el);
    });
  },

  render:function () {
    this.$el.empty();

    _.each(this.model.models, function (artist) {
      this.$el.append(new app.ArtistLargeItemView({model:artist}).render().el);
    }, this);


    return this;
  }
});


app.ArtistLargeItemView = Backbone.View.extend({

  tagName:"li",
  className:'artist-item-large card card-large',


  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },


  events: {
    "click .artist-play": "playArtist",
    "click .artist-add": "addArtist",
    "click .artist-thumbsup": "thumbsUp",
    "click .actions-wrapper": "viewArtist",
    "click .artist-menu": "menu"
  },


  render:function () {
    var model = this.model.attributes;

    // enrich the model
    model.title = ( typeof model.label != "undefined" ? model.label : model.artist );
    model.url = '#album/' + model.artistid;
    model.img = (model.fanart !== '' ? model.fanart : model.thumbnail);

    this.$el.html(this.template(model));

    // classes
    if(!app.image.isDefaultImage(model.img)){
      this.$el.addClass('has-thumb');
    }
    if(app.playlists.isThumbsUp('artist', model.artistid)){
      this.$el.addClass('thumbs-up');
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
    var menu = app.helpers.menuTemplates('artist', this.model.attributes);
    // add dialog
    app.helpers.menuDialog(menu);
  },

  /**
   * Replace and play
   * @param e
   */
  playArtist: function(e){
    e.stopPropagation();
    e.preventDefault();
    var artist = this.model.attributes;

    if(app.audioStreaming.getPlayer() == 'local'){
      app.playlists.playlistAddItems('local', 'replace', 'artist', artist.artistid);
    } else {
      // clear playlist. add artist, play first song
      app.AudioController.playlistClearAdd( 'artistid', artist.artistid, function(result){
        app.AudioController.playPlaylistPosition(0, function(){
          app.notification('Now playing ' + artist.artist);
          app.AudioController.playlistRender();
        });
      });
    }
  },

  /**
   * Append
   * @param e
   */
  addArtist: function(e){
    e.stopPropagation();
    e.preventDefault();
    // clear playlist. add artist, play first song
    var artist = this.model.attributes;
    if(app.audioStreaming.getPlayer() == 'local'){
      app.playlists.playlistAddItems('local', 'append', 'artist', artist.artistid);
    } else {
      app.AudioController.playlistAdd( 'artistid', artist.artistid, function(result){
        app.notification(artist.artist + ' added to the playlist');
        app.AudioController.playlistRender();
      });
    }
  },


  thumbsUp: function(e){
    e.stopPropagation();
    e.preventDefault();
    var artist = this.model.attributes,
      artistid = artist.artistid,
      op = (app.playlists.isThumbsUp('artist', artistid) ? 'remove' : 'add'),
      $el = $(e.target).closest('.card');
    app.playlists.setThumbsUp(op, 'artist', artistid);
    $el.toggleClass('thumbs-up');

  },


  viewArtist: function(e){
    e.stopPropagation();
    window.location = '#artist/' + this.model.attributes.artistid;
  }

});


