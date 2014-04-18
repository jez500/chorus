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
    app.helpers.setTitle('Loading', { addATag: '#', icon: 'refresh'});

  }

};