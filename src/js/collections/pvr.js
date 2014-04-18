/**
 * A collection of recent episodes
 */
app.PvrChannelCollection = Backbone.Collection.extend({

  model: app.PvrChannel,

  sync: function(method, model, options) {

    // remove above
    app.pvr.getChannels(options.type, function(items){
      options.success(items);
    });

  }

});