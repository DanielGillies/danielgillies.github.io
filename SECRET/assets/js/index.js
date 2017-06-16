// scene.debugLayer.show();
if (BABYLON.Engine.isSupported() && !window.mobileAndTabletcheck()) {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    console.log(engine);

    BABYLON.SceneLoader.Load("test/", "scene.babylon", engine, function(newScene) {
        // Wait for textures and shaders to be ready
        newScene.executeWhenReady(function() {
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

                    if ($(".looking-at").html() != cleanString(hit.pickedMesh.name)) {
                        $(".looking-at").html(cleanString(hit.pickedMesh.name));
                        $(".interact-prompt").html("E to interact");
                    }
                    if (!interactable) {
                        $(".looking-at").fadeIn("fast");
                        $(".interact-prompt").fadeIn("fast");
                    }
                    interactable = true;
                } else {
                    if (interactable) {
                        $(".looking-at").fadeOut("fast");
                        $(".interact-prompt").fadeOut("fast");
                    }
                    interactable = false;
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
                    // e
                    case 69:
                        interact(newScene, hit);
                        break;
                }
            }

        });
    }, function(progress) {
        // console.log(progress);
        $(".progress").html("Loaded: " + progress.loaded + " / " + progress.total);
        console.log("Loaded: " + progress.loaded + " / " + progress.total);
        // To do: give progress feedback to user
    });
} else {
    $(".no-support").show();
}