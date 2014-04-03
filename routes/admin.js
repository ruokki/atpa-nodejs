/* ------------------------------------------------ */
/*     Gestion des pages destinées à l'admin     	*/
/* ------------------------------------------------ */

exports.loginAdmin = function(req, res) {
	res.render('admin/login', {
		title: 'Admin'
	});
}
