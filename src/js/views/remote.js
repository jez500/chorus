app.RemoteView = Backbone.View.extend({

  tagName:'div',

  className:'xbmc-remote-wrapper',

  initialize:function () {

  },

  events: {
    "click .input-button": "inputButton",
    "click .player-button": "playerButton",
    "click .power-button": "powerButton"
  },

  render:function () {

    var vars = {
      playing: false,
      item: {}
    };
    this.$el.html(this.template(vars));

    var data = app.playerState.xbmc.getNowPlaying();
    $('.playing-fanart', this.$el).css('background-image', 'url("' + app.image.url(data.item.fanart, 'fanart') + '")');

    $('.fa', this.$el).disableSelection();

    return this;
  },


  /**
   * Send Input based on the 'type' data attribute
   * @param e
   */
  inputButton:function (e) {
    var $el = $(e.target),
      type = $el.data('type');
    app.xbmcController.input(type);
  },

  /**
   * Send PlayerCommand based on the 'type' data attribute
   * @param e
   */
  playerButton:function (e) {
    var $el = $(e.target),
      type = $el.data('type'),
      data = app.playerState.xbmc.getNowPlaying();

    switch(type){
      case 'Stop':
        app.xbmcController.command('Player.Stop', [data.activePlayer]);
        break;
    }

  },

  powerButton: function(e){

    app.helpers.menuDialog( this.powerDialogItems() );

  },

  powerDialogItems: function(){

    return {
      title: 'Power Down',
      key: 'powerDown',
      omitwrapper: true,
      items: [
        {url: '#', class: 'xbmc-quit', title: 'Quit Kodi', callback: function(){
          // Quit xbmc
          app.xbmcController.command('Application.Quit');
        }},
        {url: '#', class: 'system-hibernate', title: 'Hibernate', callback: function(){
          // System Hibernate
          app.xbmcController.command('System.Hibernate');
        }},
        {url: '#', class: 'system-reboot', title: 'Reboot', callback: function(){
          // System reboot
          app.xbmcController.command('System.Reboot');
        }},
        {url: '#', class: 'system-shutdown', title: 'Shutdown', callback: function(){
          // System shutdown
          app.xbmcController.command('System.Shutdown');
        }},
        {url: '#', class: 'system-nothing', title: 'None of the above', callback: function(){
          // System nothing - close dialog
        }}

      ]
    };

  }

});