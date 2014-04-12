
app.image = {



  /**
   * Gets a random fanart from a collection of models (with fanart)
   *
   * @param models
   *  collection
   * @returns {*|jQuery|HTMLElement}
   *  renderable element
   */
  getFanartFromCollection: function(models){

    var self = this, m, arts = [],
      $art = $('<div />', {id: 'art', class: 'content-fanart'});

    $.each(models.models, function(i,d){
      m = d.attributes;
      if(m.fanart !== ''){
        arts.push(m);
      }
    });

    if(arts.length > 0){
      arts = app.helpers.shuffle(arts);
      $art.append($('<img />', {src: app.parseImage(arts[0].fanart)}));
    }

    $('#content').prepend($art);
    return $art;

  }

};