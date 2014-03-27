/* -------------------------------------------------- */
/*     Gestion des pages destinées à l'enseignant     */
/* -------------------------------------------------- */


/*
 * GET welcome page
 * Affiche la page d'accueil
 */
exports.welcome = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	res.render('index', {
		title : 'Accueil'
	})
}


/* ---------------------------- */
/*     Gestion des question     */
/* ---------------------------- */


/*
 * GET addQuestion page
 * Affiche le formulaire d'ajout de question
 */
exports.addQuestion = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var category = require('../models/category');

	category.getAllCategory(function(result){
		var categories = result;
		res.render('teacher/questionForm', {
			title: 'Ajouter une question',
			name: req.session.username,
			categories: categories,
			valid: "Ajouter",
			pageTitle: 'Ajouter une question'
		});
	});
}

/*
 * GET editQuestion page
 * Affiche le formulaire d'édition d'une question
 */
exports.editQuestion = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var category = require('../models/category');
	var question = require('../models/question');
	var idQuestion = req.params.id;
	var status;
	var idTeacher = req.session.idUser;

	if(req.params.status === 'saved') {
		status = 'Vos modifications ont bien été enregistrées';
	}
	else if (req.params.status === 'error') {
		status = 'Une erreur s\'est produite';
	}
	else {
		status = false;
	}

	category.getAllCategory(function(result){
		var categories = result;

		question.getQuestion(idQuestion, function(err, data){
			if(err) {
				res.redirect('/add/question');
			}
			else {
				var form = {
					type: data.type,
					answers: data.answers,
					question: data.text,
					timer: data.time,
					category: data._id_cat
				}

				res.render('teacher/questionForm', {
					title: 'Éditer une question',
					name: req.session.username,
					categories: categories,
					status: status,
					form : form,
					valid: 'Éditer',
					pageTitle: 'Éditer une question'
				});
			}
		});
	});
}

/*
 * POST editQuestion page
 * Vérifie que les champs ont bien été remplis
 * Si oui, modifie la question en base
 * Si non, réaffiche le formulaire pré-rempli avec les erreurs à corriger
 */
exports.editQuestionPost = function(req, res) {

	
	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var question = require('../models/question');
	var idQuestion = req.params.id;

	var errors = [];
	// Type de question (choix multiple, choix unique)
	var type = req.body.type; 

	// Texte de la question
	var text = req.body.question;
	if(text === "") {
		errors.push("Veuiller remplir le champ Question");
	}

	// Valeur du timer
	var time = req.body.timer;
	if(time === "") {
		errors.push("Veuiller remplir le champ Timer");
	}
	else if (!time.match(/^[0-9]*$/)) {
		errors.push("La valeur du champ Timer doit être un nombre");
	}

	// Index de la catégorie
	var idCat = req.body.category;

	// Récupére les réponses et leurs checkbox/radios associées
	if(type === 'radio') {
		var answers = req.body.reponse.radio;
		var correct;
		if(req.body.radio) {
			correct = req.body.radio.rep;
		}
		else {
			correct = '';
			errors.push("Veuiller choisir une bonne réponse");
		}
	}
	else if (type === 'checkbox') {
		var answers = req.body.reponse.checkbox;
		var correct;
		if(req.body.checkbox) {
			correct = req.body.checkbox.rep;
		}
		else {
			correct = '';
			errors.push("Veuiller choisir au moins une bonne réponse");
		}
	}

	var answersLength = answers.length;
	var answersFinal = [];

	correct = typeof(correct) === 'object' ? correct.toString() : correct;

	// Parcours de la tableau contenant les questions
	for(var i = 0; i < answersLength; i++) {
		var isCorrect = false;

		if(correct.indexOf(i) > -1) {
			isCorrect = true;
		}

		if(answers[i].trim() === '') {
			errors.push('Veuiller remplir la question ' + (i + 1));
		}

		answersFinal.push({
			name: answers[i],
			correct: isCorrect
		});
	}

	/* 
	 * Si aucune erreur, on enregistre les modifications en base et on redirige vers une autre page
	 * Sinon, on réaffiche le formulaire pré-rempli avec les erreurs détectées
	 */
	if(!errors.length) {

		question.updateQuestion(idQuestion, idCat, text, type, time, answersFinal, function(err, result){
			if(err) {
				res.redirect('/edit/question/' + idQuestion + '/error');
			}
			else {
				res.redirect('/edit/question/' + idQuestion + '/saved');
			}
		});
	}
	else {
		var category = require('../models/category');

		var form = {
			question : text,
			type: type,
			category: idCat,
			timer: time,
			answers: answersFinal
		}

		category.getAllCategory(function(result){
			var categories = result;
			res.render('teacher/questionForm', {
				title: 'Éditer une question',
				name: req.session.username,
				categories: categories,
				errors: errors,
				form: form,
				valid: 'Modifier',
				pageTitle: 'Éditer une question'
			});
		});
	}
}

