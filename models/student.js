var mongoose = require('mongoose');

exports.isStudentCorrect = function(id, email, callback){
	var Students = mongoose.model('student');
	
	Students.find({email: email, name: id}).exec(function(err, result){
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

exports.getInfoStudent = function(id, email) {

	var Students = mongoose.model('student');
	Students.find({email: email, name: id}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			return result[0];
		}
	});
}