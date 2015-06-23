"use strict";

function SocketStream(socket) {
    var self = this,
        ln = this.lstn = {},
        buf = [];

    this.socket = socket;

    socket.on('close', function () { ln.close && ln.close(); });

    socket.on('swarm', function (msg) {
        try {
            ln.data && ln.data(msg);
        } catch (ex) {
            console.error('message processing fails', ex);
            ln.error && ln.error(ex.message);
        }
    });
    socket.on('error', function (msg) { ln.error && ln.error(msg); });
}

module.exports = SocketStream;

SocketStream.prototype.on = function (evname, fn) {
    if (evname in this.lstn) {
        throw new Error('not supported');
    }
    this.lstn[evname] = fn;
};

SocketStream.prototype.write = function (data) {

    console.log('SocketStream write', data);
    this.socket.emit('swarm', data);
    /*
     if (this.buf) {
     this.buf.push(data.toString());
     } else {
     this.ws.send(data.toString());
     }
     */
};

module.exports = SocketStream;
//env.streams.ws = env.streams.wss = SocketStream
