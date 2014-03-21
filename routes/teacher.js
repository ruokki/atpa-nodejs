/*
 * GET addQuestion page
 */
exports.addQuestion = function(req, res) {
	var category = require('../models/category');

	category.getAllCategory(function(result){
		var categories = result;
		res.render('teacher/addQuestion', {
			title: 'Ajouter une question',
			name: req.session.username,
			categories: categories
		});
	});
}

/*
 * POST addQuestion page
 */
exports.addQuestionPost = function(req, res) {
	var question = require('../models/question');

	var errors = [];
	var type = req.body.type;
	var text = req.body.question;
	if(text === "") {
		errors.push("Veuiller remplir le champ Question");
	}

	var time = req.body.timer;
	if(time === "") {
		errors.push("Veuiller remplir le champ Timer");
	}

	var idCat = req.body.category;

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

	if(!errors.length) {

		question.addQuestion(idCat, req.session.idUser, text, time, answersFinal);

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

		console.log(form);

		category.getAllCategory(function(result){
			var categories = result;
			res.render('teacher/addQuestion', {
				title: 'Ajouter une question',
				name: req.session.username,
				categories: categories,
				errors: errors,
				form: form
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
