
CBApp.ItemView = {
    //mixins: [Backbone.React.Component.mixin],
    /*
    getTitle: function() {
        return "Item";
    },
    getButtons: function() {
        return "";
    },
    getContents: function() {
        return "Contents";
    },
    getStaffContents: function() {
        return "Staff contents";
    },
    */
    handleDelete: function() {

        CBDispatcher.dispatch({verb: 'delete',
                               model: this.props.model});
    },
    handleUpdate: function() {

        CBDispatcher.dispatch({verb: 'update',
                               model: this.props.model});
    },
    render: function() {
        return (
            <li className="new-item">
                <h4 className="item-title">{this.getTitle()}</h4>
                <i id="edit-button" className="icon ion-chevron-right edit-button" />
                <i className="icon ion-trash-a uninstall-button" />
            </li>
        );
    }
};

CBApp.ListView = {
    //mixins: [Backbone.React.Component.mixin],
    createItem: function (item) {
        console.log('createItem itemView', this.itemView);
        console.log('item', item);
        var cid = item.cid;

        console.log('model.cid', item.cid);

        //return < this.itemView model={item} />
        return <CBApp.DeviceInstallView key={cid} model={item} />

        //return <div>Another Item</div>;
    },
    setCollection: function(collection) {

    },
    /*
    componentWillReceiveProps: function(newProps, oldProps){
        this.setState(this.getInitialState(newProps));
    },
    render: function () {
        return <div>{this.props.collection.map(this.createItem)}</div>;
    },
     */
    render: function() {
        console.log('render collection', this.props);
        console.log('render mapped collection', this.props.collection.map(this.createItem));

        return (
            <div>
                <h2>Devices</h2>
                <div className="animated-list device-list">
                    {this.props.collection.map(this.createItem)}
                </div>
                <div className="topcoat-button--cta center full discover-devices-button">Connect to a Device</div>
            </div>
        );
    }
};

CBApp.FluxBoneMixin = function(propName) {
    return {
        componentDidMount: function() {
            return this.props[propName].on("all", (function(_this) {
                return function() {
                    return _this.forceUpdate();
                };
            })(this), this);
        },
        componentWillUnmount: function() {
            return this.props[propName].off("all", (function(_this) {
                return function() {
                    return _this.forceUpdate();
                };
            })(this), this);
        }
    };
};

CBApp.ListItemLoadingView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'spinner',
    template: require('./templates/listItemLoading.html')
});
