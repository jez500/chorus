/**
 * ThumbsUp view
 *
 * @type {*|void|Object|extend|extend|extend}
 */


app.ThumbsupView = Backbone.View.extend({

  initialize: function () {

    // create a new mixed view
    var model = {
      key: 'thumbsup',
      callbacks: {}
    };
    this.mixedView = new app.MixedView({model: model});

  },

  songsLoaded: false,

  /**
   * Render result
   */
  render:function () {

    var self = this,
      anyThumbs = app.playlists.isAnyThumbsUp();

    //set searching
    app.shellView.selectMenuItem('thumbsup', 'no-sidebar');

    // set title
    app.ui.setTitle('<i class="fa fa-thumbs-up"></i> Thumbs Up');

    if(!anyThumbs){ // No thumbs
      // no thumbs
      var noResults = '<div class="help-page"></h3><h3 class="entity-heading">' +
        '<i class="fa fa-thumbs-up entity-icon" title="Don\'t click this Thumb! thumbs are on albums, songs, movies, etc."></i> Click a thumb to start</h3></div>';
      this.$el.html( noResults );

    } else { // some thumbs exists

      // Set mixed view callbacks
      var callbacks = {
        song: function(){
          self.getItems('song', 'CustomPlaylistSongListView');
        },
        artist: function(){
          self.getItems('artist', 'AristsRandView');
        },
        album: function(){
          self.getItems('album', 'SmallAlbumsList');
        },
        tvshow: function(){
          self.getItems('tvshow', 'TvshowListView');
        },
        movie: function(){
          self.getItems('movie', 'MovieListView');
        }
      };

      // update view
      self.mixedView.setCallbacks(callbacks);

      // render page
      this.$el.html( this.mixedView.render().$el );
    }

    return this;

  },



  getItems: function(type, viewName){

    // Song
    var self = this,
      thumbs = new app.ThumbsUpCollection();

    thumbs.fetch({"name": type, "success": function(collection){

      _.defer(function(){

      if(collection.models.length === 0){
        self.mixedView.noResult(type);
      } else {

        // Render mixed mode with results
        self.mixedView.renderPane(type, collection, viewName);

      }

    });



    }});

  }

});