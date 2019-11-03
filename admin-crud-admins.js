module.exports = function(){
	var express = require('express');
	var router = express.Router();

	// SQL QUERIES

	// pulls all the user data from db
	function getAdmins(res, mysql, context, complete){
		mysql.pool.query('SELECT user_id, first_name, last_name, user.email, user.password, account_created FROM `user` WHERE user.user_type = "ADMIN"', function(error, results, fields){

			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.users = results;
			complete();
		});
	};

	// pulls user data from db for 1 user
	function getAdmin(res, mysql, context, id, complete){

		var sql = 'SELECT user_id, first_name, last_name, email, password, account_created, FROM user WHERE user_id = ?'
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			context.user = results[0];
			complete();
		});
	};

	// gets page for crud-admins
	router.get('/', function(req, res){
		var callBackCount = 0;
		var context = {};
		context.jsscripts = ['delete_user.js'];

		// CALLBACK TO FUNCTS FOR SQL
		var mysql = req.app.get('mysql');
		getAdmins(res, mysql, context, complete);

		function complete(){
			callBackCount++;
			if(callBackCount >= 1){
				res.render('admin-crud-admins.handlebars', context);
			}
		};
	});

	var create_admin_sql = function(req, res, next){

		var mysql = req.app.get('mysql');

		// specify that it is standard user account
		req.body.user_type = 'ADMIN';

		var sql = 'INSERT INTO user (first_name, last_name, email, password, user_type) VALUES (?,?,?,?,?)';
		var inserts = [req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.user_type];
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

	// TESTING
	router.post('/', create_admin_sql, function(req, res, next){

		// call to mysql db to create admin middleware
		req.create_user_sql;

		res.redirect('/admin-crud-admins.handlebars');

	});

	// deletes an admin
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

	// update user page
	router.get('/:id', function(req, res){

		callBackCount = 0;
		var context = {};
		context.jsscripts = ['select_dept.js', 'update_user.js'];
		var mysql = req.app.get('mysql');
		getUser(res, mysql, context, req.params.id, complete);
		getDepartments(res, mysql, context, complete);
		function complete(){
			callBackCount++;
			if(callBackCount >= 2){
				res.render('update_admin.handlebars', context);
			};
		};
	});

	router.post('/:id', function(req, res){

		var file = req.file
		var mysql = req.app.get('mysql');
		var inserts = [];
		var sql = '';
		req.body.signature_image_path = '';

		// no file upload
		if(!file){
			inserts = [req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.department_id, req.params.id];
			sql = 'UPDATE user SET first_name=?, last_name=?, email=?, password=?, department_id=? WHERE user_id=?';
		}
		// file upload
		else{

			req.body.signature_image_path = file.path;
			inserts = [req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.department_id, req.body.signature_image_path, req.params.id];
			sql = 'UPDATE user SET first_name=?, last_name=?, email=?, password=?, department_id=?, signature_image_path=? WHERE user_id=?';
		}

		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
			else{
				res.status(200);
				res.redirect('/admin-crud-users');
			}
		});
	});

	// error handling
	router.use(function(err, req, res, next){
		res.status(err.httpStatusCode);
		res.send(err.message);
	});

	return router;

}();