var mongoose = require('mongoose');

/*
 * Ajout d'une session
 */
exports.addSession = function(label, questions, idTeacher, callback) {
	var Session = mongoose.model('session');

	var newSession = new Session({
		name: label,
		questions: questions,
		_id_teacher: idTeacher
	});
	
	var thos = this;

	this.randomAlreadyExist(randomCallback);

	function randomCallback(err, key) {
		if(err) {
			thos.randomAlreadyExist(randomCallback);
		}
		else {
			newSession.key = key;
			newSession.save(function(err){
				if(err) {
					console.log(err);
					callback(false);
				}
				else {
					callback(true);
				}
			});
			callback(true);
		}
	}
};

/*
 * Vérifie que la chaîne de caractère aléatoire n'existe pas
 */
exports.randomAlreadyExist = function(callback) {
	var Session = mongoose.model('session');
	var randomstring = require('randomstring');

	var key = randomstring.generate(5);
	Session.find({key: key}).exec(function(err, result) {
		if(err) {
			console.log(err);
		}
		else {
			if(result.length === 0) {
				callback(null, key);
			}
			else {
				callback(true, null);
			}
		}
	});
};

/*
 * Récupère les infos d'une session
 */
exports.getSession = function(id, callback) {
	var Session = mongoose.model('session');

	Session.find({_id: id}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			if(result.length === 1) {
				callback(null, result);
			}
			else {
				callback(true, null);
			}
		}
	});
};

/*
 * Met à jour une session
 */
 exports.updateSession = function(idSession, label, questions, callback) {
 	var Sessions = mongoose.model('session');
 	
 	// Model.update(condition, toUpdate, option, callback)
 	Sessions.update({
 		_id: idSession
 	}, {
 		$set: {
 			name: label,
 			questions: questions
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
  * Récupère l'ensemble des sessions d'un professeur
  */
exports.getAllSession = function(idTeacher, callback) {
	var Sessions = mongoose.model('session');

	Sessions.find({_id_teacher: idTeacher }).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			callback(result);
		}
	});
};

/*
 * Récupère une session par sa clé
 */
exports.getSessionByKey = function(key, callback) {
	var Session = mongoose.model('session');

	Session.find({key: key}).exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			if(result.length === 1) {
				callback(null, result);
			}
			else {
				callback(true, null);
			}
		}
	});
}
