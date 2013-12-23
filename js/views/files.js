app.FilesView = Backbone.View.extend({

  tagName:'ul',

  className:'files-list',

  initialize:function () {

  },


  render:function () {

    this.$el.empty();
    _.each(this.model.models, function (song) {
      this.$el.append(new app.FileView({model:song}).render().el);
    }, this);

    // sortable
    this.filesBinds();

    return this;
  },


  filesBinds:function(){

/*    //sortable
    $sortableCustom = this.$el;

    $sortableCustom.sortable({
      placeholder: "playlist-item-placeholder",
      handle: ".song-title",
      items: "> li",
      axis: "y",

      update: function( event, ui ) {
        var list = [],
          listId = app.helpers.arg(0) == 'thumbsup' ? 'thumbsup' : app.helpers.arg(1),
          $container = $('ul.playlist-song-list');

        $container.find('div.playlist-item').each(function(i,d){
          list.push($(d).data('songid'));
        });

        // Update the playlist order in storage
        app.playlists.replaceCustomPlayList(listId, list);

      }
    }).disableSelection();*/

  }
});

app.FileView = Backbone.View.extend({

  tagName:"li",

  events: {
    //"dblclick .song-title": "playSong",
    //"click .song-play": "playSong",
    //"click .song-add": "addSong",
    //"click .song-thumbsup": "thumbsUp"
  },

  initialize:function () {

  },

  render:function () {
    // render
    this.$el.html(this.template(this.model.attributes));
    return this;
  }


//  /**
//   * Inserts into next pos on playlist then plays
//   * @param event
//   */
//  playSong: function(event){
//    var song = this.model.attributes;
//    app.playlists.changePlaylistView('xbmc');
//    app.AudioController.insertAndPlaySong(song.songid, function(){
//      app.notification(song.label + ' added to the playlist');
//      app.AudioController.playlistRefresh();
//    });
//  },
//
//  addSong: function(){
//    var song = this.model.attributes;
//    app.AudioController.playlistAdd( 'songid', song.songid, function(result){
//      app.notification(song.label + ' added to the playlist');
//      app.AudioController.playlistRefresh();
//    });
//  },
//
//  /**
//   * Toggle thumbs up status
//   */
//  thumbsUp: function(e){
//    var songid = this.model.attributes.songid,
//      op = (app.playlists.isThumbsUp('song', songid) ? 'remove' : 'add'),
//      $el = $(e.target).closest('li');
//    app.playlists.setThumbsUp(op, 'song', songid);
//    $el.toggleClass('thumbs-up');
//  }

});