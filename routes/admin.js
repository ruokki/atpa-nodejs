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
		console.log(adminPost);
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
	res.render('admin/addPerson', {
		title: 'Ajout'
	});
}
