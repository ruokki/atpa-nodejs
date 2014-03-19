var mongoose = require('mongoose');

exports.isTeacherCorrect = function(id, pwd){
	var crypto = require('crypto');
	var Teachers = mongoose.model('teacher');
	var cryptedPwd = crypto.createHash('sha256').update(pwd).digest('base64');
	
	Teachers.find({password: cryptedPwd, name: id}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			if(result.length === 1) {
				return true;
			}
			else {
				return false;
			}
		}
	});
}

exports.getInfoTeacher = function(id, email) {
	var crypto = require('crypto');
	var Teachers = mongoose.model('teacher');
	var cryptedPwd = crypto.createHash('sha256').update(pwd).digest('base64');
	
	Teachers.find({password: cryptedPwd, name: id}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			return result[0];
		}
	});
}