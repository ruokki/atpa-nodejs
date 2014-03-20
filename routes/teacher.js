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
	var category = require('../models/category');

	console.log(req.body);
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