/*
 * POST addQuestion page
 * Vérifie que les champs ont bien été remplis
 * Si oui, enregistre la question en base
 * Si non, réaffiche le formulaire pré-rempli avec les erreurs à corriger
 */
exports.addQuestionPost = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var question = require('../models/question');

	var errors = [];
	// Type de question (choix multiple, choix unique)
	var type = req.body.type; 

	// Texte de la question
	var text = req.body.question;
	if(text === "") {
		errors.push("Veuiller remplir le champ Question");
	}

	// Valeur du timer
	var time = req.body.timer;
	if(time === "") {
		errors.push("Veuiller remplir le champ Timer");
	}
	else if (!time.match(/^[0-9]*$/)) {
		errors.push("La valeur du champ Timer doit être un nombre");
	}

	// Index de la catégorie
	var idCat = req.body.category;

	// Récupére les réponses et leurs checkbox/radios associées
	if(type === 'radio') {
		var answers = req.body.reponse.radio;
		var correct;
		if(req.body.radio) {
			correct = req.body.radio.rep;
		}
		else {
			correct = '';
			errors.push("Veuiller choisir une bonne réponse");
		}
	}
	else if (type === 'checkbox') {
		var answers = req.body.reponse.checkbox;
		var correct;
		if(req.body.checkbox) {
			correct = req.body.checkbox.rep;
		}
		else {
			correct = '';
			errors.push("Veuiller choisir au moins une bonne réponse");
		}
	}

	var answersLength = answers.length;
	var answersFinal = [];

	correct = typeof(correct) === 'object' ? correct.toString() : correct;

	// Parcours de la tableau contenant les questions
	for(var i = 0; i < answersLength; i++) {
		var isCorrect = false;

		if(correct.indexOf(i) > -1) {
			isCorrect = true;
		}

		if(answers[i].trim() === '') {
			errors.push('Veuiller remplir la question ' + (i + 1));
		}

		answersFinal.push({
			name: answers[i],
			correct: isCorrect
		});
	}

	/* 
	 * Si aucune erreur, on enregistre en base et on redirige vers une autre page
	 * Sinon, on réaffiche le formulaire pré-rempli avec les erreurs détectées
	 */
	if(!errors.length) {

		question.addQuestion(idCat, req.session.idUser, text, type, time, answersFinal);

		res.redirect('/add/question');
	}
	else {
		var category = require('../models/category');

		var form = {
			question : text,
			type: type,
			category: idCat,
			timer: time,
			answers: answersFinal
		}

		category.getAllCategory(function(result){
			var categories = result;
			res.render('teacher/questionForm', {
				title: 'Ajouter une question',
				name: req.session.username,
				categories: categories,
				errors: errors,
				form: form,
				valid: 'Ajouter',
				pageTitle: 'Ajouter une question'
			});
		});
	}

}






