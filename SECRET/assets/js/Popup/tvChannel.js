function TVChannel(videoUrl) {
	this.videoUrl = videoUrl;
	this.currentTime = 0;
	// this.texture = new BABYLON.VideoTexture("video", [videoUrl], game.scene, true);
	this.video = this.texture.video;
}