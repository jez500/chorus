
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
    "click .play-movie": "playMovie"
  },

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {

    var model = this.model.attributes;
   // model.subtext = ( typeof model.genre != 'undefined' ? model.genre.join(', ') : '' );
    this.$el.html(this.template(model));
    return this;
  },

  playMovie: function(e){
    e.preventDefault();

  }

});


/**
 * Full page
 */
app.MovieView = Backbone.View.extend({

  initialize:function () {

  },

  render: function () {

    var model = this.model.attributes;

    //main detail
    this.$el.html(this.template(model));

    console.log(model);
    // sidebar
    var $side = $('<div class="video-side"></div>');
    $side.append($('<img src="'+app.parseImage(model.thumbnail)+'" />'));

    $('#details',this.$el).backstretch(app.parseImage(model.fanart));

    //app.helpers.setFirstSidebarContent($side);

    return this;
  }


});