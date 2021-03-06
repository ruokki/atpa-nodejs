var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

// Connection à la base
var connection = mongoose.connect('mongodb://localhost/atpa');
autoIncrement.initialize(connection);

/* ------------------ */
/* Collection Student */
/* ------------------ */

var studentSchema = new Schema({
	_id: Number,
	name : {type : String, required: true, unique: true, trim: true},
	email: {type : String, required: true, unique: true, trim: true}
});

studentSchema.plugin(autoIncrement.plugin, 'student');
connection.model('student', studentSchema);

/* ------------------ */
/* Collection Teacher */
/* ------------------ */

var teacherSchema = new Schema({
	_id: Number,
	name: {type: String, required: true, unique: true, trim: true},
	password : {type: String, required: true}
});

teacherSchema.plugin(autoIncrement.plugin, 'teacher');
connection.model('teacher', teacherSchema);

/* ------------------- */
/* Collection Category */
/* ------------------- */

var categorySchema = new Schema({
	_id: Number,
	label : {type : String, unique: true, trim: true}
});

categorySchema.plugin(autoIncrement.plugin, 'category');
connection.model('category', categorySchema);

/* ------------------- */
/* Collection Question */
/* ------------------- */
var questionSchema = new Schema({
	_id: Number,
	_id_cat: {type: Number, ref: 'category'},
	_id_teacher: {type : Number, ref: 'teacher'},
	type : String,
	imgURL: {type: String, trim: true},
	text : {
		type : String,
		unique: true,
		trim: true
	},
	time: Number,
	answers: []
});

questionSchema.plugin(autoIncrement.plugin, 'question');
connection.model('question', questionSchema);

/* ------------------ */
/* Collection Session */
/* ------------------ */
var sessionSchema = new Schema({
	_id: Number,
	_id_teacher: {type: Number, ref: 'teacher'},
	name : {type : String, unique : true},
	key: {type: String, unique: true, min: 5, max: 5},
	questions: [{type: Number, ref: 'question'}]
});

sessionSchema.plugin(autoIncrement.plugin, 'session');
connection.model('session', sessionSchema);

/* ---------------- */
/* Collection Admin */
/* ---------------- */
var adminSchema = new Schema({
	_id: Number,
	name : String,
	password: String
});

adminSchema.plugin(autoIncrement.plugin, 'admin');
connection.model('admin', adminSchema);