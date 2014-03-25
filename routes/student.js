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
	res.render('student/waiting', {
		title: 'atpa'
	});
};