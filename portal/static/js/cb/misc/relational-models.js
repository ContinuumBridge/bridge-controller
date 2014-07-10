



Backbone.HasOne = Backbone.HasOne.extend({

    initialize: function( opts ) {
			this.listenTo( this.instance, 'relational:change:' + this.key, this.onChange );

			var related = this.findRelated( opts );
			this.setRelated( related );


			// Notify new 'related' object of the new relation.
			_.each( this.getReverseRelations(), function( relation ) {
				relation.addRelated( this.instance, opts );
			}, this );
    },

    findRelated: function( options ) {

        var related = null;

        options = _.defaults( { parse: this.options.parse }, options );

        if ( this.keyContents instanceof this.relatedModel ) {
                related = this.keyContents;
        }
        else if ( this.keyContents || this.keyContents === 0 ) { // since 0 can be a valid `id` as well
                
                // ADDED If the keyContents are a uri, extract the id and create an object
                //console.log('ToOne keyContents', this.keyContents);
                var idArray = CBApp.filters.apiRegex.exec(this.keyContents);
                if (idArray && idArray[1]) {
                        this.keyContents = { id: idArray[1] };
                }
                //console.log('ToOne keyContents after', this.keyContents);

                //console.log('ToOne relatedModel', this.relatedModel);
                //var opts = _.defaults( { create: this.options.createModels }, options );
                // Taken from the HasMany relation
                var opts = _.extend( { merge: true }, options, { create: this.options.createModels } )
                related = this.relatedModel.findOrCreate( this.keyContents, opts );
                //console.log('ToOne related', related);

                 // ADDED Add model to initializeCollection
                var initializeCollection = this.options.initializeCollection
                //console.log('related is', related);
                //console.log('initializeCollection is', initializeCollection);
                if ( _.isString( initializeCollection ) ) {
                        initializeCollection = CBApp[initializeCollection];
                }
                if (initializeCollection instanceof Backbone.Collection) {
                        initializeCollection.add(related);
                }

                // ADDED If the model only has an id, fetch the rest of it
                if (related && related.isNew()) {
                    //console.log('ToOne isNew!');
                        related.fetch();
                }
        }

        // Nullify `keyId` if we have a related model; in case it was already part of the relation
        if ( related ) {
                this.keyId = null;
        }

        return related;
    }
});

Backbone.HasMany = Backbone.HasMany.extend({

    findRelated: function( options ) {

        var related = null;

        options = _.defaults( { parse: this.options.parse }, options );

        // Replace 'this.related' by 'this.keyContents' if it is a Backbone.Collection
        if ( this.keyContents instanceof Backbone.Collection ) {
                this._prepareCollection( this.keyContents );
                related = this.keyContents;
        }
        // Otherwise, 'this.keyContents' should be an array of related object ids.
        // Re-use the current 'this.related' if it is a Backbone.Collection; otherwise, create a new collection.
        else {
                var toAdd = [];

                _.each( this.keyContents, function( attributes ) {
                        if ( attributes instanceof this.relatedModel ) {
                                var model = attributes;
                        }
                        else {
                                //console.log('ToMany keyContents', attributes);
                                // ADDED If the keyContents are a uri, extract the id and create an object
                                var idArray = CBApp.filters.apiRegex.exec(attributes);
                                if (idArray && idArray[1]) {
                                        this.attributes = { id: idArray[1] };
                                }

                                // If `merge` is true, update models here, instead of during update.
                                model = this.relatedModel.findOrCreate( attributes,
                                        _.extend( { merge: true }, options, { create: this.options.createModels } )
                                );

                                // ADDED Add model to initializeCollection
                                var initializeCollection = this.options.initializeCollection
                                if ( _.isString( initializeCollection ) ) {
                                        initializeCollection = CBApp[initializeCollection];
                                }
                                if (initializeCollection instanceof Backbone.Collection) {
                                        initializeCollection.add(model);
                                }

                                // ADDED If the model only has an id, fetch the rest of it
                                if (model && model.isNew()) {
                                        model.fetch();
                                }
                        }

                        model && toAdd.push( model );
                }, this );

                if ( this.related instanceof Backbone.Collection ) {
                        related = this.related;
                }
                else {
                        related = this._prepareCollection();
                }

                // By now, both `merge` and `parse` will already have been executed for models if they were specified.
                // Disable them to prevent additional calls.
                related.set( toAdd, _.defaults( { merge: false, parse: false }, options ) );
        }

        // Remove entries from `keyIds` that were already part of the relation (and are thus 'unchanged')
        this.keyIds = _.difference( this.keyIds, _.pluck( related.models, 'id' ) );

        return related;
    }
});


