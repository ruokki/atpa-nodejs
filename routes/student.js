/*
 * GET question page
 */
exports.question = function(req,res) {
	res.render('student/question', {
		title: 'Réponse'
	});
};