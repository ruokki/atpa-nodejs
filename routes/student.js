/* ------------------------------------------------ */
/*     Gestion des pages destinées à l'étudiant     */
/* ------------------------------------------------ */

/*
 * GET question page
 */
exports.question = function(req,res) {
	res.render('student/question', {
		title: 'Réponse'
	});
};

/*
 * GET waitingSession page
 */
exports.waitingSession = function(req,res) {
	var app = require('../app');
	var key = req.params.key;
	res.render('student/connected', {
		type: 'session',
		student: req.session.username,
		key: key,
		title: 'En attente - étudiant'
	});
};

/*
 * GET waitingQuestion page
 */
exports.waitingQuestion = function(req,res) {
	var app = require('../app');
	var teacher = req.params.key;
	res.render('student/connected', {
		type: 'question',
		student: req.session.username,
		key: teacher,
		title: 'En attente - étudiant'
	});
};