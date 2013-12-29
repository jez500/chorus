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
    $sortable = $( "ul.playlist");
    $sortable.sortable({
      placeholder: "playlist-item-placeholder",
      handle: ".playlist-play",
      items: "> li",
      axis: "y",
      update: function( event, ui ) {
        app.playlists.sortableChangePlaylistPosition(event, ui);
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
    "click .playbtn": "playPosition",
    "click .repeating": "cycleRepeat"
  },

  initialize:function () {

  },

  render:function () {
    // file fallback
    this.model.id = (typeof this.model.id != 'undefined' ? this.model.id : 'file');
    this.model.albumid = (typeof this.model.albumid != 'undefined' ? this.model.albumid : 'file');
    // render
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
  },

  cycleRepeat:function(event){
    $('#footer').find('.player-repeat').trigger('click');
  }




});





/**
 * Custom playlists
 */
app.PlaylistCustomListsView = Backbone.View.extend({

  tagName:'ul',
  className:'custom-lists',

  events: {
    "dblclick li": "replacePlaylist",
    "click .name": "toggleDetail"
  },

  initialize:function () {

  },

  render:function () {

    this.$el.empty();
    var pos = 0;

    _.each(this.model.models, function (item) {
      item.pos = pos; pos++;
      var el = new app.PlaylistCustomListItemView({model:item}).render();

      this.$el.append(el.el);
    }, this);

    // Add thumbs up to the top
    this.$el.prepend('<li class="list-item thumbsup-link"><a href="#thumbsup" class="name">Thumbs Up</a></li>');

    return this;
  },

  toggleDetail: function(e){
    var $this = $(e.target),
      $parent = $this.closest('li');

    if($parent.hasClass('open')){
      $parent.removeClass('open');
    } else {
      $parent.parent().find('li').removeClass('open');
      $parent.addClass('open');
    }

  }

});



app.PlaylistCustomListItemView = Backbone.View.extend({

  tagName:"li",

  className: 'list-item',

  events: {
    "dblclick .name": "replacePlaylist"
  },


  initialize:function () {

  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }

});




