function TVChannel(game, videoUrl) {
	this.videoUrl = videoUrl;
	this.currentTime = 0;
	this.texture = new BABYLON.VideoTexture("video", [videoUrl], game.scene, true);
	this.video = this.texture.video;
	this.texture.uOffset = -0.04;
    this.texture.uScale = 0.0343;
    this.texture.vOffset = -0.116;
    this.texture.vScale = 0.06;
    this.texture.video.paused = true;
}

TVChannel.prototype.stop = function() {
	this.currentTime = this.video.currentTime;
	this.video.pause();
}

TVChannel.prototype.play = function() {
	this.video.currentTime = this.currentTime;
	this.video.play();
};