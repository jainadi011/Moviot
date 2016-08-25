var express = require('express');
var router = express.Router();
var request = require('request');
var verify_token = 'zriton';
var token = "EAAGPrQXOzw4BADZCoXr3Kcdmt7AwZCWappKuy26O8vWowhogsorjZAeFVRWA6pl104o303gUmg3teCzDX2pjetuPZBDxkuI3URCHq31t9fJZCsuj7VIIXaOzQDEi0dtNhZCea1MYP0923loHeDsi7kvSWxZAidkb13xNC3ZC3HA1viD7qLJBYAoU";
var TVDB_API_KEY = '551bc3c029df3f5da46a7aa46f052a7b';
var WIMM_API_KEY = '9u2Ed5TVLp68WkeE';
var TMDB_IMAGE_URL='http://image.tmdb.org/t/p/w500/';
/* GET users listing. */
router.get('/', function(req, res) {
    if (req.query['hub.verify_token'] === verify_token) {
        res.send(req.query['hub.challenge']);
    }

    res.send('Error, wrong validation token');
});
router.route("/")
    .post(function (req, res) {
        console.log(req.body);
        var messaging_events = req.body.entry[0].messaging;
        for (var i = 0; i < messaging_events.length; i++) {
            var event = req.body.entry[0].messaging[i];
            var sender = event.sender.id;
            if (event.message && event.message.text) {
                text = event.message.text;
                searchMovie(sender,text);
            }
        }
        res.sendStatus(200);
    });
function sendTextMessage(sender, text) {
    var messageData = {
        text:text
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
function sendGenericMessage(sender,elements) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}
function searchMovie(sender, text)
{
    var movie_response_title = [];
    var movie_response_image = [];
    var elements =[];
    var WHAT_IS_MY_MOVIE_URL = 'http://api.whatismymovie.com/1.0/?api_key='.concat(WIMM_API_KEY).concat('&text='.concat(text));
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
                        elements.push({
                            "title": body['movie_results'][0]['original_title'],
                            "subtitle": body['movie_results'][0]['overview'],
                            "image_url": TMDB_IMAGE_URL+body['movie_results'][0]['poster_path'],
                            "buttons": [{
                                "type": "web_url",
                                "url": "https://www.messenger.com/",
                                "title": "Trailer"
                            }]
                        });
                        if (movie_response_title.length == l)
                            sendGenericMessage(sender, elements);
                    }
                });

            }

        }
    });
}

module.exports = router;
