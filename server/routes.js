/**
 * @Author: Danny Gillies
 * Set up the routes for our application
 */

'use strict';

var downloadPath = "assets/audio/downloaded/";

var uniqid = require('uniqid');
var mongoose = require('mongoose');
var path = require("path");
var Song = require(path.resolve("server/models/song.js"));
var exec = require('child_process').exec;

// Store the database connection in a variable and open the connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
// var dt;


module.exports = function(app) {

    app.engine('html', require('ejs').renderFile);

    // Route that client calls to get tweets from database
    // app.route('/api/tweets')
    //     .get(function (req, res) {
    //       console.log(req.query.date);
    //       dt = req.query.date;
    //       Tweet.find({created_at: {$gt: dt}}, function (err, tweets) {
    //         if (err) return handleError(err);
    //         res.json({tweets: tweets});
    //       }).limit(70);
    //     });


    // // Route to clear out the database
    // app.route('/fresh')
    //     .get(function (req, res) {
    //       Tweet.remove({}, function (err) {
    //         if (err) return handleError(err);
    //         res.render('datawar.html');
    //       });
    //     });

    /*
    id: $(this).data("id"),
            title: $(this).data("title"),
            description: $(this).data("description"),
            channel_name: $(this).data("channel_name")
            */

    app.route('/api/getRecent').get(function(req, res) {
        var query = Song.find({}, null, { limit: 5, sort: { 'timestamp': -1 } });
        query.exec(function(err, songs) {
            res.json(songs);
            console.log(songs);
        });
        // var songs = Song.find().sort("timestamp", -1).limit(5);
        // console.log(songs);
    })

    app.route('/api/download').get(function(req, res) {
        var id = req.query.id;
        var title = req.query.title;
        var description = req.query.description;
        var channel_name = req.query.channel_name;
        var thumbnail = req.query.thumbnail;

        var filename = uniqid();
        var fullpath = downloadPath + filename;

        var cmd = "python server/_downloads/youtube_dl/__main__.py https://www.youtube.com/watch?v=" + id + " --extract-audio -o " + fullpath + ".mp3 --audio-format mp3";
        exec(cmd, function(error, stdout, stderr) {
            // save file info in database
            var song = new Song({
                file: filename,
                title: title,
                channel: channel_name,
                description: description,
                thumbnail: thumbnail,
                timestamp: Date.now()
            });
            song.save(function(err, song) {
                if (err) return console.error(err);
                console.log("STORED VIDEO: " + title + " ---- " + filename);
            })

            // Send filename to client
            res.json({ file: filename });
        });
    });

    app.route('/test').get(function(req, res) {
        res.render("test.html");
    })

    app.route('/eq').get(function(req, res) {
        res.render("datawar.html");
    })


    // Route to load the main page (GO HERE)
    app.route('/').get(function(req, res) {
        res.render('index.html');
    });
};
