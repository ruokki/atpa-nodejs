var socket = io.connect('http://localhost/');
var teacher = $("#key").val();
var user = $("#username").val();
var container = $("#container");

// Connexion à une question
socket.emit("initQuestion", teacher);

// Au lancement d'une question
socket.on("startQuestion", function(question){
	container.fadeOut(250, function(){
		container.empty();
		document.title = question.text;
		var answers = question.answers;
		var answerHtml = '';
		for(var i = 0; i < answers.length; i++) {
			answerHtml += '<div class="row">'
					      		+ '<label>'
					      			+ answers[i].name 
						    		+ '<input class="check-reponse" type="' + question.type + '"  name="rep" data-correct="' + answers[i].correct + '" value="' + i + '" >'
						    	+ '</label>'
					    	+ '</div>';
		}
		container.html(
			'<div class="small-10 small-centered columns"> '
				+ '<form role="form">'
					+ '<div class="row">'
					    + '<div class="small-12  columns no-padding">'
					      + '<h3>' + question.text + '</h3>'
					    + '</div>'
				  	+ '</div>'
			      	+ '<div class="row panel panel-form">'
				    	+ '<div class="small-12 columns" id="">'
				    	+ answerHtml
			    		+ '<input type="hidden" id="value-timer" value="' + question.timer+ '">'
				    	+ '</div>'
			      	+ '</div>'
				  	+ '<div class="row">'
				  		+ '<button type="button" id="submit-answer" class="small btn-envoi">Répondre</button>'
				  	+ '</div>'
				+ '</form>'
			+ '</div>'
		);
		container.fadeIn(250);
		// Réponse à une question
		$("#submit-answer").click(function(e){
			e.preventDefault();
			var answers = $("input:checked");
			var answer = [];
			if(answers.length === 1) {
				answer.push(answers.val());
			}
			else {
				answers.each(function(index, elem){
					answer.push(elem.value);
				});
			}
			$(this).attr("disabled", "disabled");
			$("input").attr("disabled", "disabled");
			socket.emit("answerQuestion", teacher, answer);
		})
	});
})

socket.on("endQuestion", function(){
	$("#submit-answer, input").attr("disabled", "disabled");
});