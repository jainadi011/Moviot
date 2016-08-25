var express = require('express');
var router = express.Router();
var request = require('request');
var TVDB_API_KEY = '551bc3c029df3f5da46a7aa46f052a7b';
var WIMM_API_KEY = '9u2Ed5TVLp68WkeE';
var BOT_TOKEN = '219874490:AAFPRrnqBz7BvVTHBrqPU8M5fUUo0a4bLfE';
var TELEGRAM_URL = 'https://api.telegram.org/bot'.concat(BOT_TOKEN);

/* GET users listing. */
router.route("/")
    .post(function (req, res) {
        var message = JSON.parse('');
        console.log(message);
        var movie_response = [];
        var WHAT_IS_MY_MOVIE_URL = 'http://api.whatismymovie.com/1.0/?api_key='.concat(WIMM_API_KEY).concat('&text='.concat(message));

        request({
            url: WHAT_IS_MY_MOVIE_URL,
            json: true
        }, function (error, response, body) {

            if (!error && response.statusCode === 200) {
                var l = body.length;
                if (l > 5)
                    l = 5;
                var i = 0;
                for (i = 0; i < l; i = i + 1) {
                    var movie_id = body[i]['imdb_id_long'];
                    var TMDB_URL = 'https://api.themoviedb.org/3/find/'.concat(movie_id).concat('?external_source=imdb_id&api_key=').concat(TVDB_API_KEY);

                    request({
                        url: TMDB_URL,
                        json: true
                    }, function (error, response, body) {

                        if (!error && response.statusCode === 200) {
                            movie_response.push(body['movie_results'][0]);
                            if (movie_response.length == l)
                                res.json(movie_response.toString());
                        }
                    });

                }

            }
        });
    });
module.exports = router;