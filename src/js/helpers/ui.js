/**
 * UI helpers
 */


app.ui = {

  setLoading: function(text, sidebar){

    // empty sidebar?
    sidebar = (sidebar !== undefined && sidebar === true);
    if(sidebar){
      app.helpers.setFirstSidebarContent('');
    }

    // content
    $('#content').html('<div class="loading-box">Loading ' + text + '</div>');

    // title
    app.ui.setTitle('Loading', { addATag: '#', icon: 'refresh'});

  },


  /**
   * Wrapper for setting page title
   *
   * @param value
   * @param options
   *   tabs = {url:title, url:title}
   *   addATag = wraps the value in an a tag
   */
  setTitle: function(value, options){
    var defaults = {
      addATag: false,
      tabs: false,
      activeTab: 0,
      subTitle: '',
      icon: false
    };

    var settings = $.extend(defaults,options),
      $title = $('#title'), ico = '';

    $title.empty();

    if(settings.icon !== false){
      ico = '<i class="fa fa-' + settings.icon + '"></i> ';
    }

    // add <a> tag if set
    if(settings.addATag){
      $title.append($('<a class="title-sub" href="' + settings.addATag + '">' + ico + value + '</a>'));
      $title.append(settings.subTitle);
    }

    // append tabs - DEPRECATED see filter.js @todo remove
    var n = 0;
    if(settings.tabs !== false){
      var $tabs = $('<div class="nav nav-tabs"></div>');
      for(var i in settings.tabs){
        var $el = $('<a href="' + i + '" class="nav-tab">' + settings.tabs[i] + '</a>');
        $tabs.append( $el );
        n++;
      }
      $title.append($tabs);
    }

    // if value not added, as that in a wrapper
    if(!settings.addATag){
      $title.append('<div class="title-main">' + ico + value + '</div>');
    }

    //cache
    app.currentPageTitle = ico + value;

  },


  /**
   * Wrapper for getting page title
   */
  getTitle: function(){
    return app.currentPageTitle;
  }

};


