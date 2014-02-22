
/**
 * Movie
 * @type {extend|*}
 */
app.Movie = Backbone.Model.extend({

  initialize:function () {},
  defaults: {movieid: 1, thumbnail: '', fanart: '', year: '', url: '#movies'},

  sync: function(method, model, options) {
    if (method === "read") {

      app.xbmcController.command('VideoLibrary.GetMovieDetails',[parseInt(this.id), app.movieFields], function(data){
        console.log(data);
        // @todo fix logic for thumbs up
        data.result.moviedetails.thumbsup = false;
        options.success(data.result.moviedetails);
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
