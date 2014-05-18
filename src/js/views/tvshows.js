
/**
 * Full page wrapper for all movies list types
 */
app.TvshowsView = Backbone.View.extend({

  initialize:function () {

  },

  render: function () {

    // @TODO: landing page?

    return this;
  }


});



/**
 * List of tvshows
 */
app.TvshowListView = Backbone.View.extend({

  tagName:'ul',

  className:'video-list tvshow-page-list',

  initialize:function () {

    var self = this;

    this.model.on("reset", this.render, this);
    this.model.on("add", function (tvshow) {
      self.$el.append(new app.TvshowListItemView({model:tvshow}).render().el);
    });


  },

  events:{
    "click .next-page": "nextPage"
  },

  render: function () {

    this.$el.empty();

    // append results
    _.each(this.model.models, function (tvshow) {
      this.$el.append(new app.TvshowListItemView({model:tvshow}).render().el);
    }, this);

//    // Show next button and bind auto click with bum smack
//    if(this.model.showNext !== undefined && this.model.showNext === true){
//      this.$el = app.pager.viewHelpers(this.$el, 'tvshow');
//    }

    this.$el.find('img').lazyload({threshold : 200});

    return this;

  },

  nextPage: function(e){
    app.pager.nextPage($(e.target), 'tvshow');
  },


  backFromTvshow: function(fullRange, scrolled){
    var $window = $(window);
    if(fullRange === true && typeof app.vars.backHash != 'undefined'){
      var parts = app.vars.backHash.split('/');
      if(parts[0] == '#tvshow'){
        $window.scrollTo( $('.tvshow-row-' + parts[1]) , 0, {offset: -200});
        scrolled = true;
      }
    }
    return scrolled;
  }


});


/**
 * Single tvshow item
 *
 * @type {*|void|Object|extend|extend|extend}
 */
app.TvshowListItemView = Backbone.View.extend({

  tagName:"li",

  className: 'tvshow-item-content',

  events:{
    "click .tvshow-play": "playTvshow",
    "click .tvshow-add": "add",
    "click .tvshow-thumbsup": "thumbsUp",
//    "click .tvshow-menu": "menu",
    "click .actions-wrapper": "view"
  },


  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },


  /**
   * Render it
   * @returns {TvshowListItemView}
   */
  render:function () {

    this.model.attributes.type = 'tvshow'; // always rendered as an entire show
    var model = this.model.attributes;

    if(!model.label){
      return this;
    }

    model.watched = app.VideoController.watchedStatus(model);
    model.thumbsup = app.playlists.isThumbsUp('tvshow', model.tvshowid);

    this.$el.html(this.template(model));

    return this;
  },


  /**
   * Nav to tvshow page
   */
  view: function(){
    document.location = '#tvshow/' + this.model.attributes.tvshowid;
  },


  /**
   * Queue it
   * @param e
   */
  add: function(e){
    e.preventDefault();
    e.stopPropagation();

    // Add the model
    var model = this.model.attributes;
    app.VideoController.tvshowAdd(model, function(){
      app.VideoController.playlistRender();
    });

  },

  /**
   * Play it
   * @param e
   */
  play: function(e){
    e.preventDefault();
    e.stopPropagation();

    // Add the model
    var model = this.model.attributes;
    app.VideoController.tvshowPlay(model, function(){
      app.VideoController.playlistRender();
    });

  },

    /**
   * Set as thumbsup
   * @param e
   */
  thumbsUp: function(e){
    e.preventDefault();
    e.stopPropagation();

    var tvshow = this.model.attributes,
      op = (app.playlists.isThumbsUp('tvshow', tvshow.tvshowid) ? 'remove' : 'add'),
      $el = $(e.target).closest('.tvshow-actions');
    app.playlists.setThumbsUp(op, 'tvshow', tvshow.tvshowid);
    $el.toggleClass('thumbs-up');

  }

});


/**
 * Full page
 */
