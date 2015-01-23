
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
                <h5>{this.props.title}</h5>
                <ul className="animated-list device-list">
                    {this.props.collection.map(this.createItem)}
                </ul>
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
        //console.log('getModel owner', owner);
        if (!owner) return false;
        var collection = owner.getCollection();
        //console.log('getModel collection', collection);
        //console.log('getModel item', this.props.model);
        var item = this.props.model;
        var query = item.id ? {id: item.id} : {cid: item.cid};
        return collection.findWhere(query);
    },

    getCollection: function() {

        var owner = this._owner;
        if (!owner) return false;
        return owner.getCollection();
    },

    handleDestroy: function() {
        this.getModel().destroy();
    },

    handleDestroyOnServer: function() {
        this.getModel().destroyOnServer();
    },

    /*
    renderButtons: function() {

        var type = button.type == 'bold' ? '--cta' : '';
        var className = "topcoat-button" + type + " center full";
        var onClick = button.onClick || function(){};

        return (
            <div className={className} onClick={button.onClick}>{button.name}</div>
        );
    },
    */

    render: function() {
        //console.log('ItemView props', this.props);
        var model = this.props.model;
        var body = this.renderBody ? this.renderBody() : "";
        var buttons = this.state.buttons || [];
        return (
            <React.ListItem header={this.props.title} buttons={buttons}
                renderButtons={this.renderButtons}
                bsStyle='' collapsable={this.props.openable} eventKey="1">
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

        var type = button.type == 'bold' ? '--cta' : '';
        var className = "topcoat-button" + type + " center full";
        //console.log('renderButton onClick', button.onClick);
        //var onClick = button.onClick || function(){};

        return (
            <div className={className} onClick={button.onClick}>{button.name}</div>
        );
    },

    renderButtons: function() {

        var buttons = this.state.buttons || [];

        return (
            <div class="topcoat-button-bar">
                {buttons.map(this.renderButton)}
            </div>
        )
    },

    render: function() {
        //console.log('render collection', this.props);
        //console.log('render mapped collection', this.props.collection.map(this.createItem));
        //console.log('react getCollection ', this.getCollection());

        var title = this.state.title || "";

        //var collection = this.getCollection();
        //console.log('ListView collection', collection);
        return (
            <div>
                <h2>{title}</h2>
                <ul className="animated-list device-list">
                    {this.props.collection.map(this.createItem)}
                </ul>
                {this.renderButtons()}
            </div>
        );
    }
};
