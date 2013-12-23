/**
 * Handles all non library calls to xbmc
 */


$.jsonRPC.setup({
  endPoint: '/jsonrpc'
});



app.xbmcController = {};

/**
 * Generic command
 * @param command
 * @param options
 * @param callback
 */
app.xbmcController.command = function(command, options, callback){

  $.jsonRPC.request(command, {
    params: options,
    success: function(result) {
      if(callback){
        callback(result);
      }
    },
    error: function(result) {
      app.helpers.errorHandler('xbmc song command call: ' + command, result, options);
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
          app.helpers.errorHandler('xbmc multiple command call: ' + i, result[i]);
        }
      }
      if(callback){
        callback(result);
      }
    },
    error: function(result) {
      app.helpers.errorHandler('xbmc multiple command call', result);
    }
  });

};


