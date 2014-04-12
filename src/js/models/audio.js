
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
  defaults: {'label':'', 'thumbnail':'', 'albumid':0, artistid: [0], 'type': 'song', 'playlistId': 0, 'url': '#', 'subLink': ''},

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
  defaults: {'label':'', 'thumbnail':'', 'albumid':0, artistid: [0], songid: 'file', file: '', list: 'xbmc', playlistId: 0, 'type': 'file'}

});


/**
 * Custom playlist
 * @type {extend|*}
 */
app.PlaylistCustomListItem= Backbone.Model.extend({

  initialize:function () {},
  defaults: {'name':'', 'items':[], 'id': 0, 'type': 'file'}

});


/**
 * Custom playlist song
 * @type {extend|*}
 */
app.PlaylistCustomListItemSong = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'label':'', 'thumbnail':'', 'albumid':0, artistid: [0]}

});


/**
 * AudioGenre
 *
 * @type {extend|*}
 */
app.Tag = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'title':'', 'thumbnail':'', type: 'music', genreid: 0, id: 0, url: '#'},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);
    }
  }

});
