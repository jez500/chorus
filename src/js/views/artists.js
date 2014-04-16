app.ArtistsView = Backbone.View.extend({

  initialize: function () {


  },


  render:function () {
    this.$el.html(this.template());

    this.renderSidebar();

    // get artists page
    this.artistsRand = new app.ArtistCollection();
    this.artistsRand.fetch({type: "rand", success: function(data){

      //render the artists page
      this.artistsRandView = new app.AristsRandView({model: data, className: 'rand-list'});
      $('#main-content').html(this.artistsRandView.render().el);

      //add isotope
      app.image.addFreewall('ul.rand-list');
    }});


      //this.artistsListView = new app.AristsListView({model: this.artistsList, className: 'artist-list'});


    return this;
  },


  /**
   * Render first sidebar (artist scroller)
   */
  renderSidebar:function(){

    // if no existing artist list (don't re-render if not required)
    if($('.artist-list .artist').length === 0){

      // get artists list
      this.artistsList = new app.ArtistCollection();
      this.artistsList.fetch({success: function(data){
        this.artistsListView = new app.AristsListView({model: data, className: 'artist-list swiper-wrapper'});
        app.helpers.setFirstSidebarContent(this.artistsListView.render().el);

      }});

    }

  }

});

