/**
 * @author mrdoob / http://mrdoob.com/
 */

 var SPEED = 40000;

THREE.PointerLockControls = function(camera) {

    var scope = this;


    camera.rotation.set(0, 0, 0);

    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);

    var yawObject = new THREE.Object3D();
    // yawObject.position.y = 10;
    yawObject.add(pitchObject);

   var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var moveUp = false;
	var moveDown = false;

	var prevTime = performance.now();

	var velocity = new THREE.Vector3(0,0,0);

	var PI_2 = Math.PI / 2;

    var onMouseMove = function(event) {

        if (scope.enabled === false) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));

    };

    this.onKeyDown = function(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 16: // shift
                moveDown = true;
                break;

            case 32: // space
                moveUp = true;
                break;

        }

    };

    this.onKeyUp = function(event) {

        switch (event.keyCode) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;

            case 16: // shift
                moveDown = false;
                break;

            case 32: // space
                moveUp = false;
                break;

        }

    };

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('keydown', this.onKeyDown, false);
    document.addEventListener('keyup', this.onKeyUp, false);

    this.dispose = function() {

        document.removeEventListener('mousemove', onMouseMove, false);

    };

    this.enabled = false;

    this.getObject = function() {

        return yawObject;

    };

    this.getDirection = function() {

        // assumes the camera itself is not rotated

        var direction = new THREE.Vector3(0, 0, -1);
        var rotation = new THREE.Euler(0, 0, 0, "YXZ");

        return function(v) {

            rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

            v.copy(direction).applyEuler(rotation);

            return v;

        };

    }();

    this.update = function() {
        var vector = new THREE.Vector3();
        camera.getWorldDirection(vector);

        var time = performance.now();
        var delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.y -= velocity.y * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        if (moveForward) {
            velocity.z -= SPEED * delta;
            velocity.y += (SPEED * vector.y) * delta;
        }

        if (moveBackward) {
            velocity.z += SPEED * delta;
            velocity.y -= (SPEED * vector.y) * delta;
        }

        if (moveLeft) velocity.x -= SPEED * delta;
        if (moveRight) velocity.x += SPEED * delta;

        if (moveUp) velocity.y += SPEED * delta;
        if (moveDown) velocity.y -= SPEED * delta;

        yawObject.translateX(velocity.x * delta);
        yawObject.translateY(velocity.y * delta);
        yawObject.translateZ(velocity.z * delta);

        prevTime = time;
    }

};
