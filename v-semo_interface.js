/* CZ 21.05.24 */

translations = {
    "de": {
        "InfoBoxAreaText": "wähle einen\nSektor",
        "InfoBoxDeficitAngle": "wähle einen\nVertex",
    },
    "en": {
        "InfoBoxAreaText": "click on\na sector",
        "InfoBoxDeficitAngle": "click on\na vertex",
    },
}

function getText(tag) {
  return translations[lang][tag]
}

/* end CZ */

let canvas_side_bar_perm = new fabric.Canvas('canvas_side_bar_perm',{preserveObjectStacking: true,  });
let canvas_side_tools_right = new fabric.Canvas('canvas_side_tools_right',{preserveObjectStacking: true });

canvas_side_bar_perm.selection = false;
canvas_side_tools_right.selection = false;

let win_width = window.innerWidth;
let win_height = window.innerHeight *0.08;
let containerSize = {
    width: document.getElementById('canvas-overAll').offsetWidth,
    height: document.getElementById('canvas-overAll').offsetHeight
};

let canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
};

let screenFactor = Math.min(containerSize.width / canvasSize.width, containerSize.height / canvasSize.height);

let buttonfactor = 0.4;
//let buttonwidth = buttonfactor * win_width;
//let buttonheight = win_height * 0.5;
let buttondist = 20;
let textSize = win_width * 0.01 * screenFactor;
let dist_to_top = 15;
let dist_left = 51.5;


const buttonLabels = {
    'german': {
        restart: 'Neustart',
        reset: 'Zurücksetzen',
        set_sectors_to_ring: 'eukl. Ring',
        add: 'Zeichnen',
        add_curved: 'Freihandlinie',
        addVector: 'Vektor',
        undo: 'Rückgängig',
        button_dreieck: 'Geodreieck',
        area_sector: 'Fläche',
        verticesOn: 'Eckpunkte',
        delete_whole: 'Löschen',
        set_sectors: 'Koordinieren',
        autocomplete: 'Vervollständigen',
        direction: 'Richtung',
        joystickBackground: 'Startpunkt',
        help: 'Hilfe',
        camera: 'Snapshot',
        fullscreen: 'Vollbild',
        save: 'Speichern',
        zoomReset: 'Zoomreset',

    },
    'english': {
        restart: 'Restart',
        reset: 'Reset Sectors',
        set_sectors_to_ring: 'eucl. Ring',
        add: 'Draw',
        add_curved: 'Freehand Line',
        addVector: 'Vector',
        undo: 'Undo',
        button_dreieck: 'Ruler/Protractor',
        area_sector: 'Area',
        verticesOn: 'Vertices',
        delete_whole: 'Delete',
        set_sectors: 'Coordinate',
        autocomplete: 'Complete',
        direction: 'Direction',
        joystickBackground: 'Starting Point',
        help: 'Help',
        camera: 'Snapshot',
        fullscreen: 'Fullscreen',
        save: 'Save',
        zoomReset: 'Zoom Reset',

    }
};

function getButtonLabel(action) {
        return buttonLabels[language][action];
}

let buttonIndex = 0; // Initialwert für den ersten Button


let dist_to_top_restart_button_number = buttonIndex


if (showResetSectors == "1") {
    buttonIndex++;
}
let dist_to_top_reset_sectors_button_number = buttonIndex


if (showSetSectorsToRing == "1") {
    buttonIndex++;
}
let dist_to_top_set_sectors_to_ring_button_number = buttonIndex;


buttonIndex++;
let dist_to_top_add_button_number = buttonIndex;

if (showAddCurvedLine == "1") {
    buttonIndex++;
}
let dist_to_add_curved_line_button_number = buttonIndex;


if (showAddVector == "1") {
    buttonIndex++;
}
let dist_to_add_vector_button_number = buttonIndex;


buttonIndex++;
let dist_to_top_undo_button_number = buttonIndex;


buttonIndex++;
let dist_to_top_geodreieck_button_number = buttonIndex;


if (showAreaSector == "globe" || showAreaSector == "earth") {
    buttonIndex++;
}
let dist_to_top_showArea_button_number = buttonIndex;


if (showVerticesOn == "1") {
    buttonIndex++;
}
let dist_to_top_verticesOn_button_number = buttonIndex;
let dist_to_top_button_number_without_geodesic_buttons = buttonIndex +1

buttonIndex++; // Diesen Wert setzen, da der nächste Button von diesem abhängig ist
let dist_to_top_delete_whole_button_number = buttonIndex;


if (showAutoSet == "1") {
    buttonIndex++;
}
let dist_to_top_set_sectors_button_number = buttonIndex;


if (showAutoComplete == "1") {
    buttonIndex++;
}
let dist_to_top_auto_complete_button_number = buttonIndex;


if (showChangeDirection == "1") {
    buttonIndex++;
}
let dist_to_top_direction_main_button_number = buttonIndex;


if (showChangeStartPoint == "1") {
    buttonIndex++;
}
let dist_to_top_change_start_point_position_main_button_number = buttonIndex;

let dist_to_top_button_number_with_geodesic_buttons = buttonIndex + 1

if (showChangeStartPoint == "1"){
    dist_to_top_button_number_with_geodesic_buttons += 0.5;
}

function changeGeodesicWidth(targetWidth){
    chosenLineGlobalID = -1;
    for (let ii = 0; ii < lines.length; ii++) {

        for (let jj = 0; jj < lines[ii].length; jj++) {
            lines[ii][jj].strokeWidth = lineStrokeWidthWhenNotSelected;
        }
    }
}

let maxScrollNumber = dist_to_top_button_number_without_geodesic_buttons

/*
let scroll;
fabric.Image.fromURL('scroll.png', function(img) {
    scroll = img.set({
        left: 80,
        top: window.innerHeight/2,
        opacity: 1,
        originX: "left",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: true,
        lockMovementX: true,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    scroll.on('mousedown', function(opt) {

        if (dist_to_top + 11 * (136 * buttonfactor * screenFactor + buttondist) < window.innerHeight || geodesicButtonsvisible !== true) {
            this.lockMovementY = true;
            console.log('true');
            return
        }

    });

    scroll.on('moving', function(opt) {

        if(this.top > window.innerHeight){
            this.set('top' , window.innerHeight).setCoords();
        }

        if(this.top < 0){
            this.set('top' , 0).setCoords();
        }

        let lastValueSlider = 0.00;
        let startValueSlider;
        startValueSlider = this.top - window.innerHeight / 2 ;


        //Die Rapidität wird wie üblich mit theta abgekürzt

        let theta = (startValueSlider - lastValueSlider) / window.innerHeight; // '-' damit der Sektor nach oben verscheert wird
        console.log(theta)

        canvas_side_bar_perm.viewportTransform[5] = (dist_to_top + 11 * (136 * buttonfactor * screenFactor + buttondist) - window.innerHeight)/window.innerHeight * theta

    });


    canvas_side_bar_perm.add(scroll);
});

*/

canvas_side_bar_perm.on('mouse:wheel', function(opt) {

    let delta = opt.e.deltaY;

    let maxScrollDistance = maxScrollNumber * (136 * buttonfactor * screenFactor + buttondist);
    let canvasHeight = window.innerHeight;

    // Wenn die Fenstergröße größer ist als die maximale Scroll-Distanz, soll nicht gescrollt werden
    if (canvasHeight > maxScrollDistance) {
        this.viewportTransform[5] = 0
        this.requestRenderAll();
        // Verhindere das Standardverhalten des Browsers (scrollen der gesamten Seite)
        opt.e.preventDefault();
        opt.e.stopPropagation();
        return;
    }

    // Aktuelle Position der Transformation
    let currentTransformY = this.viewportTransform[5];

    // Neue Position berechnen
    let newTransformY = currentTransformY - delta;

    // Obere Grenze
    let upperBound = 0;

    // Untere Grenze
    let lowerBound = canvasHeight - (dist_to_top + maxScrollDistance);

    // Begrenze die neue Position innerhalb der Grenzen
    if (newTransformY > upperBound) {
        newTransformY = upperBound;
    } else if (newTransformY < lowerBound) {
        newTransformY = lowerBound;
    }

    // Setze die neue Position und render nur wenn es eine Änderung gibt
    if (this.viewportTransform[5] !== newTransformY) {
        this.viewportTransform[5] = newTransformY;
        this.requestRenderAll();
        let objects = canvas_side_bar_perm.getObjects();
        for(let i=0; i<objects.length; i++){
            objects[i].setCoords();
        }
    }

    // Verhindere das Standardverhalten des Browsers (scrollen der gesamten Seite)
    opt.e.preventDefault();
    opt.e.stopPropagation();
});

