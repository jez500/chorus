app.HomeView = Backbone.View.extend({

    events:{
        "click #logo":"showMeBtnClick"
    },

    render:function () {
        this.$el.html(this.template(this.model));
        return this;
    },

    showMeBtnClick:function (e) {


    }

});