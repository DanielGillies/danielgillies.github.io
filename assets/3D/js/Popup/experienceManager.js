function ExperienceManager() {
	this.parent = new Manager();
	console.log(this.parent);
}

// ExperienceManager.prototype.addItem = function(workExperience) {
// 	this.parent.addItem(workExperience);
// }

ExperienceManager.prototype.buildCurrentExperience = function() {
	this.experienceList[this.currentExperience].generateHTML();
	this.experienceList[this.currentExperience].buildDom();
};

ExperienceManager.prototype.nextExperience = function() {
	if (this.currentExperience < this.numExperiences - 1) {
		this.currentExperience++;
		this.buildCurrentExperience();
	}
};

ExperienceManager.prototype.prevExperience = function() {
	if (this.currentExperience > 0) {
		this.currentExperience--;
		this.buildCurrentExperience();
	}
};