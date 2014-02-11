
CBApp.CommandsView = Marionette.ItemView.extend({
    
    id: 'commands',
    //className: 'span4',
    template: '#commandsTemplate',

    events: {
        'click #start': 'startClick',
        'click #stop': 'stopClick',
        'click #update': 'updateClick',
        'click #config': 'configClick',
        'click #restart': 'restart',
        'click #reboot': 'reboot',
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
    
        window.socket.emit('message', '{"msg": "cmd", "body": "start"}', function(data){
            console.log(data);
        });
    
    },
    
    stopClick: function() {
    
        window.socket.emit('message', '{"msg": "cmd", "body": "stop"}', function(data){
            console.log(data);
        });
    
    },
    
    updateClick: function() {
    
        window.socket.emit('message', '{"msg": "cmd", "body": "update"}', function(data){
            console.log(data);
        });
    
    },
    
    configClick: function() {
    
        window.socket.emit('message', '{"msg": "cmd", "body": "update_config"}', function(data){
            console.log(data);
        });
    
    },
    
    restart: function() {
    
        window.socket.emit('message', '{"msg": "cmd", "body": "restart"}', function(data){
            console.log(data);
        });
    
    },
    
    reboot: function() {
    
        window.socket.emit('message', '{"msg": "cmd", "body": "reboot"}', function(data){
            console.log(data);
        });
    
    },

});

