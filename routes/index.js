
/*
 * GET login page.
 */

exports.login = function(req, res){
  res.render("login", {
  	title: "Connexion"
  });
};

/*
 * POST login page
 */
 exports.loginPost = function(req, res) {

 	var crypto = require("crypto");
 	var error = false;

 	if(req.body.student) {
 		console.log("Connexion étudiant");

 		var formPost = req.body.student;
 		var student = require('../models/student');
 		student.isStudentCorrect(formPost.id, formPost.email, function(err, data){
 			if(err) {
 				error = "Mauvais couple identifiant/email";
 				res.render("login",{
 					title: "Connexion",
 					error: error
 				});
 			}
 			else {
 				req.session.username = data.name;
 				req.session.email = data.email;
 				req.session.id = data._id;
 				res.render('addquestion',{
 					title: 'Ajouter une question',
 					name : req.session.username
 				});
 			}
 		});
 	}
 	else if (req.body.teacher) {
 		console.log("Connexion professeur");
 		
 		var formPost = req.body.teacher;
 		var teacher = require('../models/teacher');

 		teacher.isTeacherCorrect(formPost.id, formPost.passwd, function(err, data){
 			if(err) {
 				error = "Mauvais couple identifiant/mot de passe";
 				res.render("login",{
 					title: "Connexion",
 					error: error
 				});
 			}
 			else {
 				req.session.username = data.name;
 				req.session.id = data._id;
 				res.render('addquestion', {
 					title: 'AJouter une question',
 					name: req.session.username
 				});
 			}
 		});
 	}
 };