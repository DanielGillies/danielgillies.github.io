    var element = document.body;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
    var overlay = document.querySelector('div.overlay'),
        closeBttn = overlay.querySelector('button.overlay-close');
    transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
    },
        transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
        support = {transitions: Modernizr.csstransitions};

    function toggleOverlay() {
        if (classie.has(overlay, 'open')) {
            classie.remove(overlay, 'open');
            classie.add(overlay, 'close');
            element.requestPointerLock();
            var onEndTransitionFn = function (ev) {
                if (support.transitions) {
                    if (ev.propertyName !== 'visibility') return;
                    this.removeEventListener(transEndEventName, onEndTransitionFn);
                }
                classie.remove(overlay, 'close');
            };
            if (support.transitions) {
                overlay.addEventListener(transEndEventName, onEndTransitionFn);
            }
            else {
                onEndTransitionFn();
            }
        }
        else if (!classie.has(overlay, 'close')) {
            classie.add(overlay, 'open');
            document.exitPointerLock();
        }
    }
    closeBttn.addEventListener('click', toggleOverlay);