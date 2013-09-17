var http = require('http');
var backboneio = require('backbone.io');
//var pieshop = require('pieshop');
var pieshop = require('../node_modules/pieshop/lib/pieshop.min.js');

//var fs = require('fs');

// file is included here:
//eval(fs.readFileSync('../node_modules/pieshop/pieshop.min.js')+'');

console.log('pieshop is', pieshop);

var server = http.createServer();    
server.listen(4000);

var apps = {};

apps.backend = backboneio.createBackend();

//apps.resource = function() {}

apps.resource = pieshop.core.resource({
    'resource_uri': 'http://localhost:8000/api/v1/app/',
});

newQuery = pieshop.core.query(apps.resource);
console.log('newQuery is', newQuery);

/*
pieshop.core.Query(apps.resource).each(function(app) {
    console.log(app);
});

/*
apps.resource = pieshop.resource({
    'resource_uri': 'http://localhost/api/v1/app/',
});

pieshop.core.query(apps.resource).each(function(app) {
    console.log(app);
});
*/

/*
apps.use(function(req, res, next) {
    console.log(req.backend);
    console.log(req.method);
    console.log(JSON.stringify(req.model));
    next();
});
*/

apps.backend.read(function(req, res) {

    console.log(req.backend);
    console.log(req.method);
    console.log(JSON.stringify(req.model));
    /*
    console.log('mymodels are');
    res.end(mymodels);
    */
    
});

apps.backend.use(backboneio.middleware.memoryStore());

backboneio.listen(server, { apps: apps.backend });

