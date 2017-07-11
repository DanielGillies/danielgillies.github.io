function performSearch() {
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: "snippet",
            type: "video",
            maxResults: 6,
            key: "AIzaSyAioQgzf4i7pI6bsGmyvZRX4dGW2wpEttw",
            q: $("#search_query").val()
        },
        function(data) {
            unbindSearchResults();
            $('.search_results').empty();
            console.log(data.items);
            var results = data.items;
            for (var i = 0; i < results.length; i++) {
                $(".search_results").append(
                    "<div class=\"result\" data-id=\"" + results[i].id.videoId + 
                    "\" data-title=\"" + results[i].snippet.title + 
                    "\" data-channel_name=\"" + results[i].snippet.channelTitle + 
                    "\" data-description=\"" + results[i].snippet.description +
                    "\" data-thumbnail=\"" + results[i].snippet.thumbnails.default.url +
                    "\"><img src=\"" + results[i].snippet.thumbnails.default.url + 
                    "\"><div class=\"info\"><h2>" + results[i].snippet.title + "</h2>" + 
                    "<h4>" + results[i].snippet.channelTitle + "</h4></div></div>"
                );
                // console.log(results[i].id.videoId) ;
                // console.log(results[i].snippet.title);
            }
            bindSearchResults();
        })
}

function bindSearchResults() {
    $(".search_results > div").on("click", function() {
        var query = {
            id: $(this).data("id"),
            title: $(this).data("title"),
            description: $(this).data("description"),
            channel_name: $(this).data("channel_name"),
            thumbnail: $(this).data("thumbnail")
        }
        $.get(
            "/api/download",
            query,
            function(response) {
                console.log(response);
                startSong("assets/audio/downloaded/" + response.file + ".mp3");
            }
        )
    });
}

function unbindSearchResults()
{
    $('.search_results > div').unbind("click");
}

$("#search_query").on("keyup", function(event) {
    if (event.which == 13)
        performSearch();
})
