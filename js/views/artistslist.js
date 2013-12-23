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
    this.$el.html(this.template(this.model.attributes));

 /*   $('.album-small-item img').resizecrop({
      width:40,
      height:60,
      vertical:"top"
    });*/

    return this;
  },

  playArtist: function(e){
    e.preventDefault();
    // clear playlist. add artist, play first song
    var artist = this.model.attributes;
    app.AudioController.playlistClearAdd( 'artistid', artist.artistid, function(result){
      app.AudioController.playPlaylistPosition(0, function(){
        app.AudioController.playlistRefresh();
      });
    });

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

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }

});


