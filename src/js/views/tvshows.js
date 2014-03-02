
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
//    "click .tvshow-play": "playTvshow",
//    "click .tvshow-add": "addTvshow",
//    "click .tvshow-thumbsup": "thumbsUp",
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

    var model = this.model.attributes;
    if(!model.label){
      return this;
    }
    model.thumbsup = app.playlists.isThumbsUp('tvshow', model.tvshowid);

    this.$el.html(this.template(model));

    return this;
  },


  /**
   * Nav to tvshow page
   */
  view: function(){
    document.location = '#tvshow/' + this.model.attributes.tvshowid;
  }

//  ,
//
//  /**
//   * Contextual options
//   * @param e
//   */
//  menu: function(e){
//    e.stopPropagation();
//    e.preventDefault();
//    // build the menu template
//    var menu = app.helpers.menuTemplates('tvshow', this.model.attributes);
//    // add dialog
//    app.helpers.menuDialog(menu);
//  },
//
//
//  /**
//   * Set as thumbsup
//   * @param e
//   */
//  thumbsUp: function(e){
//    e.stopPropagation();
//    e.preventDefault();
//    var tvshow = this.model.attributes,
//      op = (app.playlists.isThumbsUp('tvshow', tvshow.tvshowid) ? 'remove' : 'add'),
//      $el = $(e.target).closest('.tvshow-actions');
//    app.playlists.setThumbsUp(op, 'tvshow', tvshow.tvshowid);
//    $el.toggleClass('thumbs-up');
//
//  },
//
//
//  /**
//   * Play it
//   * @param e
//   */
//  playTvshow: function(e){
//    e.preventDefault();
//    e.stopPropagation();
//    app.VideoController.playVideoId(this.model.attributes.tvshowid, 'tvshowid', function(data){
//      // tvshow should be playing
//      app.VideoController.playlistRender();
//    });
//
//  },
//
//
//  /**
//   * Queue it
//   * @param e
//   */
//  addTvshow: function(e){
//    e.preventDefault();
//    e.stopPropagation();
//    app.VideoController.addToPlaylist(this.model.attributes.tvshowid, 'tvshowid', 'add', function(data){
//      // tvshow should be playing
//      app.VideoController.playlistRender();
//    });
//
//  }

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
    "click .tvshow-play": "playTvshow",
    "click .tvshow-add": "addTvshow",
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

    //main detail
    this.$el.html(this.template(model));

    // backstretch
    _.defer(function(){
      var $fart = $('#fanart-background',this.$el),
        fart = app.parseImage(model.fanart, 'fanart');
      $fart.backstretch(fart);
    });


    console.log(model.type, model.season);

    if(model.type == 'tvshow'){


      // get season collection
     // app.cached.tvseasonCollection = new app.TvseasonCollection();
     // app.cached.tvseasonCollection.fetch({"tvshowid" : model.tvshowid, "success": function(collection){

        // if we have a collection, render it
        if(model.seasons.length > 0){
          app.cached.tvSeasonListView = new app.TvSeasonListView({model: model.seasons});
          $('#seasons', self.$el).html( app.cached.tvSeasonListView.render().$el ).prepend( '<h3>Seasons</h3>' );
        }

        //console.log(collection);
      //}});

    }

    if(model.type == 'season' || model.type == 'episode'){

      console.log(model);

      // get season collection
      app.cached.tvepisodeCollection = new app.TvepisodeCollection();
      app.cached.tvepisodeCollection.fetch({"tvshowid" : model.tvshowid, "season": model.season, "success": function(collection){

        // if we have a collection, render it
        if(collection.length > 0){
          app.cached.tvSeasonListView = new app.TvSeasonListView({model: collection});
          $('#seasons', self.$el).html( app.cached.tvSeasonListView.render().$el ).prepend( '<h3><a href="#tvshow/' + model.tvshowid + '">Season ' + model.season + '</a> <i class="fa fa-angle-right"></i> Episodes</h3>').addClass('episodes');
        }

        console.log(collection);
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
    var nav = app.pager.libraryNav('tvshow', this.model.attributes.id, this.allTvshowCache.models);

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
  playTvshow: function(e){
    e.preventDefault();
    app.VideoController.playVideoId(this.model.attributes.tvshowid, 'tvshowid', function(data){
      // tvshow should be playing
      app.VideoController.playlistRender();
    });

  },


  /**
   * Queue it
   * @param e
   */
  addTvshow: function(e){
    e.preventDefault();
    app.VideoController.addToPlaylist(this.model.attributes.tvshowid, 'tvshowid', 'add', function(data){
      // tvshow should be playing
      app.VideoController.playlistRender();
    });

  },

  stream: function(e){
    e.preventDefault();
    var player = $(e.target).data('player');

    var win = window.open("videoPlayer.html?player=" + player, "_blank", "toolbar=no, scrollbars=no, resizable=yes, width=925, height=545, top=100, left=100");

    app.AudioController.downloadFile(this.model.attributes.file, function(url){
      win.location = "videoPlayer.html?player=" + player + "&src=" + encodeURIComponent(url);
    });

  }


});



/**
 * List of tvshows
 */
app.TvSeasonListView = Backbone.View.extend({

  tagName:'ul',

  className:'video-list tvseason-page-list',

  initialize:function () {



  },

  render: function () {

    this.$el.empty();

    // append results
    _.each(this.model.models, function (season) {
      this.$el.append(new app.TvSeasonListItemView({model:season}).render().el);
    }, this);

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
app.TvSeasonListItemView = Backbone.View.extend({

  tagName:"li",

  className: 'tv-item-content',

  events:{
    "click .actions-wrapper": "view",
    "click .tv-play": "play",
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

    var model = this.model.attributes;

    this.$el.html(this.template(model));

    return this;
  },


  /**
   * Nav to tvshow page
   */
  view: function(){
    document.location = this.model.attributes.url;
  },


  /**
   * play
   */
  play: function(e){
    e.stopPropagation();

    app.VideoController.playVideoId(this.model.attributes.episodeid, 'episodeid', function(data){
      // movie should be playing
      app.VideoController.playlistRender();
    });

  },


  /**
   * play
   */
  add: function(e){
    e.stopPropagation();

    app.VideoController.addToPlaylist(this.model.attributes.episodeid, 'episodeid', 'add', function(data){
      // movie should be playing
      app.VideoController.playlistRender();
    });

  }




});




