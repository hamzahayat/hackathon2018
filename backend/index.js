
// Using express: http://expressjs.com/

var express = require('express'); 
var mysql = require('mysql');
const cors = require('cors')
var app = express();
var server = app.listen(3000);
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

// This is for hosting files
// Anything in the public directory will be served
// This is just like python -m SimpleHTTPServer
// We could also add routes, but aren't doing so here
app.use(express.static('public'));

// The 'fs' (file system) module allows us to read and write files
// http://nodejs.org/api/fs.html
// This is how we'll load data
var fs = require('fs');



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'backend'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});


// Route for sending all the concordance data
app.get('/all', showAll);

// Callback
function showAll(req, res, next) {
 connection.query('SELECT * FROM signtransaction', (err,rows) => {
  if(err) throw err;
	res.send(rows);  
});
}

app.get('/delete/:id', deletebyid);

function deletebyid(req, res, next) {
  var id = Number(req.params.id);
 console.log(id);
 connection.query(
  'DELETE FROM signtransaction WHERE Id = ?',[id], (err, result) => {
    if (err) throw err;
	res.send(`Deleted ${result.affectedRows} row(s)`);  
  }
);
}

app.post('/create',urlencodedParser,insert);

function insert(req, res,next) {
  console.log('posting'); 
 const signtransaction = {	 
	 address: req.body.address,
	 data: req.body.data	 
 };
 console.log(signtransaction.firstname);
 connection.query('INSERT INTO signtransaction SET ?', signtransaction, (err, result) => {
  if(err) throw err;
  res.send('Inserted');
});
}

app.post('/edit',urlencodedParser,edit);

function edit(req, res,next) {
 const signtransaction = {
	 Id: req.body.Id,
     address: req.body.address,
	 data: req.body.data	 
 };
connection.query(
  'UPDATE signtransaction SET address = ?, data = ?  Where ID = ?',
  [signtransaction.address,signtransaction.data],
  (err, result) => {
    if (err) throw err;
	 res.send('Updated');
      }
);
}





