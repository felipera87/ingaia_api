/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var request = require('request'); // "Request" library
var querystring = require('querystring');
var crypto = require('crypto');


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';


module.exports = function (app) {
  var client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
  var client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
  var redirect_uri = 'https://ingaiatest.herokuapp.com/spotify/callback/'; // Your redirect uri
  var senha = process.env.PASS; //passado como parametro pelo heroku
  var hash = crypto.createHmac('sha256', senha).update('', 'utf8').digest('hex'); //serve para criar uma proteção para acessar o login do spotify

  app.get('/:hash/login', function(req, res) {
    if (hash != req.params.hash) {
      res.json({error: 'Not authorized.'})
      return;
    }

    //var state = generateRandomString(16);
    //res.cookie(stateKey, state);

    // your application requests authorization
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        redirect_uri: redirect_uri
        //, state: state
      }));
  });

  app.get('/spotify/callback', function(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    /*
    if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else */
    if (true) {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {

        if (!error && response.statusCode === 200) {

          var access_token = body.access_token,
              refresh_token = body.refresh_token;

          app.spotifyToken = {
            access_token : body.access_token,
            refresh_token : body.refresh_token
          };

          res.json({status: response.statusCode});
        } else {
          res.redirect('/#' +
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  });

  app.get('/:hash/refresh_token', function(req, res) {
    if (hash != req.params.hash) {
      res.json({error: 'Not authorized.'})
      return;
    }

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
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
      res.json({status: response.statusCode});
    });
  });
}
