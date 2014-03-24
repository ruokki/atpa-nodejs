
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var teacherRoutes = require('./routes/teacher');
var studentRoutes = require('./routes/student');
var http = require('http');
var path = require('path');
var swig = require('swig');
var db = require('./models/db');

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

/* ------------------------- */
/*       Page de login       */
/* ------------------------- */
app.get('/', routes.login);
app.post('/', routes.loginPost);
app.get('/initializeDB', routes.initializeDB);


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

/* -------------------- */
/*     Statistiques     */
/* -------------------- */
app.get('/stat', teacherRoutes.stat);

/* -------------------------- */
/*     Page de l'étudiant     */
/* -------------------------- */
app.get('/question/:id', studentRoutes.question);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});