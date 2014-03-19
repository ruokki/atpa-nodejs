var mongoose = require('mongoose');

exports.isTeacherCorrect = function(id, pwd, callback){
	var crypto = require('crypto');
	var Teachers = mongoose.model('teacher');
	var cryptedPwd = crypto.createHash('sha256').update(pwd).digest('base64');
	
	Teachers.find({password: cryptedPwd, name: id}).exec(function(err, result){
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

exports.getInfoTeacher = function(id, pwd) {
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