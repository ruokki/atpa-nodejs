var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* ------------------ */
/* Collection Student */
/* ------------------ */

var studentSchema = new mongoose.Schema({
	name : {type : String, required: true, unique: true, trim: true},
	email: {type : String, required: true, unique: true, trim: true}
});

mongoose.model('student', studentSchema);

/* ------------------ */
/* Collection Teacher */
/* ------------------ */

var teacherSchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true, trim: true},
	password : {type: String, required: true}
});

mongoose.model('teacher', teacherSchema);

/* ------------------- */
/* Collection Category */
/* ------------------- */

var categorySchema = new mongoose.Schema({
	label : {type : String, unique: true, trim: true}
});

mongoose.model('category', categorySchema);

/* ------------------- */
/* Collection Question */
/* ------------------- */
var questionSchema = new mongoose.Schema({
	_id_cat: Schema.Types.ObjectId,
	_id_teacher: Schema.Types.ObjectId,
	intitule : {
		type : String,
		unique: true,
		trim: true
	},
	time: Number,
	answers: {
		name : String,
		correct: Boolean
	}
});

mongoose.model('question', questionSchema);

// Connection à la base
mongoose.connect('mongodb://localhost/atpa');