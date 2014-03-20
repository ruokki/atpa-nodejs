/*
 * GET addQuestion page
 */
exports.addQuestion = function(req, res) {
	console.log(req.session.idUser);
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

	// console.log(req.body);

	var type = req.body.type;
	var text = req.body.question;
	var time = req.body.timer;
	var idCat = req.body.category;

	if(type === 'radio') {
		var answers = req.body.reponse.radio;
		var correct = req.body.radio.rep;
	}
	else if (type === 'checkbox') {
		var answers = req.body.reponse.checkbox;
		var correct = req.body.checkbox.rep;
	}

	var answersLength = answers.length;
	var answersFinal = [];

	correct = typeof(correct) === 'object' ? correct.toString() : correct;

	for(var i = 0; i < answersLength; i++) {
		var isCorrect = false;

		if(correct.indexOf(i) > -1) {
			isCorrect = true;
		}

		answersFinal.push({
			name: answers[i],
			correct: isCorrect
		});
	}

	question.addQuestion(idCat, req.session.idUser, text, time, answersFinal);

	res.redirect('/add/question');

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
