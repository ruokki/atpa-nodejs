
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
 	console.log(req.body);
 	res.render("login",{
 		title: "Connexion"
 	});
 };