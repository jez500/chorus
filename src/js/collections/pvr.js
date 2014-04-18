/**
 * A collection of recent episodes
 */
app.PvrChannelCollection = Backbone.Collection.extend({

  model: app.PvrChannel,

  sync: function(method, model, options) {

    var items = [{
      "thumbnail": '',
      "channeltype": 'tv',
      "hidden": null,
      "locked": null,
      "channel": 'TEN',
      "lastplayed": null,
      "channelid": 10
    },{
      "thumbnail": '',
      "channeltype": 'tv',
      "hidden": null,
      "locked": null,
      "channel": 'TEN11',
      "lastplayed": null,
      "channelid": 11
    },{
      "thumbnail": '',
      "channeltype": 'tv',
      "hidden": null,
      "locked": null,
      "channel": 'TEN',
      "lastplayed": null,
      "channelid": 12
    },{
      "thumbnail": '',
      "channeltype": 'tv',
      "hidden": null,
      "locked": null,
      "channel": 'TEN22',
      "lastplayed": null,
      "channelid": 13
    }];

    options.success(items);

    return;

//    // remove above
//    app.pvr.getChannels(options.type, function(items){
//      options.success(items);
//    });

  }

});