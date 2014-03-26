
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

var logger = require('logger');

CBApp.CommandsView = Marionette.ItemView.extend({
    
    id: 'commands',
    //className: 'span4',
    template: '#commandsTemplate',

    events: {
        'click #send-button': 'sendCommand',
        'click #start': 'startClick',
        'click #stop': 'stopClick',
        'click #update': 'updateClick',
        'click #send-log': 'sendLog',
        'click #restart': 'restart',
        'click #reboot': 'reboot',
        'click #upgrade': 'upgrade'
    },

    onRender: function() {

        this.$console = this.$('#console');
        this.$commandInput = this.$('#command-input');

        var that = this;

        CBApp.socket.on('message', function(message) {
            logger.log('verbose', 'Server > ' + message);
            that.appendLine(message);
        });
    },

    appendLine: function(message) {

        /* Appends a line to the console */
        this.$console.append(message + '&#xA;');
        this.$console.scrollTop(this.$console[0].scrollHeight);
    },

    sendCommand: function(command) {

        /* Sends commands by calling CBApp.socket */
        if (!command) {
            var command = this.$commandInput.val();
            this.$commandInput.value = "";
        }
        CBApp.socket.sendCommand(command);
        this.appendLine(command);
    },

    startClick: function() {

        this.sendCommand('start');
    },
    
    stopClick: function() {

        this.sendCommand('stop');
    },
    
    updateClick: function() {

        this.sendCommand('update_config');
    },

    sendLog: function() {

        this.sendCommand('send_log');
    },

    restart: function() {

        this.sendCommand('restart');
    },
    
    reboot: function() {

        this.sendCommand('reboot');
    },

    upgrade: function() {

        this.sendCommand('upgrade');
    }
});

