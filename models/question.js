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
exports.addQuestion = function(idCat, idTeacher, question, type, time, answers, img, callback) {
	var Questions = mongoose.model('question');
	
	var newQuestion= new Questions({
		_id_cat: idCat,
		_id_teacher: idTeacher,
		text : question,
		time: time,
		type: type,
		answers: answers,
		imgURL : img
	});

	newQuestion.save(function(err, insertedQuestion){
		if(err) {
			console.log(err);
		}
		else {
			callback(insertedQuestion);
		}
	});

};

/*
 * Met à jour une question
 */
 exports.updateQuestion = function(idQuestion, idCat, question, type, time, answers, img, callback) {
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
 			answers: answers,
 			imgURL: img
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


/*
 * Supprime une question
 */
 exports.removeQuestion = function(idQuestion, callback) {
 	var Questions = mongoose.model('question');
 	
 	Questions.remove({
 		_id: idQuestion
 	}, 
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