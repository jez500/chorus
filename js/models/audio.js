
/**
 * Artist
 * @type {extend|*}
 */
app.Artist = Backbone.Model.extend({

  initialize:function () {},
  defaults: {artistid: 1, thumbnail: '', fanart: '', artist: '', label: '', description: '', born: '', died: ''},

  sync: function(method, model, options) {
    if (method === "read") {
      app.store.getArtist(parseInt(this.id), function (data) {
          data.attributes.thumbsup = app.playlists.isThumbsUp('artist', data.attributes.artistid);
          options.success(data.attributes);
      });
    }
  }

});


/**
 * Album
 * @type {extend|*}
 */
app.Album = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'album': '', 'albumid': '', 'thumbnail': '', 'artist': '', 'artistid': '', 'songs': [], 'albumsitems': []},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);
    }
  }

});


/**
 * Song
 * @type {extend|*}
 */
app.Song = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'label':'', 'thumbnail':'', 'albumid':0, artistid: [0]},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);
    }
  }

});


/**
 * playlist song
 * @type {extend|*}
 */
app.PlaylistItem= Backbone.Model.extend({

  initialize:function () {},
  defaults: {'label':'', 'thumbnail':'', 'albumid':0, artistid: [0], songid: 'file', file: '', list: 'xbmc', playlistId: 0, url: '#artists'}

});


/**
 * Custom playlist
 * @type {extend|*}
 */
app.PlaylistCustomListItem= Backbone.Model.extend({

  initialize:function () {},
  defaults: {'name':'', 'items':[], 'id': 0}

});


/**
 * Custom playlist song
 * @type {extend|*}
 */
app.PlaylistCustomListItemSong = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'label':'', 'thumbnail':'', 'albumid':0, artistid: [0]}

});