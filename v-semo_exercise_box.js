let canvas_exercise_box = new fabric.Canvas('canvas_exercise_box',{preserveObjectStacking: true,  backgroundColor : "white"});

canvas_exercise_box.selection = false;
canvas_exercise_box.selection = false;

let currentSlideNumber = 0;
let currentSlide;


if (showExerciseBox == "1"){
    container_exercise_box.style.display = "block";
} else {
    container_exercise_box.style.display = "none";
}



let exerciseText;

let exerciseTextTop = 15

exerciseText = new fabric.Textbox("Text", {
    width: 300,
    opacity: 1,
    fontSize: 16 * screenFactor,
    fontFamily: 'arial',
    fontWeight: 'bold',
    selectable: false,
    originX: 'left',
    originY: 'top',
    left: 10,
    top: exerciseTextTop,
    text: 'text',
    fill: '#575656',
    objectCaching: false,
    hasBorders: false,
    hasControls: false,
    perPixelTargetFind: true,
    hoverCursor: "default"
});
canvas_exercise_box.add(exerciseText);

let backwardForwardPadding = 10

let forward;

forward = new fabric.Triangle({
    width: 30,
    height: 20,
    left: 310,
    top: 175,
    stroke: '#575656',
    strokeWidth: 3,
    fill: 'white',
    angle: 90,
    originX: 'center',
    originY: 'center',
    objectCaching: false,
    hasBorders: false,
    hasControls: false,
    selectable: false,
    perPixelTargetFind: false,
    hoverCursor: "pointer",
    opacity: 1,
    padding: backwardForwardPadding
});

forward.on('mouseup', function (o) {

    /* für ein sehr restriktives Verhalten:
    if (currentSlide.slideCondition !== undefined){
        if (checkSlideCondition()){
            currentSlideNumber += 1;

            showNextSlide();
        }else{
            if (currentSlide.textIfSlideConditionIsNotFulfilled !== undefined) {
                exerciseText.set('text', currentSlide.textIfSlideConditionIsNotFulfilled)
                canvas_exercise_box.renderAll()
            }
        }
    } else{
        currentSlideNumber += 1;

        showNextSlide();
    }
    */

    currentSlideNumber += 1;

    showNextSlide();

    canvas.discardActiveObject().renderAll();

});


canvas_exercise_box.add(forward);

let backward;

backward = new fabric.Triangle({
    width: 30,
    height: 20,
    left: 20,
    top: 175,
    stroke: '#575656',
    strokeWidth: 3,
    fill: 'white',
    angle: -90,
    originX: 'center',
    originY: 'center',
    objectCaching: false,
    hasBorders: false,
    hasControls: false,
    selectable: false,
    perPixelTargetFind: false,
    hoverCursor: "pointer",
    opacity: 0,
    evented: false,
    padding: backwardForwardPadding,

});

backward.on('mouseup', function (o) {

    currentSlideNumber -= 1;

    showNextSlide();

    canvas.discardActiveObject().renderAll();

});

canvas_exercise_box.add(backward);

let canvas_exercise_box_minimized = false;

let minimize

minimize = new fabric.Rect({
    left: 302,
    top: 5,
    fill: 'white',
    stroke: '#575656',
    strokeWidth: 2,
    width: 20,
    height: 4,
    padding: 10,
    objectCaching: false,
    hasBorders: false,
    hasControls: false,
    selectable: false,
    hoverCursor: "pointer",
});

minimize.on('mouseup', function (o) {

    if (canvas_exercise_box_minimized == false){
        canvas_exercise_box.setWidth(34 * scaleRatio);
        canvas_exercise_box.setHeight(15 * scaleRatio);
        canvas_exercise_box_minimized = true;
        minimize.set('left', 6)
        minimize.setCoords()
        console.log(minimize.left)
        canvas_exercise_box.renderAll()
    }else{
        canvas_exercise_box.setWidth(330 * scaleRatio);
        canvas_exercise_box.setHeight(200 * scaleRatio);
        canvas_exercise_box_minimized = false;
        minimize.set('left', 302)
        minimize.setCoords()
    }


});

canvas_exercise_box.add(minimize);

let hookPoints = [
    {x: 6, y: 0},
    {x: 7, y: 1},
    {x: 3, y: 6},
    {x: 0, y: 3},
    {x: 1, y: 2},
    {x: 3, y: 4},
];

let crossPoints = [
    {x: 0, y: 1},
    {x: 3, y: 4},
    {x: 4, y: 3},
    {x: 1, y: 0},
    {x: 4, y: -3},
    {x: 3, y: -4},
    {x: 0, y: -1},
    {x: -3, y: -4},
    {x: -4, y: -3},
    {x: -1, y: 0},
    {x: -4, y: 3},
    {x: -3, y: 4},
];

let listOfCheckBoxesWithText = [];

