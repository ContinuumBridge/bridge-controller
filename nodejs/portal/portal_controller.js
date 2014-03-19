
var http = require('http')
    ,connect = require('connect')
    ,backboneio = require('cb-backbone.io')
    ,logger = require('./logger')
    ,redis = require('socket.io/node_modules/redis')
    ,Bacon = require('baconjs').Bacon
    ,cookie_reader = require('cookie')
    ;

var djangoBackbone = require('./django_backbone.js')
    ,DeviceDiscovery = require('./device_discovery.js')
    ,PortalBackboneIO = require('./backboneio.js')
    ,PortalRedis = require('./redis.js')
    ,backendAuth = require('../backend_auth.js')
    ,internalAPI = require('./internal_api_router.js')
    ,MessageUtils = require('../message_utils')
    ;

/* Portal Controller */
logger.log('Environment is', process.env.NODE_ENV);

DJANGO_URL = process.env.NODE_ENV == 'production' ? 'http://localhost:8080/api/user/v1/' : 'http://localhost:8000/api/user/v1/'
console.log('DJANGO_URL', DJANGO_URL);
module.exports = PortalController;

function PortalController(socketPort) {

    var portalController = {};

    var server = http.createServer(connect()
        .use(function(req, res, next) {
            //console.log('We are using middleware!');
            next();
        })
    );
    server.listen(4000);

    portalController.backboneio = new PortalBackboneIO(server);

    portalController.backboneio.on('connection', function (socket) {

        var address = socket.handshake.address;
        var authData = socket.handshake.authData;

        var fromPortal = socket.fromPortal = new Bacon.Bus();
        var toPortal = socket.toPortal = new Bacon.Bus();

        var fromRedis = socket.fromPortal = new Bacon.Bus();
        var toRedis = socket.toPortal = new Bacon.Bus();

        socket.redis = new PortalRedis(authData, fromRedis, toRedis);

        socket.on('message', function (jsonMessage) {

            // On message from the portal put it on the fromPortal bus
            MessageUtils.parse(jsonMessage).then(function(message) {
                message.source = "UID" + socket.handshake.authData.id;
                message.sessionID = socket.handshake.query.sessionID;
                fromPortal.push(message);
            }, function(error) {
                logger.error(error);
            });
        });

        //portalController.onMessage = function(channel, jsonMessage) {
        fromRedis.onValue(function(message) {

            //logger.
        });

        socket.on('disconnect', function () {
            
            console.log('Remove listener');
            // Stop listening for messages from redis
            portalController.redis.subClient.removeListener('message', portalController.onMessage);
        });

        console.log('Server > New user connection from %s:%s. Subscribed to %s (%s), publishing to %s', address.address, address.port, subscriptionAddress, authData.email, publicationAddresses);
    });

    return portalController;
}
