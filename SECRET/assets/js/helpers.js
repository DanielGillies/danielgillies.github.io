//GLOBALS
var INTERACT_MENU_OPEN = false;

var RESUME_JSON = $.getJSON("assets/data/resume.json", function(){})

function vecToLocal(vector, mesh) {
    var m = mesh.getWorldMatrix();
    var v = BABYLON.Vector3.TransformCoordinates(vector, m);
    return v;
}

function cleanString(string) {
    string = string.replace("_", " ").replace(/[^a-zA-Z ]/g, "");
    return string;
}

function getCrossHairLocation() {
    return { x: parseInt($(SETTINGS.SELECTORS.xhair).position().left), y: parseInt($(SETTINGS.SELECTORS.xhair).position().top) }
}

function setInteractPromptLocation(pos) {
    $(SETTINGS.SELECTORS.interactPrompt).css("left", (pos.x + 30) + "px");
    $(SETTINGS.SELECTORS.interactPrompt).css("top", (pos.y - 9) + "px");
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

    camera.speed = SETTINGS.CAMERA.moveSpeed;
    camera.keysUp.push(87); // "w"
    camera.keysDown.push(83); // "s"
    camera.keysLeft.push(65); // "a"
    camera.keysRight.push(68); // "d"

    camera.inertia = 0;
    camera.angularSensibility = SETTINGS.CAMERA.sensitivity;

    //Then apply collisions and gravity to the active camera
    camera.checkCollisions = true;
    camera.applyGravity = true;

    //Set the ellipsoid around the camera (e.g. your player's size)
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
}

function fixGlass(scene, shadowGens, box2) {

    for (var i = 0; i < scene.meshes.length; i++) {
        currMesh = scene.meshes[i];
        // if (currMesh.material && !currMesh.name.includes("Wall") && !currMesh.name.includes("Ceiling") && !currMesh.name.includes("Floor")) {
        if (currMesh.material) {
            // currMesh.material.specularColor = new BABYLON.Color3(1, 1, 1);
            // currMesh.material.specularPower = 64;
            currMesh.material.maxSimultaneousLights = 6;

            shadowGens.forEach(function(item) {
                item.getShadowMap().renderList.push(currMesh);
            })
        }
        // if (currMesh.name == "Cube") {
        //     var c = currMesh;
        //     // c.applyFog = true;
        //     // c.receiveShadows = false;
        //     currMesh.material = box2.material;
        //     // currMesh.material.useEmissiveAsIllumination = false;
        //     // currMesh.material.useMicroSurfaceFromReflectivityMapAlpha = false;
        //     // currMesh.material.usePhysicalLightFalloff = false;
        //     // currMesh.material.useSpecularOverAlpha = false;
        //     // currMesh.material.diffuseTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Albedo.png", scene);
        //     // currMesh.material.diffuseColor = new BABYLON.Color3(1,1,1);
        //     // currMesh.material.indexOfRefraction = 0.98;
        //     // currMesh.material.overloadedShadowIntensity = .7;
        //     // currMesh.material.overloadedShadeIntensity = .5;
        //     // delete currMesh.material.microSurface;
        //     // delete currMesh.material.directIntensity;
        //     // m.ambientTexture = new BABYLON.Texture("test/Rough_Brick_Wall_AO.png", scene);
        //     // delete m.ambientTextureStrength;
        //     // // delete m.albedoColor;
        //     console.log(currMesh)
        //     console.log(box2);
        // }
        if (currMesh.name.includes("Glass")) {
            currMesh.hasVertexAlpha = true;
            currMesh.visibility = .4;
        }
        // if (currMesh.name.includes("Floor")) {
        //     scene
        // }
        // if (currMesh.name == ("Work_Experience")) {
        // 	console.log(scene.meshes[i]);
        // }
    }
}

function renderStats(engine) {
    $(SETTINGS.SELECTORS.stats).html("FPS: " + Math.round(engine.getFps()) + "<br>" +
        "Draws: " + engine._drawCalls.current);
}

function rayCast(scene) {
    var camera = scene.activeCamera

    var start = camera.position;

    var forward = new BABYLON.Vector3(0, 0, 1);
    forward = vecToLocal(forward, camera);

    var direction = forward.subtract(start);
    direction = BABYLON.Vector3.Normalize(direction)

    var ray = new BABYLON.Ray(start, direction, SETTINGS.CAMERA.reach);
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
            isLocked = false;
        } else {
            isLocked = true;
            if (game.popupManager.isActive()) {
                game.popupManager.hide();
                game.HUD.show();
            }
        }
    };

    // Attach events to the document
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
}

function interact(game, hit) {
    if (hit.pickedMesh) {
        console.log("Interact on " + hit.pickedMesh.name)
        game.popupManager.show();
        game.HUD.hide();
        document.exitPointerLock();
    } else {
        console.log("Interact on nothing!");
    }
}

function buildWorkExperiences(workManager) {
    var workArray = RESUME_JSON.responseJSON.work;
    for (var i = 0; i < workArray.length; i++) {
        var currentWork = RESUME_JSON.responseJSON.work[i];
        var temp = new WorkExperience(currentWork.position, currentWork.company, currentWork.startDate, currentWork.endDate, currentWork.description, currentWork.highlights);
        workManager.addItem(temp);
    }
}