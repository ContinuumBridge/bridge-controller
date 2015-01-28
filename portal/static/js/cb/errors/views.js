
//var Message = require('./message');

Portal.MessageView = React.createClass({
    //mixins: [Portal.ItemView],
    render: function() {

        return (
            <div>
                <td className="shrink">"remote" "direction"</td>
                <td className="expand"> "body" </td>
            </div>
        )
    }
});

Portal.MessageListView = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    getInitialState: function() {
        return {command: ''};
    },

    getDefaultProps: function () {
        return {
            title: 'Messages',
            buttons: [
                'start',
                'stop',
                'update',
                'send_log',
                'z_exclude',
                'restart',
                'reboot',
                'upgrade'
            ]
        };
    },

    sendCommand: function(command) {

        Portal.messageCollection.sendCommand(command);
    },

    commandSubmit: function() {
        var command = this.refs.command.getDOMNode().value;
        this.sendCommand(command);
        this.setState({command: ''});
    },

    handleCommandChange: function(e) {
        this.setState({command: e.target.value});
    },

    handleCommandKeyDown: function(e) {
        if (e.keyCode == 13 ) {
            return this.commandSubmit();
        }
    },

    renderMessage: function(message) {

        console.log('renderMessage', message);
        var direction = message.direction == 'outbound' ? '<=' : '=>';
        var remote = message.direction == 'outbound' ? message.destination : message.source;
        return (
            <tr key={message.cid}>
                <td className="shrink">{remote} {direction}</td>
                <td className="expand">{message.body}</td>
            </tr>
        )
    },

    renderButton: function(name) {

        //var label = name.charAt(0).toUpperCase() + name.slice(1);
        var label = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        return (
            <div className="topcoat-button-bar__item">
                <button data-tag={name} className="topcoat-button-bar__button" onClick={this.onButtonClick} >{label}</button>
            </div>
        )
    },

    onButtonClick: function(e) {

        console.log('onButtonClick', e.target.getAttribute('data-tag'));
        var command = e.target.getAttribute('data-tag');
        this.sendCommand(command);
        this.setState({command: ''});
    },

    componentWillUpdate: function() {
        // Check if the message window is already at the bottom
        var messagesWrapper = this.refs.messagesWrapper.getDOMNode();
        console.log('messagesWrapper scrollTop', messagesWrapper.scrollTop );
        console.log('messagesWrapper offsetHeight', messagesWrapper.offsetHeight);
        console.log('messagesWrapper scrollHeight', messagesWrapper.scrollHeight);
        this.shouldScrollBottom = messagesWrapper.scrollTop + messagesWrapper.offsetHeight >= messagesWrapper.scrollHeight;
    },

    componentDidUpdate: function() {
        if (this.shouldScrollBottom) {
            // Scroll the message window to its bottom
            var messagesWrapper = this.refs.messagesWrapper.getDOMNode();
            messagesWrapper.scrollTop = messagesWrapper.scrollHeight
        }
    },

    render: function() {

        var command = this.state.command;

        var topButtons = this.props.buttons.slice(0, 5);
        var bottomButtons = this.props.buttons.slice(5);

        return (
            <div id="messages">
                <h2>Bridge Messages</h2>

                <div ref="messagesWrapper" id="messages-wrapper">
                    <table id="messages-table" className="table-condensed table-hover table-striped">
                        {this.props.collection.map(this.renderMessage)}
                    </table>
                </div>

                <div className="input-group">
                    <input type="text" className="form-control" ref="command"
                        value={command} onKeyDown={this.handleCommandKeyDown} onChange={this.handleCommandChange} />
                    <span className="input-group-btn">
                        <button id="send-button" className="btn btn-default"
                            type="button" onClick={this.commandSubmit} >Send</button>
                    </span>
                </div>
                <div className="topcoat-button-bar">
                    {topButtons.map(this.renderButton)}
                </div>
                <div className="topcoat-button-bar">
                    {bottomButtons.map(this.renderButton)}
                </div>
            </div>
        )
    }
});
/*
Portal.MessageView = Marionette.ItemView.extend({

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

Portal.MessageListView = Marionette.CompositeView.extend({

    template: require('./templates/messageSection.html'),
    id: 'messages',
    //tagName: 'table',
    //className: 'table-condensed table-hover table-striped',
    itemView: Portal.MessageView,
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
        var destination = Portal.getCurrentBridge().get('cbid');
        var message = new Portal.Message({
            destination: destination,
            body: {
                command: command
            }
        });
        Portal.messageCollection.sendMessage(message);
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
*/
