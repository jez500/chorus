/**
 * A tags view handles lists with inline loading
 *
 * @type {*|void|extend|Object|extend|extend}
 */


app.TagsView = Backbone.View.extend({

  tagName:'div',

  className:'tag-list',

  initialize:function () {

  },

  events:{

  },

  render: function () {

    this.$el.empty();

    // append results
    _.each(this.model.models, function (tag) {
      this.$el.append(new app.TagItemView({model:tag}).render().el);
    }, this);

    this.$el.addClass('tag-type-' + this.model.type);

    return this;

  },


  renderTagItems: function(model, collectionName, viewName){

    if(model.id === undefined || model.id === ''){
      return;
    }

    var id = model.id,
      list,
      tag = model.tag,
      filter = {};

    // filter by...
    filter[tag] = parseInt(id);

    // find container
    var $el = $('#tag-container-' + id), $c = $el.parent();

    //open
    $c.addClass('open');

    // Render tag items into existing dom
    $el.html('<div class="inline-loading">Loading the ' + $c.find('.tag-label').html() + ' ' + model.type + 's...</div>');

    // get recent collection
    list = new app[collectionName]();
    list.fetch({"filter" : filter, "success": function(collection){

      // render
      var view = new app[viewName]({model: collection});
      $el.html(view.render().$el);

      // lazyload
      app.image.triggerContentLazy();

      // scroll to top
      $(window).scrollTo($c, 0, {offset: {top:-40}});

    }});
  }

});



app.TagItemView = Backbone.View.extend({

  tagName:'div',

  className:'tag-list-item',

  initialize:function () {

  },

  events:{
    "click .tag-label": "toggleItems"
  },

  render: function () {

    var m = this.model.attributes;

    this.$el.empty();

    this.$el.append($('<a />', {
      'html': m.label,
      'href': m.url,
      'class': 'tag-label' ,
      'data-id': m.id
    }));

    this.$el.append($('<div />', {
      'id': 'tag-container-' + m.id,
      'class': 'tag-container'
    }));

    return this;

  },

  toggleItems: function(e){
    var m = this.model.attributes,
      $container = $('#tag-container-' + m.id).closest('.tag-list-item');

    if($container.hasClass('open')){
      e.preventDefault();
      $container.removeClass('open');
    }

  }
});
