var express = require('express');
var bodyParser = require('body-parser');
// var logger = require('morgan');
var methodOverride = require('method-override');
var cors = require('cors');
const winston = require('winston');

var app = express();
// app.use(logger('dev'));
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

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'combined.log' }),
  ],
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

// job autocomplete
app.get('/autocomplete/:str/:lang', function(req, res) {
  if(req.params.lang == "fr") {
    connection.query("select ID as jobId,French as jobTitle from Job where French like '%" + req.params.str + "%'", (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  } else {
    connection.query("select ID as jobId,English as jobTitle from Job where English like '%" + req.params.str + "%'", (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  }
});

// job id to find skills
app.get('/relatedskills/:jobid/:lang', function(req, res) {
  if(req.params.lang == "fr") {
    connection.query("select E.ID as elementId,E.French as elementTitle from JobElements as JE left join Element as E on JE.ElementID = E.ID where JE.JobID = " +req.params.jobid + " and E.ElementGroup = 'Skills' order by importanceValue desc", (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  } else {
    connection.query("select E.ID as elementId,E.English as elementTitle from JobElements as JE left join Element as E on JE.ElementID = E.ID where JE.JobID = " +req.params.jobid + " and E.ElementGroup = 'Skills' order by importanceValue desc", (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  }
});

// write log file
app.get('/writelog', function(req, res) {
  logger.info('dream: ' + req.query.dream + ", pastJob1: " + req.query.past1 +
  ", pastJob2: " + req.query.past2 + ", pastJob3: " + req.query.past3 + ", pastJob4: "
   + req.query.past4 + ", time: " + req.query.ts);
   res.json("success");
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("server address is http://localhost:%s", port)
});
