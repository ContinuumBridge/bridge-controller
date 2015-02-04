
module.exports.TextInput = React.createClass({

    handleChange: function(e) {
        //this.setState({value: e.target.value});
        //this.props.model
        this.setValue(e.target.value);
    },

    handleBlur: function(e) {
        //this.setState({value: e.target.value});
        this.setValue(e.target.value);
        this.submit();
    },

    handleKeyDown: function(e) {
        if (e.keyCode == 13 ) {
            this.submit();
        }
    },

    setValue: function(value) {

        this.props.model.set(this.props.field, value);
    },

    submit: function() {

        this.props.model.save();

        //var model = this.props.model;
        //model.save();

        /*
        console.log('TextBox submit model', model );
        if (value != model.get(this.props.field)) {
            model.set(this.props.field, value);
            model.save();
            //this.setState({value: void 0});
        }
        */
    },

    render: function() {

        var model = this.props.model;
        var value = model.get(this.props.field);
        var disabled = model.isSyncing();
        //return <React.AutoSizeInput className="item-title-box" value={value} disabled={disabled}
        //              onChange={this.handleChange} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} />

        return <input type="text" className="item-title-box" value={value} disabled={disabled}
                      onChange={this.handleChange} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} />;
    }
});

