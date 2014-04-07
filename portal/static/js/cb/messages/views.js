
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.MessageView = Marionette.ItemView.extend({

    tagName: 'li',
    className: '',
    template: require('./templates/message.html')
})


CBApp.MessageListView = Marionette.CollectionView.extend({

    tagName: 'ul',
    className: 'animated-list',
    itemView: CBApp.AppView,

    onRender : function(){

    }
})

CBApp.MessageLayoutView = Marionette.Layout.extend({
    
    id: 'commands',
    template: require('./templates/messageSection.html'),

    regions: {
        messageList: '#message-list'
    },

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
        this.collection.sendCommand(command);
        CBApp.socket.sendCommand(command);
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

