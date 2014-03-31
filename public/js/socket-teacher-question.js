var socket = io.connect('http://localhost/');

var teacher = $("#teacher").val();
var nbCo = $("#nbCo");
var container = $("#container");
var $nbRep;
var nbRep = 0;
var idQuestion = $("#question").val();
var answers;

// Connexion à une question
socket.emit("initQuestion", teacher);

// En cas de connexion d'un étudiant
socket.on("newStudent", function(){
	nbCo.text(parseInt(nbCo.text()) + 1);
});

// Lancement d'une question
socket.on("startQuestion", function(question){
	document.title = question.text;
	answers = question.answers;
	container.html(
		'<section class="main-section">'
			+ '<div class="row">'
			    + '<div class="small-12 columns">'
			    	+ '<section id="section-main" class="container container-marge clearfix">'
			    		+ '<div class="small-10 small-centered columns text-center"> '
							+ '<h2>' + question.text + '</h2>'
							+ '<input type="hidden" id="value-timer" value="' + question.time + '">'
							+ '<div id="timer" class="timer-large">'
				      			+ '<span></span>'
					      	+ '</div>'
					      	+ '<p id="timer-msg"></p>'
					      	+ '<p id="wrap-rep">Nombre d\'étudiant ayant répondu: <span id="nbRep" class="bleu bold">0</span></p>'
					      	+ '<button type="button" id="btn-stat" class="large">Résultat</button>'
						+ '</div>'
					+ '</section>'
			    + '</div>'
			+ '</div>'
		+ '</section>'
		+ '<script src="/js/timer.js"></script>'
	);
	container.fadeIn(500);
	timer(function(){
		socket.emit("endQuestion", teacher);
	});
});

// Réponse à une question
socket.on("answerQuestion", function(){
	$nbRep = $("#nbRep");
	$nbRep.text(++nbRep);
});

// Bouton pour déclencher le timer
$("#go").click(function(e){
	e.preventDefault();
	container.fadeOut(250, function(){
		container.empty();
		socket.emit("startQuestion", teacher, idQuestion);
	});
});

// Fin d'une question
socket.on("endQuestion", function(result){
	var result = result; // réponses des étudiants
	var resultLength = result.length;
	var dataForChart = [];

	/*
	 * Couleurs du graphe
	 * #b54b99 : violet
	 * #e32636 : rouge pâle
	 * #1dacd6 : bleu clair
	 * #fff600 : jaune
	 * #4cbb17 : vert clair
	 * #138808 : vert
	 * #035096 : bleu
	 * #ff8f00 : orange
	 * #c80815 : rouge
	 */

	 var colors = [
	 	'#b54b99',
	 	'#e32636',
	 	'#1dacd6',
	 	'#fff600',
	 	'#4cbb17',
	 	'#138808',
	 	'#035096',
	 	'#ff8f00',
	 	'#c80815'
	 ];

	 var answersHTML = '<ul id="answers" class="text-left">';
	$.each(answers, function(index, elem){
		var cpt = 0;
		var colorTmp = colors.pop();
		for(var i = 0; i < resultLength; i++) {
			if(index == result[i]) cpt++;
		}
		dataForChart.push({value: cpt, color: colorTmp});
		if(elem.correct) {
			answersHTML += '<li><span class="legend" style="background-color:' + colorTmp + '"></span>' + elem.name + '<i class="foundicon-checkmark green right"></i></li>';
		}
		else {
			answersHTML += '<li><span class="legend" style="background-color:' + colorTmp + '"></span>' + elem.name + '<i class="foundicon-remove red right"></i></li>';
		}
	});
	answersHTML += "</ul>";

	$("#btn-stat").click(function(){
		$("#btn-stat, #wrap-rep, #timer, #timer-msg").hide(250);
		$(this).parent().append('<canvas id="myChart" width="235" height="200"></canvas>');
		$(this).parent().append(answersHTML);
		$(this).parent().append('<a href="/list/question" class="button">Retour à la liste des questions</a>');
		$("#answers").hide().fadeIn(250);
		$("#myChart").hide().fadeIn(250, function(){
			var ctx = document.getElementById("myChart").getContext("2d");
			var myNewChart = new Chart(ctx).Pie(dataForChart, {
				segmentStrokeColor: "#E9E8EF"
			});
		});
	});

});