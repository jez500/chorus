app.ArtistsView = Backbone.View.extend({

  initialize: function () {
  },


  render:function () {
    this.$el.html(this.template());



    // get artists list
    this.artistsList = new app.ArtistCollection();
    this.artistsList.fetch({success: function(data){
      this.artistsListView = new app.AristsListView({model: data, className: 'artist-list swiper-wrapper'});
      $('#sidebar-first', this.el).html(this.artistsListView.render().el);
    }});

    // get artists page
    this.artistsRand = new app.ArtistCollection();
    this.artistsRand.fetch({type: "rand", success: function(data){

      //render the artists page
      this.artistsRandView = new app.AristsRandView({model: data, className: 'rand-list'});
      $('#main-content').html(this.artistsRandView.render().el);



      //add scroll
      app.helpers.addScrollBar('ul.artist-list');

      //add isotope
      app.helpers.addIsotope('ul.rand-list');
    }});


      //this.artistsListView = new app.AristsListView({model: this.artistsList, className: 'artist-list'});


    return this;
  }

});

