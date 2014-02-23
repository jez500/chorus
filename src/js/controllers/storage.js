app.storageController = {
  nameSpace: 'chorusStorage:'
};


/**
 * Get storage
 */
app.storageController.getStorage = function(key, callback){
  var data = $.totalStorage(app.storageController.nameSpace + key);
  if(callback){
    callback(data);
  } else {
    return data;
  }
};


/**
 * Set storage
 */
app.storageController.setStorage = function(key, value, callback){
  var data = $.totalStorage(app.storageController.nameSpace + key, value);
  if(callback){
    callback(value);
  } else {
    return value;
  }
};




