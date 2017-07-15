/**
 * @Author: Danny Gillies
 * Set up the routes for our application
 */

'use strict';

var MAX_SONGS = 100;

var downloadPath = "assets/audio/downloaded/";

var uniqid = require('uniqid');
var mongoose = require('mongoose');
var path = require("path");
var Song = require(path.resolve("server/models/song.js"));
var exec = require('child_process').exec;
var fs = require("fs");

// Store the database connection in a variable and open the connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Checks to see if we are at our maximum number of songs and deletes last one if we are
function checkNumSongs() {
    Song.find({}, function(err, songs) {
        if (songs.length > MAX_SONGS) {
            var query = Song.find({}, null, { limit: 1, sort: { 'timestamp': 1 } });
            query.exec(function(err, songs) {
                fs.unlink("assets/audio/downloaded/" + songs[0].file + ".mp3", function(err) {
                    if (err) return err;
                });
                Song.remove({ id: songs[0].id }, function(err) {
                    if (err) return err;
                });
            });
        }
    })
}

module.exports = function(app) {

    app.engine('html', require('ejs').renderFile);

    app.route('/api/getRecent').get(function(req, res) {
        if (req.query.sortOrder == "played") {
            var query = Song.find({}, null, { limit: 100, sort: { 'playCount': -1 } });
        } else {
            var query = Song.find({}, null, { limit: 100, sort: { 'timestamp': -1 } });
        }
        query.exec(function(err, songs) {
            res.json(songs);
            // console.log(songs);
        });
    })

    app.route('/api/playRecent').get(function(req, res) {
        var id = req.query.id;

        Song.findOneAndUpdate({ id: id }, { $inc: { playCount: 1 }, $set: { timestamp: Date.now() } }, function(err, song) {
            if (err) return res.send(500, { error: err });
            console.log(song);
            res.json({ file: song.file })
        })
    })

    app.route('/api/download').get(function(req, res) {
        var id = req.query.id;
        var title = req.query.title;
        var description = req.query.description;
        var channel_name = req.query.channel_name;
        var thumbnail = req.query.thumbnail;

        Song.findOneAndUpdate({ id: id }, { $inc: { playCount: 1 } }, function(err, song) {
            if (err) return res.send(500, { error: err });
            if (song) {
                res.json({ file: song.file, playCount: song.playCount })
            } else {
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
                        timestamp: Date.now(),
                        playCount: 1,
                        id: id
                    });
                    song.save(function(err, song) {
                        if (err) return console.error(err);
                        console.log("STORED VIDEO: " + title + " ---- " + filename);
                        checkNumSongs();
                        res.json({ file: filename, playCount: 1 });
                    })
                })
            }

        });
    });

    app.route('/send_email').get(function(req, res) {
    })

    app.route('/jukebox').get(function(req, res) {
        res.render("jukebox.html");
    })

    app.route("/personal").get(function(req, res) {
        res.render("personal.html");
    })

    app.route("/resume").get(function(req, res) {
        res.render("resume.html");
    })

    // Route to load the main page (GO HERE)
    app.route('/').get(function(req, res) {
        res.render('index.html');
    });
};
