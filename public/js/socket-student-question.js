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
			var checked = $(":checked");
			var answer;
			if(checked.length > 1) {
				answer = [];
				checked.each(function(index, elem){
					answer.push($(elem).val());
				});
			}
			else {
				answer = checked.val();
			}
			socket.emit("answer", {answer: answer});
		});
	});
});