
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.AppLicenceView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'new-item',
    template: require('./templates/licence.html'),

    events: {
        //'click': 'eventWrapperClick',
        //'click #interest-button': 'interestButtonClick',
    },

    onRender : function() {

        var self = this;
    }
});

CBApp.AppLicenceListView = Marionette.CompositeView.extend({

    template: require('./templates/licenceSection.html'),
    itemView: CBApp.AppLicenceView,
    itemViewContainer: '#licence-list',

    emptyView: CBApp.ListItemLoadingView,

    onRender : function(){

    }
});
