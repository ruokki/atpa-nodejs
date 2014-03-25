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
 * GET accueil page
 */
exports.waiting = function(req,res) {
	var app = require('../app');
	var key = req.params.key;
	res.render('student/connected', {
		student: req.session.username,
		key: key,
		title: 'En attente - étudiant'
	});
};