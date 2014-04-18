/**
 * Music views
 */


/**
 * Channel List
 */
app.PvrChannelsView = Backbone.View.extend({

  tagName:"ul",

  className: "channel-list",

  initialize:function () {


  },


  render:function () {
    this.$el.empty();
    _.each(this.model.models, function (channel) {
      this.$el.append(new app.PvrChannelListItem({model:channel}).render().$el);
    }, this);
    return this;
  }

});



/**
 * Channel item
 */
app.PvrChannelListItem = Backbone.View.extend({

  tagName:"li",
  className:'row-item',


  events: {
    "dblclick .name": "play",
    "click .channel-play": "play",
    "click .channel-thumbsup": "thumbsUp",
    "click .channel-menu": "menu"
  },


  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },


  render:function () {
    // add if thumbs up
    if( app.playlists.isThumbsUp('channel', this.model.attributes.channelid) ) {
      this.$el.addClass('thumbs-up');
    }
    // render
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  play: function(e){
    app.pvr.playChannel(this.model.attributes.channelid, function(res){

    });
  },

  thumbsUp: function(e){

  },

  menu: function(e){

  }


});

