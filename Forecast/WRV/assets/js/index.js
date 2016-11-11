jQuery(document).ready(function($) {
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

    #(".cd-logo").click(function(event) {
        #(".page").hide();
        ("#home").show();
    })
})
