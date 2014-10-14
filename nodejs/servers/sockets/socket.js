
var cookie_reader = require('cookie');

var backendAuth = require('../../backendAuth.js')
    ,Errors = require('../../errors')
    ;

function SocketServer() {

}

SocketServer.prototype.setupAuthorization = function(socketServer) {

    /* Setup authorization for socket io >1.0 */
    var self = this;

    socketServer.use(function(socket, next) {

        console.log('socket request is', socket.handshake.query.sessionID);
        if(socket.handshake && socket.handshake.query && socket.handshake.query.sessionID) {
            var protoConfig = {
                sessionID: socket.handshake.query.sessionID
            }
        } else {
            next(new Errors.Unauthorized('No sessionID was provided'));
        }
        console.log('protoConfig', protoConfig);
        console.log('authURL', self.config);
        self.getConnectionConfig(self.config.authURL, protoConfig).then(function(config) {
            socket.config = config;
            socket.config.address = socket.handshake.address | "";
            console.log('getConnectionConfig response', config);
            next();
        }, function(error) {

            console.log(error);
            next(error);
        });
    });
}

SocketServer.prototype.setupLegacyAuthorization = function(socketServer) {

    /* Setup authorization for socket io <1.0 */
    var self = this;
    // Authenticate the sessionid from the socket with django
    socketServer.configure(function() {

        socketServer.set('authorization', function(data, accept) {

            var sessionID;

            console.log('authorization ran', data.headers);
            if(data && data.headers && data.headers.cookie) {
                // Pull out the cookies from the data
                var cookies = cookie_reader.parse(data.headers.cookie);
                console.log('authorization cookies', cookies);
                sessionID = cookies.sessionid;
                console.log('authorization sessionID', sessionID);
            }
            if(data && data.query && data.query.sessionID) {
                console.log('data.query is', data);
                sessionID = data.query.sessionID;
            }

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

    var self = this;

    console.log('oldConfig', oldConfig);
    var deferredConfig = Q.defer();

    backendAuth(authURL, oldConfig.sessionID).then(function(authData) {

        var publicationAddresses = new Array();
        if (authData.controllers) {
            authData.controllers.forEach(function(controller) {
                publicationAddresses.push(controller.user.cbid)
            });
        }

        console.log('djangoURL is', self.config);

        var config = {
            sessionID: oldConfig.sessionID,
            subscriptionAddress: authData.cbid,
            publicationAddresses: publicationAddresses,
            address: oldConfig.address,
            email: authData.email,
            djangoURL: self.config.djangoURL,
            djangoRootURL: self.config.djangoRootURL
        }

        //data.config.address = data.address
        deferredConfig.resolve(config);

    }, function(error) {

        deferredConfig.reject(error);
    }).done();

    return deferredConfig.promise;
}

module.exports = SocketServer;