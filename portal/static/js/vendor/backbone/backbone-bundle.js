
var Backbone = require('backbone')
    ,$ = require('jquery')
    ,_ = require('underscore')
    ,Cocktail = require('backbone-cocktail');

Backbone.$ = $;
Backbone.Babysitter = require('backbone.babysitter');
Backbone.Wreqr = require('backbone.wreqr');

require('./backbone.stickit');
require('backbone-io');
require('./backbone.trackit.js');
require('backbone.marionette');
require('backbone.marionette.subrouter');
//require('./backbone-bossview');
require('backbone.modal');

//require('./backbone-notify');

require('./backbone-relational');
require('../../cb/misc/relational-models');

var CBModelMixin = require('./backbone-cb-model-mixin');
Cocktail.mixin(Backbone.RelationalModel, CBModelMixin);

var CBViewsMixin = require('./backbone-cb-views');
Cocktail.mixin(Marionette.ItemView, CBViewsMixin.ItemView);
Cocktail.mixin(Marionette.CollectionView, CBViewsMixin.RelationalCollectionView);
// Required for backbone deferred
Q = require('q');

QueryEngine = require('query-engine');

require('./backbone-cb-model');
require('backbone-deferred');

/*
var TrackableModelMixin = require('./backbone-trackable');
Cocktail.mixin(Backbone.Deferred.Model, TrackableModelMixin);
*/

/*
// Mix in Backbone Sorted
var SortedMixin = require('./backbone-sorted');
_.extend(Marionette.CollectionView.prototype, SortedMixin);
_.extend(Marionette.CompositeView.prototype, SortedMixin);
*/

module.exports = Backbone;



