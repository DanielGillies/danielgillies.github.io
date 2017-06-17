// scene.debugLayer.show();
if (BABYLON.Engine.isSupported() && !window.mobileAndTabletcheck()) {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    console.log(engine);

    BABYLON.SceneLoader.Load("test/", "scene.babylon", engine, function(newScene) {
        // Wait for textures and shaders to be ready
        newScene.executeWhenReady(function() {
            $(SETTINGS.SELECTORS.progressBar).hide();
            var hit;
            var interactable = false;
            var camera = newScene.activeCamera;

            // var box = BABYLON.Mesh.CreateBox("box", 2, newScene);
            // var boxMaterial = new BABYLON.StandardMaterial("material", newScene);
            // boxMaterial.diffuseTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Albedo.png", newScene);
            // boxMaterial.bumpTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Normal.png", newScene);
            // boxMaterial.reflectivityTexture = new BABYLON.Texture("test/T_Glass2_D_MetallicGlossMap.png", newScene);
            // box.material = boxMaterial;

            var box2 = BABYLON.Mesh.CreateBox("box2", 2, newScene);
            box2.position = new BABYLON.Vector3(3, 0, 0);
            box2.scaling.x = 4;
            var boxMaterial2 = new BABYLON.StandardMaterial("material2", newScene);
            boxMaterial2.diffuseTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Albedo.png", newScene);
            boxMaterial2.diffuseTexture.uScale = 4.0;
            // boxMaterial2.diffuseTexture.uScale = 10.0;
            boxMaterial2.bumpTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Normal.png", newScene);
            boxMaterial2.bumpTexture.uScale = 4.0;
            boxMaterial2.reflectivityTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Albedo_MetallicGlossMap.png", newScene);
            
            // boxMaterial2.diffuseTexture.vScale = 4;
            box2.material = boxMaterial2;
            console.log(box2);
            // console.log(box.material);
            // console.log(box);
// -13.149

// 1.02

// -3.98

            var HUD = new Hud();
            var lookingAt = new HUDElement("lookingAt", $(SETTINGS.SELECTORS.lookingAt), HUD);
            var interactPrompt = new HUDElement("interactPrompt", $(SETTINGS.SELECTORS.interactPrompt), HUD);
            var xhair = new HUDElement("xhair", $(SETTINGS.SELECTORS.xhair), HUD);

            var eMan = new Manager();
            buildWorkExperiences(eMan);

            var PM = new PopupManager($(SETTINGS.SELECTORS.popup), {"EM": eMan});
            PM.setCurrentManager("EM");

            var game = new Game(newScene, HUD, PM);

            setInteractPromptLocation(getCrossHairLocation());

            fixGlass(newScene);
            buildSkyBox(newScene);
            setupCamera(camera);

            //Set gravity for the scene (G force like, on Y-axis)
            newScene.gravity = new BABYLON.Vector3(0, -0.9, 0);

            newScene.registerBeforeRender(function() {
                renderStats(engine);
                hit = rayCast(newScene);
                if (hit.pickedMesh) {

                    if (lookingAt.getHTML() != cleanString(hit.pickedMesh.name)) {
                        lookingAt.setHTML(cleanString(hit.pickedMesh.name));
                        interactPrompt.setHTML("E to interact");
                    }
                    if (!interactable) {
                        lookingAt.show();
                        interactPrompt.show();
                    }
                    interactable = true;
                } else {
                    if (interactable) {
                        lookingAt.hide();
                        interactPrompt.hide();
                    }
                    interactable = false;
                }

            })

            // Once the scene is loaded, just register a render loop to render it
            engine.runRenderLoop(function() {
                newScene.render();
            });

            setupPointerLock(newScene, game);

            window.addEventListener("keydown", onKeyDown, false);

            function onKeyDown(event) {
                switch (event.keyCode) {
                    case 32:
                        // cameraJump();
                        break;
                    // e to interact
                    case SETTINGS.KEYBINDS.interact:
                        interact(game, hit);
                        break;
                    // l
                    // case 76:
                    //     PM.setCurrentManager("EM");
                    //     break;
                    //k
                    // case 75:
                    //     PM.setCurrentManager("AM");
                    //     break;
                }
            }

        });
    }, function(progress) {
        // console.log(progress);
        $(SETTINGS.SELECTORS.progressBar).html("Loading... " + progress.loaded + " / " + progress.total + "<br>" + Math.floor((progress.loaded / progress.total) * 100) + "%");
        //console.log("Loaded: " + progress.loaded + " / " + progress.total);
        // To do: give progress feedback to user
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function () {
        engine.resize();
    });
} else {
    $(".no-support").show();
}