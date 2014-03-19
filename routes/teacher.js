/*
 * GET addQuestion page
 */
exports.addQuestion = function(req, res) {
	res.render('teacher/addQuestion', {
		title: 'Ajouter une question',
		name: req.session.username
	});
}

/*
 * GET addQuestionnaire page
 */
exports.addQuestionnaire = function(req, res) {
	res.render('teacher/addQuestionnaire', {
		title: 'Ajouter un questionnaire'
	})
};