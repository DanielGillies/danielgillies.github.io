// scene.debugLayer.show();
// downloadSong();
if (BABYLON.Engine.isSupported() && !window.mobileAndTabletcheck()) {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    console.log(engine);

    BABYLON.SceneLoader.Load("test/", "scene.babylon", engine, function(newScene) {
        // Wait for textures and shaders to be ready
        newScene.executeWhenReady(function() {
            $(SETTINGS.SELECTORS.progressBar).hide();
            $(".WIP").fadeIn(400, function() {
                setTimeout(function() {
                    $(".WIP").fadeOut()
                } ,4000)
            });
            var hit;
            var interactable = false;
            var camera = newScene.activeCamera;

            // console.log(newScene);

            var loader = new BABYLON.AssetsManager(newScene);
            var headTask = loader.addMeshTask("head", "", "assets/models/head/", "model_mesh.obj");
            BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
            loader.load();
            var head;
            headTask.onSuccess = function(task) {
                head = task.loadedMeshes[0];
                task.loadedMeshes[0].position = new BABYLON.Vector3(30, 50, 0);
                // task.loadedMeshes[0].position = new BABYLON.Vector3(0, 6, 0);

                task.loadedMeshes[0].scaling = new BABYLON.Vector3(70, 70, 70);
                // task.loadedMeshes[0].billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
                // console.log("WEFWEFWEFWEF)")
                // console.log(task.loadedMeshes[0]);
            }

            // var loader = new BABYLON.AssetsManager(newScene);
            // var head = loader.addMeshTask("head", "", "assets/models/head/", "model_mesh.obj");

            // BABYLON.SceneLoader.Load("assets/models/head/", "model_mesh.obj", engine, function(newScene) {
            //     // ...
            // });

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

            // console.log(PM);

            var game = new Game(newScene, HUD, PM);

            setInteractPromptLocation(getCrossHairLocation());

            fixGlass(game, shadowGens);
            buildSkyBox(newScene);
            setupCamera(camera);

            var channel1 = new TVChannel(game, "assets/video/jukebox.mp4");
            var channel2 = new TVChannel(game, "assets/video/musicmuseum.mp4");
            var channel3 = new TVChannel(game, "assets/video/Team Carbon Frag Video.mp4");

            game.TV.addChannel(channel1);
            game.TV.addChannel(channel2);
            game.TV.addChannel(channel3);


            //Set gravity for the scene (G force like, on Y-axis)
            newScene.gravity = new BABYLON.Vector3(0, -0.9, 0);

            newScene.registerBeforeRender(function() {
                if (head) {

                    head.lookAt(newScene.activeCamera.position, 0,  Math.PI ,  Math.PI);
                    // head.rotationQuaternion.x *= -1;
                    // head.rotationQuaternion.y *= -1;
                    // head.rotationQuaternion.z *= -1;
                    // var heading = newScene.activeCamera.position.subtract(head.position);
                    // console.log(heading);
                    // // var camera = scene.activeCamera

                    // // var start = head.position;

                    // // var forward = new BABYLON.Vector3(0, 0, 1);
                    // // forward = vecToLocal(forward, head);

                    // // var direction = forward.subtract(start);
                    // // direction = BABYLON.Vector3.Normalize(direction)

                    // head.rotation = heading;
                }

                renderStats(engine);
                var distanceToTV = distanceVector(camera.position, game.TV.mesh.position);
                var distanceToDoor = distanceVector(camera.position, game.door.position);
                // console.log(distanceToDoor);
                // console.log(distanceToTV);
                hit = rayCast(newScene);
                if (hit.pickedMesh) {
                    // console.log(hit.pickedMesh.name);
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

                        } else {
                            lookingAt.setHTML("");
                            lookingAt.hide();
                            interactPrompt.hide();
                            PM.canBeActivated = false;
                        }
                        // Check if we are aiming at the tv and in range since hitbox is fucked up
                    } else if (hit.pickedMesh.name == "TV" && distanceToTV < 6.5) {
                        if (game.TV.channelNum == 0)
                            lookingAt.setHTML("Watch TV");
                        else if (game.TV.channelNum == game.TV.channelsList.length - 1)
                            lookingAt.setHTML("Turn off TV");
                        else
                            lookingAt.setHTML("Next Channel");
                        lookingAt.show();
                        interactPrompt.show();
                    } else if (hit.pickedMesh.name == "JukeBox") {
                        lookingAt.setHTML("Enter Jukebox");
                        lookingAt.show();
                        interactPrompt.show();
                    } else if (hit.pickedMesh.name.includes("Door") && distanceToDoor < 6.5) {
                        lookingAt.setHTML("Go to 2d site");
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
                if (!STOP_RENDER) {
                    newScene.render();
                }
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
        var perc = Math.floor((progress.loaded / progress.total) * 100);
        if (perc < 100)
            $(SETTINGS.SELECTORS.progressBar).html("Loading... " + perc + "% <br> Importing meshes");
        else
            $(SETTINGS.SELECTORS.progressBar).html("Loading... " + perc + "% <br> Importing Textures");
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

function downloadSong() {
    var param = {};
    $.get('/api/download', param, function (data) {
    });
}