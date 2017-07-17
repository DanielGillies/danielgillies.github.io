/**
 * @author:Danny Gillies
 * Initializes and renders the scene.
 * Creates an audio equalizer visualization with particles from the PointCloud class.
 */
if (!window.mobileAndTabletcheck()) {

    var renderer, scene, camera, directionalLight, water;
    var geometry, material, mesh, ground, PlayerCube, yawObject;
    var controls;

    var START_POS = new THREE.Vector3(270, 5540, 11500)

    var worldSize = 12800;

    var pointCloud2 = null;
    var lineTrace = null;
    var VIEW_ANGLE = 75;

    var ASPECT = window.innerWidth / window.innerHeight;
    var NEAR = 1;
    var FAR = 100000;
    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;

    init();
    animate();

    function init() {

        scene = new THREE.Scene;

        //Instantiate oscControls for the Wii Balance Board
        // oscControl = new OscControl(scene);

        //Create a Perspective camera for the scene
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        camera.position.z = 100;

        //Add Camera to the scene
        scene.add(camera);

        //Initialize all lights in the scene.
        // initLights();

        //Create the WebGLRenderer to be used to render the scene
        renderer = new THREE.WebGLRenderer({ clearAlpha: 1 });
        renderer.setClearColor(0x000000);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMapSoft = true;
        document.body.appendChild(renderer.domElement);

        //Create the main set of controls
        controls = new THREE.PointerLockControls(camera);

        //We are putting the camera inside of 'yawObject'
        //Then adding it to the scene
        scene.add(controls.getObject());
        controls.getObject().position.set(START_POS.x, START_POS.y, START_POS.z);
        //Set the position of the camera
        camera.position.set(0, 10, 0);

        //Create a second PointCloud to fill the scene with particles
        pointCloud2 = new PointCloud(scene);

        //Sets value that determines how the particles span the space
        pointCloud2.fieldSize = worldSize;

        //Adds particles to the scene
        pointCloud2.addBatch(40000);

        //Provides key controls
        init_keys(renderer.domElement);

        //Reads kinect data / builds skeleton
        var bSkeleton = true;
        // window.Kinect = connectKinect(bSkeleton);

        window.addEventListener('resize', onWindowResize, false);
    }

    /**
     * @author:Colin Clayton
     * @author:Travis Bennett
     * Performs all animation/rendering/updating.
     */
    function animate() {
        requestAnimationFrame(animate);

        pointCloud2.update();
        if (controls.enabled) {
            controls.update();
            var pos = controls.getObject().position
            if (pos.z > 25000 || pos.z < -25000 || pos.y > 20000 || pos.y < -20000 || pos.x > 25000 || pos.x < -25000) {
                console.log("MOVE");
                controls.getObject().position.set(START_POS.x, START_POS.y, START_POS.z);
            }
        }
        renderer.render(scene, camera);
    }
    /**
     * Makes sure everything is rendered appropriately for current screen size
     */
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        // if (oculusControls) {
        //     oculusEffect.setSize(window.innerWidth, window.innerHeight); //resizes oculus effect appropriately

        // }
        // else {
        renderer.setSize(window.innerWidth, window.innerHeight);
        // }
    }

    /**
     * May be used to create random colored particles.
     * Returns a string hex value such as '#EEEEEE'
     */
    function getRandomColor() {
        var color = '#';
        var letters = '0123456789ABCDEF'.split('');
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        var colorWithoutQuotes = String(color);
        colorWithoutQuotes = colorWithoutQuotes.substring(0, colorWithoutQuotes.length);

        return colorWithoutQuotes;
    }
} else {
    $(".overlay").hide();
    $("canvas").hide();
    $(".controls").hide();
    $("body").css("background-color", "white");
    $(".no-support").show();
}