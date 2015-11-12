THREE.MouseControls = function ( object ) {
        var vector;

        $(document).mousemove(function(event) {
            vector = new THREE.Vector3(
             ( event.clientX / window.innerWidth ) * 40 -20,
             - ( event.clientY / window.innerHeight ) * 40 +20,
             .5 );
            object.lookAt( vector );

    })

}
