
var express = require('express');
var mysql = require('./dbcon.js');

var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});


app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
//app.use(expressValidator());
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

//app.set('port', 7000);
app.set('mysql', mysql);



var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users.js');

app.use(session({ 
  secret: 'lol', 
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 24 * 30 * 100} //30 days
}));

app.use(passport.initialize());
app.use(passport.session());

/**********************************************
home landing page here
*********************************************/
//brings up homepage
app.get('/', function(req, res){
	res.render('home.handlebars');
});

// OTHER ROUTES HERE...

app.use('/userprofile', require('./userprofile.js'));
app.use('/admin-crud-users', require('./admin-crud-users.js'));
app.use('/admin-crud-admins', require('./admin-crud-admins.js'));
app.use('/admin-bus-intel', require('./admin-bus-intel.js')); 
app.use('/awardHistory', require('./awardHistory.js'));
app.use('/createAward', require('./createAward.js'));
app.use('/logout', require('./logout.js'));



//login route
app.get('/login', function(req, res){
	res.render('login.handlebars');
});

//app.get('/woo', loggedIn, function(req, res){
//	res.send("logged in");
//});


//app.get('/woo', loggedIn, function(req, res){
  //	res.send("logged in");
  //});

/*************************************************************************
Passport strats
*************************************************************************/
//passport documentation on configuring strategy http://www.passportjs.org/packages/passport-local/
passport.use(new LocalStrategy(
	{usernameField: 'email',
	},
	function(username, password, done){
		User.findOne({
			where: {email: username}
		}).then(function(user){
			if(!user){
				//console.log("wrong username");
				return done(null, false, {message: 'Username is incorrect'});
			}
			if (!(user.password == password)){
				//console.log("wrong password");
				return done(null, false, {message: 'Password is incorrect'});
			}
			if (user.password == password){
				//console.log("correct");
				return done(null, user, {message: 'logged in'});

			}
		}).catch(err => done(err));
	}));


//now to serialize user and deserialize user for sessions

passport.serializeUser(function(user, done){
	done(null, user.email);
});


passport.deserializeUser(function(user, done){
	done(null, user);
});

/****************************************
middleware that will auth
************************************/
app.post('/login', passport.authenticate('local', { 
	successRedirect: '/userprofile',
    failureRedirect: '/login'
}), function(req, res){
	//nothing in callback	
});

//logout 
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
})

//check if loggedIn 
function loggedIn(req, res, next){
	if (req.isAuthenticated()){
		next();
	}
	else{
		res.redirect('/');
	}
}
/**************************
End middleware code
***************************/

//app.listen(3000, function(){
  //  console.log("server started");
//})

/* app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
}); */

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

