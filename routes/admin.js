/* ------------------------------------------------ */
/*     Gestion des pages destinées à l'admin     	*/
/* ------------------------------------------------ */

/*
 * GET loginAdmin page
 * Affiche le formulaire de connection de l'admin
 */
exports.loginAdmin = function(req, res) {
	res.render('admin/login', {
		title: 'Admin'
	});
}

/*
 * POST loginAdmin page
 * Gère la connection d'un admin
 */
exports.loginAdminPost = function(req, res) {
	var adminPost = req.body.admin;
	var errors = [];
	if(adminPost.name === "") {
		errors.push("Veuiller entrer un login");
	}

	if(adminPost.passwd === "") {
		errors.push("Veuiller entrer un mot de passe");
	}

	if(!errors.length) {
		var admin = require("../models/admin");
		admin.isAdminCorrect(adminPost.name, adminPost.passwd, function(err, result){
			if(err) {
				res.render('admin/login', {
					title: "Admin",
					errors : ['Couple identifiant/mot de passe incorrect']
				});
			}
			else {
				req.session.statusUser = "A";
				req.session.nameUser = "admin";
				res.redirect('/admin/addPerson');
			}
		})
	}
	else {
		res.render('admin/login', {
			title: 'Admin',
			errors : errors
		});
	}
}

/*
 * GET addPersonAdmin page
 * Affiche les formulaires permettant d'ajouter un professeur ou un étudiant
 */
exports.addPersonAdmin = function(req, res) {
	if(req.session.statusUser !== 'A' || !req.session.statusUser) {
		res.redirect('/admin/login');
	}

	res.render('admin/addPerson', {
		title: 'Ajout'
	});
}

/*
 * POST addPersonAdmin page
 * Vérifie et ajoute un professeur ou un étudiant dans la base
 */
exports.addPersonAdminPost = function(req, res) {
	var errors = [];
	if(req.body.teacher) {
		var teacherPost = req.body.teacher;
		if(teacherPost.name === "") {
			errors.push("Veuiller entrer un nom");
		}
		if(teacherPost.passwd === "") {
			errors.push("Veuiller entrer un mot de passe");
		}

		if(!errors.length) {
			var teacher = require('../models/teacher');
			teacher.addTeacher(teacherPost.name, teacherPost.passwd, function(inserted){
				res.render('admin/addPerson', {
					title: 'Ajout',
					success: {
						name : teacherPost.name,
						type: "teacher"
					}
				});	
			});
		}
		else {
			res.render('admin/addPerson', {
				title: 'Ajout',
				errors: errors
			});
		}

	}
	else if(req.body.student) {
		var studentPost = req.body.student;
		if(studentPost.name === "") {
			errors.push("Veuiller entrer un nom");
		}
		if(studentPost.email === "") {
			errors.push("Veuiller entrer une adresse mail");
		}

		if(!errors.length) {
			var student = require('../models/student');
			student.addStudent(studentPost.name, studentPost.email, function(inserted){
				res.render('admin/addPerson', {
					title: 'Ajout',
					success: {
						name : studentPost.name,
						type: "student"
					}
				});	
			});
		}
		else {
			res.render('admin/addPerson', {
				title: 'Ajout',
				errors: errors
			});
		}
	}
}
