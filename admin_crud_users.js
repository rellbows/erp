module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// SQL QUERIES

	// pulls the department data from db
	function getDepartments(res, mysql, context, complete){
		mysql.pool.query('SELECT dept_id, dept_name FROM department', 
			function(error, results, fields){
				if(error){
					res.write(JSON.stringify(error));
					res.end();
				}
				context.department = results;

				complete();
			});
	};

	// pulls the user data from db
	function getUsers(res, mysql, context, complete){
		mysql.pool.query('SELECT user_id, first_name, last_name, user.email, user.password, department.dept_id, department.dept_name, account_created FROM `user` LEFT JOIN `department` ON user.department_id = department.dept_id WHERE user.user_type = "USER"', function(error, results, fields){

			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.users = results;
			complete();
		});
	};

	// gets page for crud-users
	router.get('/', function(req, res){
		var callBackCount = 0;
		var context = {};
		context.jsscripts = ['delete_user.js'];

		// CALLBACK TO FUNCTS FOR SQL
		var mysql = req.app.get('mysql');
		getDepartments(res, mysql, context, complete);
		getUsers(res, mysql, context, complete);

		function complete(){
			callBackCount++;
			if(callBackCount >= 2){
				res.render('admin_crud_users.handlebars', context);
			}
		};

	});

	// sends new user account info
	router.post('/', function(req, res){

		// TESTING
		console.log(req.body);
	});

	// deletes a user
	router.delete('/:id', function(req, res){

		// TESTING
		console.log(req.params.id);

		/*
		var mysql = req.app.get('mysql');
		var sql = 'DELETE FROM user WHERE id=?';
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}
			else{
				res.status(202).end();
			}
		})
		*/
	})

	return router;

}();