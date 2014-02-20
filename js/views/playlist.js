/*
 * Sidebar artist list
 */



app.PlaylistView = Backbone.View.extend({

  tagName:'ul',

  className:'playlist',

  initialize:function () {

  },

  render:function () {
    // html
    this.$el.empty();
    var pos = 0; //position
    _.each(this.model.models, function (item) {
      item.pos = pos; pos++;
      this.$el.append(new app.PlaylistItemView({model:item}).render().el);
    }, this);

    // reload thumbsup
    app.playlists.getThumbsUp();

    // bind others
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
    "click .repeating": "cycleRepeat",
    "click .playlist-song-thumbsup": "thumbsUp",
    "click .playlist-song-menu": "menu"
  },

  initialize:function () {

  },

  render:function () {
    // file fallback
    this.model.id = (typeof this.model.id != 'undefined' ? this.model.id : 'file');
    this.model.albumid = (typeof this.model.albumid != 'undefined' ? this.model.albumid : 'file');
    this.model.artistLink = this.buildArtistLink(this.model);

    // render
    this.$el.html(this.template(this.model));

    // if file, add its path
    if(this.model.id == 'file'){
      $('.song', this.$el).data('file', this.model.file);
    }

    // add if thumbs up
    if( this.model.id != 'file' && app.playlists.isThumbsUp('song', this.model.id) ) {
      this.$el.addClass('thumbs-up')
    }
    return this;
  },


  /**
   * Contextual Menu
   * @param e
   */
  menu: function(e){
    app.helpers.menuDialog( app.helpers.menuTemplates('song', this.model) );
  },


  playPosition:function(event){
    if(this.model.list == 'local'){
      // LOCAL BROWSER PLAY
      app.audioStreaming.playPosition(this.model.pos);
    } else {
      // XBMC PLAYER
      app.AudioController.playPlaylistPosition(this.model.pos, function(data){
        app.AudioController.playlistRefresh();
      });
    }
  },


  removePosition:function(event){
    if(this.model.list == 'local'){
      // LOCAL BROWSER REMOVE
      app.audioStreaming.deleteBrowserPlaylistSong(this.model.pos);
      app.audioStreaming.renderPlaylistItems();
    } else {
      // XBMC PLAYER
      var self = this;
      app.AudioController.removePlaylistPosition(this.model.pos, function(data){
        app.AudioController.playlistRefresh();
      });
    }
  },


  cycleRepeat:function(event){
    $('#footer').find('.player-repeat').trigger('click');
  },


  thumbsUp: function(e){
    e.stopPropagation();
    var songid = this.model.id,
      op = (app.playlists.isThumbsUp('song', songid) ? 'remove' : 'add'),
      $el = $(e.target).closest('li');
    app.playlists.setThumbsUp(op, 'song', songid);
    $el.toggleClass('thumbs-up');
  },


  /**
   * A helper to parse
   * @param model
   */
  buildArtistLink: function(model){
    // build artist names
    model.albumArtistString = (typeof model.albumartist[0] != 'undefined' ? model.albumartist[0] : '');
    model.artistString = (typeof model.artist[0] != 'undefined' ? model.artist[0] : '');
    // add title
    var title = 'Track: ' + this.model.track + ' Duration: ' + app.helpers.secToTime(this.model.duration);
    // if no artist or album artist, return null
    if(model.artistString == '' && model.albumArtistString == ''){
      return '';
    }
    // return link
    return '<a title="'+ title +'" href="#search/' + (model.albumArtistString != '' ? model.albumArtistString : model.artistString) + '">' +
      (model.artistString != '' ? model.artistString : model.albumArtistString) + '</a>';
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




