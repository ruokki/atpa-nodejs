var socket = io.connect('http://localhost');
var key = $("#key").text();
var nbCo = $("#nbCo");
var container = $("#container");
var indexQuestion = 0;

// Connexion à une session
socket.emit("initSession", key);

// Connexion d'un nouvel étudiant
socket.on("newStudent", function(){
	nbCo.text(parseInt(nbCo.text()) + 1);
});

// Bouton de lancement d'une session
$("#go").click(function(e){
	e.preventDefault();
	container.fadeOut(250, function(){
		container.empty();
		socket.emit("startSession", key, indexQuestion);
	})
});

// Nouvelle question
socket.on("newQuestion", function(question){
	document.title = question.text;
	var html = 
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
			      	+ '<a href="" id="btn-stat" class="button large">Résultat</a>'
				+ '</div>'
			+ '</section>'
	    + '</div>'
	  + '</div>'
	+ '</section>'
	+ '<script src="/js/timer.js"></script>';
	container.append(html);
	container.fadeIn(250);
	timer(function(){
		socket.emit("endQuestionSession", key);
	});
});