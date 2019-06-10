var request = require('request');
var querystring = require('querystring');
var crypto = require('crypto');

function revalidateSpotify (num_tries, callback) {
  var client_id = process.env.SPOTIFY_CLIENT_ID;
  var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  num_tries++;

  setTimeout(function(){
    var refresh_token = app.spotifyToken.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        app.spotifyToken = {
          access_token : body.access_token,
          refresh_token : body.refresh_token
        };
      }
      callback();
    });

  }, num_tries * 3000);
}

//faz a requisição aos serviços do spotify e open weather map
function requestServices (app, req, res, num_tries = 0) {
  //verificação da api do spotify
  if (app.spotifyToken === undefined) {
    res.status(500).json({error: 'Spotify not validated.'});
    return;
  }

  if (app.spotifyToken.access_token === undefined) {
    res.status(500).json({error: 'Spotify not validated.'});
    return;
  }

  //preparar a query para o serviço da open weather map
  var query = querystring.stringify({
    q: req.params.nome_cidade,
    appid: app.openWeatherMapID
  });

  var options = {
    url: 'http://api.openweathermap.org/data/2.5/weather?' + query,
    json: true
  };

  //realizar a requisição do serviço para saber a temperatura
  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var genre = '';
      var temperature = body.main.temp - 273.15;

      //regra da temperatura dada pelas especificações da API
      if (temperature >= 25) {
        genre = 'pop';
      }
      else if (temperature >= 10 && temperature < 25) {
        genre = 'rock';
      }
      else {
        genre = 'classical';
      }

      var num_musicas = 10;

      //valida se o parametro de qtde de músicas é numérico
      if (req.params.num_musicas !== undefined) {
        if (/\D+/g.test(req.params.num_musicas)) {
          res.status(400).json({error: 'Number of songs is invalid.'});
          return;
        } else {
          num_musicas = req.params.num_musicas;
        }
      }

      //regra da API do spotify, o limite precisa estar entre 1 e 100
      if (num_musicas < 1)
        num_musicas = 1;
      if (num_musicas > 100)
        num_musicas = 100;

      //preparar query para fazer a requisição ao serviço do spotify
      var query = querystring.stringify({
        seed_genres: genre,
        type: 'track',
        limit: num_musicas
      });

      var options = {
        url: 'https://api.spotify.com/v1/recommendations?' + query,
        headers: { 'Authorization': 'Bearer ' + app.spotifyToken.access_token },
        json: true
      };

      //realizar a requisição das recomendações de música baseada no genero
      request.get(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          //objeto json resultado, retorna temperatura, genero definido e uma lista de 10 músicas
          var result = {
            temperature: temperature,
            genre: genre,
            songs: []
          };

          //retira somente os nomes das músicas
          body.tracks.forEach(function(value, index) {
            result.songs[index] = value.name;
          });

          res.json(result);
        }
        else {
          console.log(body);
          revalidateSpotify(num_tries, function() {
              requestServices(app, req, res, num_tries + 1);
          });
        }
      });
    } else {
      res.status(body.cod).json({'error': body.message});
    }
  });
}

module.exports.main_page = function (app, req, res) {
  res.render('main_page', {url: 'https://ingaiatest.herokuapp.com'});
}

//função que busca as recomedações baseado na temperatura da cidade
module.exports.recommendSongs = function (app, req, res) {
  requestServices(app, req, res);
}
