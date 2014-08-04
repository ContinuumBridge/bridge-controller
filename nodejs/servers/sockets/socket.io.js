
var io = require('socket.io')
    ,redis = require('redis')
    ,url = require('url')
    ;

//var logger = require('./logger')
    //;

var backendAuth = require('../../backendAuth.js');

module.exports = SocketIOServer;

function SocketIOServer(server, authURL, port) {

    var socketServer = io.listen(port);

    socketServer.parent = server;

    socketServer.configure(function() {

        socketServer.set('authorization', function(data, accept){

            if (data && data.query && data.query.sessionID) {

                console.log('data in socketServer is', data);
                socketServer.parent.logger.log('debug', 'sessionID is:', data.query.sessionID);
                var protoConfig = {
                    sessionID: data.query.sessionID,
                    address: data.address
                }
                socketServer.getConnectionConfig(authURL, protoConfig).then(function(config) {

                    console.log('Auth success, config is', config);
                    data.config = config;
                    data.config.address = data.address
                    accept(null, true);
                }, function(error) {

                    socketServer.parent.logger.error(error);
                    accept('error', false);
                });
            }
        });
    });

    socketServer.getConnectionConfig = function(authURL, oldConfig) {

        var deferredConfig = Q.defer();

        backendAuth(authURL, oldConfig.sessionID).then(function(authData) {

            if (authData.controllers) {
                var publicationAddresses = new Array();
                authData.controllers.forEach(function(controller) {
                    publicationAddresses.push(controller.user.cbid)
                });
            }

            var config = {
                sessionID: oldConfig.sessionID,
                subscriptionAddress: authData.cbid,
                publicationAddresses: publicationAddresses,
                address: oldConfig.address
            }

            deferredConfig.resolve(config);

        }, function(error) {

            deferredConfig.reject(error);
        });

        return deferredConfig.promise;
    };

    return socketServer;
}