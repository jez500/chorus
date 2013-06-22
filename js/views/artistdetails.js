app.ArtistView = Backbone.View.extend({

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

    //select appropriate sidebar item
    $('.artist-row').removeClass('active');
    var $actRow =  $('.artist-row-' + this.model.id).addClass('active');
    $('.artist-list').scrollTo($actRow);

    //get the albums
   // var artistid =  parseInt(this.model.attributes.artistid);
  //  var albums = new app.AlbumsView({"data": {"filters" : [{"artistid":artistid}]}, "fields":app.artistFields});

  //  $('#album-list').html(albums.render().el);

    return this;
  }
});

app.ArtistSummaryView = Backbone.View.extend({

  events:{
    "click p.description":"expandDetail"
  },

  initialize:function () {
    this.model.on("change", this.render, this);
  //  this.songList = new app.SongFilteredXbmcCollection({"filter": {"artistid":this.model.attributes.artistid}});
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    var self = this;
    console.log(this.model.attributes.artistid);

    self.albumList = new app.AlbumCollection();
    self.albumList.fetch({"id": this.model.attributes.artistid, "type": "artist", "success": function(data){
      self.albumsView = new app.AlbumsList({model: data, className: 'album-list'});
      $('#album-list').html(self.albumsView.render().el);
      console.log(data);
    }});



/*
    this.songList.fetch({"success": function(data){
      console.log(data);
      var albums = app.store.parseArtistSongsToAlbums(data.models);
      console.log(albums);
    }});
*/


/*    app.store.libraryCall(function(){

      self.albumList = new app.AlbumCollection();
      self.albumList.fetch({"id": self.model.attributes.artistid, "success": function(data){
        self.albumsView = new app.AlbumsList({model: data, className: 'album-list'});
        $('#album-list').html(self.albumsView.render().el);
        console.log(data);
      }});
    }, 'songsReady');*/


    return this;
  },

  expandDetail: function(){
    $('.artist-detail').toggleClass('full');
  }

});


