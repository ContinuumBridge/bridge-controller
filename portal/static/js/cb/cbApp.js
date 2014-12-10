
var utils = require('./utils');

var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

var CBApp = Marionette.Application.extend({

    initialize: function(options) {

        var self = this;

        console.log('CBApp initialized');

    },

    setupCBIDTypes: function(cbidTypes) {

        var self = this;

        // Setup regex expressions to match CBIDs to their types
        this.cbidTypesRegex = {};
        _.each(cbidTypes, function(type, pattern) {
            self.cbidTypesRegex[self.patternToRegex(pattern)] = type;
        });
    },

    patternToRegex: function(pattern) {
        pattern = pattern.replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function (match, optional) {
                return optional ? match : '([^/?]+)';
            })
            .replace(splatParam, '([^?]*?)');
        return new RegExp('^' + pattern + '(?:\\?([\\s\\S]*))?$');
    },

    dispatch: function(message) {

        console.log('dispatch message', message);

        var source = _.property('source')(message);
        var body = _.property('body')(message);

        if (source == 'portal') {

            this.dispatcher.dispatch(message);

        } else if (source == 'cb') {

            console.log('dispatch cb message', message);

            console.log('body', body);

            var actionTypes = {
                create: 'add',
                delete: 'delete',
                update: 'update'
            }
            var verb = _.property('verb')(body);
            console.log('verb ', verb );
            var actionType = actionTypes[verb.toLowerCase()];
            console.log('actionType ', actionType );
            var uri = _.property('resource_uri')(body);
            console.log('uri ', uri );
            //var resource = resource_uri.match(/\/[\w]+\/[\w]+\/[\w]+\/([\w]+)\/?[[0-9]+]?\/?/g);
            //var resourceRegex = /\/[\w]+\/[\w]+\/[\w]+\/([\w]+)\//g;
            var resourceMatches = uri.match(Portal.filters.apiRegex);
            console.log('resourceMatches ', resourceMatches );
            //var resource = resourceRegex.exec(resourceURI);
            var itemType = utils.underscoredToCamelCase(resourceMatches[1]);
            console.log('dispatch itemType ', itemType );
            var items = _.property('body')(body);

            var msg = {
                payload: items,
                itemType: itemType,
                actionType: actionType
            };

            this.dispatcher.dispatch(msg);

            //this.dispatchItems(items, actionType);

        } else if (source.match(Portal.filters.cbidRegex)) {
            // Message is from a bridge or an app on a bridge
            console.log('Received message from ', source, message);
            message.direction = "inbound";
            Portal.messageCollection.add(message);

        } else {
            console.warn('message source unrecognised', message);
        }

        //this.dispatcher.dispatch(message);
    },

    register: function(callback) {

        this.dispatcher.register(callback);
    }
});

module.exports = CBApp;
