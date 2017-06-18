function Award(award, organization, date, description, video) {
	this.award = award || "AWARD";
	this.organization = organization || "ORG";
	this.date = date || "DATE";
	this.description = description || "Default DESC";
	this.video = video || "https://www.youtube.com/watch?v=CPVkHJNdHt8" // Default to crunch video lol
}

Award.prototype.generateHTML = function() {
	this.HTML = "<h1>" + this.award + ", " + this.organization + "</h1>" + 
	"<h2>" + this.date + "</h2>" +
	"<p>" + this.description + "</p>" + 
	"<h2>Video</h2>" + 
	"<div class='aspect-ratio'>" + 
	'<iframe width="560" height="315" src="https://www.youtube.com/embed/' + this.video + '&amp;rel=0" frameborder="0" allowfullscreen></iframe>' +
	"</div>";
	// for (var i = this.highlights.length - 1; i >= 0; i--) {
	// 	this.HTML += "<li>" + this.highlights[i] + "</li>";
	// }
	// this.HTML += "</ul>";
	this.buildDom();
};

Award.prototype.buildDom = function() {
	$(SETTINGS.SELECTORS.popup + " " + SETTINGS.SELECTORS.content).html(this.HTML);
};