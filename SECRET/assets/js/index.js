// scene.debugLayer.show();
if (BABYLON.Engine.isSupported() && !window.mobileAndTabletcheck()) {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    console.log(engine);

    BABYLON.SceneLoader.Load("test/", "scene.babylon", engine, function(newScene) {
        // Wait for textures and shaders to be ready
        newScene.executeWhenReady(function() {

            var HUD = new Hud();
            var lookingAt = new HUDElement("lookingAt", $(".looking-at"), HUD);
            var interactPrompt = new HUDElement("interactPrompt", $(".interact-prompt"), HUD);
            var xhair = new HUDElement("xhair", $(".xhair"), HUD);

            var test = new WorkExperience("God", "Universe", "January 0", "Present");
            test.addHighlight("Created the Universe");
            test.addHighlight("A God damn god");

            var test2 = new WorkExperience("God2", "Universe3", "January 023", "Present123");
            test.addHighlight("Created12 123  the Undfawefa wfiverse");
            test.addHighlight("A God daawef awefasdfemn god");

            var eMan = new Manager();
            eMan.addItem(test);
            eMan.addItem(test2);

            var PM = new PopupManager($(".popup"), {"EM": eMan});
            PM.setCurrentManager("EM");

            var game = new Game(newScene, HUD, PM);

            $(".progress").hide();
            var hit;
            var interactable = false;
            var camera = newScene.activeCamera;

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
                    case 69:
                        interact(newScene, hit, game);
                        break;
                    // l
                    case 76:
                        PM.setCurrentManager("EM");
                        break;
                    //k
                    // case 75:
                    //     PM.setCurrentManager("AM");
                    //     break;
                }
            }

        });
    }, function(progress) {
        // console.log(progress);
        $(".progress").html("Loading... " + progress.loaded + " / " + progress.total + "<br>" + Math.floor((progress.loaded / progress.total) * 100) + "%");
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