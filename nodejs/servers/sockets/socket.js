
var cookie_reader = require('cookie');

var backendAuth = require('../../backendAuth.js')
    ,Errors = require('../../errors')
    ;

function SocketServer() {

}

SocketServer.prototype.setupAuthorization = function(socketServer, getConfig) {

    /* Setup authorization for socket io >1.0 */
    var self = this;

    socketServer.use(function(socket, next) {

        console.log('socket sessionID is', socket.handshake.query.sessionID);
        if(socket.handshake && socket.handshake.query && socket.handshake.query.sessionID) {
            var sessionID = socket.handshake.query.sessionID;
        } else {
            next(new Errors.Unauthorized('No sessionID was provided'));
        }
        getConfig(sessionID).then(function(config) {
            socket.config = config;
            console.log('getConnectionConfig response', config);
            next();
        }, function(error) {

            console.log(error);
            next(error);
        });
    });
}

SocketServer.prototype.setupLegacyAuthorization = function(socketServer, getConfig) {

    /* Setup authorization for socket io <1.0 */
    var self = this;
    // Authenticate the sessionid from the socket with django
    socketServer.configure(function() {

        socketServer.set('authorization', function(data, accept) {

            var sessionID;

            if(data && data.headers && data.headers.cookie) {
                // Pull out the cookies from the data
                var cookies = cookie_reader.parse(data.headers.cookie);
                sessionID = cookies.sessionid;
            }
            if(data && data.query && data.query.sessionID) {
                sessionID = data.query.sessionID;
            }
            /*
            var protoConfig = {
                sessionID: sessionID,
                address: data.address
            }
            */
            getConnectionConfig(sessionID).then(function(config) {
                data.config = config;
                //data.config.address = data.address;
                console.log('Legacy getConnectionConfig config', config);
                accept(null, true);
            }, function(error) {

                accept('error', false);
            });
        });
    });
}

module.exports = SocketServer;