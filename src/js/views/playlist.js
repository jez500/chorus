/*
 * Sidebar artist list
 */



app.PlaylistView = Backbone.View.extend({

  tagName:'div',

  className:'playlist-wrapper',

  events: {
    "click .player-audio": "viewAudio",
    "click .player-video": "viewVideo"
  },

  initialize:function () {

  },

  render:function () {
    // html
    this.$el.empty();
    var pos = 0, //position
      $tabs = $('<ul class="active-player-tabs"></ul>'),
      $items = $('<ul class="playlist"></ul>'),
      plId = (typeof this.model.playlistId != 'undefined' ? this.model.playlistId : 0);

    _.each(this.model.models, function (item) {
      item.pos = pos; pos++;
      item.playlistId = plId;
      $items.append(new app.PlaylistItemView({model:item}).render().el);
    }, this);
    this.$el.append($items);

    // reload thumbsup
    app.playlists.getThumbsUp();

    // make and prepend tabs
    $tabs.append('<li class="player-audio' + (plId === 0 ? ' active' : '') + '">Audio</li>');
    $tabs.append('<li class="player-video' + (plId == 1 ? ' active' : '') + '">Video</li>');

    this.$el.prepend($tabs);
    this.$el.addClass('plid-' + plId);

    //sortable
    $sortable = $( "ul.playlist", this.$el);
    $sortable.sortable({
      placeholder: "playlist-item-placeholder",
      handle: ".playlist-play",
      items: "> li",
      axis: "y",
      update: function( event, ui ) {
        app.playlists.sortableChangePlaylistPosition(event, ui);
      }
    }).disableSelection();

    return this;
  },

  viewAudio:function(e){
    app.AudioController.playlistRender();
  },

  viewVideo:function(e){
    app.VideoController.playlistRender();
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
    var model = this.model,
      playing = app.playerState.xbmc.getNowPlaying();

    model.id = (typeof model.id != 'undefined' ? model.id : 'file');
    model.albumid = (typeof model.albumid != 'undefined' ? model.albumid : 'file');
    model.subLink = this.buildSubLink(model);
    model.url = (model.albumid != 'file' ? '#album/' + model.albumid : app.helpers.buildUrl(model.type, model.id, model));

    // render
    this.$el.html(this.template(model));

    // playing row
    if((playing.status == 'playing' || playing.status == 'paused') &&
      (playing.player.playlistid == model.playlistId && playing.player.position == model.pos)){
      // this is the playing row, add class
      $('.playlist-item', this.$el).addClass('playing-row');
    }

    // if file, add its path
    if(this.model.id == 'file'){
      $('.song', this.$el).data('file', model.file);
    }
    $('.song', this.$el).data('playlistId', model.playlistId);

    // add if thumbs up
    if( this.model.id != 'file' && app.playlists.isThumbsUp('song', this.model.id) ) {
      this.$el.addClass('thumbs-up');
    }
    return this;
  },


  /**
   * Contextual Menu
   * @param e
   */
  menu: function(e){
    if(this.model.playlistId == 1){
      app.helpers.menuDialog( app.helpers.menuTemplates('movie', this.model) );
    } else {
      app.helpers.menuDialog( app.helpers.menuTemplates('song', this.model) );
    }

  },


  playPosition:function(event){
    if(this.model.list == 'local'){
      // LOCAL BROWSER PLAY
      app.audioStreaming.playPosition(this.model.pos);
    } else {
      // XBMC PLAYER
      // Toggle between music / video playlists
      var playlistController = (this.model.playlistId == 1 ? app.VideoController : app.AudioController);
      // play and refresh
      playlistController.playPlaylistPosition(this.model.pos, function(data){
        playlistController.playlistRender();
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
      // Toggle between music / video playlists
      var playlistController = (this.model.playlistId == 1 ? app.VideoController : app.AudioController);
      var self = this;
      playlistController.removePlaylistPosition(this.model.pos, function(data){
        playlistController.playlistRender();
      });
    }
  },


  cycleRepeat:function(event){
    $('#footer').find('.player-repeat').trigger('click');
  },


  thumbsUp: function(e){
    e.stopPropagation();
    var id = this.model.id,
      type = (this.model.playlistId == 1 ? 'video' : 'song'),
      op = (app.playlists.isThumbsUp(type, id) ? 'remove' : 'add'),
      $el = $(e.target).closest('li');
    app.playlists.setThumbsUp(op, type, id);
    $el.toggleClass('thumbs-up');
  },


  /**
   * A helper to parse
   * @param model
   */
  buildSubLink: function(model){

    var url, text, title;

    if(model.type == 'song'){

      // build artist names
      model.albumArtistString = (typeof model.albumartist != 'undefined' && typeof model.albumartist[0] != 'undefined' ? model.albumartist[0] : '');
      model.artistString = (typeof model.artist != 'undefined' && typeof model.artist[0] != 'undefined' ? model.artist[0] : '');

      // build song vars
      title = 'Track: ' + this.model.track + ' Duration: ' + app.helpers.formatTime(app.helpers.secToTime(this.model.duration));
      url = '#search/' + (model.albumArtistString !== '' ? model.albumArtistString : model.artistString);
      text = (model.artistString !== '' ? model.artistString : model.albumArtistString);

      // if no artist or album artist, return null
      if(model.artistString === '' && model.albumArtistString === ''){
        return '';
      }

    } else if (model.type == 'movie') {
      text = model.year;
      url = '#movies/year/' + model.year;
      title = 'More movies from ' + text;

    } else if (model.type == 'episode') {
      text = 'S' + model.season + ' E' + model.episode + ' - ' + model.showtitle;
      url = '#tvshow/' + model.tvshowid + '/' + model.season;
      title = 'More episodes from season' + model.season;
    } else {
      return '';
    }

    // return link
    return '<a title="'+ title +'" href="' + url + '">' + text + '</a>';

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
    var pos = 0,
      self = this;

//    if(this.model.models.length === 0){
//      return this;
//    }

    _.each(this.model.models, function (item) {
      item.pos = pos; pos++;
      var el = new app.PlaylistCustomListItemView({model:item}).render();

      this.$el.append(el.el);
    }, this);

    // Add heading
    this.$el.prepend('<li class="list-heading"><i class="fa fa-file"></i> Lists</li>');
    // menu for heading
    var $menu = $('<span class="menu lists-menu"><i class="fa fa-ellipsis-v"></i></span>');
    // bind click
    $menu.on('click', function(e){
      self.showDialog();
    });
    // add to heading
    $('.list-heading', this.$el).append($menu);

    return this;
  },


  /**
   * Open the dialog
   */
  showDialog: function(){

    // dialog structure
    var structure = {
      title: 'Custom Lists',
      key: 'customList',
      omitwrapper: true,
      items: [
        {url: '#', class: 'lists-new', title: 'Add a new list', callback: function(){
          // Create a list
          app.playlists.saveCustomPlayListsDialog('song', [], true);
        }},
        {url: '#', class: 'lists-remove-all', title: 'Delete all lists', callback: function(){
          // delete all lists prompt
          app.helpers.confirm('Are you sure? This will remove ALL browser playlists and cannot be undone!', function(){
            app.storageController.setStorage(app.playlists.storageKeyLists, []);
            app.notification('All playlists removed, refresh your browser');
          });
        }},
        {url: '#', class: 'lists-import', title: 'Import a list', callback: function(){
          // import list
          app.ui.featureNotBuiltDialog();
        }}
      ]
    };

    // do the dialog
    app.helpers.menuDialog(structure);

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
    if(app.helpers.arg(0) == 'playlist' && app.helpers.arg(1) == this.model.attributes.id){
      this.$el.find('a').addClass('active');
    }
    return this;
  }

});