exports.supprQuestion = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var category = require('../models/category');
	var question = require('../models/question');
	var idQuestion = req.params.id;
	var status;
	var idTeacher = req.session.idUser;

	if(req.params.status === 'saved') {
		status = 'La question a bien été supprimmée';
		console.log(status);
	}
	else if (req.params.status === 'error') {
		status = 'Une erreur s\'est produite';
		console.log(status);
	}
	else {
		status = false;
	}


	question.getQuestion(idQuestion, function(err){
		if(err) {
			res.redirect('/list/question');
		}
		else {
			question.removeQuestion(idQuestion, function(err, result){
				// à ameliorer
				if(err) {
					res.redirect('/list/question/');
					console.log("erreur de supression");
				}
				else {
					res.redirect('/list/question/');
				}
			});
		}
	});


}


















/* ---------------------------- */
/*     Gestion des sessions     */
/* ---------------------------- */



/*
 * GET addSession page
 * Affiche le formulaire d'ajout d'une session
 */
exports.addSession = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var question = require('../models/question');

	question.getAllQuestion(function(questionResult){
		res.render('teacher/sessionForm', {
			title: 'Créer une session',
			pageTitle: 'Créer une session',
			questions: questionResult
		});
	});
};

/*
 * POST addSession page
 * Enregistre les informations entrées dans le formulaire
 * Si elles sont valides, on les enregistre en base
 * Sinon on réaffiche le formulaire avec une alert contenant les erreurs
 */
exports.addSessionPost = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var session = require('../models/session');
	var question = require('../models/question');

	var label = req.body.label;
	var questions = req.body.questions;

	session.addSession(label, questions, req.session.idUser, function(err){
		if(err) {
			question.getAllQuestion(function(questionResult) {
				res.render('teacher/sessionForm', {
					title: 'Créer une session',
					pageTitle: 'Créer une session',
					questions: questionResult,
					error: 'Un problème est survenu lors de l\'enregistrement. Veuillez réessayer ultérieurement'
				});
			});
		}
		else {
			res.redirect('/add/session');
		}
	});
};

/*
 * GET editSession page
 * Affiche le formulaire d'édition d'une page
 */
exports.editSession = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var question = require('../models/question');
	var session = require('../models/session');
	var id = req.params.id;
	var status;

	if(req.params.status === 'saved') {
		status = 'Vos modifications ont bien été enregistrées';
	}
	else if (req.params.status === 'error') {
		status = 'Une erreur s\'est produite';
	}
	else {
		status = false;
	}

	session.getSession(id, function(err, result){
		if(err) {
			redirect('/add/session');
		}
		else {
			var session = result[0];
			question.getAllQuestion(function(questionResult){
				res.render('teacher/sessionForm', {
					title: 'Édition de la session',
					pageTitle: 'Édition de la session',
					questions: questionResult,
					session: session,
					status: status
				});
			});
		}
	});

};

/*
 * POST editSession page
 * Enregistre les informations entrées dans le formulaire
 * Si elles sont valides, on update base
 * Sinon on réaffiche le formulaire avec une alert contenant les erreurs
 */
exports.editSessionPost = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var session = require('../models/session');
	var question = require('../models/question');

	var label = req.body.label;
	var questions = req.body.questions;
	var id = req.params.id;

	var sessionInfo = {
		name : label,
		questions: questions
	};

	session.updateSession(id, label, questions, function(err, rowAffected){
		if(err) {
			question.getAllQuestion(function(questionResult) {
				res.render('teacher/sessionForm', {
					title: 'Édition de la session',
					pageTitle: 'Édition de la session',
					questions: questionResult,
					session: sessionInfo
				});
			});
		}
		else {
			res.redirect('/edit/session/' + id + '/saved');
		}
	});
};




/* ------------------- */
/*     Partie /list    */
/* ------------------- */

/*
 * GET listQuestion page
 */
