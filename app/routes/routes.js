module.exports = function (app) {

	//o heroku muda o lugar da propriedade, o consign funciona diferente dentro da estrutura do heroku
	if (app.app !== undefined) {
		var heroku_app = app.app;
	} else {
		var heroku_app = app;
	}

	app.get('/', function (req, res) {
		heroku_app.controllers.controller.main_page(app, req, res);
	});

	app.get('/api/v1/cidade/:nome_cidade', function(req, res) {
		heroku_app.controllers.controller.recommendSongs(app, req, res);
	});

	app.get('/api/v1/cidade/:nome_cidade/qtde/:num_musicas', function(req, res) {
		heroku_app.controllers.controller.recommendSongs(app, req, res);
	});
}
