$(document).ready(function(){
  var socket = window.socket = io.connect('54.200.16.244', {port: 4000});
  
  socket.on('connect', function(){
	console.log("connect");
  });
  
  //var entry_el = $('#comment');
		   
  socket.on('message', function(message) {
	//Escape HTML characters
	var data = message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
	
	//Append message to the bottom of the list
	$('#devices').append('<li>' + data + '</li>');
	window.scrollBy(0, 10000000000);
	//entry_el.focus();
  });
				 
  /*entry_el.keypress(function(event){
	//When enter is pressed send input value to node server
	if(event.keyCode != 13) return;
	var msg = entry_el.attr('value');
	if(msg){
	   socket.emit('send_message', msg, function(data){
			console.log(data);
	   });
	
	//Clear input value   
	entry_el.attr('value', '');
   }
  });*/
});