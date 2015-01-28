
Portal.Components.Textbox = React.createClass({

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

Portal.DeviceInstallView = React.createClass({

    mixins: [Portal.ItemView],

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    getInitialState: function () {
        return {
            buttons: [{
                onClick: this.handleDestroy,
                type: 'delete'
            }]
        };
    }
});

Portal.DeviceInstallListView = React.createClass({

    itemView: Portal.DeviceInstallView,

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Devices',
            buttons: [{
                name: 'Discover Devices',
                onClick: this.discoverDevices,
                type: 'bold'
            }]
        };
    },

    discoverDevices: function() {

        Portal.router.setParams({action: 'discover-devices'});
    },

    renderItem: function (item) {
        var cid = item.cid;

        var deviceInstall = this.getCollection().get({cid: cid});
        var header = <Portal.Components.Textbox model={deviceInstall} field="friendly_name" />;
        //var header = <Portal.Components.Textbox />;

        return < Portal.DeviceInstallView key={cid}
                    header={header} model={item} />
    }
});
