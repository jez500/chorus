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
      app.helpers.errorHandler('xbmc song command call: ' + command, result);
    }
  });

};