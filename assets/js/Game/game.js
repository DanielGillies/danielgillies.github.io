function Game(scene, HUD, popupManager, TV) {
	this.scene = scene;
	this.HUD = HUD;
	this.TV = TV;
	this.popupManager = popupManager;
	this.HUD.scene = this.scene;
	this.popupManager.scene = this.scene;
	this.door;
}