"use strict";

var Model = Swarm.Model;

// Our key class: a mouse pointer :)
module.exports.Switch = Model.extend('Switch', {
    defaults: {
        value: false,
        symbol: '?',
        ms: 0// last activity timestamp
    }
});

var SyncSet = Swarm.Set;

// this collection class has no functionality except for being a list
// of all mice currently alive; we'll only use one singleton object
// set mixin
module.exports.Switches = SyncSet.extend('Switches', {

});
