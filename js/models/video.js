
/**
 * Movie
 * @type {extend|*}
 */
app.Movie = Backbone.Model.extend({

  initialize:function () {},
  defaults: {movieid: 1, thumbnail: '', fanart: '', year: '', url: '#movies', 'thumbsup': false, 'libraryId': 1},

  sync: function(method, model, options) {
    if (method === "read") {

      app.xbmcController.command('VideoLibrary.GetMovieDetails',[parseInt(this.id), app.movieFields], function(data){
        var m = data.result.moviedetails;
        // get thumbsup
        m.thumbsup = app.playlists.getThumbsUp('movie', m.movieid);
        options.success(m);
      })


    }
  }

});


/**
 * TV Show
 * @type {extend|*}
 */
app.TVShow = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'album': '', 'albumid': '', 'thumbnail': '', 'artist': '', 'artistid': '', 'songs': [], 'albumsitems': [], url: '#tv'},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);
    }
  }

});



/**
 * TV Episode
 * @type {extend|*}
 */
app.TVEpisode = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'album': '', 'albumid': '', 'thumbnail': '', 'artist': '', 'artistid': '', 'songs': [], 'albumsitems': [], url: '#tv'},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);
    }
  }

});


/**
 * Genric Video / Music Video
 * @type {extend|*}
 */
app.Video = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'album': '', 'albumid': '', 'thumbnail': '', 'artist': '', 'artistid': '', 'songs': [], 'albumsitems': [], url: '#video'},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);
    }
  }

});
