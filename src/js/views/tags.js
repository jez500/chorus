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
      tag.attributes.callback = this.callback;
      tag.attributes.type = this.model.type;
      this.$el.append(new app.TagItemView({model:tag}).render().el);
    }, this);

    return this;

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
    //e.preventDefault();
    var m = this.model.attributes,
      $container = $('#tag-container-' + m.id).closest('.tag-list-item');
    $container.toggleClass('open');
  }


});
