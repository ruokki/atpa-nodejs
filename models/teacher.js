var mongoose = require('mongoose');

exports.connectTeacher = function(id, pwd){
	var crypto = require('crypto');
	var Teachers = mongoose.model('teacher');
	var cryptedPwd = crypto.createHash('sha256').update(pwd).digest('base64');
	console.log("id : " + id + ", pass : " + cryptedPwd);
	Teachers.find({password: cryptedPwd, name: id}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			console.log(result);
		}
	});
}