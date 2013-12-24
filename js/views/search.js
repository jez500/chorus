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
        notfoundartist = '<div class="noresult-box">No Artists found</div>';

      $content.empty().html('<div id="search-albums"></div><div id="search-songs"></div>');
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
        loading = '<div class="loading-box">Loading Albums</div>',
        notfoundalb = '<div class="noresult-box"><h3>Albums</h3>No Albums found with "'+key+'" in the title</div>';

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
        } else {
          //no results
          $albums.html(notfoundalb);
        }

      }});


      //get songs
      var $songs = $('#search-songs'),
        indexing = false,
        indexingCopy = '<div class="noresult-box">Indexing Songs, this can take a long time! Maybe browse a bit then come back later</div>',
        notIndexedCopy  =
          '<div class="noresult-box"><h3>Songs...</h3>' +
            '<p class="text-copy">To search song titles we need to load the entire song collection into the browser,' +
            'this takes a very long and some non-cached stuff might not work while while indexing' +
            ' so no controlls work while indexing. <br /><br />' +
            '<a id="index-songs-btn" href="#index-songs" class="btn btn-large btn-inverse">Ok, Index the songs</a></p></div>';

      $songs.html(notIndexedCopy);

      if(app.store.songsIndexed !== true){

        // check if indexing
        indexing = (typeof self.indexing != 'undefined' && self.indexing === true);
        // provide correct copy
        $songs.html((indexing ? indexingCopy : notIndexedCopy));
        if(!indexing){

          // attach lookup to click
          $('#index-songs-btn').click(function(e){
            self.indexing = true;
            $songs.html(indexingCopy);
            // update and search
            app.store.indexSongs(function(data){
              key = $('#search').val();
              self.searchSongs(key);
              self.indexing = false;
            });
          });

        }

      } else {
        // already indexed
        self.searchSongs(key);
      }

    }

  },


  /**
   * Init searching songs, could be dealing with lots o data
   * @param key
   */
  searchSongs: function(key){

    var $songs = $('#search-songs');

    // bind to songs ready
    $songs.html('<p class="loading-box">Loading Songs</p>');
    app.store.libraryCall(function(){
      app.cached.SearchsongList = new app.SongCollection();
      app.cached.SearchsongList.fetch({success: function(data){
        $songs.empty();
        // filter based on string match
        var songs = data.models.filter(function (element) {
          var label = element.attributes.label;
          return label.toLowerCase().indexOf(key.toLowerCase()) > -1;
        });
        // update model with new collection
        data.models = songs;
        if(songs.length > 0){
          $songs.append('<h3 class="section-title">Songs</h3>');
        }
        // add to content
        app.cached.SearchsongList = new app.SongListView({model: data.models, className: 'song-search-list song-list'});
        $songs.append(app.cached.SearchsongList.render().el);
      }});

    },'songsReady');

  },


});