
var express = require('express');
var router = express.Router();
var multiparty = require('connect-multiparty'), multipartyMiddleware = multiparty ({uploadDir: './images' });

const fs = require('fs');


var uploadedFileName = null;    
var current_user_id = null;
var current_user_type = 'USER';

router.get('/', function (req, res, next) {
  var context = {};
  var mysql = req.app.get('mysql');

  if(!req.session){
    res.redirect('./login');
    res.end();
    return;

  }

  /*mysql.pool.query("SELECT user_id, first_name, last_name, email, password, signature_image_path, DATE_FORMAT(account_created, '%m/%d/%Y') AS account_created" + 
      " FROM user WHERE user_id=?", [req.query.user_id], function (err, rows, fields) {*/
      mysql.pool.query("SELECT user_id, first_name, last_name, email, password, " + 
      " signature_image_path, DATE_FORMAT(account_created, '%m/%d/%Y %T') AS account_created, user_type" + 
      " FROM user WHERE email=?", [req.user], function (err, rows, fields) {
        // " FROM user", [req.query.user_id], function (err, rows, fields) {
        if (err) {
          next(err);
          return;
      }
      context.results = rows;
      if (rows.length == 0) {
        res.render('login', context);
      }else if (rows.length == 1) {
        var curVals = rows[0];
        current_user_id = curVals.user_id;
        current_user_type = curVals.user_type;
        if (current_user_type == "ADMIN"){
          res.redirect('./ADMIN-crud-users');
          res.end();
        } else{
          res.render('userprofile', context);
        }
      }
  });
});

router.get('/update', multipartyMiddleware, function (req, res, next) {
  var context = {};
  var mysql = req.app.get('mysql');
  var date = new Date();
  mysql.pool.query("SELECT * FROM user WHERE user_id=?",current_user_id, function (err, result) {
      if (err) {
          next(err);
          return;
      }
      
      //var file = req.files.file;
      //if (file.size == 0){
      //  res.render('userprofile', context);
      //}
      
      //var file = req.files.file;
      var signature_image = uploadedFileName;
      //fs.renameSync(file.path, signature_image);
      if (result.length == 1) {
          var curVals = result[0];
          mysql.pool.query("UPDATE user SET first_name=?, last_name=?, email=?, signature_image_path=?, account_created=?, password=? WHERE user_id=?", 
      [req.query.first_name || curVals.first_name, req.query.last_name || curVals.last_name, req.query.email
       || curVals.email, uploadedFileName || curVals.signature_image_path, date, req.query.password 
       || curVals.password, current_user_id], function (err, result) {
        if (err) {
            next(err);
            return;
        }
        mysql.pool.query('SELECT * FROM user WHERE user_id=?', current_user_id, function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            context.results = rows;
            //res.render('userprofile', context);
            res.redirect('../userprofile');
            res.end();
        });
    });
      }
  });
});

router.post('/upload_file', multipartyMiddleware, function(req, res, next) {
  var context = {};
  var mysql = req.app.get('mysql');
  
  var file = req.files.file;
  if(file.size > 0)
  {
    fs.renameSync(file.path, "public/images/Signature_" + current_user_id + ".png");
    uploadedFileName = "../static/images/Signature_" + current_user_id + ".png";

    mysql.pool.query('SELECT * FROM user WHERE user_id=?',current_user_id, function (err, rows, fields) {
      if (err) {
          next(err);
          return;
      }
      context.results = rows;
      //res.render('userprofile', context);
      res.redirect('../userprofile');
      res.end();
    });
  }
  else
  {
    res.redirect('../userprofile');
    res.end();
  }
});



module.exports = router;