app.ShellView = Backbone.View.extend({

    initialize: function () {
    //    this.searchResults = new app.EmployeeCollection();
   //     this.searchresultsView = new app.EmployeeListView({model: this.searchResults, className: 'dropdown-menu'});
    },

    render: function () {
        this.$el.html(this.template());
    //    $('.navbar-search', this.el).append(this.searchresultsView.render().el);
        return this;
    },

    events: {
        "keyup .search-query": "search",
        "keypress .search-query": "onkeypress",
        "click #logo": "home"
    },

    search: function (event) {
        var key = $('#searchText').val();
        this.searchResults.fetch({reset: true, data: {name: key}});
        var self = this;
        setTimeout(function () {
            $('.dropdown').addClass('open');
        });
    },

    onkeypress: function (event) {
        if (event.keyCode === 13) { // enter key pressed
            event.preventDefault();
        }
    },

    selectMenuItem: function(menuItem) {
        $('.mainnav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }


});