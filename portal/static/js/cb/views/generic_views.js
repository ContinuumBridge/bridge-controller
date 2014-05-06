
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.ListItemLoadingView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'spinner',
    template: require('./templates/listItemLoading.html')
});

CBApp.ListView = Marionette.CompositeView.extend({

    showLoading: function() {


    }
})