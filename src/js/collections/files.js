
/**
 * A collection of Artists.
 */
app.FileCollection = Backbone.Collection.extend({

  model: app.File,

  sync: function(method, model, options) {
    if (method === "read") {

      if(options.name == 'sources'){
        // Get Sources
        this.getAllSources(options.success);
      } else {
        // Get Dir
        this.getDirectory(options.sourcetype, options.name, options.success);
      }

    }
  },

  getAllSources: function(callback){
    var self = this,
      commands = [],
      ret;

    // Get Addons First
    self.getAddonSources(function(addonsResult){

      // Then get sources
      commands.push({method: 'Files.GetSources', params: ['music']});
      commands.push({method: 'Files.GetSources', params: ['video']});

      // execute commands, this is a bit rough as I insert headings as models and
      // render differently in the view
      app.xbmcController.multipleCommand(commands, function(res){
        ret = [];
        ret = ret.concat([{type: 'heading', id: 'music', filetype: 'heading'}]);
        ret = ret.concat(self.parseData(res[0].result.sources, 'music'));
        ret = ret.concat([{type: 'heading', id: 'video', filetype: 'heading'}]);
        ret = ret.concat(self.parseData(res[1].result.sources, 'video'));
        ret = ret.concat([{type: 'heading', id: 'addons', filetype: 'heading'}]);
        ret = ret.concat(addonsResult);
        callback(ret);
      });

    });
  },

  //get addon sources
  getAddonSources:function(callback){
    app.addOns.getSources(callback);
  },

  getDirectory: function(type, dir, callback){
    var self = this;

    app.xbmcController.command('Files.GetDirectory', [dir, type, app.fields.get('file'),  {"method": "title", "order": "ascending"}], function(res){

      var files = self.parseData(res.result.files, type);

      callback(files);

    });

  },

  /**
   * adds a title if missing, sorts and thumb defaults
   * @param models
   * @returns {*}
   */
  parseData: function(models, type){
    for(var i in models){
      var m = models[i];

      if(typeof m.filetype == 'undefined' || m.filetype === ''){
        m.filetype = 'directory';
      }

      if(typeof m.id == 'undefined' || m.id === 0){
        m.id = m.file;
      }

      // is dir
      if(m.filetype == 'directory'){
        m.title = m.label;
      } else {
        // is a playable item
        m[m.type + 'id'] = m.id;
      }

      if(typeof m.title == 'undefined' || m.title === ''){
        m.title = m.label;
      }

      // set controller based on type (music/video)
      m.controller = (type == 'music' ? 'AudioController' : 'VideoController');
      m.sourcetype = type;

      if(type == 'video' && m.type == 'movie'){
        m.filetype = 'file';
      }

      // if a stream
      if(m.mimetype !== undefined &&
        m.mimetype == "application/octet-stream"){
        m.type = 'stream';
      }

      // let addons tinker
      m = app.addOns.invokeAll('parseFileRecord', m);

      // set
      models[i] = m;
    }

    return models;
  }

});

