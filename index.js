app = require('./config.js');

var port = process.env.PORT || 80;

app.openWeatherMapID = process.env.OPEN_WEATHER_MAP_ID;

//servidor simples, apenas http
app.listen(port, function() {
	console.log('Servidor iniciado na porta ' + port);
});
