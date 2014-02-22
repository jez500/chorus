

/********************************************************************************
 * Handles all non library calls to xbmc
 ********************************************************************************/


$.jsonRPC.setup({
  endPoint: app.jsonRpcUrl
});


app.xbmcController = {};

/**
 * Generic command
 * @param command
 * @param options
 * @param callback
 */
app.xbmcController.command = function(command, options, callback, errorCallback){

  $.jsonRPC.request(command, {
    params: options,
    success: function(result) {
      if(callback){
        callback(result);
      }
    },
    error: function(result) {
      app.helpers.errorHandler('xbmc command call: ' + command, [result, options]);
      if(errorCallback){
        errorCallback([result, options])
      }
    }
  });

};


/**
 * Generic command
 * @param commands
 * @param callback
 */
app.xbmcController.multipleCommand = function(commands, callback){

  $.jsonRPC.batchRequest(commands, {
    success: function(result) {
      for(i in result){
        if(typeof result[i].error != 'undefined'){
          // suppress errors unless required
          //console.log(result, commands[i]);
          //app.helpers.errorHandler('xbmc multiple command call: ' + i, [result[i], commands[i]]);
        }
      }
      if(callback){
        callback(result);
      }
    },
    error: function(result) {
      // suppress errors unless required
      //app.helpers.errorHandler('xbmc multiple command call', [result, commands]);
    }
  });

};


