
var OriginalModel = Backbone.RelationalModel;

var CBModel = OriginalModel.extend({

    constructor: function(attributes, options) {

        console.log('constructor mixin', arguments);
        var args = Array.prototype.slice.call(arguments);
        console.log('constructor mixin args', args);
        var attrs = args[0] || {};
        // Set a model to be a ghost if it has not been instantiated on the server
        attrs.isGhost = attrs[ this.idAttribute ] ? false : true;
        //arguments[0] = attrs;
        console.log('constructor mixin', arguments);
        //Backbone.RelationalModel.prototype.constructor.apply(this, arguments);
        args[0] = attrs;
        OriginalModel.apply(this, args);
    }
});

Backbone.RelationalModel = CBModel;