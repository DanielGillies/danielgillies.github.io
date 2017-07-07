/**
 * @Author: Danny Gillies
 * Set up the routes for our application
 */

'use strict';

var mongoose = require('mongoose');
var exec = require('child_process').exec;

// Store the database connection in a variable and open the connection
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
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


  app.route('/api/download').get(function (req, res) {
    var cmd = "python server/_downloads/youtube_dl/__main__.py https://www.youtube.com/watch?v=dQw4w9WgXcQ --extract-audio -o test.mp3 --audio-format mp3";
    exec(cmd, function(error, stdout, stderr) {
    });
    // /*echo */exec("cd C:\\xampp\\htdocs\\Audis\\_downloads\\youtube_dl && __main__.py https://www.youtube.com/watch?v=" . $_POST['video'] . " --extract-audio -o \"..\\" . $fileName . ".%(ext)s\" --audio-format mp3");
  })

  app.route('/test').get(function (req, res) {
    res.render("test.html");
  })

  app.route('/eq').get(function (req, res) {
    res.render("datawar.html");
  })


  // Route to load the main page (GO HERE)
  app.route('/').get(function (req, res) {
    res.render('index.html');
  });
};