app.TvshowView = Backbone.View.extend({

  allTvshowCache: [],

  initialize:function () {
    var self = this;
    // get all tvshows into a cache if required
    // needed for next button
    var allTvshows = new app.TvshowAllCollection();
    allTvshows.fetch({"success": function(data){
      self.allTvshowCache = data;
    }});
  },


  /**
   * Clicks
   */
  events:{
    "click .library-back": "libraryBack",
    "click .library-next": "libraryNext",
    "click .tvshow-play": "play",
    "click .tvshow-add": "add",
    "click .tvshow-thumbsup": "thumbsUp",
    "click .tv-stream": "stream",
    "click .tvshow-menu": "menu"
  },


  /**
   * Render it
   * @returns {TvshowView}
   */
  render: function () {

    var model = this.model.attributes,
      self = this;

    model.type = (model.type !== undefined ? model.type : 'tvshow');

    model.thumbsup = app.playlists.isThumbsUp('tvshow', model.tvshowid);

    model.widethumb = (model.type == 'episode' ? model.thumbnail : model.fanart);

    model.watchedText = self.watchedStatsParse();

    model.watched = app.VideoController.watchedStatus(model);

    //main detail
    this.$el.html(this.template(model));

    // populate download link
    app.AudioController.downloadFile(model.file, function(url){
      $('.download-link', this.$el).attr('href', url);
    });

    // backstretch
    _.defer(function(){
      var $fart = $('#fanart-background',this.$el),
        fart = app.image.url(model.fanart, 'fanart');
      $fart.backstretch(fart);
    });

    if(model.type == 'tvshow'){
        // if we have a collection, render it
        if(model.seasons.length > 0){
          app.cached.tvSeasonListView = new app.TvSeasonListView({model: model.seasons});
          $('#seasons', self.$el).html( app.cached.tvSeasonListView.render().$el ); //.prepend( '<h3>Seasons</h3>' );
        }
    }

    if(model.type == 'season' || model.type == 'episode'){

      // get season collection
      app.cached.tvepisodeCollection = new app.TvepisodeCollection();
      app.cached.tvepisodeCollection.fetch({"tvshowid" : model.tvshowid, "season": model.season, "success": function(collection){

        // if we have a collection, render it
        if(collection.length > 0){
          app.cached.tvSeasonListView = new app.TvSeasonListView({model: collection});
          $('#seasons', self.$el).html( app.cached.tvSeasonListView.render().$el ).addClass('episodes');
          // active class
          if(model.type == 'episode'){
            $('.row-episode-' + model.episodeid, self.$el).addClass('active');
          }
        }

      }});

    }




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
    var nav = app.pager.libraryNav('tvshow', this.model.attributes.tvshowid, this.allTvshowCache.models);

    // next tvshow id available
    if(nav.next > 0){
      document.location = '#tvshow/' + nav.next;
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
    var menu = app.helpers.menuTemplates('tvshow', this.model.attributes);
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

    var tvshow = this.model.attributes,
      op = (app.playlists.isThumbsUp('tvshow', tvshow.tvshowid) ? 'remove' : 'add'),
      $el = $(e.target).closest('.tvshow-actions');
    app.playlists.setThumbsUp(op, 'tvshow', tvshow.tvshowid);
    $el.toggleClass('thumbs-up');

  },


  /**
   * Play it
   * @param e
   */
  play: function(e){
    e.preventDefault();
    e.stopPropagation();

    // Play the model
    app.VideoController.tvshowPlay(this.model.attributes, function(){
      app.VideoController.playlistRender();
    });

  },


  /**
   * Queue it
   * @param e
   */
  add: function(e){
    e.preventDefault();
    e.stopPropagation();

    // Add the model
    app.VideoController.tvshowAdd(this.model.attributes, function(){
      app.VideoController.playlistRender();
    });

  },


  stream: function(e){
    e.preventDefault();
    var player = $(e.target).data('player');

    app.VideoController.stream(player, this.model.attributes);

  },

  watchedStatsParse: function(){
    var model = this.model.attributes;

    switch(model.type){
      case 'tvshow':

        break;
    }
    return 'text';
  }


});



/**
 * List of seasons or episodes
 *
 * @type {*|void|Object|extend|extend|extend}
 */
app.TvSeasonListView = Backbone.View.extend({

  tagName:'ul',
  className:'video-list tvseason-page-list',

  initialize:function () {

  },

  render: function () {

    this.$el.empty();

    // if on a tvshow, sort by ep/season, else, no sort
    if(app.helpers.arg(0) == 'tvshow'){

      // sort by episode or season
      this.model.models.sort(function(a,b){
        if(a.attributes.episodeid !== ''){
          return app.helpers.aphabeticalSort(a.attributes.episode, b.attributes.episode);
        } else {
          return app.helpers.aphabeticalSort( a.attributes.season, b.attributes.season);
        }
      });

    }


    // append results
    _.each(this.model.models, function (season) {
      season.attributes.type = (season.attributes.episodeid !== '' ? 'episode' : 'season');
      this.$el.append(new app.TvSeasonListItemView({model:season}).render().el);
    }, this);

    return this;

  }

});


/**
 * Single tvshow item
 *
 * @type {*|void|Object|extend|extend|extend}
 */
app.TvSeasonListItemView = Backbone.View.extend({

  tagName:"li",

  className: 'tv-item-content',

  events:{
    "click .actions-wrapper": "view",
    "click .tv-play": "play",
    "click .tv-watched": "toggleWatched",
    "click .tv-add": "add"
  },


  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },


  /**
   * Render it
   * @returns {TvshowListItemView}
   */
  render:function () {
    var m = this.model.attributes,
      isEp = (m.type == 'episode');

    m.watched = app.VideoController.watchedStatus(m);

    // toggle subtext based on type
    m.subText = (isEp ? 'Episode ' + m.episode : m.episode + ' Episodes');
    m.label = (isEp && m.title !== '' ? m.title : m.label);


    // render
    this.$el.html(this.template(m));

    return this;
  },


  /**
   * Nav to tvshow page
   */
  view: function(){
    document.location = this.model.attributes.url;
  },


  /**
   * Play it
   * @param e
   */
  play: function(e){
    e.preventDefault();
    e.stopPropagation();

    // Play the model
    app.VideoController.tvshowPlay(this.model.attributes, function(){
      app.VideoController.playlistRender();
    });

  },


  /**
   * Add it
   * @param e
   */
  add: function(e){
    e.preventDefault();
    e.stopPropagation();

    // Add the model
    app.VideoController.tvshowAdd(this.model.attributes, function(){
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
    app.VideoController.toggleWatched('episode', this.model.attributes, function(state){
      if(state === true){
        $target.addClass('watched-yes').removeClass('watched-no');
      } else {
        $target.addClass('watched-no').removeClass('watched-yes');
      }
    });
  }


});



/**
 * Tag view of movies
 */
app.TvshowTagListView = Backbone.View.extend({

  tagName:'div',

  className:'tvshow-tag-list',


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
    //  list = new app.MovieYearCollection();
    }

    // title/loading
    app.ui.setTitle('TV', {addATag: '#mytv', icon: 'desktop', subTitle: title});
    $content.html('<div class="loading-box">Loading TV</div>');

    // get/render items
    list.fetch({"type": "tvshow", "success": function(data){
      // render
      data.type = self.tagType;
      app.cached.genresView = new app.TagsView({model: data});
      $content.html( app.cached.genresView.render().$el );
      // filters
      $content.prepend(app.filters.renderFilters('tvshow'));
      // open tag if req
      self.renderTagItems();
    }});

    return this;

  },


  renderTagItems: function(){

    if(this.model.id === undefined || this.model.id === ''){
      return;
    }

    var filter = {};

    // filter by...
    filter[this.model.tag] = parseInt(this.model.id);

    if($('.tag-type-' + this.tagType).length === 0){

      // New Page, Call Render first
      this.render();

    } else {

      var list = new app.TagsView({model: this.model});
      list.renderTagItems(this.model, 'TvshowFilteredCollection', 'TvshowListView');

    }

  },


  /**
   * An intelligent button suggesting what to watch next given the context
   *
   */
  watchCTA: function(){

  }

});



