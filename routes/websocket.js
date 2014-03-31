/* ------------------ */
/*     Web Socket     */
/* ------------------ */

/*
 * POST wsQuestion
 * Récupère les infos d'une question et envoie le HTML via la socket
 */
exports.wsQuestion = function(idQuestion, callback) {
	var question = require('../models/question');

	question.getQuestion(idQuestion, callback);
};