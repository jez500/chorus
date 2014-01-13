/**
 * Search view
 *
 * @type {*|void|Object|extend|extend|extend}
 */


app.searchView = Backbone.View.extend({

  initialize: function () {

  },

  /**
   * Render based on key in the model
   * this is all a bit messy and could be refined
   *
   */
  render:function () {

    var key = this.model.key,
      self = this;

    if(key.length > 1){
      //set url
      document.location.hash = '#search/' + key;

      //set searching
      app.shellView.selectMenuItem('search', 'sidebar');

      //empty content as we append
      var $content = $('#content'),
        $title = $('#title'),
        notfoundartist = '<div class="noresult-box">No Artists found</div>',
        $el = $('<div class="search-results-content"></div>');

      $el.append('<div id="search-albums"></div>')
        .append('<div id="search-songs"></div>')
        .append('<div id="search-addons"></div>');

      $content.empty().html($el);
      $title.html('<a href="#artists">Artists </a>Albums');

      // get artists list (sidebar)
      app.cached.SearchArtistsList = new app.ArtistCollection();
      app.cached.SearchArtistsList.fetch({success: function(data){
        // filter based on string match
        var artists = data.models.filter(function (element) {
          var label = element.attributes.artist;
          return label.toLowerCase().indexOf(key.toLowerCase()) > -1;
        });
        // update model with new collection
        data.models = artists;
        //if result
        if(data.models.length > 0){
          // add the sidebar view
          app.cached.artistsListSearch = new app.AristsListView({model: data, className: 'artist-search-list'});
          app.helpers.setFirstSidebarContent(app.cached.artistsListSearch.render().el);
        } else {
          app.helpers.setFirstSidebarContent(notfoundartist);
        }

      }});


      //get albums
      var $albums = $('#search-albums'),
        loading = '<div class="noresult-box">' + self.getLogo('album') + '<span>Loading Albums</span></div>',
        notfoundalb = '<div class="noresult-box empty">' + self.getLogo('album') + '<span>No Albums found with "'+key+'" in the title<span></div>';

      $albums.html(loading);

      app.cached.SearchAlbumList = new app.AlbumsCollection();
      app.cached.SearchAlbumList.fetch({success: function(data){
        $albums.empty();
        // filter based on string match
        var albums = data.models.filter(function (element) {
          var label = element.attributes.label;
          return label.toLowerCase().indexOf(key.toLowerCase()) > -1;
        });
        // update model with new collection
        data.models = albums;
        //if result
        if(data.models.length > 0){
          // add to content
          app.cached.SearchAlbumListSmall = new app.SmallAlbumsList({model: data, className: 'album-generic-list'});
          $albums.append(app.cached.SearchAlbumListSmall.render().el);
          $albums.prepend('<h3 class="search-heading">' + self.getLogo('album') + 'Album search for:<span>' + key + '</span></h3>');
        } else {
          //no results
          $albums.html(notfoundalb);
        }

      }});


      // get addons
      var $addons = $('#search-addons');
      $addons.empty();
      app.addOns.ready(function(){
        $addons = app.addOns.invokeAll('searchAddons', $addons, key);
      });


      // searrch songs
      self.searchSongs(key);

    }

  },

  // Get a generic logo/icon
  getLogo: function(type){
    return '<img src="theme/images/icons/icon-' + type + '.png" />'
  },


  /**
   * Init searching songs, could be dealing with lots o data
   * @param key
   */
  searchSongs: function(key){

    var $songs = $('#search-songs'),
      self = this;


    // bind to songs ready
    $songs.html('<div class="addon-box">' + self.getLogo('song') + '<span>Loading Songs</span></div>');

    app.store.indexSongs(function(){

      app.cached.SearchsongList = new app.SongCollection();
      app.cached.SearchsongList.fetch({success: function(data){

        console.log('songs loaded', data);
        var songsIds = [];

        $songs.empty();
        // filter based on string match
        var songs = data.models.filter(function (element) {
          var label = element.attributes.label;
          return label.toLowerCase().indexOf(key.toLowerCase()) > -1;
        });

        // get array of ids for multi-load
        _.each(songs, function(song){
          songsIds.push(song.attributes.songid);
        });

        // redefine this
        //var $songs = $('#search-songs');

        // Get a list of fully loaded models from id
        if(songsIds.length > 0){
          app.cached.SearchsongListFiltered = new app.CustomSongCollection();
          app.cached.SearchsongListFiltered.fetch({items: songsIds, success: function(data){

            // heading
            $songs.append('<h3 class="search-heading">' + self.getLogo('song') + 'Songs search for:<span>' + key + '</span></h3>');

            // add to content
            app.cached.SearchsongList = new app.SongListView({model: data.models, className: 'song-search-list song-list'});
            $songs.append(app.cached.SearchsongList.render().el);

          }});
        } else {
          // no res
          $songs.html('<div class="noresult-box empty">' + self.getLogo('song') + '<span>No Songs found</span></div>')
        }


      }});

    });


  }


});