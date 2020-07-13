var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var cors = require('cors');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Jessie990204',
  database: 'SkillsIdentifier'
});

// test api
app.get('/test', function(req, res) {
  connection.query('select * from ParentJobTranslation', (err, rows) => {
    if (err) throw err;
    
    res.json(rows);
  });
});


// onet soc code to French api
app.get('/parentjobfrench/:onetsoccode', function(req, res) {
  connection.query("select * from ParentJobTranslation where ONETSOCCode = '" + req.params.onetsoccode + "'", (err, rows) => {
    if (err) throw err;
    if (rows.length > 0) {
      res.json(rows[0].French)
    }
    else {
      res.json("");
    }
  });
});

// skill uuid to French
app.get('/skillfrench/:uuid', function(req, res) {
  connection.query("select * from SkillTranslation where SkillUUId = '" + req.params.uuid + "'", (err, rows) => {
    if (err) throw err;
    if (rows.length > 0) {
      res.json(rows[0].French);
    }
    else {
      res.json("");
    }
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("server address is http://localhost:%s", port)
});
