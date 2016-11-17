jQuery(document).ready(function($) {

    // Resive video
    scaleVideoContainer();

    initBannerVideoSize('.video-container video');

    $(window).on('resize', function() {
        scaleVideoContainer();
        scaleBannerVideoSize('.video-container video');
    });

    var hash = window.location.hash;
    $(hash).show();

    var first;
    var found = false;

    $(".cd-3d-nav li").each(function(index) {
        if (index == 0)
            first = $(this)
        $(this).removeClass('cd-selected')
        var link = $(this).find("a");
        // console.log(hash);
        // console.log(link.attr("href"));
        if (link.attr("href") == hash) {
            $(this).addClass('cd-selected')
            var selectedItem = $('.cd-selected'),
                selectedItemPosition = selectedItem.index() + 1,
                leftPosition = selectedItem.offset().left,
                backgroundColor = selectedItem.data('color'),
                marker = $('.cd-marker');

            marker.removeClassPrefix('color').addClass('color-' + selectedItemPosition).css({
                'left': leftPosition,
            });
            found = true;
        }
    })

    if (!found) {
        first.addClass('cd-selected');
        $(first.find("a")[0].hash).show();
    }

    // $($(".cd-selected a").attr("href")).show()

    $(".cd-3d-nav a").click(function(event) {

        $(".page").hide();
        $(event.currentTarget.hash).show();
        // $(".page").fadeOut(300, function() {
        //     $(event.currentTarget.hash).fadeIn(300);
        // });
        // console.log(event.currentTarget.hash)
    })

    $(".cd-logo").click(function(event) {
        $(".page").hide();
        $("#home").show();
    })
})

function scaleVideoContainer() {

    var height = $(window).height();
    var unitHeight = parseInt(height) + 'px';
    $('.video-background').css('height', unitHeight);

}

function initBannerVideoSize(element) {

    $(element).each(function() {
        $(this).data('height', $(this).height());
        $(this).data('width', $(this).width());
    });

    scaleBannerVideoSize(element);

}

function scaleBannerVideoSize(element) {

    var windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        videoWidth,
        videoHeight;

    $(element).each(function() {
        var videoAspectRatio = $(this).data('height') / $(this).data('width'),
            windowAspectRatio = windowHeight / windowWidth;

        if (videoAspectRatio > windowAspectRatio) {
            videoWidth = windowWidth;
            videoHeight = videoWidth * videoAspectRatio;
            console.log(windowWidth);
            console.log(videoWidth);
            $(this).css({
                'top': -(videoHeight - windowHeight) / 2 + 'px',
                'margin-left': 0
            });
        } else {
            videoHeight = windowHeight;
            videoWidth = videoHeight / videoAspectRatio;
            $(this).css({
                'margin-top': 0,
                'margin-left': -(videoWidth - windowWidth) / 2 + 'px'
            });
        }

        $(this).width(videoWidth).height(videoHeight);

        $('.video-background .video-container video').addClass('fadeIn animated');


    });
}

