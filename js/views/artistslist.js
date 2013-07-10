/*
 * Sidebar artist list
 */
app.AristsListView = Backbone.View.extend({

  tagName:'ul',

  className:'nav nav-list',

  initialize:function () {
    var self = this;
    this.model.on("reset", this.render, this);
    this.model.on("add", function (artist) {
      self.$el.append(new app.ArtistListItemView({model:artist}).render().el);
    });
  },

  render:function () {
    this.$el.empty();
console.log(this.models);
    _.each(this.model.models, function (artist) {
      this.$el.append(new app.ArtistListItemView({model:artist}).render().el);
    }, this);
    return this;
  }
});

app.ArtistListItemView = Backbone.View.extend({

  tagName:"li",

  className: 'artist',

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }

});



/*
 * Random Size Block view (ordering is still left to the model)
 */
app.AristsRandView = Backbone.View.extend({

  tagName:'ul',

  className:'random-block',

  initialize:function () {



    var self = this;
    this.model.on("reset", this.render, this);
    this.model.on("add", function (artist) {
      self.$el.append(new app.ArtistLargeItemView({model:artist}).render().el);
    });
  },

  render:function () {
    this.$el.empty();
    console.log(this.model);
    _.each(this.model.models, function (artist) {
      this.$el.append(new app.ArtistLargeItemView({model:artist}).render().el);
    }, this);


    return this;
  }
});

app.ArtistLargeItemView = Backbone.View.extend({

  tagName:"li",

  initialize:function () {
    this.model.on("change", this.render, this);
    this.model.on("destroy", this.close, this);
  },

  render:function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }

});


