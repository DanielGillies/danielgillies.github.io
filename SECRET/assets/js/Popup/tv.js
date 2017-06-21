function Tv(game, mesh) {
	this.mesh = mesh;
	this.channelsList = [];
	this.currentChannel = 0;
	this.defaultTexture = "assets/video/screen.mp4"; 
	this.currentTexture;
	// this.texture = mesh.material.subMaterials[4].diffuseTexture;
}

Tv.prototype.turnOn = function() {
	this.currentTexture = this.channelsList[this.currentChannel].video;
}

Tv.prototype.addChannel = function(channel) {
	this.channelsList.push(channel);
};

Tv.prototype.nextChannel = function() {
	if (this.currentChannel < this.channelsList.length) {
		this.currentChannel++;
	}
};