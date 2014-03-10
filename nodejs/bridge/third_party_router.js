
var fs = require('fs');

/* Routes messages to and from entities outside CB, which aren't bridges */

module.exports = thirdPartyRouter;

function thirdPartyRouter(message, response){

    console.log('thirdPartyRouter', message);
    var channel = message.channel;
    if (!channel) {
        response.reject('This message cannot be routed because it has no channel', message);
        return;
    };

    switch (channel) {

        case 'APPID1':
            //response.reject('Rejected!');
            console.log('about to write to file');
            writeToFile(message, response);
            break;

        default:
            response.reject('The channel for this message was not found', message);

    };
}

var writeToFile = function(message, response) {

    var dataPath = __dirname + '/data/';
    console.log('__dirname is', __dirname);
    var fileName = message.source + "-" + message.channel;
    // Check if directory exists
    fs.stat(dataPath, function(err, stats) {

        if (err) {response.reject(err)};
        if (!stats.isDirectory()) {
            // Make directory if it doesn't exist
            fs.mkdirSync(dataPath);
        }
        // Append the body of the message to the file
        fs.appendFile(dataPath + fileName, message.body, function(err) {

            if (err) {response.reject(err)};
        });
    });
}
