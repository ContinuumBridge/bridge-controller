
var PortalsAPI = require('../modules/portals/api');

module.exports = React.createClass({

    componentDidMount: function() {

        //var $portal = this.$('.portal');
        var cajaSection = this.refs.caja.getDOMNode();
        caja.load(cajaSection, undefined, function(frame) {
            frame.code('/static/caja-test.html',
                'text/html')
                .api(PortalsAPI.tameAll())
                //.api({ sayHello: tamedAlertGreeting })
                .run();
        });
    },

    render: function () {

        return (
            <div ref="caja">
            </div>
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
