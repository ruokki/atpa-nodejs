var mongoose = require('mongoose');

/*
 * Vérifie que le couple id/pwd existe dans la collection Teacher
 */
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

/*
 * Ajoute un professeur
 */
exports.addTeacher = function(id, pwd) {
	var crypto = require('crypto');

	var cryptedPwd = crypto.createHash('sha256').update(pwd).digest('base64');
	var Teachers = mongoose.model('teacher');
	
	var newTeacher = new Teachers({
		name: id,
		password: cryptedPwd
	});

	newTeacher.save(function(err){
		if(err) {
			console.log(err);
		}
	});

};