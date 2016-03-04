
var http = require('http')
    , https = require('https')
    , express = require('express');

var cookie_reader = require('cookie');

var backendAuth = require('../../backendAuth.js')
    ,Errors = require('../../errors')
    ;

function SocketServer(options) {

}

SocketServer.prototype.setupHTTPServer = function(options) {

    //var httpApp = this.httpApp = express();

    if (options.key && options.cert) {

        console.log('setup https');
        console.log('options.key', options.key);
        console.log('options.cert', options.cert);

        var serverOptions = {
            key: options.key,
            cert: options.cert,
            requestCert: true
        }

        /*
        httpApp.get('*', function(req,res){
            console.log('req', req);
            console.log('res', res);
            //res.redirect('https://127.0.0.1:8080'+req.url)
        });
        */

        var httpServer = this.httpServer = https.createServer(serverOptions, function(req, res) {
            console.log('https req', req);
            console.log('https res', res);
        });
        //httpServer.route('*').get

    } else {

        console.log('setup http');

        this.httpServer = http.createServer();

        /*
        httpApp.get('*', function(req, res) {
            console.log('route *');
            console.log('req', req);
            console.log('res', res);
            //res.redirect('https://127.0.0.1:8080'+req.url)
        });
        */
    }
}

SocketServer.prototype.setupAuthorization = function(socketServer, getConfig) {

    /* Setup authorization for socket io >1.0 */
    var self = this;

    socketServer.use(function(socket, next) {

        var sessionID;
        var handshake = socket.handshake;

        if(handshake.headers && handshake.headers.cookie) {
            // Pull out the cookies from the data
            var cookies = cookie_reader.parse(handshake.headers.cookie);
            sessionID = cookies.sessionid;
        } else if (handshake.query && handshake.query.sessionID) {
            sessionID = handshake.query.sessionID;
            //console.log('handshake.query.sessionID is', handshake.query.sessionID);
        } else {
            next(new Errors.Unauthorized('No sessionID was provided'));
        }

        console.log('Authorisation sessionID', sessionID);
        //console.log('socket sessionID is', sessionID);

        getConfig(sessionID).then(function(config) {
            socket.config = config;
            socket.sessionID = sessionID;
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
            getConfig(sessionID).then(function(config) {
                data.config = config;
                //data.config.address = data.address;
                //console.log('Legacy getConnectionConfig config', config);
                accept(null, true);
            }, function(error) {

                accept('error', false);
            });
        });
    });
}

module.exports = SocketServer;
