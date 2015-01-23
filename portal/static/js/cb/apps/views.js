
Portal.Components.Counter = React.createClass({

    mixins: [ Portal.Mixins.Counter ],

    handleIncrement: function() {
        this.incrementField(this.props.model, 'installs_permitted', 1);
    },

    handleDecrement: function() {
        this.incrementField(this.props.model, 'installs_permitted', -1);
    },

    render: function() {

        var licence = this.props.model;

        var installsPermitted = licence.get('installs_permitted');
        var disabled = licence.isSyncing();

        return (
            <div className="input-group counter">
                <span className="input-group-btn data-dwn">
                    <button className="btn btn-default btn-info"
                            onClick={this.handleDecrement} data-increment="-1">
                        <span className="glyphicon glyphicon-minus"></span>
                    </button>
                </span>
                <input type="text" className="form-control number text-center"
                    readonly="true" disabled={disabled} value={installsPermitted} />
                <span className="input-group-btn data-up">
                    <button className="btn btn-default btn-info"
                            onClick={this.handleIncrement} data-increment="1">
                        <span className="glyphicon glyphicon-plus"></span>
                    </button>
                </span>
            </div>
        )
    }
});

Portal.AppView = React.createClass({

    mixins: [Portal.ItemView],

    getInitialState: function () {
        return {
            buttons: [{
                type: 'counter',
                element: Portal.Components.Counter
            }]
        };
    },

    getDefaultProps: function () {
        return {
            openable: true
        };
    },

    renderButtons: function() {

        console.log('AppView renderButtons');
        var app = this.props.model;
        var licence = app.getLicence(Portal.currentUser);
        return <Portal.Components.Counter model={licence} />
    },

    renderBody: function() {

        var self = this;

        return (
            <div></div>
        );
    }
});

Portal.AppListView = React.createClass({

    itemView: Portal.AppView,

    mixins: [Backbone.React.Component.mixin, Portal.ListView],

    getInitialState: function () {
        return {
            title: 'Apps'
        };
    },

    createItem: function (item) {
        console.log('appView createItem item', item);
        var cid = item.cid;

        var app = Portal.appCollection.get({cid: cid});

        var title = app.get('name');

        return < Portal.AppView key={cid} title={title}
                    model={app} />
    }
});
