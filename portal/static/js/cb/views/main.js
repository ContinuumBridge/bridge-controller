
var React = require('react');
var Router = require('react-router');

var Nav = require('./nav');
require('../notifications/views');

module.exports = React.createClass({

    mixins: [ Router.State, Router.Navigation ],

    render: function () {
        //Portal.mainView = this;
        //mainView = this;
        //var activeSection = this.getParams().section;
        var activeSection = this.props.params.section;
        //console.log('mainView getParams()', this.getParams());
        //console.log('mainView params', this.props.params);
        //console.log('mainView model', this.getModel());
        var path = this.props.path;

        //var currentBridge = Portal.getCurrentBridge();
        return (
            <div>
                <Nav.Topbar activeSection={activeSection}/>
                <div className="container">
                    {this.props.children}
                </div>
                <Portal.NotificationListView />
            </div>
        );
    }
});

/*
{React.cloneElement(this.props.children, { key: path, path: path })}
//<Router.RouteHandler params={this.props.params} key={path} path={path} />

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
