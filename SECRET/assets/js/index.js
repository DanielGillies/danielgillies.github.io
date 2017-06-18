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

            // var box = BABYLON.Mesh.CreateBox("box", 2, newScene);
            // var boxMaterial = new BABYLON.StandardMaterial("material", newScene);
            // boxMaterial.diffuseTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Albedo.png", newScene);
            // boxMaterial.bumpTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Normal.png", newScene);
            // boxMaterial.reflectivityTexture = new BABYLON.Texture("test/T_Glass2_D_MetallicGlossMap.png", newScene);
            // box.material = boxMaterial;

            // ground.receiveShadows = true;


            var light = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(1, -1, -.7), newScene);
            light.position = new BABYLON.Vector3(10, 10, 7);
            // light0.diffuse = new BABYLON.Color3(1, .7, .05);
            // light.specular = new BABYLON.Color3(1, 1, 1);
            // light0.intensity = 10;

            var light1 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 2, 0), newScene);
            // light
            light1.range = 400;
            // light1.diffuse = new BABYLON.Color3(1, 1, 0);
            // light1.specular = new BABYLON.Color3(1, 1, 1);

            // console.log(light0);

            var box2 = BABYLON.Mesh.CreateBox("box2", 1, newScene);
            box2.position = new BABYLON.Vector3(1, 1, 0);
            // box2.scaling.x = 4;
            var boxMaterial2 = new BABYLON.StandardMaterial("material2", newScene);
            boxMaterial2.diffuseTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Albedo.png", newScene);
            // boxMaterial2.diffuseTexture.uScale = 4.0;
            // boxMaterial2.diffuseTexture.uScale = 10.0;
            boxMaterial2.bumpTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Normal.png", newScene);
            // boxMaterial2.bumpTexture.uScale = 4.0;
            boxMaterial2.reflectivityTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Albedo_MetallicGlossMap.png", newScene);
            boxMaterial2.ambientTexture = new BABYLON.Texture("test/Rough_Brick_Wall_AO.png", newScene);
            boxMaterial2.maxSimultaneousLights = 10;
            boxMaterial2.albedoTexture = new BABYLON.Texture("test/Rough_Brick_Wall_Albedo.png", newScene);
            boxMaterial2.albedoColor = new BABYLON.Vector3(1,1,1);

            // boxMaterial2.diffuseTexture.vScale = 4;
            box2.material = boxMaterial2;
            box2.receiveShadows = true;

            // console.log(box2.material);
            // JSON.stringify

            var shadowGens = []

            var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
            // shadowGenerator.getShadowMap().renderList.push(box2);
            shadowGenerator.usePoissonSampling = true;
            shadowGens.push(shadowGenerator);

            // var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light1);
            // shadowGenerator2.getShadowMap().renderList.push(box2);
            // shadowGenerator2.userVarianceShadowMap = false;
            // // shadowGenerator2.useBlurExponentialShadowMap = true;
            // shadowGens.push(shadowGenerator2);

            var HUD = new Hud();
            var lookingAt = new HUDElement("lookingAt", $(SETTINGS.SELECTORS.lookingAt), HUD);
            var interactPrompt = new HUDElement("interactPrompt", $(SETTINGS.SELECTORS.interactPrompt), HUD);
            var xhair = new HUDElement("xhair", $(SETTINGS.SELECTORS.xhair), HUD);

            var eMan = new Manager();
            buildWorkExperiences(eMan);

            var PM = new PopupManager($(SETTINGS.SELECTORS.popup), { "EM": eMan });
            PM.setCurrentManager("EM");

            var game = new Game(newScene, HUD, PM);

            setInteractPromptLocation(getCrossHairLocation());

            fixGlass(newScene, shadowGens, box2);
            // console.log(box2);
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
    window.addEventListener('resize', function() {
        engine.resize();
    });
} else {
    $(".no-support").show();
}
