
module.exports = React.createClass({

    mixins: [Backbone.React.Component.mixin],

    render: function () {

        var Handler = this.props.handler;
        var params = this.props.params;

        return (
            <Handler params={params} />
        );
    }
});
