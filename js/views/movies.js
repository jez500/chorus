
/**
 * Full page wrapper for all movies list types
 */
app.MoviesView = Backbone.View.extend({

  initialize:function () {

  },

  render: function () {

//    // Create structure
//    var $tabs = $('<ul class="nav nav-tabs"></ul>'),
//      $tabContent = $('<div class="tab-content"></div>'),
//      $tabWrapper = $('<div class="content-tabs"></div>');
//
//    var tabs = ['Recently Added', 'Browse'];
//    $.each(tabs, function(i,d){
//      // create tabs
//      var $tab = $('<li class="tab tab-' + i + (i == 0 ? ' active' : '') + '" ></li>');
//      $tab.append( $('<a data-toggle="tab" href="#tab-' + i + '">' + d + '</a>') );
//      $tabs.append($tab);
//      // create panes
//      $tabContent.append( $('<div class="tab-pane' + (i == 0 ? ' active' : '') + '" id="tab-' + i + '" >Loading ' + d + '</div>') );
//    });
//
//
//    $tabWrapper.append($tabs).append($tabContent);
//    this.$el.html($tabWrapper);
//
//    // Load the contents
//

    return this;
  }


});



/**
 * List of movies
 */
app.MovieListView = Backbone.View.extend({

  tagName:'ul',

  className:'video-list movie-list',

  initialize:function () {

  },

  events:{
    "click .next-page": "nextPage"
  },

  render:function () {

    // append results
    this.$el.empty();
    _.each(this.model.models, function (movie) {
      this.$el.append(new app.MovieListItemView({model:movie}).render().el);
    }, this);

    // append the next btn
    if(this.model.length > 0){
      var $next = $('<li class="next-page">More...</li>');
      this.$el.append($next);
    }

    // Infinate scroll trigger (scroll)
    $(window).smack({ threshold: 0.8 })
      .then(function () {
        $('ul.movie-list').find('.next-page').trigger('click');
      });

    // add row class (for scrolling to page)
    this.$el.addClass('page-' + app.moviePageNum);

    return this;

  },

  nextPage: function(e){
    // remove the next button
    $(e.target).remove();
    // render fetch and render next page
    app.router.movies();

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

  render:function () {

    var model = this.model.attributes;
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


  playMovie: function(e){
    e.preventDefault();
    e.stopPropagation();
    app.VideoController.playVideoId(this.model.attributes.movieid, 'movieid', function(data){
      // movie should be playing
      app.VideoController.playlistRender();
    });

  },


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
      console.log(data);
      self.allMovieCache = data;
    }});
  },

  events:{
    "click .library-back": "libraryBack",
    "click .library-next": "libraryNext",
    "click .movie-play": "playMovie",
    "click .movie-add": "addMovie",
    "click .movie-thumbsup": "thumbsUp",
    "click .movie-menu": "menu"
  },

  render: function () {



    var model = this.model.attributes;
    model.thumbsup = app.playlists.isThumbsUp('movie', model.movieid);

    //main detail
    this.$el.html(this.template(model));

    console.log(model);

    // backstretch
    $('#fanart-background',this.$el).backstretch(app.parseImage(model.fanart, 'fanart'));

    return this;
  },



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

    // next movie in cache
    var next = false,
      nextId = 0,
      self = this;

    // loop over all movies
    $.each(self.allMovieCache.models, function(i,d){
      var movie = d.attributes;
      // current was last
      if(next === true){
        nextId = parseInt(movie.movieid);
        next = false;
      }
      if(movie.movieid == self.model.attributes.id){
        next = true;
      }
    });

    // next movie id available
    if(nextId > 0){
      document.location = '#movie/' + nextId;
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


  playMovie: function(e){
    e.preventDefault();
    app.VideoController.playVideoId(this.model.attributes.movieid, 'movieid', function(data){
      // movie should be playing
      app.VideoController.playlistRender();
    });

  },


  addMovie: function(e){
    e.preventDefault();
    app.VideoController.addToPlaylist(this.model.attributes.movieid, 'movieid', 'add', function(data){
      // movie should be playing
      app.VideoController.playlistRender();
    });

  }


});