function Game(scene, HUD, popupManager) {
	this.scene = scene;
	this.HUD = HUD;
	this.popupManager = popupManager;
	this.HUD.scene = this.scene;
	this.popupManager.scene = this.scene;
}