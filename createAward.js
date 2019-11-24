module.exports = function(){
    	var express = require('express');
    	var router = express.Router();
	var expressValidator = require('express-validator');
	
router.get('/', function(req, res){
	if(!req.session){
		res.redirect('./login');
		res.end();
		return;
	
	  }
	var context = {};
    res.render('createAward', context);
});

return router;
} ();
