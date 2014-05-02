/**
 * Handle all keyboard requests of significance
 */


/**
 * Keys allowed only after shell ready
 */
$(window).on('shellReady', function(){
  app.keymap.init();
});


/**
 * Keymap obj
 * @type {*}
 */
app.keymap = {

  /**
   * Ready for keyboard commands
   */
  init: function(){

    $(document).keydown(function(e){
      app.keymap.execute(e);
    });

  },


  /**
   * Bind key to controller / mapping
   * @param e
   */
  execute: function(e){

    // not searching
    // @todo maybe change to input:focus
    if($(e.target).is("input, textarea")){
      return;
    }

    var controller = app.xbmcController;

    switch (e.which) {
      case 37: // left
        controller.input('Left');
        break;
      case 38: // up
        controller.input('Up');
        break;
      case 39: // right
        controller.input('Right');
        break;
      case 40: // down
        controller.input('Down');
        break;
      case 8: // backspace
        controller.input('Back');
        break;
      case 13: // enter
        controller.input('Select');
        break;
      case 67: // c (context)
        controller.input('ContextMenu');
        break;
      case 107: // + (vol up)
        var volUp = app.playerState.xbmc.getNowPlaying('volume').volume + 5;
        app.AudioController.setVolume( (volUp > 100 ? 100 : Math.ceil(volUp)) );
        break;
      case 109: // - (vol down)
        var volDown = app.playerState.xbmc.getNowPlaying('volume').volume - 5;
        app.AudioController.setVolume( (volDown < 0 ? 0 : Math.floor(volDown)) );
        break;
      case 32: // spacebar (play/pause)
        app.AudioController.sendPlayerCommand('Player.PlayPause', 'toggle');
        break;
      case 88: // x (stop)
        app.xbmcController.command('Player.Stop', [app.playerState.xbmc.getNowPlaying('activePlayer')]);
        break;
      case 84: // t (toggle subtitles)
        app.VideoController.toggleSubTitle();
        break;
      case 190: // > (next)
        app.AudioController.sendPlayerCommand('Player.GoTo', 'next');
        break;
      case 188: // < (prev)
        app.AudioController.sendPlayerCommand('Player.GoTo', 'previous');
        break;
      default: // return everything else here
        return;
    }

    //success!
    e.preventDefault();
  }

};

