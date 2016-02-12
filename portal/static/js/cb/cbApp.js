
var _ = require('underscore');
//var Marionette = require('marionette');
import Backbone from 'backbone-bundle';
//import Marionette from 'backbone.marionette';
var utils = require('./utils');

var optionalParam = /\((.*?)\)/g;
var namedParam    = /(\(\?)?:\w+/g;
var splatParam    = /\*\w+/g;
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

var CBApp = Backbone.Marionette.Application.extend({

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

        console.log('Dispatch message', message);

        var source = _.property('source')(message);
        var body = _.property('body')(message);

        if (source == 'portal') {

            this.dispatcher.dispatch(message);

        } else if (source == 'cb') {

            //console.log('dispatch cb message', message);
            //console.log('body', body);

            var actionTypes = {
                create: 'add',
                delete: 'delete',
                update: 'update'
            }
            var verb = _.property('verb')(body);
            var actionType = actionTypes[verb.toLowerCase()];

            var itemType;
            var cbid = _.property('cbid')(body);
            if (cbid) {

                var cbidMatch = cbid.match(Portal.filters.apiRegex)[1];
                if (cbidMatch[0] == 'B') {
                    itemType = "bridge";
                }

            } else {

                var uri = _.property('resource_uri')(body);
                var resourceMatches = uri.match(Portal.filters.apiRegex);
                itemType = utils.underscoredToCamelCase(resourceMatches[1]);
            }

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
            console.warn('Message source unrecognised', message);
        }

        //this.dispatcher.dispatch(message);
    },

    register: function(callback) {

        this.dispatcher.register(callback);
    },

    error: function(error) {
        // Log an error

    }
});

module.exports = CBApp;