exports.listQuestion = function(req, res) {
	var category = require('../models/category');
	var question = require('../models/question');

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}
	
	question.getAllQuestion(function(questionResult){
		category.getAllCategory(function(categoryResult){
			res.render('teacher/listQuestion', {
				title: 'Liste des questions',
				pageTitle: 'Liste des questions',
				categories: categoryResult,
				questions: questionResult
			});
		});
	});
}

/*
 * GET listSession page
 */
exports.listSession = function(req, res) {
	var session = require('../models/session');

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	session.getAllSession(req.session.idUser, function(result){
		res.render('teacher/listSession', {
			title: 'Liste des sessions',
			pageTitle: 'Liste des sessions',
			sessions : result
		})
	});
};


/*
 * GET listCategorie page
 */
exports.listCategorie = function(req, res) {
	var category = require('../models/category');
	var question = require('../models/question');

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}	

	category.getAllCategory(function(categoryResult){
		res.render('teacher/listCategorie', {
			title: 'Liste des categories',
			pageTitle: 'Liste des categories',
			categories: categoryResult,
		});
	});
}




/*
 * POST addCategorie page
 * Affiche le formulaire d'ajout de categorie
 */
exports.addCategorie = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var category = require('../models/category');
	var question = require('../models/question');
	var labelCategorie = req.body.lblcategorie;
	var status;
	var idTeacher = req.session.idUser;


	console.log(labelCategorie);
	if(labelCategorie != ""){
		category.addCategory(labelCategorie);
		res.redirect("/list/categorie/");

		/*
		category.addCategory(labelCategorie, function(err, result){
			if(err) {
				console.log("erreur d'ajout");
			}
			else {
				console.log("ok");
			}
		});
		*/

	}
	else{
		console.log("erreur");
	}

}



/*
 * GET supprCategorie
 */
exports.supprCategorie = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var category = require('../models/category');
	var question = require('../models/question');
	var idCategorie = req.params.id;
	var status;
	var idTeacher = req.session.idUser;

	/*
	if(req.params.status === 'saved') {
		status = 'La categorie a bien été supprimmée';
		console.log(status);
	}
	else if (req.params.status === 'error') {
		status = 'Une erreur s\'est produite';
		console.log(status);
	}
	else {
		status = false;
	}
	*/

	// a ameliorer
	category.removeCategory(idCategorie, function(err, result){
		if(err) {
			res.redirect('/list/categorie/');
			console.log("erreur de supression");
		}
		else {
			res.redirect('/list/categorie/');
		}
	});
}



/* ----------------------- */ 
/*     Page statistique    */
/* ----------------------- */ 

/*
 * GET stat page
 */
exports.stat = function(req,res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	res.render('teacher/stat', {
		title: 'Statistique',
		pageTitle: 'Statistique'
	});
};


/*
 * GET panelquestion page
 * Affiche les question d'une session en cours
 */
exports.panelquestion = function(req,res) {
	res.render('teacher/panelquestion', {
		title: 'Question',
		pageTitle: 'Question'
	});
};

/*
 * GET waitSession page
 * Affiche la page avant le lancement d'une session
 */
exports.waitSession = function(req,res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var session = require('../models/session');
	var app = require('../app');
	var key = req.params.key;

	session.getSessionByKey(key, function(err, result){
		app.application.enable(key);
		app.activeSession[key] = [];
		res.render('teacher/waitConnection', {
			title: 'En attente - professeur',
			pageTitle: 'En attente - professeur',
			session: result[0]
		});
	});
};

/*
 * GET waitQuestion page
 * Affiche la page avant le lancement d'une question
 */
exports.waitQuestion = function(req,res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}
	var question = require('../models/question');
	var app = require('../app');

	question.getQuestion(req.params.key, function(err, result){
		app.activeQuestion[req.session.username] = {
			question: req.params.key,
			connected: []
		};
		res.render('teacher/waitConnection', {
			title: 'En attente - professeur',
			pageTitle: 'En attente - professeur',
			question: result,
			teacher: req.session.username
		});
	});
};