
var PortalsAPI = require('./api');

Portal.Portal = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    //backend: 'appInstall',

    initialize: function() {

        var self = this;

        var BID = Portal.getCurrentBridge().get('cbid');
        var AID = this.get('appInstall').get('app').get('cbid');

        //var cbidRegex = /\/?(BID[0-9]+)\/?(AID[0-9]+)?/;
        var cbidRegex = new RegExp("\/?(" + BID + ")\/(" + AID + ")");
        console.log('portal cbidRegex is ', cbidRegex);
        this.set('cbidRegex', cbidRegex);

        Portal.portalCollection.register(function(msg) { self.inboundCallback(self, msg) });
    },

    getAPI: function() {
        var API = PortalsAPI.getAPI();
        var CB = API.CB = new PortalsAPI.Socket(this.outboundCallback);
        this.inboundSocket = CB.inboundSocket;
        this.outboundSocket = CB.outboundSocket;
        this.dispatcher = CB.dispatcher;
        return API;
    },

    outboundCallback: function(message) {
        // TODO sanitise the message

        // Messages sent from inside the web app
        console.log('message outbound from web app', message);

        Portal.socket.publish(message);
    },

    inboundCallback: function(self, message) {

        //console.log('portal dispatch callback got message', message);
        var destination = _.property('destination')(message);

        var cbidRegex = self.get('cbidRegex');
        //console.log('portal cbidRegex', cbidRegex);
        var destMatch = destination.match(cbidRegex);
        //console.log('portal destMatch', destMatch);
        if (destMatch && destMatch[2]) {
            var body = _.property('body')(message);
            var resource = _.property('resource')(body);

            if (resource) {
                console.log('sending to portal dispatcher', cbidRegex, body);
                this.dispatcher.dispatch(body);
            } else {
                //console.log('sending to inbound socket', message);
                this.inboundSocket.trigger('message', message);
            }
        }
    }

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
