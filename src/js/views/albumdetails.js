app.AlbumView = Backbone.View.extend({

  initialize:function () {
  },

  render: function () {
    var self = this;

    this.$el.html(this.template(this.model.attributes));

    self.albumList = new app.AlbumCollection();
    self.albumList.fetch({"id": this.model.attributes.albumid, "type": "album", "success": function(data){
      self.albumsView = new app.AlbumsList({model: data, className: 'album-list'});
      var alb = data.models[0].attributes,
          sidebarSelector = '#sidebar-first .album-row-' + alb.albumid;

      // populate main content
      var $al = $('#album-list').html(self.albumsView.render().el);

      // set title
      app.ui.setTitle('<a href="#artist/' + alb.artistid + '">' + alb.artist + '</a>' + alb.album);

      // add actions to title
      //var $actions = $al.find('.album-actions-wrapper').clone(true, true);
      //$('#title').append($actions);

      //remove any existing active
      $('#sidebar-first .album-small-row').removeClass('active');

      //check if album exists in current sidebar list and only render if not
      if($(sidebarSelector).length === 0){

        //add the sidebar view
        self.albumArtistView = new app.AlbumArtistView({"model":data.models[0]});
        app.helpers.setFirstSidebarContent(self.albumArtistView.render().el);

      } else {
        //set active row
        $(sidebarSelector).addClass('active');
      }

    }});

    return this;
  }

});



app.AlbumArtistView = Backbone.View.extend({

  tagName:"div",
  className:'album-artist-item',

  initialize:function () {

    this.artistModel = new app.Artist({"id": this.model.attributes.artistid, "fields": app.fields.get('artist')});
    this.artistAlbums = {};
  },

  render:function () {
    var self = this;

    this.artistModel.fetch({success:function(artist){

      //base template
      self.$el.html(self.template(artist.attributes));

      //get the artists albums
      self.albumList = new app.AlbumCollection();
      self.albumList.fetch({"id": artist.attributes.artistid, "type": "artist", "success": function(data){

        self.albumsView = new app.SmallAlbumsList({model: data});
        $('#sidebar-first .other-albums').html(self.albumsView.render().el);

        //set active row
        $('.album-row-' + self.model.attributes.albumid).addClass('active');

      }});

    }});

    return this;
  }

});
