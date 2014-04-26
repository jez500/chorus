/**
 * Music views
 */

/**
 * Full Album View
 * Used as a wrapper to piece all the album sub views together
 *
 * @type Backbone View
 */
app.MusicView = Backbone.View.extend({

  tagName:"div",

  className: "music-page",

  initialize:function () {

    this.model.viewStyle = this.getViewStyle();

  },

  events: {
    "click .view-cards": "viewCards",
    "click .view-songs": "viewSongs"
  },


  /**
   * Render controller
   *
   * Render calls functions that render to $content directly
   * @returns {MusicView}
   */
  render:function () {

    var $list = $('.tag-list');

    switch(this.model.page){
      case 'recently-played':
        this.recentPlayed();
        break;
      case 'recent':
        this.recent();
        break;
      case 'recently-added':
        this.recentAdded();
        break;
      case 'genres':
        if($list.length > 0){
          this.genre(this.model.id);
        } else {
          this.genres();
        }
        break;
      case 'years':
        if($list.length > 0){
          this.year(this.model.id);
        } else {
          this.years();
        }
        break;
    }

    return this;

  },


  /**
   * Render recent albums
   */
  recent: function(){

    var self = this,
      $content = $('#content');

    app.cached.recentAlbumCollection = new app.RecentAlbumCollection();
    app.cached.recentAlbumCollection.fetch({type: 'all', "success": function(allAlbums){

      // randomise
      allAlbums.models = app.helpers.shuffle(allAlbums.models);

      // render
      app.cached.recentAlbumsView = new app.SmallAlbumsList({model: allAlbums, className:'album-list-landing'});
      $content.html(app.cached.recentAlbumsView.render().el);

      $content.prepend(app.image.getFanartFromCollection(allAlbums));

    }});

  },


  /**
   * Render recently added
   */
  recentAdded: function(){

    var self = this;

    // first get recently added
    app.cached.recentlyAddedAlbums = new app.AlbumRecentlyAddedXbmcCollection();
    app.cached.recentlyAddedAlbums.fetch({"success": function(albumsAdded){

      // build
      //var $content = $('<div />');
      var $content = $('#content'),
        $albums = $('<div />', {class: 'album-style as-' + self.model.viewStyle});

      $.each(albumsAdded.models, function(i,d){
        $albums.append(self.renderFullAlbum(d));
      });

      self.$el.empty();
      self.$el.append(self.renderViewToggle());
      self.$el.append($albums);

      // fanart
      self.$el.prepend(app.image.getFanartFromCollection(albumsAdded));

      $content.html(self.$el);

    }});

    return this;
  },


  /**
   * Render recently played
   */
  recentPlayed: function(){

    var self = this;

    // first get recently added
    app.cached.recentlyPlayedAlbums = new app.AlbumRecentlyPlayedXbmcCollection();
    app.cached.recentlyPlayedAlbums.fetch({"success": function(albumsPlayed){

      // build
      //var $content = $('<div />');
      var $content = $('#content'),
        $albums = $('<div />', {class: 'album-style as-' + self.model.viewStyle});

      $.each(albumsPlayed.models, function(i,d){
        $albums.append(self.renderFullAlbum(d));
      });

      self.$el.empty();
      self.$el.append(self.renderViewToggle());
      self.$el.append($albums);

      // fanart
      self.$el.prepend(app.image.getFanartFromCollection(albumsPlayed));

      $content.html(self.$el);

    }});

    return this;
  },


  /**
   * Render list of genres
   */
  genres: function(){
    var self = this;

    self.genreList = new app.AudioGenreCollection();
    self.genreList.fetch({"success": function(data){
      data.type = 'musicGenres';
      app.cached.genresView = new app.TagsView({model: data});
      $('#content').html( app.cached.genresView.render().$el );

      // open arg from url
      if(app.helpers.arg(2) !== ''){
        self.genre(app.helpers.arg(2));
      }

    }});
  },


  /**
   * Render a single genres albums
   * @param id
   */
  genre: function(id){

    var self = this, list ;

    list = new app.AlbumFilteredXbmcCollection({filter: {genreid: parseInt(id)}});
    list.fetch({"success": function(data){

      data.models.sort(function(a,b){ return app.helpers.aphabeticalSort(a.attributes.label, b.attributes.label);	});

      var $c = $('#tag-container-' + id);
      var genreList = new app.SmallAlbumsList({model: data, className:'album-list-landing'});
      $c.html(genreList.render().el);
      $c.closest('.tag-list-item').addClass('open');
      $(window).scrollTo($c.parent(), 0, {offset: {top:-50}});
    }});

  },


  years: function(){
    var self = this ;

    self.yearList = new app.AudioYearCollection();
    self.yearList.fetch({"success": function(data){

      data.models.sort(function(a,b){ return app.helpers.aphabeticalSort(b.attributes.label, a.attributes.label);	});

      data.type = 'musicYears';
      app.cached.yearsView = new app.TagsView({model: data});
      $('#content').html( app.cached.yearsView.render().$el );

      // open arg from url
      if(app.helpers.arg(2) !== ''){
        self.year(app.helpers.arg(2));
      }

    }});
  },

  year: function(id){
    var self = this, list;

    list = new app.AlbumYearCollection();
    list.fetch({"year": parseInt(id), "success": function(data){
      // Sort
      data.models.sort(function(a,b){ return app.helpers.aphabeticalSort(a.attributes.label, b.attributes.label);	});

      // View
      var genreList = new app.SmallAlbumsList({model: data, className:'album-list-landing'});

      // populate container
      var $c = $('#tag-container-' + id);
      $c.html(genreList.render().el);
      $c.closest('.tag-list-item').addClass('open');

      // scroll
      $(window).scrollTo($c.parent(), 0, {offset: {top:-50}});
    }});
  },



  /**
   * Renders a full album (with songs), given a model without songs
   * @param model
   * @return $({*})
   */
  renderFullAlbum: function(model){

    var self = this,
      m = model.attributes,
      $album = $('<div />', {id: 'full-album-row-' + m.albumid});

    // Render each album into its correct ordered container
    self.albumList = new app.AlbumCollection();
    self.albumList.fetch({"id": m.albumid, "type": "album", "success": function(data){
      model = data.models[0];
      var aid = model.attributes.albumid;
      $('#full-album-row-' + aid).html(new app.AlbumItemView({model: model}).render().el);
    }});

    return $album;

  },


  /**
   * Gets last used view for this list
   *
   * @param type
   * @returns {*}
   */
  getViewStyle: function(){
    return app.settings.get('list-style-' + this.model.page, 'cards');
  },

  /**
   * Change to card view
   */
  viewCards: function(){
    $('.album-style').removeClass('as-songs').addClass('as-cards');
    // set active toggle
    $('.view-toggles .btn').removeClass('active');
    $('.btn.view-cards').addClass('active');
    // remember setting
    app.settings.set('list-style-' + this.model.page, 'cards');
  },

  /**
   * Change to song list view
   */
  viewSongs: function(){
    $('.album-style').addClass('as-songs').removeClass('as-cards');
    // set active toggle
    $('.view-toggles .btn').removeClass('active');
    $('.btn.view-songs').addClass('active');
    // remember setting
    app.settings.set('list-style-' + this.model.page, 'songs');
  },


  /**
   * Return toggle buttons
   * @returns {string}
   */
  renderViewToggle: function(){
    var state = this.getViewStyle();
    return '<div class="view-toggles"> ' +
      '<button class="btn view-songs ' + (state == 'songs' ? 'active' : '') + '"><i class="fa fa-list"></i></button>' +
      '<button class="btn view-cards ' + (state == 'cards' ? 'active' : '') + '"><i class="fa fa-th-large"></i></button>' +
      '</div>';
  }


});