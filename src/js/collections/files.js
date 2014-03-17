
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
      } else if(options.name == 'addons'){
        // Get addons
        this.getAddonSources(options.success);
      } else {
        // Get Dir
        this.getDirectory(options.name, options.success);
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

      // run second lot
      app.xbmcController.multipleCommand(commands, function(res){
        ret = [];
        ret = ret.concat(self.parseData(res[0].result.sources));
        ret = ret.concat(self.parseData(res[1].result.sources));
        ret = ret.concat(self.parseData(addonsResult));
        callback(ret);
      });

    });
  },

  //get addon sources
  getAddonSources:function(callback){
    app.addOns.getSources(callback);
  },

  getDirectory: function(dir, callback){
    var self = this;

    app.xbmcController.command('Files.GetDirectory', [dir, 'music', app.fileFields,  {"method": "title", "order": "ascending"}], function(res){

      var files = self.parseData(res.result.files);

      callback(files);

    });

  },

  /**
   * adds a title if missing, sorts and thumb defaults
   * @param models
   * @returns {*}
   */
  parseData: function(models){
    for(var i in models){

      if(typeof models[i].filetype == 'undefined' || models[i].filetype === ''){
        models[i].filetype = 'directory';
      }

      if(typeof models[i].id == 'undefined' || models[i].id === 0){
        models[i].id = models[i].file;
      }

      if(models[i].filetype == 'directory'){
        models[i].title = models[i].label;
      } else {
        models[i].type = 'file';
      }

      if(typeof models[i].title == 'undefined' || models[i].title === ''){
        models[i].title = models[i].label;
      }

      if(typeof models[i].thumbnail == 'undefined'){
        models[i].thumbnail = '';
      }

      // let addons tinker
      models[i] = app.addOns.invokeAll('parseFileRecord', models[i]);
    }

    return models;
  }

});

