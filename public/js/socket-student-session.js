var socket = io.connect('http://' + document.domain + '/');
var key = $("#key").val();
var user = $("#username").val();
var container = $("#container");

// COnnexion à la session
socket.emit("initSession", key);

// Nouvelle question
socket.on("newQuestion",function(question){
	container.fadeOut(250,function(){
		container.empty();
		document.title = question.text;
		var answerLength = question.answers.length;
		var html =
		'<div class="small-10 small-centered columns"> '
			+ '<form role="form">'
				+ '<div class="row">'
				    + '<div class="small-12  columns no-padding">'
				      + '<h3>' + question.text + '</h3>'
				    + '</div>'
			  	+ '</div>'
		      	+ '<div class="row panel panel-form">'
			    	+ '<div class="small-12 columns">';
				    	for (var i = 0; i < answerLength; i++) {
				    		html += 
				    		'<div class="row">'
						      		+ '<label>'
						      			+ question.answers[i].name
							    		+ '<input class="check-reponse" type="' + question.type + '"  name="rep" data-correct="' + question.answers[i].correct + '" value="' + i + '" >'
							    	+ '</label>'
						    	+ '</div>';
				    	}
		    		html += 
		    		  '<input type="hidden" id="value-timer" value="' + question.time + '">'
			    	+ '</div>'
		      	+ '</div>'
			  	+ '<div class="row">'
			  		+ '<button type="button" id="submit-answer" class="small btn-envoi">Répondre</button>'
			  	+ '</div>'
			+ '</form>'
		+ '</div>';
		container.html(html);
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
			socket.emit("answerSession", key, answer);
		});
	});
});

socket.on("endQuestionSession", function(){
	$("#submit-answer, input").attr("disabled", "disabled");
	$("#pop-fin-question").removeClass("hide");
	$("#close-popup").click(function(e){ 
		e.preventDefault(); 
		$("#pop-fin-question").addClass("hide");
	});
});