
var _ = require('underscore');
//var Backbone = window.Backbone;
(function() {

    Backbone.Store.prototype.find = function(type, item) {

        var id = this.resolveIdForItem( type, item ),
            coll = this.getCollection( type );

        // Because the found object could be of any of the type's superModel
        // types, only return it if it's actually of the type asked for.
        if ( coll ) {

            // ADDED replaced get with findWhere, get mysteriously doesn't work for updating
            // relations to an object which has just acquired an id
            var obj = coll.findWhere({id: id});
            //var obj = coll.get( id );

            if ( obj instanceof type ) {
                return obj;
            }
        }

        return null;
    }

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

            //console.log('HasOne findRelated', this.key);
            var related = null;

            options = _.defaults( { parse: this.options.parse }, options );

            if ( this.keyContents instanceof this.relatedModel ) {
                    related = this.keyContents;
            }
            else if ( this.keyContents || this.keyContents === 0 ) { // since 0 can be a valid `id` as well

                    // ADDED If the keyContents are a uri, extract the id and create an object
                    var idArray = Portal.filters.apiRegex.exec(this.keyContents);
                    if (idArray && idArray[2]) {
                            this.keyContents = { id: parseInt(idArray[2]) };
                    }

                    //var opts = _.defaults( { create: this.options.createModels }, options );
                    // Taken from the HasMany relation
                    var opts = _.extend( { merge: true }, options, { create: this.options.createModels } )
                    related = this.relatedModel.findOrCreate( this.keyContents, opts );

                     // ADDED Add model to initializeCollection
                    var initializeCollection = this.options.initializeCollection

                    if ( _.isString( initializeCollection ) ) {
                            initializeCollection = Portal[initializeCollection];
                    }
                    if (initializeCollection instanceof Backbone.Collection) {
                            initializeCollection.add(related);
                    }

                    // ADDED If the model only has an id, fetch the rest of it
                    if (related && related.isNew()) {
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

        initialize: function( opts ) {
            this.listenTo( this.instance, 'relational:change:' + this.key, this.onChange );

            // Handle a custom 'collectionType'
            this.collectionType = this.options.collectionType;
            //console.log('this.collectionType', this.collectionType);
            if ( _.isFunction( this.collectionType ) && this.collectionType !== Backbone.Collection && !( this.collectionType.prototype instanceof Backbone.Collection ) ) {
                //console.log('this.collectionType', this.collectionType);
                //this.collectionType = new this.collectionType;
                this.collectionType = _.result( this, 'collectionType' );
            }
            if ( _.isString( this.collectionType ) ) {
                this.collectionType = Backbone.Relational.store.getObjectByName( this.collectionType );
            }
            if ( this.collectionType !== Backbone.Collection && !( this.collectionType.prototype instanceof Backbone.Collection ) ) {
                throw new Error( '`collectionType` must inherit from Backbone.Collection' );
            }

            var related = this.findRelated( opts );
            this.setRelated( related );
        },

        findRelated: function( options ) {

            //console.log('HasMany findRelated', this.key);
            var related = null;

            options = _.defaults( { parse: this.options.parse }, options );

            //console.log('this.keyContents', this.keyContents);
            // ADDED Inheritance broken by webpack, check if object instead of function
            // Replace 'this.related' by 'this.keyContents' if it is a Backbone.Collection
            //if ( typeof this.keyContents == 'object') {
            if ( this.keyContents instanceof Backbone.Collection ) {

                //console.log('this.keyContents instanceof Backbone.Collection');
                this._prepareCollection( this.keyContents );
                related = this.keyContents;
            }
            // Otherwise, 'this.keyContents' should be an array of related object ids.
            // Re-use the current 'this.related' if it is a Backbone.Collection; otherwise, create a new collection.
            else {

                    var toAdd = [];

                    _.each( this.keyContents, function( attributes ) {
                            if ( attributes instanceof this.relatedModel ) {
                                    //console.log('attributes instanceof this.relatedModel');
                                    var model = attributes;
                            }
                            else {
                                    // ADDED If the keyContents are a uri, extract the id and create an object
                                    var idArray = Portal.filters.apiRegex.exec(attributes);
                                    if (idArray && idArray[2]) {
                                            attributes = { id: parseInt(idArray[2]) };
                                    }
                                    //console.log('HasMany findRelated attributes', attributes);
                                    //console.log('HasMany this.relatedModel', this.relatedModel);
                                    //console.log('_.extend( { merge: true }, options, { create: this.options.createModels } )', _.extend( { merge: true }, options, { create: this.options.createModels } ));

                                    // If `merge` is true, update models here, instead of during update.
                                    model = this.relatedModel.findOrCreate( attributes,
                                            _.extend( { merge: true }, options, { create: this.options.createModels } )
                                    );

                                    //console.log('HasMany findRelated model', model);
                                    // ADDED Add model to initializeCollection
                                    var initializeCollection = this.options.initializeCollection;
                                    if ( _.isString( initializeCollection ) ) {
                                            initializeCollection = Portal[initializeCollection];
                                    }
                                    //if (initializeCollection instanceof Backbone.Collection) {
                                    if (typeof initializeCollection == 'object') {
                                            initializeCollection.add(model);
                                    }

                                    /*
                                    // ADDED If the model only has an id, fetch the rest of it
                                    if (model && model.isNew()) {
                                            model.fetch();
                                    }
                                    */
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


    /*
    Backbone.Collection = Backbone.Collection.extend({

        findUnique: function(attrs) {
            // Returns a model after verifying the uniqueness of the attributes
            var models;
            if (attrs.id) {
                models = this.where({id: attrs.id});
            } else {
                models = this.where(attrs);
            }
            if(models.length > 1) { console.warn(attrs, 'is not unique') }
            return models[0] || void 0;
        },

        findOrAdd: function(attributes, options) {

            options = options ? _.clone(options) : {};
            var model = this.findUnique(attributes) ||
                new this.model(attributes, options);
            //this.create(attributes);

            this.add(model);

            return model;
        }
    });
    */

    Backbone.RelationalModel = Backbone.RelationalModel.extend({

        set: function( key, value, options ) {
            Backbone.Relational.eventQueue.block();

            // Duplicate backbone's behavior to allow separate key/value parameters, instead of a single 'attributes' object
            var attributes;
            if ( _.isObject( key ) || key == null ) {
                attributes = key;
                options = value;
            }
            else {
                attributes = {};
                attributes[ key ] = value;
            }

            try {
                var id = this.id,
                    newId = attributes && this.idAttribute in attributes && attributes[ this.idAttribute ];

                // Check if we're not setting a duplicate id before actually calling `set`.
                // ADDED If the ids are the same skip checking
                if(id && id != newId) Backbone.Relational.store.checkId( this, newId );

                var result = Backbone.Model.prototype.set.apply( this, arguments );

                // Ideal place to set up relations, if this is the first time we're here for this model
                if ( !this._isInitialized && !this.isLocked() ) {
                    this.constructor.initializeModelHierarchy();

                    // Only register models that have an id. A model will be registered when/if it gets an id later on.
                    if ( newId || newId === 0 ) {
                        Backbone.Relational.store.register( this );
                    }

                    this.initializeRelations( options );

                }
                // The store should know about an `id` update asap
                else if ( newId && newId !== id ) {
                    Backbone.Relational.store.update( this );
                }

                if ( attributes ) {

                    this.updateRelations( attributes, options );
                }
            }
            finally {
                // Try to run the global queue holding external events
                Backbone.Relational.eventQueue.unblock();
            }

            return result;
        },

        /**
         * Initialize Relations present in this.relations; determine the type (HasOne/HasMany), then creates a new instance.
         * Invoked in the first call so 'set' (which is made from the Backbone.Model constructor).
         */
        initializeRelations: function( options ) {

            var self = this;
            this.acquire(); // Setting up relations often also involve calls to 'set', and we only want to enter this function once
            this._relations = {};

            // Pass silent: true to suppress change events on initialisation
            options.silent = true;
            _.each( this.relations || [], function( rel ) {
                Backbone.Relational.store.initializeRelation( self, rel, options );
                //Backbone.Relational.store.initializeRelation( this, rel, options );

                //this.trigger( 'relational:change:' + rel.key, this, value, options || {} );
                /*
                this.listenTo(this, 'all', function(event) {

                    //var name = this.collection ? this.collection.backend ? this.collection.backend.name : "" : "";
                });
                */
                //this.updateRelationToSelf(rel, options);
            }, this);

            this._isInitialized = true;
            this.release();
            this.processQueue();
        },

        updateRelationToSelf: function(rel, options) {

            // Get models from the relation of the this model
            var models = rel.related instanceof Backbone.Collection
                ? rel.related.models : [ rel.related ];
            if (!models) return;

            //console.log('updateRelationToSelf rel.keyIds', rel.keyIds);
            //console.log('this.idAttribute', this.idAttribute);
            if (rel.related instanceof Backbone.Collection) rel.keyIds.push(this[this.idAttribute]);
            /*
            if (!models[0]) {
                // Not sure why keyContents is sometimes needed
                models = [ rel.keyContents];
            }
            */
                //|| rel.keyContents;

            var model;

            //for (i = 0; i < models.length; i++) {
            _.forEach(models, function(model) {

                // Iterate through models related to this model
                if (model) {

                    // Get the relation these related models have to this model
                    var plural = rel.related instanceof Backbone.Collection ? "" : "s";
                    var selfType = this.constructor.modelType + plural;
                    var reverseRelation = model.get(selfType);

                    // If there is no reverse relation, there is nothing on any of the related models to update
                    if (!reverseRelation) return;

                    // Get models from the relation
                    var reverseModels = reverseRelation && reverseRelation instanceof Backbone.Collection
                        ? reverseRelation.models : [ reverseRelation ];

                    // Find model representing this model (self) from reverse relation.
                    var reverseModel = _.findWhere(reverseModels, this.toJSON());
                    if (!reverseModel) {

                        /*
                        if (reverseModels[0]) {
                            console.log('reverseModel JSON', reverseModels[0].toJSON());
                        }
                        */
                    }

                    if (reverseModel) {

                        if (options && options.destroy) {
                            // Destroy the reverseModel if this model is being destroyed
                            if (reverseRelation instanceof Backbone.Collection) {
                                reverseRelation.remove(this);
                                //debugger;
                            } else {
                                reverseModel.destroy();
                                //debugger;
                            }
                        } else {
                            // Update the reverseModel if it exists
                            reverseModel.set(this.toJSON());
                        }
                    } else {
                        // Add the model to the reverse relation
                        if (reverseRelation instanceof Backbone.Collection) {
                            reverseRelation.add(this);
                            //reverseRelation.models.push(this);
                            //model.set(rel.reverseRelation.key, this);
                            //reverseRelation.set(this);
                        } else {

                            // Use updateRelations: false here to stop the update recurring indefinitely, there is probs a better way?
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
            if (options && options.skipUpdateRelations) return;

            if ( this._isInitialized && !this.isLocked() ) {

                var changeTriggers = [];

                _.each( this._relations, function( rel ) {

                    /*
                    // ADDED If the value is a uri, extract the id
                    var idArray = Portal.filters.apiRegex.exec(value);
                    var id = (idArray && idArray[1]) ? idArray[1] : void 0;

                    if (id) {

                        var reverseRelation = rel.getReverseRelations(rel.related);
                        var model = rel.related.get(id);
                    }
                    */

                    if ( !changedAttrs || ( rel.keySource in changedAttrs || rel.key in changedAttrs ) ) {
                        // Fetch data in `rel.keySource` if data got set in there, or `rel.key` otherwise
                        var value = this.attributes[ rel.keySource ] || this.attributes[ rel.key ],
                            attr = changedAttrs && ( changedAttrs[ rel.keySource ] || changedAttrs[ rel.key ] );


                        // Update a relation if its value differs from this model's attributes, or it's been explicitly nullified.
                        // Which can also happen before the originally intended related model has been found (`val` is null).
                        if ( rel.related !== value || ( value === null && attr === null ) || changedAttrs ) {

                            // ADDED Defer triggering the relation change and deleting attributes
                            var changeTrigger = function(model, relation, val, opts) {

                                return function() {

                                    model.trigger( 'relational:change:' + relation.key, model, val, opts || {} );

                                    if ( relation.keySource !== relation.key ) {
                                        delete model.attributes[ relation.keySource ];
                                    }

                                    // ADDED
                                    model.updateRelationToSelf(relation);
                                }
                            }
                            changeTriggers.push(changeTrigger(this, rel, value, options));
                        }
                    }

                }, this );

                // Trigger change on the relations
                _.each(changeTriggers, function(trigger) {
                    trigger();
                });
            }
        }
    });
}).call(this);