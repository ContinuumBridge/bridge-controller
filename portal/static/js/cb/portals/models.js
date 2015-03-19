
var PortalsAPI = require('./api');
var SwarmStream = require('../swarm/stream');
var SwarmApp = require('../swarm/app');

var Switch = require('../swarm/models').Switch;

Portal.Portal = Backbone.Deferred.Model.extend({

    idAttribute: 'id',

    //backend: 'appInstall',

    initialize: function() {

        var self = this;

        var BID = Portal.getCurrentBridge().get('cbid');
        var AID = this.get('appInstall').get('app').get('cbid');
        this.set('cbid', BID + '/' + AID);

        var cbidRegex = new RegExp("\/?(" + BID + ")\/(" + AID + ")");
        this.set('cbidRegex', cbidRegex);

        Portal.portalCollection.register(function(msg) { self.inboundCallback(self, msg) });

        //this.api = this.getAPI();
    },

    getAPI: function() {
        var API = PortalsAPI.getAPI();
        var CB = API.CB = new PortalsAPI.Socket(this.outboundCallback);
        this.dispatcher = CB.dispatcher;
        return API;
    },

    getSwarm: function() {

        //var cbid = this.get('cbid');
        var CB = new PortalsAPI.Socket(this.outboundCallback);
        this.inboundSocket = CB.inboundSocket;
        this.outboundSocket = CB.outboundSocket;
        this.swarmStream = new SwarmStream(this.inboundSocket, this.outboundSocket);

        var swarmApp = new SwarmApp("BID2AID9");
        swarmApp.initSwarm(this.swarmStream);

        /*
        genericSwitch = Swarm.env.localhost.get('/Switch#1');

        genericSwitch.on('.init', function() {

            console.log('genericSwitch .init');
            if (this._version!=='!0') {
                console.log('genericSwitch init return', this._version);
                return; // FIXME default values
            }
            genericSwitch.set({
                value: false,
                symbol: '1'
            });
        });
        */

        return swarmApp;
        //swarmApp.connect(this.swarmStream);
    },

    outboundCallback: function(message) {
        // TODO sanitise the message

        // Messages sent from inside the web app
        console.log('message outbound from web app', message);

        var msg = {
            body: message,
            destination: 'CID46',
            source: 'UID1/BID2/AID9'// + this.get('cbid')
        }

        Portal.socket.publish(msg);
    },

    inboundCallback: function(self, message) {

        //console.log('portal dispatch callback got message', message);
        var destination = _.property('destination')(message);

        var cbidRegex = self.get('cbidRegex');
        //console.log('portal cbidRegex', cbidRegex);
        var destMatch = destination.match(cbidRegex);
        //console.log('portal destMatch', destMatch);
        if (destMatch && destMatch[2]) {
            console.log('portal', cbidRegex, 'got message', message);
            var body = _.property('body')(message);
            var swarm = _.property('swarm')(body);

            if (swarm) {
                this.inboundSocket.trigger('data', swarm);
            }
            /*
            if (resource) {
                //console.log('sending to portal dispatcher', cbidRegex, body);
                //this.dispatcher.dispatch(body);
                this.inboundSocket.trigger('data', message);
            } else {
                //console.log('sending to inbound socket', message);
                this.inboundSocket.trigger('message', message);
            }
            */
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
