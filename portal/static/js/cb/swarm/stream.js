
function SwarmStream(inbound, outbound) {
    var self = this,
        ln = this.lstn = {},
        buf = [];

    this.inbound = inbound;
    this.outbound = outbound;

    this.inbound.on('data', function(data) {
        console.log('stream inbound', data);
        try {
            ln.data && ln.data(data);
        } catch (ex) {
            console.error('message processing fails', ex);
            ln.error && ln.error(ex.message);
        }
    });

    /*
    ws.on('open', function () {
        buf.reverse();
        self.buf = null;
        while (buf.length) {
            self.write(buf.pop());
        }
    });
    ws.on('close', function () { ln.close && ln.close(); });
    ws.on('message', function (msg) {
        try {
            ln.data && ln.data(msg);
        } catch (ex) {
            console.error('message processing fails', ex);
            ln.error && ln.error(ex.message);
        }
    });
    ws.on('error', function (msg) { ln.error && ln.error(msg); });
    */
}

module.exports = SwarmStream;

SwarmStream.prototype.on = function (evname, fn) {
    if (evname in this.lstn) {
        throw new Error('not supported');
    }
    this.lstn[evname] = fn;
};

SwarmStream.prototype.write = function (data) {

    console.log('stream outbound', data);

    this.outbound.trigger('data', {
        swarm: data
    });
    /*
    if (this.buf) {
        this.buf.push(data.toString());
    } else {
        this.ws.send(data.toString());
    }
    */
};
