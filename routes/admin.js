/* ------------------------------------------------ */
/*     Gestion des pages destinées à l'admin     	*/
/* ------------------------------------------------ */

exports.loginAdmin = function(req, res) {
	res.render('admin/login', {
		title: 'Admin'
	});
}

exports.addPersonAdmin = function(req, res) {
	res.render('admin/addPerson', {
		title: 'Ajout'
	});
}
