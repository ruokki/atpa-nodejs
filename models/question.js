var mongoose = require('mongoose');

/*
 * Récupère toutes les informations d'une question
 */
exports.getQuestion = function(idQuestion, callback) {
	var Questions = mongoose.model('question');

	Questions.find({
			_id: idQuestion
		}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			if(result.length === 0) {
				callback(true, null);
			}
			else {
				callback(null, result[0]);
			}
		}
	});
};

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

/*
 * Met à jour une question
 */
 exports.updateQuestion = function(idQuestion, idCat, question, type, time, answers, callback) {
 	var Questions = mongoose.model('question');
 	
 	// Model.update(condition, toUpdate, option, callback)
 	Questions.update({
 		_id: idQuestion
 	}, {
 		$set: {
 			_id_cat: idCat,
 			text: question,
 			time: time,
 			type: type,
 			answers: answers
 		}
 	}, 
 	{}, 
 	function(err, rowAffected, raw){
 		if(err) {
 			console.log(err);
 			callback(true, null);
 		}
 		else {
 			callback(null, rowAffected);
 		}
 	});

 };

 /*
  * Récupère la liste des questions
  */
exports.getAllQuestion = function(callback) {
	var Questions = mongoose.model('question');

	Questions.find({}).exec(function(err, result) {
		if(err) {
			console.log(err);
		}
		else {
			callback(result);
		}
	});
}