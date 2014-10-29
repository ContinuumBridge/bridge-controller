
var _ = require('underscore')
    ,Backbone = require('backbone-bundle');

var PortalRouter = Backbone.Router.extend({

    routes: {
        'BID:b/UID:u': 'bridgeControl',
    },
    /*
        'AID[0-9]+': 'app',
        'ACID[0-9]+': 'appConnection',
        'BID[0-9]+/AID[0-9]+': 'appInstall',
        'ADPID[0-9]+': 'appDevicePermission',
        'ALID[0-9]+': 'appLicence',
        'AOID[0-9]+': 'appOwnership',
        'BID[0-9]+': 'bridge',
        'CID[0-9]+': 'client',
        'CCID[0-9]+': 'clientControl',
        'DID[0-9]+': 'device',
        'BID[0-9]+/DID[0-9]+': 'deviceInstall',
        'DDID[0-9]+': 'discoveredDevice',
        'UID[0-9]+': 'currentUser'
    */

    dispatch: function(transportMessage) {

        var collectionMessage = _.property('body')(transportMessage);
        var jsonModels = _.property('body')(collectionMessage);

        if (!jsonModels) {
            console.warn('Message received has no inner body', transportMessage);
            return;
        }
        var model = jsonModels[0] || jsonModels;

        if (!cbid) {

            var date = new Date();
            message.set('time_received', date);
            //CBApp.messageCollection.add(message);
        }
        _.any(this.handlers, function(handler) {
            if (handler.route.test(messageCBID)) {
                console.log('Matched', messageCBID)
                console.log('Callback is', handler.callback);
                //handler.callback(fragment);
                return true;
            }
        });

    }
});

var MessageRouter = module.exports.MessageRouter = Backbone.Router.extend({

    routes: {
        'broadcast': 'toPortal'
    },

    initialize: function() {

        var self = this;

        this.portalRouter = new PortalRouter();

        CBApp.getCurrentUser().then(function(currentUser) {

            var uid = currentUser.get('cbid');
            self.route(uid, "portal", self.toPortal);
            self.route(uid + '/:webapp', "webapp", self.toWebApps);
        });
    },

    toPortal: function(message, fragment) {

        console.log('Message for portal', message);
        this.portalRouter.dispatch(message);
    },

    toWebApps: function(message, webapp) {

        console.log('Message for webapp', webapp, message);
    },

    dispatch: function(transportMessage) {

        var destination = _.property('destination')(transportMessage);

        console.log('transportMessage in dispatch', transportMessage);

        //var message = new CBApp.Message(jsonMessage);

        _.any(this.handlers, function(handler) {
            if (handler.route.test(destination)) {
                console.log('Matched', destination)
                console.log('Callback is', handler.callback);
                handler.callback(transportMessage);
                return true;
            }
        });

    }
});
