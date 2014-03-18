var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
	name : {type : String, required: true},
	email: {type : String, required: true}
});

mongoose.model("student", studentSchema);

var teacherSchema = new mongoose.Schema({
	name: {type: String, required: true},
	password : {type: String, required: true}
});

mongoose.model("teacher", teacherSchema);

mongoose.connect('mongodb://localhost/atpa');