function drawCheckBoxWithText() {

    let checkBoxRect;

    checkBoxRect = new fabric.Rect({

        left: 0,
        top: 0,
        fill: '',
        width: 22,
        height: 22,
        strokeWidth: 2,
        stroke: '#575656',
        rx: 5,
        ry: 5,
        originX: 'center',
        originY: 'center',
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        selectable: false,
        hoverCursor: "default",
    });

    let checkBoxHook;

    checkBoxHook = new fabric.Polygon(hookPoints, {
        left: 0,
        top: 0,
        fill: 'green',
        scaleX: 2.5,
        scaleY: 2.5,
        originX: 'center',
        originY: 'center',
        opacity: 0,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        selectable: false,
        hoverCursor: "default",
    });

    let checkBoxCross;

    checkBoxCross = new fabric.Polygon(crossPoints, {
        left: 0,
        top: 0,
        fill: 'red',
        scaleX: 2.5,
        scaleY: 2.5,
        originX: 'center',
        originY: 'center',
        opacity: 0,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        selectable: false,
        hoverCursor: "default",
    });

    let checkBoxText;

    checkBoxText = new fabric.Textbox("Text", {
        width: 250,
        opacity: 1,
        fontSize: 16 * screenFactor,
        fontFamily: 'arial',
        fontWeight: 'bold',
        selectable: false,
        originX: 'left',
        originY: 'top',
        left: 20,
        top: -exerciseTextTop,
        text: 'text',
        fill: '#575656',
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        perPixelTargetFind: true,
        hoverCursor: "default"
    });

    let checkBoxWithText = new fabric.Group([checkBoxRect, checkBoxHook, checkBoxCross, checkBoxText], {
        left: 10,
        top: exerciseTextTop + 5 + exerciseText.height,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        //selectable: true,
        originX: 'left',
        originY: 'top',
        hoverCursor: "default",
        lockMovementX: true,
        lockMovementY: true,
    });

    canvas_exercise_box.add(checkBoxWithText);

    return checkBoxWithText


}

let image = 0;

let listOfAnswerBoxesWithText = [];

function drawAnswerBoxWithText(textToSet){
    console.log('gugugu')
    let answerText;

    answerText = new fabric.Textbox("Text", {
        width: 250,
        opacity: 1,
        fontSize: 16 * screenFactor,
        fontFamily: 'arial',
        fontWeight: 'bold',
        selectable: false,
        originX: 'left',
        originY: 'top',
        left: 25,
        top: -exerciseTextTop + 2.5,
        text: textToSet,
        fill: '#575656',
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        perPixelTargetFind: true,
        hoverCursor: "pointer",
        textAlign: "left",
    });


    console.log(answerText.height)


    let answerBox;

    answerBox = new fabric.Rect({

        left: 0,
        top: -exerciseTextTop,
        fill: '',
        width: 275,
        height: answerText.height,
        strokeWidth: 2,
        stroke: '#575656',
        rx: 5,
        ry: 5,
        originX: 'left',
        originY: 'top',
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        selectable: false,
        hoverCursor: "default",
    });

    let answerBoxHook

        answerBoxHook = new fabric.Polygon(hookPoints, {
        left: 12,
        top: -2.5,
        fill: 'green',
        scaleX: 2.5,
        scaleY: 2.5,
        originX: 'center',
        originY: 'center',
        opacity: 0,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        selectable: false,
        hoverCursor: "default",
    });

    let answerBoxCross;

    answerBoxCross = new fabric.Polygon(crossPoints, {
        left: 12,
        top: -2.5,
        fill: 'red',
        scaleX: 2.3,
        scaleY: 2.3,
        originX: 'center',
        originY: 'center',
        opacity: 0,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        selectable: false,
        hoverCursor: "default",
    });

    let answerBoxWithText = new fabric.Group([answerText, answerBox, answerBoxHook, answerBoxCross], {
        left: 20,
        top: exerciseTextTop + 10 + exerciseText.height,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        //selectable: true,
        originX: 'left',
        originY: 'top',
        hoverCursor: "default",
        lockMovementX: true,
        lockMovementY: true,
    });

    canvas_exercise_box.add(answerBoxWithText);

    return answerBoxWithText
}


function addCheckBoxWithText() {

    for (let ii = 0; ii < listOfCheckBoxesWithText.length; ii++) {
        let checkBoxWithTextToRemove = listOfCheckBoxesWithText[ii];
        canvas_exercise_box.remove(checkBoxWithTextToRemove)
    }

    if (currentSlide.checkBoxesWithText !== undefined) {

        forward.set('opacity', 0);
        forward.set('evented', false);

        listOfCheckBoxesWithText = [];

        for (let ii = 0; ii < currentSlide.checkBoxesWithText.length; ii++) {

            checkBoxWithText = drawCheckBoxWithText();

            listOfCheckBoxesWithText.push(checkBoxWithText);

            if (language !== 'english'){
                checkBoxWithText._objects[3].set('text', currentSlide.checkBoxesWithText[ii].text_de);
                //checkBoxWithText.set('height', checkBoxWithText._objects[2].getScaledHeight() + 1)
            } else{
                checkBoxWithText._objects[3].set('text', currentSlide.checkBoxesWithText[ii].text_en);
            }

            if (currentSlide.checkBoxesWithText[ii].type !== undefined){
                checkBoxWithText.type = currentSlide.checkBoxesWithText[ii].type
            }

            if (currentSlide.checkBoxesWithText[ii].condition !== undefined){
                checkBoxWithText.condition = currentSlide.checkBoxesWithText[ii].condition;
                checkBoxWithText.conditionIsFullfilled = false;
            }

            if (currentSlide.checkBoxesWithText[ii].answerIs !== undefined) {
                checkBoxWithText.conditionIsFullfilled = false;
                listOfCheckBoxesWithText[ii].set('hoverCursor', "pointer")
                currentSlide.checkBoxesWithText[ii].answerState = false
                checkBoxWithText.on('mousedown', function () {

                    currentSlide.checkBoxesWithText[ii].answerState = !currentSlide.checkBoxesWithText[ii].answerState

                    if (currentSlide.checkBoxesWithText[ii].answerState == true){
                        if (currentSlide.checkBoxesWithText[ii].answerIs == true){
                            listOfCheckBoxesWithText[ii]._objects[1].set('opacity', 1.0)
                            canvas_exercise_box.renderAll()
                        }else{
                            listOfCheckBoxesWithText[ii]._objects[2].set('opacity', 1.0)
                            canvas_exercise_box.renderAll()
                        }
                        forward.set('opacity', 1)
                        forward.set('evented', true)
                    }else{
                        listOfCheckBoxesWithText[ii]._objects[1].set('opacity', 0.0)
                        listOfCheckBoxesWithText[ii]._objects[2].set('opacity', 0.0)
                        canvas_exercise_box.renderAll()
                    }
                })

            }

            if (ii == 0){
                if (exerciseText.text == ""){

                    checkBoxWithText.set('top', exerciseTextTop)
                }
            }

            if (ii > 0) {

                checkBoxWithText.set('top', listOfCheckBoxesWithText[ii - 1]._objects[3].getScaledHeight() + 1 + listOfCheckBoxesWithText[ii - 1].top + 5)

            }

            checkBoxWithText.setCoords()
        }
    }
}

