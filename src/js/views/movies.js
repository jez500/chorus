
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
    app.pager.nextPage($(e.target), 'movie');
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
    "click .actions-wrapper": "view"
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
    app.VideoController.playVideoId(this.model.attributes.movieid, 'movieid', function(data){
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

    var model = this.model.attributes;
    model.thumbsup = app.playlists.isThumbsUp('movie', model.movieid);

    //main detail
    this.$el.html(this.template(model));

    // backstretch
    _.defer(function(){
      var $fart = $('#fanart-background',this.$el),
        fart = app.parseImage(model.fanart, 'fanart');
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
    app.VideoController.playVideoId(this.model.attributes.movieid, 'movieid', function(data){
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