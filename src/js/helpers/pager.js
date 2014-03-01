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

    var self = this;
    self.type = (type !== undefined ? type : this.type);
    self.$el = $el;

    // append the next btn if there are results
    if($el.find('li').length > 0){
      var $next = $('<li class="next-page">More...</li>');
      self.$el.append($next);
    }

    // Infinate scroll trigger (scroll)
    $(window).smack({ threshold: '200px' })
      .done(function () {
        $('ul.' + self.type + '-page-list').find('.next-page').trigger('click');
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
  }



};