function addAnswerBoxWithText(){
    for (let ii = 0; ii < listOfAnswerBoxesWithText.length; ii++) {
        let listOfAnswerBoxesWithTextToRemove = listOfAnswerBoxesWithText[ii];
        canvas_exercise_box.remove(listOfAnswerBoxesWithTextToRemove)
    }

    if (currentSlide.answerBoxesWithText !== undefined) {

        forward.set('opacity', 0);
        forward.set('evented', false);

        listOfAnswerBoxesWithText = [];

        for (let ii = 0; ii < currentSlide.answerBoxesWithText.length; ii++) {

            let textToSet

            if (language !== 'english'){
                textToSet = currentSlide.answerBoxesWithText[ii].text_de;
                //checkBoxWithText.set('height', checkBoxWithText._objects[2].getScaledHeight() + 1)
            } else{
                textToSet = currentSlide.answerBoxesWithText[ii].text_en;
            }

            answerBoxWithText = drawAnswerBoxWithText(textToSet);

            listOfAnswerBoxesWithText.push(answerBoxWithText);

            listOfAnswerBoxesWithText[ii]._objects[1].set('height', answerBoxWithText._objects[0].height + 5);

            listOfAnswerBoxesWithText[ii]._objects[1].setCoords()

            listOfAnswerBoxesWithText[ii]._objects[0].bringToFront()

            if (currentSlide.answerBoxesWithText[ii].answerIs !== undefined) {
                listOfAnswerBoxesWithText[ii].answerIs = currentSlide.answerBoxesWithText[ii].answerIs
                listOfAnswerBoxesWithText[ii].conditionIsFullfilled = false;
                listOfAnswerBoxesWithText[ii].set('hoverCursor', "pointer")
                listOfAnswerBoxesWithText[ii].answerState = false


                    listOfAnswerBoxesWithText[ii].on('mouseover', function () {
                        if (listOfAnswerBoxesWithText[ii].answerState !== true) {
                            listOfAnswerBoxesWithText[ii]._objects[0].set('fill', "yellow")
                            canvas_exercise_box.renderAll()
                        }
                    })

                    listOfAnswerBoxesWithText[ii].on('mouseout', function () {
                        if (listOfAnswerBoxesWithText[ii].answerState !== true) {
                            listOfAnswerBoxesWithText[ii]._objects[0].set('fill', "")
                            canvas_exercise_box.renderAll()
                        }
                    })


                listOfAnswerBoxesWithText[ii].on('mouseup', function () {

                        for (let jj = 0; jj < listOfAnswerBoxesWithText.length; jj++) {
                            if (listOfAnswerBoxesWithText[jj].answerState !== true) {
                                listOfAnswerBoxesWithText[jj].answerState = true
                                listOfAnswerBoxesWithText[jj].set('hoverCursor', "default")
                            }
                        }
                    if (this.answerIs == true) {
                        this._objects[0].set('fill', "")
                        this._objects[1].set('opacity', 1)
                        this._objects[3].set('fill', "green")

                    } else {

                        this._objects[0].set('fill', "")
                        this._objects[2].set('opacity', 1)
                        this._objects[3].set('fill', "red")
                        for (let jj = 0; jj < listOfAnswerBoxesWithText.length; jj++) {
                            if (listOfAnswerBoxesWithText[jj].answerIs == true) {
                                listOfAnswerBoxesWithText[jj]._objects[0].set('fill', "")
                                listOfAnswerBoxesWithText[jj]._objects[1].set('opacity', 1)
                                listOfAnswerBoxesWithText[jj]._objects[3].set('fill', "green")
                            }

                        }

                    }
                    forward.set('opacity', 1)
                    forward.set('evented', true)

                    canvas_exercise_box.renderAll()
                })

            }

            if (ii == 0){
                if (exerciseText.text == ""){

                    answerBoxWithText.set('top', exerciseTextTop)
                }
            }

            if (ii > 0) {

                answerBoxWithText.set('top', listOfAnswerBoxesWithText[ii - 1]._objects[0].getScaledHeight() + 1 + listOfAnswerBoxesWithText[ii - 1].top + 10)

            }

            answerBoxWithText.setCoords()
        }
    }
}

function addImage(){

    if (image !== 0){
        canvas_exercise_box.remove(image)
    }

    image = 0;

    let imageTop = exerciseText.height + 25

    if (currentSlide.checkBoxesWithText !== undefined) {

        imageTop += listOfCheckBoxesWithText[currentSlide.checkBoxesWithText.length - 1].top + listOfCheckBoxesWithText[currentSlide.checkBoxesWithText.length - 1]._objects[3].getScaledHeight() - 30

    }

    if (currentSlide.imageToAdd !== undefined) {
        fabric.Image.fromURL(currentSlide.imageToAdd[0], function(img) {
            image = img.set({
                top: imageTop,
                left: currentSlide.imageToAdd[2],
                opacity: 1,
                originX: "left",
                originY: "top",
                objectCaching: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
                selectable: false,
                centeredRotation: false,
                scaleX: currentSlide.imageToAdd[1] ,
                scaleY: currentSlide.imageToAdd[1] ,
                hoverCursor: "default"});



            canvas_exercise_box.add(image)
        })
    }

}


