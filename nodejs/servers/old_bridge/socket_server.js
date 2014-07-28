
var io = require('socket.io')
    ,redis = require('redis')
    ,url = require('url')
    ;

var logger = require('./logger')
    ;

var backendAuth = require('../../backend_auth.js');

module.exports = SocketServer;

function SocketServer(port) {

    var socketServer = io.listen(port);

    socketServer.configure(function() {

        socketServer.set('authorization', function(data, accept){

            if (data && data.query && data.query.sessionID) {

                logger.log('debug', 'bridgeController sessionID is:', data.query.sessionID);
                var sessionID = data.query.sessionID;
                var bridgeAuthURL = Bridge.DJANGO_URL+ 'current_bridge/bridge/';

                backendAuth(bridgeAuthURL, sessionID).then(function(authData) {

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
    })

    return socketServer;
}