canvas_side_bar_perm.on('mouse:down', function(opt) {

    if (dist_to_top + maxScrollNumber * (136 * buttonfactor * screenFactor + buttondist) < window.innerHeight /*|| geodesicButtonsvisible !== true*/) {
        return
    }

    let onSector = true;
    if(opt.target == null){ onSector=false}

    var evt = opt.e;
    let e =opt.e;
    let XCoord;
    let YCoord;
    let touch = e.touches;
    if ( onSector === false) {

        if (typeof touch !== 'undefined' ) {
            XCoord = touch[0].clientX;
            YCoord = touch[0].clientY;
        }else {
            XCoord = e.clientX;
            YCoord = e.clientY;
        }

        this.isDragging = true;
        //this.selection = false;
        this.lastPosX = XCoord;
        this.lastPosY = YCoord;
    }
});

canvas_side_bar_perm.on('mouse:move', function(opt) {
    if (shiftPressed !== undefined) {
        if (shiftPressed === true) {
            return;
        }
    }

    if (this.isDragging) {
        var e = opt.e;
        let YCoord;
        let touch = e.touches;

        if (typeof touch !== 'undefined') {
            YCoord = touch[0].clientY;
        } else {
            YCoord = e.clientY;
        }

        // Berechne die Änderung in der Y-Position
        let deltaY = YCoord - this.lastPosY;

        let newTransformY = this.viewportTransform[5] + deltaY;

        // Überprüfe die Grenzen
        let lowerBound = window.innerHeight - (dist_to_top + maxScrollNumber * (136 * buttonfactor * screenFactor + buttondist));
        let upperBound = 0;

        if (newTransformY < lowerBound) {
            this.viewportTransform[5] = lowerBound;
        } else if (newTransformY > upperBound) {
            this.viewportTransform[5] = upperBound;
        } else {
            this.viewportTransform[5] = newTransformY;
        }

        this.requestRenderAll();
        this.lastPosY = YCoord;
    }
});

canvas_side_bar_perm.on('mouse:up', function(opt) {

    if (shiftPressed === true) return;
    this.isDragging = false;
    //this.selection = false;
    this.forEachObject(function(o) {
        o.setCoords();
    });
    this.renderAll();
});

let shadowOn = {
    color: '#888888',
    blur: 60,
    offsetX: 0,
    offsetY: 0,
    opacity: 0.8
}

let shadowOff = {
    color: '#888888',
    blur: 0,
    offsetX: 0,
    offsetY: 0,
    opacity: 0.8
}

let back_language;
if(language !== "english"){
    back_language = 'german.html?'
    help_language = 'help_de.html?'
}else{
    back_language = 'english.html?'
    help_language = 'help_en.html?'
}

if (showResetSectors == "1"){
    help_language += "showResetSectors=1&"
}

if (showSetSectorsToRing == "1"){
    help_language += "showSetSectorsToRing=1&"
}

if (showAddCurvedLine == "1"){
    help_language += "showAddCurvedLine=1&"
}

if (showAddVector == "1"){
    help_language += "showAddVector=1&"
}

if (showAreaSector == "globe"){
    help_language += "showAreaSector=globe&"
}

if (showAreaSector == "earth"){
    help_language += "showAreaSector=earth&"
}

if (showVerticesOn == "1"){
    help_language += "showVerticesOn=1&"
}

if (showAutoSet == "1"){
    help_language += "showAutoSet=1&"
}

if (showChangeDirection == "1"){
    help_language += "showChangeDirection=1&"
}

if (showAutoComplete == "1"){
    help_language += "showAutoComplete=1&"
}

if (showChangeStartPoint == "1"){
    help_language += "showChangeStartPoint=1&"
}

/*
fabric.Image.fromURL('back.png', function(img) {
    let back = img.set({
        left: dist_left,
        top: dist_to_top + 0 * 136 * buttonfactor * screenFactor ,
        opacity: 1,
        originX: "center",
        originY: "top",
        //perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});


    back.on('mousedown', function (o) {
        back.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_bar_perm.renderAll()
    });

    back.on('mouseout', function (o) {
        back.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_bar_perm.renderAll()
    });

    back.on('mouseup', function (o) {
        back.set('shadow', new fabric.Shadow(shadowOff));
        window.location = back_language;
    });
    canvas_side_bar_perm.add(back);
});

//Unter Vorsicht!!!!
//Mögliche Screenshot-Funktion
window.addEventListener('keydown',function(event){
    let canvasToDownload = document.getElementById("canvas");
    if(event.key === 'q') {

        canvasToDownload.toBlob(function(blob) {
            saveAs(blob, "ergebnis.png");
        });
    }

});
*/


function addButtonText (button){
    button.text = new fabric.Text(
        getButtonLabel(button.buttonType),
        {
            left: button.left,
            top: button.top + (button.height + 5) * buttonfactor * screenFactor,
            fontSize: 10,
            fontFamily: "Calibri, sans-serif",
            fontStyle: "bold",
            textAlign: "canter",
            fill: "#666666ff",
            opacity: button.opacity,
            originX: "center",
            originY: "top",
            perPixelTargetFind: true,
            objectCaching: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            selectable: false,
        });
    canvas_side_bar_perm.add(button.text)
}

function addButtonTextRight (button){
    button.text = new fabric.Text(
        getButtonLabel(button.buttonType),
        {
            left: button.left,
            top: button.top + buttondist * buttonfactor,
            fontSize: 10,
            fontFamily: "Calibri, sans-serif",
            fontStyle: "bold",
            textAlign: "canter",
            fill: "#666666ff",
            opacity: button.opacity,
            originX: "center",
            originY: "center",
            perPixelTargetFind: true,
            objectCaching: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            selectable: false,
        });
    canvas_side_tools_right.add(button.text)
}



let restart

