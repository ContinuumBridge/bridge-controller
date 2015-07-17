
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
        var params = this.props.params;

        var path = this.props.path;

        return (
            <Handler params={params} path={path} />
        );
    }
});
