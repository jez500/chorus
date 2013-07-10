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
    $('#sidebar-first .sidebar-content').scrollTo($actRow);



    app.artistsView = new app.ArtistsView();
    app.artistsView.renderSidebar();

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

      // get artist stats and add to sidebar active
      var meta = app.helpers.parseArtistSummary(data);
      $('.artist-list .active .artist-meta').html(meta);

    }});

    return this;
  },

  expandDetail: function(){
    $('.artist-detail').toggleClass('full');
  }

});


