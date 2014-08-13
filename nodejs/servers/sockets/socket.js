
var cookie_reader = require('cookie');

var backendAuth = require('../../backendAuth.js');

function SocketServer() {

}

SocketServer.prototype.setupAuthorization = function(socketServer) {

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
                console.log('data.query is', data);
                sessionID = data.query.sessionID;
            }

            //var appAuthURL = Portal.DJANGO_URL + 'current_user/user/';
            var protoConfig = {
                sessionID: sessionID,
                address: data.address
            }
            console.log('protoConfig', protoConfig);
            console.log('authURL', self.config);
            self.getConnectionConfig(self.config.authURL, protoConfig).then(function(config) {
                data.config = config;
                data.config.address = data.address;
                console.log('getConnectionConfig response', config);
                accept(null, true);
            }, function(error) {

                accept('error', false);
            });
        });
    });
}

SocketServer.prototype.getConnectionConfig = function(authURL, oldConfig) {

        console.log('oldConfig', oldConfig);
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
                address: oldConfig.address,
                email: authData.email
            }

            //data.config.address = data.address
            deferredConfig.resolve(config);

        }, function(error) {

            deferredConfig.reject(error);
        });

        return deferredConfig.promise;
}

module.exports = SocketServer;