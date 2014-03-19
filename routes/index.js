
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
 		if(student.isStudentCorrect(formPost.id, formPost.email)) {
 			var connectedStudent = student.getInfoStudent(formPost.id, formPost.email);
 			console.log(connectedStudent);
 		}
 		else {
 			error = "Mauvaise couple identifiant/email";
 		}

 	}
 	else if (req.body.teacher) {
 		console.log("Connexion professeur");
 		
 		var formPost = req.body.teacher;
 		var teacher = require('../models/teacher');
 		if(teacher.isTeacherCorrect(formPost.id, formPost.passwd)){
 			var connectedTeacher = teacher.getInfoTeacher(formPost.id, formPost.passwd);
 			console.log(connectedTeacher);
 		}
 		else {
 			error = "Mauvaise couple identifiant/mot de passe";
 		}
 	}

 	res.render("login",{
 		title: "Connexion",
 		error: error
 	});
 };