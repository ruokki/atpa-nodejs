
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

 	if(req.body.student) {
 		console.log("Connexion étudiant");

 		var formPost = req.body.student;
 		var student = require('../models/student');
 		student.connectStudent(formPost.id, formPost.email);

 	}
 	else if (req.body.teacher) {
 		console.log("Connexion professeur");
 		
 		var formPost = req.body.teacher;
 		var teacher = require('../models/teacher');
 		teacher.connectTeacher(formPost.id, formPost.password)
 	}

 	res.render("login",{
 		title: "Connexion"
 	});
 };