function showNextSlide() {

    currentSlide = slideContent[currentSlideNumber];

    if (turnBackwardOff !== true){
        if (currentSlideNumber == 0){
            backward.opacity = 0;
            backward.set('evented', false);
        }else{
            backward.opacity = 1;
            backward.set('evented', true);
        }
    }



    if (currentSlideNumber === slideContent.length-1){
        forward.opacity = 0;
        forward.set('evented', false);
    }else{
        if (currentSlide.slideCondition !== undefined){
            forward.opacity = 0;
            forward.set('evented', false);
        }else{
            forward.opacity = 1;
            forward.set('evented', true);
        }
    }

    setText();

    addCheckBoxWithText();

    addAnswerBoxWithText()

    addImage();

    setSectorsVisible();

    setSectorsUnvisible();

    setGeodesicsVisible();
    
    setGeodesicsUnvisible();

    setMarksVisible();

    setMarksUnvisible();

    setSectorsToOrigin();

    setSectorsToRingsOnR();

    setTextsVisible();

    setTextsUnvisible();

    deleteChosenGeodesics();

    autoCompleteStartGeodesics();

    autoSetSectorsAlongStartGeodesics();

    sectorsToSnapTogether();

    removeAllLines();

    SetZoomAndPan();

    setLineColor();

    deactivateAllDragPoints()

    canvas.renderAll();

    canvas_exercise_box.renderAll()

}

function setText(){

    if (language !== 'english'){
        if (currentSlide.text_de !== undefined) {
            exerciseText.set('text', currentSlide.text_de)
        }
    } else{
        if (currentSlide.text_de !== undefined) {
            exerciseText.set('text', currentSlide.text_en)
        }
    }

}

function setSectorsVisible(){

    if (currentSlide.sectorsToShow !== undefined){

        let sectorsID;

        for (let ii = 0; ii < currentSlide.sectorsToShow.length; ii++){

            sectorsID = currentSlide.sectorsToShow[ii];

            if (sectors[sectorsID] !== undefined) {

                sectors[sectorsID].trapez.opacity = startOpacity;

                sectors[sectorsID].ID_text.opacity = startOpacity;

                sectors[sectorsID].trapez.bringToFront()

                updateMinions(sectors[sectorsID].trapez)
            }else {console.log('Sector', sectorsID, 'does not exist')}
        }
    }

}

function setSectorsUnvisible(){

    if (currentSlide.sectorsToHide !== undefined){

        let sectorsID;

        for (let ii = 0; ii < currentSlide.sectorsToHide.length; ii++){

            sectorsID = currentSlide.sectorsToHide[ii];

            if (sectors[sectorsID] !== undefined) {

                sectors[sectorsID].trapez.opacity = 0;

                sectors[sectorsID].ID_text.opacity = 0;
            }else {console.log('Sector', sectorsID, 'does not exist')}
        }
    }

}

function setGeodesicsVisible(){

    if (buildStartGeodesics !== "1"){
        return
    }

    if (currentSlide.geodesicsToShow !== undefined){

        let geodesicID;

        for (let ii = 0; ii < currentSlide.geodesicsToShow.length; ii++){

            geodesicID = currentSlide.geodesicsToShow[ii];

            for (let jj = 0; jj < lines[geodesicID].length; jj++){

                if (lines[geodesicID][jj].dragPoint !== undefined){
                    if (buildTicks == "1"){
                        lines[geodesicID][jj].dragPoint.opacity = 0.5
                    }else {
                        lines[geodesicID][jj].dragPoint.opacity = 1;
                    }
                    lines[geodesicID][jj].dragPoint.perPixelTargetFind = false;
                }

                if (lines[geodesicID][jj] !== undefined){
                    lines[geodesicID][jj].opacity = 1;
                }else {console.log('Geodesic', geodesicID, 'does not exist')}

            }
        }
    }

}

function setGeodesicsUnvisible(){

    if (buildStartGeodesics !== "1"){
        return
    }

    if (currentSlide.geodesicsToHide !== undefined){

        let geodesicID;

        for (let ii = 0; ii < currentSlide.geodesicsToHide.length; ii++){

            geodesicID = currentSlide.geodesicsToHide[ii];

            for (let jj = 0; jj < lines[geodesicID].length; jj++){

                if (lines[geodesicID][jj].dragPoint !== undefined){
                    lines[geodesicID][jj].dragPoint.opacity = 0;
                    lines[geodesicID][jj].dragPoint.perPixelTargetFind = true;
                }

                if (lines[geodesicID][jj] !== undefined){
                    lines[geodesicID][jj].opacity = 0;
                }else {console.log('Geodesic', geodesicID, 'does not exist')}

            }
        }
    }

}

function setMarksVisible(){

    if (buildStartMarks !== "1"){
        return
    }

    if (currentSlide.marksToShow !== undefined){

        let markID;

        for (let ii = 0; ii < currentSlide.marksToShow.length; ii++){

            markID = currentSlide.marksToShow[ii];

            if (markPoints[markID] !== undefined){
                markPoints[markID].opacity = 1;
                markPoints[markID].perPixelTargetFind = false;
            }else {console.log('MarkPoint', markID, 'does not exist')}

        }
    }

}

