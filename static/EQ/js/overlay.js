var element = document.body;
var overlayActive = true;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

function toggleOverlay() {
    if ($(".overlay").hasClass("open")) {
        $(".overlay").removeClass("open");
        element.requestPointerLock();
        overlayActive = false;
        flashInstructions();
    } else {
        $(".overlay").addClass("open");
        document.exitPointerLock();
        overlayActive = true;
        setTimeout(function() {
            $("#search_query").focus();
        }, 200);
        if ($(".recent_panel").hasClass("active")) {
            $(".recent").empty();
            if ($(".sort_recent").hasClass("active")) loadRecentlyPlayed("played");
            else loadRecentlyPlayed("recent");
        }
    }
}

function flashInstructions() {
    $(".instructions").fadeIn(500, function() {
        setTimeout(function() {
            $(".instructions").fadeOut(500);
        }, 500)
    })
}

$(".close_btn").click(function() {
    toggleOverlay();
})