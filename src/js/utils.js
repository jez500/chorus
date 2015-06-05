/**
 *
 *  This is bunch of generic helper utils to keep basic logic out of the main app
 *  @TODO cleanup and move stuff to better locations
 *
 */


/**
 * what our setTimeout is attached to
 */
var notificationTimoutObj = {};


/**
 * Generic Helper Utils Binds
 */
$(window).on('shellReady', function(){
  // get version
  $.get('addon.xml',function(data){
    app.addonData = $(data).find('addon').attr();
    // Get our dialog ready for use
    app.helpers.dialogInit();
  });
});


/**
 * Dom ready
 */
$(document).ready(function(){


  /********************************************************************************
   * vars/definitions
   ********************************************************************************/

  /**
   * Generic vars
   */
  app.helpers = {};
  app.helpers.scroller = {};

  /**
   * A wrapper for getting the main selectors
   * @param name
   * @returns {*}
   */
  app.helpers.getSelector = function(name){

    var selectors = {
      content: '#content',
      title: '#title',
      dialog: '#dialog',
      sidebar1: '#sidebar-first',
      sidebar2: '#sidebar-second'
    };

    return selectors[name];
  };


  /********************************************************************************
   * Error logging helpers
   ********************************************************************************/

  /**
  * Error handler
  * @param type
  *  type of error, any kind of string
  * @param error
   * error object
  */
  app.helpers.errorHandler = function(type, error){
    console.log(error);
    if(typeof error[0] != 'undefined' && error[0].error == "Internal server error"){
      // no connection
    } else {
      // standard item
      console.log('%c Bam! Error occurred (' + type + ')', app.helpers.consoleStyle(4), error);
    }
  };


  /**
   * Debug styles
   * @param args
   */
  app.helpers.consoleStyle = function(style){

    var defaults = {
      background: '#ccc',
      padding: '0 5px',
      color: '#444',
      'font-weight': 'bold',
      'font-size': '110%'
    }, styles = [];

    var mods = [
      {background: '#D8FEFE'},
      {background: '#CCFECD'},
      {background: '#FFFDD9'},
      {background: '#FAE9F1'},
      {background: '#FFCECD'}
    ];

    if(style !== undefined){
      defaults = $.extend(defaults, mods[style]);
    }

    for(var prop in defaults){
      styles.push(prop + ': ' + defaults[prop]);
    }

    return styles.join('; ');
  };


  /********************************************************************************
   * Global helpers
   ********************************************************************************/


  /**
   * Variables all variables are for use in a single page load, not for persistent storage.
   *
   * Set a variable
   * @param name
   * @param val
   */
  app.helpers.varSet = function(name, val){
    app.vars[name] = val;
  };


  /**
   * Get a variable
   * @param name
   * @param fallback
   * @returns {*}
   */
  app.helpers.varGet = function(name, fallback){
    return (app.vars[name] !== undefined ? app.vars[name] : fallback);
  };


  /**
   * like arg() in drupal
   */
  app.helpers.arg = function(n){

    var hash = location.hash,
      args = hash.substring(1).split('/');

    // if n set return string
    if(typeof n != 'undefined'){
      if(typeof args[n] == 'undefined'){
        return '';
      }
      return args[n];
    }

    // return array
    return args;
  };


  /**
   * Get a url GET paramater
   * @param name
   * @returns {string}
   */
  app.helpers.getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };


  /**
   * like shuffle() in php
   */
  app.helpers.shuffle = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };


  /**
   *  Alphabetical sort callback
   */
  app.helpers.aphabeticalSort = function(a,b){
    
    var nameA=a, nameB=b;
    if(typeof a == 'string'){
      nameA=a.toLowerCase();
      nameB=b.toLowerCase();
    }

    if (nameA < nameB){ //sort string ascending
      return -1;
    }
    if (nameA > nameB){
      return 1;
    }
    return 0; //default return value (no sorting)
  };


  /**
   *  is a value an int
   */
  app.helpers.isInt = function(value){
    if(app.helpers.exists(value)){
      return ((parseFloat(value) == parseInt(value)) && !isNaN(value));
    }
    return false;
  };


  /**
   * get a random int
   * @param min
   * @param max
   * @returns {number|string}
   */
  app.helpers.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


  /**
   * Format a number with the desired number of leading zeros
   */
  app.helpers.numPad = function(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
  };


  /**
   * Convert seconds to time
   */
  app.helpers.secToTime = function(totalSec){
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;

    return { hours: hours, minutes: minutes, seconds: seconds };
  };


  /**
   * Convert time to seconds
   */
  app.helpers.timeToSec = function(time){
    var hours = parseInt( time.hours ) * (60 * 60);
    var minutes = parseInt( time.minutes ) * 60;
    return parseInt( hours ) + parseInt( minutes) + parseInt( time.seconds );
  };


  /**
   * format a nowplaying time object for display
   */
  app.helpers.formatTime = function(time){
    if(time === undefined){
      return 0;
    }
    return (time.hours > 0 ? time.hours + ':' : '') +
      (time.hours > 0 && time.minutes < 10 ? '0' : '') + (time.minutes > 0 ? time.minutes + ':' : '') +
      ((time.minutes > 0 || time.hours > 0) && time.seconds < 10 ? '0' : '') + time.seconds;
  };

  /**
   * remove [COLOR] tags
   */
  app.helpers.uncolorText = function(text){
      return text.replace(/\[\/?color([^\]]*)?\]/ig, '');
  };



  /**
   * wrapper for if ! undefined (seem to use it a bit)
   */
  app.helpers.exists = function(data){
    return (typeof data != 'undefined');
  };

  /**
   * Parse a rating into x.x/10 stars
   * @return float
   */
  app.helpers.rating = function(rating){
    return Math.round(rating * 10) / 10;
  };


  /********************************************************************************
   * URL Functions
   ********************************************************************************/


  /**
   * Add a url to a collection of models
   * @return float
   */
  app.helpers.buildUrls = function(models, page, idKey){
    $.each(models, function(i,d){
      models[i].url = app.helpers.buildUrl(page, d[idKey]);
    });
    return models;
  };


  /**
   * Add a url to a collection of models
   * @return float
   */
  app.helpers.buildUrl = function(type, id, model){
    // songs and files go home
    if(type == 'song' || type == 'file'){
      return '#';
    }
    if(type == 'episode'){
      return '#tvshow/' + model.tvshowid + '/' + model.season + '/' + id;
    }
    // else build
    return '#' + type + '/' + id;
  };



  /********************************************************************************
   * First Sidebar
   ********************************************************************************/


  /**
   * Populate the first sidebar
   * @param content
   * @param append
   */
  app.helpers.setFirstSidebarContent = function(content, append){
    append = (typeof append != 'undefined' && append === true);

    var $container = app.helpers.getFirstSidebarContent();

    // add the content
    if(append){
      $container.append(content);
    } else {
      $container.html(content);
    }

    // trigger binds
    app.helpers.firstSidebarBinds();
  };


  /**
   * Get the first sidebar
   */
  app.helpers.getFirstSidebarContent = function(){

    // ensure sidebar is visible
    app.helpers.toggleSidebar('open');

    var $sidebarFirst = $(app.helpers.getSelector('sidebar1'));
    return $(".sidebar-content", $sidebarFirst);

  };


  /**
   * first sidebar binds
   */
  app.helpers.firstSidebarBinds = function(){

    var $container = app.helpers.getFirstSidebarContent();

    // ensure sidebar is visible
    app.helpers.toggleSidebar('open');

    // trigger lazyload
    $("img.lazy").lazyload({
      effect : "fadeIn",
      container: $container
    });

    // let others hook in
    $container.trigger('scroll');

  };


  /**
   * Toggle sidebar
   * @param state
   *  optional: if not set will toggle, else 'open' or 'close'
   */
  app.helpers.toggleSidebar = function(state){
    var addc = 'sidebar', rmc = 'no-sidebar', $body = $('body');
    if(state === undefined){
      $body.toggleClass(addc).toggleClass(rmc);
    } else {
      if(state == 'open'){
        $body.addClass(addc).removeClass(rmc);
      }
      if(state == 'close'){
        $body.addClass(rmc).removeClass(addc);
      }
    }
  };





  /********************************************************************************
   * Song/Artist helpers
   ********************************************************************************/


  /**
   * For a given song returns the type and id to use when dealing with the player
   * @param song
   *  assumes songid is file
   * @return {type, id}
   */
  app.helpers.getSongKey = function(song){
    var o = {
      type: (song.songid == 'file' || typeof song.songid == 'undefined' ? 'file' : 'songid')
    };
    o.id = (o.type == 'file' ? song.file : song.songid);
    return o;
  };


  /**
   * A song has artists and artist ids as an array, this parses them into links
   * @param item
   * assumes artist and artistid are properties and arrays
   */
  app.helpers.parseArtistsArray = function(item){
    var meta = [], str;
    for(var i in item.artist){ //each artist in item

      if(item.artistid !== undefined){ //artist id found
        str = '<a href="#artist/' + item.artistid[i] + '">' + item.artist[i] + '</a>';
      } else { //if no artist ids found
        str = item.artist[i];
      }
      meta.push(str);
    }
    return meta.join(', '); //out as a string
  };


  app.helpers.parseArtistSummary = function(data){
    var totals = {songs:0,albums:0,time:0};
    for(var i in data.models){
      totals.albums++;
      for(var s in data.models[i].attributes.songs){
        totals.songs++;
        totals.time = totals.time + parseInt(data.models[i].attributes.songs[s].attributes.duration);
      }
    }

    var meta = [];
    meta.push( totals.songs + ' Songs' );
    meta.push( totals.albums + ' Albums' );
    meta.push( Math.floor( (totals.time / 60) ) + ' Mins' );

    return meta.join('<br />');
  };


  /********************************************************************************
   * Pagination
   *  @todo move to pager helper
   ********************************************************************************/

  /**
   * Give it a pagenumber and it will build return a range object suitable for a API request
   *
   * @param pageNum
   * @returns {{start: number, end: number}}
   */
  app.helpers.createPaginationRange = function(pageNum, fullRange){
    // Do some maths
    var page = (pageNum !== undefined ? parseInt(pageNum) : 0),
      start = (page * app.itemsPerPage),
      end = (start + app.itemsPerPage);
    // override if fullRange
    if(fullRange && fullRange === true){
      start = 0;
    }
    // Return the range
    return {'end': end, 'start': start};
  };


  /**
   * Give it a pagenumber and it will build return a range object suitable for a API request
   *
   * @param pageNum
   * @returns {{start: number, end: number}}
   */
  app.helpers.createPaginationRange = function(pageNum, fullRange){
    // Do some maths
    var page = (pageNum !== undefined ? parseInt(pageNum) : 0),
      start = (page * app.itemsPerPage),
      end = (start + app.itemsPerPage);
    // override if fullRange
    if(fullRange && fullRange === true){
      start = 0;
    }
    // Return the range
    return {'end': end, 'start': start};
  };

  /**
   * create sort obj from url params
   * @returns {{order: string, method: string}}
   */
  app.helpers.getSort = function(){
    // get sort params
    var sort = app.helpers.arg(3),
      sortAr = sort.split(':'),
      ret = {};

    if(sort === '' || sortAr.length != 2){
      ret.method = 'title';
      ret.order = 'ascending';
    } else {
      ret.method = sortAr[0];
      ret.order = sortAr[1];
    }
    ret.ignorearticle = true;
    return ret;
  };


  /**
   * create sort obj from url params
   * @returns {{order: string, method: string}}
   */
  app.helpers.getSortParams = function(){
    var sort = app.helpers.getSort();
    return sort.method + ':' + sort.order;
  };

  /********************************************************************************
   * Backstretch
   ********************************************************************************/


  /**
   * Detect browser - Only use for extreme cases
   * cred: http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
   *
   * @returns {string}
   *  browser name, or other for no match
   */
   app.helpers.getBrowser = function(){
     var browser = 'other';
     if(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0){
       browser = 'opera';
     } else if(typeof InstallTrigger !== 'undefined'){
       browser = 'firefox';
     } else if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0){
       browser = 'safari';
     } else if(!!window.chrome && browser != 'opera'){
       browser = 'chrome';
     } else if(/*@cc_on!@*/false || !!document.documentMode){
       browser = 'ie';
     }
     return browser;
   };



  /********************************************************************************
   * Backstretch
   ********************************************************************************/


  /**
   * Add / update backstretch if required
   *
   * @param fanart
   *  The image to use
   * @param player
   * local or xbmc
   */
  app.helpers.applyBackstretch = function(fanart, player){
    // Ensure on homepage and using the correct player
    if(location.hash == '#' || location.hash === '' && app.audioStreaming.getPlayer() == player){
      // if homepage backstretch exists and changed, update
      var $bs = $('.backstretch img'),
        origImg = $bs.attr('src'),
        newImg = app.image.url(fanart, 'fanart');
      // if image is different
      if($bs.length > 0 && origImg != newImg){
        $.backstretch(newImg);
      }
    }
  };



  /********************************************************************************
   * Dialogs
   ********************************************************************************/


  /**
   * Wrapper for dialog box init
   * @param options
   *  http://jqueryui.com/demos/dialog/
   */
  app.helpers.dialogInit = function( options ){

    var settings = {
      autoOpen: false,
      height: "auto",
      width: 350,
      modal: true ,
      resizable: false
    };

    settings = jQuery.extend(settings, options);

    $( app.helpers.getSelector('dialog') ).dialog( settings );

  };


  /**
   * Open a Dialog window
   */
  app.helpers.dialog = function(content, options){

    var $dialog = $( app.helpers.getSelector('dialog') );

    // init dialog if required
    if(!$dialog.hasClass('ui-dialog-content')){
      app.helpers.dialogInit();
    }

    $dialog.dialog( "option", "title", " ");
    $dialog.dialog( "option", "height", "auto");
    $dialog.dialog( "option", "buttons", {});

    //set content and options
    $dialog.html(content);
    $dialog.dialog( "option", options );

    //fix scrollTo issue with dialog
    $dialog.bind( "dialogopen", function(event, ui) {
      $('.ui-widget-overlay, .ui-dialog').css('position', 'fixed');
      $('.dialog-menu a:last').addClass('last');

      // bind to enter
      $dialog.keypress(function(e) {
        if (e.keyCode == $.ui.keyCode.ENTER) {
          // look for a button with class "bind-enter" first, fallback to OK btn, fallback to none.
          var $parent = $(this).parent(),
            $enterButton = $parent.find('.bind-enter'),
            $btn = ($enterButton.length === 0 ? $parent.find('.ui-dialog-buttonpane button:first') : $enterButton);
          // if button pane exists
          if($parent.find('.ui-dialog-buttonpane button').length > 0){
            $btn.trigger("click");
          }
        }
      });
    });

    //open
    $dialog.dialog( "open" );

  };


  /**
   * Close the dialog
   */
  app.helpers.dialogClose = function(){
    $( app.helpers.getSelector('dialog') ).dialog( "close" );
  };


  /**
   * Emulates confirm() but using our dialog
   * @param msg
   *  string message to display
   * @param success
   *  function callback
   */
  app.helpers.confirm = function(msg, success){

    var opts = {
      title: 'Are you sure?',
      buttons: {
        "OK": function(){
          success();
          $( this ).dialog( "close" );
        },
        "Cancel": function() {
          $( this ).dialog( "close" );
        }
      }
    };

    app.helpers.dialog(msg, opts);
  };


  /**
   * Emulates prompt() but using our dialog
   * @param msg
   *  string message to display
   * @param success
   *  function callback
   */
  app.helpers.prompt = function(msg, success){

    var opts = {
      title: 'Prompt',
      buttons: {
        "OK": function(){
          var text = $('#promptText').val();
          if(text !== ''){
            success(text);
            $( this ).dialog( "close" );
          }
        },
        "Cancel": function() {
          $( this ).dialog( "close" );
        }
      }
    };

    msg += '<div class="form-item"><input type="text" class="form-text" id="promptText" /></div>';

    app.helpers.dialog(msg, opts);
  };


  /**
   * Simple info only, ok button to close
   *
   * @param title
   * @param msg
   */
  app.helpers.info = function(title, msg){
    var opts = {
      title: title,
      buttons: {
        "OK": function(){
          $( this ).dialog( "close" );
        }
      }
    };
    app.helpers.dialog(msg, opts);
  };


  /**
   * About Dialog
   */
  app.helpers.aboutDialog = function(){

    var opts = {
      title: 'About this thing',
      buttons: {
        "Cool!": function(){
          $( this ).dialog( "close" );
        },
        "ChangeLog": function(){
          document.location = '#xbmc/changelog';
          $( this ).dialog( "close" );
        }
      }
    };

    // load template and show dialog
    app.helpers.applyTemplate('About', app.addonData, function(msg){
      app.helpers.dialog(msg, opts);
    });

  };


  /**
   * Menu Dialog, creates a dialog that is populated with a menu structure
   */
  app.helpers.menuDialog = function(menu){

    // vars
    var $content = $('<ul class="dialog-menu dialog-menu-' + menu.key + '"></ul>'),
      $liTpl = $('<li class="item"></li>'),
      $li = {};

    // menu items
    $.each(menu.items, function(i,d){
      // build li
      $li = $liTpl.clone();
      $li.html(d.title).addClass(d.class);
      // bind
      $li.on('click', function(e){
        app.helpers.dialogClose();
        if(d.callback){
          d.callback();
        }
      });

      // append
      $content.append($li);
    });

    // init dialog
    app.helpers.dialog($content, {
      title: menu.title
    });


  };



  /********************************************************************************
   * Dropdowns
   ********************************************************************************/


  /**
   * Build a dropdown menu html with some given settings
   * @todo move to template file
   *
   * @param options
   * @returns {string}
   */
  app.helpers.makeDropdown = function(options){

    // get defaults
    var defaults = {
        key: 'untitled',
        items: [],
        pull: 'left',
        omitwrapper: false,
        buttonIcon: 'fa-ellipsis-v',
        buttonText: ''
      },
      tpl = '',
      settings = $.extend(defaults, options);

    // start build output
    if(!settings.omitwrapper){
      tpl += '<div class="' + settings.key + '-actions list-actions">';
    }
    // button
    tpl += '<button class="' + settings.key + '-menu btn dropdown-toggle" data-toggle="dropdown"> ' +
      '<i class="fa ' + settings.buttonIcon + '"></i>' + settings.buttonText + '</button>';
    // menu
    tpl += '<ul class="dropdown-menu pull-' + settings.pull + '">';
    for(var i in settings.items){
      var item = settings.items[i];
      if(item.url === undefined){
        tpl += '<li class="' + item.class + '">' + item.title + '</li>';
      } else {
        tpl += '<li><a href="' + item.url + '" class="' + item.class + '">' + item.title + '</a></li>';
      }
    }
    tpl += '</ul>';
    if(!settings.omitwrapper){
      tpl += '</div>';
    }

    // return html
    return tpl;
  };


  /**
   * Dropdown menu structures
   * @param type
   *  song, playlistShell
   *  @param model
   *   data from a model eg song.attributes
   * @returns {{}}
   */
  app.helpers.menuTemplates = function(type, model){

    var opts = {};
    switch (type){
      case 'song':
        opts = {
          title: (model.label !== undefined && model.label !== '' ? model.label : (model.album !== '' ? model.album : '')),
          key: 'song',
          omitwrapper: true,
          items: [
            {url: '#', class: 'song-custom-playlist', title: 'Add to custom playlist', callback: function(){
              // is there a songid?
              if(parseInt( model.songid ) > 0){
                app.playlists.playlistAddItems('lists', 'new', 'song', model.songid);
              } else {
                // file item
                app.playlists.saveCustomPlayListsDialog('local', [model], false, false); // no redirect
              }
            }}
          ]
        };

        // if songid add extra options
        // @todo fix this - wrap stream check instead?
        if(parseInt( model.songid ) > 0){
          opts.items.push({url: '#', class: 'song-download', title: 'Download song', callback: function(){
            app.AudioController.downloadFile(model.file, function(url){ window.location = url; });
          }});
          opts.items.push({url: '#', class: 'song-browser-play', title: 'Play in browser', callback: function(){
            if(model.songid){ app.playlists.playlistAddItems('local', 'replace', 'song', model.songid); }
          }});
        }

        break;

      // also contains callbacks
      case 'album':
        opts = {
          title: (model.album !== '' ? model.album : model.label),
          key: 'album',
          omitwrapper: true,
          items: [
            {url: '#', class: 'album-add-xbmc', title: 'Add to Kodi', callback: function(){
              app.playlists.playlistAddItems('xbmc', 'append', 'album', model.albumid);
            }},
            {url: '#', class: 'album-add-local', title: 'Play in browser', callback: function(){
              app.playlists.playlistAddItems('local', 'replace', 'album', model.albumid);
            }},
            {url: '#', class: 'album-add-lists', title: 'Save to lists', callback: function(){
              app.playlists.playlistAddItems('lists', 'new', 'album', model.albumid);
            }}
          ]
        };
        break;

      // also contains callbacks
      case 'artist':
        opts = {
          title: model.label,
          key: 'artist',
          omitwrapper: true,
          items: [
            {url: '#', class: 'artist-add-xbmc', title: 'Add to Kodi', callback: function(){
              app.playlists.playlistAddItems('xbmc', 'append', 'artist', model.artistid);
            }},
            {url: '#', class: 'artist-add-local', title: 'Play in browser', callback: function(){
              app.playlists.playlistAddItems('local', 'replace', 'artist', model.artistid);
            }},
            {url: '#', class: 'artist-add-lists', title: 'Save to lists', callback: function(){
              app.playlists.playlistAddItems('lists', 'new', 'artist', model.artistid);
            }}
          ]
        };
        break;

      // also contains callbacks
      case 'movie':
        opts = {
          title: model.label,
          key: 'movie',
          omitwrapper: true,
          items: [
            {url: '#', class: 'movie-download', title: 'Download Movie', callback: function(){
              app.AudioController.downloadFile(model.file, function(url){ window.location = url; });
            }}
          ]
        };
        break;

      case 'playlistShell':
        opts = {
          key: 'playlist',
          pull: 'right',
          items: [
            {class: 'dropdown-header', title: 'Current Playlist'},
            {url: '#', class: 'clear-playlist', title: 'Clear Playlist'},
            {url: '#', class: 'refresh-playlist', title: 'Refresh Playlist'},
            {url: '#', class: 'party-mode', title: 'Party Mode <i class="fa fa-check"></i>'},
            {class: 'dropdown-header', title: 'Audio'},
            {url: '#', class: 'save-playlist', title: 'Save Kodi Playlist'},
            {url: '#', class: 'new-custom-playlist', title: 'New Browser Playlist'}
          ]
        };
        break;

    }
    return opts;
  };


  /********************************************************************************
   * Templates
   ********************************************************************************/


  /**
   * load html templates (called @ dom ready)
   *
   * @param views
   * @param callback
   */
  app.helpers.loadTemplates = function(views, callback) {

    var deferreds = [];

    $.each(views, function(index, view) {
      if (app[view]) {
        deferreds.push($.get('tpl/' + view + '.html', function(data) {
          app[view].prototype.template = _.template(data);
        }, 'html'));
      } else {
        alert(view + " not found");
      }
    });

    $.when.apply(null, deferreds).done(callback);
  };


  /**
   * Load a single template on the fly
   *
   * @param tpl
   * @param callback
   *  callback returns the template object
   */
  app.helpers.loadTemplate = function(tpl, callback) {
    $.get('tpl/' + tpl + '.html', function(data) {
      app.tpl[tpl] = data;
      if(callback){
        callback(app.tpl[tpl]);
      }
    });
  };


  /**
   * Apply a template to data
   *
   * @param tpl
   * @param callback
   *  callback returns the template
   */
  app.helpers.applyTemplate = function(tplname, data, callback) {

    var html = '';
    if(typeof app.tpl[tplname] != 'undefined'){
      html = _.template(app.tpl[tplname],data);
      callback(html);
    } else {
      app.helpers.loadTemplate(tplname, function(tpl){
        html = _.template(tpl,data);
        callback(html);
      });
    }

  };


  /********************************************************************************
   * Infinate scroll
   ********************************************************************************/

  app.helpers.nearbottom = function(e) {
    var $window = $(window);

    var pixelsFromWindowBottomToBottom = 0 + $(document).height() - ($window.scrollTop()) - $window.height();
    var pixelsToBottom = 600;

    return (pixelsFromWindowBottomToBottom < pixelsToBottom);

  };





  /********************************************************************************
   * No namespace @todo move/rename
   ********************************************************************************/



  /**
   *  nl2br
   */
  app.nl2br = function(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  };


  /**
   * notification handler
   */
 app.notification = function(msg){
    var $notify = $('#notify');
    if(msg !== false && msg !== ''){

      $notify.find('.content').html(msg);
      $notify.removeClass('hidden').parent().removeClass('hidden');
      clearTimeout(notificationTimoutObj);
      notificationTimoutObj = setTimeout(app.notificationHide, 6000); // 8 secs?*/
    }
  };
  app.notificationHide = function(){
    $notify = $('#notify').addClass('hidden').parent().addClass('hidden');
  };


  /********************************************************************************
   * DEPRECATED @todo safe remove
   ********************************************************************************/


  /**
   * Apply a js scroll bar with default settings
   */
  app.helpers.addScrollBar = function(selector, options){

    //$('.nicescroll-rails').remove();

    scrollbarSettings = {
      cursorwidth: 8,
      cursorminheight: 37,
      touchbehavior: false,
      cursorcolor: '#606768'
    };

    settings = $.extend(scrollbarSettings, options);

  };


  /********************************************************************************
   * Storage
   ********************************************************************************/


  /**
   * Deal with app local storage
   * @type {{nameSpace: string, set: Function, get: Function}}
   */
  app.storage = {


    //Vars
    nameSpace: 'chorus::',

    /**
     * Save data in local storage
     * @param key
     * @param data
     */
    set:function(key, data){
      $.totalStorage( this.nameSpace + key, data );
    },

    /**
     * Get a value from local storage
     * @param key
     * @param defaultData
     * @returns (*)
     */
    get:function(key, defaultData){
      var t = $.totalStorage( this.nameSpace + key );
      if(t !== undefined && t !== ''){
        return t;
      } else {
        return defaultData;
      }
    }

  };

});


/********************************************************************************
 * jQuery extends
 ********************************************************************************/


/**
 * enhance jquery.attr() to return obj on empty
 * @see http://stackoverflow.com/questions/14645806/get-all-attributes-of-an-element-using-jquery
 */
(function(old) {
  $.fn.attr = function() {
    if(arguments.length === 0) {
      if(this.length === 0) {
        return null;
      }

      var obj = {};
      $.each(this[0].attributes, function() {
          obj[this.name] = this.value;
      });
      return obj;
    }

    return old.apply(this, arguments);
  };
})($.fn.attr);
