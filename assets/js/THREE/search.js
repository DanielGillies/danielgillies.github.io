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
        	console.log(data.items);
        	var results = data.items;
        	for (var i = 0; i < results.length; i++)
        	{
        		$(".search_results").append(
        			"<div data-id=\"" + results[i].id.videoId + "\" data-title=\"" + results[i].snippet.title + "\"><h2>" + results[i].snippet.title + "</h2></div>"
        			);
        		// console.log(results[i].id.videoId);
        		// console.log(results[i].snippet.title);
        	}
            bindSearchResults();
        })
}

function bindSearchResults()
{
	$(".search_results > div").on("click", function() {
		var query = {
			id: $(this).data("id")
		}
		$.get(
			"/api/download",
			query,
			function(response)
			{
				console.log(response);
				startSong(response.file + ".mp3");
			}
		)
	});
}

$("#search_query").on("keyup", function(event) {
	if (event.which == 13)
		performSearch();
})