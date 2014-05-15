
var Backbone = require('backbone-bundle')
    ,Marionette = require('backbone.marionette');

CBApp.MessageView = Marionette.ItemView.extend({

    tagName: 'tr',
    className: '',
    template: require('./templates/message.html'),

    serializeData: function() {

      //var bridgeID = "BID" + this.model.get('bridge').get('id');
      var data = {};
      var incoming = Boolean(this.model.get('time_received'));
      data.direction = incoming ? "=>" : "<=";
      data.remote = incoming ? this.model.get('source') : this.model.get('destination');
      data.body = this.model.get('body');
      return data;
    }
})

CBApp.MessageListView = Marionette.CompositeView.extend({

    template: require('./templates/messageSection.html'),
    id: 'messages',
    //tagName: 'table',
    //className: 'table-condensed table-hover table-striped',
    itemView: CBApp.MessageView,
    itemViewContainer: '#messages-table',

    events: {
        'click #send-button': 'clickSend',
        'keyup #command-input' : 'keyPressEventHandler',
        'click #start': 'clickStart',
        'click #stop': 'clickStop',
        'click #update': 'clickUpdate',
        'click #send-log': 'clickSendLog',
        'click #restart': 'clickRestart',
        'click #reboot': 'clickReboot',
        'click #upgrade': 'clickUpgrade'
    },

    initialize: function() {

        this.listenTo(this, 'after:item:added', this.scrollView())
    },

    onRender: function() {

        this.$console = this.$('#console');
        this.$commandInput = this.$('#command-input');

        //var messageListView = new CBApp.MessageListView({ collection: this.collection });
        //this.messageList.show(messageListView);
        //this.listenTo(this.collection, 'item:added', this.scrollBottom);
    },

    scrollView: function(){

        //messagesWrapper = $(this.el).parentNode;
        $messagesWrapper = this.$('#messages-wrapper');
        if ($messagesWrapper[0]) {
            $messagesWrapper[0].scrollTop = $messagesWrapper[0].scrollHeight;
            //$messagesWrapper.scrollTop($messagesWrapper[0].scrollHeight);
            console.log('item added!', $messagesWrapper, $messagesWrapper.scrollHeight);
        }
        //this.el.parentNode.scrollTop(this.el.parentNode.scrollHeight);
    },

    scrollBottom: function() {

        console.log('scoll bottom');
    },

    sendCommand: function(command) {

        CBApp.messageCollection.sendMessage('command', command);
    },

    clickSend: function() {

        var command = this.$commandInput.val();
        this.$commandInput.value = "";
        this.sendCommand(command);
    },

    keyPressEventHandler: function(event){

        // When enter is pressed in the input, send the message
        if(event.keyCode == 13){
            this.clickSend();
        }
    },

    clickStart: function() {

        console.log('start clicked');
        this.sendCommand('start');
    },

    clickStop: function() {

        this.sendCommand('stop');
    },

    clickUpdate: function() {

        this.sendCommand('update_config');
    },

    clickSendLog: function() {

        this.sendCommand('send_log');
    },

    clickRestart: function() {

        this.sendCommand('restart');
    },

    clickReboot: function() {

        this.sendCommand('reboot');
    },

    clickUpgrade: function() {

        this.sendCommand('upgrade');
    }
});

/*
CBApp.MessageLayoutView = Marionette.Layout.extend({
    
    id: 'commands',
    template: require('./templates/messageSection.html'),

    regions: {
        messageList: '#messages-wrapper'
    },

    events: {
        'click #send-button': 'sendClick',
        'keyup #command-input' : 'keyPressEventHandler',
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

        var messageListView = new CBApp.MessageListView({ collection: this.collection });
        this.messageList.show(messageListView);
        this.listenTo(messageListView, 'item:added', this.scrollBottom);
    },

    scrollBottom: function() {


    },

    sendCommand: function(command) {

        CBApp.messageCollection.sendMessage('command', command);
    },

    sendClick: function() {

        var command = this.$commandInput.val();
        this.$commandInput.value = "";
        this.sendCommand(command);
    },

    keyPressEventHandler: function(event){

        if(event.keyCode == 13){
            this.sendClick();
        }
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

*/
