
module.exports = React.createClass({displayName: 'Spinner',

    /*
    componentDidMount: function() {

        var $spinner = $(this.refs.spinner.getDOMNode());

        $spinner.tipsy({gravity: 's'});
    },
    */

    render: function() {

        //var { ...other } = this.props;

        console.log('spinner props', this.props);
        return (
            <div {...this.props} className="spinner" ref="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        );
    }
});

/*
<a href="#" title="This is some information for our tooltip." className="floating-info">
</a>
*/
