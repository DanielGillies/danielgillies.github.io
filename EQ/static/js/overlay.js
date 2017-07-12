    var element = document.body;
    var overlayActive = true;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    function toggleOverlay() {
        if ($(".overlay").hasClass("open")) {
            $(".overlay").removeClass("open");
            element.requestPointerLock();
            overlayActive = false;
            flashInstructions();
        } else {
            $(".overlay").addClass("open");
            document.exitPointerLock();
            overlayActive = true;
            setTimeout(function() {
                $("#search_query").focus();
            }, 200);
        }
    }

    function flashInstructions() {
        $(".instructions").fadeIn(500, function() {
            setTimeout(function() {
                $(".instructions").fadeOut(500);
            }, 500)
        })
    }

    // function toggleOverlay() {
    //     if (classie.has(overlay, 'open')) {
    //         classie.remove(overlay, 'open');
    //         classie.add(overlay, 'close');
    //         element.requestPointerLock();
    //         var onEndTransitionFn = function (ev) {
    //             if (support.transitions) {
    //                 if (ev.propertyName !== 'visibility') return;
    //                 this.removeEventListener(transEndEventName, onEndTransitionFn);
    //             }
    //             classie.remove(overlay, 'close');
    //         };
    //         if (support.transitions) {
    //             overlay.addEventListener(transEndEventName, onEndTransitionFn);
    //         }
    //         else {
    //             onEndTransitionFn();
    //         }
    //     }
    //     else if (!classie.has(overlay, 'close')) {
    //         classie.add(overlay, 'open');
    //         document.exitPointerLock();
    //     }
    // }
    // closeBttn.addEventListener('click', toggleOverlay);
