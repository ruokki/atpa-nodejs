
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var teacherRoutes = require('./routes/teacher');
var studentRoutes = require('./routes/student');
var websocketRoutes = require('./routes/websocket');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var swig = require('swig');
var db = require('./models/db');

// Sessions de questions en cours
var activeSessions = [];

var app = express();

// all environments
app.engine('html', swig.renderFile);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.cookieParser());
app.use(express.session({secret:'io16RBS50fhXLY5G867nqXkGOJ9hyeTF'}));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/* ------------------------------------------- */
/*       Page de login et de déconnexion       */
/* ------------------------------------------- */
app.get('/', routes.login);
app.post('/', routes.loginPost);
app.get('/initializeDB', routes.initializeDB);
app.get('/disconnect', routes.disconnect);

/* ----------------------------- */
/*     Gestion des questions     */
/* ----------------------------- */
app.get('/list/question', teacherRoutes.listQuestion);
app.get('/add/question', teacherRoutes.addQuestion);
app.post('/add/question', teacherRoutes.addQuestionPost);
app.get('/edit/question/:id', teacherRoutes.editQuestion);
app.get('/edit/question/:id/:status', teacherRoutes.editQuestion);
app.post('/edit/question/:id', teacherRoutes.editQuestionPost);
app.post('/edit/question/:id/:status', teacherRoutes.editQuestionPost);

app.get('/suppr/question/:id', teacherRoutes.supprQuestion);



/* ---------------------------- */
/*     Gestion des sessions     */
/* ---------------------------- */
app.get('/list/session', teacherRoutes.listSession);
app.get('/add/session', teacherRoutes.addSession);
app.post('/add/session', teacherRoutes.addSessionPost);
app.get('/edit/session/:id', teacherRoutes.editSession);
app.get('/edit/session/:id/:status', teacherRoutes.editSession);
app.post('/edit/session/:id', teacherRoutes.editSessionPost);
app.post('/edit/session/:id/:saved', teacherRoutes.editSessionPost);

/* ---------------------------- 
	gestion des catégories
----------------------------- */
app.get('/list/categorie', teacherRoutes.listCategorie);
app.get('/suppr/categorie/:id', teacherRoutes.supprCategorie);
app.post('/add/categorie/', teacherRoutes.addCategorie);


/* -------------------------- */
/*     Page du professeur     */
/* -------------------------- */
app.get('/stat', teacherRoutes.stat);
app.get('/welcome', teacherRoutes.welcome);
app.get('/session/waitConnection/:key', teacherRoutes.waitSession);
app.get('/question/waitConnection/:key', teacherRoutes.waitQuestion);


/* -------------------------- */
/*     Page de l'étudiant     */
/* -------------------------- */
app.get('/session/:key', studentRoutes.waitingSession);
app.get('/question/:key', studentRoutes.waitingQuestion);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Création du serveur web-socket
var sockets = io.listen(server);

// Stocke les sessions/questions en cours
var roomSession = [];
var roomQuestion = [];

// Stocke les étudiants connectés à une session/question
var connectedToSession = [];
var connectedToQuestion = [];

// Stocker les réponses à une session/question
var answerSession = [];
var answerQuestion = [];

sockets.on('connection', function(socket){

	socket.on('initSession', function(){

	});

	socket.on('initQuestion', function(teacher){
		socket.join(teacher);
		socket.broadcast.to(teacher).emit('newStudent');
	});

	socket.on('startSession', function(){

	});

	socket.on('startQuestion', function(teacher,idQuestion){
		websocketRoutes.wsQuestion(idQuestion, function(err, result){
			socket.broadcast.to(teacher).emit("startQuestion", result);
			socket.emit("startQuestion", result);
		});
	});

	socket.on("answerSession", function(teacher, idQuestion, answer){

	});

	socket.on("answerQuestion", function(teacher, answer){
		socket.broadcast.to(teacher).emit("answerQuestion");
		answerQuestion[teacher].push(answer);
	});

	socket.on("endQuestion", function(teacher){
		socket.emit("endQuestion", answerQuestion[teacher]);
		socket.broadcast.to(teacher).emit("endQuestion", answerQuestion[teacher]);
	});

});


exports.application = app;
exports.roomQuestion = roomQuestion;
exports.connectedToQuestion = connectedToQuestion;
exports.answerQuestion = answerQuestion;
exports.roomSession = roomSession;
exports.connectedToSession = connectedToSession;
exports.answerSession = answerSession;
