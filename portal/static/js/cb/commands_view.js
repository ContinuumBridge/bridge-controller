
CBApp.CommandsView = Marionette.ItemView.extend({
    
    id: 'commands',
    //className: 'span4',
    template: '#commandsTemplate',

    events: {
        'click #start': 'startClick',
        'click #stop': 'stopClick',
        'click #update': 'updateClick',
        'click #send-log': 'sendLog',
        'click #restart': 'restart',
        'click #reboot': 'reboot',
        'click #upgrade': 'upgrade'
    },

    onRender: function() {
        
        var $commands = this.$('#commands');
        
        window.socket.on('message', function(message) {
            console.log('Server >', message);
            $commands.append(message + '&#xA;');
            $commands.scrollTop($commands[0].scrollHeight);
        });
    },
    
    startClick: function() {

        var message = {};
        message.message = "command";
        message.body = "start";
        window.socket.publish(message, function(data){
            console.log(data);
        });
    
    },
    
    stopClick: function() {

        var message = {};
        message.message = "command";
        message.body = "stop";
        window.socket.publish(message, function(data){
            console.log(data);
        });

    },
    
    updateClick: function() {

        var message = {};
        message.message = "command";
        message.body = "update_config";
        window.socket.publish(message, function(data){
            console.log(data);
        });

    },

    sendLog: function() {

        var message = {};
        message.message = "command";
        message.body = "sendlog";
        window.socket.publish(message, function(data){
            console.log(data);
        });

    },

    restart: function() {

        var message = {};
        message.message = "command";
        message.body = "restart";
        window.socket.publish(message, function(data){
            console.log(data);
        });

    },
    
    reboot: function() {


        var message = {};
        message.message = "command";
        message.body = "reboot";
        window.socket.publish(message, function(data){
            console.log(data);
        });


    },

    upgrade: function() {

        var message = {};
        message.message = "command";
        message.body = "upgrade";
        window.socket.publish(message, function(data){
            console.log(data);
        });
    }
});

