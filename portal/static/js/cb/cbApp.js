
var utils = require('./utils');

var CBApp = Marionette.Application.extend({

    initialize: function() {

        console.log('CBApp initialized');

        var self = this;

        this.dispatcher = new Dispatcher();

        //this.portals = new Portals();
    },

    dispatch: function(message) {

        console.log('dispatch message', message);

        var source = _.property('source')(message);
        var body = _.property('body')(message);

        if (source == 'portal') {

            this.dispatcher.dispatch(message);

        } else if (source == 'cb') {

            var actionTypes = {
                create: 'add',
                delete: 'delete',
                update: 'update'
            }
            var verb = _.property('verb')(body);
            var actionType = actionTypes[verb.toLowerCase()];
            var uri = _.property('resource_uri')(body);
            var resourceMatches = uri.match(Portal.filters.apiRegex);
            var itemType = utils.underscoredToCamelCase(resourceMatches[1]);
            var items = _.property('body')(body);

            var msg = {
                payload: items,
                itemType: itemType,
                actionType: actionType
            };

            this.dispatcher.dispatch(msg);

        } else if (source.match(Portal.filters.cbidRegex)) {
            // Message is from a bridge or an app on a bridge
            message.direction = "inbound";

            var destination = _.property('destination')(message);
            var destMatch = destination.match(Portal.filters.cbidRegex)
            if (destMatch) {
                if (destMatch[3]) {
                    // The address has a third cbid - maybe an app!
                    message.destination = destMatch[2] + "/" + destMatch[3];
                    Portal.portalCollection.dispatch(message);
                } else {
                    Portal.messageCollection.add(message);
                }
            }

        } else {
            console.warn('message source unrecognised', message);
        }
    },

    register: function(callback) {

        this.dispatcher.register(callback);
    },

    error: function(error) {
        // Log an error

    }
});

module.exports = CBApp;
