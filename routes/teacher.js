/* -------------------------------------------------- */
/*     Gestion des pages destinées à l'enseignant     */
/* -------------------------------------------------- */

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

	// if(req.session.statusUser === 'S' || !req.session.statusUser) {
	// 	res.redirect('/');
	// }

	var category = require('../models/category');
	var question = require('../models/question');
	var idQuestion = req.params.id;
	var idTeacher = req.session.idUser;

	category.getAllCategory(function(result){
		var categories = result;

		question.getQuestion(idQuestion, idTeacher, function(err, data){
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

	
	// if(req.session.statusUser === 'S' || !req.session.statusUser) {
	// 	res.redirect('/');
	// }

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
	console.log(correct);

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

		question.updateQuestion(idQuestion, idCat, text, type, time, answersFinal);

		res.redirect('/edit/question/' + idQuestion);
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

	// if(req.session.statusUser === 'S' || !req.session.statusUser) {
	// 	res.redirect('/');
	// }

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



/*
 * GET addQuestionnaire page
 */
exports.addQuestionnaire = function(req, res) {
	res.render('teacher/addQuestionnaire', {
		title: 'Ajouter un questionnaire'
	})
};

/*
 * GET listQuestion page
 */
exports.listQuestion = function(req, res) {
	var category = require('../models/category');

	category.getAllCategory(function(result){
		res.render('teacher/listQuestion', {
			title: 'Liste des questions',
			categories: result
		});
	});
}

/*
 * GET listQuestionnaire page
 */
exports.listQuestionnaire = function(req, res) {
	res.render('teacher/listQuestionnaire', {
		title: 'Liste des questionnaires'
	})
};

/*
 * GET stat page
 */
exports.stat = function(req,res) {
	res.render('teacher/stat', {
		title: 'Statistique'
	});
};
