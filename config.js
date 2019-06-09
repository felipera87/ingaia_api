var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser');

var app = express();

//usa o ejs como engine de view
app.set('view engine', 'ejs');
app.set('views', './app/views');
app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

app.use(function (req, res, next) {

  //Permite conexão vindo de qualquer site
  res.header('Access-Control-Allow-Origin', '*');

  //Inicialmente permite todos os métodos, mas só GET e POST serão usados
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE');

  //Permite os headers
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
});

consign()
	.include('app/controllers')
	.then('app/routes')
  .then('spotify_auth.js')
	.into(app);

module.exports = app;
