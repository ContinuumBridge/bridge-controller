
var PortalsAPI = require('./api');

Portal.Portal = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    //backend: 'appInstall',

    initialize: function() {

        var BID = Portal.getCurrentBridge().get('cbid');
        var AID = this.get('appInstall').get('app').get('cbid');

        //var cbidRegex = /\/?(BID[0-9]+)\/?(AID[0-9]+)?/;
        var cbidRegex = new RegExp("\/?(" + BID + ")\/(" + AID + ")");
        console.log('portal cbidRegex is ', cbidRegex);
        this.set('cbidRegex', cbidRegex);

        Portal.portalCollection.register(this.dispatchCallback);
    },

    getAPI: function() {
        var API = PortalsAPI;
    },

    dispatchCallback: function(message) {

        var destination = _.property('destination')(message);

        var cbidRegex = this.get('cbidRegex');
        var destMatch = destination.match(cbidRegex);

    },

}, { modelType: "portal" });

Portal.PortalCollection = QueryEngine.QueryCollection.extend({

    model: Portal.Portal,
    //backend: ''

    initialize: function() {

        this.dispatcher = new Dispatcher();

        Portal.PortalCollection.__super__.initialize.apply(this, arguments);
    },

    dispatch: function(message) {
        this.dispatcher.dispatch(message);
    },

    register: function(callback) {
        this.dispatcher.register(callback);
    }
});
