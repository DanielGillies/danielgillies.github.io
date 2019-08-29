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
var resume = require("../assets/data/resume.json");

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

// Checks for mobile
function isCallerMobile(req) {
  var ua = req.headers['user-agent'].toLowerCase(),
    isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));

  return !!isMobile;
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

                //var cmd = "python server/_downloads/youtube_dl/__main__.py https://www.youtube.com/watch?v=" + id + " --extract-audio -o " + fullpath + ".mp3 --audio-format mp3";
                var cmd = "youtube-dl https://www.youtube.com/watch?v=" + id + " --extract-audio -o " + fullpath + ".mp3 --audio-format mp3";
                console.log(cmd);
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

    app.route("/api/get_resume").get(function(req, res) {
      res.setHeader("Content-Type", "application/json");
      res.json(resume);
    })

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
        var isMobile = isCallerMobile(req);
        if (isMobile) {
            res.render("personal.html");
        } else {
            res.render('index.html');
        }
    });
};
