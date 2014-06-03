
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.AppLicenceView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/app.html'),

    events: {
        //'click': 'eventWrapperClick',
        //'click #interest-button': 'interestButtonClick',
    },

    onRender : function() {

        var self = this;
    }
});

CBApp.AppLicenceListView = Marionette.CompositeView.extend({

    template: require('./templates/appSection.html'),
    itemView: CBApp.AppView,
    itemViewContainer: '#app-list',

    emptyView: CBApp.ListItemLoadingView,

    onRender : function(){

    }
});