Backbone.Collection = Backbone.Collection.extend({

    findUnique: function(attrs) {

        // Returns a model after verifying the uniqueness of the attributes
        models = this.where(attrs);
        if(models.length > 1) { console.warn(attrs, 'is not unique') }
        return models[0] || void 0;
    },

    findOrAdd: function(attributes, options) {

        options = options ? _.clone(options) : {};
        console.log('findOrAdd', attributes);
        var model = this.findUnique(attributes) ||
            new this.model(attributes, options);
        //this.create(attributes);

        this.add(model);

        return model;
    }
});

Backbone.RelationalModel = Backbone.RelationalModel.extend({

    /**
     * Initialize Relations present in this.relations; determine the type (HasOne/HasMany), then creates a new instance.
     * Invoked in the first call so 'set' (which is made from the Backbone.Model constructor).
     */
    initializeRelations: function( options ) {
        //console.log('initializeRelations was called');
        this.acquire(); // Setting up relations often also involve calls to 'set', and we only want to enter this function once
        this._relations = {};


        // Pass silent: true to suppress change events on initialisation
        options.silent = true;
        _.each( this.relations || [], function( rel ) {
            //console.log('Initialise relation', rel);
            Backbone.Relational.store.initializeRelation( this, rel, options );

            //this.trigger( 'relational:change:' + rel.key, this, value, options || {} );
            this.listenTo(this, 'all', function(event) {

                //var name = this.collection ? this.collection.backend ? this.collection.backend.name : "" : "";
                console.log('EVENT', event, ' on ', this);
            });
            //this.updateRelationToSelf(rel, options);
        }, this);

        this._isInitialized = true;
        this.release();
        this.processQueue();
    },

    relationalDestroy: function(options) {

        options = options ? _.clone(options) : {};

        var success = options.success;
        var relations = this.getRelations();
        var self = this;
        options.success = function(resp) {

            Backbone.Relational.store.unregister(self);
            /*
            _.forEach(relations, function(relation) {
                // Delete relations on other models to this model
                self.updateRelationToSelf(relation, {destroy: true});
            });
            */
            if (success) success(model, resp, options);
        }
        Backbone.RelationalModel.prototype.destroy.call(this, options);
    },

    updateRelationToSelf: function(rel, options) {

        // Get models from the relation of the this model
        var models = rel.related instanceof Backbone.Collection
            ? rel.related.models : [ rel.related ];
        if (!models[0]) {
            // Not sure why keyContents is sometimes needed
            console.log('rel.keyContents used', rel);
            models = [ rel.keyContents];
        }
            //|| rel.keyContents;

        var model;

        //console.log('Models are ', models);
        //for (i = 0; i < models.length; i++) {
        _.forEach(models, function(model) {

            // Iterate through models related to this model
            if (model) {

                //console.log('model in updateRelationsToSelf related to ', this.collection.backend.name, ' is ', model.toJSON());
                // Get the relation these related models have to this model
                var plural = rel.related instanceof Backbone.Collection ? "" : "s";
                var selfType = this.constructor.modelType + plural;
                var reverseRelation = model.get(selfType);
                console.log('selfType is', selfType, reverseRelation);
                console.log('reverseRelation key is', rel.reverseRelation.key);
                console.log('reverseRelation is', reverseRelation);
                // If there is no reverse relation, there is nothing on any of the related models to update
                if (!reverseRelation) return;

                // Get models from the relation
                var reverseModels = reverseRelation && reverseRelation instanceof Backbone.Collection
                    ? reverseRelation.models : [ reverseRelation ];

                // Find model representing this model (self) from reverse relation.
                var reverseModel = _.findWhere(reverseModels, this.toJSON());
                if (!reverseModel) {

                    console.log('this in updateRelationsToSelf', this.toJSON());
                    console.log('reverseModel', reverseModels);
                    /*
                    if (reverseModels[0]) {
                        console.log('reverseModel JSON', reverseModels[0].toJSON());
                    }
                    */
                }

                if (reverseModel) {

                    console.log('reverseModel is', reverseModel);
                    if (options && options.destroy) {
                        // Destroy the reverseModel if this model is being destroyed
                        if (reverseRelation instanceof Backbone.Collection) {
                            reverseRelation.remove(this);
                            debugger;
                        } else {
                            reverseModel.destroy();
                            debugger;
                        }
                    } else {
                        // Update the reverseModel if it exists
                        reverseModel.set(this.toJSON());
                    }
                } else {
                    // Add the model to the reverse relation
                    if (reverseRelation instanceof Backbone.Collection) {
                        console.log('updateRelationsToSelf reverseRelation is collection', reverseRelation, this);
                        reverseRelation.add(this);
                        //reverseRelation.models.push(this);
                        //console.log('model', model);
                        //console.log('rel.reverseRelation.key', rel.reverseRelation.key)
                        //model.set(rel.reverseRelation.key, this);
                        //reverseRelation.set(this);
                    } else {

                        // Use updateRelations: false here to stop the update recurring indefinitely, there is probs a better way?
                        console.log('updateRelationsToSelf reverseRelation is not a collection', reverseRelation, this);
                        var attrs = {};
                        attrs[rel.reverseRelation.key] = this;
                        model.set(attrs, {skipUpdateRelations: true});
                    }
                }
            }
        }, this);
    },

    updateRelations: function( changedAttrs, options ) {

        // ADDED If skipUpdateRelations is true, don't update relations
        //console.log('skipUpdateRelations', options.skipUpdateRelations);
        if (options && options.skipUpdateRelations) return;
        //console.log('skipUpdateRelations did not skip');

        if ( this._isInitialized && !this.isLocked() ) {
            _.each( this._relations, function( rel ) {

                /*
                // ADDED If the value is a uri, extract the id
                var idArray = CBApp.filters.apiRegex.exec(value);
                var id = (idArray && idArray[1]) ? idArray[1] : void 0;

                if (id) {

                    console.log('id is', id)
                    var reverseRelation = rel.getReverseRelations(rel.related);
                    console.log('Reverse relation is', reverseRelation);
                    var model = rel.related.get(id);
                }
                */

                if ( !changedAttrs || ( rel.keySource in changedAttrs || rel.key in changedAttrs ) ) {
                    // Fetch data in `rel.keySource` if data got set in there, or `rel.key` otherwise
                    var value = this.attributes[ rel.keySource ] || this.attributes[ rel.key ],
                        attr = changedAttrs && ( changedAttrs[ rel.keySource ] || changedAttrs[ rel.key ] );

                    //console.log('updateRelations value', value);
                    //console.log('updateRelations rel', rel.related);
                    //console.log('updateRelations comp', (rel.related !== value) );
                    // Update a relation if its value differs from this model's attributes, or it's been explicitly nullified.
                    // Which can also happen before the originally intended related model has been found (`val` is null).
                    if ( rel.related !== value || ( value === null && attr === null ) || changedAttrs ) {
                        //console.log('updateRelations after comp', (rel.related !== value) );
                        this.trigger( 'relational:change:' + rel.key, this, value, options || {} );

                        if (CBApp._isInitialized) {

                            this.updateRelationToSelf(rel);
                            /*

                            // ADDED automatically update related models
                            if (value.id) {

                                console.log('model is', model);
                            }
                            _.each(value, function (data) {
                                //console.log('data is', data);
                                /*
                                var model = rel.related.get(data.id);
                                if (model) {
                                    model.set(data);
                                } else {
                                    rel.related.add(data);
                                }
                            });
                        */
                        }
                    }
                }

                // Explicitly clear 'keySource', to prevent a leaky abstraction if 'keySource' differs from 'key'.
                if ( rel.keySource !== rel.key ) {
                    delete this.attributes[ rel.keySource ];
                }
            }, this );
        }
    }

    /*
    updateRelations: function(changedAttrs, options) {
        if ( this._isInitialized && !this.isLocked() ) {
            _.each( this._relations || [], function( rel ) {
                if ( !changedAttrs || ( rel.keySource in changedAttrs || rel.key in changedAttrs ) ) {
                    // Update from data in `rel.keySource` if set, or `rel.key` otherwise
                    var value = this.attributes[ rel.keySource ] || this.attributes[ rel.key ]
                        ,attr = changedAttrs && ( changedAttrs[ rel.keySource ] || changedAttrs[ rel.key ] );

                    if ( rel.related !== value || ( value === null && attr === null )) {
                        this.trigger( 'relational:change:' + rel.key, this, value, options || {} );

                        /*
                        // ADDED automatically update related models
                        _.each(val, function (data) {
                            console.log('data is', data);
                            var model = rel.related.get(data.id);
                            if (model) {
                                model.set(data);
                            } else {
                                rel.related.add(data);
                            }
                        });
                        */
                        /*
                    }
                }

                // Explicitly clear 'keySource', to prevent a leaky abstraction if 'keySource' differs from 'key'.
                if ( rel.keySource !== rel.key ) {
                    delete this.attributes[ rel.keySource ];
                }
            }, this );
        }
    }
    */
});