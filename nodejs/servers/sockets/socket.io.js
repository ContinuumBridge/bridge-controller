
var io = require('socket.io')
    ,redis = require('redis')
    ,url = require('url')
    ;

//var logger = require('./logger')
    //;

var backendAuth = require('../../backendAuth.js');

module.exports = SocketIOServer;

function SocketIOServer(server, port, djangoURL) {

    var socketServer = io.listen(port);

    socketServer.parent = server;

    socketServer.configure(function() {

        socketServer.set('authorization', function(data, accept){

            if (data && data.query && data.query.sessionID) {

                socketServer.parent.logger.log('debug', 'bridgeController sessionID is:', data.query.sessionID);
                var sessionID = data.query.sessionID;
                var authURL = djangoURL + 'current_bridge/bridge/';

                backendAuth(authURL, sessionID).then(function(authData) {

                    data.authData = authData;
                    data.sessionID = sessionID;
                    //logger.log('debug', 'authData from backendAuth is', authData);
                    accept(null, true);

                }, function(error) {

                    logger.error(error);
                    accept('error', false);
                });
            }
        });
    });

    socketServer.getConnectionData = function(socket) {

        if (!socket.connectionData) {

            var authData = socket.handshake.authData;
            socket.connectionData = {
                subscriptionAddress: authData.cbid,
                sessionid: socket.handshake.sessionid
            }
            socket.connectionData.publicationAddresses = new Array();
        }
        return controllerData;
    };

    return socketServer;
}