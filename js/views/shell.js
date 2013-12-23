app.ShellView = Backbone.View.extend({

  initialize: function () {

    /**
     * Maybe a more "backbone" way of doing this,
     * but basically want to bind to all page changes and trigger
     * this.pageChange()
     */
    var $window = $(window), $body = $('body'), self = this;

    // init first page change to setup classes, etc.
    self.pageChange(location.hash, '#init');

    $window.bind('hashchange', function() {
      var newHash = location.hash,
          lastHash = app.vars.lastHash,
          back = (typeof lastHash == 'undefined' ? '#' : lastHash);

      // if page change
      if(newHash != back){
        self.pageChange(newHash, back);
      }

      // set last hash
      app.vars.lastHash = newHash;

    });

    /**
     * Fades the header bg when at the top
      */
    $window.bind('scroll', function(e) {
      if( $window.scrollTop() > 50 ){
        $body.addClass('fixed-header');
      } else {
        $body.removeClass('fixed-header');
      }
    });

  },

  render: function () {
    this.$el.html(this.template());
    var self = this;

    //set playlist
    app.AudioController.playlistRefresh(function(result){
      //console.log('playlist',result);
    });

    //init the progress bar
    this.$progressSlider = $( "#progress-bar", this.el );

    this.$progressSlider.slider({
      range: "min",
      value: 0,
      min: 0,
      max: 100,
      stop: function( event, ui ) {
        app.AudioController.seek(ui.value);

      }
    });

    //init the volume bar
    this.$volumeSlider = $( "#volume", this.el );
    this.$volumeSlider.slider({
      range: "min",
      value: 0,
      min: 0,
      max: 100,
      stop: function( event, ui ) {
        app.AudioController.setVolume(ui.value);
      }
    });

    // Init player state cycle
    setInterval(app.AudioController.updatePlayerState, 5000);

    //custom playlists
    app.playlists.addCustomPlayLists(function(view){
      var $sb = $('.alt-sidebar-items', self.$el);
      $sb.html(view.render().el);
    });

    return this;
  },

  events: {
    "keyup #search": "search",
    "click #search-this": "search",
    "keypress #search": "onkeypress",
    "click #logo": "home",
    "click .player-prev": "playerPrev",
    "click .player-next": "playerNext",
    "click .player-play": "playerPlay",
    "click .player-mute": "playerMute",
    "click .player-repeat": "playerRepeat",
    "click .player-random": "playerRandom",
    "click .playlist-primary-tab": "primaryTabClick",
    "click .save-playlist": "savePlayList",
    "click .clear-playlist": "clearPlaylist"
  },


  /**
   * Generic page change bind
   * @param event
   */
  pageChange: function(newHash, back){
    var key = app.helpers.arg(0);
    // Remove all classes starting with 'section'
    $("body").removeClass (function (index, css) {
      return (css.match (/\bsection\S+/g) || []).join(' ');
    })
      // Add the current page
      .addClass('section-'+ key);
  },

  /**
   * Playlist tab click
   * @param event
   * @param o
   */
  primaryTabClick:function(event){
    $thisTab = $(event.target);
    // toggle based on tab class
    var view = ($thisTab.hasClass('local-playlist-tab') ? 'local' : 'xbmc');
    app.playlists.changePlaylistView(view);
  },

  /**
   * Search artists, albums & songs
   * requires all data to be loaded into memory
   * @param event
   */
  search: function (event) {
    var key = $('#search').val(),
        self = this;

    var res = {ablums: [], artists: [], songs: []};

    if(key.length > 1){
      //set url
      document.location.hash = '#search/' + key;

      //set searching
      this.selectMenuItem('search', 'sidebar');

      //empty content as we append
      var $content = $('#content'),
          $title = $('#title'),
          notfoundartist = '<div class="noresult-box">No Artists found</div>';

      $content.empty().html('<div id="search-albums"></div><div id="search-songs"></div>');
      $title.html('<a href="#artists">Artists </a>Albums');

      // get artists list (sidebar)
      this.artistsList = new app.ArtistCollection();
      this.artistsList.fetch({success: function(data){
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
          this.artistsListSearch = new app.AristsListView({model: data, className: 'artist-search-list'});
          app.helpers.setFirstSidebarContent(this.artistsListSearch.render().el);
        } else {
          app.helpers.setFirstSidebarContent(notfoundartist);
        }

      }});


      //get albums
      var $albums = $('#search-albums'),
          loading = '<div class="loading-box">Loading Albums</div>',
          notfoundalb = '<div class="noresult-box"><h3>Albums</h3>No Albums found with "'+key+'" in the title</div>';

      $albums.html(loading);

      this.albumList = new app.AlbumsCollection();
      this.albumList.fetch({success: function(data){
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
          this.albumList = new app.SmallAlbumsList({model: data, className: 'album-generic-list'});
          $albums.append(this.albumList.render().el);
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




  onkeypress: function (event) {
    if (event.keyCode === 13) { // enter key pressed
      event.preventDefault();
    }
  },


  /**
   * This acts as layout definer wrapper
   * @param menuItem
   * @param sidebar
   */
  selectMenuItem: function(menuItem, sidebar) {

    var $body = $('body'),
        state = (typeof sidebar != 'undefined' && sidebar == 'sidebar' ? 'open' : 'close');

    //sidebar - reset and add
    app.helpers.toggleSidebar(state);

    // layout changes for different pages
    if(menuItem == 'home'){

      //specific to home
      $body.addClass('home');

    } else {

      // ensure backstretch is gone
      if($('.backstretch').length > 0){
        $.backstretch("destroy", false);
      }
      $body.removeClass('home');

      // specifics for non home pages
      switch (menuItem) {
        case 'playlist':
          // all this to open the sidebar playlist item
          $('.local-playlist-tab').click();
          $('ul.custom-lists .custom-playlist-item').each(function(i,d){
            var $d = $(d), $parent = $d.parent();
            if($d.data('id') == app.helpers.arg(1)){
              $parent.addClass('open');
            } else {
              $parent.removeClass('open')
            }
          });
          break;
      }
    }



    if (menuItem) {
      // Toggle the actual menu class based on menuItem
      var $nav = $('.mainnav', this.el),
        $active = $nav.find('li.nav-' + menuItem);
      $nav.find('li').removeClass('active');
      $active.addClass('active');
    }


  },


  //player commands
  playerPrev:function(){
    app.AudioController.sendPlayerCommand('Player.GoTo', 'previous');
  },
  playerNext:function(){
    app.AudioController.sendPlayerCommand('Player.GoTo', 'next');
  },
  playerPlay:function(){
    app.AudioController.sendPlayerCommand('Player.PlayPause', 'toggle');
  },
  playerRepeat:function(){
    app.AudioController.sendPlayerCommand('Player.SetRepeat', 'cycle');
  },
  playerRandom:function(){
    app.AudioController.sendPlayerCommand('Player.SetShuffle', 'toggle');
  },



  //mute
  playerMute:function(){
    //get current vol
    var cur = this.$volumeSlider.slider( "value"), $body = $('body');
    if(cur > 0){
      //store current vol then set to 0
      this.lastVol = cur;
      app.AudioController.setVolume(0);
      this.$volumeSlider.slider( "value",0 );
      $body.addClass('muted');
    } else {
      //if last vol
      if(app.helpers.exists(this.lastVol) && this.lastVol > 0){
        var lastvol = this.lastVol; //set back to last value
      } else {
        var lastvol = 50; //default last vol to 50%
      }
      //set lastvol
      app.AudioController.setVolume(lastvol);
      this.$volumeSlider.slider( "value",lastvol );
      $body.removeClass('muted');
    }
  },


  // update the playing state
  updateState:function(data){
    var $nowPlaying = $('#now-playing'),
        $body = $('body'),
        $songs = $('.song'), //songs currently rendered
        lastPlaying = app.helpers.varGet('lastPlaying', ''),
        playingItemChanged = (lastPlaying != data.item.file),
        status = (app.helpers.exists(data.player.speed) && data.player.speed == 0 ? 'paused' : data.status); //add paused as a status

    //add paused to available statuses
    data.status = status;

    // set current as last playing var
    app.helpers.varSet('lastPlaying', data.item.file);

    //body classes
    $body
      // remove all old classes and list the options in use
      .removeClass('playing').removeClass('paused').removeClass('notPlaying')
      .removeClass('random-on').removeClass('random-off')
      .removeClass('repeat-off').removeClass('repeat-all').removeClass('repeat-one')
      // add active classes
      .addClass(status)
      .addClass( 'random-' + (data.player.shuffled === true ? 'on' : 'off') )
      .addClass( 'repeat-' + data.player.repeat );

    //song row playing
    $songs.removeClass('playing-row');

    if(status == 'playing' || status == 'paused'){
      //Something is playing or paused

      // Items we only want to update if the playing item has changed
      if(playingItemChanged){

        //set thumb
        $nowPlaying.find('#playing-thumb')
          .attr('src',app.parseImage(data.item.thumbnail))
          .attr('title', data.item.album)
          .parent().attr('href', '#album/' + data.item.albumid);

        // Backstretch
        if(location.hash == '#' || location.hash == ''){
          // if homepage backstretch exists and changed, update
          var $bs = $('.backstretch img'),
            origImg = $bs.attr('src'),
            newImg = app.parseImage(data.item.fanart, 'fanart');
          // if image is different
          if($bs.length > 0 && origImg != newImg){
            $.backstretch(newImg);
          }
        }

      }


      // playing row we should have a loaded item
      $songs.each(function(i,d){
        var $d = $(d);
        // correct song id
        if($d.attr('data-songid') == data.item.id){
          // playlist should match playing pos
          if($d.hasClass('playlist-item')){
            // match pos
            if($d.data('id') == data.player.position){
              $d.addClass('playing-row');
            }
          } else {
            //default
            $d.addClass('playing-row');
          }
        }
      });

      //set title
      $('.playing-song-title').html(data.item.label); //now playing
      document.title = (status == 'playing' ? '▶ ' : '') + data.item.label + ' | Chorus.'; //doc

      //set playlist meta and playing row
      var meta = app.helpers.parseArtistsArray(data.item),
        $playlistActive = $('.playlist .playing-row');
      $('.playing-song-meta').html(meta);
      $playlistActive.find('.playlist-meta').html(meta);
      $playlistActive.find('.thumb').attr('src', app.parseImage(data.item.thumbnail));

      //set progress
      this.$progressSlider.slider( "value",data.player.percentage );

      //time
      var $time = $('#time');
      var cur = (parseInt(data.player.percentage) / 100) * parseInt(data.item.duration);
      $time.find('.time-cur').html(app.helpers.secToTime(Math.floor(cur)));
      $time.find('.time-total').html(app.helpers.secToTime(data.item.duration));

    } else {
      //not playing anything

      //doc title
      document.title = 'Chorus.';
      //title and artist
      $('.playing-song-title').html('Nothing Playing');
      $('.playing-song-meta').html('');
      //playlist row
      $('ul.playlist div.playlist-item.playing-row').removeClass('playing-row');
      //progress
      this.$progressSlider.slider( "value",0);
      //set thumb
      $nowPlaying.find('#playing-thumb')
        .attr('src',app.parseImage(''))
        .attr('title', '')
        .parent().attr('href', '#albums');
      //time
      var $time = $('#time');
      $time.find('.time-cur').html('0');
      $time.find('.time-total').html('0:00');

    }

    //Rebind every run

    //set volume
    this.$volumeSlider.slider( "value",data.volume.volume );
    //muted class
    if(data.volume.volume == 0){
      $('body').addClass('muted');
    } else {
      $('body').removeClass('muted');
    }

    // set repeat title text
    var $t = $('.player-repeat'), t = $t.attr('title'),
      n = (data.player.repeat == 'off' ? 'Repeat is off' : 'Currently repeating ' + data.player.repeat);
    if(t != n){ $t.attr('title', n); }

    // set random title text
    var $t = $('.player-random'), t = $t.attr('title'),
      n = 'Random is ' + (data.player.shuffled === true ? 'On' : 'Off');
    if(t != n){ $t.attr('title', n); }

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
      this.songList = new app.SongCollection();
      this.songList.fetch({success: function(data){
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
        this.songList = new app.SongListView({model: data.models, className: 'song-search-list song-list'});
        $songs.append(this.songList.render().el);
      }});

    },'songsReady');

  },


  /**
   * Save a playlist
   * @param e
   */
  savePlayList: function(e){
    e.preventDefault();
    // Save playlist
    app.playlists.saveCustomPlayLists();
    app.playlists.changePlaylistView('local');
  },


  //Clear a playlist
  clearPlaylist: function(e){
    e.preventDefault();
    // Clear playlist
    app.AudioController.playlistClear(function(data){
      app.AudioController.playlistRefresh();
    });
  }




});