/*
 * Our models for audio
 */

// Artist
app.Artist = Backbone.Model.extend({

  initialize:function () {

  },

  defaults: {artistid: 1, thumbnail: '', fanart: '', artist: '', label: '', description: '', born: '', died: ''},

  sync: function(method, model, options) {
    if (method === "read") {

      app.store.getArtist(parseInt(this.id), function (data) { console.log(data);
   //     app.store.artistAlbums(data.attributes.artistid, function(albums){
   //       data.attributes.albums = albums;
          options.success(data.attributes);
  //      });
      });
    }
  }

});


// Album
app.Album = Backbone.Model.extend({

  initialize:function () {

  },

  defaults: {'album': '', 'albumid': '', 'thumbnail': '', 'artist': '', 'artistid': '', 'songs': [], 'albumsitems': []},

  sync: function(method, model, options) {
    if (method === "read") {
/*      app.store.findBy(parseInt(this.id), function (data) {
        options.success(data);
      });*/
    }
  }

});


// Song
app.Song = Backbone.Model.extend({

  initialize:function () {

  },

  //defaults: app.songFields,

  sync: function(method, model, options) {
    if (method === "read") {
/*      app.store.findBy(parseInt(this.id), function (data) {
        options.success(data);
      });*/
    }
  }

});