fabric.Image.fromURL('button_icons/restart.png', function(img) {
    restart = img.set({
        left: dist_left ,
        top: dist_to_top + dist_to_top_restart_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 1,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    restart.buttonType = "restart"

    restart.on('mousedown', function (o) {
        restart.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_bar_perm.renderAll()
    });

    restart.on('mouseout', function (o) {
        restart.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_bar_perm.renderAll()
    });

    restart.on('mouseup', function (o) {
        restart.set('shadow', new fabric.Shadow(shadowOff));
        if (language == "english"){
            if (confirm("This button restarts ViSeMo completely. If you really want to do this, click OK.")) {
                // Save it!
                showGeodesicButtons(false);
                resetAppliction();
                addGeodreieck(false);
                toCalcSectorArea = false;
                toShowVertices = false;
                showSectorAreaInfobox(false);
                showDeficitAngleInfobox(false);
                canvas_side_bar_perm.renderAll();
            } else {
                // Do nothing!
                console.log('no restart');
            }

        }else {
            if (confirm("Über diesen Button startest Du ViSeMo vollständig neu. Möchtest Du das wirklich tun, dann klicke auf OK.")) {
                // Save it!
                showGeodesicButtons(false);
                resetAppliction();
                addGeodreieck(false);
                toCalcSectorArea = false;
                toShowVertices = false;
                showSectorAreaInfobox(false);
                showDeficitAngleInfobox(false);
                canvas_side_bar_perm.renderAll();
            } else {
                // Do nothing!
                console.log('no restart');
            }
        }




    });
    canvas_side_bar_perm.add(restart);

    addButtonText(restart)
});

let resetSectorsOpacity = 0
if (showResetSectors == "1") {
    resetSectorsOpacity = 1 ;
}

fabric.Image.fromURL('button_icons/reset.png', function(img) {
    let reset = img.set({
        left: dist_left,
        top: dist_to_top + dist_to_top_reset_sectors_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: resetSectorsOpacity,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    reset.buttonType = "reset"

    reset.on('mousedown', function (o) {
        reset.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_bar_perm.renderAll()
    });

    reset.on('mouseout', function (o) {
        reset.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_bar_perm.renderAll()
    });

    reset.on('mouseup', function (o) {
        reset.set('shadow', new fabric.Shadow(shadowOff));
        changeGeodesicWidth(2);
        showGeodesicButtons(false);
        resetSectors();
        addGeodreieck(false);
        toCalcSectorArea = false;
        showSectorAreaInfobox(false);
        removeDeficitAngleVisualize();
        canvas_side_bar_perm.renderAll()
        buttonPressedForExercise(this)
    });
    canvas_side_bar_perm.add(reset);

    addButtonText(reset)
});

let setSectorsToRingOpacity = 0
if (showSetSectorsToRing == "1") {
    setSectorsToRingOpacity = 1 ;
}

let set_sectors_to_ring;
fabric.Image.fromURL('button_icons/set_sectors_to_ring.png', function(img) {
    set_sectors_to_ring = img.set({
        left: dist_left,
        top: dist_to_top + dist_to_top_set_sectors_to_ring_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: setSectorsToRingOpacity,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    set_sectors_to_ring.buttonType = "set_sectors_to_ring"

    set_sectors_to_ring.on('mousedown', function (o) {
        set_sectors_to_ring.set('shadow', new fabric.Shadow(shadowOn));
    });
    set_sectors_to_ring.on('mouseout', function (o) {
        set_sectors_to_ring.set('shadow', new fabric.Shadow(shadowOff));
    });

    set_sectors_to_ring.on('mouseup', function (o) {
        set_sectors_to_ring.set('shadow', new fabric.Shadow(shadowOff));
        setOuterSectorsToRing();
        toolChange('grab');
        arrowheadline = -1;
        moveDirectionButtons(false);
        buttonPressedForExercise(this)
    });
    canvas_side_bar_perm.add(set_sectors_to_ring);

    addButtonText(set_sectors_to_ring)
});

/*
fabric.Image.fromURL('grab.png', function(img) {
    let grab = img.set({
        left: dist_left,
        top: 3 * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 1,
        originX: "center",
        originY: "top",
        //perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    grab.on('mousedown', function (o) {
        showGeodesicButtons(false);
        toolChange('grab');

        let side_bar_for_change = document.getElementById("container_side_bar_temp");
        side_bar_for_change.style.zIndex = 0;

    });

    canvas_side_bar_perm.add(grab);
});
*/

let add;
fabric.Image.fromURL('button_icons/add.png', function(img) {
     add = img.set({
        left: dist_left,
        top:  dist_to_top + dist_to_top_add_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 1,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    add.buttonType = "add"

    add.on('mousedown', function (o) {
        add.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_bar_perm.renderAll()
    });

    add.on('mouseout', function (o) {
        add.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_bar_perm.renderAll()
    });

    add.on('mouseup', function (o) {
        lineTypeToDraw = 'geodesic'
        changeGeodesicWidth(2);
        showGeodesicButtons(false);
        toolChange('paint');
        geodreieck.selectable = false;
        //add.opacity = 0;
        //add_dark.opacity = 1;
        canvas_side_bar_perm.renderAll()
        showVertices(false);
        showSectorAreaInfobox(false)
        showDeficitAngleInfobox(false)
        buttonPressedForExercise(this)
    });
    canvas_side_bar_perm.add(add);

    addButtonText(add)
});

let add_dark;
fabric.Image.fromURL('button_icons/add_dark.png', function(img) {
    add_dark = img.set({
        left: dist_left,
        top:  dist_to_top + dist_to_top_add_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 0,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    add_dark.buttonType = "add_dark"

    add_dark.on('mousedown', function (o) {
        add_dark.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_bar_perm.renderAll()
    });

    add_dark.on('mouseout', function (o) {
        add_dark.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_bar_perm.renderAll()
    });

    add_dark.on('mouseup', function (o) {
        add_dark.set('shadow', new fabric.Shadow(shadowOff));
        changeGeodesicWidth(2);
        showGeodesicButtons(false);
        toolChange('grab');
        geodreieck.selectable = true;
        //add.opacity = 1;
        //add_dark.opacity = 0;
        canvas_side_bar_perm.renderAll()
        buttonPressedForExercise(this)
    });
    canvas_side_bar_perm.add(add_dark);
});

let add_curvedOpacity = 0
if (showAddCurvedLine == "1") {
    add_curvedOpacity = 1 ;
}


let add_curved;
fabric.Image.fromURL('button_icons/add_curved.png', function(img) {
    add_curved = img.set({
        left: dist_left,
        top:  dist_to_top + dist_to_add_curved_line_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: add_curvedOpacity,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    add_curved.buttonType = "add_curved"

    add_curved.on('mousedown', function (o) {
        add_curved.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_bar_perm.renderAll()
    });

    add_curved.on('mouseout', function (o) {
        add_curved.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_bar_perm.renderAll()
    });

    add_curved.on('mouseup', function (o) {
        lineTypeToDraw = 'polyline'
        changeGeodesicWidth(2);
        showGeodesicButtons(false);
        toolChange('paint');
        geodreieck.selectable = false;
        //add.opacity = 0;
        //add_dark.opacity = 1;
        canvas_side_bar_perm.renderAll()
        showVertices(false);
        showSectorAreaInfobox(false)
        showDeficitAngleInfobox(false)
        buttonPressedForExercise(this)
    });
    canvas_side_bar_perm.add(add_curved);

    addButtonText(add_curved)
});




let add_dark_curved;
fabric.Image.fromURL('button_icons/add_dark_curved.png', function(img) {
    add_dark_curved = img.set({
        left: dist_left,
        top:  dist_to_top + dist_to_add_curved_line_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 0,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    add_dark_curved.buttonType = "add_dark_curved"

    add_dark_curved.on('mousedown', function (o) {
        add_dark_curved.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_bar_perm.renderAll()
    });

    add_dark_curved.on('mouseout', function (o) {
        add_dark_curved.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_bar_perm.renderAll()
    });

    add_dark_curved.on('mouseup', function (o) {
        add_dark_curved.set('shadow', new fabric.Shadow(shadowOff));
        changeGeodesicWidth(2);
        showGeodesicButtons(false);
        toolChange('grab');
        geodreieck.selectable = true;
        //add.opacity = 1;
        //add_dark.opacity = 0;
        canvas_side_bar_perm.renderAll()
        buttonPressedForExercise(this)
    });
    canvas_side_bar_perm.add(add_dark_curved);

});

let add_vectorOpacity = 0
if (showAddVector == "1") {
    add_vectorOpacity = 1 ;
}


let addVector;

fabric.Image.fromURL('button_icons/add_vector.png', function (img) {
   addVector =  img.set({
       left: dist_left,
       top: dist_to_top + dist_to_add_vector_button_number * (136 * buttonfactor * screenFactor + buttondist),
       opacity: add_vectorOpacity,
       originX: "center",
       originY: "top",
       perPixelTargetFind: true,
       objectCaching: false,
       hasBorders: false,
       hasControls: false,
       evented: true,
       selectable: false,
       scaleX: buttonfactor * screenFactor,
       scaleY: buttonfactor * screenFactor,
       hoverCursor: "pointer"});

   addVector.buttonType = 'addVector'

    addVector.on('mousedown', function (o) {
        addVector.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_bar_perm.renderAll()
    });

    addVector.on('mouseout', function (o) {
        addVector.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_bar_perm.renderAll()
    });

   addVector.on('mouseup', function (){
       lineTypeToDraw = 'vector';
       changeGeodesicWidth(2);
       showGeodesicButtons(false);
       toolChange('paint');
       geodreieck.selectable = false;
       //add.opacity = 0;
       //add_dark.opacity = 1;
       canvas_side_bar_perm.renderAll();
       showVertices(false);
       showSectorAreaInfobox(false);
       showDeficitAngleInfobox(false);
       buttonPressedForExercise(this)
   });

    canvas_side_bar_perm.add(addVector);

    addButtonText(addVector)
});


let undo;
fabric.Image.fromURL('button_icons/undo.png', function(img) {
    undo = img.set({
        left: dist_left,
        top: dist_to_top + dist_to_top_undo_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 1,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    undo.buttonType = "undo"

    undo.on('mousedown', function (o) {
        undo.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_bar_perm.renderAll()
    });

    undo.on('mouseout', function (o) {
        undo.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_bar_perm.renderAll()
    });

    undo.on('mouseup', function (o) {
        undo.set('shadow', new fabric.Shadow(shadowOff));
        undoLastAction();
        changeGeodesicWidth(2);
        showGeodesicButtons(false);
        toolChange('grab');
        canvas_side_bar_perm.renderAll()
        buttonPressedForExercise(this)

    });

    canvas_side_bar_perm.add(undo);

    addButtonText(undo)
});


let button_dreieck;


function addGeodreieck(geodreieckToAdd){
    if (geodreieckToAdd == true){
        canvas.add(geodreieck);

        let zoom = canvas.getZoom();

        let viewpoint_x = fabric.util.invertTransform(canvas.viewportTransform)[4]+(canvas.width/zoom)/2;
        let viewpoint_y = fabric.util.invertTransform(canvas.viewportTransform)[5]+(canvas.height/zoom)/2;

        geodreieck.set('left', viewpoint_x);
        geodreieck.set('top', viewpoint_y);

        geodreieck.setCoords();
        button_dreieck.opacity = 0;
        button_dreieck_empty.opacity = 1;

    } else{
        canvas.remove(geodreieck);
        button_dreieck.opacity = 1;
        button_dreieck_empty.opacity = 0;

    }

}


fabric.Image.fromURL('button_icons/button_dreieck.png', function(img) {
    button_dreieck = img.set({
        left: dist_left,
        top:  dist_to_top + dist_to_top_geodreieck_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 1,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    button_dreieck.buttonType = "button_dreieck"

    button_dreieck.on('mousedown', function (o) {
        button_dreieck.set('shadow', new fabric.Shadow(shadowOn));
    });

    button_dreieck.on('mouseout', function (o) {
        button_dreieck.set('shadow', new fabric.Shadow(shadowOff));
    });

    button_dreieck.on('mouseup', function (o) {
        button_dreieck.set('shadow', new fabric.Shadow(shadowOff));
        changeGeodesicWidth(2);
        showGeodesicButtons(false);
        toCalcSectorArea = false;
        toShowVertices = false;
        showSectorAreaInfobox(false);
        showDeficitAngleInfobox(false)
        toolChange('grab');
        addGeodreieck(true);
        canvas_side_bar_perm.renderAll()
        buttonPressedForExercise(this)

    });
    canvas_side_bar_perm.add(button_dreieck);

    addButtonText(button_dreieck)
});


let button_dreieck_empty;
fabric.Image.fromURL('button_icons/button_dreieck_empty.png', function(img) {
    button_dreieck_empty = img.set({
        left: dist_left,
        top:  dist_to_top + dist_to_top_geodreieck_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 0,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    button_dreieck_empty.buttonType = "button_dreieck_empty"

    button_dreieck_empty.on('mousedown', function (o) {
        button_dreieck_empty.set('shadow', new fabric.Shadow(shadowOn));
    });

    button_dreieck_empty.on('mouseout', function (o) {
        button_dreieck_empty.set('shadow', new fabric.Shadow(shadowOff));
    });

    button_dreieck_empty.on('mouseup', function (o) {
        button_dreieck_empty.set('shadow', new fabric.Shadow(shadowOff));
        //changeGeodesicWidth(2);
        //showGeodesicButtons(false);
        //toolChange('grab');
        addGeodreieck(false);
        canvas_side_bar_perm.renderAll()
        buttonPressedForExercise(this)
    });

    button_dreieck_empty.on('mouseover', function (o) {

        if (geodreieckIsClicked == true) {
            //changeGeodesicWidth(2);
            //showGeodesicButtons(false);
            //toolChange('grab');
            addGeodreieck(false);
        }
        canvas_side_bar_perm.renderAll()
    });

    canvas_side_bar_perm.add(button_dreieck_empty);
});


/*
canvas_side_bar_perm.on('mouse:over', function(e) {
    if (e.target == null){
        return
    }
    e.target.set('fill', '#FFFC1C');
    canvas_side_bar_perm.renderAll();
});

canvas_side_bar_perm.on('mouse:out', function(e) {
    if (e.target == null){
        return
    }
    if (e.target.isPressed == false) e.target.set('fill', '#e5e5e0');
    canvas_side_bar_perm.renderAll();
});
*/



let areaSectorOpacity = 0
if (showAreaSector == "globe" || showAreaSector == "earth") {
    areaSectorOpacity = 1 ;
}


let area_sector
fabric.Image.fromURL('button_icons/area_sector.png', function(img) {
    area_sector = img.set({
        left: dist_left,
        top:  dist_to_top + dist_to_top_showArea_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: areaSectorOpacity,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    area_sector.buttonType = "area_sector"

    area_sector.on('mousedown', function (o) {
        area_sector.set('shadow', new fabric.Shadow(shadowOn));
    });

    area_sector.on('mouseout', function (o) {
        area_sector.set('shadow', new fabric.Shadow(shadowOff));
    });

    area_sector.on('mouseup', function (o) {
        area_sector.set('shadow', new fabric.Shadow(shadowOff));
        calcSectorArea();
        changeGeodesicWidth(2);
        showGeodesicButtons(false);
        toolChange('grab');
        canvas_side_bar_perm.renderAll()
        buttonPressedForExercise(this)

    });
    canvas_side_bar_perm.add(area_sector);

    addButtonText(area_sector)
});

let infoboxArea;
infoboxArea = new fabric.Rect({
    left: 140 * screenFactor,
    top: dist_to_top + dist_to_top_showArea_button_number * (136 * buttonfactor * screenFactor + buttondist),
    opacity: 0,
    width: 120 * screenFactor,
    height: 50 * screenFactor,
    stroke: '#575656',
    fill: 'white',
    strokeWidth: 3,
    rx:5,
    ry:5,
    originX: 'center',
    originY: 'top',
    hasBorders: false,
    hasControls: false,
    selectable: false,
    perPixelTargetFind: true,
});
canvas_side_bar_perm.add(infoboxArea);

/* CZ 21.05.24
let infoboxAreaTextByLanguage = "wähle einen\nSektor";
if (language == "english"){
    infoboxAreaTextByLanguage = "click on\na sector"
}
*/
let infoboxAreaTextByLanguage = getText("InfoBoxAreaText");

let infoboxAreaText
infoboxAreaText = new fabric.Text("Text", {
    opacity: 0,
    fontSize: 16 * screenFactor,
    fontFamily: 'arial',
    fontWeight: 'bold',
    selectable: false,
    originX: 'center',
    originY: 'center',
    left: 140 * screenFactor,
    top: dist_to_top + dist_to_top_showArea_button_number * (136 * buttonfactor * screenFactor + buttondist) + 25 * screenFactor,
    text: infoboxAreaTextByLanguage,
    fill: '#575656',
    objectCaching: false,
    hasBorders: false,
    hasControls: false,
    selectable: false,
    perPixelTargetFind: true,
});

canvas_side_bar_perm.add(infoboxAreaText);

let verticesOnOpacity = 0
if (showVerticesOn == "1") {
    verticesOnOpacity = 1 ;
}


let verticesOn
fabric.Image.fromURL('button_icons/verticesOn.png', function(img) {
    verticesOn = img.set({
        left: dist_left,
        top:  dist_to_top + dist_to_top_verticesOn_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: verticesOnOpacity,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    verticesOn.buttonType = "verticesOn"

    verticesOn.on('mousedown', function (o) {
        verticesOn.set('shadow', new fabric.Shadow(shadowOn));
    });

    verticesOn.on('mouseout', function (o) {
        verticesOn.set('shadow', new fabric.Shadow(shadowOff));
    });

    verticesOn.on('mouseup', function (o) {
        verticesOn.set('shadow', new fabric.Shadow(shadowOff));
        if (verticesVisible !== true){
            showVertices(true);
        }else{
            showVertices(false);
        }
        changeGeodesicWidth(2);
        showGeodesicButtons(false);
        toolChange('grab');
        canvas_side_bar_perm.renderAll()
        buttonPressedForExercise(this)

    });
    canvas_side_bar_perm.add(verticesOn);

    addButtonText(verticesOn)
});

let infoboxDeficitAngle;
infoboxDeficitAngle = new fabric.Rect({
    left: 140 * screenFactor,
    top: dist_to_top + dist_to_top_verticesOn_button_number * (136 * buttonfactor * screenFactor + buttondist),
    opacity: 0,
    width: 120 * screenFactor,
    height: 50 * screenFactor,
    stroke: '#575656',
    fill: 'white',
    strokeWidth: 3,
    rx:5,
    ry:5,
    originX: 'center',
    originY: 'top',
    hasBorders: false,
    hasControls: false,
    selectable: false,
    perPixelTargetFind: true,
});
canvas_side_bar_perm.add(infoboxDeficitAngle);

/* CZ 24.05.24
let infoboxDeficitAngleTextByLanguage = "wähle einen\nVertex";
if (language == "english"){
    infoboxDeficitAngleTextByLanguage = "click on\na vertex"
}
*/
let infoboxDeficitAngleTextByLanguage = getText("InfoBoxDeficitAngle");

let infoboxDeficitAngleText
infoboxDeficitAngleText = new fabric.Text("Text", {
    opacity: 0,
    fontSize: 16 * screenFactor,
    fontFamily: 'arial',
    fontWeight: 'bold',
    selectable: false,
    originX: 'center',
    originY: 'center',
    left: 140 * screenFactor,
    top: dist_to_top + dist_to_top_verticesOn_button_number * (136 * buttonfactor * screenFactor + buttondist) + 25 * screenFactor,
    text: infoboxDeficitAngleTextByLanguage,
    fill: '#575656',
    objectCaching: false,
    hasBorders: false,
    hasControls: false,
    selectable: false,
    perPixelTargetFind: true,
});
canvas_side_bar_perm.add(infoboxDeficitAngleText);

let geodesicButtonsvisible;

function showGeodesicButtons(geodesicButtonsVisibleToSet) {
    if (geodesicButtonsVisibleToSet == true) {


        geodesicButtonsvisible = true;
        maxScrollNumber = dist_to_top_button_number_with_geodesic_buttons

        delete_whole.set('opacity', 1);
        delete_whole.text.set('opacity', 1);

        if (isLineStarted == true) {
            if (lineTypeToDraw !== "polyline"){
                if (showAutoSet == "1") {
                    set_sectors.set('opacity', 1);
                    set_sectors.text.set('opacity', 1);
                }

                if (showAutoComplete == "1") {
                    autocomplete.set('opacity', 1);
                    autocomplete.text.set('opacity', 1);
                }

                if (showChangeDirection == "1") {
                    direction.set('opacity', 1);
                    direction.text.set('opacity', 1);
                }
                if (showChangeStartPoint == "1") {
                    joystickBackground.set('opacity', joystickBackgroundOpacity)
                    joystickBackground.text.set('opacity', 1)
                    joystickBall.set('opacity', joystickBallOpacity)
                    joystickBall.bringToFront()
                }
            }
        }else{
            if (chosenLineGlobalID !== -1){
                if (lines[chosenLineGlobalID][0].lineType !== "polyline"){
                    if (showAutoSet == "1") {
                        set_sectors.set('opacity', 1);
                        set_sectors.text.set('opacity', 1);
                    }

                    if (showAutoComplete == "1") {
                        autocomplete.set('opacity', 1);
                        autocomplete.text.set('opacity', 1);
                    }

                    if (showChangeDirection == "1") {
                        direction.set('opacity', 1);
                        direction.text.set('opacity', 1);
                    }
                    if (showChangeStartPoint == "1") {
                        joystickBackground.set('opacity', joystickBackgroundOpacity)
                        joystickBackground.text.set('opacity', 1)
                        joystickBall.set('opacity', joystickBallOpacity)
                        joystickBall.bringToFront()
                    }
                }
            }

        }


    }else {

        geodesicButtonsvisible = false;
        maxScrollNumber = dist_to_top_button_number_without_geodesic_buttons

        delete_whole.set('opacity', 0);
        delete_whole.text.set('opacity', 0);

        autocomplete.set('opacity', 0);
        autocomplete.text.set('opacity', 0);

        set_sectors.set('opacity', 0);
        set_sectors.text.set('opacity', 0);

        direction.set('opacity', 0);
        direction.text.set('opacity', 0);

        joystickBackground.set('opacity', 0);
        joystickBackground.text.set('opacity', 0);

        joystickBall.set('opacity', 0);

        canvas_side_bar_perm.viewportTransform[5] = 0;
        canvas_side_bar_perm.forEachObject(function(o) {
            o.setCoords();
        });

    }
    moveDirectionButtons(false);
    canvas_side_bar_perm.renderAll()

}


let delete_whole;
fabric.Image.fromURL('button_icons/delete.png', function(img) {
    delete_whole = img.set({
        left: dist_left,
        top: dist_to_top + dist_to_top_delete_whole_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 0,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    delete_whole.buttonType = "delete_whole"

    delete_whole.on('mousedown', function (o) {
        delete_whole.set('shadow', new fabric.Shadow(shadowOn));
    });
    delete_whole.on('mouseout', function (o) {
        delete_whole.set('shadow', new fabric.Shadow(shadowOff));
    });

    delete_whole.on('mouseup', function (o) {
        delete_whole.set('shadow', new fabric.Shadow(shadowOff));
        deleteWholeGeodesic(chosenLineGlobalID);
        toolChange('grab');

        moveDirectionButtons(false);

        chosenLineGlobalID = - 1;
        showGeodesicButtons(false)
        buttonPressedForExercise(this)
    });
    canvas_side_bar_perm.add(delete_whole);

    addButtonText(delete_whole)
});

let lastPressedButton

let set_sectors;
fabric.Image.fromURL('button_icons/set_sectors.png', function(img) {
    set_sectors = img.set({
        left: dist_left,
        top: dist_to_top + dist_to_top_set_sectors_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 0,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    set_sectors.buttonType = "set_sectors"

    set_sectors.on('mousedown', function (o) {
        set_sectors.set('shadow', new fabric.Shadow(shadowOn));
    });
    set_sectors.on('mouseout', function (o) {
        set_sectors.set('shadow', new fabric.Shadow(shadowOff));
    });

    set_sectors.on('mouseup', function (o) {

        set_sectors.set('shadow', new fabric.Shadow(shadowOff));
        autoSetSectorsAlongGeodesic(chosenLineGlobalID);
        toolChange('grab');
        arrowheadline = -1;
        moveDirectionButtons(false);
        buttonPressedForExercise(this)
    });
    canvas_side_bar_perm.add(set_sectors);

    addButtonText(set_sectors)
});


function buttonPressedForExercise(button){
    if (showExerciseBox !== "1") {
        return
    }
    lastPressedButton = button.buttonType

    checkSlideCondition()
}


let autocomplete;
fabric.Image.fromURL('button_icons/autocomplete.png', function(img) {
    autocomplete = img.set({
        left: dist_left,
        top: dist_to_top + (dist_to_top_auto_complete_button_number) * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 0,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    autocomplete.buttonType = "autocomplete"

    autocomplete.on('mousedown', function (o) {
        autocomplete.set('shadow', new fabric.Shadow(shadowOn));
    });
    autocomplete.on('mouseout', function (o) {
        autocomplete.set('shadow', new fabric.Shadow(shadowOff));
    });

    autocomplete.on('mouseup', function (o) {
        autocomplete.set('shadow', new fabric.Shadow(shadowOff));
        continueGeodesic(chosenLineGlobalID);
        toolChange('grab');

        moveDirectionButtons(false);
        buttonPressedForExercise(this)
    });
    canvas_side_bar_perm.add(autocomplete);

    addButtonText(autocomplete)
});

let direction;
let visible = false;



//dist_to_top_direction_main_button_number beschreibt die Höhe des Buttons und wird bei den kleinen Button gebraucht
//Ebenfalls wird dies bei den großen FolgeButtons gebraucht

function moveDirectionButtons(visibleToSet){

    if (visibleToSet == true) {
        visible = true;

        maxScrollNumber += 1.5;
        let canvasHeight = window.innerHeight;
        let maxScrollDistance = maxScrollNumber * (136 * buttonfactor * screenFactor + buttondist);
        if (canvasHeight < maxScrollDistance) {
            canvas_side_bar_perm.viewportTransform[5] = canvasHeight - (dist_to_top + maxScrollDistance)
            var objects = canvas_side_bar_perm.getObjects();
            for(let i=0; i<objects.length; i++){
                objects[i].setCoords();
            }
        }

        joystickBackground.set('top', dist_to_top + 30 + (dist_to_top_change_start_point_position_main_button_number + 1.5) * (136 * buttonfactor * screenFactor + buttondist));
        joystickBackground.setCoords();
        joystickBall.set('top', dist_to_top + 30 + (dist_to_top_change_start_point_position_main_button_number + 1.5) * (136 * buttonfactor * screenFactor + buttondist));
        joystickBall.setCoords();
        joystickBackground.text.set('top', joystickBackground.top + (joystickBackground.height/2 + 20) * buttonfactor);
        joystickBackground.text.setCoords();
        //delete_whole.set('top', dist_to_top + 10.5 * (136 * buttonfactor * screenFactor + buttondist));
        //delete_whole.setCoords();

        change_direction_counterclock_high.set('opacity', 1);
        change_direction_clockwise_high.set('opacity', 1);
        change_direction_counterclock_low.set('opacity', 1);
        change_direction_clockwise_low.set('opacity', 1);
        canvas_side_bar_perm.renderAll()

    } else {

        if (visible == true){
            maxScrollNumber -= 1.5;
            let canvasHeight = window.innerHeight;
            let maxScrollDistance = maxScrollNumber * (136 * buttonfactor * screenFactor + buttondist);
            /*
            console.log(maxScrollNumber)
            if (canvas_side_bar_perm.viewportTransform[5] > window.innerHeight - (dist_to_top + maxScrollNumber * (136 * buttonfactor * screenFactor + buttondist))) {
                canvas_side_bar_perm.viewportTransform[5] = window.innerHeight - (dist_to_top + maxScrollNumber * (136 * buttonfactor * screenFactor + buttondist));
                console.log(window.innerHeight - (dist_to_top + maxScrollNumber * (136 * buttonfactor * screenFactor + buttondist)))
                canvas_side_bar_perm.requestRenderAll();
            }
            */
            if (canvasHeight < maxScrollDistance) {
                canvas_side_bar_perm.viewportTransform[5] = canvasHeight - (dist_to_top + maxScrollDistance)
                let objects = canvas_side_bar_perm.getObjects();
                for(let i=0; i<objects.length; i++){
                    objects[i].setCoords();
                }
            }
        }

        visible = false;

        joystickBackground.set('top', dist_to_top + additionalDistanceToButtonBefore + (dist_to_top_change_start_point_position_main_button_number) * (136 * buttonfactor * screenFactor + buttondist));
        joystickBackground.setCoords();
        joystickBall.set('top', dist_to_top + additionalDistanceToButtonBefore + (dist_to_top_change_start_point_position_main_button_number) * (136 * buttonfactor * screenFactor + buttondist));
        joystickBall.setCoords();
        joystickBackground.text.set('top', joystickBackground.top + (joystickBackground.height/2 + 20) * buttonfactor);
        joystickBackground.text.setCoords();
        //delete_whole.set('top', dist_to_top + 9 * (136 * buttonfactor * screenFactor + buttondist));
        //delete_whole.setCoords();

        change_direction_counterclock_high.set('opacity', 0);
        change_direction_clockwise_high.set('opacity', 0);
        change_direction_counterclock_low.set('opacity', 0);
        change_direction_clockwise_low.set('opacity', 0)
        canvas_side_bar_perm.renderAll()
    }
}


fabric.Image.fromURL('button_icons/direction.png', function(img) {
    direction = img.set({
        left: dist_left,
        top: dist_to_top + dist_to_top_direction_main_button_number * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 0,
        originX: "center",
        originY: "top",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    direction.buttonType = "direction"

    direction.on('mousedown', function (o) {
        direction.set('shadow', new fabric.Shadow(shadowOn));
    });
    direction.on('mouseout', function (o) {
        direction.set('shadow', new fabric.Shadow(shadowOff));
    });

    direction.on('mouseup', function (o) {
        direction.set('shadow', new fabric.Shadow(shadowOff));
        if (visible == true) {
            moveDirectionButtons(false)
        }else moveDirectionButtons(true)
        canvas_side_bar_perm.renderAll()
        buttonPressedForExercise(this)
    });
    canvas_side_bar_perm.add(direction);

    addButtonText(direction)
});

let timeout;
let scalefactorclockbutton = 0.3;
let buttondist_local = 10 * screenFactor;

let change_direction_counterclock_high;
fabric.Image.fromURL('button_icons/button_change_direction_counterclock_high.png', function(img) {
    change_direction_counterclock_high = img.set({
        left: 50 - 5 * screenFactor,
        top: dist_to_top + (dist_to_top_direction_main_button_number + 1) * (136 * buttonfactor * screenFactor + buttondist),
        originX: "right",
        originY: "top",
        perPixelTargetFind: true,
        opacity: 0,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: scalefactorclockbutton * screenFactor,
        scaleY: scalefactorclockbutton * screenFactor,
        hoverCursor: "pointer"});

    change_direction_counterclock_high.buttonType = "change_direction_counterclock_high"

    change_direction_counterclock_high.on('mousedown', function (event) {

        change_direction_counterclock_high.set('shadow', new fabric.Shadow(shadowOn));

        changeDirectionAndContinue('counterclockwise', Math.PI/180, chosenLineGlobalID);
        timeout = setInterval(function (event){changeDirectionAndContinue('counterclockwise', Math.PI/180, chosenLineGlobalID);}, 151.5);
        toolChange('grab');
        arrowheadline = -1;
        return false;
    });

    change_direction_counterclock_high.on('mouseout', function () {
        change_direction_counterclock_high.set('shadow', new fabric.Shadow(shadowOff));
        clearInterval(timeout);
        drawDragPoint(chosenLineGlobalID);
        toolChange('grab');
    });

    change_direction_counterclock_high.on('mouseup', function () {
        change_direction_counterclock_high.set('shadow', new fabric.Shadow(shadowOff));
        clearInterval(timeout);
        drawDragPoint(chosenLineGlobalID);
        toolChange('grab');
        buttonPressedForExercise(this)
    });

    canvas_side_bar_perm.add(change_direction_counterclock_high);
});

let change_direction_clockwise_high;
fabric.Image.fromURL('button_icons/button_change_direction_clockwise_high.png', function(img) {
    change_direction_clockwise_high = img.set({
        left: 50 + 5 *screenFactor,
        top: dist_to_top + (dist_to_top_direction_main_button_number + 1) * (136 * buttonfactor * screenFactor + buttondist),
        originX: "left",
        originY: "top",
        perPixelTargetFind: true,
        opacity: 0,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: scalefactorclockbutton * screenFactor,
        scaleY: scalefactorclockbutton * screenFactor,
        hoverCursor: "pointer"});

    change_direction_clockwise_high.buttonType = "change_direction_clockwise_high"

    change_direction_clockwise_high.on('mousedown', function (event) {
        change_direction_clockwise_high.set('shadow', new fabric.Shadow(shadowOn));
        changeDirectionAndContinue('clockwise', Math.PI/180, chosenLineGlobalID);
        timeout = setInterval(function (event){changeDirectionAndContinue('clockwise', Math.PI/180, chosenLineGlobalID);}, 151.5);
        toolChange('grab');
        arrowheadline = -1;
        return false;
    });

    change_direction_clockwise_high.on('mouseout', function () {
        change_direction_clockwise_high.set('shadow', new fabric.Shadow(shadowOff));
        clearInterval(timeout);
        drawDragPoint(chosenLineGlobalID);
        toolChange('grab')
    });

    change_direction_clockwise_high.on('mouseup', function () {
        change_direction_clockwise_high.set('shadow', new fabric.Shadow(shadowOff));
        clearInterval(timeout);
        drawDragPoint(chosenLineGlobalID);
        toolChange('grab');
        buttonPressedForExercise(this)
    });

    canvas_side_bar_perm.add(change_direction_clockwise_high);
});
let change_direction_counterclock_low;
fabric.Image.fromURL('button_icons/button_change_direction_counterclock_low.png', function(img) {
    change_direction_counterclock_low = img.set({
        left: 50 - 5 *screenFactor,
        top: dist_to_top + (dist_to_top_direction_main_button_number + 1) * (136 * buttonfactor * screenFactor + buttondist) + 136 *scalefactorclockbutton * screenFactor + 10 *screenFactor,
        originX: "right",
        originY: "top",
        perPixelTargetFind: true,
        opacity: 0,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: scalefactorclockbutton * screenFactor,
        scaleY: scalefactorclockbutton * screenFactor,
        hoverCursor: "pointer"});

    change_direction_counterclock_low.buttonType = "change_direction_counterclock_low"

    change_direction_counterclock_low.on('mousedown', function (event) {
        change_direction_counterclock_low.set('shadow', new fabric.Shadow(shadowOn));
        changeDirectionAndContinue('counterclockwise', Math.PI/180 * 0.1 , chosenLineGlobalID);
        timeout = setInterval(function (event){changeDirectionAndContinue('counterclockwise', Math.PI/180 * 0.1, chosenLineGlobalID);}, 151.5);
        toolChange('grab');
        arrowheadline = -1;
        return false;
    });

    change_direction_counterclock_low.on('mouseout', function () {
        change_direction_counterclock_low.set('shadow', new fabric.Shadow(shadowOff));
        clearInterval(timeout);
        drawDragPoint(chosenLineGlobalID);
        toolChange('grab')
    });

    change_direction_counterclock_low.on('mouseup', function () {
        change_direction_counterclock_low.set('shadow', new fabric.Shadow(shadowOff));
        clearInterval(timeout);
        drawDragPoint(chosenLineGlobalID);
        toolChange('grab');
        buttonPressedForExercise(this)
    });

    canvas_side_bar_perm.add(change_direction_counterclock_low);
});

let change_direction_clockwise_low;
fabric.Image.fromURL('button_icons/button_change_direction_clockwise_low.png', function(img) {
    change_direction_clockwise_low = img.set({
        left: 50 + 5 *screenFactor,
        top: dist_to_top + (dist_to_top_direction_main_button_number + 1) * (136 * buttonfactor * screenFactor + buttondist) + 136 *scalefactorclockbutton * screenFactor + 10 *screenFactor,
        originX: "left",
        originY: "top",
        perPixelTargetFind: true,
        opacity: 0,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: scalefactorclockbutton * screenFactor,
        scaleY: scalefactorclockbutton * screenFactor,
        hoverCursor: "pointer"});

    change_direction_clockwise_low.buttonType = "change_direction_clockwise_low"

    change_direction_clockwise_low.on('mousedown', function (event) {
        change_direction_clockwise_low.set('shadow', new fabric.Shadow(shadowOn));
        changeDirectionAndContinue('clockwise', Math.PI/180 * 0.1, chosenLineGlobalID);
        timeout = setInterval(function (event){changeDirectionAndContinue('clockwise', Math.PI/180 * 0.1, chosenLineGlobalID);}, 151.5);
        toolChange('grab');
        arrowheadline = -1;
        return false;
    });

    change_direction_clockwise_low.on('mouseout', function () {
        change_direction_clockwise_low.set('shadow', new fabric.Shadow(shadowOff));
        clearInterval(timeout);
        drawDragPoint(chosenLineGlobalID);
        toolChange('grab')
    });

    change_direction_clockwise_low.on('mouseup', function () {
        change_direction_clockwise_low.set('shadow', new fabric.Shadow(shadowOff));
        clearInterval(timeout);
        drawDragPoint(chosenLineGlobalID);
        toolChange('grab');
        buttonPressedForExercise(this)
    });

    canvas_side_bar_perm.add(change_direction_clockwise_low);
});




let joystickBackground;
let joystickBackgroundOpacity = 1.0
let joystickBallOpacity = 0.8
let additionalDistanceToButtonBefore = 40
fabric.Image.fromURL('button_icons/joystickBackground.png', function(img) {
    joystickBackground = img.set({
        left: dist_left,
        top: dist_to_top - additionalDistanceToButtonBefore + (dist_to_top_change_start_point_position_main_button_number + 1) * (136 * buttonfactor * screenFactor + buttondist),
        opacity: 0,
        originX: "center",
        originY: "center",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"
    });

    joystickBackground.buttonType = 'joystickBackground';

    canvas_side_bar_perm.add(joystickBackground);

    addButtonText(joystickBackground)
    joystickBackground.text.set('top', joystickBackground.top + (joystickBackground.height/2 + 20) * buttonfactor);

});


let joystickBall;
joystickBall = new fabric.Circle({
    radius: 20,
    left: dist_left,
    top: dist_to_top - additionalDistanceToButtonBefore + (dist_to_top_change_start_point_position_main_button_number + 1) * (136 * buttonfactor * screenFactor + buttondist),
    stroke: '#575656',
    strokeWidth: 2,
    fill: '#575656',
    originY:'center',
    originX:'center',
    objectCaching: false,
    lockMovementX: false,
    lockMovementY: false,
    lockScalingX: true,
    lockScalingY: true,
    perPixelTargetFind: true,
    opacity: 0,
    hasBorders: false,
    hasControls: false,
});
let joystickBalMoveDistance = 20;
let joystickFactor = 0.25
let mouseDownOnJoystickBall = -1

let joystickBallDistX = 0
let joystickBallDistY = 0

joystickBall.on('mousedown', function () {
    if(mouseDownOnJoystickBall == -1){
        mouseDownOnJoystickBall = setInterval(whileMouseDownOnJoystickBall, 200)
    }

})

function whileMouseDownOnJoystickBall(){
    changeStartPointAndContinue(joystickBallDistX, joystickBallDistY, chosenLineGlobalID)
}

joystickBall.on('moving', function () {
    if (joystickBall.top > joystickBackground.top + joystickBalMoveDistance) {
        joystickBall.set('top', joystickBackground.top + joystickBalMoveDistance);
    }
    if (joystickBall.top < joystickBackground.top - joystickBalMoveDistance) {
        joystickBall.set('top', joystickBackground.top - joystickBalMoveDistance);
    }
    if (joystickBall.left > joystickBackground.left + joystickBalMoveDistance) {
        joystickBall.set('left', joystickBackground.left + joystickBalMoveDistance);
    }
    if (joystickBall.left < joystickBackground.left - joystickBalMoveDistance) {
        joystickBall.set('left', joystickBackground.left - joystickBalMoveDistance);
    }

    joystickBallDistX = (joystickBall.left - joystickBackground.left) * joystickFactor;
    joystickBallDistY = (joystickBall.top - joystickBackground.top) * joystickFactor;

    if (Math.abs(joystickBallDistX) < 1.5){
        joystickBallDistX = 0
    }

    if (Math.abs(joystickBallDistY) < 1.5){
        joystickBallDistY = 0
    }
})


joystickBall.on('mouseup', function () {
    if(mouseDownOnJoystickBall !== -1){
        clearInterval(mouseDownOnJoystickBall);
        mouseDownOnJoystickBall = -1;
    }
    joystickBall.set('top', joystickBackground.top);
    joystickBall.set('left', joystickBackground.left)
    joystickBall.setCoords()
    toolChange('grab');
})
canvas_side_bar_perm.add(joystickBall);

let buttonDistHorizontal = 3.6

if (showSaveOption == "1"){
    buttonDistHorizontal += 1.2
}

let buttonDistHorizontalHelp = buttonDistHorizontal

let help;
fabric.Image.fromURL('button_icons/help.png', function(img) {
    help = img.set({
        left: 360 * screenFactor - 2 * buttondist - buttonDistHorizontalHelp * 136 * buttonfactor,
        top: 70 * screenFactor - buttondist/2,
        opacity: 1,
        originX: "center",
        originY: "bottom",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"
    });

    help.buttonType = "help"

    help.on('mousedown', function (o) {
        help.set('shadow', new fabric.Shadow(shadowOn));
    });
    help.on('mouseout', function (o) {
        help.set('shadow', new fabric.Shadow(shadowOff));
    });

    help.on('mouseup', function (o) {
        help.set('shadow', new fabric.Shadow(shadowOff));
        window.open(help_language, '_blank');
        canvas_side_tools_right.renderAll();
        buttonPressedForExercise(this)
    });

    /*
    help.on('mouseup', function (o) {
        help.set('shadow', new fabric.Shadow(shadowOff));
        addInstructionalOverlay(true);
        exitHelp.opacity = 1.0;
        canvas_side_tools_right.renderAll();
    });
    */
    canvas_side_tools_right.add(help);

    addButtonTextRight(help)
});

buttonDistHorizontal -= 1.2

let buttonDistHorizontalZoomReset = buttonDistHorizontal

let zoomReset;
fabric.Image.fromURL('button_icons/zoomReset.png', function(img) {
    zoomReset = img.set({
        left: 360 * screenFactor - 2 * buttondist - buttonDistHorizontalZoomReset * 136 * buttonfactor,
        top: 70 * screenFactor - buttondist/2,
        opacity: 1,
        originX: "center",
        originY: "bottom",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"
    });

    zoomReset.buttonType = "zoomReset"

    zoomReset.on('mousedown', function (o) {
        zoomReset.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_tools_right.renderAll()
    });
    zoomReset.on('mouseout', function (o) {
        zoomReset.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_tools_right.renderAll()
    });

    zoomReset.on('mouseup', function (o) {
        zoomReset.set('shadow', new fabric.Shadow(shadowOff));
        setZoomPan(startZoom, startViewportTransform_4, startViewportTransform_5)
        canvas_side_tools_right.renderAll()
        buttonPressedForExercise(this)
    });

    canvas_side_tools_right.add(zoomReset);

    addButtonTextRight(zoomReset)

});

function download_image(){
    //let canvasToDownload = document.getElementById("canvas");
    image = canvas.toDataURL("image/png")//.replace("image/png", "image/octet-stream");

    let ajax = new XMLHttpRequest();
    ajax.open("POST", "save-capture.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("image=" + name_picture_result + ";" + canvas.toDataURL("image/png"))

    ajax.onreadystatechange = function (){
        if (this.readyState == 4 && this.status == 200){
            console.log(this.responseText)
        }
    }

    var link = document.createElement('a');
    link.download = name_picture_result.valueOf() + ".png";
    link.href = image;
    link.click();
}



if (showSaveOption == "1"){

    buttonDistHorizontal -= 1.2

    let buttonDistHorizontalSave = buttonDistHorizontal

    let save;
    fabric.Image.fromURL('button_icons/save.png', function(img) {
        save = img.set({
            left: 360 * screenFactor - 2 * buttondist - buttonDistHorizontalSave * 136 * buttonfactor,
            top: 70 * screenFactor - buttondist/2,
            opacity: 1,
            originX: "center",
            originY: "bottom",
            perPixelTargetFind: true,
            objectCaching: false,
            hasBorders: false,
            hasControls: false,
            evented: true,
            selectable: false,
            scaleX: buttonfactor * screenFactor,
            scaleY: buttonfactor * screenFactor,
            hoverCursor: "pointer"
        });

        save.buttonType = "save"

        save.on('mousedown', function (o) {
            save.set('shadow', new fabric.Shadow(shadowOn));
            canvas_side_tools_right.renderAll()
        });
        save.on('mouseout', function (o) {
            save.set('shadow', new fabric.Shadow(shadowOff));
            canvas_side_tools_right.renderAll()
        });

        save.on('mouseup', function (o) {
            save.set('shadow', new fabric.Shadow(shadowOff));
            saveCanvasAsJs(canvas, 'captureObjectProperties.js')
        });


        canvas_side_tools_right.add(save);

        addButtonTextRight(save)
    });
}

buttonDistHorizontal -= 1.2

let buttonDistHorizontalCamera = buttonDistHorizontal

let camera;
fabric.Image.fromURL('button_icons/camera.png', function(img) {
    camera = img.set({

        left: 360 * screenFactor - 2 * buttondist - buttonDistHorizontalCamera * 136 * buttonfactor,
        top: 70 * screenFactor - buttondist/2,
        opacity: 1,
        originX: "center",
        originY: "bottom",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    camera.buttonType = "camera"

    camera.on('mousedown', function (o) {
        camera.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_tools_right.renderAll()
    });
    camera.on('mouseout', function (o) {
        camera.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_tools_right.renderAll()
    });

    camera.on('mouseup', function (o) {
        camera.set('shadow', new fabric.Shadow(shadowOff));
        download_image()
        canvas_side_tools_right.renderAll()
        buttonPressedForExercise(this)

    });

    canvas_side_tools_right.add(camera);

    addButtonTextRight(camera)
});

/*
let userAgent = window.navigator.userAgent.toLowerCase();
let safari = /safari/.test( userAgent );
*/

let isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};






buttonDistHorizontal -= 1.2

let buttonDistHorizontalFullscreen = buttonDistHorizontal


let fullscreen;
fabric.Image.fromURL('button_icons/fullscreen.png', function(img) {
    fullscreen = img.set({
        left: 360 * screenFactor - 2 * buttondist - buttonDistHorizontalFullscreen * 136 * buttonfactor,
        top: 70 * screenFactor - buttondist/2,
        opacity: 1,
        originX: "center",
        originY: "bottom",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    fullscreen.buttonType = "fullscreen"

    fullscreen.on('mousedown', function (o) {
        fullscreen.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_tools_right.renderAll()
    });
    fullscreen.on('mouseout', function (o) {
        fullscreen.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_tools_right.renderAll()
    });

    fullscreen.on('mouseup', function (o) {
        fullscreen.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_tools_right.renderAll()
        buttonPressedForExercise(this)
        /*
        if( safari ) {
            alert('Diese Funktion ist für iOS nicht integriert.\nThis function is not integrated for iOS.')
        }
        */


        if( isMobile.iOS() ) alert('Diese Funktion steht iOS-Nutzern nicht zur Verfügung.\nThis feature is not available to iOS users.');


        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else {
                if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else {
                    if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                }
            }
        } else {
            const _element = document.documentElement;
            if (_element.requestFullscreen) {
                _element.requestFullscreen();
            } else {
                if (_element.mozRequestFullScreen) {
                    _element.mozRequestFullScreen();
                } else {
                    if (_element.webkitRequestFullscreen) {
                        _element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                }
            }
        }

        /*
        let elem = document.getElementById("canvas-overAll");




        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullscreen.opacity = 0;
            exitFullscreen.opacity = 1;

        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen();
                exitFullscreen.opacity = 0;
                fullscreen.opacity = 1;

            }
        }
        */
    });

    canvas_side_tools_right.add(fullscreen);

    addButtonTextRight(fullscreen)
});


let exitFullscreen;
fabric.Image.fromURL('button_icons/exit_fullscreen.png', function(img) {
    exitFullscreen = img.set({
        left: 360 * screenFactor - 2 * buttondist - buttonDistHorizontalFullscreen * 136 * buttonfactor,
        top: 70 * screenFactor - buttondist/2,
        opacity: 0,
        originX: "center",
        originY: "bottom",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
        scaleX: buttonfactor * screenFactor,
        scaleY: buttonfactor * screenFactor,
        hoverCursor: "pointer"});

    exitFullscreen.buttonType = "exitFullscreen"

    exitFullscreen.on('mousedown', function (o) {
        exitFullscreen.set('shadow', new fabric.Shadow(shadowOn));
        canvas_side_tools_right.renderAll()
    });
    exitFullscreen.on('mouseout', function (o) {
        exitFullscreen.set('shadow', new fabric.Shadow(shadowOff));
        canvas_side_tools_right.renderAll()
    });

    exitFullscreen.on('mouseup', function (o) {
        buttonPressedForExercise(this)
        exitFullscreen.set('shadow', new fabric.Shadow(shadowOff));
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else {
                if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else {
                    if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                }
            }
        } else {
            const _element = document.documentElement;
            if (_element.requestFullscreen) {
                _element.requestFullscreen();
            } else {
                if (_element.mozRequestFullScreen) {
                    _element.mozRequestFullScreen();
                } else {
                    if (_element.webkitRequestFullscreen) {
                        _element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                }
            }
        }

        /*
        let elem = document.getElementById("canvas-overAll");




        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            fullscreen.opacity = 0;
            exitFullscreen.opacity = 1;

        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen();
                exitFullscreen.opacity = 0;
                fullscreen.opacity = 1;

            }
        }
        */

    });

    canvas_side_tools_right.add(exitFullscreen);
});

function addInstructionalOverlay(InstructionalOverlayToAdd){
    if (InstructionalOverlayToAdd == true){
        canvas.add(instructional_overlay);

        let zoom = canvas.getZoom();

        let viewpoint_x = fabric.util.invertTransform(canvas.viewportTransform)[4]+(canvas.width/zoom)/2;
        let viewpoint_y = fabric.util.invertTransform(canvas.viewportTransform)[5]+(canvas.height/zoom)/2;

        instructional_overlay.set('left', viewpoint_x);
        instructional_overlay.set('top', viewpoint_y);
        /*
                instructional_overlay.setCoords();
                instructional_overlay.opacity = 0;
                button_dreieck_empty.opacity = 1;
        */
    } else{
        canvas.remove(instructional_overlay);
        /*
         button_dreieck.opacity = 1;
         button_dreieck_empty.opacity = 0;
 */
    }

}
