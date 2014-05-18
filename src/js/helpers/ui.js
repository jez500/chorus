/**
 * UI helpers
 */


app.ui = {

  setLoading: function(text, sidebar){

    // empty sidebar?
    sidebar = (sidebar !== undefined && sidebar === true);
    if(sidebar){
      app.helpers.setFirstSidebarContent('');
    }

    // content
    $('#content').html('<div class="loading-box">Loading ' + text + '</div>');

    // title
    app.ui.setTitle('Loading', { addATag: '#', icon: 'refresh'});

    // remove backstretch
    var $bs = $('.backstretch');
    if($bs.length > 0){
       $.backstretch("destroy", false);
    }

  },


  /**
   * Wrapper for setting page title
   *
   * @param value
   * @param options
   *   tabs = {url:title, url:title}
   *   addATag = wraps the value in an a tag
   */
  setTitle: function(value, options){
    var defaults = {
      addATag: false,
      tabs: false,
      activeTab: 0,
      subTitle: '',
      icon: false
    };

    var settings = $.extend(defaults,options),
      $title = $('#title'), ico = '';

    $title.empty();

    if(settings.icon !== false){
      ico = '<i class="fa fa-' + settings.icon + '"></i> ';
    }

    // add <a> tag if set
    if(settings.addATag){
      $title.append($('<a class="title-sub" href="' + settings.addATag + '">' + ico + value + '</a>'));
      $title.append(settings.subTitle);
    }

    // append tabs - DEPRECATED see filter.js @todo remove
    var n = 0;
    if(settings.tabs !== false){
      var $tabs = $('<div class="nav nav-tabs"></div>');
      for(var i in settings.tabs){
        var $el = $('<a href="' + i + '" class="nav-tab">' + settings.tabs[i] + '</a>');
        $tabs.append( $el );
        n++;
      }
      $title.append($tabs);
    }

    // if value not added, as that in a wrapper
    if(!settings.addATag){
      $title.append('<div class="title-main">' + ico + value + '</div>');
    }

    //cache
    app.currentPageTitle = ico + value;

  },


  /**
   * Wrapper for getting page title
   */
  getTitle: function(){
    return app.currentPageTitle;
  },


  /**
   * Render no result html to #content
   * @param text
   */
  renderNoResult: function(text){
    $('#content').html('<div class="loading-box no-result">' + (text === undefined ? 'Nothing found' : text) + '</div>');
  },


  /**
   * Open feature not yet built dialog
   */
  featureNotBuiltDialog: function(){
    app.helpers.info(
      'Feature not yet built',
      'This is still just an idea, to help turn it into reality, ' + app.ui.beerLink('Beer') + ' is always a good incentive :)'
    );
  },


  /**
   * Beer link html
   */
  beerLink: function(text){
    return '<a href="' + app.settings.getBeerUrl() + '" target="_blank">' + text + '</a>';
  },


  /**
   * Start internal progress timer
   * 1 second loop
   */
  timerStart: function(){
    app.playingInterval = setTimeout(app.ui.timerUpdate,1000);
  },


  /**
   * Stop the internal timer
   */
  timerStop: function(){
    clearTimeout(app.playingInterval);
  },


  /**
   * If playing, increase the time by 1 sec, refresh time and progress
   * Will stop the timer if not playing, and restart it if playing
   */
  timerUpdate: function(){

    var data = app.playerState.xbmc.getNowPlaying();

    // stop existing timers and restart if playing
    app.ui.timerStop();

    // is playing
    if(data.status == 'playing' && data.player.time !== undefined){

      // parse time
      var cur = app.helpers.timeToSec(data.player.time) + 1,
        dur = app.helpers.timeToSec(data.player.totaltime),
        per = Math.ceil( ( (cur / dur )  * 100 ) ),
        curObj = app.helpers.secToTime(cur);

      // update cache with new time
      app.cached.nowPlaying.player.time = curObj;

      // update ui
      $('#footer .time-cur').html(app.helpers.formatTime(curObj));
      app.shellView.$progressSlider.slider( "value", per );

      // Restart timer
      app.ui.timerStart();
    }

  },


  /**
   * Create a sub-title string for a given model
   */
   getModelMeta: function(model){

     // need a model or type to continue
     if(model === undefined || model.type === undefined){
       return '';
     }

     // meta depends on type
     meta = '';
     switch(model.type){
       case 'song':
         meta = app.helpers.parseArtistsArray(model);
         break;
       case 'movie':
         meta = model.year;
         break;
       case 'episode':
         meta = model.showtitle + ' (S' + model.season + ' E' + model.episode + ')';
         break;
       case 'channel':
         meta = model.title;
         break;
     }

     // return the meta
     return meta;
   }



};


