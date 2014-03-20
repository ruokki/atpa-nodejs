
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

 	var error = false;
 	// Test du type de formulaire soumis
 	if(req.body.student) {

 		console.log("Connexion étudiant");

 		// Récupère le contenu du formulaire
 		var formPost = req.body.student;

 		// Récupère le model student.js dans le dossier ../models
 		var student = require('../models/student');

 		/* Execute la fonction isStudentCorrect du model student
 		 * La fonction de callback permet de récupérer les informations 
 		 * retournées par la fonction. Sans ça, Node.js ne pourrait pas 
 		 * récupérer ses informations, les traitements étant fait de façon 
 		 * asynchrone
 		 */
 		student.isStudentCorrect(formPost.id, formPost.email, function(err, data){
 			if(err) {
 				error = "Mauvais couple identifiant/email";

 				// Rendu de la page login.html
 				res.render("login",{
 					title: "Connexion",
 					error: error
 				});
 			}
 			else {

 				// Mise en session des éléments name, email et _id de 
 				// l'étudiant qui vient de se connecter
 				req.session.username = data.name;
 				req.session.email = data.email;
 				req.session.id = data._id;
 				req.session.status = "S";

 				// Redirection vers l'URL /addquestion
 				res.redirect('/list/questionnaire');
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
 				req.session.status = "T";
 				res.redirect('/list/questionnaire');
 			}
 		});
 	}
 };

/*
 * Initialisation de la base avec des valeurs
 */
exports.initializeDB = function(req, res) {
	var teacher = require('../models/teacher');
	var student = require('../models/student');
	var category = require('../models/category');

	teacher.addTeacher('test', 'test');
	teacher.addTeacher('toto', 'toto');
	
	student.addStudent('test', 'test@gmail.com');
	student.addStudent('toto', 'toto@gmail.com');

	category.addCategory('MySQL');
	category.addCategory('PHP');
	category.addCategory('HTML/CSS');
	category.addCategory('Javascript');

	res.redirect('/');
}