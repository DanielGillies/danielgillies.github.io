if (window.mobileAndTabletcheck()) {
    $(".no-support").show();
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

if (BABYLON.Engine.isSupported() && !window.mobileAndTabletcheck()) {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);

    BABYLON.SceneLoader.Load("test/", "scene.babylon", engine, function(newScene) {
        // Wait for textures and shaders to be ready
        newScene.executeWhenReady(function() {
            $(".progress").hide();
            var interactable = false;
            setInteractPromptLocation(getCrossHairLocation());
            // var scene = newScene;
            var camera = newScene.activeCamera;
            console.log(newScene);

            for (var i = 0; i < newScene.meshes.length; i++) {
                if (newScene.meshes[i].name.includes("Glass")) {
                    // console.log(newScene.meshes[i]);
                    newScene.meshes[i].hasVertexAlpha = true;
                    newScene.meshes[i].visibility = .4;
                }
            }

            buildSkyBox(newScene);

            // Attach camera to canvas inputs
            newScene.activeCamera.attachControl(canvas);

            newScene.activeCamera.speed = 2.2;
            newScene.activeCamera.keysUp.push(87); // "w"
            newScene.activeCamera.keysDown.push(83); // "s"
            newScene.activeCamera.keysLeft.push(65); // "a"
            newScene.activeCamera.keysRight.push(68); // "d"

            newScene.activeCamera.inertia = 0;
            newScene.activeCamera.angularSensibility = 700;

            //Set gravity for the scene (G force like, on Y-axis)
            newScene.gravity = new BABYLON.Vector3(0, -0.9, 0);

            //Then apply collisions and gravity to the active camera
            // camera.checkCollisions = true;
            camera.applyGravity = true;

            //Set the ellipsoid around the camera (e.g. your player's size)
            camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

            newScene.registerBeforeRender(function() {
                $(".stats").html("FPS: " + Math.round(engine.getFps()));

                var start = camera.position;

                var forward = new BABYLON.Vector3(0, 0, 1);
                forward = vecToLocal(forward, camera);

                var direction = forward.subtract(start);
                direction = BABYLON.Vector3.Normalize(direction)

                var ray = new BABYLON.Ray(start, direction, 5);

                var hit = newScene.pickWithRay(ray);

                if (hit.pickedMesh) {

                    if ($(".looking-at").html() != cleanString(hit.pickedMesh.name)) {
                        $(".looking-at").html(cleanString(hit.pickedMesh.name));
                    }
                    if (!interactable) {
                        $(".looking-at").fadeIn("fast");
                        $(".interact-prompt").fadeIn("fast");
                    }
                    interactable = true;
                } else {
                    //TODO: Optional check if these are empty before assigning"
                    if (interactable) {
                        $(".looking-at").fadeOut("fast");
                        $(".interact-prompt").fadeOut("fast");
                    }
                    interactable = false;
                    // }
                }

            })

            // Once the scene is loaded, just register a render loop to render it
            engine.runRenderLoop(function() {
                newScene.render();


            });

            setupPointerLock(newScene);

            window.addEventListener("keydown", onKeyDown, false);

            function onKeyDown(event) {
                switch (event.keyCode) {
                    case 32:
                        // cameraJump();
                        break;
                }
            }

            var cameraJump = function() {
                var cam = scene.cameras[0];

                cam.animations = [];

                var a = new BABYLON.Animation(
                    "a",
                    "position.y", 20,
                    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

                // Animation keys
                var keys = [];
                keys.push({
                    frame: 0,
                    value: cam.position.y
                });
                keys.push({
                    frame: 10,
                    value: cam.position.y + 2
                });
                keys.push({
                    frame: 20,
                    value: cam.position.y
                });
                a.setKeys(keys);

                var easingFunction = new BABYLON.CircleEase();
                easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
                a.setEasingFunction(easingFunction);

                cam.animations.push(a);

                scene.beginAnimation(cam, 0, 20, false);
            }

        });
    }, function(progress) {
        // console.log(progress);
        $(".progress").html("Loaded: " + progress.loaded + " / " + progress.total);
        console.log("Loaded: " + progress.loaded + " / " + progress.total);
        // To do: give progress feedback to user
    });
}

function setupPointerLock(scene) {
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
        }
    };

    // Attach events to the document
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mspointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
}
