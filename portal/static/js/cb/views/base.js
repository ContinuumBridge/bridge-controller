
var React = require('react');

module.exports = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    /*
    componentDidUpdate: function() {

        console.log('base componentDidUpdate');
        Backbone.Relational.eventQueue.unblock();
    },
    */

    render: function () {

        var Handler = this.props.handler;
        //console.log('Handler in base', Handler);
        var params = this.props.params;
        console.log('params in base', params);
        var path = this.props.path;
        //var currentBridge = this.getModel();
        //console.log('currentBridge in base', currentBridge);
        //currentBridge.fetch();

        return (
            <Handler params={params} key={path} path={path} />
        );
    }
});
