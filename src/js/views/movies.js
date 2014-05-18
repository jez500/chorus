
/**
 * Full page wrapper for all movies list types
 */
app.MoviesView = Backbone.View.extend({

  initialize:function () {

  },

  render: function () {

    // @TODO: landing page?

    return this;
  }


});



/**
 * List of movies
 */
app.MovieListView = Backbone.View.extend({

  tagName:'ul',

  className:'video-list movie-page-list',

  initialize:function () {

    var self = this;

    this.model.on("reset", this.render, this);
    this.model.on("add", function (movie) {
      self.$el.append(new app.MovieListItemView({model:movie}).render().el);
    });


  },

  events:{
    "click .next-page": "nextPage"
  },

  render: function () {

    this.$el.empty();

    // append results
    _.each(this.model.models, function (movie) {
      this.$el.append(new app.MovieListItemView({model:movie}).render().el);
    }, this);

    // Show next button and bind auto click with bum smack
    if(this.model.showNext !== undefined && this.model.showNext === true){
      this.$el = app.pager.viewHelpers(this.$el, 'movie');
    }

    return this;

  },

  nextPage: function(e){
    // Do not run if we have no next button (sometime sneaks past even if button not rendered somehow?)
    if(this.model.showNext !== undefined && this.model.showNext === true){
      var $el = $('.next-page').last();
      app.pager.nextPage($el, 'movie');
    }
  },


  backFromMovie: function(fullRange, scrolled){
    var $window = $(window);
    if(fullRange === true && typeof app.vars.backHash != 'undefined'){
      var parts = app.vars.backHash.split('/');
      if(parts[0] == '#movie'){
        $window.scrollTo( $('.movie-row-' + parts[1]) , 0, {offset: -200});
        scrolled = true;
      }
    }
    return scrolled;
  }


});


/**
 * Single movie item
 *
 * @type {*|void|Object|extend|extend|extend}
 */
app.MovieListItemView = Backbone.View.extend({

  tagName:"li",

  className: 'movie-item-content',

  events:{
    "click .movie-play": "playMovie",
    "click .movie-add": "addMovie",
    "click .movie-thumbsup": "thumbsUp",
    "click .movie-menu": "menu",
    "click .actions-wrapper": "view",
    "click .movie-watched": "toggleWatched"
  },


  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },


  /**
   * Render it
   * @returns {MovieListItemView}
   */
  render:function () {

    var model = this.model.attributes;
    if(!model.label){
      return this;
    }

    model.type = 'movie';
    model.watched = app.VideoController.watchedStatus(model);
    model.thumbsup = app.playlists.isThumbsUp('movie', model.movieid);

    this.$el.html(this.template(model));

    return this;
  },


  /**
   * Nav to movie page
   */
  view: function(){
    document.location = '#movie/' + this.model.attributes.movieid;
  },


  /**
   * Contextual options
   * @param e
   */
  menu: function(e){
    e.stopPropagation();
    e.preventDefault();
    // build the menu template
    var menu = app.helpers.menuTemplates('movie', this.model.attributes);
    // add dialog
    app.helpers.menuDialog(menu);
  },


  /**
   * Set as thumbsup
   * @param e
   */
  thumbsUp: function(e){
    e.stopPropagation();
    e.preventDefault();
    var movie = this.model.attributes,
      op = (app.playlists.isThumbsUp('movie', movie.movieid) ? 'remove' : 'add'),
      $el = $(e.target).closest('.movie-actions');
    app.playlists.setThumbsUp(op, 'movie', movie.movieid);
    $el.toggleClass('thumbs-up');

  },


  /**
   * Play it
   * @param e
   */
  playMovie: function(e){
    e.preventDefault();
    e.stopPropagation();
    app.VideoController.playVideoId(this.model.attributes.movieid, 'movieid', this.model.attributes, function(data){
      // movie should be playing
      app.VideoController.playlistRender();
    });

  },


  /**
   * Queue it
   * @param e
   */
  addMovie: function(e){
    e.preventDefault();
    e.stopPropagation();
    app.VideoController.addToPlaylist(this.model.attributes.movieid, 'movieid', 'add', function(data){
      // movie should be playing
      app.VideoController.playlistRender();
    });

  },


  /**
   * Watched it
   * @param e
   */
  toggleWatched: function(e){
    e.preventDefault();
    e.stopPropagation();
    var $target = $(e.target).closest('.card');

    // We use the class to toggle so a full refresh is avoided
    this.model.attributes.playcount = ($target.hasClass('watched-yes') ? 1 : 0);
    // toggle
    app.VideoController.toggleWatched('movie', this.model.attributes, function(state){
      if(state === true){
        $target.addClass('watched-yes').removeClass('watched-no');
      } else {
        $target.addClass('watched-no').removeClass('watched-yes');
      }
    });
  }

});


/**
 * Full page
 */
