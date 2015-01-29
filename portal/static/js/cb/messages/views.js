
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

        var label = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        return (
            <div className="topcoat-button-bar__item">
                <button data-tag={name} className="topcoat-button-bar__button" onClick={this.onButtonClick} >{label}</button>
            </div>
        )
    },

    onButtonClick: function(e) {

        var command = e.target.getAttribute('data-tag');
        this.sendCommand(command);
        this.setState({command: ''});
    },

    componentWillUpdate: function() {
        // Check if the message window is already at the bottom
        var messagesWrapper = this.refs.messagesWrapper.getDOMNode();
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
                    <table className="table-condensed table-hover table-striped">
                        <tbody>
                        {this.props.collection.map(this.renderMessage)}
                        </tbody>
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

