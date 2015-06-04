"use strict";

var Swarm = require('swarm');

var Model = Swarm.Model;

module.exports = Model.extend('Session', {

    defaults: {
        cbid: '',
        email: '',
        subscriptionAddresses: [],
        publicationAddresses: []
    }
});