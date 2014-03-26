/* ------------------ */
/*     Web Socket     */
/* ------------------ */

/*
 * POST wsQuestion
 * Récupère les infos d'une question et envoie le HTML via la socket
 */
exports.wsQuestion = function(idQuestion, callback) {
	var swig = require('swig');
	var question = require('../models/question');

	question.getQuestion(idQuestion,function(err, question){
		callback(
			swig.renderFile(__dirname.replace('routes','views/teacher/question.html'), {question: question}), 
			swig.renderFile(__dirname.replace('routes','views/student/question.html'), {question: question})
		);
	});
};