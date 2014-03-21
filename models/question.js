var mongoose = require('mongoose');

/*
 * Récupère toutes les informations d'une question
 */
exports.getQuestion = function(idQuestion, idTeacher, callback) {
	var Questions = mongoose.model('question');

	Questions.find({
			_id: idQuestion
		}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			console.log(result);
			if(result.length === 0) {
				callback(true, null);
			}
			else {
				callback(null, result[0]);
			}
		}
	});
}

/*
 * Ajoute une question
 */
exports.addQuestion = function(idCat, idTeacher, question, type, time, answers) {
	var Questions = mongoose.model('question');
	
	var newQuestion= new Questions({
		_id_cat: idCat,
		_id_teacher: idTeacher,
		text : question,
		time: time,
		type: type,
		answers: answers
	});

	newQuestion.save(function(err){
		if(err) {
			console.log(err);
		}
	});

};