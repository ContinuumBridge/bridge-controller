
var React = require('react');
var Router = require('react-router');

var Nav = require('./nav');
require('../notifications/views');

module.exports = React.createClass({

    mixins: [ Router.State, Router.Navigation ],

    render: function () {
        //Portal.mainView = this;
        //mainView = this;
        var activeSection = this.getParams().section;
        console.log('mainView getParams()', this.getParams());
        console.log('mainView params', this.props.params);
        //console.log('mainView model', this.getModel());
        var path = this.props.path;

        //var currentBridge = Portal.getCurrentBridge();
        return (
            <div>
                <Nav.Topbar activeSection={activeSection}/>
                <div className="container">
                    <Router.RouteHandler params={this.props.params} key={path} path={path} />
                </div>
                <Portal.NotificationListView />
            </div>
        );
    }
});

/*
var ConfigViews = require('../modules/config/views');

Portal.MainView = React.createClass({
    mixins: [Backbone.React.Component.mixin],

    render: function() {
        var currentBridge = Portal.getCurrentBridge();
        currentBridge.fetch();
        return (
            <ConfigViews.Main model={currentBridge} />
        )
    }
});
*/
