app.HomeView = Backbone.View.extend({

    events:{
        "click #logo":"showMeBtnClick"
    },

    render:function () {
        this.$el.html(this.template());
        return this;
    },

    showMeBtnClick:function (e) {

        console.log("showme");
    }

});