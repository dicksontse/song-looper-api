var express = require('express'),
    playlists = require('./routes/playlists');

var app = express();

var allowCrossDomain = function(req, res, next) {
  var origin = "*";
  if (process.env.NODE_ENV == "production")
    origin = "http://songlooper.com"
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.configure(function() {
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(allowCrossDomain);
});

app.get('/playlists', playlists.findAll);
app.get('/playlists/:id', playlists.findById);
app.post('/playlists', playlists.addPlaylist);
app.put('/playlists/:id', playlists.updatePlaylist);
//app.delete('/playlists/:id', playlists.deletePlaylist);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);
