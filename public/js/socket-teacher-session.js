var socket = io.connect('http://localhost/session');
var key = $("#key").text();
var nbCo = $("#nbCo");
var container = $("#container");
var indexQuestion;

nbCo.text(0);

socket.on('studentConnected', function(data){
	nbCo.text(data);
});

$("#go").click(function(e){
	e.preventDefault();
	socket.emit('launchQuestion');
	container.fadeOut(500, function(){
		container.empty();
	});
	indexQuestion = 0;
	$.ajax({
		url: '/ajax/getQuestion',
		type: 'post',
		data: {
			key: key,
			indexQuestion: indexQuestion
		},
		success: function(data) {

		}
	})

});