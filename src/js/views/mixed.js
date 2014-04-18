/**
 * A mixed view lists collections of different entities.
 * it is used in search results and thumbs up
 *
 * @type {*|void|extend|Object|extend|extend}
 */


app.MixedView = Backbone.View.extend({

  tagName:'div',

  className:'mixed-wrapper',

  entities: ['artist', 'album', 'song', 'movie', 'tvshow'],


  initialize:function () {

  },

  events: {

  },

  render:function () {

    var self = this,
      key = self.model.key,
      $page = $('<div class="' + key + '-page mixed-page ' + key + '-results-content"></div>'),
      pane = '';

    // add a pane fore each entity
    $.each(this.entities, function(i,type){
      var domId = key + '-' + type + 's';

      // don't add a pane if no callback or el exists
      if(self.model.callbacks[type] !== undefined){

        // create pane and add loading heading
        pane = '<div class="mixed-pane mixed-pane-' + i + '" id="' + domId + '">' +
          self.getHeading(type, 'Looking for ' + type + 's', 'loading') + '</div>';

        // append to page
        $page.append( pane );

        // kick off callback
        var callback = self.model.callbacks[type];
        callback();
      }

    });

    // this is where we move no-results
    $page.append( '<div id="' + key + '-bottom"></div>' );

    this.$el.html($page);

    return this;
  },

  /**
   * Wrapper to set callbacks
   * @param callbacks
   */
  setCallbacks: function(callbacks){
    this.model.callbacks = callbacks;
  },

  /**
   * Add key if it doesn't exist
   * @param entity
   */
  addEntity: function(entity){
    if( $.inArray( entity, this.entities ) == -1 ){
      this.entities.push(entity);
    }
  },

  /**
   * Add key if it doesn't exist
   * @param entity
   */
  setEntities: function(entities){
    this.model.entities = entities;
  },

  /**
   * Render a single pane
   *
   * @param type
   * @param collection
   * @param viewName
   */
  renderPane: function(type, collection, viewName){

    var self = this,
      key = self.model.key,
      $el = $('#' + key + '-' + type + 's');

    // empty our pane
    $el.empty();

    if(collection.models.length === 0){

      // no result
      this.noResult(type);

    } else {

      // heading
      $el.html( this.getHeading(type, type + 's', 'has-results') );

      // render view to content
      var v =  new app[viewName]({model: collection, className: type + '-' + key + '-list ' + type + '-list'});
      $el.append( v.render().$el );

      // lazy load force
      this.lazyLoadImages($el);

    }

  },


  /**
   * No results
   * @param type
   */
  noResult: function(type){
    if($('.' + type + '-type-heading').length === 0){
      // add no results to bottom pane
      $('#' + this.model.key + '-bottom')
        .append( this.getHeading(type, 'No ' + type + ' matches', 'no-result') );
    }

    // empty top result
    $('#' + this.model.key + '-' + type + 's').empty();
  },


  /**
   * Heading creator
   * @param type
   * @param text
   * @param classes
   * @returns {string}
   */
  getHeading: function(type, text, classes){
    return '<h3 class="' + type + '-type-heading ' + this.model.key + '-heading entity-heading ' + classes + '">' + app.image.getIcon(type, true) + text + '</h3>';
  },


  /**
   * Force Lazy loading images
   */
  lazyLoadImages: function($el){
    $('img.content-lazy').each(function(i,d){
      $d = $(d);
      if($d.data('original') !== ''){
        $d.attr('src', $d.data('original'));
      }
    });
  }


});