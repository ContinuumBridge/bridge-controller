

Portal.ReactBackboneMixin = {

    getModel: function() {

        var owner = this._owner;
        if (!owner) return false;
        var collection = owner.getCollection();
        return collection.get({cid: this.props.model.cid})
    }
}

Portal.InnerItemView = {

    render: function() {
        return (
            <div className="inner-item">
                Inner Item
            </div>
        );
    }
}

Portal.InnerListView = {

    render: function() {
        return (
            <div className="inner-item">
                <h3>{this.props.title}</h3>
                <div>
                    {this.props.collection.map(this.createItem)}
                </div>
            </div>
        );
    }
}

Portal.ItemView = {
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

    getModel: function() {

        var owner = this._owner;
        if (!owner) return false;
        var collection = owner.getCollection();
        return collection.get({cid: this.props.model.cid})
    },

    getCollection: function() {

        var owner = this._owner;
        if (!owner) return false;
        return owner.getCollection();
    },

    handleDelete: function() {

        CBDispatcher.dispatch({actionType: 'delete',
                               model: this.props.model,
                               source: 'portal' });
    },

    handleUpdate: function() {

        CBDispatcher.dispatch({actionType: 'update',
                               model: this.props.model,
                               source: 'portal' });
    },

    render: function() {
        console.log('ItemView props', this.props);
        var model = this.props.model;
        var body = this.renderBody ? this.renderBody() : "";
        return (
            <React.ListItem header={this.props.title} bsStyle='' collapsable={this.props.openable} eventKey="1">
                {body}
            </React.ListItem>
        );
    }
};

Portal.ListView = {

    /*
    propTypes: {
        handleButtonClick: React.PropTypes.func
    },

    setCollection: function(collection) {

    },
    */

    renderButton: function(button) {

        return (
            <div className="topcoat-button--cta center full" onClick={this.handleButtonClick}>{button.name}</div>
        );
    },

    render: function() {
        console.log('render collection', this.props);
        console.log('render mapped collection', this.props.collection.map(this.createItem));
        console.log('react getCollection ', this.getCollection());

        var buttons = this.props.buttons || [];

        return (
            <div>
                <h2>{this.props.title}</h2>
                <div className="animated-list device-list">
                    {this.props.collection.map(this.createItem)}
                </div>
                    {buttons.map(this.renderButton)}
            </div>
        );
    }
};

Portal.FluxBoneMixin = function(propName) {
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

Portal.ListItemLoadingView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'spinner',
    template: require('./templates/listItemLoading.html')
});
