/**
 * Helper functionality for creating paginated pages
 */

app.pager = {

  type: 'movie',

  map: {
    movie: {
      allCollection: 'MovieAllCollection',
      collection: 'CustomMovieCollection',
      view: 'MovieListView'
    }
  },


  /**
   * Set model type
   *
   * @param type
   * @returns {pager}
   */
  setType: function(type){
    this.type = type;
    return this;
  },


  /**
   * Called during .render() on a list view
   *
   * @param $el
   * @param type
   * @returns {*}
   *  jquery $el
   */
  viewHelpers: function($el, type){

    var self = app.pager,
      isMobile = ($('body').width() < 800),
      thresholdVal = (isMobile ? '0.8' : '500px'); // px value doesnt work on mobile?

    self.type = (type !== undefined ? type : this.type);
    self.$el = $el;

    // append the next btn if there are results
    if($el.find('li').length > 0){
      var $next = $('<li class="next-page">More...</li>');
      self.$el.append($next);
    }

    // Infinate scroll trigger (scroll)
    $(window).smack({ threshold: thresholdVal })
      .done(function () {
        $('ul.' + self.type + '-page-list').find('.next-page').last().trigger('click');
      });

    // add row class (for scrolling to page)
    self.$el.addClass('page-' + app[self.type + 'PageNum']);

    self.$el.find('img').lazyload({threshold : 200});

    return self.$el;
  },


  /**
   * Go to the next page
   *
   * @param $el
   * @param type
   * @returns {}
   *  jquery $el
   */
  nextPage: function($el, type){

    this.type = (type !== undefined ? type : this.type);

    // remove the next button
    $el.remove();
    // render fetch and render next page
    app.router[this.type + 's']( (app[this.type + 'PageNum'] + 1), true ); // append next page of results

    return $el;
  },



  /**
   * Returns next and previous items in library
   *
   * @param type
   *  movie, tvshow
   * @param id
   *  the id to match against
   * @param models
   */
  libraryNav: function(type, id, models){

    // next tvshow in cache
    var next = false,
      nextId = 0,
      last = 0,
      lastId = 0;

    // loop over all tvshows
    $.each(models, function(i,d){
      var model = d.attributes,
        idType = type + 'id';
      // current was last
      if(next === true){
        nextId = parseInt(model[idType]);
        next = false;
      }
      if(model[idType] == id){
        next = true;
        lastId = last;
      }
      last = id;
    });

    return {
      'next': nextId,
      'prev': lastId
    };

  }


};

