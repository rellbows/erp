module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// SQL QUERIES HERE...

	router.get('/', function(req, res){
		var callBackCount = 0;
		var context = {};
		context.jsscripts = [];
		var mysql = req.app.get('mysql');
		// CALLBACK TO FUNCTS FOR SQL HERE...
		function complete(){
			callBackCount++;
			if(callBackCount >= 0){
				res.render('admin-crud-users', context);
			}
		}
	});

}