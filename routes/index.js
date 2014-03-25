/* ---------------------------------- */
/*     Gestion des pages communes     */
/* ---------------------------------- */

/*
 * GET login page.
 */

exports.login = function(req, res){
	var disconnect;
	if(req.session.disconnect) {
		disconnect = true;
		req.session.disconnect = null;
	}
	else {
		disconnect = false;
	}
	res.render("login", {
		title: "Connexion",
		disconnect: disconnect
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

		// Vérification champ vide
		if(formPost.id === "" || formPost.key === "") {
			error = "Veuillez saisir vos informations de connexion.";
			
			// Rendu de la page login.html
			res.render("login",{
				title: "Connexion",
				error: error
			});
		}
		else {
			// Récupère le model student.js dans le dossier ../models
			var student = require('../models/student');

			/* Execute la fonction isStudentCorrect du model student
			 * La fonction de callback permet de récupérer les informations 
			 * retournées par la fonction. Sans ça, Node.js ne pourrait pas 
			 * récupérer ses informations, les traitements étant faits de façon 
			 * asynchrone
			 */
			student.isStudentCorrect(formPost.id, function(err, data){
				if(err) {
					error = "Identifiant incorrect";
					res.render("login",{
						title: "Connexion",
						error: error
					});
				}
				else {
					// Mise en session des éléments name et _id de 
					// l'étudiant qui vient de se connecter
					req.session.username = data.name;
					req.session.idUser = data._id;
					req.session.statusUser = "S";

					var app = require('../app');
					if(!app.application.enabled(formPost.key)) {
						error = "Session incorrect ou indisponible";
						res.render("login",{
							title: "Connexion",
							error: error
						});
					}
					else {
						// Redirection vers l'URL /student/waiting/:key
						res.redirect('/session/connected/' + formPost.key);
					}
				}
			});
		}
 	}
 	else if (req.body.teacher) {

 		console.log("Connexion professeur");
 		var formPost = req.body.teacher;
		
		if(formPost.id === "" || formPost.passwd === "") {
			error = "Veuillez saisir vos informations de connexion.";
			res.render("login",{
				title: "Connexion",
				error: error
			});
		}
		else {
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
					req.session.idUser = data._id;
					req.session.statusUser = "T";
					res.redirect('/welcome');
				}
			});
		}
 	}
 };

 /*
  * Déconnexion
  * Destruction de la session
  */
exports.disconnect = function(req, res) {
	req.session.username = null;
	req.session.idUser = null;
	req.session.statusUser = null;
	req.session.email = null	;
	req.session.disconnect = true;
	res.redirect('/');
};

/*
 * Initialisation de la base avec des valeurs
 */
exports.initializeDB = function(req, res) {
	var teacher = require('../models/teacher');
	var student = require('../models/student');
	var category = require('../models/category');
	var question = require('../models/question');

	teacher.addTeacher('test', 'test');
	teacher.addTeacher('toto', 'toto');
	
	student.addStudent('test', 'test@gmail.com');
	student.addStudent('toto', 'toto@gmail.com');

	category.addCategory('MySQL');
	category.addCategory('PHP');
	category.addCategory('HTML/CSS');
	category.addCategory('Javascript');

	question.addQuestion(
		1,
		1,
		"Combien font 2 + 2 ?",
		'radio',
		30,
		[
			{
				name: '4',
				correct: true
			},
			{
				name: '6',
				correct: false
			},
			{
				name: '8',
				correct: false
			}
		]
	);

	question.addQuestion(
		1,
		1,
		"Quelle est la capitale de la France ?",
		'radio',
		30,
		[
			{
				name: 'Paris',
				correct: true
			},
			{
				name: 'Londres',
				correct: false
			},
			{
				name: 'Rome',
				correct: false
			}
		]
	);

	question.addQuestion(
		1,
		1,
		"Donner au moins un moteur de recherche",
		'checkbox',
		30,
		[
			{
				name: 'Google',
				correct: true
			},
			{
				name: 'Yahoo',
				correct: true
			},
			{
				name: 'Astalavista',
				correct: false
			}
		]
	);

	res.redirect('/');
}