var mongoose = require('mongoose');

exports.connectStudent = function(id, email){
	var Students = mongoose.model('student');
	console.log("id : " + id + ", email : " + email);
	Students.find({email: email, name: id}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			console.log(result);
		}
	});
}