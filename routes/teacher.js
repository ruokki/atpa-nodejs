/*
 * GET addQuestion page
 */
exports.addQuestion = function(req, res) {
	res.render('addquestion', {
		title: 'Ajouter une question',
		name: req.session.username
	});
}