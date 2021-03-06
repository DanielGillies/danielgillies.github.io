/**
 * @Author: Sann-Remy Chea
 * (https://github.com/srchea/Sound-Visualizer/)
 * Modified by Danny Gillies
 */
var context;
var source, sourceJs;
var analyser;
var url = '../data/01_Aqua.mp3';
var binaries = new Array();
var boost = 0;

var interval = window.setInterval(function() {
    if ($('#loading_dots').text().length < 3) {
        $('#loading_dots').text($('#loading_dots').text() + '.');
    } else {
        $('#loading_dots').text('');
    }
}, 500);

try {
    if (typeof AudioContext === 'function' || 'AudioContext' in window) {
        context = new AudioContext();
    } else if (typeof webkitAudioContext === 'function' || 'AudioContext' in window) {
        context = new webkitAudioContext();
    }
} catch (e) {
    $('#info').text('Web Audio API is not supported in this browser');
}

/**
 * @Author: Danny Gillies
 * @param choice
 */
var chooseSong = function(choice) {
    stop();
    if (choice == 0) {
        var url = '../EQ/data/01_Aqua.mp3';
    } else if (choice == 1) {
        var url = '../EQ/data/cavetrolls.mp3';
    } else if (choice == 2) {
        var url = '../EQ/data/starwars.mp3';
    } else if (choice == 3) {
        var url = '../EQ/data/O_Fortuna.mp3';
    } else if (choice == 4) {
        var url = '../EQ/data/skyrim.mp3';
    } else if (choice == 5) {
        var url = '../EQ/data/08_Spring_Summer.mp3';
    }
    startSong(url);
};
var request = new XMLHttpRequest();

/**
 * Moved into a function to stop autoplay by Danny Gillies
 * @param url
 */
function startSong(url) {
    stop();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() {
        context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    $('#info').text('Error decoding file data');
                    return;
                }

                sourceJs = context.createScriptProcessor(2048, 1, 1);
                sourceJs.buffer = buffer;
                sourceJs.connect(context.destination);
                analyser = context.createAnalyser();
                analyser.smoothingTimeConstant = 0.6;
                analyser.fftSize = 1024;

                source = context.createBufferSource();
                source.buffer = buffer;
                source.loop = true;

                source.connect(analyser);
                analyser.connect(sourceJs);
                source.connect(context.destination);

                sourceJs.onaudioprocess = function(e) {
                    var temp = [];
                    binaries = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(binaries);
                    // for (var i = 0; i < binaries.length; i++) {
                    //     binaries[i] = (binaries[i] + 1) * 128.0;
                    // }
                    // num0 = 0;
                    // for (var i = 0; i < binaries.length; i++) {
                    //     if (binaries[i] == 0) {
                    //         num0++;
                    //     } else {
                    //         num0 = 0;
                    //     }
                    //     if (num0 > 10) {
                    //         i = i-10;
                    //         break;
                    //     }
                    //     // binaries[i] = (binaries[i] + 1) * 128.0;
                    // }
                    // console.log(i);
                    // console.log(binaries);
                    // for (var i = 0; i < 1024; i++) {
                    //     temp.push((binaries[i] + 140)* 2);
                    // }
                    // console.log(temp);
                };

                $('#info')
                    .fadeOut('normal', function() {
                        $(this).html('<div id="artist"><a class="name" href="https://soundcloud.com/coyotekisses" target="_blank">Coyote Kisses</a><br /><a class="song" href="https://soundcloud.com/coyotekisses/six-shooter" target="_blank">Six shooter</a><br /></div><div><img src="data/coyote_kisses.jpg" width="58" height="58" /></div>');
                    })
                    .fadeIn();

                clearInterval(interval);

                // popup
                // $('body').append($('<div onclick="play();" id="play" style="width: ' + $(window).width() + 'px; height: ' + $(window).height() + 'px;"><div id="play_link"></div></div>'));
                // $('#play_link').css('top', ($(window).height() / 2 - $('#play_link').height() / 2) + 'px');
                // $('#play_link').css('left', ($(window).width() / 2 - $('#play_link').width() / 2) + 'px');
                // $('#play').fadeIn();

                play();
            },
            function(error) {
                $('#info').text('Decoding error:' + error);
            }
        );
    };
    request.onerror = function() {
        $('#info').text('buffer: XHR error');
    };

    request.send();

}

function displayTime(time) {
    if (time < 60) {
        return '0:' + (time < 10 ? '0' + time : time);
    } else {
        var minutes = Math.floor(time / 60);
        time -= minutes * 60;
        return minutes + ':' + (time < 10 ? '0' + time : time);
    }
}

function play() {
    $('#play').fadeOut('normal', function() {
        $(this).remove();
    });
    source.start(0);
}

/**
 * @Author: Danny Gillies
 * Stop music
 */
function stop() {
    if (source != null)
        source.stop();
}

$(window).resize(function() {
    if ($('#play').length === 1) {
        $('#play').width($(window).width());
        $('#play').height($(window).height());

        if ($('#play_link').length === 1) {
            $('#play_link').css('top', ($(window).height() / 2 - $('#play_link').height() / 2) + 'px');
            $('#play_link').css('left', ($(window).width() / 2 - $('#play_link').width() / 2) + 'px');
        }
    }
});

if (config.audio.autoplay == true) {
    chooseSong(config.audio.selectedSong);
}
