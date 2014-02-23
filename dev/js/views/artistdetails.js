app.ArtistView = Backbone.View.extend({

  events:{
    "click .artist-play":      "playArtist",
    "click .artist-add":       "addArtist",
    "click .artist-thumbsup":  "thumbsUp",
    "click .artist-fanart":    "toggleFanart",
    "click .artist-menu":       "menu"
  },

  initialize:function () {
    if(!this.artistsList){
      this.artistsList = new app.ArtistCollection();
      this.artistsListView = new app.AristsListView({model: this.artistsList, className: 'artist-list'});
    }

  },

  render: function () {

    //main detail
    this.$el.html(this.template(this.model.attributes));
    $('#artist-meta', this.el).html(new app.ArtistSummaryView({model:this.model}).render().el);


/*    app.artistsView = new app.ArtistsView();
    app.artistsView.renderSidebar();*/

    //select appropriate sidebar item
    $('.artist-row').removeClass('active');
    var $actRow =  $('.artist-row-' + this.model.id);
    // hack to check if loaded
    if($actRow.length > 0){
      $actRow.addClass('active');
      $('#sidebar-first .sidebar-content').scrollTo($actRow);
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

  playArtist: function(){

    // clear playlist. add artist, play first song
    var artist = this.model.attributes;
    if(app.audioStreaming.getPlayer() == 'local'){
      // Replace and play Local
      app.playlists.playlistAddItems('local', 'replace', 'artist', artist.artistid);
    } else {
      // Replace and play XBMC
      app.AudioController.playlistClearAdd( 'artistid', artist.artistid, function(result){
        app.AudioController.playPlaylistPosition(0, function(){
          app.AudioController.playlistRender();
        });
      });
    }
  },


  addArtist: function(){
    // clear playlist. add artist, play first song
    var artist = this.model.attributes;
    if(app.audioStreaming.getPlayer() == 'local'){
      // Replace and play Local
      app.playlists.playlistAddItems('local', 'append', 'artist', artist.artistid);
    } else {
      // Replace and play XBMC
      app.AudioController.playlistAdd( 'artistid', artist.artistid, function(result){
        app.notification(artist.artist + ' added to the playlist');
        app.AudioController.playlistRender();
      });
    }
  },


  thumbsUp: function(e){

    var artist = this.model.attributes,
      artistid = this.model.attributes.artistid,
      op = (app.playlists.isThumbsUp('artist', artistid) ? 'remove' : 'add'),
      $el = $(e.target).closest('.artist-actions');
    app.playlists.setThumbsUp(op, 'artist', artistid);
    $el.toggleClass('thumbs-up');

  },

  toggleFanart: function(e){
    $(e.target).parent().toggleClass('full-size');
  }


});

app.ArtistSummaryView = Backbone.View.extend({

  events:{
    "click p.description":"expandDetail"
  },

  initialize:function () {
    this.model.on("change", this.render, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    var self = this;

    self.albumList = new app.AlbumCollection();
    self.albumList.fetch({"id": this.model.attributes.artistid, "type": "artist", "success": function(data){
      self.albumsView = new app.AlbumsList({model: data, className: 'album-list'});
      $('#album-list').html(self.albumsView.render().el);

      // get artist stats and add to sidebar active
      var meta = app.helpers.parseArtistSummary(data);
      $('.artist-list .active .artist-meta').html(meta);


      //scroll fanart down
      if(self.model.attributes.fanart !== ''){
        //$('body').scrollTo(176);
      }

    }});


    return this;
  },

  expandDetail: function(){
    $('.artist-detail').toggleClass('full');
  }

});


