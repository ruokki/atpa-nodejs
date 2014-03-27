var socket = io.connect('http://localhost/');

var teacher = $("#teacher").val();
var nbCo = $("#nbCo");
var container = $("#container");
var nbRep;
var idQuestion = $("#question").val();
var answers;

nbCo.text(0);

socket.emit("initQuestion", teacher);

socket.on("newStudent", function(){
	nbCo.text(parseInt(nbCo.text()) + 1);
});

socket.on("startQuestion", function(question){
	answers = question.answers;
	container.html(
		'<section class="main-section">'
			+ '<div class="row">'
			    + '<div class="small-12 columns">'
			    	+ '<section id="section-main" class="container container-marge">'
			    		+ '<div class="small-10 small-centered columns text-center"> '
							+ '<h2>' + question.text + '</h2>'
							+ '<input type="hidden" id="value-timer" value="' + question.time + '">'
							+ '<div id="timer" class="timer-large">'
				      			+ '<span></span>'
					      	+ '</div>'
					      	+ '<p id="timer-msg"></p>'
					      	+ '<p>Nombre d\'étudiant ayant répondu: <span id="nbRep" class="bleu bold">0</span></p>'
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

socket.on("answerQuestion", function(){
	nbRep = $("#nbRep");
	nbRep.text(parseInt(nbRep.text()) + 1);
});

$("#go").click(function(e){
	e.preventDefault();
	container.fadeOut(250, function(){
		container.empty();
		socket.emit("startQuestion", teacher, idQuestion);
	});
});

socket.on("endQuestion", function(result){
	console.log(result);
});