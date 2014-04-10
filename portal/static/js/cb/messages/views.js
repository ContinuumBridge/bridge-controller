
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

CBApp.MessageListView = Marionette.CollectionView.extend({

    id: 'messages-table',
    tagName: 'table',
    className: 'table-condensed table-hover table-striped',
    itemView: CBApp.MessageView,

    onRender : function(){

    },

    onAfterItemAdded: function(itemView){

        /*
        messagesWrapper = $(this.el).parentNode;
        if (messagesWrapper) {
            console.log('MessageListView rendered', this.el.parentNode, messagesWrapper.scrollHeight);
            messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
            console.log('item added!', messagesWrapper, messagesWrapper.scrollHeight);
        }
        */
        //this.el.parentNode.scrollTop(this.el.parentNode.scrollHeight);
    }
})

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

