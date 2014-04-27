/**
 * Talk to the PVR
 * @type {{}}
 */

//$(window).on('shellReady', function(){
//  app.pvr.setIsEnabled(function(enabled){
//    if(enabled){
//      app.pvr.addPaths();
//    }
//  });
//});

_.defer(function(){
  app.pvr.setIsEnabled(function(enabled){
    if(enabled){
      app.pvr.addPaths();
    }
  });
});

app.pvr = {

  types: ['tv', 'radio'],

  limits: {start: 0, end: 5000},

  enabled: false,


  playChannel: function(channelid, callback){
    var params = [{channelid: channelid}];
    app.xbmcController.command('Player.Open', params, function(res){
      callback(res);
    });
  },

  /**
   * Set if pvr is enabled
   */
  setIsEnabled: function(callback){
    var params = ['xbmc.pvrclient', 'unknown', true];
    app.xbmcController.command('Addons.GetAddons', params, function(res){
      app.pvr.enabled = (res.result.addons !== undefined);
      callback(app.pvr.enabled);
    });
  },


  getAllChannels: function(group, callback){

    // lookup
    app.pvr.getChannelGroups(type, function(groups){
      $.each(groups, function(i,d){
        app.pvr.getChannels(d.id, function(channels){
          groups[i].channels = channels;
        });
      });
    });

  },

  getTypeFromPath: function(){
    var ret = {type: 'alltv', filters: 'tvshow', niceName: 'LiveTV'};
    if(app.helpers.arg(1) == 'radio'){
      // Radio
      ret = {
        type: 'allradio',
        filters: 'music',
        niceName: 'Radio'
      };
    }
    return ret;
  },


  getChannels: function(group, callback){

    // lookup
    app.xbmcController.command('PVR.GetChannels', [group, app.fields.get('channel')], function(data){
      callback(data.result.channels);
    });

  },

  getChannelGroups: function(type, callback){

    // lookup
    app.xbmcController.command('PVR.GetChannelGroups', [type], function(data){
      callback(data.result.channelgroups);
    });

  },


  addPaths: function(){
    app.filters.addFilterPath('tvshow', {
      title: 'Live TV',
      path: 'tv/live',
      key: 'live',
      argOne: 'live'
    });
    app.filters.addFilterPath('music', {
      title: 'Digital Radio',
      path: 'music/radio',
      key: 'radio',
      argOne: 'radio'
    });
  }

};