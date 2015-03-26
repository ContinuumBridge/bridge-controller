
var OriginalModel = Backbone.Deferred.Model;

var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
        if (error) error(model, resp, options);
        model.trigger('error', model, resp, options);
    };
};

var CBModel = OriginalModel.extend({

    constructor: function(attributes, options) {

        var attrs = attributes || {};
        options || (options = {});

        attrs.isGhost = attrs[ this.idAttribute ] ? false : true;

        OriginalModel.call(this, attrs, options);

        //console.log('model constructor', this.unsavedAttributes());
        this.startTracking();
        //console.log('model constructor 2', this.unsavedAttributes());
    },


    isSyncing: function() {
        // TODO make this work for counters etc.
        return !!this.get('id') == this.get('isGhost');
    },

    save: function(key, val, options) {

        var self = this;
        
        //this.set({isGhost: false}, {trackit_silent:true});
        this.set({isGhost: false});
        //this.trigger('change');

        return OriginalModel.prototype.save.apply(this, arguments).then(
            function(result) {

                console.log('Save successful', result);
                return result;
                //model.trigger('change');
            },
            function(error) {
                console.error('Save error', error);
                Portal.dispatch({
                    source: 'portal',
                    actionType: 'create',
                    itemType: 'error',
                    payload: error
                });
                self.resetAttributes();
            }
        )
    },

    fetch: function(key, val, options) {

        var self = this;
        if (this.fetched == true) return;

        return OriginalModel.prototype.fetch.apply(this, arguments).then(
            function(result) {

                console.log('Fetch result', result);
                result.model.set({'isGhost': false}, {trackit_silent:true});
                self.fetched = true;

                self.restartTracking();
                return result;
                //model.trigger('change');
            },
            function(error) {

                console.error('Fetch error', error);
                Portal.dispatch({
                    source: 'portal',
                    actionType: 'create',
                    itemType: 'error',
                    payload: error
                });
                self.resetAttributes();
            }
        )
    },

    destroy: function(options) {

        var self = this;

        self.set('isGhost', true);

        options || (options = {wait: true});

        return OriginalModel.prototype.destroy.call(this, options).then(
            function(result) {
                console.log('destroy succeeded', self);
                //Backbone.Relational.store.unregister(self);
                return result;
            },
            function(error) {
                console.log('destroy failed', self);
                self.set('isGhost', false);
                Portal.dispatch({
                    source: 'portal',
                    actionType: 'create',
                    itemType: 'error',
                    payload: error
                });
            }
        );
    },


    delete: function(options) {
        options = options ? _.clone(options) : {};
        this.stopListening();
        this.trigger('destroy', this, this.collection, options);
    },

    toJSONString: function(options) {

        // Return a string copy of the model's `attributes` object.
        var jsonAttributes = JSON.stringify(_.clone(this.attributes));
        return jsonAttributes;
    },

    toJSON: function(options) {

        var json = OriginalModel.prototype.toJSON.apply(this, arguments);
        json.cid = this.cid;
        return json;
    }
});

Backbone.Deferred.Model = CBModel;