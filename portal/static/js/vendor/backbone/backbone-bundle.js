
var Backbone = require('backbone')
    ,$ = require('jquery')
    ,_ = require('underscore')
    ,Cocktail = require('backbone-cocktail');

Backbone.$ = $;
Backbone.Babysitter = require('backbone.babysitter');
Backbone.Wreqr = require('backbone.wreqr');

require('./backbone.stickit');
require('backbone-io');
require('backbone.marionette');
require('backbone.marionette.subrouter');
require('backbone.modal');
require('./backbone-notify');
require('./backbone-relational');
require('../../cb/misc/relational-models');

var CBModelMixin = require('./backbone-cb');
Cocktail.mixin(Backbone.RelationalModel, CBModelMixin);

var TrackableModelMixin = require('./backbone-trackable');
Cocktail.mixin(Backbone.Deferred.Model, TrackableModelMixin);


// Required for backbone deferred
Q = require('q');
require('backbone-deferred');

/*
// Mix in Backbone Sorted
var SortedMixin = require('./backbone-sorted');
_.extend(Marionette.CollectionView.prototype, SortedMixin);
_.extend(Marionette.CompositeView.prototype, SortedMixin);
*/

module.exports = Backbone;



