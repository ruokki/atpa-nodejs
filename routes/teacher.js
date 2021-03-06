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

	var teacher = require('../models/teacher'); 
	var idTeacher = req.session.idUser;
	var usernameteacher = req.session.username;

	res.render('index', {
		title : 'Accueil',
		pageTitle: 'Accueil',
		username : usernameteacher
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
	var usernameteacher = req.session.username;

	category.getAllCategory(function(result){
		var categories = result;
		res.render('teacher/questionForm', {
			title: 'Ajouter une question',
			name: req.session.username,
			categories: categories,
			valid: "Ajouter",
			pageTitle: 'Ajouter une question',
			username : usernameteacher
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
	var teacher = require('../models/teacher');

	var idQuestion = req.params.id;
	var status;
	var idTeacher = req.session.idUser;
	var usernameteacher = req.session.username;

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

				if(data.imgURL) {
					form.imgURL = data.imgURL;
				}

				// recuperation de l'id
				var idTeachQuestion = data._id_teacher	// recupe l'id du teacher de la question
				

			 	teacher.getNameTeacher(idTeachQuestion, function(err, data){
			 		var nameTeachQuestion = "";
					if(err) {
						console.log("erreur getname");
					}
					else {
						nameTeachQuestion = data.name;
						res.render('teacher/questionForm', {
							title: 'Éditer une question',
							name: req.session.username,
							categories: categories,
							status: status,
							form : form,
							valid: 'Éditer',
							pageTitle: 'Éditer une question',
							username : usernameteacher,
							usernameQuestion : nameTeachQuestion,
						});
					}
					
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
	var usernameteacher = req.session.username;

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

	var imgType = req.files.image.type;
	var imgURL = req.files.image.name;
	var oldImage = req.body.oldImage;

	if(imgURL !== '' ){
		if(!(imgType === "image/jpeg" || imgType === "image/png" || imgType === "image/gif")) {
			errors.push("Seuls les fichiers JPEG, PNG ou GIF sont autorisés.");
		}
	}

	if(imgURL === '' && oldImage !== '') {
		imgURL = oldImage;
	}

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
	else if (type === 'text') {
		var answers = req.body.reponse.libre;
		var correct = true;
		if(answers === "" ) {
			errors.push("Veuiller entrer une réponse à la question");
		}
	}

	var answersLength = answers.length;
	var answersFinal = [];

	if(type !== "text") {
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

	}
	else {
		answersFinal = [{
			name : answers,
			correct : true
		}];
	}
	/* 
	 * Si aucune erreur, on enregistre les modifications en base et on redirige vers une autre page
	 * Sinon, on réaffiche le formulaire pré-rempli avec les erreurs détectées
	 */
	if(!errors.length) {

		question.updateQuestion(idQuestion, idCat, text, type, time, answersFinal, imgURL, function(err, result){
			if(err) {
				res.redirect('/edit/question/' + idQuestion + '/error');
			}
			else {
				var fs = require('fs');
				fs.readFile(req.files.image.path, function(err, data){
					var newPath = __dirname.replace('routes', 'public/img/userfile/');
					fs.writeFile(newPath + imgURL, data, function(err){
						console.log(err);
					});
				});
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
			answers: answersFinal,
			imgURL : oldImage
		};

		category.getAllCategory(function(result){
			var categories = result;
			res.render('teacher/questionForm', {
				title: 'Éditer une question',
				name: req.session.username,
				categories: categories,
				errors: errors,
				form: form,
				valid: 'Modifier',
				pageTitle: 'Éditer une question',
				username : usernameteacher
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
	var usernameteacher = req.session.username;

	var errors = [];
	// Type de question (choix multiple, choix unique)
	var type = req.body.type; 

	var imgType = req.files.image.type;
	var imgURL = req.files.image.name;
	var oldImage = req.body.oldImage;
	
	if(imgURL !== '' ){
		if(!(imgType === "image/jpeg" || imgType === "image/png" || imgType === "image/gif")) {
			errors.push("Seuls les fichiers JPEG, PNG ou GIF sont autorisés.");
		}
	}

	if(imgURL === '' && oldImage !== '') {
		imgURL = oldImage;
	}

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
	else if (type === 'text') {
		var answers = req.body.libre;
		if(answers === "" ) {
			errors.push("Veuiller entrer une réponse à la question");
		}
	}

	if(type !== 'text') {
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
	}
	else {
		answersFinal = [{
			name : answers,
			correct : true
		}];
	}

	/* 
	 * Si aucune erreur, on enregistre en base et on redirige vers une autre page
	 * Sinon, on réaffiche le formulaire pré-rempli avec les erreurs détectées
	 */
	if(!errors.length) {

		question.addQuestion(idCat, req.session.idUser, text, type, time, answersFinal, imgURL, function(insertedQuestion){
			var fs = require('fs');
			fs.readFile(req.files.image.path, function(err, data){
				var newPath = __dirname.replace('routes', 'public/img/userfile/');
				fs.writeFile(newPath + imgURL, data, function(err){
					console.log(err);
				});
			});
			res.redirect('/edit/question/' + insertedQuestion._id + '/saved');
		});
	}
	else {
		var category = require('../models/category');

		var form = {
			question : text,
			type: type,
			category: idCat,
			timer: time,
			answers: answersFinal,
			imgURL : oldImage
		};

		category.getAllCategory(function(result){
			var categories = result;
			res.render('teacher/questionForm', {
				title: 'Ajouter une question',
				name: req.session.username,
				categories: categories,
				errors: errors,
				form: form,
				valid: 'Ajouter',
				pageTitle: 'Ajouter une question',
				username : usernameteacher

			});
		});
	}

}


/*
 * POST supprquestion page
 * Supprime une question
 */

exports.supprQuestion = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var category = require('../models/category');
	var question = require('../models/question');
	var idQuestion = req.params.id;
	var idTeacher = req.session.idUser;
	var usernameteacher = req.session.username;

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


/*
 * POST changePage
 * Renvoie en JSON la liste des questions dans les limites demandées
 */
 exports.changePage = function(req,res) {
	console.log(req.body);
	var question = require('../models/question');
	question.getAllQuestion(function(questionResult){
		var questionToDisplay = questionResult.slice(parseInt(req.body.limitMin), parseInt(req.body.limitMax));
		res.send(200, questionToDisplay);
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
	var usernameteacher = req.session.username;

	question.getAllQuestion(function(questionResult){
		res.render('teacher/sessionForm', {
			title: 'Créer une session',
			pageTitle: 'Créer une session',
			questions: questionResult,
			username : usernameteacher
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
	var usernameteacher = req.session.username;
	var errors = [];

	if(req.body.label === "" ) {
		errors.push("Veuiller remplir le champ Label");
	}
	if(req.body.questions === undefined) {
		errors.push("Veuiller sélectionner au moins une question");
	}


	if(!errors.length) {
		session.addSession(label, questions, req.session.idUser, function(err, insertedSession){
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
				res.redirect('/edit/session/' + insertedSession._id + '/saved');
			}
		});
	}
	else{

		var question = require('../models/question');
		var usernameteacher = req.session.username;

		question.getAllQuestion(function(questionResult){
			res.render('teacher/sessionForm', {
				title: 'Créer une session',
				pageTitle: 'Créer une session',
				questions: questionResult,
				username : usernameteacher,
				errors: errors,
			});
		});
	}
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
	var usernameteacher = req.session.username;

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
	var usernameteacher = req.session.username;

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
					session: sessionInfo,
				});
			});
		}
		else {
			res.redirect('/edit/session/' + id + '/saved');
		}
	});
};






exports.supprSession = function(req, res) {

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var session = require('../models/session');
	var idSession = req.params.id;
	var status;
	var idTeacher = req.session.idUser;
	var usernameteacher = req.session.username;

	if(req.params.status === 'saved') {
		status = 'La session a bien été supprimmée';
	}
	else if (req.params.status === 'error') {
		status = 'Une erreur s\'est produite';
	}
	else {
		status = false;
	}


	session.getSessionByKey(idSession, function(err, result){
		session.removeSession(idSession, function(err, result){
			// à ameliorer
			if(err) {
				res.redirect('/list/session/');
				console.log("erreur de supression");
			}
			else {
				res.redirect('/list/session/');
			}
		});
	});
}




/* ------------------- */
/*     Partie /list    */
/* ------------------- */

/*
 * GET listQuestion page
 */
exports.listQuestion = function(req, res) {
	var category = require('../models/category');
	var question = require('../models/question');
	var usernameteacher = req.session.username;

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}
	
	question.getAllQuestion(function(questionResult){
		category.getAllCategory(function(categoryResult){
			var nbPages = Math.ceil(questionResult.length / 5);
			var swigPage = [];
			var questionToDisplay = questionResult.slice(0, 5);
			for (var i = 1; i <= nbPages; i++) {
				swigPage.push(i);
			}

			res.render('teacher/listQuestion', {
				title: 'Liste des questions',
				pageTitle: 'Liste des questions',
				categories: categoryResult,
				questions: questionToDisplay,
				username : usernameteacher,
				pages: swigPage
			});
		});
	});
}

/*
 * GET listSession page
 */
exports.listSession = function(req, res) {
	var session = require('../models/session');
	var usernameteacher = req.session.username;

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	session.getAllSession(req.session.idUser, function(result){
		res.render('teacher/listSession', {
			title: 'Liste des sessions',
			pageTitle: 'Liste des sessions',
			sessions : result,
			username : usernameteacher
		})
	});
};


/*
 * GET listCategorie page
 */
exports.listCategorie = function(req, res) {
	var category = require('../models/category');
	var question = require('../models/question');
	var usernameteacher = req.session.username;

	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}	

	category.getAllCategory(function(categoryResult){
		res.render('teacher/listCategorie', {
			title: 'Liste des categories',
			pageTitle: 'Liste des categories',
			categories: categoryResult,
			username : usernameteacher
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
	var usernameteacher = req.session.username;

	if(labelCategorie != ""){
		category.addCategory(labelCategorie);
		res.redirect("/list/categorie/");


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
	var usernameteacher = req.session.username;

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

/*
 * GET waitSession page
 * Affiche la page avant le lancement d'une session
 */
exports.waitSession = function(req,res) {


	if(req.session.statusUser === 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var session = require('../models/session');
	var question = require('../models/question');
	var app = require('../app');
	var key = req.params.key;
	var usernameteacher = req.session.username;

	session.getSessionByKey(key, function(err, result){
		result = result[0];
		app.roomSession.push(result.key);
		app.connectedToSession[result.key] = [];
		app.questionsSession[result.key] = [];
		app.answerSession[result.key] = [];

		var nbQuestion = result.questions.length;
		for (var i = 0; i < nbQuestion; i++ ) {
			question.getQuestion(result.questions[i], function(err, question){
				app.questionsSession[result.key].push(question);
			});
		}

		res.render('teacher/waitConnection', {
			title: 'En attente - professeur',
			pageTitle: 'En attente - professeur',
			session: result,
			username: usernameteacher
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
	var usernameteacher = req.session.username;

	question.getQuestion(req.params.key, function(err, result){
		app.roomQuestion.push(req.session.username);
		app.connectedToQuestion[req.session.username] = [];
		app.answerQuestion[req.session.username] = [];
		res.render('teacher/waitConnection', {
			title: 'En attente - professeur',
			pageTitle: 'En attente - professeur',
			question: result,
			teacher: req.session.username,	// a verifier
			username: usernameteacher
		});
	});
};