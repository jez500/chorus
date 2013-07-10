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

  /*
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


 /*
  * wrapper for if ! undefined (seem to use it a bit)
  */
  app.helpers.exists = function(data){
    return (typeof data != 'undefined');
  };


  /*
  * Error handler
  * @param type
  *  type of error, any kind of string
  * @param error
   * error object
  */
  app.helpers.errorHandler = function(type, error){
    console.log('Bam! Error occurred (' + type + ')', error);
  };


  /**
   * Apply a js scroll bar with default settings
   */
  app.helpers.scrollbarSettings = {
    cursorwidth: 8,
    cursorminheight: 37,
    touchbehavior: false,
    cursorcolor: '#606768'
  };

  app.helpers.addScrollBar = function(selector, options){

    //$('.nicescroll-rails').remove();

    settings = $.extend(app.helpers.scrollbarSettings, options);

  };



  app.helpers.addIsotope = function(selector){
    //isotope
    var $container = $(selector),
        $items = $container.find('li');

    // add randomish size classes
    $items.each(function(i,data){
      if(i == 1 || i == 8 || i == 20){
        $(data).addClass('width2');
      }
    });

    $container.isotope({
      // options
      itemSelector : 'li',
      layoutMode : 'masonry'
    });
  };


  /**
   * Populate the first sidebar
   */
  app.helpers.setFirstSidebarContent = function(content){
    // ensure sidebar is visible
    $('body').addClass('sidebar').removeClass('no-sidebar');
    // add the content
    $('#sidebar-first .sidebar-content').html(content);

  };

  /**
   * A song has artists and artist ids as an array, this parses them into links
   * @param item
   * assumes artist and artistid are properties and arrays
   */
  app.helpers.parseArtistsArray = function(item){
    var meta = [];
    for(i in item.artist){
      meta.push('<a href="#artist/' + item.artistid[i] + '">' + item.artist[i] + '</a>');
    }
    return meta.join(', ');
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
    console.log('totals',totals);

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
  app.parseImage = function(rawPath){
    //no image, return placeholder
    if(typeof(rawPath) == "undefined" || rawPath == ''){
      return 'theme/images/default.png';
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


});

