app.filters = {

  movieLastSort: 'title:ascending',
  tvshowLastSort: 'title:ascending',

  /*************************************
   * Header filters
   *************************************/

  movieFilters: {
    title: 'Movies',
    basePath: '#movies/page/',
    video: true,
    paths: [{
      title: 'Recently Added',
      path: 'movies',
      argOne: '',
      key: 'recent'
    },{
      title: 'All Movies',
      path: 'movies/page/0/title:ascending',
      argOne: 'page',
      key: 'all'
    },{
      title: 'Genres',
      path: 'movies/genreid',
      argOne: 'genreid',
      key: 'genreid'
    },{
      title: 'Years',
      path: 'movies/year',
      argOne: 'year',
      key: 'year'
    }],
    sort: ["title", "date", "rating", "year", "file"]
  },

  tvshowFilters: {
    title: 'TV Show',
    basePath: '#tvshows/page/',
    video: true,
    paths: [{
      title: 'Recently Added',
      path: 'tvshows',
      argOne: '',
      key: 'recent'
    }, {
      title: 'All TV',
      path: 'tvshows/page/0/title:ascending',
      argOne: 'page',
      key: 'all'
    },{
      title: 'Genres',
      path: 'tvshows/genreid',
      argOne: 'genreid',
      key: 'genreid'
    }],
    sort: ["title", "date", "rating", "year", "file"]
  },


  /*************************************
   * Sidebar filters
   *************************************/

  musicFilters: {
    title: 'Music',
    basePath: '#music',
    audio: true,
    paths: [{
      title: 'Recent',
      path: 'music/recent',
      key: 'recent',
      argOne: 'recent'
    },{
      title: 'Recently Added',
      path: 'music/recently-added',
      key: 'recently-added',
      argOne: 'recently-added'
    },{
      title: 'Recently Played',
      path: 'music/recently-played',
      key: 'recently-played',
      argOne: 'recently-played'
    },{
      title: 'Genres',
      path: 'music/genres',
      key: 'genres',
      argOne: 'genres'
    },{
      title: 'Years',
      path: 'music/years',
      key: 'years',
      argOne: 'years'
    }]
  },





  /**
   * Creates a filter bar give a type/structure
   *
   * @param type
   * @returns {*|jQuery|HTMLElement}
   */
  renderFilters: function(type){

    // is a sidebar filter
    var side = (type == 'music' ? 'sidebar-' : '');

    // make our containers and get structure
    var $container = $('<div/>', {class: side + 'filter-wrapper ' + type + '-filters'}),
      $links = $('<div/>', {class: 'links'}),
      $sort = $('<div/>', {class: 'sort-wrapper dropdown'}),
      structure = app.filters[type + 'Filters'],
      sort = app.helpers.getSort(),
      $body = $('body');

    // tabs/links/sidebar
    $.each(structure.paths, function(i,d){
      // active state
      var act = app.helpers.arg(1) == d.argOne,
        active = (act ? ' active' : '');
      if(act){
        $container.addClass('active-tab-' + d.key);
      }
      // append link
      $links.append($('<a href="#' + d.path + '" class="btn sublink-' + d.key + active + '">' + d.title + '</a>'));
    });

    // Sort dropdown
    if(structure.sort !== undefined){
      // dropdown with sortable features like asc/desc stuff
      var sortItems = [], item = {}, order = 'ascending', shortOrder = 'asc';
      // build items from structure
      $.each(structure.sort, function(i,d){
        order = (d == sort.method ? (sort.order == 'ascending' ? 'descending' : 'ascending') : order);
        shortOrder = app.filters.shortOrder(order);
        item = {
          title: d + (sort.method == d ? ' <i class="fa fa-angle-' + (app.filters.shortOrder(order) != 'asc' ? 'down' : 'up') + '"></i>' : ''),
          url: structure.basePath + '0/'  + d + ':' + order,
          class: 'dir-' + order
        };
        sortItems.push(item);
      });

      // build dropdown
      var dropdown = {
        key: 'sort-items',
        items: sortItems,
        pull: 'right',
        buttonIcon: 'fa-angle-' + (app.filters.shortOrder(sort.order) == 'desc' ? 'down' : 'up'),
        buttonText: ' ' + sort.method
      };
      $sort.append(app.helpers.makeDropdown(dropdown));
    }

    // Watched
    if(structure.video !== undefined){
      // Watched toggle, button and click event
      var $showWatched = $('<button class="btn show-watched-btn" title="Hide watched"><i class="fa fa-check-circle"></i></button>');
      $showWatched.on('click', function(){
        $body.toggleClass('hide-watched');
        // save preference
        app.settings.set('hideWatched', $body.hasClass('hide-watched'));
      });
      $sort.append($showWatched);

      // init hide-watched body class
      if(app.settings.get('hideWatched', false)){
        $body.addClass('hide-watched');
      }
    }

    // Build
    $container.append($sort);

    // menu
    app.helpers.setFirstSidebarContent($links);

    return $container;
  },


  shortOrder: function(order, reversed){
    if(reversed !== undefined && reversed === true){
      return (order != 'ascending' ? 'asc' : 'desc');
    } else {
      return (order == 'ascending' ? 'asc' : 'desc');
    }
  }

};

