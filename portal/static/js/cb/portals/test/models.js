"use strict";

var Model = Swarm.Model;

module.exports.Switch = Model.extend('Switch', {
    defaults: {
        name: '',
        value: 'off'
    },

    toggle: function () {
        var value = this.value == "on" ? "off" : "on";
        this.set({ value: value });
    }
});

var SyncSet = Swarm.Set;

// this collection class has no functionality except for being a list
// of all mice currently alive; we'll only use one singleton object
// set mixin
module.exports.Switches = SyncSet.extend('Switches', {

});