function setMarksUnvisible(){

    if (buildStartMarks !== "1"){
        return
    }

    if (currentSlide.marksToHide !== undefined){

        let markID;

        for (let ii = 0; ii < currentSlide.marksToHide.length; ii++){

            markID = currentSlide.marksToHide[ii];



            if (markPoints[markID] !== undefined){
                markPoints[markID].opacity = 0;
                markPoints[markID].perPixelTargetFind = false;
            }else {console.log('MarkPoint', markID, 'does not exist')}

        }
    }

}

function setTextsVisible(){

    if (buildStartTexts !== "1"){
        return
    }

    if (currentSlide.textsToShow !== undefined){

        let markID;

        for (let ii = 0; ii < currentSlide.textsToShow.length; ii++){

            textID = currentSlide.textsToShow[ii];

            if (texts[textID] !== undefined){
                texts[textID].opacity = 1;
            }else {console.log('Text', textID, 'does not exist')}

        }
    }

}

function setTextsUnvisible(){

    if (buildStartTexts !== "1"){
        return
    }

    if (currentSlide.textsToHide !== undefined){

        let textID;

        for (let ii = 0; ii < currentSlide.textsToHide.length; ii++){

            textID = currentSlide.textsToHide[ii];



            if (texts[textID] !== undefined){
                texts[textID].opacity = 0;
            }else {console.log('Text', textID, 'does not exist')}

        }
    }

}

function autoCompleteStartGeodesics(){

    if (buildStartGeodesics !== "1"){
        return
    }

    if (currentSlide.geodesicsToComplete !== undefined){

        let geodesicID;

        for (let ii = 0; ii < currentSlide.geodesicsToComplete.length; ii++){

            geodesicID = currentSlide.geodesicsToComplete[ii];

            continueGeodesic(geodesicID)
        }
    }

    toolChange('grab')

}

function autoSetSectorsAlongStartGeodesics(){

    if (buildStartGeodesics !== "1"){
        return
    }

    if (currentSlide.geodesicsToAutoSetAlong !== undefined){

        let geodesicID;

        for (let ii = 0; ii < currentSlide.geodesicsToAutoSetAlong.length; ii++){

            geodesicID = currentSlide.geodesicsToAutoSetAlong[ii];

            autoSetSectorsAlongGeodesic(geodesicID)
        }
    }

}

async function sectorsToSnapTogether(){

    if (currentSlide.sectorsToSnapTogether !== undefined){

        let initialSectorID;
        let targetSectorID;

        for (let ii = 0; ii < currentSlide.sectorsToSnapTogether.length; ii++){

            initialSectorID = currentSlide.sectorsToSnapTogether[ii][0];
            targetSectorID = currentSlide.sectorsToSnapTogether[ii][1];

            removeSnapEdges(initialSectorID);
            //removeSnapEdges(targetSectorID);
            await snapInitialSectorToTargetSector(initialSectorID, targetSectorID);

            console.log(sectors[initialSectorID].snapStatus)

            drawSnapEdges(initialSectorID);
            //drawSnapEdges(targetSectorID);


        }

        canvas.renderAll()
    }

}

function SetZoomAndPan(){
    if (currentSlide.setZoomAndPanTo !== undefined) {
        setZoomPan(currentSlide.setZoomAndPanTo[0], currentSlide.setZoomAndPanTo[1], currentSlide.setZoomAndPanTo[2])
    }
}

function setSectorsToRingsOnR(){
    if (currentSlide.sectorsSetToRingsOnR !== undefined) {

        const ringsToSetStart = currentSlide.sectorsSetToRingsOnR.ringsToSetStart
        const ringsToSetEnd = currentSlide.sectorsSetToRingsOnR.ringsToSetEnd
        const numberOfSectorsPerRing = currentSlide.sectorsSetToRingsOnR.numberOfSectorsPerRing
        const numberOfRings = currentSlide.sectorsSetToRingsOnR.numberOfRings

        let r_ring_row = 300
        for (let ii = ringsToSetStart; ii < ringsToSetEnd + 1; ii++){

            for (let jj = 0; jj < numberOfSectorsPerRing; jj++){

                let sector_position_on_ring_x = (r_ring_row) * Math.sin(2*Math.PI/numberOfSectorsPerRing * (jj))
                let sector_position_on_ring_y = (r_ring_row) * Math.cos(2*Math.PI/numberOfSectorsPerRing * (jj))
                let sector_position_on_ring_angle = 360/numberOfSectorsPerRing * jj

                sectors[ii + numberOfRings * jj].trapez.set('left', sector_position_on_ring_x + window.innerWidth / 2)
                sectors[ii + numberOfRings * jj].trapez.set('top', -sector_position_on_ring_y + (window.innerHeight - window.innerHeight * 0.08) / 2)
                sectors[ii + numberOfRings * jj].trapez.set('angle', sector_position_on_ring_angle)
                sectors[ii + numberOfRings * jj].trapez.setCoords()
                updateMinions(sectors[ii + numberOfRings * jj].trapez)

                removeSnapEdges(ii + numberOfRings * jj)
                changeSnapStatus(ii + numberOfRings * jj)
            }

            r_ring_row = r_ring_row + sectors[ii].sector_height + 10

        }



        canvas.renderAll()
    }
}

function setSectorsToOrigin(){

    if (currentSlide.sectorsToSetToOrigin !== undefined) {
        console.log('hier')
        if (currentSlide.sectorsToSetToOrigin) {
            resetSectors()
        }
    }
}

function deactivateAllDragPoints(){
    if (currentSlide.deactivateAllDragPoints !== undefined & currentSlide.deactivateAllDragPoints == true) {
        for (let ii = 0; ii < lines.length; ii++){

            lines[ii][lines[ii].length - 1].dragPoint.opacity = 0
            lines[ii][lines[ii].length - 1].dragPoint.evented = false
        }

        canvas.renderAll()
    }
}

