module.exports = function(){
    	var express = require('express');
    	var router = express.Router();
	var expressValidator = require('express-validator');
	
//router.get('/', function(req, res){
	//var context = {};
    //res.render('awardHistory', context);
//});

router.get('/', function (req, res, next) {
	if(!req.session){
		res.redirect('./login');
		res.end();
		return;
	
	  }
	var context = {};
    var mysql = req.app.get('mysql');
   // mysql.pool.query("SELECT user_id, first_name, last_name, email, password, signature_image_path, DATE_FORMAT(account_created, '%m/%d/%Y') AS account_created" + 
      //  " FROM user", function (err, rows, fields) {
        mysql.pool.query("SELECT awards.award_id, awards.award_type, awardee.first_name, awardee.last_name, awarded.first_name, awarded.last_name FROM awards INNER JOIN  user as awardee ON awards.awardee_id = awardee.user_id INNER JOIN user as awarded ON awards.awarded_id = awarded.user_id where awardee.user_id = 1" , function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
       context.results = rows;
       res.render('awardHistory', context);
});
  });

  router.delete('/', function (req, res, next) {
    var context = {};
    var mysql = req.app.get('mysql');
   // mysql.pool.query("SELECT user_id, first_name, last_name, email, password, signature_image_path, DATE_FORMAT(account_created, '%m/%d/%Y') AS account_created" + 
      //  " FROM user", function (err, rows, fields) {
        mysql.pool.query("Delete FROM awards Where award_id = ?" , function (err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        mysql.pool.query('SELECT * FROM awards', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          context.results = rows;
          res.render('awardHistory', context);
      });	
    });
    });

return router;
} ();
