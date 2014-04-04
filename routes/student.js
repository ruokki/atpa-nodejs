/* ------------------------------------------------ */
/*     Gestion des pages destinées à l'étudiant     */
/* ------------------------------------------------ */

/*
 * GET waitingSession page
 */
exports.waitingSession = function(req,res) {

	if(req.session.statusUser !== 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var app = require('../app');
	var key = req.params.key;
	var usernameStudent = req.session.username;


	res.render('student/connected', {
		type: 'session',
		student: req.session.username,
		key: key,
		title: 'En attente - étudiant',
		username: usernameStudent

	});
};

/*
 * GET waitingQuestion page
 */
exports.waitingQuestion = function(req,res) {

	if(req.session.statusUser !== 'S' || !req.session.statusUser) {
		res.redirect('/');
	}

	var app = require('../app');
	var teacher = req.params.key;
	var usernameStudent = req.session.username;
	res.render('student/connected', {
		type: 'question',
		student: req.session.username,
		key: teacher,
		title: 'En attente - étudiant',
		username: usernameStudent
	});
};