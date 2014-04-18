

/**
 * File
 * @type {extend|*}
 */
app.File = Backbone.Model.extend({

  initialize:function () {},
  defaults: {'filetype': '', 'size': '', 'mimetype': '', 'file': '', 'lastmodified': '', id: 0, thumbnail: ''},

  sync: function(method, model, options) {
    if (method === "read") {
      // options.success(data);
    }
  }

});
