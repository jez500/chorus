/*
 *  This is bunch of generic helper utils to keep basic logic out of the main app
 */


/*
 * what our setTimeout is attached to
 */
var notificationTimoutObj = {};

/*
 * Dom ready
 */
$(document).ready(function(){

  app.helpers = {};
  app.helpers.scroller = {};


  /**
   * Convert seconds to time
   */
  app.helpers.secToTime = function(totalSec){
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;

    // return a string with zeros only when we need em
    return (hours > 0 ? hours + ":" : "") + //hours
      (minutes > 0 ? (hours > 0 && minutes < 10 ? "0" + minutes : minutes) + ":" : (hours > 0 ? "00:" : "")) + //mins
      (seconds  < 10 ? "0" + seconds : seconds); //seconds
  };


 /**
  * wrapper for if ! undefined (seem to use it a bit)
  */
  app.helpers.exists = function(data){
    return (typeof data != 'undefined');
  };


  /**
  * Error handler
  * @param type
  *  type of error, any kind of string
  * @param error
   * error object
  */
  app.helpers.errorHandler = function(type, error){
    console.log('%c Bam! Error occurred (' + type + ')', app.helpers.consoleStyle(4), error);
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

    if(typeof style != undefined){
      defaults = $.extend(defaults, mods[style]);
    }

    for(prop in defaults){
      styles.push(prop + ': ' + defaults[prop]);
    }

    return styles.join('; ');
  };



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
    return (typeof app.vars[name] != undefined ? app.vars[name] : fallback);
  };


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



  app.helpers.addIsotope = function(selector){
    // removed
  };


  /**
   * Populate the first sidebar
   */
  app.helpers.setFirstSidebarContent = function(content){
    // ensure sidebar is visible
    app.helpers.toggleSidebar('open');
    var $sidebarFirst = $('#sidebar-first'),
        $container = $(".sidebar-content", $sidebarFirst);

    // add the content
    $container.html(content);

    // trigger lazyload
    $("img.lazy").lazyload({
      effect : "fadeIn",
      container: $container
    });
    $container.trigger('scroll');
  };


  /**
   * Get the first sidebar
   */
  app.helpers.getFirstSidebarContent = function(){

    // ensure sidebar is visible
    app.helpers.toggleSidebar('open');

    var $sidebarFirst = $('#sidebar-first');
    return $(".sidebar-content", $sidebarFirst);

  };


  /**
   * Toggle sidebar
   * @param state
   *  optional: if not set will toggle, else 'open' or 'close'
   */
  app.helpers.toggleSidebar = function(state){
    var addc = 'sidebar', rmc = 'no-sidebar', $body = $('body');
    if(typeof state == undefined){
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

  /**
   * Get default image
   */
  app.helpers.getDefaultImage = function(type){

    // @TODO move elsewhere
    var files = [
      'wallpaper-443657.jpg',
      'wallpaper-45040.jpg',
      'wallpaper-765190.jpg',
      'wallpaper-84050.jpg'
    ],
    random = files[app.helpers.getRandomInt(0, (files.length - 1))];

    // return random
    return 'theme/images/fanart_default/' + random;

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
   * A song has artists and artist ids as an array, this parses them into links
   * @param item
   * assumes artist and artistid are properties and arrays
   */
  app.helpers.parseArtistsArray = function(item){
    var meta = [], str;
    for(i in item.artist){ //each artist in item

      if(item.artistid != undefined){ //artist id found
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
    for(i in data.models){
      totals.albums++;
      for(s in data.models[i].attributes.songs){
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


  /* Alphabetical sort callback */
  app.helpers.aphabeticalSort = function(a,b){
    var nameA=a.toLowerCase(), nameB=b.toLowerCase();
    if (nameA < nameB){ //sort string ascending
      return -1;
    }
    if (nameA > nameB){
      return 1;
    }
    return 0; //default return value (no sorting)
  };

  /* is a value an int */
  app.helpers.isInt = function(value){
    if(app.helpers.exists(value)){
      return ((parseFloat(value) == parseInt(value)) && !isNaN(value));
    }
    return false;
  };


  /**
   * Wrapper for setting page title
   * @param value
   * @param options
   * @returns {boolean}
   */
  app.helpers.setTitle = function(value, options){
    var defaults = {
      addATag: false
    };

    var settings = $.extend(defaults,options),
      $title = $('#title');

    if(settings.addATag){
      value = '<a>' + value + '</a>'
    }

    // default
    $title.html(value);
  };

  /**
   * Wrapper for getting page title
   */
  app.helpers.getTitle = function(){
    return $('#title');
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




  /*
  * @TODO! refactor/fix namespace for below functions to use app.helpers, need to check all code for usage
  */


  // load html templates (called @ dom ready)
  app.loadTemplates = function(views, callback) {

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


  // returns a url to the image
  app.parseImage = function(rawPath, type){
    type = (typeof type == 'undefined' ? 'default' : type);
    //no image, return placeholder
    if(typeof(rawPath) == "undefined" || rawPath == ''){
      if(type == 'fanart'){
        return app.helpers.getDefaultImage(type);
      }
      return app.helpers.varGet('defaultImage');
    }
    return '/image/' + encodeURIComponent(rawPath);
  };

  // nl2br?
  app.nl2br = function(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  };

  // notification handler
  app.notification = function(msg){
    var $notify = $('#notify');
    if(msg !== false && msg != ''){

      $notify.find('.content').html(msg);
      $notify.removeClass('hidden');
      clearTimeout(notificationTimoutObj);
      notificationTimoutObj = setTimeout(app.notificationHide, 6000); // 8 secs?*/
    }
  };

  app.notificationHide = function(){
    $notify = $('#notify').addClass('hidden');
  };



  /**
   * Deal with app local storage
   * @type {{nameSpace: string, set: Function, get: Function}}
   */
  app.storage = {

    /**
     * Vars
     */
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
      if(t != undefined && t != ''){
        return t;
      } else {
        return defaultData;
      }
    }

  };

});

