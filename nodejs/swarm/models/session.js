
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

        //console.log('session destroy server', this.server);
        //console.log('session destroy client', this.client);
        this.server.target().sessions.target().removeObject(this);
        this.client.target().sessions.target().removeObject(this);
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

