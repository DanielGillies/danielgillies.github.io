THREE.MouseControls = function ( object ) {
        var vector;

        $(document).mousemove(function(event) {
            // console.log(event.clientX);
            vector = new THREE.Vector3(
             ( event.clientX / window.innerWidth ) * 90 -45,
             - ( event.clientY / window.innerHeight ) * 90 +45,
             .5 );
            object.lookAt( vector );
    })
}
