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

    $(window).bind('playlistUpdate', this.playlistBinds());
    return this;
  },

  playlistBinds:function(self){

    //sortable
    //@TODO: move this code elsewhere? Is it really view logic? or maybe work out how to do custom event
    $sortable = $( "ul.playlist");
    console.log($sortable);
    $sortable.sortable({
      placeholder: "playlist-item-placeholder",
      handle: ".playlist-play",
      items: "> li",
      axis: "y",
      update: function( event, ui ) {
        //the item just moved
        var $thisItem = $(ui.item[0]).find('div.playlist-item'), changed = {};
        //loop over each playlist item to see what (if any has changed)
        $sortable.find('div.playlist-item').each(function(i,d){
          $d = $(d);
          //if this row store the position
          if($d.data('id') === $thisItem.data('id')){
            changed = {from: $thisItem.data('id'), to: i};
          }
        });
        //if an item has changed position, swap its position in xbmc
        if(changed.from != undefined && changed.from !== changed.to){
          app.AudioController.playlistSwap(changed.from, changed.to, function(res){
            app.AudioController.playlistRefresh();
          })
        }
      }
    }).disableSelection();

  }
});

app.PlaylistItemView = Backbone.View.extend({

  tagName:"li",

  className: 'playlist-item',

  events: {
    "dblclick .playlist-play": "playPosition",
    "click .removebtn": "removePosition",
    "click .playbtn": "playPosition"
  },

  initialize:function () {

  },

  render:function () {
    this.$el.html(this.template(this.model));
    return this;
  },

  playPosition:function(event){
    app.AudioController.playPlaylistPosition(this.model.pos, function(data){
      app.AudioController.playlistRefresh();
    });
  },

  removePosition:function(event){
    var self = this;
    app.AudioController.removePlaylistPosition(this.model.pos, function(data){
      app.AudioController.playlistRefresh();
    });
  }



});

