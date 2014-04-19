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
      case 67: // c
        controller.input('ContextMenu');
        break;
      default:
        return;
    }

    //success!
    e.preventDefault();
  }

};

