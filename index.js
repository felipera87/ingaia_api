app = require('./config.js');

var request = require('request');
var querystring = require('querystring');
var crypto = require('crypto');

var port = process.env.PORT || 80;

app.openWeatherMapID = process.env.OPEN_WEATHER_MAP_ID;

//servidor simples, apenas http
app.listen(port, function() {
	console.log('Servidor iniciado na porta ' + port);

	var senha = process.env.PASS; //passado como parametro pelo heroku
  var hash = crypto.createHmac('sha256', senha).update('', 'utf8').digest('hex'); //serve para criar uma proteção para acessar o login do spotify

	console.log('https://ingaiatest.herokuapp.com/' + hash + '/login');

	//evitar o heroku de derrubar a aplicação no free tier
	setInterval(function(){ console.log('refresh'); }, 30 * 60 * 1000);

});
