function WorkExperience(title, company, startDate, endDate){
	this.title = title;
	this.company = company;
	this.description = "Default Description."
	this.startDate = startDate;
	this.endDate = endDate;
	this.highlights = [];
	this.HTML = "<h1>NOT DONE YET</h1>"
}

WorkExperience.prototype.addHighlight = function(highlightText) {
	this.highlights.push(highlightText);
};

WorkExperience.prototype.setDescription = function(description) {
	this.description = description;
};

WorkExperience.prototype.generateHTML = function() {
	this.HTML = "<h1>" + this.title + ", " + this.company + "</h1>" + 
	"<h2>" + this.startDate + " - " + this.endDate + "</h2>" +
	"<p>" + this.description + "</p>" + 
	"<h2>Highlights</h2><ul>";
	for (var i = this.highlights.length - 1; i >= 0; i--) {
		this.HTML += "<li>" + this.highlights[i] + "</li>";
	}
	this.HTML += "</ul>";
	this.buildDom();
};

WorkExperience.prototype.buildDom = function() {
	$(".popup .content").html(this.HTML);
};