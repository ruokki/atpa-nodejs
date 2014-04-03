var mongoose = require('mongoose');

/*
 * Vérifie que le couple id/pwd existe dans la collection Admin
 */
exports.isAdminCorrect = function(id, pwd, callback){
	var crypto = require('crypto');
	var Admin = mongoose.model('admin');
	var cryptedPwd = crypto.createHash('sha256').update(pwd).digest('base64');
	
	Admin.find({password: cryptedPwd, name: id}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			if(result.length === 1) {
				callback(null, result[0]);
			}
			else {addQuestion
				callback(true, null);
			}
		}
	});
}

/*
 * Ajoute un administrateur
 */
exports.addAdmin = function(id, pwd) {
	var crypto = require('crypto');

	var cryptedPwd = crypto.createHash('sha256').update(pwd).digest('base64');
	var Admins = mongoose.model('admin');
	
	var newAdmin = new Admins({
		name: id,
		password: cryptedPwd
	});

	newAdmin.save(function(err){
		if(err) {
			console.log(err);
		}
	});
};