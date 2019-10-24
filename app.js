// Program Name: 
// Filename: 
// Author: 
// Description: 

// SERVER SIDE CODE

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public')); // where static .js files are served
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.set('mysql', mysql);

//brings up homepage
app.get('/', function(req, res){
	res.render('home.handlebars')
});

//admin - CRUD page
app.use('/admin-crud-users', require('./admin-crud-users.js'));


//bad url route
app.use(function(req, res){
	res.status(404);
	res.render('404');
});

//bad syntax route
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; Press Ctrl-C to terminate.');
});