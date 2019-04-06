const express = require('express');
const bodyParser = require('body-parser');
// Create global app object
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(express.static(__dirname + '/assets'));
require('./routes/api/restaurants');

app.use(require('./routes'));
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// finally, let's start our server...
var server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});
