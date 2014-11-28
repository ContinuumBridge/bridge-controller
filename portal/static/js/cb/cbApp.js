
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

    dispatchItems: function(items, itemType, actionType) {

        var self = this;

        var dispatchItem = function(item, actionType) {
            var payload = {
                item: item,
                itemType: itemType,
                actionType: actionType
            };
            self.dispatcher.dispatch(payload);
        }

        if (items instanceof Array) {
            _.each(items, function(item) {
                dispatchItem(item, actionType)
            });
        } else {
            dispatchItem(items, actionType);
        }
    },

    dispatch: function(message) {

        var source = _.property('source')(message);
        var body = _.property('body')(message);

        if (source == 'portal') {

            this.dispatcher.dispatch(message);

        } else if (source == 'cb') {

            var actionTypes = {
                create: 'add',
                delete: 'remove',
                update: 'modify'
            }
            var verb = _.property('verb')(body);
            var actionType = actionTypes[verb.toLowerCase()];
            var items = _.property('body')(body);

            this.dispatchItems(items, actionType);

        } else if (source.match(/BID([0-9])+\/?\w+/g)) {
            // Message is from a bridge or an app on a bridge
            console.log('Received message from ', source, message);

        } else {
            console.warn('message source unrecognised', message);
        }

        this.dispatcher.dispatch(message);
    },

    register: function(callback) {

        this.dispatcher.register(callback);
    }
});

module.exports = CBApp;
