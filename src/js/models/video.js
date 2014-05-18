
/**
 * Movie
 * @type {extend|*}
 */
app.Movie = Backbone.Model.extend({

  initialize:function () {},
  defaults: {movieid: 1, thumbnail: '', fanart: '', year: '', url: '#movies', 'thumbsup': false, 'libraryId': 1, runtime: 0},

  sync: function(method, model, options) {
    if (method === "read") {

      app.xbmcController.command('VideoLibrary.GetMovieDetails',[parseInt(this.id), app.fields.get('movie', true)], function(data){
        var m = data.result.moviedetails;
        // get thumbsup
        m.thumbsup = app.playlists.getThumbsUp('movie', m.movieid);
        options.success(m);
      });


    }
  }

});


/**
 * TV Show
 * @type {extend|*}
 */
app.TVShow = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'tvshowid': '', 'label': '', 'watchedepisodes': '', 'genre': '', 'year': '', 'cast': [], 'rating': 0, url: '#tv', 'episodeid': '', runtime: 0},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);

      // add fanart to full load
      var fields = app.fields.get('tvshow', true);
      if($.inArray('fanart', fields) == -1){
        fields.push('fanart');
      }
      if($.inArray('watchedepisodes', fields) == -1){
        fields.push('watchedepisodes');
      }

      // Fetch Show
      app.xbmcController.command('VideoLibrary.GetTVShowDetails',[parseInt(this.id), fields], function(data){
        var m = data.result.tvshowdetails;
        // get thumbsup
        m.thumbsup = app.playlists.getThumbsUp('tvshow', m.tvshowid);
        m.url = '#tvshow/' + m.tvshowid;

        // Add seasons
        app.cached.tvseasonCollection = new app.TvseasonCollection();
        app.cached.tvseasonCollection.fetch({"tvshowid" : m.tvshowid, "success": function(collection){
          m.seasons = collection;
          options.success(m);
        }});

      });

    }
  }

});



/**
 * TV Episode
 * @type {extend|*}
 */
app.TVEpisode = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'album': '', 'mpaa': '', 'thumbnail': '', 'artist': '', 'genre': [], 'artistid': '', 'songs': [], 'albumsitems': [], url: '#tv', 'imdbnumber': ''},

  sync: function(method, model, options) {
    if (method === "read") {

      var fields = app.fields.get('tvepisode', true);

      // Get the episode
      app.xbmcController.command('VideoLibrary.GetEpisodeDetails',[parseInt(this.id), fields], function(data){
        var m = data.result.episodedetails;
        // get thumbsup
        m.thumbsup = app.playlists.getThumbsUp('episode', m.episodeid);
        options.success(m);
      });

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
