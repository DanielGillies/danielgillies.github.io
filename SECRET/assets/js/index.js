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

            console.log(newScene);

            var light = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(1, -1, -.7), newScene);
            light.position = new BABYLON.Vector3(10, 10, 7);

            var light1 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 2, 0), newScene);
            light1.range = 400;

            var light2 = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(-6, 2, -6), newScene);
            light1.range = 400;

            var light3 = new BABYLON.PointLight("Omni2", new BABYLON.Vector3(-6, 2, 6), newScene);
            light1.range = 400;

            var shadowGens = []

            var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
            // shadowGenerator.usePoissonSampling = true;
            shadowGens.push(shadowGenerator);


            var HUD = new Hud();
            var lookingAt = new HUDElement("lookingAt", $(SETTINGS.SELECTORS.lookingAt), HUD);
            var interactPrompt = new HUDElement("interactPrompt", $(SETTINGS.SELECTORS.interactPrompt), HUD);
            var xhair = new HUDElement("xhair", $(SETTINGS.SELECTORS.xhair), HUD);

            var eMan = new Manager();
            buildWorkExperiences(eMan);

            var aMan = new Manager();
            buildAwards(aMan);

            var PM = new PopupManager($(SETTINGS.SELECTORS.popup), { "EM": eMan, "AM": aMan });

            console.log(PM);

            var game = new Game(newScene, HUD, PM);

            setInteractPromptLocation(getCrossHairLocation());

            fixGlass(newScene, shadowGens);
            buildSkyBox(newScene);
            setupCamera(camera);

            //Set gravity for the scene (G force like, on Y-axis)
            newScene.gravity = new BABYLON.Vector3(0, -0.9, 0);

            newScene.registerBeforeRender(function() {
                renderStats(engine);
                var distanceToTV = distanceVector(camera.position, TV.position);
                console.log(distanceToTV);
                hit = rayCast(newScene);
                if (hit.pickedMesh) {
                    console.log(hit.pickedMesh.name);
                    if (hit.pickedMesh.parent) {
                        // Check if we are aiming at the desk
                        if (WORK_OBJECTS.includes(hit.pickedMesh.parent.name)) {
                            PM.canBeActivated = true;
                            lookingAt.setHTML("Work Experience");
                            if (!PM.isCurrentManager("EM")) {
                                PM.setCurrentManager("EM");
                            }
                            if (!PM.isActive()) {
                                lookingAt.show();
                                interactPrompt.show();
                            }
                            // Check if we are aiming at the trophy
                        } else if (hit.pickedMesh.parent.name == "Awards") {
                            PM.canBeActivated = true;
                            lookingAt.setHTML("Awards");
                            if (!PM.isCurrentManager("AM")) {
                                PM.setCurrentManager("AM");
                            }
                            if (!PM.isActive()) {
                                lookingAt.show();
                                interactPrompt.show();
                            }
                            // Check if we are aiming at the tv and in range since hitbox is fucked up
                        } else {
                            lookingAt.setHTML("");
                            lookingAt.hide();
                            interactPrompt.hide();
                            PM.canBeActivated = false;
                        }
                    } else if (hit.pickedMesh.name == "TV" && distanceToTV < 6.5) {
                        console.log("HELLO")
                        lookingAt.setHTML("Watch TV");
                        lookingAt.show();
                        interactPrompt.show();
                    } else {
                        lookingAt.setHTML("");
                        lookingAt.hide();
                        interactPrompt.hide();
                        PM.canBeActivated = false;
                    }
                } else {
                    lookingAt.hide();
                    interactPrompt.hide();
                    PM.canBeActivated = false;
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
    window.addEventListener('resize', function() {
        engine.resize();
    });
} else {
    $(".no-support").show();
}
