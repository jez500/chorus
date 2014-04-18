

/**
 * Channel
 * @type {extend|*}
 */
app.PvrChannel = Backbone.Model.extend({

  initialize:function () {},
  defaults: {
    "thumbnail": null,
    "channeltype": null,
    "hidden": null,
    "locked": null,
    "channel": null,
    "lastplayed": null,
    "channelid": 0
  },

  sync: function(method, model, options) {
    if (method === "read") {

    }
  }

});
