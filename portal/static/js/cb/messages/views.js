
//var Message = require('./message');

CBApp.MessageView = Marionette.ItemView.extend({

    tagName: 'tr',
    className: '',
    template: require('./templates/message.html'),

    serializeData: function() {

      console.log('serializeData');
      //var bridgeID = "BID" + this.model.get('bridge').get('id');
      var data = {};
      var incoming = Boolean(this.model.get('time_received'));
      data.direction = incoming ? "=>" : "<=";
      data.remote = incoming ? this.model.get('source') : this.model.get('destination');
      var body = this.model.get('body');
      // Check if this is a command
      data.body = body instanceof Object ? body.command || body.status : body;
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
        'click #start': 'clickCommand',
        'click #stop': 'clickCommand',
        'click #update_config': 'clickCommand',
        'click #send_log': 'clickCommand',
        'click #z-exclude': 'clickCommand',
        'click #restart': 'clickCommand',
        'click #reboot': 'clickCommand',
        'click #upgrade': 'clickCommand'
    },

    collectionEvents: {
        "relational:reset": "scrollMessages"
    },

    initialize: function() {

        //this.listenTo(this.collection, 'after:item:added', this.scrollMessages)
    },

    onRender: function() {

        this.$commandInput = this.$('#command-input');
        this.$messagesWrapper = this.$('#messages-wrapper');
    },

    scrollMessages: function(){

        if (this.$messagesWrapper && this.$messagesWrapper[0]) {
            this.$messagesWrapper[0].scrollTop = this.$messagesWrapper[0].scrollHeight;
        }
    },

    sendCommand: function(command) {

        console.log('sendCommand', command);
        CBApp.getCurrentBridge().then(function(currentBridge) {
            var destination = currentBridge.get('cbid');
            var message = new CBApp.Message({
                destination: destination,
                body: {
                    command: command
                }
            });
            CBApp.messageCollection.sendMessage(message);
        });
    },

    clickCommand: function(e) {
        //console.log('clickCommand', e);
        var command = $(e.currentTarget).attr('id');
        console.log('clickCommand', command);
        this.sendCommand(command);
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
    }
});
