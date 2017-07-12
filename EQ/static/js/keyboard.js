/**
 * @author:Daniel Gillies
 * @author:Travis Bennett
 *
 * Handles controls for Menu
 */
var init_keys = function(renderDom) {
    // only on keydown + no repeat
    var scope = this;
    var wasPressed = {};

    this.keyboard = new THREEx.KeyboardState(renderDom);

    window.addEventListener('keydown', function(event) {
        if (controls.enabled) {
            if (scope.keyboard.eventMatches(event, 'm') && !wasPressed['m']) {
                console.log("Stoping music");
                stop();
            }
            if (scope.keyboard.eventMatches(event, 'q') && !wasPressed['q']) {
                console.log("Changing eq animation");
                pointCloud2.animation++;
                if (pointCloud2.animation == 4) {
                    pointCloud2.animation = 0;
                }
                console.log(pointCloud2);
                // pointCloud2.initNew();
            }
            if (scope.keyboard.eventMatches(event, 'p') && !wasPressed['p']) {
                console.log("Starting");
                // chooseSong(config.audio.selectedSong);
                $("#blankOverlay").fadeOut();
            }
            if (scope.keyboard.eventMatches(event, 'v') && !wasPressed['v']) {
                console.log("Opening overlay");
                toggleOverlay();
            }
        }
    });

    // listen on keyup to maintain ```wasPressed``` array
    window.addEventListener('keyup', function(event) {
        if (scope.keyboard.eventMatches(event, 'm')) {
            wasPressed['m'] = false;
        }
        if (scope.keyboard.eventMatches(event, 'q')) {
            wasPressed['q'] = false;
        }
        if (scope.keyboard.eventMatches(event, 'p')) {
            wasPressed['p'] = false;
        }
        if (scope.keyboard.eventMatches(event, 'v')) {
            wasPressed['v'] = false;
        }

    })
};
