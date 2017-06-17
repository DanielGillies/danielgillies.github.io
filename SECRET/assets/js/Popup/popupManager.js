function PopupManager(DOM, managers) {
	this.scene;
    this.DOM = DOM;
    this.managers = managers || {};
    this.currentManager;
    this.bActive = false;
}

PopupManager.prototype.show = function() {
	this.DOM.fadeIn("fast");
	this.bActive = true;
	this.scene.activeCamera.detachControl(canvas);
};

PopupManager.prototype.hide = function() {
	this.DOM.fadeOut("fast");
	this.bActive = false;
	this.scene.activeCamera.attachControl(canvas);
};

PopupManager.prototype.isActive = function() {
	return this.bActive;
};

PopupManager.prototype.addManager = function(name, managerObject) {
    this.managers[name] = managerObject;
};

PopupManager.prototype.setCurrentManager = function(name) {
    if (this.managers[name]) {
        this.currentManager = this.managers[name];
        this.currentManager.buildCurrent();
        this.connectClickEvents();
        this.checkForArrowStatus();
    }
}

PopupManager.prototype.connectClickEvents = function() {
    var PM = this;
    PM.DOM.find(".go_right").click(function() {
        // console.log(this);
        PM.currentManager.next();
        PM.checkForArrowStatus();
    });

    PM.DOM.find(".go_left").click(function() {
        PM.currentManager.prev();
        PM.checkForArrowStatus();
    });
};

PopupManager.prototype.checkForArrowStatus = function() {
    if (this.hasNext()) {
    	this.DOM.find(".go_right").show();
    } else {
    	this.DOM.find(".go_right").hide();
    }

    if (this.hasPrev()) {
    	this.DOM.find(".go_left").show();
    } else {
    	this.DOM.find(".go_left").hide();
    }
};


PopupManager.prototype.hasNext = function() {
    return this.currentManager.index < this.currentManager.numItems - 1;
}

PopupManager.prototype.hasPrev = function() {
    return this.currentManager.index > 0;
};
