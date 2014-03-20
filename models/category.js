var mongoose = require('mongoose');

/*
 * Ajoute une catégorie
 */
exports.addCategory = function(label) {
	var Categories = mongoose.model('category');
	
	var newCategory = new Categories({
		label: label
	});

	newCategory.save(function(err){
		if(err) {
			console.log(err);
		}
	});

};

/*
 * Récupère l'ensemble des catégories
 */
exports.getAllCategory = function(callback) {
	var Category = mongoose.model("category");

	Category.find().exec(function(err, result){
		if(err) {
			console.log(err);
		}
		else {
			callback(result);
		}
	});
}