function setLineColor(){
    if (currentSlide.setLineColor !== undefined) {
        line_colors = currentSlide.setLineColor
    }
}

function removeAllLines(){

    if (currentSlide.startToRemoveAllLines !== undefined) {
        if (currentSlide.startToRemoveAllLines == true) {
            for (let ii = 0; ii < lines.length; ii++) {
                for (let jj = 0; jj < lines[ii].length; jj++) {
                    let lineSegment = lines[ii][jj]

                    canvas.remove(lineSegment);
                    delete lineSegment

                    if(lines[ii][lines[ii].length-1].dragPoint!==undefined){
                        canvas.remove(lines[ii][lines[ii].length-1].dragPoint);
                        delete lines[ii][lines[ii].length-1].dragPoint;

                    }
                }
            }

            lines = [];
            history = [];
        }
    }
}

function deleteChosenGeodesics() {
    if (currentSlide.geodesicsToDelete !== undefined) {
        showGeodesicButtons(false)
        for (let ii = 0; ii < currentSlide.geodesicsToDelete.length; ii++) {
            chosenLineGlobalID = currentSlide.geodesicsToDelete[ii]
            deleteWholeGeodesic(currentSlide.geodesicsToDelete[ii])
        }
        chosenLineGlobalID = -1
    }

}

function checkSlideCondition() {

    if (currentSlide.slideCondition !== undefined){

        let conditionIsFulfilled = false;

        for (let ii = 0; ii < currentSlide.slideCondition.length; ii++){

            // Loop for snapped Sectors
            if (currentSlide.slideCondition[ii][0] == 'snappedSectors'){

                let sectorPairIsSnapped = false;

                let firstSectorID = currentSlide.slideCondition[ii][1][0];
                let secondSectorID = currentSlide.slideCondition[ii][1][1];

                for (let jj = 0; jj < 4; jj++){
                    if (sectors[firstSectorID].neighbourhood[jj] == secondSectorID) {

                        if (sectors[firstSectorID].snapStatus[jj] !== 0){
                            sectorPairIsSnapped = true;
                        }
                    }
                }

                if (sectorPairIsSnapped == true){
                    conditionIsFulfilled = true
                }else{
                    conditionIsFulfilled = false
                    break
                }
            }

            if (currentSlide.slideCondition[ii][0] == 'buttonPressed'){

                let buttonToPress = currentSlide.slideCondition[ii][1];

                if (buttonToPress == lastPressedButton){
                    conditionIsFulfilled = true
                }
            }

            if (currentSlide.slideCondition[ii][0] == 'linesTouchMarks') {

                if (chosenLineGlobalID == -1) {
                    return
                }

                let lineTouchesMark = false;

                for (let jj = 1; jj < currentSlide.slideCondition[ii].length; jj++){

                    lineID = currentSlide.slideCondition[ii][jj][0]

                    let markID = currentSlide.slideCondition[ii][jj][1]

                    let lineEndPoint = new fabric.Point(lines[lineID][lines[lineID].length - 1].calcLinePoints().x2, lines[lineID][lines[lineID].length - 1].calcLinePoints().y2)
                    lineEndPoint = fabric.util.transformPoint(lineEndPoint, lines[lineID][lines[lineID].length - 1].calcTransformMatrix());

                    if (lines[lineID][lines[lineID].length - 1].parentSector[0] == markPoints[markID].parentSector[0]) {
                        if (Math.abs(lineEndPoint.x - markPoints[markID].left) < 15 && Math.abs(lineEndPoint.y - markPoints[markID].top) < 15) {
                            lineTouchesMark = true
                        }
                        else{
                            lineTouchesMark = false
                            return
                        }
                    }else{
                        lineTouchesMark = false
                        return
                    }

                }
                console.log(lineTouchesMark)
                if (lineTouchesMark == true){
                    conditionIsFulfilled = true
                }
            }

            if (currentSlide.slideCondition[ii][0] == 'AnyLineTouchsTwoMarks') {

                let mark1ID = currentSlide.slideCondition[ii][1].mark1
                let mark2ID = currentSlide.slideCondition[ii][1].mark2

                let point_1_x = markPoints[mark1ID].left;
                let point_1_y = markPoints[mark1ID].top;

                let point_2_x = markPoints[mark2ID].left;
                let point_2_y = markPoints[mark2ID].top;

                console.log(mark1ID)
                console.log(mark2ID)

                let check_1 = false;
                let check_2 = false;

                for (let jj = 0; jj < lines.length; jj++){

                    for (let kk = 0; kk < lines[jj].length; kk++) {
                        console.log('kk:', kk)
                        let lineStartPoint = new fabric.Point(lines[jj][kk].calcLinePoints().x1, lines[jj][kk].calcLinePoints().y1)
                        lineStartPoint = fabric.util.transformPoint(lineStartPoint, lines[jj][kk].calcTransformMatrix());

                        let direction_x = lines[jj][kk].x2 - lines[jj][kk].x1;
                        let direction_y = lines[jj][kk].y2 - lines[jj][kk].y1;

                        if (lines[jj][kk].parentSector[0] == markPoints[mark1ID].parentSector[0]) {
                            console.log('check 1')
                            if (distancePointStraightLine(point_1_x, point_1_y, lineStartPoint.x, lineStartPoint.y, direction_x, direction_y) < epsilon) {
                                check_1 = true
                            }
                        }

                        if (lines[jj][kk].parentSector[0] == markPoints[mark2ID].parentSector[0]) {
                            console.log('check 2')
                            if (distancePointStraightLine(point_2_x, point_2_y, lineStartPoint.x, lineStartPoint.y, direction_x, direction_y) < epsilon) {
                                check_2 = true
                            }
                        }

                        if (check_1 == true && check_2 == true) {
                            currentSlide.slideCondition[ii].conditionIsFullfilled = true;

                            }

                    }

                }

            }


        }

        if (currentSlide.slideCondition.length >1){
            console.log('Test')
            let allSlideConditions = false
            for (let ii = 0; ii < currentSlide.slideCondition.length; ii++){
                if (currentSlide.slideCondition[ii].conditionIsFullfilled == true){
                    allSlideConditions = true
                }else{
                    allSlideConditions = false
                    break
                }
            }
            if (allSlideConditions == true){
                conditionIsFulfilled = true
            }
        }

        if (conditionIsFulfilled){
            currentSlideNumber += 1;
            showNextSlide();
        }
    }

}

