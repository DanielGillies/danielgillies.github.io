//GLOBALS
var INTERACT_MENU_OPEN = false;

function vecToLocal(vector, mesh) {
    var m = mesh.getWorldMatrix();
    var v = BABYLON.Vector3.TransformCoordinates(vector, m);
    return v;
}

function cleanString(string) {
    string = string.replace("_", " ").replace(/[^a-zA-Z ]/g, "");
    // string = string.replace(/[^a-zA-Z ]/g, "")
    return string;
}

function getCrossHairLocation() {
    return { x: parseInt($(".xhair").position().left), y: parseInt($(".xhair").position().top) }
}

function setInteractPromptLocation(pos) {
    $(".interact-prompt").css("left", (pos.x + 30) + "px");
    $(".interact-prompt").css("top", (pos.y - 9) + "px");
}

function buildSkyBox(scene) {
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    skybox.infiniteDistance = true;

    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skyboxes/TropicalSunnyDay/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    skybox.renderingGroupId = 0;
}

function setupCamera(camera) {
    // Attach camera to canvas inputs
    camera.attachControl(canvas);

    camera.speed = 2.2;
    camera.keysUp.push(87); // "w"
    camera.keysDown.push(83); // "s"
    camera.keysLeft.push(65); // "a"
    camera.keysRight.push(68); // "d"

    camera.inertia = 0;
    camera.angularSensibility = 700;

    //Then apply collisions and gravity to the active camera
    camera.checkCollisions = true;
    camera.applyGravity = true;

    //Set the ellipsoid around the camera (e.g. your player's size)
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
}

function fixGlass(scene) {
    for (var i = 0; i < scene.meshes.length; i++) {
        if (scene.meshes[i].name.includes("Glass")) {
            scene.meshes[i].hasVertexAlpha = true;
            scene.meshes[i].visibility = .4;
        }
        // if (scene.meshes[i].name.includes("Work")) {
        // 	console.log(scene.meshes[i]);
        // }
    }
}

function renderStats(engine) {
    $(".stats").html("FPS: " + Math.round(engine.getFps()) + "<br>" +
        "Draws: " + engine._drawCalls.current);
}

function rayCast(scene) {
    var camera = scene.activeCamera

    var start = camera.position;

    var forward = new BABYLON.Vector3(0, 0, 1);
    forward = vecToLocal(forward, camera);

    var direction = forward.subtract(start);
    direction = BABYLON.Vector3.Normalize(direction)

    var ray = new BABYLON.Ray(start, direction, 5);
    var hit = scene.pickWithRay(ray);

    return hit;
}

function setupPointerLock(scene, game) {
    //We start without being locked.
    var isLocked = false;

    // On click event, request pointer lock
    scene.onPointerDown = function(evt) {

        //true/false check if we're locked, faster than checking pointerlock on each single click.
        if (!isLocked) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }

        //continue with shooting requests or whatever :P
        //evt === 0 (left mouse click)
        //evt === 1 (mouse wheel click (not scrolling))
        //evt === 2 (right mouse click)
    };


    // Event listener when the pointerlock is updated (or removed by pressing ESC for example).
    var pointerlockchange = function() {
        var controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;

        // If the user is already locked
        if (!controlEnabled) {
            //camera.detachControl(canvas);
            isLocked = false;
        } else {
            //camera.attachControl(canvas);
            isLocked = true;
            if (game.popupManager.isActive()) {
                game.popupManager.hide();
                game.HUD.show();
				// toggleInteractMenu(false, scene);
            }
        }
    };

    // Attach events to the document
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
}

function sendEscapeEvent() {
    var press = $.Event("pointerlockchange mspointerlockchange mozpointerlockchange webkitpointerlockchange");
    press.ctrlKey = false;
    press.which = 27;
    $(document).trigger(press);
}

function interact(scene, hit, game) {
    if (hit.pickedMesh) {
        console.log("Interact on " + hit.pickedMesh.name)
        game.popupManager.show();
        game.HUD.hide();
        document.exitPointerLock();
    } else {
        console.log("Interact on nothing!");
    }
}
