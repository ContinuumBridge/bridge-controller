

Portal.PortalView = React.createClass({

    componentDidMount: function() {

        var portal = this.props.model;

        var API = portal.getAPI();
        //var $portal = this.$('.portal');
        var cajaSection = this.refs.caja.getDOMNode();
        caja.load(cajaSection, undefined, function(frame) {
            frame.code('/static/caja-test.html',
                'text/html')
                .api(API)
                //.api({ sayHello: tamedAlertGreeting })
                .run();
        });
    },

    render: function() {

        console.log('portal in portalview is', this.props.model);

        return (
                <div ref="caja">
                </div>
        )
    }
});

Portal.PortalTabbedView = React.createClass({

    renderTab: function(appInstall) {

        var id = appInstall.get('id');
        var app = appInstall.get('app');
        var name = app.get('name');

        var portal = appInstall.getPortal();

        return (
            <React.TabPane eventKey={id} tab={name}>
                <Portal.PortalView model={portal}/>
            </React.TabPane>
        )
    },

    render: function() {

        var handleSelect = function() {};

        var collection = this.props.collection;
        var appInstall = collection.at(0);
        var startID = appInstall ? appInstall.get('id') : 0;

        return (
            <React.TabbedArea activeKey={startID} animation={false} onSelect={handleSelect}>
                {collection.map(this.renderTab)}
            </React.TabbedArea>
        )
    }
});
