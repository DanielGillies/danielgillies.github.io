function Tv(game, mesh) {
	this.game = game;
	this.mesh = mesh;
	this.screenMat = this.mesh.material.subMaterials[4]
	this.channelsList = [];
	this.channelNum = 0;
	this.lastChannel = 0;
	// this.offTexture = new BABYLON.VideoTexture("video", ["assets/video/screen.mp4"], game.scene, true);; 
	// this.videoTexture = new BABYLON.VideoTexture("video", [this.defaultTexture], game.scene, true);

	this.init();
	
}

Tv.prototype.init = function() {
	this.addChannel(new TVChannel(this.game, "assets/video/screen.mp4"));
	// this.screenMat.diffuseTexture = this.offTexture;

    this.currentChannel = this.channelsList[this.channelNum];

    this.screenMat.diffuseTexture = this.currentChannel.texture;

    this.screenMat.diffuseTexture.uOffset = -0.04;
    this.screenMat.diffuseTexture.uScale = 0.0343;
    this.screenMat.diffuseTexture.vOffset = -0.116;
    this.screenMat.diffuseTexture.vScale = 0.06;
    this.screenMat.diffuseTexture.video.paused = true;

}

Tv.prototype.turnOn = function() {
	// this.screenMat.diffuseTexture = this.channelsList[this.currentChannel].texture;
	// // if (!this.toggle) {
	// 	this.screenMat.diffuseTexture = this.channelsList[this.currentChannel].texture
	// 	this.channelsList[this.currentChannel].play();
	// }
	// // else {
	// 	this.channelsList[this.currentChannel].stop();
	// 	this.screenMat.diffuseTexture = this.offTexture;
	// // }
	// this.toggle = !this.toggle;
	// console.log(this.screenMat.diffuseTexture.video.currentSrc);
}

Tv.prototype.addChannel = function(channel) {
	this.channelsList.push(channel);
};

Tv.prototype.nextChannel = function() {
	this.currentChannel.stop();
	if (this.channelNum < this.channelsList.length - 1) {
		this.channelNum++;
	} else {
		this.channelNum = 0;
	}

	this.setCurrentChannel(this.channelsList[this.channelNum]);
	if (this.channelNum != 0)
		this.currentChannel.play();
	// this.
}

Tv.prototype.turnOff = function() {
	this.currentChannel.stop();
	this.lastChannel = this.currentChannel;
	this.setCurrentChannel(this.channelsList[0]);
	this.channelNum = 0;
};

Tv.prototype.setCurrentChannel = function(channel) {
	this.currentChannel = channel;
	this.screenMat.diffuseTexture = this.currentChannel.texture;
}