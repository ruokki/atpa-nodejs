var socket = io.connect('http://localhost/question');

var teacher = $("#teacher").val();
var nbCo = $("#nbCo");
var container = $("#container");

nbCo.text(0);

socket.on('studentConnected', function(data){
	nbCo.text(data);
});

$("#go").click(function(e){
	e.preventDefault();
	socket.emit('launchQuestion');
	container.fadeOut(500, function(){
		container.empty();
		socket.emit("startQuestion", {teacher: teacher});
	});
});

socket.on("startTeacher", function(html){
	container.append(html);
	container.fadeIn(500);
});