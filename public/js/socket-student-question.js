var socket = io.connect('http://localhost/question');
var teacher = $("#key").val();
var user = $("#username").val();
var container = $("#container");

socket.emit("newStudent",  {teacher: teacher, user: user});

socket.on("startStudent", function(html){
	container.fadeOut(250, function(){
		container.empty()
				 .append(html)
				 .fadeIn(250);
		$("#submit-answer").click(function(e){
			e.preventDefault();
			var answer = $(":checked").val();
			socket.emit("answer", {answer: answer});
		});
	});
});