
module.exports.TextInput = React.createClass({

    getInitialState: function() {
        return {title: 'Hello!'};
    },

    handleChange: function(e) {
        this.setState({value: e.target.value});
    },

    handleBlur: function(e) {
        this.setState({value: e.target.value});
        this.submit();
    },

    handleKeyDown: function(e) {
        if (e.keyCode == 13 ) {
            this.submit();
        }
    },

    submit: function() {
        var model = this.props.model;
        var value = this.state.value;
        console.log('TextBox submit model', model );
        if (value != model.get(this.props.field)) {
            model.set(this.props.field, value);
            model.save();
            //this.setState({value: void 0});
        }
    },

    render: function() {

        var model = this.props.model;
        var value = this.state.value || this.props.model.get(this.props.field);
        var disabled = model.isSyncing();
        return <input type="text" className="item-title-box" value={value} disabled={disabled}
                      onChange={this.handleChange} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} />;
    }
});

