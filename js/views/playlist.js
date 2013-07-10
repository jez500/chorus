/*
 * Sidebar artist list
 */



app.PlaylistView = Backbone.View.extend({

  tagName:'ul',

  className:'playlist',

  initialize:function () {

  },

  render:function () {
    this.$el.empty();
    var pos = 0; //position
    _.each(this.model.models, function (item) {
      item.pos = pos; pos++;
      this.$el.append(new app.PlaylistItemView({model:item}).render().el);
    }, this);

    return this;
  }
});

app.PlaylistItemView = Backbone.View.extend({

  tagName:"li",

  className: 'playlist-item',

  events: {
    "dblclick .playlist-play": "playPosition"
  },

  initialize:function () {

  },

  render:function () {
    this.$el.html(this.template(this.model));
    return this;
  },

  playPosition:function(event){
    app.AudioController.playPlaylistPosition(this.model.pos, function(data){
      console.log('playing',event);
    });
  }

});

