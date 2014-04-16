/**
 *
 * Persistent UI settings (stored in local storage)
 *
 */
app.settings = {

  settingsKey: 'settings',

  /**
   * Default settings structure, not required really but lets us know what is in use
   */
  defaultSettings: {
    init: true,
    basePath: '/',
    hideWatched: false,
    lastPlayer: 'xbmc',
    movieSort: 'title:ascending'
  },

  /**
   * Set a setting
   * @param key
   * @param value
   * @returns {*}
   */
  set: function(key, value){
    var s = app.settings.allSettings();
    s[key] = value;
    app.storageController.setStorage(app.settings.settingsKey, s);
    return value;
  },

  /**
   * Get a setting
   * @param key
   * @param defaultValue
   * @returns {*}
   */
  get: function(key, defaultValue){
    var s = app.settings.allSettings();
    if(s[key] !== undefined){
      return s[key];
    } else {
      return defaultValue;
    }
  },

  /**
   * Get all settings
   * @returns {*}
   */
  allSettings: function(){
    var s = app.storageController.getStorage(app.settings.settingsKey);
    // never initialised, create structure
    if(s === null || s.init === undefined){
      app.storageController.setStorage(app.settings.settingsKey, app.settings.defaultSettings);
      return app.settings.defaultSettings;
    }
    // return storage
    return s;
  }



};