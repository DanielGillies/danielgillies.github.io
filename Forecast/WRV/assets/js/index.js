jQuery(document).ready(function($) {

    // Resive video
    scaleVideoContainer();

    initBannerVideoSize('.video-container video');

    $(window).on('resize', function() {
        scaleVideoContainer();
        scaleBannerVideoSize('.video-container video');
    });

    // $('.my-slider').unslider();


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

    google.maps.event.addDomListener(window, 'load', init);
    var map;

    function init() {
        var mapOptions = {
            center: new google.maps.LatLng(37.79366, -122.396723),
            zoom: 15,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.DEFAULT,
            },
            disableDoubleClickZoom: true,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            },
            scaleControl: true,
            scrollwheel: true,
            panControl: true,
            streetViewControl: true,
            draggable: true,
            overviewMapControl: true,
            overviewMapControlOptions: {
                opened: false,
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        }
        var mapElement = document.getElementById('contact-map');
        var map = new google.maps.Map(mapElement, mapOptions);
        var locations = [
            ['WRV', 'undefined', 'undefined', 'undefined', 'undefined', 37.79330119999999, -122.39704560000001, 'https://mapbuildr.com/assets/img/markers/default.png']
        ];
        for (i = 0; i < locations.length; i++) {
            if (locations[i][1] == 'undefined') { description = ''; } else { description = locations[i][1]; }
            if (locations[i][2] == 'undefined') { telephone = ''; } else { telephone = locations[i][2]; }
            if (locations[i][3] == 'undefined') { email = ''; } else { email = locations[i][3]; }
            if (locations[i][4] == 'undefined') { web = ''; } else { web = locations[i][4]; }
            if (locations[i][7] == 'undefined') { markericon = ''; } else { markericon = locations[i][7]; }
            marker = new google.maps.Marker({
                icon: markericon,
                position: new google.maps.LatLng(locations[i][5], locations[i][6]),
                map: map,
                title: locations[i][0],
                desc: description,
                tel: telephone,
                email: email,
                web: web
            });
            link = '';
        }

    }
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
