module.exports = function(){
	var express = require('express');
	var router = express.Router();
	var multer = require('multer');
	var upload = multer({dest: 'signatures'});

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
				res.render('admin-crud-users.handlebars', context);
			}
		};

	});

	var signature_upload_setup = function(req, res, next){

		upload.single('signature');

		// upload of sig file
		var file = req.file;
		if(!file){
			var error = new Error('Please upload a file');
			error.httpStatusCode = 400;
			return next(error);
		}
		req.body.signature_image_path = file.path;
		next();
	}

	var create_user_sql = function(req, res, next){

		var mysql = req.app.get('mysql');

		// specify that it is standard user account
		req.body.user_type = 'USER';

		var sql = 'INSERT INTO user (first_name, last_name, email, password, department_id, user_type, signature_image_path) VALUES (?,?,?,?,?,?,?)';
		var inserts = [req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.department_id, req.body.user_type, req.body.signature_image_path];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}else{
				next();
			}
		});
	}

	// sends new user account info
	router.post('/', upload.single('signature'), function(req, res, next){

		// upload of sig file
		var file = req.file;
		if(!file){
			var error = new Error('Please upload a file');
			error.httpStatusCode = 400;
			return next(error);
		}
		req.body.signature_image_path = file.path;

		// TODO: NOT WORKING...
		// generate timestamp
		//var timestamp = new Date();
		//req.body.account_created = timestamp.toUTCString();

		// specify that it is standard user account
		req.body.user_type = 'USER';

		// TESTING
		console.log(req.body);

		var mysql = req.app.get('mysql');
		var sql = 'INSERT INTO user (first_name, last_name, email, password, department_id, user_type, signature_image_path) VALUES (?,?,?,?,?,?,?)';
		var inserts = [req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.department_id, req.body.user_type, req.body.signature_image_path];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}else{
				res.redirect('/admin-crud-users');
			}
		});

	});

	// deletes a user
	router.delete('/:id', function(req, res){

		var mysql = req.app.get('mysql');
		var sql = 'DELETE FROM user WHERE user_id=?';
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
		});
	});

	return router;

}();