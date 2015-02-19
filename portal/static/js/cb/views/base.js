
module.exports = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    render: function () {

        var Handler = this.props.handler;
        //console.log('Handler in base', Handler);
        var params = this.props.params;
        console.log('params in base', params);
        //var currentBridge = this.getModel();
        //console.log('currentBridge in base', currentBridge);
        //currentBridge.fetch();
        var path = this.props.path;

        return (
            <Handler params={params} path={path} />
        );
    }
});
