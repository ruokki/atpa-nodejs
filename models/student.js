var mongoose = require('mongoose');

/*
 * Vérifie que le couple id/email existe dans la collection Student
 */
exports.isStudentCorrect = function(id, callback){
	var Students = mongoose.model('student');
	
	Students.find({name: id}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			if(result.length === 1) {
				callback(null, result[0]);
			}
			else {
				callback(true, null);
			}
		}
	});
}

/*
 * Ajoute un étudiant
 */
exports.addStudent = function(id, email) {
	var Students = mongoose.model('student');
	
	var newStudent = new Students({
		name: id,
		email: email
	});

	newStudent.save(function(err){
		if(err) {
			console.log(err);
		}
	});

};