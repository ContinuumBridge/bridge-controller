
require('../portals/views');

module.exports = React.createClass({

    render: function () {

        var collection = Portal.getCurrentBridge().get('appInstalls');

        return (
            <Portal.PortalTabbedView collection={collection} />
        );
    }
});

/*
 </br></br>
 If this is the first time you have logged-in and you don\'t have any bridges, please click <a href="http://continuumbridge.readme.io/v1.0/docs/start-here">here</a>
 </br></br>
 If you have a bridge, click <a href="http://portal.continuumbridge.com/portal/config/">here</a> to see what devices and apps you have and add more.
 </br></br>
 For further information on how to use this portal, click <a href="http://continuumbridge.readme.io/v1.0/docs/the-continuumbridge-portal">here</a>
*/
