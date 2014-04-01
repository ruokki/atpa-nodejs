var socket = io.connect('http://localhost');
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
	});
});