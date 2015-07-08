
var Swarm = require('swarm');
var Model = Swarm.Model;
var Ref = Swarm.Syncable.Ref;

module.exports = Model.extend('Session', {

    defaults: {
        cbid: '',
        started: '',
        connected: 'true',
        server: {type:Ref, value:'#0'},
        client: {type:Ref, value:'#0'}
    },

    disconnect: function() {

        this.set({
            connected: 'false'
        });
    },

    destroy: function() {

        this.server.target().destroySession(this);
        this.client.target().destroySession(this);
    }
    /*
    reactions: {

        init: function (spec,val,src) {

            console.log('Session init');
            var self = this;

            this.set({
                server: localServer
            });
        }
    },
    */

    /*
    relations: {
        server: {
            modelType: 'Server'
        },
        client: {
            modelType: 'Client'
        }
    }
    */
});

