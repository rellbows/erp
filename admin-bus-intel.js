module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// SQL Queries

	// query num of awards
	function getAwardNum(res, mysql, context, complete){
		mysql.pool.query('SELECT count(*) AS total_awards FROM awards', 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.award_num = results[0];

				complete();
			});
	};

	// query num of awardees
	function getAwardeeNum(res, mysql, context, complete){
		mysql.pool.query('SELECT DISTINCT count(awardee_id) AS total_awardees FROM awards',
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.awardee_num = results[0];

				complete();
			});
	};

	// query to get num of awards per department
	function getAwardsPerDept(res,mysql, context, complete){
		mysql.pool.query('SELECT count(user.department_id) AS dept_total, department.dept_name FROM awards LEFT JOIN user ON awards.awardee_id = user.user_id LEFT JOIN department ON user.department_id = department.dept_id GROUP BY department.dept_name', 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.num_awards_dept = results;

				complete();
			});
	};


	// routes
	router.get('/', function(req, res){

		// check to ensure user is logged in...
		if(req.user == undefined){
			res.redirect('./login');
			res.end();
	        return;
	    }
	    
		var callBackCount = 0;
		var context = {};
		context.jsscripts = [];

		context.googlechart = 'https://www.gstatic.com/charts/loader.js';

		// TESTING
		console.log(context.googlecharts);

		// callback to sql queries
		var mysql = req.app.get('mysql');
		getAwardNum(res, mysql, context, complete);
		getAwardeeNum(res, mysql, context, complete);
		getAwardsPerDept(res, mysql, context, complete);

		function complete(){
			callBackCount++;
			if(callBackCount >= 3){
				res.render('admin-bus-intel.handlebars', context);
			}
		};
	});

	// error handling
	router.use(function(err, req, res, next){
		res.status(err.httpStatusCode);
		res.send(err.message);
	});

	return router;
}();