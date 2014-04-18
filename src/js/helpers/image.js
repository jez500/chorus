/**
 * All Image related helpers
 *
 * @type {{getFanartFromCollection: Function, triggerContentLazy: Function}}
 */

app.image = {


  /**
   * Entity Icons
   */
  icons: {
    music: 'music',
    video: 'film',
    song: 'music',
    artist: 'microphone',
    album: 'th-large',
    tvshow: 'desktop',
    movie: 'film'
  },


  /**
   * Get a generic logo/icon
   *
   * @param type
   *  entity type
   * @param tag
   *  bool, true = tag is rendered
   * @returns {string}
   *  fallback to cloud
   */
  getIcon: function(type, tag){
    tag = (tag !== undefined && tag === true);
    var ico = (this.icons[type] !== undefined ? this.icons[type] : 'cloud');
    if(tag){
      return '<i class="fa fa-' + ico + ' entity-icon"></i>';
    }
    return ico;
  },


  /**
  * Builds a url to an image from a given path, if empty returns default image
  *
  * @param rawPath
  * @param type
  * @returns {*}
  */
  url: function(rawPath, type){
    type = (typeof type == 'undefined' ? 'default' : type);
    if(type == 'space'){
      return 'theme/images/space.png';
    }
    //no image, return placeholder
    if(rawPath === undefined || rawPath === ''){
      return app.image.defaultImage(type);
    }
    // return image with correct path
    return app.settings.get('basePath', '/') + 'image/' + encodeURIComponent(rawPath);
  },


  /**
  * Default fanart
  *
  * @param type
  * @returns {string}
  */
  defaultImage: function(type){

    var img = '';
    if(type == 'fanart'){
      // @TODO move elsewhere
      var files = [
          'wallpaper-443657.jpg',
          'wallpaper-45040.jpg',
          'wallpaper-765190.jpg',
          'wallpaper-84050.jpg'
        ],
        random = files[app.helpers.getRandomInt(0, (files.length - 1))];

      // return random
      img = 'theme/images/fanart_default/' + random;
    } else {
      // return default
      img = app.helpers.varGet('defaultImage');
    }

    return img;

  },


  /**
  * Is default image
  *
  * @param img
  * image path
  * @returns {boolean}
  */
  isDefaultImage: function(img){
    return (app.helpers.varGet('defaultImage') == img);
  },


  /**
  * Gets a random fanart from a collection of models (with fanart)
  *
  * @param models
  *  collection
  * @returns {*|jQuery|HTMLElement}
  *  renderable element
  */
  getFanartFromCollection: function(models){

    var self = this, m, arts = [],
      $art = $('<div />', {id: 'art', class: 'content-fanart'});

    $art.on('click', function(){
      $(this).toggleClass('full-size');
    });

    $.each(models.models, function(i,d){
      m = d.attributes;
      if(m.fanart !== ''){
        arts.push(m);
      }
    });

    if(arts.length > 0){
      arts = app.helpers.shuffle(arts);
      $art.append($('<img />', {src: app.image.url(arts[0].fanart)}));
    }

    $('#content').prepend($art);
    return $art;

  },


  /**
  * Trigger lazyload on content items
  */
  triggerContentLazy: function(){
    _.defer(function(){
      $('#content').find('img').lazyload({threshold : 200});
      $(window).trigger('scroll');
    });
  },


  /**
  * Freewall Layout
  * @param selector
  */
  addFreewall: function(selector){
    var wall = new freewall(selector);
    wall.reset({
      selector: 'li',
      animate: false,
      cellW: 160,
      cellH: '230',
      gutterY: 15,
      gutterX: 15,
      onResize: function() {
        wall.fitWidth();
      }
    });
    wall.fitWidth();
  },


  /**
  * Freewall Poster Layout
  * @param selector
  */
  addPosterFreewall: function(selector){
    var wall = new freewall(selector);
    wall.reset({
      selector: 'li',
      animate: false,
      cellW: 170,
      cellH: '305',
      gutterY: 15,
      gutterX: 15,
      onResize: function() {
        wall.fitWidth();
      }
    });
    wall.fitWidth();
  }


};
