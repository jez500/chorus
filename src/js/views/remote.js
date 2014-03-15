app.RemoteView = Backbone.View.extend({

  tagName:'div',

  className:'xbmc-remote-wrapper',

  initialize:function () {

  },

  events: {
    "click .input-button": "inputButton",
    "click .player-button": "playerButton"
  },

  render:function () {

    var vars = {
      playing: false,
      item: {}
    };
    this.$el.html(this.template(vars));

    var data = app.cached.nowPlaying;
    if(data !== undefined && data.item !== undefined  && data.item.fanart !== undefined){
      $('.playing-fanart', this.$el).css('background-image', 'url("' + app.parseImage(data.item.fanart, 'fanart') + '")');
    }

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
      type = $el.data('type');

    switch(type){
      case 'Stop':
        app.xbmcController.command('Player.Stop', [app.cached.nowPlaying.activePlayer]);
        break;
    }

  }

});