
var TestPortalView = require('./test/views');

Portal.PortalView = React.createClass({

    getInitialState: function() {

        return {
            swarm: false
        }
    },

    componentWillMount: function() {

        var self = this;

        var portal = this.props.model;

        var swarmApp = portal.getSwarm();

        /*
        var updateCallback = function(spec, change, object) {
            console.log('switchCallback', spec, change, object);
            self.forceUpdate();
        };
        swarmApp.host.on(updateCallback);
        */
        self.setState({swarm: swarmApp});
    },

    componentDidMount: function() {

        var self = this;

        var portal = this.props.model;

        /*
        caja.whenReady(function() {  // (1)
            var swarmApp = portal.getSwarm();
            console.log('caja swarmApp', swarmApp);

            var updateCallback = function(spec, change, object) {
                console.log('switchCallback', spec, change, object);
                self.forceUpdate();
            };
            //swarmApp.host.on('/Switch#1', switchCallback);
            swarmApp.host.on(updateCallback);
            self.setState({swarm: swarmApp})
        });

        var cajaSection = this.refs.caja.getDOMNode();
        caja.load(cajaSection, undefined, function(frame) {
            //var API = portal.getAPI();
            //console.log('portal api is', API);
            frame.code('/static/caja-test.html',
                'text/html')
                .api({})
                .run();
        });
        */
    },

    render: function() {

        //console.log('portal in portalview is', this.props.model);
        var portal = this.props.model;

        //var key = portal.cid;
        var key = 1;
        //console.log('cid in portalview is', key);
        var swarmApp = this.state.swarm;
        console.log('Portal view swarmApp', swarmApp);
        console.log('Portal view key', key);

        return (
            <div ref="caja">
                <TestPortalView swarmApp={swarmApp} spec={key}/>
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
            <React.TabPane eventKey={id} key={id} tab={name}>
                <Portal.PortalView key={id} model={portal}/>
            </React.TabPane>
        )
    },

    render: function() {

        var handleSelect = function() {};

        var collection = this.props.collection;
        var appInstall = collection.at(0);
        var startID = appInstall ? appInstall.get('id') : 0;

        var testTab = appInstall ? this.renderTab(appInstall) : "";

        //{collection.map(this.renderTab)}
        return (
            <React.TabbedArea activeKey={startID} animation={false} onSelect={handleSelect}>
            {testTab}
            </React.TabbedArea>
        )
    }
});
