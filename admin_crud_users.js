module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// SQL QUERIES HERE...

	console.log("In admin_crud_users");

	router.get('/', function(req, res){
		console.log("in get func")
		var callBackCount = 0;
		var context = {};
		context.jsscripts = [];
		//var mysql = req.app.get('mysql');
		// CALLBACK TO FUNCTS FOR SQL HERE...

		res.render('admin_crud_users.handlebars', context);
		function complete(){
			console.log("in complete func")
			callBackCount++;
			if(callBackCount >= 0){
				res.render('admin_crud_users.handlebars', context);
			}
		}
	});

	return router;

}();