app.MovieView = Backbone.View.extend({

  allMovieCache: [],

  initialize:function () {
    var self = this;
    // get all movies into a cache if required
    // needed for next button
    var allMovies = new app.MovieAllCollection();
    allMovies.fetch({"success": function(data){
      self.allMovieCache = data;
    }});
  },


  /**
   * Clicks
   */
  events:{
    "click .library-back": "libraryBack",
    "click .library-next": "libraryNext",
    "click .movie-play": "playMovie",
    "click .movie-add": "addMovie",
    "click .movie-thumbsup": "thumbsUp",
    "click .movie-stream": "stream",
    "click .movie-menu": "menu"
  },


  /**
   * Render it
   * @returns {MovieView}
   */
  render: function () {

    var self = this,
      model = this.model.attributes;
    model.type = 'movie';
    model.thumbsup = app.playlists.isThumbsUp('movie', model.movieid);
    model.watched = app.VideoController.watchedStatus(model);

    // main detail
    this.$el.html(this.template(model));

    // populate download link
    app.AudioController.downloadFile(model.file, function(url){
      $('.download-link', this.$el).attr('href', url);
    });

    // backstretch
    _.defer(function(){
      var $fart = $('#fanart-background',self.$el),
        fart = app.image.url(model.fanart, 'fanart');
      $fart.backstretch(fart);
    });

    return this;
  },


  /**
   * Same as click browser back button
   * @param e
   */
  libraryBack: function(e){
    e.preventDefault();
    // same as using the back button
    window.history.back();
  },


  /**
   * Navigate Next
   * @param e
   */
  libraryNext: function(e){

    e.preventDefault();
    var nav = app.pager.libraryNav('movie', this.model.attributes.id, this.allMovieCache.models);

    // next movie id available
    if(nav.next > 0){
      document.location = '#movie/' + nav.next;
    }
  },


  /**
   * Contextual options
   * @param e
   */
  menu: function(e){
    e.stopPropagation();
    e.preventDefault();
    // build the menu template
    var menu = app.helpers.menuTemplates('movie', this.model.attributes);
    // add dialog
    app.helpers.menuDialog(menu);
  },


  /**
   * Set as thumbsup
   * @param e
   */
  thumbsUp: function(e){
    e.stopPropagation();
    e.preventDefault();
    var movie = this.model.attributes,
      op = (app.playlists.isThumbsUp('movie', movie.movieid) ? 'remove' : 'add'),
      $el = $(e.target).closest('.movie-actions');
    app.playlists.setThumbsUp(op, 'movie', movie.movieid);
    $el.toggleClass('thumbs-up');

  },


  /**
   * Play it
   * @param e
   */
  playMovie: function(e){
    e.preventDefault();
    app.VideoController.playVideoId(this.model.attributes.movieid, 'movieid', this.model.attributes, function(data){
      // movie should be playing
      app.VideoController.playlistRender();
    });

  },


  /**
   * Queue it
   * @param e
   */
  addMovie: function(e){
    e.preventDefault();
    app.VideoController.addToPlaylist(this.model.attributes.movieid, 'movieid', 'add', function(data){
      // movie should be playing
      app.VideoController.playlistRender();
    });

  },

  stream: function(e){
    e.preventDefault();
    var player = $(e.target).data('player');
    app.VideoController.stream(player, this.model.attributes);
  }

});


/**
 * Tag view of movies
 */
app.MovieTagListView = Backbone.View.extend({

  tagName:'div',

  className:'movie-tag-list',

  initialize:function () {
    var type = this.model.type,
      tag = this.model.tag;
    this.tagType = type + tag;
  },

  render: function () {

    var self = this,
      $content = $('#content'),
      list, title = '';

    // genre collection
    if(this.model.tag == 'genreid'){
      title = 'Genres';
      list = new app.VideoGenreCollection();
    } else {
      // year collection
      title = 'Years';
      list = new app.VideoYearCollection();
    }

    // title
    app.ui.setTitle('Movies', {addATag: '#movies', icon: 'film', subTitle: title});

    // get/render items
    list.fetch({"type": "movie", "success": function(data){
      // render
      data.type = self.tagType;
      app.cached.genresView = new app.TagsView({model: data});
      $content.html( app.cached.genresView.render().$el );
      // filters
      $content.prepend(app.filters.renderFilters('movie'));
      // open tag if req
      self.renderTagItems();
    }});

    return this;

  },

  renderTagItems: function(){
    if(this.model.id === undefined || this.model.id === ''){
      return;
    }

    var id = this.model.id,
      type = this.tagType,
      list,
      tag = this.model.tag,
      filter = {};

    // filter by...
    filter[tag] = parseInt(id);

    if($('.tag-type-' + type).length === 0){

      // New Page, Call Render first
      this.render();

    } else {

      list = new app.TagsView({model: this.model});
      list.renderTagItems(this.model, 'MovieFilteredCollection', 'MovieListView');

    }
  }

});

