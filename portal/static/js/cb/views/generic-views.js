
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
    render: function() {
        return (
            <div>
                <h4 classname="list-group-item-heading">{this.getTitle()}</h4>
                <i id="edit-button" classname="icon ion-edit edit-button" />
                <i classname="icon ion-trash-a uninstall-button" />
            </div>
        );
    }
};

CBApp.ListView = {
    //mixins: [Backbone.React.Component.mixin],
    createItem: function (item) {
        console.log('createItem itemView', this.itemView);
        console.log('item', item);
        return <div>{item}</div>;
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
        return (
            <div>
                <h4 classname="list-group-item-heading">Test</h4>
                <i id="edit-button" classname="icon ion-edit edit-button" />
                <i classname="icon ion-trash-a uninstall-button" />
            </div>
        );
    }
};

CBApp.ListItemLoadingView = Marionette.ItemView.extend({

    tagName: 'li',
    className: 'spinner',
    template: require('./templates/listItemLoading.html')
});

CBApp.ListView = Marionette.CompositeView.extend({

    showLoading: function() {


    }
})