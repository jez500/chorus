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
    "dblclick li": "replacePlaylist"
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
    this.$el.prepend('<li class="list-item"><a href="#thumbsup" class="name">Thumbs Up</a></li>');

    return this;
  }

});



app.PlaylistCustomListItemView = Backbone.View.extend({

  tagName:"li",

  className: 'list-item',

  events: {
    "dblclick .name": "replacePlaylist",
    "click .name": "toggleDetail",
    "click .playlist-append": "appendPlaylist",
    "click .playlist-replace": "replacePlaylist",
    "click .del": "deleteCustomListPlaylist"
  },


  initialize:function () {

  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },


  /**
   * Replace with a custom playlist
   * @param e
   */
  replacePlaylist:function (e){

    if(!confirm("Replace the current xbmc playlist with this list?")){
      return;
    }

    var $this = $(e.target).closest('.custom-playlist-item'),
      listId = $this.data('id'),
      self = this;

    // clear list
    app.AudioController.playlistClear(function(res){

      // Add the list
      self.addCustomListToPlaylist(listId, function(pldata){

        // play first song
        app.AudioController.playPlaylistPosition(0, function(data){
          //update playlist
          app.AudioController.playlistRefresh();
          //notify
          app.notification('Playlist updated and playing');
        });

      });
    });

  },


  /**
   * Append a custom playlist
   * @param e
   */
  appendPlaylist:function (e){

    var $this = $(e.target).closest('.custom-playlist-item'),
      listId = $this.data('id');

    // add list
    this.addCustomListToPlaylist(listId);
    app.notification('Playlist updated');
  },


  /**
   * Adds a custom playlist to the xbmc playlist
   * @param listName
   */
  addCustomListToPlaylist:function(listId, callback) {
    var list = app.playlists.getCustomPlaylist(listId);
    app.AudioController.playlistAddMultiple('songid', list.items, function(result){
      // refresh playlist and switch to what got added
      app.AudioController.playlistRefresh();
      app.playlists.changePlaylistView('xbmc');
      if(callback){
        callback(result);
      }
    });
  },


  /**
   * Adds a custom playlist to xbmc list
   * @param listName
   */
  deleteCustomListPlaylist:function(e) {
    var listId = $(e.target).closest('.custom-playlist-item').data('id');
    app.playlists.deleteCustomPlaylist(listId);
    // clear the deleted playlist from content
    var $c = $('#content');
    if($c.find('.playlist-song-list').length > 0){
      $c.html('<div class="loading-box">Playlist removed</div>');
    }

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




