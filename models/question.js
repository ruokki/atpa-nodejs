var mongoose = require('mongoose');

/*
 * Ajoute une question
 */
exports.addQuestion = function(idCat, idTeacher, question, time, answers) {
	var Questions = mongoose.model('question');
	
	var newQuestion= new Questions({
		_id_cat: idCat,
		_id_teacher: idTeacher,
		text : question,
		time: time,
		answers: answers
	});

	newQuestion.save(function(err){
		if(err) {
			console.log(err);
		}
	});

};