function checkCheckBoxCondition() {

    let AllCheckBoxConditionsAreFulfilled = false;

    if (currentSlide.checkBoxesWithText !== undefined){

        for (let ii = 0; ii < currentSlide.checkBoxesWithText.length; ii++) {

            if (currentSlide.checkBoxesWithText[ii].type !== 'tracker') {
                return
            }

            let currentCheckBoxWithText = listOfCheckBoxesWithText[ii];

            if (currentSlide.checkBoxesWithText[ii].condition[0] == 'snappedSectors') {

                console.log('test')

                let firstSectorID = currentSlide.checkBoxesWithText[ii].condition[1][0];
                let secondSectorID = currentSlide.checkBoxesWithText[ii].condition[1][1];

                console.log(firstSectorID, secondSectorID)

                for (let jj = 0; jj < 4; jj++) {
                    if (sectors[firstSectorID].neighbourhood[jj] == secondSectorID) {

                        if (sectors[firstSectorID].snapStatus[jj] !== 0) {
                            currentCheckBoxWithText.conditionIsFullfilled = true;
                            console.log(currentCheckBoxWithText)
                            currentCheckBoxWithText._objects[1].set('opacity', 1);
                            canvas_exercise_box.renderAll()
                        }
                    }
                }

            }

            if (currentSlide.checkBoxesWithText[ii].condition[0] == 'choseGeodesic'){
                if (chosenLineGlobalID !== -1){
                    currentCheckBoxWithText.conditionIsFullfilled = true;
                    currentCheckBoxWithText._objects[1].set('opacity', 1);
                    canvas_exercise_box.renderAll()
                }
            }

            if (currentSlide.checkBoxesWithText[ii].condition[0] == 'lineTouchesTwoMarks') {

                if (chosenLineGlobalID == -1) {
                    return
                }
                let lineID
                if (currentSlide.checkBoxesWithText[ii].condition[1][0] == 'chosenLineGlobalID') {
                    lineID = chosenLineGlobalID
                } else {
                    lineID = currentSlide.checkBoxesWithText[ii].condition[1][0]
                }

                let mark1ID = currentSlide.checkBoxesWithText[ii].condition[1][1]
                let mark2ID = currentSlide.checkBoxesWithText[ii].condition[1][2]

                let check_1 = false;
                let check_2 = false;

                for (let jj = 0; jj < lines[lineID].length; jj++) {
                    let point_1_x = markPoints[mark1ID].left;
                    let point_1_y = markPoints[mark1ID].top;

                    let point_2_x = markPoints[mark2ID].left;
                    let point_2_y = markPoints[mark2ID].top;

                    let lineStartPoint = new fabric.Point(lines[lineID][jj].calcLinePoints().x1, lines[lineID][jj].calcLinePoints().y1)
                    lineStartPoint = fabric.util.transformPoint(lineStartPoint, lines[lineID][jj].calcTransformMatrix());

                    let direction_x = lines[lineID][jj].x2 - lines[lineID][jj].x1;
                    let direction_y = lines[lineID][jj].y2 - lines[lineID][jj].y1;

                    if (lines[lineID][jj].parentSector[0] == markPoints[mark1ID].parentSector[0]) {
                        console.log('gogogogo')
                        console.log(distancePointStraightLine(point_1_x, point_1_y, lineStartPoint.x, lineStartPoint.y, direction_x, direction_y))
                        if (distancePointStraightLine(point_1_x, point_1_y, lineStartPoint.x, lineStartPoint.y, direction_x, direction_y) < currentSlide.checkBoxesWithText[ii].condition[1][3]) {
                            check_1 = true
                        }
                    }

                    if (lines[lineID][jj].parentSector[0] == markPoints[mark2ID].parentSector[0]) {
                        if (distancePointStraightLine(point_2_x, point_2_y, lineStartPoint.x, lineStartPoint.y, direction_x, direction_y) < currentSlide.checkBoxesWithText[ii].condition[1][3]) {
                            check_2 = true
                        }
                    }

                    if (check_1 == true && check_2 == true) {
                        currentCheckBoxWithText.conditionIsFullfilled = true;
                        currentCheckBoxWithText._objects[1].set('opacity', 1);
                        canvas_exercise_box.renderAll()

                        if (currentSlide.checkBoxesWithText[ii].result !== undefined) {
                            if (currentSlide.checkBoxesWithText[ii].result.type == 'showMarkAndText') {
                                markPoints[currentSlide.checkBoxesWithText[ii].result.mark].set('opacity', 1)
                                texts[currentSlide.checkBoxesWithText[ii].result.text].set('opacity', 1)
                            }
                        }
                    }
                }
            }

            if (currentSlide.checkBoxesWithText[ii].condition[0] == 'lineCrossTwoMarks') {

                if (chosenLineGlobalID == -1) {
                    return
                }
                let lineID
                if (currentSlide.checkBoxesWithText[ii].condition[1][0] == 'chosenLineGlobalID') {
                    lineID = chosenLineGlobalID
                } else {
                    lineID = currentSlide.checkBoxesWithText[ii].condition[1][0]
                }

                let mark1ID = currentSlide.checkBoxesWithText[ii].condition[1][1]
                let mark2ID = currentSlide.checkBoxesWithText[ii].condition[1][2]

                let check_1 = false;
                let check_2 = false;

                for (let jj = 0; jj < lines[lineID].length; jj++) {
                    let point_1_x = markPoints[mark1ID].left;
                    let point_1_y = markPoints[mark1ID].top;

                    let point_2_x = markPoints[mark2ID].left;
                    let point_2_y = markPoints[mark2ID].top;

                    let lineStartPoint = new fabric.Point(lines[lineID][jj].calcLinePoints().x1, lines[lineID][jj].calcLinePoints().y1)
                    lineStartPoint = fabric.util.transformPoint(lineStartPoint, lines[lineID][jj].calcTransformMatrix());

                    let lineEndPoint = new fabric.Point(lines[lineID][jj].calcLinePoints().x2, lines[lineID][jj].calcLinePoints().y2)
                    lineEndPoint = fabric.util.transformPoint(lineEndPoint, lines[lineID][jj].calcTransformMatrix());

                    if (lines[lineID][jj].parentSector[0] == markPoints[mark1ID].parentSector[0]) {
                        if (Math.abs(lineStartPoint.x - point_1_x) < epsilon && Math.abs(lineStartPoint.y - point_1_y) < epsilon || Math.abs(lineEndPoint.x - point_1_x) < epsilon && Math.abs(lineEndPoint.y - point_1_y) < epsilon) {
                            check_1 = true
                        }
                    }

                    if (lines[lineID][lines[lineID].length - 1].parentSector[0] == markPoints[mark2ID].parentSector[0]) {
                        if (Math.abs(lines[lineID][lines[lineID].length - 1].dragPoint.left - point_2_x) < epsilon && Math.abs(lines[lineID][lines[lineID].length - 1].dragPoint.top - point_2_y) < epsilon || Math.abs(lineEndPoint.x - point_2_x) < epsilon && Math.abs(lineEndPoint.y - point_2_y) < epsilon) {
                            check_2 = true
                        }
                    }


                }
                if (check_1 == true && check_2 == true) {
                    currentCheckBoxWithText.conditionIsFullfilled = true;
                    currentCheckBoxWithText._objects[1].set('opacity', 1);
                    canvas_exercise_box.renderAll()

                    if (currentSlide.checkBoxesWithText[ii].result !== undefined) {
                        if (currentSlide.checkBoxesWithText[ii].result.type == 'showMarkAndText') {
                            markPoints[currentSlide.checkBoxesWithText[ii].result.mark].set('opacity', 1)
                            texts[currentSlide.checkBoxesWithText[ii].result.text].set('opacity', 1)
                        }
                    }
                }
            }

            if (currentSlide.checkBoxesWithText[ii].condition[0] == 'lineTouchesOneMark') {

                if (chosenLineGlobalID == -1) {
                    return
                }
                let lineID
                if (currentSlide.checkBoxesWithText[ii].condition[1][0] == 'chosenLineGlobalID') {
                    lineID = chosenLineGlobalID
                } else {
                    lineID = currentSlide.checkBoxesWithText[ii].condition[1][0]
                }

                let mark1ID = currentSlide.checkBoxesWithText[ii].condition[1][1]

                let point_1_x = markPoints[mark1ID].left;
                let point_1_y = markPoints[mark1ID].top;

                let check_1 = false;

                let lineEndPoint = new fabric.Point(lines[lineID][lines[lineID].length - 1].x2, lines[lineID][lines[lineID].length - 1].y2)



                for (let jj = 0; jj < lines[lineID].length; jj++) {
                    if (lines[lineID][jj].parentSector[0] == markPoints[mark1ID].parentSector[0]) {

                        console.log()

                        if (Math.abs(lineEndPoint.x - point_1_x) < 5 && Math.abs(lineEndPoint.y - point_1_y) < 5) {
                            check_1 = true
                        }
                    }
                }
                console.log(check_1)

                console.log(mark1ID, lineEndPoint)

                if (check_1 == true) {
                    currentCheckBoxWithText.conditionIsFullfilled = true;
                    currentCheckBoxWithText._objects[1].set('opacity', 1);
                    canvas_exercise_box.renderAll()

                    if (currentSlide.checkBoxesWithText[ii].result !== undefined) {
                        if (currentSlide.checkBoxesWithText[ii].result.type == 'showMarkAndText') {
                            markPoints[currentSlide.checkBoxesWithText[ii].result.mark].set('opacity', 1)
                            texts[currentSlide.checkBoxesWithText[ii].result.text].set('opacity', 1)
                        }
                    }
                }
            }
        }

        for (let ii = 0; ii < currentSlide.checkBoxesWithText.length; ii++){
            let currentCheckBoxWithText = listOfCheckBoxesWithText[ii];
            if (currentCheckBoxWithText.conditionIsFullfilled == true){
                AllCheckBoxConditionsAreFulfilled = true
            }else{
                AllCheckBoxConditionsAreFulfilled = false;
                break
            }
        }

        if (AllCheckBoxConditionsAreFulfilled){
            forward.opacity = 1;
            forward.set('evented', true);
        }

    }

    canvas_exercise_box.renderAll()

}

if (showExerciseBox == "1"){

    window.onload = function () {

        showNextSlide()

    }
}



