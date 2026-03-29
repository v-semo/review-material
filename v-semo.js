/* Copyright (c) 2024 XXXX XXXXXXXXXXX
   Permission is hereby granted, free of charge,
   to any person obtaining a copy of this software
   and associated documentation files (the “Software”),
   to deal in the Software without restriction,
   including without limitation the rights to use,
   copy, modify, merge, publish, distribute, sublicense,
   and/or sell copies of the Software,
   and to permit persons to whom the Software
   is furnished to do so, subject to the following conditions:


    The above copyright notice and this permission notice
    * shall be included in all copies or substantial
    * portions of the Software.

    THE SOFTWARE IS PROVIDED “AS IS”,
    WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
    ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
    OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */


let validPinch = false;
fabric.HammerCanvas = fabric.util.createClass(fabric.Canvas, /** @lends fabric.Canvas.prototype */ {

    // Disable touch scroll when an element is selected
    selectionCreatedHandler: function (e) {
        fabric.util.setStyle(this.wrapperEl, {
            'touch-action': 'none'
        });
        fabric.util.setStyle(this.upperCanvasEl, {
            'touch-action': 'none'
        });
        fabric.util.setStyle(this.lowerCanvasEl, {
            'touch-action': 'none'
        })
    },
    // Re-Enable touch scroll when nothing is selected
    selectionClearedHandler: function (e) {
        fabric.util.setStyle(this.wrapperEl, {
            'touch-action': 'manipulation'
        });
        fabric.util.setStyle(this.upperCanvasEl, {
            'touch-action': 'manipulation'
        });
        fabric.util.setStyle(this.lowerCanvasEl, {
            'touch-action': 'manipulation'
        })
    },
    /**
     * Be sure that touchstart reacts to multitouch on hammerjs
     * @param e
     * @private
     */
    _onMouseDown: function (e) {
        if (e.type === 'touchstart') {
            // Do not allow grouping in mobile mode
            this.selection = false;
            fabric.util.removeListener(this.upperCanvasEl, 'mousedown', this._onMouseDown);
            if (this.currentTouchStart) {
                // Second event, stop this as this is multitouch
                clearTimeout(this.currentTouchStart);
                this.currentTouchStart = null
            } else {
                // First touch start, wait 100 ms then call
                this.currentTouchStart = setTimeout(() => {
                    this.currentTouchStart = null;
                    this.callSuper('_onMouseDown', e)
                }, 75)
            }
        } else {
            this.callSuper('_onMouseDown', e)
        }
    },

    /**
     * mouseup delay has to be set as well
     * @param e
     * @private
     */
    _onMouseUp: function (e) {
        if (e.type === 'touchend') {
            setTimeout(() => {
                this.callSuper('_onMouseUp', e)
            }, 75)
        } else {
            this.callSuper('_onMouseUp', e)
        }
    },

    _onMouseMove: function (e) {
        this.getActiveObject() && e.preventDefault && e.preventDefault();
        this.__onMouseMove(e)
    },

    /**
     * add hammerjs event handlers as well
     * @param functor
     * @param eventjsFunctor
     */
    addOrRemove: function (functor, eventjsFunctor) {
        this.callSuper('addOrRemove', functor, eventjsFunctor);
        var mc = new Hammer.Manager(this.wrapperEl);

        // create a recognizer
        var Pinch = new Hammer.Pinch();
        var Rotate = new Hammer.Rotate();
        Pinch.recognizeWith(Rotate);
        //Rotate.dropRecognizeWith(Pinch)
        // add the recognizer

        mc.add(Rotate);
        mc.add(Pinch);
        // subscribe to events
        let zoomStartScale;
        let zoomCenter;

        mc.on('pinchstart', function(ev){
            //console.log('pinchstart')
            //console.log(ev)

        });

        mc.on('pinchin', function(ev){
            //console.log('pinchin')
            //console.log(ev)

        });

        mc.on('pinchout', function(ev){
            //console.log('pinchout')
            //console.log(ev)
        });

        mc.on('pinchend', function(ev) {
            //console.log('pinchend')
            //console.log(ev)
        });

        mc.on('rotatestart', function (ev) {
            //console.log('rotatestart')
            //console.log(ev)
        });

        mc.on('rotate', function(ev){
            //console.log('rotating')
            //console.log(ev)
        });

        mc.on('rotateend', function(ev) {
            //console.log('rotateend')
            //console.log(ev)
        });

        let AngleStart;
        let scaleStart;
        mc.on('pinchstart', function (ev) {
            validPinch = true;
            AngleStart = ev.rotation;
            scaleStart = ev.scale;
            zoomCenter = ev.center;
            zoomStartScale = canvas.getZoom();

            //canvas.discardActiveObject()
            if (canvas.getActiveObject() !== undefined){
                if(canvas.getActiveObject() !== null){
                    if (canvas.getActiveObject().parent !== undefined){
                        isItTimeToSnap(sectors[canvas.getActiveObject().parent.ID].trapez);
                        if (sectorToSnap > -1){
                            snapInitialSectorToTargetSector(canvas.getActiveObject().parent.ID, sectorToSnap)
                        }

                        drawSnapEdges(canvas.getActiveObject().parent.ID)
                    }
                }

            }
            //canvas.discardActiveObject()
            //canvas.renderAll()

            for (let ii = 0; ii < sectors.length; ii++){
                sectors[ii].trapez.selectable = false;
                sectors[ii].trapez.lockMovementX = true;
                sectors[ii].trapez.lockMovementY = true;
                sectors[ii].trapez.lockRotation = true;
            }

            geodreieck.selectable = false;
            geodreieck.lockMovementX = true;
            geodreieck.lockMovementY = true;
            geodreieck.lockRotation = true;



        });

        let superValidPinch = false;

        mc.on('pinchin', function (ev) {
            if (validPinch) {
                //console.log(Math.abs(AngleStart - ev.rotation))
                //console.log(Math.abs(scaleStart - ev.scale))

            if (Math.abs(scaleStart - ev.scale) > 0.0005  || superValidPinch){
                superValidPinch = true;

                let delta = zoomStartScale * ev.scale;
                canvas.zoomToPoint(zoomCenter, delta)
            }

            }
        });

        mc.on('pinchout', function (ev) {
            if (validPinch) {
                //console.log(Math.abs(AngleStart - ev.rotation))
                //console.log(Math.abs(scaleStart - ev.scale))

                if (Math.abs(scaleStart - ev.scale) > 0.0005 || superValidPinch){
                    superValidPinch = true;
                    canvas.discardActiveObject();
                    let delta = zoomStartScale * ev.scale;
                    canvas.zoomToPoint(zoomCenter, delta)
                }
            }
        });

        mc.on('pinchend', function (ev) {

            superValidPinch = false;

            setTimeout(function(){
                validPinch = false;
                for (let ii = 0; ii < sectors.length; ii++){
                    sectors[ii].trapez.selectable = true;
                    sectors[ii].trapez.lockMovementX = false;
                    sectors[ii].trapez.lockMovementY = false;
                    sectors[ii].trapez.lockRotation = false;
                }
                geodreieck.selectable = true;
                geodreieck.lockMovementX = false;
                geodreieck.lockMovementY = false;
                geodreieck.lockRotation = false;
            }, 300);

            canvas.renderAll()
        });

        mc.on('rotatestart', (e) => {
            this.initialRotateTheta = e.rotation - (this.getActiveObject() ? this.getActiveObject().angle : 0);
            this.initialRotateAngle = this.getActiveObject() ? this.getActiveObject().angle : 0
        });


        mc.on('rotate', (e) => {

            if (turnLorentzTransformOn == 1){
                return
            }

            let object = this.getActiveObject();
            if (object != undefined){
                if (object.parent != undefined){
                    object.lockMovementX = true;
                    object.lockMovementY = true;
                }
            }


            if (object) {
                let rotationTheta = e.rotation - this.initialRotateTheta - this.initialRotateAngle;
                if (Math.abs(scaleStart - e.scale) > 0.35){
                    validPinch = true;
                    return
                }
                if (Math.abs(rotationTheta) > 1) {

                    validPinch = false;
                    let newRotationAngle = e.rotation - this.initialRotateTheta;
                    object.rotate(newRotationAngle);
                    if (object.parent != undefined) {
                        removeSnapEdges(object.parent.ID);
                        isItTimeToSnap(object);
                        updateMinions(object);
                        removeDeficitAngleVisualize();
                    }
                }
                this.requestRenderAll()
            }
        });
        mc.on('rotateend', (e) => {
            let object = this.getActiveObject();
            if (object != undefined){
                if (object.parent != undefined){
                    object.lockMovementX = true;
                    object.lockMovementY = true;
                }
            }
        })

    }
})

let canvas = new fabric.HammerCanvas('canvas',{preserveObjectStacking: true, backgroundColor: '#8ab8d9'});

//Hintergrundbild einfügen
//canvas.setBackgroundImage('background_image.png', canvas.renderAll.bind(canvas));

canvas.rotationCursor = 'col-resize';

//Ausschalten der Gruppenfunktion per "Lasso"
//updateMinions ist für Gruppen implementiert, es fehlt noch die snappingToChosen-Funktion für Gruppen
canvas.selection = false;

let shiftPressed = false;

canvas.on('selection:created', function(obj){

    obj.target.setControlsVisibility({
        //    mtr: false,
        tl: false,
        mt: false,
        tr: false,

        mr: false,
        ml: false,

        bl: false,
        mb: false,
        br: false,
    });

    obj.target.lockScalingX = true;
    obj.target.lockScalingY = true;
    obj.target.on('moving', function(){
        if ( this._objects == undefined){return}
        this._objects.forEach(function(elem){
            if(elem.type === 'polygon') updateMinions(elem)
        });
    });
    obj.target.on('rotating', function(){
        if ( this._objects == undefined){return}
        this._objects.forEach(function(elem){
            if(elem.type === 'polygon')updateMinions(elem)
        });
    });
    obj.target.on('modified', function(){
        if ( this._objects == undefined){return}
        this._objects.forEach(function(elem){
            if(elem.type === 'polygon')updateMinions(elem)
        });
    });
});

//updateMinions auf Gruppen erweitert (in dieser Version ausgeschaltet)
canvas.on('selection:updated', function(obj){

    obj.target.setControlsVisibility({
        //    mtr: false,
        tl: false,
        mt: false,
        tr: false,

        mr: false,
        ml: false,

        bl: false,
        mb: false,
        br: false,
    });
    obj.target.lockScalingX = true;
    obj.target.lockScalingY = true;
    obj.target.on('moving', function(){
        if ( this._objects == undefined){return}
        this._objects.forEach(function(elem){
            if(elem.type === 'polygon') updateMinions(elem)
        });
    });
    obj.target.on('rotating', function(){
        if ( this._objects == undefined){return}
        this._objects.forEach(function(elem){
            if(elem.type === 'polygon')updateMinions(elem)
        });
    });
    obj.target.on('modified', function(){
        if ( this._objects == undefined){return}
        this._objects.forEach(function(elem){
            if(elem.type === 'polygon')updateMinions(elem)
        });
    });
});




let startAtMarkPoint = -1;
let pointer;
let snap_radius_end_to_start = 10;
let actualSector;

/* Prüfen:  - der Richtung einer verlängerten Geodäte;
            - ob Linien auf dem Hintergrund statt einem Sektor verlaufen -> visuelles Signal (rote Linie)
  */


canvas.on('mouse:move', function (o) {

    if (selectedTool !== 'paint' && selectedTool !== 'grab') return;

    let color;
    pointer = canvas.getPointer(o.e);
    //Abstandsprüfung zum Geodätenende -> Pfeil mit Richtung setzen


    if(isVectorPointDragged === true) {

        let vectorPoint = vectors[canvas.getActiveObject().ID][0];
        let vectorLine = vectors[canvas.getActiveObject().ID][1];
        let vectorHead = vectors[canvas.getActiveObject().ID][2];
        let vectorPointParentSector = vectorPoint.parentSector[0];

        if (vectors[vectorPoint.ID][1].relationship) {
            updateMinionsPosition(vectorPoint, vectors[vectorPoint.ID][1]);
        }
        if (vectors[vectorPoint.ID][2].relationship) {
            updateMinionsPosition(vectorPoint, vectors[vectorPoint.ID][2]);
        }
        if (vectors[vectorPoint.ID][0].orientationLine.relationship) {
            updateMinionsPosition(vectors[vectorPoint.ID][0], vectors[vectorPoint.ID][0].orientationLine);
        }

        vectorPoint.setCoords()
        vectorLine.setCoords()
        vectorHead.setCoords()

        let closestEdgeOfPointParameters = getClosestEdgeOfPointParameters(pointer, vectorPointParentSector);

        let inboundParameter = epsilon*5;
        let inboundPoints = [];
        let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[closestEdgeOfPointParameters.pointSectorID].trapez);

        for (let ii = 0; ii < 4; ii++) {
            let inboundPoint = new fabric.Point(trapezPointsAsGlobalCoords[ii].x + (trapezPointsAsGlobalCoords[(ii + 2) % 4].x - trapezPointsAsGlobalCoords[ii].x) * inboundParameter,
                trapezPointsAsGlobalCoords[ii].y + (trapezPointsAsGlobalCoords[(ii + 2) % 4].y - trapezPointsAsGlobalCoords[ii].y) * inboundParameter);
            inboundPoints.splice(ii, 1, inboundPoint);
        }

        if(getParentSectorOfPoint(pointer) !== undefined && (sectors[vectorPointParentSector].neighbourhood.includes(getParentSectorOfPoint(pointer)) || getParentSectorOfPoint(pointer) === vectorPointParentSector)) {
            if(closestEdgeOfPointParameters.minDistance >= epsilon || closestEdgeOfPointParameters.snapStatusOfClosestEdge !== 0) {
                if(getParentSectorOfPoint(new fabric.Point(vectorPoint.left, vectorPoint.top)) !== undefined) {
                    vectorPoint.set({
                        left: pointer.x,
                        top: pointer.y
                    });
                }
            }
        }

        for (let ii = 0; ii < vectorDuplicates.length; ii++) {
            if(distance(pointer, new fabric.Point(vectorDuplicates[ii][0].left, vectorDuplicates[ii][0].top)) < 10) {
                vectorPoint.set({
                    left: vectorDuplicates[ii][0].left,
                    top: vectorDuplicates[ii][0].top
                });
            }
            vectorPoint.setCoords();
            updateMinionsPosition(vectorPoint, vectorLine);
            updateMinionsPosition(vectorPoint, vectorHead);
        }

        for (let ii = 0; ii < vectors.length; ii++) {
            if(distance(pointer, new fabric.Point(vectors[ii][0].left, vectors[ii][0].top)) < 10) {
                vectorPoint.set({
                    left: vectors[ii][0].left,
                    top: vectors[ii][0].top
                });
            }
            vectorPoint.setCoords();
            updateMinionsPosition(vectorPoint, vectorLine);
            updateMinionsPosition(vectorPoint, vectorHead);
        }

            if (closestEdgeOfPointParameters.minDistance < epsilon) {
                let edgeVectorX = inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].x - inboundPoints[closestEdgeOfPointParameters.closestEdge].x;
                let edgeVectorY = inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].y - inboundPoints[closestEdgeOfPointParameters.closestEdge].y;
                let mouseVectorX = pointer.x - inboundPoints[closestEdgeOfPointParameters.closestEdge].x;
                let mouseVectorY = pointer.y - inboundPoints[closestEdgeOfPointParameters.closestEdge].y;
                let edgeVectorLength = Math.sqrt(Math.pow(edgeVectorX, 2) + Math.pow(edgeVectorY, 2));
                let mouseVectorLength = Math.sqrt(Math.pow(mouseVectorX, 2) + Math.pow(mouseVectorY, 2));
                let dotProduct = edgeVectorX * mouseVectorX + edgeVectorY * mouseVectorY;
                let alpha = Math.acos(dotProduct / (edgeVectorLength * mouseVectorLength));
                let lambda = mouseVectorLength * Math.cos(alpha) / edgeVectorLength;

                if(closestEdgeOfPointParameters.snapStatusOfClosestEdge !== 1) {

                    if (lambda <= 1 && lambda >= 0) {
                        vectorPoint.set({
                            left: inboundPoints[closestEdgeOfPointParameters.closestEdge].x + edgeVectorX * lambda,
                            top: inboundPoints[closestEdgeOfPointParameters.closestEdge].y + edgeVectorY * lambda
                        });
                    } else if (lambda < 0) {
                        if(sectors[closestEdgeOfPointParameters.pointSectorID].snapStatus[(closestEdgeOfPointParameters.closestEdge + 3) % 4] !== 0) {
                            vectorPointParentSector = sectors[closestEdgeOfPointParameters.pointSectorID].neighbourhood[(closestEdgeOfPointParameters.closestEdge + 3) % 4];
                            closestEdgeOfPointParameters = getClosestEdgeOfPointParameters(pointer, vectorPointParentSector);
                            trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[vectorPointParentSector].trapez);
                            for (let ii = 0; ii < 4; ii++) {
                                let inboundPoint = new fabric.Point(trapezPointsAsGlobalCoords[ii].x + (trapezPointsAsGlobalCoords[(ii + 2) % 4].x - trapezPointsAsGlobalCoords[ii].x) * inboundParameter,
                                    trapezPointsAsGlobalCoords[ii].y + (trapezPointsAsGlobalCoords[(ii + 2) % 4].y - trapezPointsAsGlobalCoords[ii].y) * inboundParameter);
                                inboundPoints.splice(ii, 1, inboundPoint);
                            }
                            edgeVectorX = inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].x - inboundPoints[closestEdgeOfPointParameters.closestEdge].x;
                            edgeVectorY = inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].y - inboundPoints[closestEdgeOfPointParameters.closestEdge].y;
                            mouseVectorX = pointer.x - inboundPoints[closestEdgeOfPointParameters.closestEdge].x;
                            mouseVectorY = pointer.y - inboundPoints[closestEdgeOfPointParameters.closestEdge].y;
                            edgeVectorLength = Math.sqrt(Math.pow(edgeVectorX, 2) + Math.pow(edgeVectorY, 2));
                            mouseVectorLength = Math.sqrt(Math.pow(mouseVectorX, 2) + Math.pow(mouseVectorY, 2));
                            dotProduct = edgeVectorX * mouseVectorX + edgeVectorY * mouseVectorY;
                            alpha = Math.acos(dotProduct / (edgeVectorLength * mouseVectorLength));
                            lambda = mouseVectorLength * Math.cos(alpha) / edgeVectorLength;
                            vectorPoint.set({
                               left: inboundPoints[closestEdgeOfPointParameters.closestEdge].x + edgeVectorX * lambda,
                               top:  inboundPoints[closestEdgeOfPointParameters.closestEdge].y + edgeVectorY * lambda
                            });
                        } else {
                            vectorPoint.set({
                                left: inboundPoints[closestEdgeOfPointParameters.closestEdge].x,
                                top: inboundPoints[closestEdgeOfPointParameters.closestEdge].y
                            });
                        }

                    } else if(lambda > 1) {
                        if(sectors[closestEdgeOfPointParameters.pointSectorID].snapStatus[(closestEdgeOfPointParameters.closestEdge + 1) % 4] !== 0) {
                            vectorPointParentSector = sectors[closestEdgeOfPointParameters.pointSectorID].neighbourhood[(closestEdgeOfPointParameters.closestEdge + 1) % 4];
                            closestEdgeOfPointParameters = getClosestEdgeOfPointParameters(pointer, vectorPointParentSector);
                            trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[vectorPointParentSector].trapez);
                            for (let ii = 0; ii < 4; ii++) {
                                let inboundPoint = new fabric.Point(trapezPointsAsGlobalCoords[ii].x + (trapezPointsAsGlobalCoords[(ii + 2) % 4].x - trapezPointsAsGlobalCoords[ii].x) * inboundParameter,
                                    trapezPointsAsGlobalCoords[ii].y + (trapezPointsAsGlobalCoords[(ii + 2) % 4].y - trapezPointsAsGlobalCoords[ii].y) * inboundParameter);
                                inboundPoints.splice(ii, 1, inboundPoint);
                            }
                            edgeVectorX = inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].x - inboundPoints[closestEdgeOfPointParameters.closestEdge].x;
                            edgeVectorY = inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].y - inboundPoints[closestEdgeOfPointParameters.closestEdge].y;
                            mouseVectorX = pointer.x - inboundPoints[closestEdgeOfPointParameters.closestEdge].x;
                            mouseVectorY = pointer.y - inboundPoints[closestEdgeOfPointParameters.closestEdge].y;
                            edgeVectorLength = Math.sqrt(Math.pow(edgeVectorX, 2) + Math.pow(edgeVectorY, 2));
                            mouseVectorLength = Math.sqrt(Math.pow(mouseVectorX, 2) + Math.pow(mouseVectorY, 2));
                            dotProduct = edgeVectorX * mouseVectorX + edgeVectorY * mouseVectorY;
                            alpha = Math.acos(dotProduct / (edgeVectorLength * mouseVectorLength));
                            lambda = mouseVectorLength * Math.cos(alpha) / edgeVectorLength;
                            vectorPoint.set({
                                left: inboundPoints[closestEdgeOfPointParameters.closestEdge].x + edgeVectorX * lambda,
                                top: inboundPoints[closestEdgeOfPointParameters.closestEdge].y + edgeVectorY * lambda
                            });
                        } else {
                            vectorPoint.set({
                                left: inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].x,
                                top: inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].y
                            });
                        }
                    }
                }
            }

        /*if (closestEdgeOfPointParameters.minDistance < 0.01) {
            let edgeVectorX = inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].x - inboundPoints[closestEdgeOfPointParameters.closestEdge].x;
            let edgeVectorY = inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].y - inboundPoints[closestEdgeOfPointParameters.closestEdge].y;
            let mouseVectorX = pointer.x - inboundPoints[closestEdgeOfPointParameters.closestEdge].x;
            let mouseVectorY = pointer.y - inboundPoints[closestEdgeOfPointParameters.closestEdge].y;
            let edgeVectorLength = Math.sqrt(Math.pow(edgeVectorX, 2) + Math.pow(edgeVectorY, 2));
            let mouseVectorLength = Math.sqrt(Math.pow(mouseVectorX, 2) + Math.pow(mouseVectorY, 2));
            let dotProduct = edgeVectorX * mouseVectorX + edgeVectorY * mouseVectorY;
            let alpha = Math.acos(dotProduct / (edgeVectorLength * mouseVectorLength));
            let beta = Math.atan2(mouseVectorY, mouseVectorX);
            let gamma = Math.PI / 2 - alpha - beta;
            let lambda;
            if(Math.abs(toDegree(gamma)) > 85 && Math.abs(toDegree(gamma)) < 95) {
                lambda = Math.abs(mouseVectorY) / Math.tan(alpha);
            } else {
                lambda = mouseVectorY / Math.cos(gamma);
            }

            if(closestEdgeOfPointParameters.snapStatusOfClosestEdge !== 1) {

                if (lambda <= edgeVectorLength && lambda >= 0) {
                    vectorPoint.set({
                        left: inboundPoints[closestEdgeOfPointParameters.closestEdge].x + edgeVectorX * (lambda / edgeVectorLength),
                        top: inboundPoints[closestEdgeOfPointParameters.closestEdge].y + edgeVectorY * (lambda / edgeVectorLength)
                    });
                } else if (lambda < 0) {
                    if(sectors[closestEdgeOfPointParameters.pointSectorID].snapStatus[(closestEdgeOfPointParameters.closestEdge + 3) % 4] !== 0) {
                        closestEdgeOfPointParameters.pointSectorID = sectors[closestEdgeOfPointParameters.pointSectorID].neighbourhood[(closestEdgeOfPointParameters.closestEdge + 3) % 4];
                        vectorPoint.set({
                            left: inboundPoints[closestEdgeOfPointParameters.closestEdge].x + edgeVectorX * (lambda / edgeVectorLength),
                            top:  inboundPoints[closestEdgeOfPointParameters.closestEdge].y + edgeVectorY * (lambda / edgeVectorLength)
                        });
                    } else {
                        vectorPoint.set({
                            left: inboundPoints[closestEdgeOfPointParameters.closestEdge].x,
                            top: inboundPoints[closestEdgeOfPointParameters.closestEdge].y
                        });
                    }

                } else {
                    if(sectors[closestEdgeOfPointParameters.pointSectorID].snapStatus[(closestEdgeOfPointParameters.closestEdge + 1) % 4] !== 0) {
                        closestEdgeOfPointParameters.pointSectorID = sectors[closestEdgeOfPointParameters.pointSectorID].neighbourhood[(closestEdgeOfPointParameters.closestEdge + 1) % 4];
                        vectorPoint.set({
                            left: inboundPoints[closestEdgeOfPointParameters.closestEdge].x + edgeVectorX * (lambda / edgeVectorLength),
                            top: inboundPoints[closestEdgeOfPointParameters.closestEdge].y + edgeVectorY * (lambda / edgeVectorLength)
                        });
                    } else {
                        vectorPoint.set({
                            left: inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].x,
                            top: inboundPoints[(closestEdgeOfPointParameters.closestEdge + 1) % 4].y
                        });
                    }
                }
            }
        } */

        vectorPoint.setCoords();
        updateMinionsPosition(vectorPoint, vectors[vectorPoint.ID][1]);
        updateMinionsPosition(vectorPoint, vectors[vectorPoint.ID][2]);
        canvas.renderAll();

        for (let ii = 0; ii < vectors.length; ii++) {
            let vectorPoint = vectors[ii][0];
            let vectorPointPosition = new fabric.Point(vectorPoint.left, vectorPoint.top);
            let vectorPointParentID = getParentSectorOfPoint(vectorPointPosition);
            console.log(vectorPointParentID);
            if (vectorPointParentID !== undefined) {
                if(sectors[vectorPointParentID].vectors.includes(vectors[vectorPoint.ID]) !== true) {
                    sectors[vectorPoint.parentSector[0]].vectors.splice(vectorPoint.parentSector[1], 1);
                    sectors[vectorPointParentID].vectors.push(vectors[vectorPoint.ID]);
                    vectorPoint.parentSector = [vectorPointParentID, sectors[vectorPointParentID].vectors.length];
                    vectorPoint.relationship = getRelationship(vectorPoint, vectorPoint.parentSector[0]);
                } else {
                    vectorPoint.parentSector = [vectorPointParentID, sectors[vectorPointParentID].vectors.indexOf(vectors[ii])];
                    vectorPoint.relationship = getRelationship(vectorPoint, vectorPoint.parentSector[0]);
                }
            }
        }

        canvas.bringToFront(vectorPoint);
    }

    if (isLineStarted != true)  {
        return;
    }

    if (lineContinueAt !== -1) {
        color = lines[lineContinueAt][0].stroke;
    } else {
        color = line_colors[lines.length % line_colors.length];
    }


    //Richtung der verlängerten Geodäte annehmen

    pointer = canvas.getPointer(o.e);

    if (lineTypeToDraw == 'geodesic') {

        if (geodesicsLightLike == '1') {

            if ((pointer.x - line.x1) > 0 & (pointer.y - line.y1) < 0) {
                console.log('1')
                line.set({x2: pointer.x, y2: (pointer.x - line.x1) * Math.tan(toRadians(-45)) + line.y1});
            }else if ((pointer.x - line.x1) > 0 & (pointer.y - line.y1) > 0) {
                console.log('2')
                line.set({x2: pointer.x, y2: (pointer.x - line.x1) * Math.tan(toRadians(+45)) + line.y1});
            }else if ((pointer.x - line.x1) < 0 & (pointer.y - line.y1) > 0) {
                console.log('3')
                line.set({x2: pointer.x, y2: (pointer.x - line.x1) * Math.tan(toRadians(-45)) + line.y1});
            }else if ((pointer.x - line.x1) < 0 & (pointer.y - line.y1) < 0) {
                console.log('4')
                line.set({x2: pointer.x, y2: (pointer.x - line.x1) * Math.tan(toRadians(+45)) + line.y1});
            }
        }else {

            if (lineContinueAt !== -1) {
                let segment_end_point = new fabric.Point(lines[lineContinueAt][lines[lineContinueAt].length - 1].calcLinePoints().x2, lines[lineContinueAt][lines[lineContinueAt].length - 1].calcLinePoints().y2);
                segment_end_point = fabric.util.transformPoint(segment_end_point, lines[lineContinueAt][lines[lineContinueAt].length - 1].calcTransformMatrix());

                let segment_start_point = new fabric.Point(lines[lineContinueAt][lines[lineContinueAt].length - 1].calcLinePoints().x1, lines[lineContinueAt][lines[lineContinueAt].length - 1].calcLinePoints().y1);
                segment_start_point = fabric.util.transformPoint(segment_start_point, lines[lineContinueAt][lines[lineContinueAt].length - 1].calcTransformMatrix());

                if (Math.abs(segment_end_point.x - segment_start_point.x) > Math.abs(segment_end_point.y - segment_start_point.y)) {
                    let alpha = Math.atan2(segment_end_point.y - segment_start_point.y, segment_end_point.x - segment_start_point.x);
                    let beta = Math.atan2(pointer.y - line.y1, pointer.x - line.x1);

                    if (alpha - beta >= Math.PI) {
                        beta = -beta
                    }

                    let geodesicNearToMark = geodesicToMarkCalc();

                    if (geodesicNearToMark[0]) {
                        geodesicToMark(geodesicNearToMark[1]);
                    } else {

                        //Richtung der restlichen Geodäte
                        if (Math.abs(alpha - beta) <= Math.PI / 36) {
                            line.set({x2: pointer.x, y2: (pointer.x - line.x1) * Math.tan(alpha) + line.y1});
                        } else {

                            //Wenn der Der Geodreieck-Empty-Button sichtbar ist

                            if (geodesicToGeodreieckCalc()) {
                                geodesicToGeodreieck();
                            } else if (geodesicToStartCalc()) {
                                geodesicToStart();

                            } else {
                                //Linienende sitzt am Cursor
                                line.set({x2: pointer.x, y2: pointer.y})

                            }
                        }
                    }
                } else {
                    let alpha = Math.atan2(segment_end_point.x - segment_start_point.x, segment_end_point.y - segment_start_point.y);
                    let beta = Math.atan2(pointer.x - line.x1, pointer.y - line.y1);

                    if (alpha - beta >= Math.PI) {
                        beta = -beta
                    }

                    let geodesicNearToMark = geodesicToMarkCalc();

                    if (geodesicNearToMark[0]) {
                        geodesicToMark(geodesicNearToMark[1]);
                    } else {

                        if (Math.abs(alpha - beta) <= Math.PI / 36 /* Hier bin ich nicht sicher, ob das rein muss || Math.abs(alpha + beta) <= Math.PI / 36*/) {
                            line.set({x2: (pointer.y - line.y1) * Math.tan(alpha) + line.x1, y2: pointer.y});
                        } else {

                            //Wenn der Der Geodreieck-Empty-Button sichtbar ist

                            if (geodesicToGeodreieckCalc()) {
                                geodesicToGeodreieck();
                            } else if (geodesicToStartCalc()) {
                                geodesicToStart();

                            } else {


                                //Linienende sitzt am Cursor
                                line.set({x2: pointer.x, y2: pointer.y})

                            }

                        }
                    }
                }
            } else {
                if (selectedTool == 'paint' || startAtMarkPoint !== -1) {

                    //WICHTIG DIE ABFRAGE LAEUFT UEBER DIE SICHTBARKEIT DES BUTTONS!!! AENDERN!!! DIES IST NICHT GUT

                    if (geodesicToGeodreieckCalc()) {
                        geodesicToGeodreieck();
                    } else {
                        let geodesicNearToMark = geodesicToMarkCalc();

                        if (geodesicNearToMark[0]) {
                            geodesicToMark(geodesicNearToMark[1]);
                        } else {

                            //Linienende sitzt am Cursor
                            line.set({x2: pointer.x, y2: pointer.y})
                        }
                    }
                }
            }
        }
    }

    if (lineTypeToDraw == 'geodesic'){

        if (selectedTool == 'paint' || lineContinueAt !== -1) {
            //Prüfen ob die Linie über einen verbotenen Bereich verläuft
            let xg1 = line.x1;
            let xg2 = line.x2;
            let yg1 = line.y1;
            let yg2 = line.y2;

            canvas.renderAll();
            let schnittpunktsparameters = getSchnittpunktsparameters(sectors, [xg1, yg1, xg2, yg2]);
            let lambdas = [];
            for (let ii = 0; ii < schnittpunktsparameters.length; ii++) {
                lambdas.push(schnittpunktsparameters[ii][0])
            }

            //let lineOverTheseSectors = schnittpunktsparameter[1];
            //let lineOverTheseEdges = schnittpunktsparameter[2];
            line.stroke = color;
            line.fill = color;

            if (schnittpunktsparameters.length > 0) {
                for (let ii = 0; ii < schnittpunktsparameters.length; ii++) {
                    if (sectors[schnittpunktsparameters[ii][1]].snapStatus[schnittpunktsparameters[ii][2]] == 0) {

                        let lineStart_x = line.x1;
                        let lineStart_y = line.y1;

                        let lineEnd_x;
                        let lineEnd_y;

                        if (schnittpunktsparameters[ii][0] < epsilon) {
                            schnittpunktsparameters[ii][0] = 0;

                            let pointIsInSectorWithID;

                            if (schnittpunktsparameters.length == 1) {
                                lineEnd_x = xg1 + 1.0 * (xg2 - xg1);
                                lineEnd_y = yg1 + 1.0 * (yg2 - yg1);

                                let mittelpunktlineSegment = new fabric.Point(lineStart_x + (lineEnd_x - lineStart_x) / 2, lineStart_y + (lineEnd_y - lineStart_y) / 2);

                                pointIsInSectorWithID = getParentSectorOfPoint(mittelpunktlineSegment);

                                if (pointIsInSectorWithID !== lines[lineContinueAt][lines[lineContinueAt].length - 1].parentSector[0]) {
                                    line.stroke = 'red';
                                    line.fill = 'red';
                                }
                            } else {

                                lineEnd_x = xg1 + schnittpunktsparameters[1][0] * (xg2 - xg1);
                                lineEnd_y = yg1 + schnittpunktsparameters[1][0] * (yg2 - yg1);

                                let mittelpunktlineSegment = new fabric.Point(lineStart_x + (lineEnd_x - lineStart_x) / 2, lineStart_y + (lineEnd_y - lineStart_y) / 2);

                                pointIsInSectorWithID = getParentSectorOfPoint(mittelpunktlineSegment);

                                if (pointIsInSectorWithID !== lines[lineContinueAt][lines[lineContinueAt].length - 1].parentSector[0]) {
                                    line.stroke = 'red';
                                    line.fill = 'red';
                                }
                            }


                        }else{
                            line.stroke = 'red';
                            line.fill = 'red';
                        }


                    }
                }
            }


            //TODO autoSetOnDraw muss endlich fertig gestellt werden
            if (autoSetOnDraw == "1") {

                let xg1 = line.x1
                let yg1 = line.y1
                let xg2 = line.x2
                let yg2 = line.y2

                let schnittpunktparameter = getSchnittpunktsparameters(sectors, [xg1, yg1, xg2, yg2])



                if (schnittpunktparameter.length > 0){
                    let immediatehistory =[1];
                    let undoTemp = false

                    for (let ii = 0; ii < schnittpunktparameter.length; ii++){
                        if (undoTemp){
                            undoLastAction()
                        }
                        let initialSectorID = schnittpunktparameter[ii][1]
                        let sectorToSnapID = sectors[initialSectorID].neighbourhood[schnittpunktparameter[ii][2]]
                        //console.log('initialSectorID:', initialSectorID)
                        //console.log(schnittpunktparameter[ii][0])
                        //console.log('Sektor', sectorToSnapID, 'schnappt an Sektor', initialSectorID)
                        //console.log(schnittpunktparameter[ii][0])
                        //console.log(schnittpunktparameter)

                        snapInitialSectorToTargetSector(sectorToSnapID, initialSectorID)
                        line.bringToFront()
                        //history.push(immediatehistory)
                    }

                }

                /*let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[actualSector].trapez)

                for (let kk = 0; kk < 4; kk++) {

                    xt1 = trapezPointsAsGlobalCoords[kk].x;
                    xt2 = trapezPointsAsGlobalCoords[(kk + 1) % 4].x;
                    yt1 = trapezPointsAsGlobalCoords[kk].y;
                    yt2 = trapezPointsAsGlobalCoords[(kk + 1) % 4].y;

                    let dxg_tmp = xg2 - xg1;
                    let dyg_tmp = yg2 - yg1;

                    dxg = dxg_tmp;
                    dyg = dyg_tmp;

                    dxt12 = xt2 - xt1;
                    dyt12 = yt2 - yt1;

                    slopeGeodesic = dyg / dxg;
                    slopeTrapez = dyt12 / dxt12;


                    if (dxg > epsilon) {
                        alpha = (yg1 - yt1 + (dyg / dxg) * (xt1 - xg1)) / (dyt12 - ((dxt12 * dyg) / dxg));
                        lambda = (xt1 + ((yg1 - yt1 + (dyg / dxg) * (xt1 - xg1)) / (dyt12 - ((dxt12 * dyg) / dxg))) * dxt12 - xg1) / dxg;
                    } else {
                        alpha = (xg1 - xt1 + (dxg / dyg) * (yt1 - yg1)) / (dxt12 - ((dyt12 * dxg) / dyg));
                        lambda = (yt1 + ((xg1 - xt1 + (dxg / dyg) * (yt1 - yg1)) / (dxt12 - ((dyt12 * dxg) / dyg))) * dyt12 - yg1) / dyg;
                    }

                    if (lambda > epsilon) {
                        if (lambda > 0.0 && lambda <= 1.0 && alpha > 0.0 && alpha <= 1.0) {

                            kantenIndex = kk;

                            break;
                        }
                    }

                }


                let staticSector = sectors[actualSector].ID;
                let neighbourSector = sectors[actualSector].neighbourhood[kantenIndex];


                if (neighbourSector === -1 || sectors[neighbourSector].fill === '#e2e2e2') {

                    return
                }

                if (textured !== "1") {
                    for (let ll = 0; ll < 4; ll++) {

                        let sec_idx = sectors[staticSector].neighbourhood[ll];

                        if (sectors[staticSector].snapEdges[ll] !== 0) {
                            let edgeToRemove = sectors[staticSector].snapEdges[ll];
                            canvas.remove(edgeToRemove);
                            sectors[staticSector].snapEdges[ll] = [0];

                        }

                        if (sec_idx > -1) {

                            if (sectors[sec_idx].snapEdges[(ll + 2) % 4] !== 0) {
                                let edgeToRemove = sectors[sec_idx].snapEdges[(ll + 2) % 4];
                                canvas.remove(edgeToRemove);
                                sectors[sec_idx].snapEdges[(ll + 2) % 4] = [0];

                            }
                        }
                    }
                }
                //Punkte des Nachbarsektors ermitteln
                let neighbourTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[neighbourSector].trapez);


                //Übergangspunkte übernehmen
                xt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 2) % 4].x;
                xt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 3) % 4].x;
                yt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 2) % 4].y;
                yt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 3) % 4].y;


                point_1 = new fabric.Point(xt1_uebergang, yt1_uebergang);
                point_2 = new fabric.Point(xt2_uebergang, yt2_uebergang);
                point_a = new fabric.Point(xt2, yt2);
                point_b = new fabric.Point(xt1, yt1);

                dist_1a = distance(point_1, point_a);
                dist_2b = distance(point_2, point_b);


                // Steigung der Kante des ruhenden/ausgehenden Sektors im lokalen Koordinatensysten
                dxs_tmp = sectors[staticSector].trapez.points[kantenIndex].x - sectors[staticSector].trapez.points[(kantenIndex + 1) % 4].x;
                dys_tmp = sectors[staticSector].trapez.points[kantenIndex].y - sectors[staticSector].trapez.points[(kantenIndex + 1) % 4].y;
                if (Math.abs(dys_tmp) > epsilon) {
                    gamma_static = Math.atan(dxs_tmp / dys_tmp);
                } else {
                    gamma_static = 0.0
                }
                dxs_tmp = sectors[neighbourSector].trapez.points[(kantenIndex + 2) % 4].x - sectors[neighbourSector].trapez.points[(kantenIndex + 3) % 4].x;
                dys_tmp = sectors[neighbourSector].trapez.points[(kantenIndex + 2) % 4].y - sectors[neighbourSector].trapez.points[(kantenIndex + 3) % 4].y;
                if (Math.abs(dys_tmp) > epsilon) {
                    gamma_neighbour = Math.atan(dxs_tmp / dys_tmp);
                } else {
                    gamma_neighbour = 0.0
                }


                sectors[neighbourSector].trapez.angle = sectors[staticSector].trapez.angle - gamma_static / Math.PI * 180 + gamma_neighbour / Math.PI * 180;
                sectors[neighbourSector].trapez.setCoords();

                transformMatrix = sectors[neighbourSector].trapez.calcTransformMatrix();

                point_1_local = new fabric.Point(sectors[neighbourSector].trapez.points[(kantenIndex + 2) % 4].x - sectors[neighbourSector].trapez.width / 2,
                    sectors[neighbourSector].trapez.points[(kantenIndex + 2) % 4].y - sectors[neighbourSector].trapez.height / 2);
                point_1 = fabric.util.transformPoint(point_1_local, transformMatrix);

                sectors[neighbourSector].trapez.left += point_a.x - point_1.x;
                sectors[neighbourSector].trapez.top += point_a.y - point_1.y;


                updateMinions(sectors[neighbourSector].trapez);

                sectors[neighbourSector].trapez.setCoords();

                if (textured == "1") {
                    snapping(sectors[neighbourSector].trapez);
                } else {
                    snappingToChosen(sectors[neighbourSector].trapez, staticSector);
                }

                for (let kk = 0; kk < 4; kk++) {

                    let sec_idx = sectors[staticSector].neighbourhood[kk];


                    if (sectors[staticSector].snapStatus[kk] !== 0) {


                        transformMatrix = sectors[staticSector].trapez.calcTransformMatrix();
                        //point_1/2 gehören zum bewegten Trapez
                        point_1_local = new fabric.Point(sectors[staticSector].trapez.points[kk].x - sectors[staticSector].trapez.width / 2,
                            sectors[staticSector].trapez.points[kk].y - sectors[staticSector].trapez.height / 2);

                        point_2_local = new fabric.Point(sectors[staticSector].trapez.points[(kk + 1) % 4].x - sectors[staticSector].trapez.width / 2,
                            sectors[staticSector].trapez.points[(kk + 1) % 4].y - sectors[staticSector].trapez.height / 2);

                        point_1 = fabric.util.transformPoint(point_1_local, transformMatrix);

                        point_2 = fabric.util.transformPoint(point_2_local, transformMatrix);

                        let stack_idx_of_clicked_sector = canvas.getObjects().indexOf(this);

                        let edge = new fabric.Line([point_1.x, point_1.y, point_2.x, point_2.y,], {
                            strokeWidth: 1,
                            fill: edgeColor,
                            stroke: edgeColor,
                            originX: 'center',
                            originY: 'center',
                            perPixelTargetFind: true,
                            objectCaching: false,
                            hasBorders: false,
                            hasControls: false,
                            evented: false,
                            selectable: false,
                        });

                        edge.ID = kk;

                        canvas.insertAt(edge, stack_idx_of_clicked_sector + 1);

                        edge.bringToFront();
                        sectors[staticSector].snapEdges[kk] = edge;

                        //-----------IDEE UM DIE DRAGPOINTS NACH VORNE ZU HOLEN------------------
                        for (let ll = 0; ll < sectors[sec_idx].lineSegments.length; ll++) {
                            if (sectors[sec_idx].lineSegments[ll].dragPoint !== undefined) {
                                canvas.bringToFront(sectors[sec_idx].lineSegments[ll].dragPoint)
                            }
                        }
                    }


                }

                line.bringToFront()

                 */
            }

            canvas.renderAll();
        }
    }

    if (lineTypeToDraw == 'polyline') {

        if (isLineStarted == true){

            let geodesicNearToMark = geodesicToMarkCalc();

            if (geodesicNearToMark[0]) {
                pathCoord = geodesicToMark(geodesicNearToMark[1]);
            } else {
                pathCoord = {x: pointer.x, y: pointer.y};
            }

            polyline.points.push(pathCoord);

            xp1 = polyline.points[polyline.points.length - 2].x;
            yp1 = polyline.points[polyline.points.length - 2].y;
            xp2 = polyline.points[polyline.points.length - 1].x;
            yp2 = polyline.points[polyline.points.length - 1].y;

            let schnittpunktsparameters = getSchnittpunktsparameters(sectors, [xp1, yp1, xp2, yp2]);
            let lambdas = [];
            for (let ii = 0; ii < schnittpunktsparameters.length; ii++) {
                lambdas.push(schnittpunktsparameters[ii][0])
            }

            for (let ii = 0; ii < schnittpunktsparameters.length; ii++) {
                if (sectors[schnittpunktsparameters[ii][1]].snapStatus[schnittpunktsparameters[ii][2]] == 0) {
                    polyline.stroke = 'red';

                }
            }

            canvas.renderAll();
        }

    }

    if(lineTypeToDraw == "vector") {
        if (isLineStarted == true) {

            let vectorPoint = vectors[vectors.length - 1][0]
            let vectorLine = vectors[vectors.length - 1][1]
            let vectorHead = vectors[vectors.length - 1][2]

            pointer = canvas.getPointer(o.e);
            let x1 = vectorPoint.left;
            let y1 = vectorPoint.top;
            let x2 = pointer.x;
            let y2 = pointer.y;

            let dy = y2 - y1;
            let dx = x2 - x1;

            let pointerAngle = toDegree(Math.atan2(dy, dx));
            let vectorPointPosition = new fabric.Point(vectorPoint.left, vectorPoint.top);
            let pointerVectorX = pointer.x - vectorPoint.left;
            let pointerVectorY = pointer.y - vectorPoint.top;
            let pointerVectorLength = Math.sqrt(Math.pow(pointerVectorX, 2) + Math.pow(pointerVectorY, 2));
            let unitVectorX = pointerVectorX / pointerVectorLength;
            let unitVectorY = pointerVectorY / pointerVectorLength;

            if(distance(pointer, vectorPointPosition) >= abortLengthVector && distance(pointer, vectorPointPosition) <= maxLengthVector) {
                vectorHead.set({
                    left: pointer.x,
                    top: pointer.y,
                    angle: pointerAngle + 90
                });
            } else if(distance(pointer, vectorPointPosition) < abortLengthVector) {
                vectorHead.set({
                    left: vectorPoint.left + unitVectorX * abortLengthVector,
                    top: vectorPoint.top + unitVectorY * abortLengthVector,
                    angle: pointerAngle + 90
                });
            } else {
                vectorHead.set({
                    left: vectorPoint.left + unitVectorX * maxLengthVector,
                    top: vectorPoint.top + unitVectorY * maxLengthVector,
                    angle: pointerAngle + 90
                });
            }

            vectorLine.set({
                x1: vectorPoint.left,
                y1: vectorPoint.top,
                x2: vectorHead.left,
                y2: vectorHead.top
            });

            vectorLine.setCoords();
            vectorHead.setCoords();
            canvas.renderAll();
        }

    }

});

//Zoomoptionen Maus

canvas.on('mouse:wheel', function(opt) {
    var delta = -opt.e.deltaY;
    var zoom = canvas.getZoom();
    if (delta < 0.0){
        zoom = zoom * 0.95;
    } else{
        zoom = zoom / 0.95;
    }
    if (zoom > 20) zoom = 20;
    if (zoom < 0.1) zoom = 0.1;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();

    /*
    for (let ii = lines.length - 1; ii >= 0; ii--) {
        if(lines[ii][lines[ii].length-1] !== undefined) {
            lines[ii][lines[ii].length - 1].dragPoint.padding = dragPointPadding * 1 / zoom;
        }
    }
    */
});

canvas.on('mouse:down', function(opt) {
    if (shiftPressed === true) return;
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

canvas.on('mouse:move', function(opt) {
    if (shiftPressed === true) return;
    if (validPinch === true) return;
    if (this.isDragging) {
        var e = opt.e;
        let XCoord;
        let YCoord;
        let touch = e.touches;


        if (typeof touch !== 'undefined' ) {
            XCoord = touch[0].clientX;
            YCoord = touch[0].clientY;
        }else {
            XCoord = e.clientX;
            YCoord = e.clientY;
        }


        this.viewportTransform[4] += XCoord - this.lastPosX;
        this.viewportTransform[5] += YCoord - this.lastPosY;

        this.requestRenderAll();
        this.lastPosX = XCoord;
        this.lastPosY = YCoord;
    }
});

canvas.on('mouse:up', function(opt) {

    if (shiftPressed === true) return;
    this.isDragging = false;
    //this.selection = false;
    var zoom = canvas.getZoom();
    canvas.setZoom(zoom);

    if (selectedTool !== 'paint' && selectedTool !== 'mark' && lineContinueAt == -1) {
        return;
    }

    if (lineTypeToDraw == 'geodesic'){
        let immediatehistory = [0];
        let color;
        let lineStrokeWidth;

        if (lineContinueAt !== -1) {
            color = lines[lineContinueAt][0].stroke;
            lineStrokeWidth = lines[lineContinueAt][0].strokeWidth;

            //startsector beweglich machen
            let idx = lines[lineContinueAt][lines[lineContinueAt].length - 1].parentSector;
            sectors[idx[0]].trapez.lockMovementX = false;
            sectors[idx[0]].trapez.lockMovementY = false;
            sectors[idx[0]].trapez.evented = true;
            sectors[idx[0]].trapez.hasControls = true;
            sectors[idx[0]].trapez.hoverCursor = 'grabbing';


        } else {
            color = line_colors[lines.length % line_colors.length];
            lineStrokeWidth = lineStrokeWidthWhenSelected;
        }

        if (isLineStarted) {

            isLineStarted = false;
            startAtMarkPoint = -1;
            line.setCoords(); //Alle Änderungen der Member sollen übernommen werden
            canvas.renderAll();
            xg1 = line.x1;
            xg2 = line.x2;
            yg1 = line.y1;
            yg2 = line.y2;

            let lineStart_x = line.x1;
            let lineStart_y = line.y1;

            let lineEnd_x;
            let lineEnd_y;

            let zoom = canvas.getZoom();

            if (distance(new fabric.Point(xg1, yg1), new fabric.Point(xg2, yg2)) < abortlength) {
                canvas.remove(line);
                lineContinueAt = -1;
                lineTypeToDraw = "";
                toolChange('grab');
                return;
            }

            if (lineContinueAt !== -1) {
                canvas.remove(lines[lineContinueAt][lines[lineContinueAt].length - 1].dragPoint);
                delete lines[lineContinueAt][lines[lineContinueAt].length - 1].dragPoint;
            }
            //Splitting der Linie in Liniensegmente an den Sektorkanten

            let schnittpunktsparameters = getSchnittpunktsparameters(sectors, [xg1, yg1, xg2, yg2]);

            let lambdas = [0];

            if (schnittpunktsparameters.length > 0) {
                //lambdas.push(schnittpunktsparameters[0][0])

                for (let ii = 0; ii < schnittpunktsparameters.length; ii++) {

                    if (sectors[schnittpunktsparameters[ii][1]].snapStatus[schnittpunktsparameters[ii][2]] !== 0) {
                        lambdas.push(schnittpunktsparameters[ii][0]);
                        if (ii == schnittpunktsparameters.length - 1) {

                            lambdas.push(1.0);
                        }
                    } else {

                        if(schnittpunktsparameters[ii][0] < epsilon){
                            schnittpunktsparameters[ii][0] = 0;

                            let pointIsInSectorWithID;

                            if (schnittpunktsparameters.length == 1){
                                lineEnd_x = xg1 + 1.0 * (xg2 - xg1);
                                lineEnd_y = yg1 + 1.0 * (yg2 - yg1);

                                let mittelpunktlineSegment = new fabric.Point(lineStart_x + (lineEnd_x - lineStart_x) / 2, lineStart_y + (lineEnd_y - lineStart_y) / 2);

                                pointIsInSectorWithID = getParentSectorOfPoint(mittelpunktlineSegment);

                                if (pointIsInSectorWithID == lines[lineContinueAt][lines[lineContinueAt].length - 1].parentSector[0]) {
                                    lambdas.push(1.0)
                                } else{
                                    lambdas.push(schnittpunktsparameters[0][0]);
                                    break
                                }


                            } else {

                                lineEnd_x = xg1 + schnittpunktsparameters[1][0] * (xg2 - xg1);
                                lineEnd_y = yg1 + schnittpunktsparameters[1][0] * (yg2 - yg1);

                                let mittelpunktlineSegment = new fabric.Point(lineStart_x + (lineEnd_x - lineStart_x) / 2, lineStart_y + (lineEnd_y - lineStart_y) / 2);

                                pointIsInSectorWithID = getParentSectorOfPoint(mittelpunktlineSegment);

                                if (pointIsInSectorWithID !== lines[lineContinueAt][lines[lineContinueAt].length - 1].parentSector[0]) {
                                    break
                                }
                            }


                        } else{
                            lambdas.push(schnittpunktsparameters[ii][0]);
                            break
                        }


                    }
                }
            } else {

                lambdas.push(1.0);
            }

            canvas.remove(line);

            lineStart_x = line.x1;
            lineStart_y = line.y1;

            let lineSegment;
            let geodesic = [];
            let parentSectorID;

            for (let ii = 1; ii < lambdas.length; ii++) {

                lineEnd_x = xg1 + lambdas[ii] * (xg2 - xg1);
                lineEnd_y = yg1 + lambdas[ii] * (yg2 - yg1);

                let mittelpunktlineSegment = new fabric.Point(lineStart_x + (lineEnd_x - lineStart_x) / 2, lineStart_y + (lineEnd_y - lineStart_y) / 2);

                parentSectorID = getParentSectorOfPoint(mittelpunktlineSegment);

                if (Math.abs(lineEnd_x - lineStart_x) > 1 || Math.abs(lineEnd_y - lineStart_y) > 1) {
                    lineSegment = drawLineSegment(color, lineStrokeWidth, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y);

                    if (lineContinueAt !== -1) {
                        lineSegment.ID = [lineContinueAt, lines[lineContinueAt].length]
                    } else {
                        lineSegment.ID = [lines.length, geodesic.length];
                    }

                    if (lineContinueAt !== -1) {
                        lines[lineContinueAt].push(lineSegment)
                    } else {
                        geodesic.push(lineSegment);
                    }

                    immediatehistory.push(lineSegment.ID);
                }
                lineStart_x = lineEnd_x;
                lineStart_y = lineEnd_y;
            }

            if (immediatehistory.length !== 1){
                history.push(immediatehistory);
            }

            if (lineSegment === undefined) {
                lineSegment = lines[lineContinueAt][lines[lineContinueAt].length - 1];
            }


            if (lineContinueAt === -1) {
                lines.push(geodesic)
            }

            lineContinueAt = -1;

            drawDragPoint(lineSegment.ID[0]);
            chosenLineGlobalID = lineSegment.ID[0];

            if (buildGeodesicTicks == "1"){
                drawGeodesicTicks(chosenLineGlobalID)
            }
            if (autoCompleteOnMouseUp == "1"){
                continueGeodesic(chosenLineGlobalID)
            }
        }

        canvas.renderAll();
        toolChange('grab')

    }

    if (lineTypeToDraw == 'polyline'){
        let immediatehistory = [0];
        let color;
        let lineStrokeWidth;

        if (lineContinueAt !== -1) {
            color = lines[lineContinueAt][0].stroke;
            lineStrokeWidth = lines[lineContinueAt][0].strokeWidth;

            if (lines[lineContinueAt][lines[lineContinueAt].length - 1].parentSector[0] !== -1){
                //startsector beweglich machen
                let idx = lines[lineContinueAt][lines[lineContinueAt].length - 1].parentSector;
                sectors[idx[0]].trapez.lockMovementX = false;
                sectors[idx[0]].trapez.lockMovementY = false;
                sectors[idx[0]].trapez.evented = true;
                sectors[idx[0]].trapez.hasControls = true;
                sectors[idx[0]].trapez.hoverCursor = 'grabbing';
            }

        } else {
            color = line_colors[lines.length % line_colors.length];
            lineStrokeWidth = lineStrokeWidthWhenSelected;
        }

        isLineStarted = false;

        if (polyline.abortFromBeginning == true){
            canvas.remove(polyline);
            pathCoords = [];
            lineContinueAt = -1;
            return
        }

        if (lineContinueAt !== -1) {
            canvas.remove(lines[lineContinueAt][lines[lineContinueAt].length - 1].dragPoint);
            delete lines[lineContinueAt][lines[lineContinueAt].length - 1].dragPoint;
        }

        canvas.remove(polyline);



        pathCoords.splice(1, 1);

        if (pathCoords[1] == undefined) {
            pathCoords = [];
            return
        }

        let polylineSegments = [];

        let polylineCutParameter = [];

        for (let ii = 0; ii < pathCoords.length - 1; ii ++){

            let schnittpunktsParameter = getSchnittpunktsparameters(sectors, [pathCoords[ii].x, pathCoords[ii].y, pathCoords[ii + 1].x, pathCoords[ii + 1].y])
            if (schnittpunktsParameter.length > 0){

                for (let jj = 0; jj < schnittpunktsParameter.length; jj++) {

                    let lambda = schnittpunktsParameter[jj][0];
                    let necessarySectorsAreSnapped = true;
                    if(sectors[schnittpunktsParameter[jj][1]].snapStatus[schnittpunktsParameter[jj][2]] == 0){
                        necessarySectorsAreSnapped = false
                    }
                    let cutParameter = [ii, lambda, necessarySectorsAreSnapped];
                    polylineCutParameter.push(cutParameter)
                }

            }

        }

        if (polylineCutParameter.length > 0){
            for (let jj = 1; jj < polylineCutParameter.length; jj++) {
                if (Math.abs(polylineCutParameter[jj - 1][1] - polylineCutParameter[jj][1]) < epsilon) {
                    polylineCutParameter.splice(jj, 1)
                }
            }
        }

        let polylineSegment;

        if (polylineCutParameter.length > 0){

            for (let ii = 0; ii < polylineCutParameter.length + 1; ii++){
                let polylineSegmentCoords;
                let parentSectorID;


                if (ii == 0){

                    dxg = pathCoords[polylineCutParameter[ii][0] + 1].x - pathCoords[polylineCutParameter[ii][0]].x;
                    dyg = pathCoords[polylineCutParameter[ii][0] + 1].y - pathCoords[polylineCutParameter[ii][0]].y;

                    polylineSegmentCoords = pathCoords.slice(0, polylineCutParameter[ii][0] + 1);
                    polylineSegmentCoords.push({x: pathCoords[polylineCutParameter[ii][0]].x + polylineCutParameter[ii][1] * dxg, y: pathCoords[polylineCutParameter[ii][0]].y + polylineCutParameter[ii][1] * dyg});

                    dxg_betweenPoints = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2)].x - polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].x;
                    dyg_betweenPoints = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2)].y - polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].y;

                    pointBetweenPathCoords_x = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].x + 0.5 * dxg_betweenPoints;
                    pointBetweenPathCoords_y = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].y + 0.5 * dxg_betweenPoints;

                    let pointBetweenPathCoords = new fabric.Point(pointBetweenPathCoords_x, pointBetweenPathCoords_y);

                    //Es kann vorkommen, dass Geodäten an den Kanten abbrechen und das dann zu Stücken führt, die am selben Punkt
                    //starten und Enden. Das wird hier verhindert

                    if (polylineSegmentCoords.length == 2){
                        if (Math.abs(polylineSegmentCoords[0].x - polylineSegmentCoords[1].x) < epsilon && Math.abs(polylineSegmentCoords[0].y - polylineSegmentCoords[1].y) < epsilon){
                            continue
                        }
                    }

                    parentSectorID = getParentSectorOfPoint(pointBetweenPathCoords);

                    //canvas.add(new fabric.Circle({ radius: 5, fill: '#f55', left: polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2)].x , top: polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2)].y, originX: 'center', originY: 'center' }));

                    polylineSegment = drawPolylineSegment(color, lineStrokeWidth, parentSectorID, polylineSegmentCoords);

                    if (lineContinueAt !== -1) {
                        polylineSegment.ID = [lineContinueAt, lines[lineContinueAt].length]
                    } else {
                        polylineSegment.ID = [lines.length, polylineSegments.length];
                    }

                    if (lineContinueAt !== -1) {
                        lines[lineContinueAt].push(polylineSegment)
                    } else {
                        polylineSegments.push(polylineSegment);
                    }

                    immediatehistory.push(polylineSegment.ID);

                    if (polylineCutParameter[ii][2] == false){
                        break
                    }

                }

                if(ii > 0 && ii < polylineCutParameter.length){

                    polylineSegmentCoords = pathCoords.slice(polylineCutParameter[ii - 1][0] + 1, polylineCutParameter[ii][0] + 1);

                    dxg = pathCoords[polylineCutParameter[ii - 1][0] + 1].x - pathCoords[polylineCutParameter[ii - 1][0]].x;
                    dyg = pathCoords[polylineCutParameter[ii - 1][0] + 1].y - pathCoords[polylineCutParameter[ii - 1][0]].y;
                    polylineSegmentCoords.unshift({x: pathCoords[polylineCutParameter[ii - 1][0]].x + polylineCutParameter[ii - 1][1] * dxg, y: pathCoords[polylineCutParameter[ii - 1][0]].y + polylineCutParameter[ii - 1][1] * dyg})

                    dxg = pathCoords[polylineCutParameter[ii][0] + 1].x - pathCoords[polylineCutParameter[ii][0]].x;
                    dyg = pathCoords[polylineCutParameter[ii][0] + 1].y - pathCoords[polylineCutParameter[ii][0]].y;
                    polylineSegmentCoords.push({x: pathCoords[polylineCutParameter[ii][0]].x + polylineCutParameter[ii][1] * dxg, y: pathCoords[polylineCutParameter[ii][0]].y + polylineCutParameter[ii][1] * dyg});

                    dxg_betweenPoints = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2)].x - polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].x;
                    dyg_betweenPoints = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2)].y - polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].y;

                    pointBetweenPathCoords_x = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].x + 0.5 * dxg_betweenPoints;
                    pointBetweenPathCoords_y = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].y + 0.5 * dxg_betweenPoints;

                    let pointBetweenPathCoords = new fabric.Point(pointBetweenPathCoords_x, pointBetweenPathCoords_y);


                    parentSectorID = getParentSectorOfPoint(pointBetweenPathCoords);

                    polylineSegment = drawPolylineSegment(color, lineStrokeWidth, parentSectorID, polylineSegmentCoords);

                    if (lineContinueAt !== -1) {
                        polylineSegment.ID = [lineContinueAt, lines[lineContinueAt].length]
                    } else {
                        polylineSegment.ID = [lines.length, polylineSegments.length];
                    }

                    if (lineContinueAt !== -1) {
                        lines[lineContinueAt].push(polylineSegment)
                    } else {
                        polylineSegments.push(polylineSegment);
                    }

                    immediatehistory.push(polylineSegment.ID);

                    if (polylineCutParameter[ii][2] == false){
                        break
                    }

                }

                if(ii == polylineCutParameter.length){


                    dxg = pathCoords[polylineCutParameter[ii - 1][0] + 1].x - pathCoords[polylineCutParameter[ii - 1][0]].x;
                    dyg = pathCoords[polylineCutParameter[ii - 1][0] + 1].y - pathCoords[polylineCutParameter[ii - 1][0]].y;

                    polylineSegmentCoords = pathCoords.slice(polylineCutParameter[ii - 1][0] + 1, pathCoords.length - 1);
                    polylineSegmentCoords.unshift({x: pathCoords[polylineCutParameter[ii - 1][0]].x + polylineCutParameter[ii - 1][1] * dxg, y: pathCoords[polylineCutParameter[ii - 1][0]].y + polylineCutParameter[ii - 1][1] * dyg});

                    //canvas.add(new fabric.Circle({ radius: 5, fill: 'yellow', left: polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2)].x , top: polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2)].y, originX: 'center', originY: 'center' }));

                    dxg_betweenPoints = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2)].x - polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].x;
                    dyg_betweenPoints = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2)].y - polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].y;

                    pointBetweenPathCoords_x = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].x + 0.5 * dxg_betweenPoints;
                    pointBetweenPathCoords_y = polylineSegmentCoords[Math.round(polylineSegmentCoords.length / 2) - 1].y + 0.5 * dxg_betweenPoints;

                    let pointBetweenPathCoords = new fabric.Point(pointBetweenPathCoords_x, pointBetweenPathCoords_y);


                    parentSectorID = getParentSectorOfPoint(pointBetweenPathCoords);

                    polylineSegment = drawPolylineSegment(color, lineStrokeWidth, parentSectorID, polylineSegmentCoords);

                    if (lineContinueAt !== -1) {
                        polylineSegment.ID = [lineContinueAt, lines[lineContinueAt].length]
                    } else {
                        polylineSegment.ID = [lines.length, polylineSegments.length];
                    }

                    if (lineContinueAt !== -1) {
                        lines[lineContinueAt].push(polylineSegment)
                    } else {
                        polylineSegments.push(polylineSegment);
                    }

                    immediatehistory.push(polylineSegment.ID);

                    if (polylineCutParameter[ii - 1][2] == false){
                        break
                    }

                }
            }

        }else{
            parentSectorID = getParentSectorOfPoint(pathCoords[Math.round(pathCoords.length / 2)]);
            polylineSegment = drawPolylineSegment(color, lineStrokeWidth, parentSectorID, pathCoords);

            if (lineContinueAt !== -1) {
                polylineSegment.ID = [lineContinueAt, lines[lineContinueAt].length]
            } else {
                polylineSegment.ID = [lines.length, polylineSegments.length];
            }

            if (lineContinueAt !== -1) {
                lines[lineContinueAt].push(polylineSegment)
            } else {
                polylineSegments.push(polylineSegment);
            }

            immediatehistory.push(polylineSegment.ID);
        }

        if (lineContinueAt === -1){
            lines.push(polylineSegments)
        }

        lineContinueAt = -1;

        drawDragPoint(polylineSegment.ID[0]);

        history.push(immediatehistory);

        chosenLineGlobalID = polylineSegment.ID[0];

        pathCoords = [];

        toolChange('grab')
    }
    if (lineTypeToDraw == 'vector') {

        isLineStarted = false

        let vector = vectors.pop();
        let vectorPoint = vector[0];
        let vectorLine = vector[1];
        let vectorHead = vector[2];
        let vectorPointPosition = new fabric.Point(vectorPoint.left, vectorPoint.top);
        let vectorHeadPosition = new fabric.Point(vectorHead.left, vectorHead.top);
        let vectorParentID = getParentSectorOfPoint(vectorPointPosition);

        canvas.remove(vectorPoint, vectorLine, vectorHead);

        if(distance(vectorPointPosition, vectorHeadPosition) >= abortLengthVector - epsilon) {
            let vectorLocalID = sectors[vectorParentID].vectors.length
            drawVector(vectorPointPosition, vectorHeadPosition, vectorParentID, vectors.length, vectorLocalID, 'vector', true);
            vectors[vectors.length - 1][1].strokeWidth = vectorStrokeWidthWhenSelected;
        }

        toolChange('grab')

    }

    if (showExerciseBox == "1"){
        checkSlideCondition();
        console.log('by mouseUp');
        checkCheckBoxCondition();
    }

    lineTypeToDraw = ""
});


/*
window.addEventListener('keydown',function(event){

    if(event.key === 'Shift'){

        canvas.selection = true;
        shiftPressed = true;

    }
});

window.addEventListener('keyup',function(event){
    if(event.key === 'Shift'){
        canvas.selection = false;
        shiftPressed = false;

    }
});
 */


window.addEventListener('keydown',async function(event){
    if(event.key === 'a'){
        for (let ii = 0; ii < lines.length; ii++) {
            await continueGeodesic(lines[ii][lines[ii].length-1].ID[0])
        }
        toolChange('grab');

    }
});


//Button-Funktionen
window.resetSectors = resetSectors;

window.undoLastAction = undoLastAction;

let scaleFacotor;

if (window.innerWidth < 1000 || window.innerHeight < 1000){
    scaleFacotor = Math.min(window.innerHeight/1000, window.innerWidth/1000)
} else {
    scaleFacotor = Math.min(window.innerHeight/1000, window.innerWidth/1000)
}

/*
//-----------------Instructional Overlay---------------------------------
let instructional_overlay_language = 'instructional_overlay.png';

if(language == "english"){
    instructional_overlay_language = 'instructional_overlay_en.png'
}

let instructional_overlay;
fabric.Image.fromURL(instructional_overlay_language, function(img) {
    instructional_overlay = img.set({
        opacity: 1,
        originX: "center",
        originY: "center",
        perPixelTargetFind: true,
        lockMovementX: 'true',
        lockMovementY: 'true',
        objectCaching: false,
        hasBorders: false,
        hasControls: true,
        transparentCorners: true,
        cornerSize: 40,
        angle: 0,
        evented: true,
        selectable: true,
        scaleX: scaleFacotor * 0.9,
        scaleY: scaleFacotor * 0.9,
        hoverCursor: "pointer"});

    instructional_overlay.setControlsVisibility({
        tl: false,
        mt: false,
        tr: false,

        mr: false,
        ml: false,

        bl: false,
        mb: false,
        br: false,
    });

    instructional_overlay.on('mousedown', function (o) {
        canvas.remove(instructional_overlay);
        exitHelp.opacity = 0.0;
        canvas_side_tools_right.renderAll()
    });

});
*/

//-----------------Geodreieck--------------------------------
let geodreieckIsClicked = false;
let geodreieck;


let geodreieckStartAngle;
let geodreieckSnapAngle;
let geodreieckScale;

if (turnLorentzTransformOn == 1){
    geodreieckSnapAngle = 15;
    geodreieckStartAngle = 90;
    geodreieckScale = 0.2//0.0585;
}else{
    geodreieckSnapAngle = 0.1;
    geodreieckStartAngle = 0;
    geodreieckScale = 0.12;
}
fabric.Image.fromURL('geodreieck.png', function(img) {
    geodreieck = img.set({
        opacity: 1,
        originX: "center",
        originY: "bottom",
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: true,
        transparentCorners: true,
        cornerSize: 40,
        angle: geodreieckStartAngle,
        evented: true,
        selectable: true,
        centeredRotation: false,
        scaleX: geodreieckScale ,
        scaleY: geodreieckScale ,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: geodreieckLockRotationToSet,
        hoverCursor: "pointer"});

    geodreieck.on('mousedown', function (o) {
        canvas.bringToFront(geodreieck);
    });



    geodreieck.setControlsVisibility({
        tl: false,
        mt: false,
        tr: false,

        mr: false,
        ml: false,

        bl: false,
        mb: false,
        br: false,
    });

    geodreieck.snapAngle = geodreieckSnapAngle;

    geodreieck.on('moving',function(){geodreieckRotate(this); geodreieckMove(this);});
    geodreieck.on('rotating',function(){geodreieckRotate(this); geodreieckMove(this)});

    geodreieck.on('mousedown', function () {geodreieckIsClicked = true;});
    geodreieck.on('mouseup', function () {geodreieckIsClicked = false;})

});





//-----------------Geodreieck Ende---------------------------------



//Globale Variablen
let isLineStarted = false;
let lineContinueAt = -1;
let selectedTool = 'grab';

let epsilon = 0.0000001;
let snap_radius_sectors = 8;
let snap_radius_line = 15;
let snap_radius_markPoint = 30;
let paddingStartMarks = 10;

let snap_geodreieck_on_mark = 5;

let edgeColor;
//let edgeColor = '#ccc';
//let edgeColor = '#666';
//let edgeColor = '#FFFFFF';

if (textured == "1"){
    if (textureColored == "1"){
        edgeColor = '';
    }else {
        edgeColor = '#ccc';
    }
}else{
    edgeColor = '#FFFFFF';
}
let laufContinueGeodesicMax;
if (defineLaufContinueGeodesicMax !== undefined){
    laufContinueGeodesicMax = parseInt(defineLaufContinueGeodesicMax)
}else{
    laufContinueGeodesicMax= 1000
}

let abortlength = 20;
let abortLengthVector = 30;
let maxLengthVector = 250;
let vectorStrokeWidthWhenSelected = 4.5;
let vectorStrokeWidthWhenNotSelected = 3;

let dragPointRadius = 5;
let dragPointPadding = 10;

let cursor;

let pathCoords = [];

let paddingFactor = 0.00001;

let multiply = fabric.util.multiplyTransformMatrices;
let invert = fabric.util.invertTransform;

canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight,
};

let scaleRatio;

let snap_radius_slider = 5 * scaleFacotor;

let startOpacity = 0.9;

let sectors = [];

let markPoints = [];

let texts = [];

let vertexAngleParts = [];

let lines = [];

let chosenLineGlobalID = -1;

let history = [];

let verticesVisible = false;

let toCalcSectorArea = false;

let deficitAngleVisualizeGroup = new fabric.Group;

let deficitAngleVisualizeGroupOpacity = 0.5;

let longEdgeLineLengthFactor = 1.6;

let lineTypeToDraw;

let slider_max = 100;

let sectorToSnap = -1;

let snappingToChosenDistance = 0.6;

let vectors = [];

let vectorDuplicates = [];

let isVectorPointDragged = false;

/**
 * automatically snaps all sectors along a chosen geodesic
 * @param chosenGeodesicToSetSectors - the ID of the geodesic that is to be continued
 */
async function autoSetSectorsAlongGeodesic(chosenGeodesicToSetSectors) {


    if (chosenGeodesicToSetSectors == -1){
        return
    }

    //Nach dem ersten Setzen sollen die Positionen gespeichert werden

    //resetSectors();

    //Idee: Ähnlich zur automatischen Vervollständigung soll die Geodäte von Sektor zu Sektor verlaufen
    //dabei sollen die entsprechenden Kanten ermittelt werden. An diesen Kanten sollen die Sektoren anschließend zusammenschnappen

    let alpha = 0.0;
    let kantenIndex = -1;

    let xt1;
    let xt2;
    let yt1;
    let yt2;

    let dxg;
    let dyg;
    let dxt12;
    let dyt12;

    let slopeAngle;

    let immediatehistory = [1];

    kantenindex = -1;

    if (typeof chosenGeodesicToSetSectors === 'undefined') {
        return;
    }else {

        if (lines[chosenGeodesicToSetSectors].length > 0) {

            let sectorArrayToAlignIDAnglePos = []

            let startSector = lines[chosenGeodesicToSetSectors][0].parentSector[0];
            let startSectorPos = new fabric.Point(sectors[startSector].trapez.left, sectors[startSector].trapez.top)

            let startSectorToAlignIDAnglePos = [
                startSector,
                sectors[startSector].trapez.angle,
                startSectorPos
            ]

            sectorArrayToAlignIDAnglePos.push(startSectorToAlignIDAnglePos)

            if (lines[chosenGeodesicToSetSectors].length > 1){
                for (let ii = 1; ii < lines[chosenGeodesicToSetSectors].length; ii++){

                    let neighbourSector = lines[chosenGeodesicToSetSectors][ii].parentSector[0];

                    if (sectorArrayToAlignIDAnglePos[sectorArrayToAlignIDAnglePos.length-1][0] == neighbourSector){
                        continue
                    }

                    if (turnLorentzTransformOn == "1"){

                        sectorParameterOnMousedown = getSectorParameterOnMousedown(sectors[neighbourSector].ID);
                        immediatehistory.push(sectorParameterOnMousedown);

                        let commonEdgeNumber = getCommonEdgeNumber(sectorArrayToAlignIDAnglePos[sectorArrayToAlignIDAnglePos.length-1][0], neighbourSector);
                        let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[sectorArrayToAlignIDAnglePos[sectorArrayToAlignIDAnglePos.length-1][0]].trapez);

                        xt1 = trapezPointsAsGlobalCoords[commonEdgeNumber].x;
                        xt2 = trapezPointsAsGlobalCoords[(commonEdgeNumber + 1) % 4].x;
                        yt1 = trapezPointsAsGlobalCoords[commonEdgeNumber].y;
                        yt2 = trapezPointsAsGlobalCoords[(commonEdgeNumber + 1) % 4].y;

                        dxt12 = xt2 - xt1;
                        dyt12 = yt2 - yt1;

                        let neighbourTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[neighbourSector].trapez);

                        xt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(commonEdgeNumber + 3) % 4].x;
                        xt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(commonEdgeNumber + 2) % 4].x;
                        yt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(commonEdgeNumber + 3) % 4].y;
                        yt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(commonEdgeNumber + 2) % 4].y;

                        dxt12_uebergang = xt2_uebergang - xt1_uebergang;
                        dyt12_uebergang = yt2_uebergang - yt1_uebergang;

                        let rapid_base;

                        if (Math.abs(xt1 - xt2) > Math.abs(yt1 - yt2)) {

                            rapid_base = Math.atanh((yt2 - yt1) / (xt2 - xt1))
                        } else {
                            rapid_base = Math.atanh((xt2 - xt1) / (yt2 - yt1))
                        }


                        let rapid_target;

                        if (Math.abs(xt1_uebergang - xt2_uebergang) > Math.abs(yt1_uebergang - yt2_uebergang)) {

                            rapid_target = Math.atanh((yt2_uebergang - yt1_uebergang) / (xt2_uebergang - xt1_uebergang))
                        } else {
                            rapid_target = Math.atanh((xt2_uebergang - xt1_uebergang) / (yt2_uebergang - yt1_uebergang))
                        }

                        let rapid_sum

                        rapid_sum = rapid_base - rapid_target;

                        let rapidBefore = sectors[neighbourSector].rapidity

                        sectors[neighbourSector].rapidity += rapid_sum;

                        let dist_inv_min_x_old = Math.min(sectors[neighbourSector].trapez.points[0].x, sectors[neighbourSector].trapez.points[1].x, sectors[neighbourSector].trapez.points[2].x, sectors[neighbourSector].trapez.points[3].x);
                        let dist_inv_max_y_old = Math.max(sectors[neighbourSector].trapez.points[0].y, sectors[neighbourSector].trapez.points[1].y, sectors[neighbourSector].trapez.points[2].y, sectors[neighbourSector].trapez.points[3].y);

                        if (animatedMovingOn=="1"){
                            await animateLorentzTransform(rapidBefore, sectors[neighbourSector].rapidity, sectors[neighbourSector].trapez)
                        }else{
                            lorentzTransform(sectors[neighbourSector].rapidity, sectors[neighbourSector].trapez);
                        }

                        reinitialiseSector(dist_inv_min_x_old, dist_inv_max_y_old, neighbourSector);

                        let newSectorPos = getSectorPosToAlign(neighbourSector, 0, sectorArrayToAlignIDAnglePos[sectorArrayToAlignIDAnglePos.length-1])

                        let newSectorParameterIDAnglePos = [
                            neighbourSector,
                            0,
                            newSectorPos
                        ]

                        sectorArrayToAlignIDAnglePos.push(newSectorParameterIDAnglePos)
                        await translateSector(neighbourSector, newSectorPos.x, newSectorPos.y)

                    }else{
                        sectorParameterOnMousedown = getSectorParameterOnMousedown(sectors[neighbourSector].ID);
                        immediatehistory.push(sectorParameterOnMousedown);

                        let neighbourSectorNewAngle = getSectorAngleToAlign(
                            neighbourSector,
                            sectorArrayToAlignIDAnglePos[sectorArrayToAlignIDAnglePos.length-1][0],
                            sectorArrayToAlignIDAnglePos[sectorArrayToAlignIDAnglePos.length-1][1]
                        )

                        let newSectorPos = getSectorPosToAlign(neighbourSector, neighbourSectorNewAngle, sectorArrayToAlignIDAnglePos[sectorArrayToAlignIDAnglePos.length-1])



                        let newSectorParameterIDAnglePos = [
                            neighbourSector,
                            neighbourSectorNewAngle,
                            newSectorPos
                        ]

                        sectorArrayToAlignIDAnglePos.push(newSectorParameterIDAnglePos)
                    }


                }
            }

            let lengthOfSectorsArrayToAlignIDAnglePosOfLines = sectorArrayToAlignIDAnglePos.length - 1

            let geodesic_end_point = new fabric.Point(lines[chosenGeodesicToSetSectors][lines[chosenGeodesicToSetSectors].length - 1].calcLinePoints().x2, lines[chosenGeodesicToSetSectors][lines[chosenGeodesicToSetSectors].length - 1].calcLinePoints().y2);
            geodesic_end_point = fabric.util.transformPoint(geodesic_end_point, lines[chosenGeodesicToSetSectors][lines[chosenGeodesicToSetSectors].length - 1].calcTransformMatrix());

            let xg2 = geodesic_end_point.x;
            let yg2 = geodesic_end_point.y;

            let geodesic_start_point = new fabric.Point(lines[chosenGeodesicToSetSectors][lines[chosenGeodesicToSetSectors].length - 1].calcLinePoints().x1, lines[chosenGeodesicToSetSectors][lines[chosenGeodesicToSetSectors].length - 1].calcLinePoints().y1);
            geodesic_start_point = fabric.util.transformPoint(geodesic_start_point, lines[chosenGeodesicToSetSectors][lines[chosenGeodesicToSetSectors].length - 1].calcTransformMatrix());

            let xg1 = geodesic_start_point.x;
            let yg1 = geodesic_start_point.y;

            let dxg_tmp = xg2 - xg1;
            let dyg_tmp = yg2 - yg1;

            dxg = dxg_tmp * 0.1;
            dyg = dyg_tmp * 0.1;

            //Umrechnung der lokalen in globale Koordinaten

            let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[lines[chosenGeodesicToSetSectors][lines[chosenGeodesicToSetSectors].length - 1].parentSector[0]].trapez);

            //Bestimmen der Kantenparameter des InitialSektors
            let kantenParameter = getKantenParameter(lines[chosenGeodesicToSetSectors][lines[chosenGeodesicToSetSectors].length - 1].parentSector[0], xg1, yg1, dxg, dyg);

            let alpha = kantenParameter[0];
            let lambda = kantenParameter[1];
            let kantenIndex = kantenParameter[2];

            //Bestimmen der Kantenpunkte des InitialSektors, die die Geodäte schneiden würde (relevant für die Steigungsberechnung für Rapidity)

            xt1 = trapezPointsAsGlobalCoords[kantenIndex].x;
            xt2 = trapezPointsAsGlobalCoords[(kantenIndex + 1) % 4].x;
            yt1 = trapezPointsAsGlobalCoords[kantenIndex].y;
            yt2 = trapezPointsAsGlobalCoords[(kantenIndex + 1) % 4].y;

            dxt12 = xt2 - xt1;
            dyt12 = yt2 - yt1;

            let rapid_sum;

            //der statische Sektor ist der InitialSektor
            //der Nachbarsektor ergibt sich aus Nachbarschaftsbeziehung des InitalSektors unter Eingabe des vorher bestimmten KantenIndexes

            let staticSector = lines[chosenGeodesicToSetSectors][lines[chosenGeodesicToSetSectors].length - 1].parentSector[0];
            let neighbourSector = sectors[lines[chosenGeodesicToSetSectors][lines[chosenGeodesicToSetSectors].length - 1].parentSector[0]].neighbourhood[kantenIndex];



            if (turnLorentzTransformOn !== 1){
                slopeAngle = Math.acos((dxg * dxt12 + dyg * dyt12) / ((Math.sqrt(dxg * dxg + dyg * dyg)) * (Math.sqrt(dxt12 * dxt12 + dyt12 * dyt12))));
            }

            //Fortsetzung im nächsten Sektor

            for (lauf = 0; lauf < 1000; lauf++) {

                if (neighbourSector === -1 || sectors[neighbourSector].trapez.opacity !== startOpacity) {
                    drawDragPoint(chosenGeodesicToSetSectors);
                    break
                }
                if (goThroughStar !== "1"){
                    if (sectors[neighbourSector].fill === '#e2e2e2') {
                        drawDragPoint(chosenGeodesicToSetSectors);
                        break
                    }
                }

                sectorParameterOnMousedown = getSectorParameterOnMousedown(sectors[neighbourSector].ID);
                immediatehistory.push(sectorParameterOnMousedown);

                //removeSnapEdges(staticSector);

                //drawOrientationCirc('blue', x_kante_uebergang, y_kante_uebergang)

                if (turnLorentzTransformOn == 1){

                    let neighbourTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[neighbourSector].trapez);

                    //Übergangspunkte übernehmen
                    xt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 3) % 4].x;
                    xt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 2) % 4].x;
                    yt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 3) % 4].y;
                    yt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 2) % 4].y;

                    dxt12_uebergang = xt2_uebergang - xt1_uebergang;
                    dyt12_uebergang = yt2_uebergang - yt1_uebergang;

                    x_kante_uebergang = xt1_uebergang + alpha * dxt12_uebergang;
                    y_kante_uebergang = yt1_uebergang + alpha * dyt12_uebergang;

                    let rapid_base;

                    if (Math.abs(xt1 - xt2) > Math.abs(yt1 - yt2)) {

                            rapid_base = Math.atanh((yt2 - yt1) / (xt2 - xt1))
                    } else {
                            rapid_base = Math.atanh((xt2 - xt1) / (yt2 - yt1))
                        }




                    let rapid_target;

                    if (Math.abs(xt1_uebergang - xt2_uebergang) > Math.abs(yt1_uebergang - yt2_uebergang)) {

                            rapid_target = Math.atanh((yt2_uebergang - yt1_uebergang) / (xt2_uebergang - xt1_uebergang))
                    } else {
                            rapid_target = Math.atanh((xt2_uebergang - xt1_uebergang) / (yt2_uebergang - yt1_uebergang))
                        }




                    rapid_sum = rapid_base - rapid_target;

                    let rapidBefore = sectors[neighbourSector].rapidity

                    sectors[neighbourSector].rapidity += rapid_sum;

                    let dist_inv_min_x_old = Math.min(sectors[neighbourSector].trapez.points[0].x, sectors[neighbourSector].trapez.points[1].x, sectors[neighbourSector].trapez.points[2].x, sectors[neighbourSector].trapez.points[3].x);
                    let dist_inv_max_y_old = Math.max(sectors[neighbourSector].trapez.points[0].y, sectors[neighbourSector].trapez.points[1].y, sectors[neighbourSector].trapez.points[2].y, sectors[neighbourSector].trapez.points[3].y);

                    if (animatedMovingOn=="1"){
                        await animateLorentzTransform(rapidBefore, sectors[neighbourSector].rapidity, sectors[neighbourSector].trapez)
                    }else{
                        lorentzTransform(sectors[neighbourSector].rapidity, sectors[neighbourSector].trapez);
                    }

                    reinitialiseSector(dist_inv_min_x_old, dist_inv_max_y_old, neighbourSector);

                    neighbourTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[neighbourSector].trapez);

                    //Übergangspunkte übernehmen
                    xt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 3) % 4].x;
                    xt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 2) % 4].x;
                    yt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 3) % 4].y;
                    yt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 2) % 4].y;

                    dxt12_uebergang = xt2_uebergang - xt1_uebergang;
                    dyt12_uebergang = yt2_uebergang - yt1_uebergang;

                    x_kante_uebergang = xt1_uebergang + alpha * dxt12_uebergang;
                    y_kante_uebergang = yt1_uebergang + alpha * dyt12_uebergang;

                    //sectors[neighbourSector].trapez.set('left', lastLeft + dist_inv_min_x_new - dist_inv_min_x_old).setCoords();
                    //sectors[neighbourSector].trapez.set('top', lastTop + dist_inv_min_y_new - dist_inv_max_y_old).setCoords();

                    //-----------------------------------------------

                    let newSectorPos = getSectorPosToAlign(neighbourSector, 0, sectorArrayToAlignIDAnglePos[lengthOfSectorsArrayToAlignIDAnglePosOfLines + lauf])

                    let newSectorParameterIDAnglePos = [
                        neighbourSector,
                        0,
                        newSectorPos
                    ]

                    sectorArrayToAlignIDAnglePos.push(newSectorParameterIDAnglePos)
                    await translateSector(neighbourSector, newSectorPos.x, newSectorPos.y)

                }else{

                    //Heransnappen des NachbarSektors an den statischen Sektor (dies ist nur im ersten Durchlauf der InitialSektor)




                    let neighbourSectorNewAngle = getSectorAngleToAlign(neighbourSector, staticSector, sectorArrayToAlignIDAnglePos[lengthOfSectorsArrayToAlignIDAnglePosOfLines + lauf][1])

                    let newSectorPos = getSectorPosToAlign(neighbourSector, neighbourSectorNewAngle, sectorArrayToAlignIDAnglePos[lengthOfSectorsArrayToAlignIDAnglePosOfLines + lauf])

                    let newSectorParameterIDAnglePos = [
                        neighbourSector,
                        neighbourSectorNewAngle,
                        newSectorPos
                    ]

                    sectorArrayToAlignIDAnglePos.push(newSectorParameterIDAnglePos)

                     //rotateSector(neighbourSector, newSectorAngle)
                    //await translateSector(neighbourSector, newSectorPos.x, newSectorPos.y)


                }

                //Übergangsrichtung ermitteln



                neighbourTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[neighbourSector].trapez);

                //Übergangspunkte übernehmen
                xt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 3) % 4].x;
                xt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 2) % 4].x;
                yt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 3) % 4].y;
                yt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 2) % 4].y;

                dxt12_uebergang = xt2_uebergang - xt1_uebergang;
                dyt12_uebergang = yt2_uebergang - yt1_uebergang;

                x_kante_uebergang = xt1_uebergang + alpha * dxt12_uebergang;
                y_kante_uebergang = yt1_uebergang + alpha * dyt12_uebergang;

                //drawOrientationCirc("green", x_kante_uebergang, y_kante_uebergang)
                //console.log(-slopeAngle)

                if (turnLorentzTransformOn !== 1){
                    dxg  = dxt12_uebergang * Math.cos(-slopeAngle) - dyt12_uebergang * Math.sin(-slopeAngle);
                    dyg  = dxt12_uebergang * Math.sin(-slopeAngle) + dyt12_uebergang * Math.cos(-slopeAngle);

                }

                kantenParameter = getKantenParameter(neighbourSector, x_kante_uebergang, y_kante_uebergang, dxg, dyg);

                kantenIndex = kantenParameter[2];

                neighbourTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[neighbourSector].trapez);

                xt1 = neighbourTrapezPointsAsGlobalCoords[kantenIndex].x;
                xt2 = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 1) % 4].x;
                yt1 = neighbourTrapezPointsAsGlobalCoords[kantenIndex].y;
                yt2 = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 1) % 4].y;

                dxt12 = xt2 - xt1;
                dyt12 = yt2 - yt1;


                staticSector = neighbourSector;

                if (turnLorentzTransformOn !== 1){
                    slopeAngle = Math.acos((dxg * dxt12 + dyg * dyt12) / ((Math.sqrt(dxg * dxg + dyg * dyg)) * (Math.sqrt(dxt12 * dxt12 + dyt12 * dyt12))));
                }

                neighbourSector = sectors[neighbourSector].neighbourhood[kantenIndex];

                alpha = kantenParameter[0];



            }

            await rotateAndTranslateWithWaitOnIt(sectorArrayToAlignIDAnglePos)

            for (let ii = 1; ii < sectorArrayToAlignIDAnglePos.length; ii++){

                changeSnapStatus(sectorArrayToAlignIDAnglePos[ii - 1][0]);
                changeSnapStatus(sectorArrayToAlignIDAnglePos[ii][0]);

                drawSnapEdges(sectorArrayToAlignIDAnglePos[ii - 1][0]);
                drawSnapEdges(sectorArrayToAlignIDAnglePos[ii][0]);
            }

            history.push(immediatehistory)


        }

    }
}

function animateLorentzTransform(rapidityBefore, rapidityEnd, trapez, steps = 20) {
    let rapidityDiff = rapidityEnd - rapidityBefore;
    let transformIncrement = rapidityDiff / steps;

    let currentStep = 0;

    function animationStep(resolve) {
        let newRapidity = rapidityBefore + currentStep * transformIncrement;

        lorentzTransform(newRapidity, trapez);

        currentStep++;

        // Verwende eine Toleranz (z.B., 0.0001) für die Gleitkommavergleich
        if (currentStep <= steps) {
            requestAnimationFrame(() => animationStep(resolve));
        } else {
            console.log("Animation abgeschlossen");
            resolve(); // Signalisiere, dass die Animation abgeschlossen ist
        }
    }

    // Erzeuge ein Promise und starte die Animation erst, wenn das Promise erfüllt ist
    return new Promise((resolve) => {
        animationStep(resolve);
    });
}

/**
 * Rotates and translates multiple sectors asynchronously with a delay between operations.
 * This function takes an array of sector IDs, angles, and translation coordinates and performs the following operations for each sector in the array:
 * 1. Rotates the sector by the specified angle.
 * 2. Translates the sector to the specified coordinates.
 * The operations are performed asynchronously with a delay of 1000 milliseconds (1 second) between each sector's transformation.
 *
 * @param {Array} sectorArrayToAlignIDAnglePos - An array containing sector IDs, rotation angles, and translation coordinates.
 * @returns {Promise} - A Promise that resolves after all sector transformations are completed with the specified delay.
 */
function rotateAndTranslateWithWaitOnIt(sectorArrayToAlignIDAnglePos){

    return new Promise((resolve) => {
        for (let ii = 1; ii < sectorArrayToAlignIDAnglePos.length; ii++) {

            rotateSector(sectorArrayToAlignIDAnglePos[ii][0], sectorArrayToAlignIDAnglePos[ii][1])
            translateSector(sectorArrayToAlignIDAnglePos[ii][0], sectorArrayToAlignIDAnglePos[ii][2].x, sectorArrayToAlignIDAnglePos[ii][2].y)
            //drawOrientationCirc("green", sectorArrayToAlignIDAnglePos[ii][2].x, sectorArrayToAlignIDAnglePos[ii][2].y)

        }
        setTimeout(resolve, 1000)
    })
}

/**
 * Toggles the calculation of sector areas and displays/hides the sector area infobox accordingly.
 * This function switches the `toCalcSectorArea` flag between `true` and `false` and controls the visibility of the sector area infobox.
 * When `toCalcSectorArea` is `true`, sector areas are calculated and the infobox is shown. When `toCalcSectorArea` is `false`, sector areas are not calculated, and the infobox is hidden.
 */
function calcSectorArea() {
    if (toCalcSectorArea !== true){
        toCalcSectorArea = true;
        showSectorAreaInfobox(true)
    }else {
        toCalcSectorArea = false;
        showSectorAreaInfobox(false)
    }
}

/**
 * changes the starting point of a geodesic and continues it in a new direction
 * @param xChange - how much the new starting point is moved in x direction
 * @param yChange - how much the new starting point is moved in y direction
 * @param chosenGeodesicToChangeStartPoint - the ID of the geodesic that is to get a new starting point
 */

function changeStartPointAndContinue(xChange, yChange, chosenGeodesicToChangeStartPoint) {
    if (chosenLineGlobalID == -1) {
        return
    }

    if (lines[chosenGeodesicToChangeStartPoint][lines[chosenGeodesicToChangeStartPoint].length - 1].lineType !== 'geodesic') {
        return
    }

    let segment_end_point = new fabric.Point(lines[chosenGeodesicToChangeStartPoint][0].calcLinePoints().x2, lines[chosenGeodesicToChangeStartPoint][0].calcLinePoints().y2);
    segment_end_point = fabric.util.transformPoint(segment_end_point,lines[chosenGeodesicToChangeStartPoint][0].calcTransformMatrix() );

    let geodesic_start_point = new fabric.Point(lines[chosenGeodesicToChangeStartPoint][0].calcLinePoints().x1, lines[chosenGeodesicToChangeStartPoint][0].calcLinePoints().y1);
    geodesic_start_point = fabric.util.transformPoint(geodesic_start_point, lines[chosenGeodesicToChangeStartPoint][0].calcTransformMatrix());

    let newGeodesic_start_point = new fabric.Point(geodesic_start_point.x + xChange, geodesic_start_point.y + yChange);

    if(sectorContainsPoint(sectors[lines[chosenGeodesicToChangeStartPoint][0].parentSector[0]].trapez, newGeodesic_start_point) == false){
        return
    }


    let xg1 = geodesic_start_point.x;
    let yg1 = geodesic_start_point.y;
    let xg2 = segment_end_point.x;
    let yg2 = segment_end_point.y;

    let dxg = xg2 - xg1;
    let dyg = yg2 - yg1;

    let kantenParameter = getKantenParameter(lines[chosenGeodesicToChangeStartPoint][0].parentSector[0], xg1 + xChange, yg1 + yChange, dxg, dyg);
    let lambda = kantenParameter[1];

    let lineSegmentToChangeDirection;

    let lineSegmentColor = lines[chosenGeodesicToChangeStartPoint][0].fill;
    let lineSegmentStrokeWidth = lines[chosenGeodesicToChangeStartPoint][0].strokeWidth;
    let parentSectorID = lines[chosenGeodesicToChangeStartPoint][0].parentSector[0];
    let lineStart_x = geodesic_start_point.x + xChange;
    let lineStart_y = geodesic_start_point.y + yChange;
    let lineEnd_x = geodesic_start_point.x + xChange + dxg * lambda;
    let lineEnd_y = geodesic_start_point.y + yChange + dyg * lambda;

    deleteWholeGeodesic(chosenGeodesicToChangeStartPoint);

    if(Math.abs(lineEnd_x - lineStart_x) > epsilon || Math.abs(lineEnd_y - lineStart_y) > epsilon) {

        lineSegmentToChangeDirection = drawLineSegment(lineSegmentColor, lineSegmentStrokeWidth, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y);

        lineSegmentToChangeDirection.ID = [chosenGeodesicToChangeStartPoint, lines[chosenGeodesicToChangeStartPoint].length];

        lines[chosenGeodesicToChangeStartPoint].push(lineSegmentToChangeDirection);

        if (buildGeodesicTicks == "1"){
            drawGeodesicTicks(chosenGeodesicToChangeStartPoint)
        }

    }

    //Verlängerung der Geodäte bis zum Rand des Modells
    continueGeodesic(chosenGeodesicToChangeStartPoint);

    history[history.length - 1].splice(1, 0, lineSegmentToChangeDirection.ID);

    history.push([3, 2]);

    if (showExerciseBox == "1"){
        checkSlideCondition();
        console.log('by changeStart');
        checkCheckBoxCondition();
    }
}

/**
 * changes the direction of a geodesic and continues it to the edge of a sector model
 * @param rotationdirection - the change of direction clockwise or counter-clockwise
 * @param rotationAngle - by which angle the direction of the geodesic is to be rotated
 * @param chosenGeodesicTochangeDirection - the ID of the geodesic that needs another direction
 */
function changeDirectionAndContinue(rotationdirection, rotationAngle, chosenGeodesicTochangeDirection) {
    if (chosenLineGlobalID == -1) {
        return
    }

    if (lines[chosenGeodesicTochangeDirection][lines[chosenGeodesicTochangeDirection].length - 1].lineType !== 'geodesic') {
        return
    }

    let segment_end_point = new fabric.Point(lines[chosenGeodesicTochangeDirection][0].calcLinePoints().x2, lines[chosenGeodesicTochangeDirection][0].calcLinePoints().y2);
    segment_end_point = fabric.util.transformPoint(segment_end_point,lines[chosenGeodesicTochangeDirection][0].calcTransformMatrix() );

    let geodesic_start_point = new fabric.Point(lines[chosenGeodesicTochangeDirection][0].calcLinePoints().x1, lines[chosenGeodesicTochangeDirection][0].calcLinePoints().y1);
    geodesic_start_point = fabric.util.transformPoint(geodesic_start_point, lines[chosenGeodesicTochangeDirection][0].calcTransformMatrix());

    let xg1 = geodesic_start_point.x;
    let yg1 = geodesic_start_point.y;
    let xg2 = segment_end_point.x;
    let yg2 = segment_end_point.y;

    let dxg;
    let dyg;

    let dxg_tmp = xg2 - xg1;
    let dyg_tmp = yg2 - yg1;

    // Die Richtungsaenderung bewirkt automatisch eine Veraenderung in der Laenge des Richtungsvektors.
    // Obwohl das urspruengliche Endstueck der Geodaete auf der Kante lag, muss deshalb der Richtungsvektor nicht verkürzt werden.

    //Drehen der Geodätenrichtung:
    if (rotationdirection == 'clockwise') {
        dxg = dxg_tmp * Math.cos(rotationAngle) - dyg_tmp * Math.sin(rotationAngle);
        dyg = dxg_tmp * Math.sin(rotationAngle) + dyg_tmp * Math.cos(rotationAngle);
    } else {
        dxg = dxg_tmp * Math.cos(- rotationAngle) - dyg_tmp * Math.sin(- rotationAngle);
        dyg = dxg_tmp * Math.sin(- rotationAngle) + dyg_tmp * Math.cos(- rotationAngle);
    }

    //Bestimmen des Schnittpunktes des neuen Geodätenstücks mit der Sektorkante

    let kantenParameter = getKantenParameter(lines[chosenGeodesicTochangeDirection][0].parentSector[0], xg1, yg1, dxg, dyg)
    let lambda = kantenParameter[1];

    let lineSegmentToChangeDirection;

    let lineSegmentColor = lines[chosenGeodesicTochangeDirection][0].fill;
    let lineSegmentStrokeWidth = lines[chosenGeodesicTochangeDirection][0].strokeWidth;
    let parentSectorID = lines[chosenGeodesicTochangeDirection][0].parentSector[0];
    let lineStart_x = geodesic_start_point.x;
    let lineStart_y = geodesic_start_point.y;
    let lineEnd_x = geodesic_start_point.x + dxg * lambda;
    let lineEnd_y = geodesic_start_point.y + dyg * lambda;

    deleteWholeGeodesic(chosenGeodesicTochangeDirection);

    if(Math.abs(lineEnd_x - lineStart_x) > epsilon || Math.abs(lineEnd_y - lineStart_y) > epsilon) {

        lineSegmentToChangeDirection = drawLineSegment(lineSegmentColor, lineSegmentStrokeWidth, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y)

        lineSegmentToChangeDirection.ID = [chosenGeodesicTochangeDirection, lines[chosenGeodesicTochangeDirection].length];

        lines[chosenGeodesicTochangeDirection].push(lineSegmentToChangeDirection);

        if (buildGeodesicTicks == "1"){
            drawGeodesicTicks(chosenGeodesicTochangeDirection)
        }

    }

    //Verlängerung der Geodäte bis zum Rand des Modells
    continueGeodesic(chosenGeodesicTochangeDirection);

    history[history.length - 1].splice(1, 0, lineSegmentToChangeDirection.ID);

    history.push([3, 2]);

    if (showExerciseBox == "1"){
        checkSlideCondition();
        console.log('by changeDirection');
        checkCheckBoxCondition();
    }
}

/**
 * Updates the relationship properties of various objects within a sector after a Lorentz transformation.
 *
 * @param {object} initialSectorTrapez - The trapezoidal sector that underwent the transformation.
 * @param {number} rapid_sum - The sum of rapidities used in the transformation.
 */
function changeRelationShipAfterTransform(initialSectorTrapez, rapid_sum){
    let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(initialSectorTrapez);

    let midpoint_boundingbox_before_global = new fabric.Point(initialSectorTrapez.left + initialSectorTrapez.width/2 , initialSectorTrapez.top - initialSectorTrapez.height/2 );

    initialSectorTrapez.parent.ID_text.set('left', initialSectorTrapez.parent.ID_text.start_pos_BL_x * Math.cosh(rapid_sum) + initialSectorTrapez.parent.ID_text.start_pos_BL_y * Math.sinh(rapid_sum) + trapezPointsAsGlobalCoords[3].x);
    initialSectorTrapez.parent.ID_text.set('top', initialSectorTrapez.parent.ID_text.start_pos_BL_x * Math.sinh(rapid_sum) + initialSectorTrapez.parent.ID_text.start_pos_BL_y * Math.cosh(rapid_sum) + trapezPointsAsGlobalCoords[3].y);

    initialSectorTrapez.parent.ID_text.relationship[4] = initialSectorTrapez.parent.ID_text.left - midpoint_boundingbox_before_global.x - 1;
    initialSectorTrapez.parent.ID_text.relationship[5] = initialSectorTrapez.parent.ID_text.top - midpoint_boundingbox_before_global.y + 1;


    for (let jj = 0; jj < initialSectorTrapez.parent.markCircles.length; jj++) {
        initialSectorTrapez.parent.markCircles[jj].set('left', initialSectorTrapez.parent.markCircles[jj].start_pos_BL_x * Math.cosh(rapid_sum) + initialSectorTrapez.parent.markCircles[jj].start_pos_BL_y * Math.sinh(rapid_sum) + trapezPointsAsGlobalCoords[3].x);
        initialSectorTrapez.parent.markCircles[jj].set('top', initialSectorTrapez.parent.markCircles[jj].start_pos_BL_x * Math.sinh(rapid_sum) + initialSectorTrapez.parent.markCircles[jj].start_pos_BL_y * Math.cosh(rapid_sum) + trapezPointsAsGlobalCoords[3].y);

        initialSectorTrapez.parent.markCircles[jj].relationship[4] = initialSectorTrapez.parent.markCircles[jj].left - midpoint_boundingbox_before_global.x - 1;
        initialSectorTrapez.parent.markCircles[jj].relationship[5] = initialSectorTrapez.parent.markCircles[jj].top - midpoint_boundingbox_before_global.y + 1;
    }

    for (let jj = 0; jj < initialSectorTrapez.parent.ticks.length; jj++) {
        let tick_start_point_calc = new fabric.Point(
            initialSectorTrapez.parent.ticks[jj].start_point_BL.x * Math.cosh(rapid_sum) + initialSectorTrapez.parent.ticks[jj].start_point_BL.y * Math.sinh(rapid_sum) + trapezPointsAsGlobalCoords[3].x,
            initialSectorTrapez.parent.ticks[jj].start_point_BL.x * Math.sinh(rapid_sum) + initialSectorTrapez.parent.ticks[jj].start_point_BL.y * Math.cosh(rapid_sum) + trapezPointsAsGlobalCoords[3].y
        );
        let tick_end_point_calc = new fabric.Point(
            initialSectorTrapez.parent.ticks[jj].end_point_BL.x * Math.cosh(rapid_sum) + initialSectorTrapez.parent.ticks[jj].end_point_BL.y * Math.sinh(rapid_sum) + trapezPointsAsGlobalCoords[3].x,
            initialSectorTrapez.parent.ticks[jj].end_point_BL.x * Math.sinh(rapid_sum) + initialSectorTrapez.parent.ticks[jj].end_point_BL.y * Math.cosh(rapid_sum) + trapezPointsAsGlobalCoords[3].y
        );

        let tick_transformed_mid_point = new fabric.Point(
            tick_start_point_calc.x + (tick_end_point_calc.x - tick_start_point_calc.x) * 0.5,
            tick_start_point_calc.y + (tick_end_point_calc.y - tick_start_point_calc.y) * 0.5,
        );

        initialSectorTrapez.parent.ticks[jj].relationship[4] = tick_transformed_mid_point.x - midpoint_boundingbox_before_global.x - 0.5;

        initialSectorTrapez.parent.ticks[jj].relationship[5] =  tick_transformed_mid_point.y - midpoint_boundingbox_before_global.y + 0.5;
    }

    for (let jj = 0; jj < initialSectorTrapez.parent.lineSegments.length; jj++) {

        if (initialSectorTrapez.parent.lineSegments[jj].lineType == "geodesic") {
            let geodesic_start_point_calc = new fabric.Point(
                initialSectorTrapez.parent.lineSegments[jj].start_point_BL.x * Math.cosh(rapid_sum) + initialSectorTrapez.parent.lineSegments[jj].start_point_BL.y * Math.sinh(rapid_sum) + trapezPointsAsGlobalCoords[3].x,
                initialSectorTrapez.parent.lineSegments[jj].start_point_BL.x * Math.sinh(rapid_sum) + initialSectorTrapez.parent.lineSegments[jj].start_point_BL.y * Math.cosh(rapid_sum) + trapezPointsAsGlobalCoords[3].y
            );
            let geodesic_end_point_calc = new fabric.Point(
                initialSectorTrapez.parent.lineSegments[jj].end_point_BL.x * Math.cosh(rapid_sum) + initialSectorTrapez.parent.lineSegments[jj].end_point_BL.y * Math.sinh(rapid_sum) + trapezPointsAsGlobalCoords[3].x,
                initialSectorTrapez.parent.lineSegments[jj].end_point_BL.x * Math.sinh(rapid_sum) + initialSectorTrapez.parent.lineSegments[jj].end_point_BL.y * Math.cosh(rapid_sum) + trapezPointsAsGlobalCoords[3].y
            );

            let geodesic_transformed_mid_point = new fabric.Point(
                geodesic_start_point_calc.x + (geodesic_end_point_calc.x - geodesic_start_point_calc.x) * 0.5,
                geodesic_start_point_calc.y + (geodesic_end_point_calc.y - geodesic_start_point_calc.y) * 0.5,
            );

            initialSectorTrapez.parent.lineSegments[jj].relationship[4] = geodesic_transformed_mid_point.x - midpoint_boundingbox_before_global.x - 0.5;

            initialSectorTrapez.parent.lineSegments[jj].relationship[5] =  geodesic_transformed_mid_point.y - midpoint_boundingbox_before_global.y + 0.5;
        }


        if (initialSectorTrapez.parent.lineSegments[jj].lineType == "polyline"){

            initialSectorTrapez.parent.lineSegments[jj].set('left', initialSectorTrapez.parent.lineSegments[jj].polylineMidPoint_BL.x * Math.cosh(rapid_sum) + initialSectorTrapez.parent.lineSegments[jj].polylineMidPoint_BL.y * Math.sinh(rapid_sum) + trapezPointsAsGlobalCoords[3].x);
            initialSectorTrapez.parent.lineSegments[jj].set('top', initialSectorTrapez.parent.lineSegments[jj].polylineMidPoint_BL.x * Math.sinh(rapid_sum) + initialSectorTrapez.parent.lineSegments[jj].polylineMidPoint_BL.y * Math.cosh(rapid_sum) + trapezPointsAsGlobalCoords[3].y);

            initialSectorTrapez.parent.lineSegments[jj].relationship[4] = initialSectorTrapez.parent.lineSegments[jj].left - midpoint_boundingbox_before_global.x;

            initialSectorTrapez.parent.lineSegments[jj].relationship[5] = initialSectorTrapez.parent.lineSegments[jj].top - midpoint_boundingbox_before_global.y + 1;
        }

        if (initialSectorTrapez.parent.lineSegments[jj].dragPoint !== undefined) {

            dragPoint_transformed_mid_point = new fabric.Point(
                initialSectorTrapez.parent.lineSegments[jj].dragPoint.start_pos_BL_x * Math.cosh(rapid_sum) + initialSectorTrapez.parent.lineSegments[jj].dragPoint.start_pos_BL_y * Math.sinh(rapid_sum) + trapezPointsAsGlobalCoords[3].x,
                initialSectorTrapez.parent.lineSegments[jj].dragPoint.start_pos_BL_x * Math.sinh(rapid_sum) + initialSectorTrapez.parent.lineSegments[jj].dragPoint.start_pos_BL_y * Math.cosh(rapid_sum) + trapezPointsAsGlobalCoords[3].y
            );

            initialSectorTrapez.parent.lineSegments[jj].dragPoint.relationship[4] = dragPoint_transformed_mid_point.x - midpoint_boundingbox_before_global.x - 0.5;
            initialSectorTrapez.parent.lineSegments[jj].dragPoint.relationship[5] = dragPoint_transformed_mid_point.y - midpoint_boundingbox_before_global.y + 0.5;

        }

        if (buildGeodesicTicks == "1"){

            if (initialSectorTrapez.parent.lineSegments[jj].geodesicTicks.length > 0){

                for (let kk = 0; kk < initialSectorTrapez.parent.lineSegments[jj].geodesicTicks.length; kk++){

                    geodesicTick_transformed_mid_point = new fabric.Point(
                        initialSectorTrapez.parent.lineSegments[jj].geodesicTicks[kk].start_point_BL.x * Math.cosh(rapid_sum) + initialSectorTrapez.parent.lineSegments[jj].geodesicTicks[kk].start_point_BL.y * Math.sinh(rapid_sum) + trapezPointsAsGlobalCoords[3].x,
                        initialSectorTrapez.parent.lineSegments[jj].geodesicTicks[kk].start_point_BL.x * Math.sinh(rapid_sum) + initialSectorTrapez.parent.lineSegments[jj].geodesicTicks[kk].start_point_BL.y * Math.cosh(rapid_sum) + trapezPointsAsGlobalCoords[3].y
                    );

                    initialSectorTrapez.parent.lineSegments[jj].geodesicTicks[kk].relationship[4] = geodesicTick_transformed_mid_point.x - midpoint_boundingbox_before_global.x - 0.5;
                    initialSectorTrapez.parent.lineSegments[jj].geodesicTicks[kk].relationship[5] = geodesicTick_transformed_mid_point.y - midpoint_boundingbox_before_global.y + 0.5;

                }


            }
        }
    }
}

/**
 * Changes the snap status of sectors based on their proximity.
 *
 * @param {number} initialSectorID - The ID of the initial sector.
 *
 * @returns {Promise} A Promise that resolves when the snap status has been changed.
 */
function changeSnapStatus(initialSectorID) {

    return new Promise((resolve) => {
        const initialSector = sectors[initialSectorID];
        const {neighbourhood, snapStatus} = initialSector;


        for (let ii = 0; ii < 4; ii++) {
            const nbh = neighbourhood[ii];
            if (nbh > -1) {

                const [point_1, point_2, point_a, point_b] = getPointsOfOppositeEdges(initialSectorID, nbh);


                const dist_1a = distance(point_1, point_a);
                const dist_2b = distance(point_2, point_b);


                //snap gets o or 1 when both dists are lower than epsilon ? 1 : 0 shorter for double ifs
                const snapvalue = dist_1a < epsilon && dist_2b < epsilon ? 1 : 0;

                snapStatus[ii] = snapvalue;

                sectors[nbh].snapStatus[(ii + 2) % 4] = snapvalue;
            }
        }

        resolve();
    })
}

/**
 * Continues a geodesic line segment in the application.
 *
 * @param {number} geodesicToContinue - The ID of the geodesic line segment to continue.
 *
 */
async function continueGeodesic(geodesicToContinue) {

    if (lines[geodesicToContinue][lines[geodesicToContinue].length - 1].lineType !== 'geodesic') {
        return
    }

    let xt1;
    let xt2;
    let yt1;
    let yt2;

    let dxt12;
    let dyt12;

    let slopeAngle;

    let immediatehistory = [0];

    kantenindex = -1;

    if (typeof geodesicToContinue === 'undefined' || geodesicToContinue == -1) {
        return;
    } else {

        if ( lines[geodesicToContinue].length > 0) {


            if(lines[geodesicToContinue][lines[geodesicToContinue].length-1].dragPoint !== undefined){

                canvas.remove(lines[geodesicToContinue][lines[geodesicToContinue].length - 1].dragPoint);
                delete lines[geodesicToContinue][lines[geodesicToContinue].length - 1].dragPoint;

            }

            let geodesic_end_point = new fabric.Point(lines[geodesicToContinue][lines[geodesicToContinue].length - 1].calcLinePoints().x2, lines[geodesicToContinue][lines[geodesicToContinue].length - 1].calcLinePoints().y2);
            geodesic_end_point = fabric.util.transformPoint(geodesic_end_point, lines[geodesicToContinue][lines[geodesicToContinue].length - 1].calcTransformMatrix());

            let xg2 = geodesic_end_point.x;
            let yg2 = geodesic_end_point.y;

            let geodesic_start_point = new fabric.Point(lines[geodesicToContinue][lines[geodesicToContinue].length - 1].calcLinePoints().x1, lines[geodesicToContinue][lines[geodesicToContinue].length - 1].calcLinePoints().y1);
            geodesic_start_point = fabric.util.transformPoint(geodesic_start_point, lines[geodesicToContinue][lines[geodesicToContinue].length - 1].calcTransformMatrix());

            let xg1 = geodesic_start_point.x;
            let yg1 = geodesic_start_point.y;

            let dxg_tmp = xg2 - xg1;
            let dyg_tmp = yg2 - yg1;

            let dxg = dxg_tmp * 0.1;
            let dyg = dyg_tmp * 0.1;

            let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[lines[geodesicToContinue][lines[geodesicToContinue].length - 1].parentSector[0]].trapez);

            let kantenParameter = getKantenParameter(lines[geodesicToContinue][lines[geodesicToContinue].length - 1].parentSector[0], xg1, yg1, dxg, dyg);

            let alpha = kantenParameter[0];
            let lambda = kantenParameter[1];
            let kantenIndex = kantenParameter[2];

            xt1 = trapezPointsAsGlobalCoords[kantenIndex].x;
            xt2 = trapezPointsAsGlobalCoords[(kantenIndex + 1) % 4].x;
            yt1 = trapezPointsAsGlobalCoords[kantenIndex].y;
            yt2 = trapezPointsAsGlobalCoords[(kantenIndex + 1) % 4].y;

            dxt12 = xt2 - xt1;
            dyt12 = yt2 - yt1;

            let neighbourSectorID = sectors[lines[geodesicToContinue][lines[geodesicToContinue].length - 1].parentSector[0]].neighbourhood[kantenIndex];

            let lineSegmentColor = lines[geodesicToContinue][lines[geodesicToContinue].length-1].fill;

            let lineSegmentStrokeWidth = lines[geodesicToContinue][lines[geodesicToContinue].length-1].strokeWidth;

            let parentSectorID = lines[geodesicToContinue][lines[geodesicToContinue].length-1].parentSector[0];

            let lineSegmentContinue;

            let lineStart_x = xg2;
            let lineStart_y = yg2;
            let lineEnd_x = xt1 + dxt12 * alpha;
            let lineEnd_y = yt1 + dyt12 * alpha;

            if(Math.abs(lineEnd_x - lineStart_x) > epsilon || Math.abs(lineEnd_y - lineStart_y) > epsilon) {

                if (animatedLineDrawingOn == "1"){
                    lineSegmentContinue = await animateDrawLine(lineSegmentColor, lineSegmentStrokeWidth, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y)
                }else{
                    lineSegmentContinue = drawLineSegment(lineSegmentColor, lineSegmentStrokeWidth, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y)
                }




                lineSegmentContinue.ID = [geodesicToContinue, lines[geodesicToContinue].length];
                lines[geodesicToContinue].push(lineSegmentContinue);
                immediatehistory.push(lineSegmentContinue.ID);


                // Weitere Aktionen, die auf die Animation folgen, können hier eingefügt werden.

                if (buildGeodesicTicks == "1") {
                    drawGeodesicTicks(geodesicToContinue);
                }


            }

            /*
            lines[geodesicToContinue][lines[geodesicToContinue].length - 1].set({x1: geodesic_start_point.x, y1: geodesic_start_point.y});

            lines[geodesicToContinue][lines[geodesicToContinue].length - 1].set({x2: geodesic_start_point.x + dxg * lambda, y2: geodesic_start_point.y + dyg * lambda});

            //WICHTIG: WARUM DIESE EINSTELLUNG FUNKTIONIERT VERSTEHE ICH NICHT!!!
            //Damit das zu setzende Geodätenstück nicht falsch gedreht wird, muss der Winkel eingestellt werden
            lines[geodesicToContinue][lines[geodesicToContinue].length - 1].set({angle: 0});


            lines[geodesicToContinue][lines[geodesicToContinue].length - 1].setCoords();

            */

            if (turnLorentzTransformOn == 1){

                getStartAndEndPointCoordsBeforeLorentztransform(lines[geodesicToContinue][lines[geodesicToContinue].length - 1])

            }

            //lines[geodesicToContinue][lines[geodesicToContinue].length - 1].relationship = getRelationship(lines[geodesicToContinue][lines[geodesicToContinue].length - 1], lines[geodesicToContinue][lines[geodesicToContinue].length - 1].parentSector[0]);


            //Fortsetzung im nächsten Sektor

            if (turnLorentzTransformOn !== 1){
                slopeAngle = Math.acos((dxg * dxt12 + dyg * dyt12) / ((Math.sqrt(dxg * dxg + dyg * dyg)) * (Math.sqrt(dxt12 * dxt12 + dyt12 * dyt12))));
            }

            for (lauf = 0; lauf < laufContinueGeodesicMax; lauf++) {


                if (animatedLineDrawingOn === "1" && lineEndsAtUnsnappedBorder === "1") {
                    if (sectors[parentSectorID].snapStatus[kantenIndex] !== 1) {
                        drawDragPoint(geodesicToContinue);
                        break;
                    }
                }

                if (neighbourSectorID === -1 || sectors[neighbourSectorID].trapez.opacity !== startOpacity) {
                    drawDragPoint(geodesicToContinue);
                    break
                }

                if (goThroughStar !== "1"){
                    if (sectors[neighbourSectorID].fill === '#e2e2e2') {
                        drawDragPoint(geodesicToContinue);
                        break
                    }
                }

                let neighbourTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[neighbourSectorID].trapez)

                //Übergangspunkte übernehmen
                xt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 3) % 4].x;
                xt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 2) % 4].x;
                yt1_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 3) % 4].y;
                yt2_uebergang = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 2) % 4].y;

                dxt12_uebergang = xt2_uebergang - xt1_uebergang;
                dyt12_uebergang = yt2_uebergang - yt1_uebergang;

                x_kante_uebergang = xt1_uebergang + alpha * dxt12_uebergang;
                y_kante_uebergang = yt1_uebergang + alpha * dyt12_uebergang;

                //Übergangsrichtung ermitteln

                if (turnLorentzTransformOn == 1){
                    let rapid_base;
                    if (Math.abs(xt1 - xt2) > Math.abs(yt1 - yt2)) {
                            rapid_base = Math.atanh((yt2 - yt1) / (xt2 - xt1))
                    }else {
                            rapid_base = Math.atanh( (xt2 - xt1) / (yt2 - yt1 ) )
                        }


                    let rapid_target;

                    if (Math.abs(xt1_uebergang - xt2_uebergang) > Math.abs(yt1_uebergang - yt2_uebergang) ){

                            rapid_target = Math.atanh((yt2_uebergang - yt1_uebergang) / (xt2_uebergang - xt1_uebergang))
                    }else {
                            rapid_target = Math.atanh( (xt2_uebergang - xt1_uebergang) / (yt2_uebergang - yt1_uebergang))
                    }


                    let rapid_sum = rapid_base - rapid_target;

                    dxg_tmp = dxg;
                    dyg_tmp = dyg;

                    if (lines[geodesicToContinue].operational !== false) {
                        dxg = Math.cosh(-rapid_sum) * dxg_tmp + Math.sinh(-rapid_sum) * dyg_tmp;
                        dyg = Math.sinh(-rapid_sum) * dxg_tmp + Math.cosh(-rapid_sum) * dyg_tmp;
                    }else{

                        dxg = Math.cosh(-sectors[neighbourSectorID].rapidity) * dxg_tmp + Math.sinh(-sectors[neighbourSectorID].rapidity) * dyg_tmp;
                        dyg = Math.sinh(-sectors[neighbourSectorID].rapidity) * dxg_tmp + Math.cosh(-sectors[neighbourSectorID].rapidity) * dyg_tmp;
                    }
                }else{
                    dxg  = dxt12_uebergang * Math.cos(-slopeAngle) - dyt12_uebergang * Math.sin(-slopeAngle);
                    dyg  = dxt12_uebergang * Math.sin(-slopeAngle) + dyt12_uebergang * Math.cos(-slopeAngle);

                }


                //Schnittpunkte mit den neuen Sektorkanten ermitteln

                kantenParameter = getKantenParameter(neighbourSectorID, x_kante_uebergang, y_kante_uebergang, dxg, dyg);

                alpha_2 = kantenParameter[0];
                lambda = kantenParameter[1];
                kantenIndex = kantenParameter[2];

                xt1 = neighbourTrapezPointsAsGlobalCoords[kantenIndex].x;
                xt2 = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 1) % 4].x;
                yt1 = neighbourTrapezPointsAsGlobalCoords[kantenIndex].y;
                yt2 = neighbourTrapezPointsAsGlobalCoords[(kantenIndex + 1) % 4].y;

                dxt12 = xt2 - xt1;
                dyt12 = yt2 - yt1;

                lineSegmentColor = lines[geodesicToContinue][0].fill;
                lineSegmentStrokeWidth = lines[geodesicToContinue][0].strokeWidth;
                parentSectorID = neighbourSectorID;

                lineStart_x = x_kante_uebergang;
                lineStart_y = y_kante_uebergang;
                lineEnd_x = xt1 + alpha_2 * dxt12;
                lineEnd_y = yt1 + alpha_2 * dyt12;

                if(Math.abs(lineEnd_x - lineStart_x) > epsilon || Math.abs(lineEnd_y - lineStart_y) > epsilon) {

                    if (animatedLineDrawingOn == "1"){
                        lineSegmentContinue = await animateDrawLine(lineSegmentColor, lineSegmentStrokeWidth, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y)
                    }else{
                        lineSegmentContinue = drawLineSegment(lineSegmentColor, lineSegmentStrokeWidth, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y)
                    }

                    lineSegmentContinue.ID = [geodesicToContinue, lines[geodesicToContinue].length];

                    lines[geodesicToContinue].push(lineSegmentContinue);

                    immediatehistory.push(lineSegmentContinue.ID);

                    if (buildGeodesicTicks == "1"){
                        drawGeodesicTicks(geodesicToContinue)
                    }
                }


                if (turnLorentzTransformOn == 1){
                    getStartAndEndPointCoordsBeforeLorentztransform(lineSegmentContinue)
                }

                if (turnLorentzTransformOn !== 1){
                    slopeAngle = Math.acos((dxg * dxt12 + dyg * dyt12) / ((Math.sqrt(dxg * dxg + dyg * dyg)) * (Math.sqrt(dxt12 * dxt12 + dyt12 * dyt12))));
                }



                neighbourSectorID = sectors[lineSegmentContinue.parentSector[0]].neighbourhood[kantenIndex];


                alpha = alpha_2
            }
        }

    }

    history.push(immediatehistory);


}

/**
 * removes a geodesic including its drag points and ticks from the canvas
 * @param geodesicToDelete - the ID of the geodesic that is removed
 */
function deleteWholeGeodesic(geodesicToDelete) {

    let immediatehistory = [2];

    if(chosenLineGlobalID !== -1) {

        immediatehistory.push(geodesicToDelete);

        for (let ii = lines[geodesicToDelete].length - 1; ii >= 0; ii--) {

            if(lines[geodesicToDelete][ii].parentSector[0] !== -1) {

                let entryToSplice_tmp = sectors[lines[geodesicToDelete][ii].parentSector[0]].lineSegments[lines[geodesicToDelete][ii].parentSector[1]].parentSector[1];

                sectors[lines[geodesicToDelete][ii].parentSector[0]].lineSegments.splice(sectors[lines[geodesicToDelete][ii].parentSector[0]].lineSegments[lines[geodesicToDelete][ii].parentSector[1]].parentSector[1], 1);

                for (let jj = 0; jj < sectors[lines[geodesicToDelete][ii].parentSector[0]].lineSegments.length; jj++) {

                    if (entryToSplice_tmp < sectors[lines[geodesicToDelete][ii].parentSector[0]].lineSegments[jj].parentSector[1]) {

                        sectors[lines[geodesicToDelete][ii].parentSector[0]].lineSegments[jj].parentSector[1] -= 1

                    }

                }
            }

            let lineSegment = lines[geodesicToDelete][ii];
            //console.log(lineSegment)

            if(lines[geodesicToDelete][lines[geodesicToDelete].length-1].dragPoint!==undefined){
                canvas.remove(lines[geodesicToDelete][lines[geodesicToDelete].length-1].dragPoint);
                delete lines[geodesicToDelete][lines[geodesicToDelete].length-1].dragPoint;
            }

            if (buildGeodesicTicks == "1"){

                //console.log(lineSegment.geodesicTicks)

                if(lineSegment.geodesicTicks.length > 0){
                    for (let jj = lineSegment.geodesicTicks.length; jj >= 0; jj--){
                        canvas.remove(lineSegment.geodesicTicks[jj]);
                        delete lineSegment.geodesicTicks[jj]
                    }

                }
            }

            if (lineSegment.lineType == 'geodesic'){
                let geodesic_start_point = new fabric.Point(lineSegment.calcLinePoints().x1, lineSegment.calcLinePoints().y1);
                geodesic_start_point = fabric.util.transformPoint(geodesic_start_point, lineSegment.calcTransformMatrix());

                let xg1 = geodesic_start_point.x;
                let yg1 = geodesic_start_point.y;

                let geodesic_end_point = new fabric.Point(lineSegment.calcLinePoints().x2, lineSegment.calcLinePoints().y2);
                geodesic_end_point = fabric.util.transformPoint(geodesic_end_point, lineSegment.calcTransformMatrix());

                let xg2 = geodesic_end_point.x;
                let yg2 = geodesic_end_point.y;

                lineSegmentParameter = [lineSegment.lineType, lineSegment.stroke, lineSegment.strokeWidth, lineSegment.parentSector[0], xg1, yg1, xg2, yg2];

                immediatehistory.push(lineSegmentParameter);
            }

            if (lineSegment.lineType == 'polyline'){

                lineSegment.points = getPolylinePointsImGlobalCoords(lineSegment);

                lineSegmentParameter = [lineSegment.lineType, lineSegment.stroke, lineSegment.strokeWidth, lineSegment.parentSector[0], lineSegment.points];

                immediatehistory.push(lineSegmentParameter);
            }



            canvas.remove(lineSegment)

        }



        history.push(immediatehistory);

        lines[geodesicToDelete] = [];

    } else {

        let vectorPart = canvas.getActiveObject();
        let vectorGlobalID = vectorPart.ID;

        let isVector = false;
        for (let ii = 0; ii < vectors.length; ii++) {
            if(vectors[ii].includes(vectorPart) !== false) {
                isVector = true;
                break;
            }
        }

        if(isVector === true) {
            immediatehistory.push('vector', vectorGlobalID, vectors[vectorGlobalID][0].parentSector);
            let vectorPointX = vectors[vectorGlobalID][0].left;
            let vectorPointY = vectors[vectorGlobalID][0].top;
            let vectorHeadX = vectors[vectorGlobalID][2].left;
            let vectorHeadY = vectors[vectorGlobalID][2].top;
            immediatehistory.push(vectorPointX, vectorPointY, vectorHeadX, vectorHeadY);
            canvas.remove(vectors[vectorGlobalID][0], vectors[vectorGlobalID][1], vectors[vectorGlobalID][2]);
            if(vectors[vectorGlobalID][0].parentSector !== undefined) {
                sectors[vectors[vectorGlobalID][0].parentSector[0]].vectors.splice(vectors[vectorGlobalID][0].parentSector[1], 1);
            }
            vectors.splice(vectorGlobalID, 1);

            for (let ii = 0; ii < vectors.length; ii++) {
                let vectorPointParentID = getParentSectorOfPoint(new fabric.Point(vectors[ii][0].left, vectors[ii][0].top));
                vectors[ii][0].parentSector = [vectorPointParentID, sectors[vectorPointParentID].vectors.indexOf(vectors[ii])];
                vectors[ii][0].ID = vectors.indexOf(vectors[ii]);
                vectors[ii][1].ID = vectors.indexOf(vectors[ii]);
                vectors[ii][2].ID = vectors.indexOf(vectors[ii]);
            }
        } else {
            let isVectorDuplicate = false;
            for (let ii = 0; ii < vectorDuplicates.length; ii++) {
                if(vectorDuplicates[ii].includes(vectorPart) !== false) {
                    isVectorDuplicate = true;
                    break;
                }
            }
            if(isVectorDuplicate === true) {
                immediatehistory.push('duplicate', vectorGlobalID, vectorDuplicates[vectorGlobalID][0].parentSector);
                let vectorPointX = vectorDuplicates[vectorGlobalID][0].left;
                let vectorPointY = vectorDuplicates[vectorGlobalID][0].top;
                let vectorHeadX = vectorDuplicates[vectorGlobalID][2].left;
                let vectorHeadY = vectorDuplicates[vectorGlobalID][2].top;
                immediatehistory.push(vectorPointX, vectorPointY, vectorHeadX, vectorHeadY);
                canvas.remove(vectorDuplicates[vectorGlobalID][0], vectorDuplicates[vectorGlobalID][1], vectorDuplicates[vectorGlobalID][2]);
                if(vectorDuplicates[vectorGlobalID][0].parentSector !== undefined) {
                    sectors[vectorDuplicates[vectorGlobalID][0].parentSector[0]].vectorDuplicates.splice(vectorDuplicates[vectorGlobalID][0].parentSector[1], 1);
                }
                vectorDuplicates.splice(vectorGlobalID, 1);

                for (let ii = 0; ii < vectorDuplicates.length; ii++) {
                    let vectorPointParentID = getParentSectorOfPoint(new fabric.Point(vectorDuplicates[ii][0].left, vectorDuplicates[ii][0].top));
                    vectorDuplicates[ii][0].parentSector = [vectorPointParentID, sectors[vectorPointParentID].vectorDuplicates.indexOf(vectorDuplicates[ii])];
                    vectorDuplicates[ii][0].ID = vectorDuplicates.indexOf(vectorDuplicates[ii]);
                    vectorDuplicates[ii][1].ID = vectorDuplicates.indexOf(vectorDuplicates[ii]);
                    vectorDuplicates[ii][2].ID = vectorDuplicates.indexOf(vectorDuplicates[ii]);
                }

                /*for (let ii = 0; ii < vectors.length; ii++) {
                    if(vectors[ii][0].duplicateGlobalIDs.includes(vectorGlobalID)) {
                        vectors[ii][0].duplicateGlobalIDs.splice(vectors[ii][0].duplicateGlobalIDs.indexOf(vectorGlobalID), 1);
                    }
                } */

            }
        }
        history.push(immediatehistory);

    }

}

/**
 * calculates the distance between two points in 2D
 * @param point_1 - x and y coords of the first point
 * @param point_2 - x and y coords of the second point
 * @returns {number} - the distance between them
 */
function distance(point_1, point_2) {
    const dx = point_2.x - point_1.x;
    const dy = point_2.y - point_1.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
}

/**
 * calculates the distance between a given point to a given straight line
 * @param point_x - x coord of the given point
 * @param point_y - y coord of the given point
 * @param point_line_x - x coord of the start point of the given line
 * @param point_line_y - y coord of the start point of the given line
 * @param direction_x - x difference between start an end point of the line
 * @param direction_y - y difference between start and end point of the line
 * @returns {number} - the closest distance between the point and the line
 */
function distancePointStraightLine(point_x, point_y, point_line_x, point_line_y, direction_x, direction_y) {
    const dx = point_x - point_line_x;
    const dy = point_y - point_line_y;
    return Math.abs((dx * direction_y - dy * direction_x) / Math.sqrt(direction_x * direction_x + direction_y * direction_y))
}

/**
 * Calculates the signed perpendicular distance between a point and a straight line in absolute or non-absolute value
 * depending on the comparision between pointSectorIDBefore and sec
 *
 * @param {number} point_x - The x-coordinate of the point.
 * @param {number} point_y - The y-coordinate of the point.
 * @param {number} point_line_x - The x-coordinate of a point on the line.
 * @param {number} point_line_y - The y-coordinate of a point on the line.
 * @param {number} direction_x - The x-component of the direction vector of the line.
 * @param {number} direction_y - The y-component of the direction vector of the line.
 * @param {number} pointSectorIDBefore - The ID of the sector containing the point before it moved.
 * @returns {number} The signed perpendicular distance between the point and the line.
 */
function distancePointStraightLine2(point_x, point_y, point_line_x, point_line_y, direction_x, direction_y, pointSectorIDBefore) {
    let point = new fabric.Point(point_x, point_y);
    let sec = getParentSectorOfPoint(point);
    const dx = point_x - point_line_x;
    const dy = point_y - point_line_y;
    if (sec === undefined || sec !== pointSectorIDBefore) {
        return (dy * direction_x - dx * direction_y) / Math.sqrt(direction_x * direction_x + direction_y * direction_y)
    } else {
        return Math.abs((dx * direction_y - dy * direction_x) / Math.sqrt(direction_x * direction_x + direction_y * direction_y))
    }

}

/**
 * gets 4 parameters of the closest sector edge of a point inside the sector
 * @param point - the point object which contains the x and y coordinate
 * @param pointSectorIDBefore - the parent sector ID with respect to the points location
 * @returns {{closestEdge: number, pointSectorID: number, minDistance: number, snapStatusOfClosestEdge: number}}
 *  - the index of the closest edge
 *  - the parent sector ID of the given point
 *  - the distance in pixels to the closest sector edge
 *  - a boolean whether the closest edge is snapped or not
 */
function getClosestEdgeOfPointParameters (point, pointSectorIDBefore) {

    let sec = getParentSectorOfPoint(point);
    let pointSectorID;
    let closestEdge;
    let minDistance;
    let snapStatusOfClosestEdge;

    if(sec === undefined || sec !== pointSectorIDBefore) {
        pointSectorID = pointSectorIDBefore;
    } else {
        pointSectorID = sec;
    }

    let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[pointSectorID].trapez);

    let distancesToEdges = [];

    for (let kk = 0; kk < 4; kk++) {

       let xt1 = trapezPointsAsGlobalCoords[kk].x;
       let xt2 = trapezPointsAsGlobalCoords[(kk + 1) % 4].x;
       let yt1 = trapezPointsAsGlobalCoords[kk].y;
       let yt2 = trapezPointsAsGlobalCoords[(kk + 1) % 4].y;

       let distanceToEdge = distancePointStraightLine2(point.x, point.y, xt1, yt1, xt2 - xt1, yt2 - yt1, pointSectorIDBefore);
       distancesToEdges.push(distanceToEdge);
    }

    minDistance = Math.min(...distancesToEdges);
    closestEdge = distancesToEdges.indexOf(minDistance);
    snapStatusOfClosestEdge = sectors[pointSectorID].snapStatus[closestEdge];

    return {pointSectorID, closestEdge, minDistance, snapStatusOfClosestEdge};
}

/**
 * Draws an arc representing a deficit angle between sectors on the canvas.
 *
 * @param {number} initialSectorID - The ID of the initial sector where the deficit angle is located.
 * @param {number} initialArcID_onSector - The ID of the initial arc on the sector's trapezoid.
 * @param {number} deficitAngleRad - The deficit angle in radians to be represented by the arc.
 */
function drawAngleArc(initialSectorID, initialArcID_onSector, deficitAngleRad){

    let point_1 = sectors[initialSectorID].trapez.points[initialArcID_onSector];
    let point_2 = sectors[initialSectorID].trapez.points[(initialArcID_onSector +3) % 4 ];

    let dx = point_2.x - point_1.x;
    let dy = point_2.y - point_1.y;

    let angleToRotate = sectors[initialSectorID].trapez.angle + toDegree(Math.atan2(dy, dx));
    let initialTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[initialSectorID].trapez);
    let arcRadius = sectors[initialSectorID].trapez.height * 1.2;

    let startAngle;
    let endAngle;


    if (deficitAngleRad < 0){
        startAngle = deficitAngleRad;
        endAngle = 0;
    }else{
        startAngle = 0;
        endAngle = deficitAngleRad;
    }

    let arc = new fabric.Circle({
        radius: arcRadius,
        left: initialTrapezPointsAsGlobalCoords[initialArcID_onSector].x,
        top: initialTrapezPointsAsGlobalCoords[initialArcID_onSector].y,
        angle: angleToRotate,
        startAngle: startAngle,
        endAngle: endAngle,
        stroke: 'red',
        strokeWidth: 2,
        fill: '',
        originY:'center',
        originX:'center',
        objectCaching: false,
        lockMovementX: false,
        lockMovementY: false,
        lockScalingX: true,
        lockScalingY: true,
        selectable: true,
        hoverCursor: 'pointer',
        perPixelTargetFind: true,
        opacity: deficitAngleVisualizeGroupOpacity,
    });

    canvas.add(arc);
    deficitAngleVisualizeGroup.add(arc)
}

/**
 * adds markings along a geodesic to indicate intervals of the same distance
 * @param lineID - the ID of the line on which the ticks are to be drawn
 */
function drawGeodesicTicks(lineID){

    let geodesicTicksDistanceConstant
        = 40;

    let wholeLineLength = 0;

    let remBefore;
    let lastLineSegmentWithRem;

    if (lines[lineID].remLast !== undefined){
        remBefore = lines[lineID].remLast
    }else{
        remBefore = 0
    }

    //console.log("start last rem:", lines[lineID].lastLineSegmentWithRem)

    if(lines[lineID].lastLineSegmentWithRem !== undefined){
        lastLineSegmentWithRem = lines[lineID].lastLineSegmentWithRem + 1
    }else{
        lastLineSegmentWithRem = 0
    }

    for (let ii = lastLineSegmentWithRem; ii < lines[lineID].length; ii++){

        let lineSegment = lines[lineID][ii];

        let lineStart_x = lineSegment.x1;
        let lineStart_y = lineSegment.y1;
        let lineEnd_x = lineSegment.x2;
        let lineEnd_y = lineSegment.y2;

        let delta_x = lineEnd_x - lineStart_x;
        let delta_y = lineEnd_y - lineStart_y;

        let velocityFactor = Math.abs(delta_x) / Math.abs(delta_y);
        //console.log({velocityFactor})

        let geodesicTicksDistanceToUse;

        if (turnLorentzTransformOn == 1){
            geodesicTicksDistanceToUse = geodesicTicksDistanceConstant * Math.sqrt( (1 + velocityFactor * velocityFactor) / (1 - velocityFactor * velocityFactor) )
        } else{
            geodesicTicksDistanceToUse = geodesicTicksDistanceConstant
        }

        //let delta_x_normed = 1/(Math.sqrt((delta_x * delta_x) + (delta_y * delta_y))) * delta_x;
        //let delta_y_normed = 1/(Math.sqrt((delta_x * delta_x) + (delta_y * delta_y))) * delta_y;

        if (turnLorentzTransformOn == 1){
            remBefore = remBefore * Math.sqrt( (1 + velocityFactor * velocityFactor) / (1 - velocityFactor * velocityFactor) )
        }


        let actualLengthToDivide = remBefore + lineSegment.lineSegmentLength;

        //rem: remainder, quo: Quotient
        let rem = actualLengthToDivide % geodesicTicksDistanceToUse;

        let quo = (actualLengthToDivide - rem) / geodesicTicksDistanceToUse;

        //console.log("LineSegment:", ii);
        //console.log("remBefore:", remBefore)
        //console.log("lineSegmentLength:", lineSegment.lineSegmentLength)
        //console.log("actualLengthToDivide:", actualLengthToDivide)
        //console.log("quo:", quo);
        //console.log("rem:", rem);



        for (let jj = 1; jj < quo + 1; jj++){

            let tickLambda = (jj * geodesicTicksDistanceToUse - remBefore) / lineSegment.lineSegmentLength;
            //console.log("tickLambda:", tickLambda)

            let newTickPoint = new fabric.Point(
                lineStart_x + delta_x * tickLambda,
                lineStart_y + delta_y * tickLambda

            );
            //console.log("set Tick by:", jj * geodesicTicksDistanceToUse - remBefore)

            let geodesicTick;

            let geodesicTickColor = lineSegment.fill;

            geodesicTick = new fabric.Circle(
                {
                    radius: 5,
                    fill: geodesicTickColor,
                    left: newTickPoint.x,
                    top:  newTickPoint.y,
                    evented: false,
                    objectCaching: false,
                    lockMovementX: false,
                    lockMovementY: false,
                    lockScalingX: true,
                    lockScalingY: true,
                    selectable: false,
                    originX: 'center',
                    originY: 'center',
                    hasBorders: false,
                    hasControls: false,
                    opacity: 0.8
                }
            );

            canvas.add(geodesicTick);

            if (lineSegment.parentSector[0] !== -1){
                geodesicTick.relationship = getRelationship(geodesicTick, lineSegment.parentSector[0]);

                let geodesicTickStart_point_BL = {x: geodesicTick.left, y: geodesicTick.top};
                geodesicTick.start_point_BL = getPointCoordsBeforeLorentztransform(geodesicTickStart_point_BL, sectors[lineSegment.parentSector[0]].trapez)
                geodesicTick.start_pos_BL_x = geodesicTick.start_point_BL.x
                geodesicTick.start_pos_BL_y = geodesicTick.start_point_BL.y
            }

            lineSegment.geodesicTicks.push(geodesicTick);

        }



            if (turnLorentzTransformOn == 1){
                remBefore = rem * Math.sqrt( (1 - velocityFactor * velocityFactor) / (1 + velocityFactor * velocityFactor) )
            }else{
                remBefore = rem
            }


    }

    lines[lineID].remLast = remBefore;

    lines[lineID].lastLineSegmentWithRem = lines[lineID].length - 1;

    //console.log("save last with rem:", lines[lineID].lastLineSegmentWithRem);

    //console.log("-----------------------------------")

}

/**
 * adds a drag point to the end of a line which can be grabbed to change the end point of the line
 * @param lineToGivePoint - the ID of the line on which the drag point is to be drawn
 */
function drawDragPoint(lineToGivePoint) {

    if (typeof lineToGivePoint === 'undefined' || lineToGivePoint == -1) {
        return;
    }
    if (lines[lineToGivePoint][lines[lineToGivePoint].length-1] == undefined){
        return
    }
    if(lines[lineToGivePoint][lines[lineToGivePoint].length-1].dragPoint !== undefined){
        canvas.remove(lines[lineToGivePoint][lines[lineToGivePoint].length - 1].dragPoint);
        delete lines[lineToGivePoint][lines[lineToGivePoint].length - 1].dragPoint;
    }

    let lineSegment = lines[lineToGivePoint][lines[lineToGivePoint].length - 1];

    let line_end_point;

    if(lines[lineToGivePoint][lines[lineToGivePoint].length - 1].lineType == 'geodesic') {
        line_end_point = new fabric.Point(lineSegment.calcLinePoints().x2, lineSegment.calcLinePoints().y2);
        line_end_point = fabric.util.transformPoint(line_end_point, lineSegment.calcTransformMatrix());

    }

    if (lines[lineToGivePoint][lines[lineToGivePoint].length - 1].lineType == 'polyline') {

        /*
        ACHTUNG!!!
        Die Punkte der polyline werden in globalen Koordinaten angegeben.
        Hier funktioniert die Funktion lineSegment.calcLinePoints() nicht.
        Um die aktuelle Position von Punkten im globalen Koordinatensystem zu bekommen,
        kann nicht die selbe Methode wie fuer einfache Linien angewandt werden.
        Loesung:    Punkte der Linie nehmen und davon das .pathOffset abziehen
                    anschließend die Transformation wie gewohnt anwenden.
        */

        line_end_point_x = lines[lineToGivePoint][lines[lineToGivePoint].length - 1].points[lines[lineToGivePoint][lines[lineToGivePoint].length - 1].points.length - 1].x;
        line_end_point_y = lines[lineToGivePoint][lines[lineToGivePoint].length - 1].points[lines[lineToGivePoint][lines[lineToGivePoint].length - 1].points.length - 1].y;
        line_end_point_x -= lines[lineToGivePoint][lines[lineToGivePoint].length - 1].pathOffset.x;
        line_end_point_y -= lines[lineToGivePoint][lines[lineToGivePoint].length - 1].pathOffset.y;
        line_end_point = new fabric.Point(line_end_point_x, line_end_point_y);

        line_end_point = fabric.util.transformPoint(line_end_point, lineSegment.calcTransformMatrix());
    }

    let dragPointOpacity = 1.0;

    if (buildTicks == "1"){
        dragPointOpacity = 0.5
    }

    lineSegment.dragPoint = new fabric.Circle({
        originX: 'center',
        originY: 'center',
        left: line_end_point.x,
        top: line_end_point.y,
        radius: dragPointRadius,
        stroke: 'black',
        strokeWidth: 2,
        fill: lineSegment.stroke,
        perPixelTargetFind: false,
        hasBorders: false,
        padding: dragPointPadding,
        objectCaching: false,
        selectable: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        evented: true,
        hoverCursor: 'crosshair',
        opacity: dragPointOpacity,
    });

    lineSegment.dragPoint.on('mousedown',function(o){

        let dragPointPoint = new fabric.Point(this.left, this. top);
        for (let kk = 0; kk < sectors.length; kk++){
            if(sectorContainsPoint(sectors[kk].trapez, dragPointPoint)){
                if (sectors[kk].ID !== lineSegment.parentSector[0]){
                    let stackIdx = canvas.getObjects().indexOf(sectors[kk].ID_text);
                    if (stackIdx > canvas.getObjects().indexOf(sectors[lineSegment.parentSector[0]].ID_text)){
                        return

                    }
                }
            }

        }


        showSectorAreaInfobox(false);
        showDeficitAngleInfobox(false);
        showVertices(false);

        chosenLineGlobalID = lineSegment.ID[0];
        showGeodesicButtons(true);

        if (showExerciseBox == "1") {
            if (currentSlide.checkBoxesWithText !== undefined) {
                for (let ii = 0; ii < currentSlide.checkBoxesWithText.length; ii++) {
                    if (currentSlide.checkBoxesWithText[ii].condition[0] == 'choseGeodesic') {
                        checkCheckBoxCondition();
                        console.log('test')
                    }
                }

            }
        }

        if (autoSetOnDraw == "1") {
            sectors[lineSegment.parentSector[0]].trapez.bringToFront();
            updateMinions(sectors[lineSegment.parentSector[0]].trapez)
        }

        for (let kk = 0; kk < lines.length; kk++){
            for (let ll = 0; ll < lines[kk].length; ll++)
                lines[kk][ll].strokeWidth = lineStrokeWidthWhenNotSelected ;
        }

        for (let kk = lines[chosenLineGlobalID].length - 1; kk >= 0; kk--) {
            lines[chosenLineGlobalID][kk].strokeWidth = lineStrokeWidthWhenSelected ;
        }

        let pointer = canvas.getPointer(o.e);
        let points = [pointer.x, pointer.y, pointer.x, pointer.y];
        if (lines[lineSegment.ID[0]].length > 0) {
            points = [this.left, this.top, pointer.x, pointer.y];
            lineContinueAt = lineSegment.ID[0];
            color = lines[lineContinueAt][0].stroke;
        }

        isLineStarted = true;

        if (lines[chosenLineGlobalID][lines[chosenLineGlobalID].length - 1].lineType == 'geodesic') {

            lineTypeToDraw = 'geodesic';

            line = new fabric.Line(points, {
                strokeWidth: lineStrokeWidthWhenSelected,
                stroke: color,
                fill: color,
                originX: 'center',
                originY: 'center',
                perPixelTargetFind: true,
                objectCaching: false,
                hasBorders: false,
                hasControls: false,
                evented: true
            });

            canvas.add(line);

            line.bringToFront();

            canvas.renderAll();
        }

        if (lines[chosenLineGlobalID][lines[chosenLineGlobalID].length - 1].lineType == 'polyline'){

            lineTypeToDraw = 'polyline';

            pathCoords.push({x: points[0], y: points[1]});
            pathCoords.push({x: points[2], y: points[3]});

            let schnittpunktsparameters = getSchnittpunktsparameters(sectors, [points[0], points[1], points[2], points[3]]);

            polyline = new fabric.Polyline(pathCoords, {
                stroke: color,
                fill: '',
                strokeWidth: lineStrokeWidthWhenSelected,
                //perPixelTargetFind: true,
                objectCaching: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
                selectable: false,
            });

            polyline.abortFromBeginning = false;

            if(schnittpunktsparameters.length > 0){
                if (sectors[schnittpunktsparameters[0][1]].snapStatus[schnittpunktsparameters[0][2]] == 0) {
                    polyline.stroke = 'red';
                    polyline.abortFromBeginning = true
                }
            }

            canvas.add(polyline);

            polyline.bringToFront();

            canvas.renderAll();
        }

        changeVectorWidth();



    });

    if (lineSegment.parentSector[0] !== -1){
        lineSegment.dragPoint.relationship = getRelationship(lineSegment.dragPoint, lineSegment.parentSector[0]);
    }


    if (turnLorentzTransformOn == 1){
        if (lineSegment.lineType == "geodesic"){
            lineSegment.dragPoint.start_pos_BL_x = lineSegment.end_point_BL.x;
            lineSegment.dragPoint.start_pos_BL_y = lineSegment.end_point_BL.y;
        }
        if (lineSegment.lineType == "polyline"){
            lineSegment.dragPoint.start_pos_BL_x = lineSegment.points_BL[lineSegment.points_BL.length -1].x;
            lineSegment.dragPoint.start_pos_BL_y = lineSegment.points_BL[lineSegment.points_BL.length -1].y;
        }
    }

    canvas.add(lineSegment.dragPoint);
}

/**
 * Animates the drawing of a line segment on the canvas from a starting point to an ending point.
 *
 * @param {string} color - The color of the line.
 * @param {number} lineStrokeWidth - The stroke width of the line.
 * @param {number} parentSectorID - The ID of the parent sector to which the line belongs.
 * @param {number} lineStart_x - The x-coordinate of the starting point.
 * @param {number} lineStart_y - The y-coordinate of the starting point.
 * @param {number} lineEnd_x - The x-coordinate of the ending point.
 * @param {number} lineEnd_y - The y-coordinate of the ending point.
 * @returns {Promise<fabric.Line>} - A promise that resolves with the final drawn line segment.
 */
async function animateDrawLine(color, lineStrokeWidth, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y) {
    return new Promise((resolve) => {
        const animationSteps = 60; // Anzahl der Animationsschritte
        let currentStep = 0;
        const dx = (lineEnd_x - lineStart_x) / animationSteps;
        const dy = (lineEnd_y - lineStart_y) / animationSteps;

        // Temporäre Linie erstellen, die schrittweise gezeichnet wird
        const tempLine = new fabric.Line([lineStart_x, lineStart_y, lineStart_x, lineStart_y], {
            strokeWidth: lineStrokeWidth,
            fill: color,
            stroke: color,
            originX: 'center',
            originY: 'center',
            perPixelTargetFind: true,
            objectCaching: false,
            hasBorders: false,
            hasControls: false,
            evented: true,
            selectable: false,
        });
        canvas.add(tempLine);

        // Funktion zur Animationsschleife aufrufen
        function animate() {
            // Linie zeichnen
            let currentLineEnd_x = lineStart_x + dx * currentStep;
            let currentLineEnd_y = lineStart_y + dy * currentStep;

            // Die temporäre Linie aktualisieren
            tempLine.set({ x2: currentLineEnd_x, y2: currentLineEnd_y });
            tempLine.setCoords();

            // Falls mehr Schritte vorhanden sind, rufe die Animationsschleife erneut auf
            if (currentStep < animationSteps) {
                currentStep++;
                requestAnimationFrame(animate);
                canvas.renderAll();
            } else {
                // Animation beendet, die temporäre Linie aus dem Canvas entfernen
                canvas.remove(tempLine);


                // Die endgültige Linie in das Canvas setzen
                const finalLine = drawLineSegment(color, lineStrokeWidth, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y);

                // Die Promise auflösen und das endgültige Liniensegment zurückgeben
                resolve(finalLine);
            }
        }

        // Animation starten
        animate();
    });
}

/**
 * adds a geodesic line segment to the canvas
 * @param color - the color of the new line
 * @param lineStrokeWidth - the width of the new line
 * @param parentSectorID - the ID of the sector the line is to be drawn on
 * @param lineStart_x - the x coord of the starting point of the line
 * @param lineStart_y - the y coord of the starting point of the line
 * @param lineEnd_x - the x coord of the end point of the line
 * @param lineEnd_y - the y coord of the end point of the line
 * @returns {*}
 */
function drawLineSegment(color, lineStrokeWidth, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y){

    let lineSegment;

    lineSegment = new fabric.Line([lineStart_x, lineStart_y, lineEnd_x, lineEnd_y], {
        strokeWidth: lineStrokeWidth,
        fill: color,
        stroke: color,
        originX: 'center',
        originY: 'center',
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: true,
        selectable: false,
    });

    stackIdx = canvas.getObjects().indexOf(sectors[parentSectorID].ID_text);
    lineSegment.parentSector = [parentSectorID, sectors[parentSectorID].lineSegments.length];

    lineSegment.relationship = getRelationship(lineSegment, lineSegment.parentSector[0]);

    lineSegment.lineType = 'geodesic';

    lineSegment.lineSegmentLength = Math.sqrt(Math.pow((lineEnd_x - lineStart_x), 2) + Math.pow((lineEnd_y - lineStart_y), 2))

    if (buildGeodesicTicks == "1"){
        lineSegment.geodesicTicks = []
    }

    sectors[lineSegment.parentSector[0]].lineSegments.push(lineSegment);

    if (turnLorentzTransformOn == 1){
        getStartAndEndPointCoordsBeforeLorentztransform(lineSegment)
    }

    canvas.insertAt(lineSegment, stackIdx);

    /*
    if (lineEndIsOverCanvas === false) {
        lineContinueAt = -1;
        return
    }
    */
    /*
                        //Wenn Liniensegment nicht auf Trapez
                        if(typeof(lineSegment.parentSector)==='undefined'){
                            canvas.add(lineSegment);
                            lineSegment.sendToBack();
                            lineSegment.opacity = 0.5;
                            lineSegment.parentSector = [-1,-1];
                            lineSegment.relationship = [];


                        }else{


                        }
    */

    return lineSegment
}

/**
 * Draws a long edge line from a specified point on a sector's trapezium.
 *
 * @param {number} initialSectorID - The ID of the initial sector from which the line starts.
 * @param {number} initialArcID_onSector - The ID of the initial arc on the sector's trapezium (0 to 3).
 * @param {boolean} constructClockwise - Indicates whether to construct the line clockwise (true) or counterclockwise (false).
 */
function drawLongEdgeLine(initialSectorID, initialArcID_onSector, constructClockwise){
    let initialTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[initialSectorID].trapez);

    let countUpOrDown;
    if (constructClockwise == true){
        countUpOrDown = 1
    }else{countUpOrDown = 3}



    let point_1 = initialTrapezPointsAsGlobalCoords[initialArcID_onSector];
    let point_2 = initialTrapezPointsAsGlobalCoords[(initialArcID_onSector + countUpOrDown) % 4];

    let dx = point_2.x - point_1.x;
    let dy = point_2.y - point_1.y;

    let stack_idx_initialSectorID = canvas.getObjects().indexOf(sectors[initialSectorID].trapez);

    let longEdge = new fabric.Line([point_1.x, point_1.y, point_1.x + longEdgeLineLengthFactor * dx, point_1.y + longEdgeLineLengthFactor * dy], {
        strokeWidth: 2,
        fill: 'red',
        stroke: 'red',
        originX: 'center',
        originY: 'center',
        perPixelTargetFind: true,
        objectCaching: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        selectable: false,
        opacity: deficitAngleVisualizeGroupOpacity,
    });

    canvas.insertAt(longEdge, stack_idx_initialSectorID + 1);
    longEdge.bringToFront();
    deficitAngleVisualizeGroup.add(longEdge)
}

/**
 * Draw an orientation circle on the canvas with the specified attributes. This function is used for debug purposes.
 *
 * @param {string} color - The color of the orientation circle.
 * @param {number} pos_x - The X-coordinate of the circle's center.
 * @param {number} pos_y - The Y-coordinate of the circle's center.
 * @returns {fabric.Circle} The created orientation circle object.
 */
function drawOrientationCirc(color, pos_x, pos_y){
    let orientationCirc;

    orientationCirc = new fabric.Circle({ radius: 5, originX: 'center', originY: 'center', fill: color, left: pos_x, top:  pos_y});

    canvas.add(orientationCirc);

    return orientationCirc

}

/**
 * Draw a polyline segment (curved line segment) on the canvas with the specified attributes.
 *
 * @param {string} color - The color of the polyline segment.
 * @param {number} polylineStrokeWidth - The stroke width of the polyline segment.
 * @param {number} parentSectorID - The ID of the parent sector (-1 if none).
 * @param {Array} polylineSegmentCoords - An array of coordinates defining the polyline segment.
 * @returns {fabric.Polyline} The created polyline segment object.
 */
function drawPolylineSegment(color, polylineStrokeWidth, parentSectorID, polylineSegmentCoords){

    let polylineSegment;

    polylineSegment = new fabric.Polyline(polylineSegmentCoords,
        {
            stroke: color,
            fill: '',
            strokeWidth: polylineStrokeWidth,
            perPixelTargetFind: true,
            originX: 'center',
            originY: 'center',
            objectCaching: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            selectable: false,
        }
    );

    polylineSegment.lineType = 'polyline';

    if (parentSectorID === -1 || parentSectorID === undefined ) {
        canvas.add(polylineSegment);
        polylineSegment.opacity = 0.5;
        polylineSegment.parentSector = [-1, -1];
        polylineSegment.relationship = [];


    }else{
        stackIdx = canvas.getObjects().indexOf(sectors[parentSectorID].ID_text);
        polylineSegment.parentSector = [parentSectorID, sectors[parentSectorID].lineSegments.length];

        polylineSegment.relationship = getRelationship(polylineSegment, polylineSegment.parentSector[0]);

        sectors[polylineSegment.parentSector[0]].lineSegments.push(polylineSegment);

        if (turnLorentzTransformOn == 1){
            getPolylinePathCoordsBeforeLorentztransform(polylineSegment);
            let polylineMidPoint = {x: polylineSegment.left - 0.5, y: polylineSegment.top - 0.5};
            polylineSegment.polylineMidPoint_BL = getPointCoordsBeforeLorentztransform(polylineMidPoint, sectors[polylineSegment.parentSector[0]].trapez)
        }


        canvas.insertAt(polylineSegment, stackIdx);
    }






    //Wenn Liniensegment nicht auf Trapez



    return polylineSegment
}

let geodreieckLockRotationToSet = false;

/**
 * Draws a sector on the canvas with specified coordinates and attributes like event listeners.
 *
 * @param {number} x0 - The x-coordinate of the first point of the sector's trapezium.
 * @param {number} y0 - The y-coordinate of the first point of the sector's trapezium.
 * @param {number} x1 - The x-coordinate of the second point of the sector's trapezium.
 * @param {number} y1 - The y-coordinate of the second point of the sector's trapezium.
 * @param {number} x2 - The x-coordinate of the third point of the sector's trapezium.
 * @param {number} y2 - The y-coordinate of the third point of the sector's trapezium.
 * @param {number} x3 - The x-coordinate of the fourth point of the sector's trapezium.
 * @param {number} y3 - The y-coordinate of the fourth point of the sector's trapezium.
 */
function drawSector(x0, y0, x1, y1, x2, y2, x3, y3) {
    if (typeof this.trapez !== 'undefined') {
        canvas.remove(this.trapez); //sollte ein Sektor zwei Trapeze erzeugen, wird der erste gelöscht
    }

    let sectorEdgeColor;

    let originXToSet;
    let originYToSet;

    if (turnLorentzTransformOn == 1){
        originXToSet =  'left';
        originYToSet = 'bottom';
        sectorLockRotationToSet = true;
    }else{
        originXToSet =  'center';
        originYToSet = 'center';
        sectorLockRotationToSet = false;
    }

    if (textured !== "1" ){sectorEdgeColor = '#666'} else{sectorEdgeColor = '#666'}

    this.trapez = new fabric.Polygon //Anlegen des Polygons (noch nicht geaddet), unter 'trapez' abgespeichert
    (
        [   {x: x0, y: y0},
            {x: x1, y: y1},
            {x: x2, y: y2},
            {x: x3, y: y3},
        ],

        {
            originX: originXToSet,
            originY: originYToSet,
            left: this.pos_x, //Koordinaten der linken oberen Ecke der Boundingbox
            top: this.pos_y,
            angle: this.sector_angle,
            fill: this.fill,
            strokeWidth: 1,
            stroke: sectorEdgeColor,
            perPixelTargetFind: true,
            hasControls: true,
            hasBorders: false,
            objectCaching: false,
            lockMovementX: false,
            lockMovementY: false,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: sectorLockRotationToSet,
            cornerSize: 30,
            opacity: startOpacity,

        });

    /*
        this.trapez.setShadow({  color: 'rgba(0,0,0,0.2)',
            blur: 10,
            offsetX: 5,
            offsetY: 0
        });
    */
    this.trapez.x_offset = Math.min(x0,x1,x2,x3) + 0.5;
    this.trapez.y_offset = Math.min(y0,y1,y2,y3) + 0.5;

    let showRotationControll;
    if (turnLorentzTransformOn == 1){
        showRotationControll = false;
    }else{
        showRotationControll = true;
    }

    this.trapez.setControlsVisibility({
        //    mtr: false,
        tl: false,
        mt: false,
        tr: false,

        mr: false,
        ml: false,

        bl: false,
        mb: false,
        br: false,

        mtr : showRotationControll,
    });

    //Zeiger, der wieder auf die Parentalsektor zeigt
    this.trapez.parent = this;

    this.trapez.aussenkreisradius = Math.sqrt( Math.pow(this.sector_width/2, 2) + Math.pow(this.sector_height/2, 2));

    let textPos_x;
    let textPos_y;

    if (turnLorentzTransformOn == 1){
        textPos_x = this.pos_x + this.sector_width/2;
        textPos_y = this.pos_y - this.sector_height/2;
    }else{
        textPos_x = this.pos_x;
        textPos_y = this.pos_y;
    }

    this.ID_text = new fabric.Text("" + (this.name), {
        fontSize: this.fontSize,
        originX: 'center',
        originY: 'center',
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        selectable: false,
        evented: false,
        left: textPos_x,
        top: textPos_y,
        angle: this.sector_angle,
    });


    //Berechnung der relativen Position von Objekten im lokalen Koordinatensystem der Parentalsektoren
    //wichtig für updateMinions
    let trapezTransform = this.trapez.calcTransformMatrix();
    let invertedtrapezTransform = invert(trapezTransform);
    let desiredTransform = multiply(
        invertedtrapezTransform,
        this.ID_text.calcTransformMatrix());

    this.ID_text.relationship = desiredTransform;

    let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(this.trapez);

    if (turnLorentzTransformOn == 1){
        this.ID_text.start_pos_BL_x = this.ID_text.left - trapezPointsAsGlobalCoords[3].x;
        this.ID_text.start_pos_BL_y = this.ID_text.top - trapezPointsAsGlobalCoords[3].y;
    }

    this.trapez.on('moving',function(){
        removeSnapEdges(this.parent.ID);
        isItTimeToSnap(this);
        updateMinions(this);
        removeDeficitAngleVisualize();
    });

    this.trapez.on('rotating',function(){
        removeSnapEdges(this.parent.ID);
        isItTimeToSnap(this);
        updateMinions(this);
        removeDeficitAngleVisualize();
    });

    this.trapez.on('modified',function(){
        removeSnapEdges(this.parent.ID);
        //isItTimeToSnap(this);
        updateMinions(this);
        removeDeficitAngleVisualize();
    });


    this.trapez.on('selected', function () {
        if (turnLorentzTransformOn == 1){

            for(let ii = 0; ii < this.parent.slider.length; ii++){
                if (lockAllSectors!=="1"){
                    this.parent.slider[ii].opacity = 1.00;
                }

                //canvas.sendToBack(this.parent.slider[ii]);
                canvas.bringToFront(this.parent.slider[ii]);
                canvas.bringToFront(this.parent.slider[0]);
                //this.parent.slider[0].opacity =0.80;
            }
        }


    });

    this.trapez.on('deselected', function () {
        if (turnLorentzTransformOn == 1) {
            for (let ii = 0; ii < this.parent.slider.length; ii++) {
                this.parent.slider[ii].opacity = 0.00;
            }
        }
    });


    let rapidity_before_something;
    let rapidity_after_something;
    let dist_inv_min_x_old;
    let dist_inv_max_y_old;

    let immediatehistory = [1];
    let sectorParameterOnMousedown = [];
    let sectorParameterOnMouseup = [];

    //Setzen/Verlängern einer Linie; nur zulässig auf Trapezen
    this.trapez.on('mousedown', function (o) {

        //console.log(this.parent.neighbourhood)

        showGeodesicButtons(false);

        if (turnLorentzTransformOn == 1){

            rapidity_before_something = this.parent.rapidity;

            dist_inv_min_x_old = Math.min(this.points[0].x, this.points[1].x, this.points[2].x, this.points[3].x);
            dist_inv_max_y_old = Math.max(this.points[0].y, this.points[1].y, this.points[2].y, this.points[3].y);
        }

        for (let kk = 0; kk < lines.length; kk++){
            for (let ll = 0; ll < lines[kk].length; ll++)
                lines[kk][ll].strokeWidth = lineStrokeWidthWhenNotSelected ;
        }
        for (let ii = 0; ii < vectors.length; ii++) {
            vectors[ii][0].orientationLine.opacity = 0;
        }
        for (let ii = 0; ii < vectorDuplicates.length; ii++) {
            vectorDuplicates[ii][0].orientationLine.opacity = 0;
        }

        changeVectorWidth();


        chosenLineGlobalID = -1;

        if(selectedTool !== 'paint' && selectedTool !== 'grab' && selectedTool !== 'mark') return;

        // Mögliche Lösung um die angeklickten Sektoren nach vorne zu holen
        this.bringToFront();
        updateMinions(this);
        drawSnapEdges(this.parent.ID);
        if (geodreieck != undefined){
            geodreieck.bringToFront();
        }

        //----------------


        let color;
        color = line_colors[lines.length % line_colors.length];
        if (!isLineStarted) {
            let pointer = canvas.getPointer(o.e);
            let points = [pointer.x, pointer.y, pointer.x, pointer.y];

            /*
            if (startAtMarkPoint !== -1){
                points = [markPoints[startAtMarkPoint].left, markPoints[startAtMarkPoint].top, pointer.x, pointer.y]
            }
            */

            if (selectedTool == 'grab' && lineContinueAt !== -1){
                this.lockMovementX = true;
                this.lockMovementY = true;
                this.hasControls = false;
                //this.evented = false;
            }
            if (selectedTool == 'paint' || lineContinueAt !== -1) {
                isLineStarted = true;

                showGeodesicButtons(true);

                if (startStrokeWidth[0] == undefined) {
                    startStrokeWidth[0] = lineStrokeWidthWhenNotSelected
                }

                if (lineTypeToDraw == 'geodesic') {
                    line = new fabric.Line(points, {
                        strokeWidth: lineStrokeWidthWhenNotSelected,
                        stroke: color,
                        fill: color,
                        originX: 'center',
                        originY: 'center',
                        perPixelTargetFind: true,
                        objectCaching: false,
                        hasBorders: false,
                        hasControls: false,
                        evented: true
                    });

                    canvas.add(line);

                    line.bringToFront();

                    canvas.renderAll();
                }
                if (lineTypeToDraw == 'polyline') {

                    pathCoords.push({x: points[0], y: points[1]});
                    pathCoords.push({x: points[2], y: points[3]});
                    polyline = new fabric.Polyline(pathCoords, {
                        stroke: color,
                        fill: '',
                        strokeWidth: 2,
                        perPixelTargetFind: true,
                        originX: 'center',
                        originY: 'center',
                        objectCaching: false,
                        hasBorders: false,
                        hasControls: false,
                        evented: false,
                        selectable: false,
                    });

                    polyline.abortFromBeginning = false;

                    canvas.add(polyline);

                    polyline.bringToFront();

                    canvas.renderAll();
                }

                if (lineTypeToDraw == 'vector') {

                    let vector = [];

                    let vectorPoint = new fabric.Circle({
                        ID: vectors.length,
                        radius: 5,
                        fill: 'blue',
                        padding: 5,
                        left: pointer.x,
                        top: pointer.y,
                        evented: true,
                        objectCaching: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        lockScalingX: true,
                        lockScalingY: true,
                        selectable: true,
                        originX: 'center',
                        originY: 'center',
                        hasBorders: false,
                        hasControls: true
                    });

                    let vectorLine = new fabric.Line(points, {
                        ID: vectors.length,
                        strokeWidth: 3,
                        stroke: 'blue',
                        fill: 'blue',
                        originX: 'center',
                        originY: 'center',
                        perPixelTargetFind: true,
                        objectCaching: false,
                        hasBorders: false,
                        hasControls: false,
                        evented: true,
                        lockMovementX: true,
                        lockMovementY: true
                    });

                    let vectorHead = new fabric.Triangle({
                        ID: vectors.length,
                        stroke: "blue",
                        strokeWidth: 3,
                        fill: "blue",
                        selectable: true,
                        hasControls: false,
                        top: pointer.y,
                        left: pointer.x,
                        originX: "center",
                        originY: "center",
                        evented: true,
                        hasBorders: false,
                        width: 12,
                        height: 15
                    });

                    vector.push(vectorPoint, vectorLine, vectorHead);
                    vectors.push(vector);
                    canvas.add(vectorPoint, vectorLine, vectorHead);
                    canvas.renderAll();

                }

            }

            /*
                            if (selectedTool == 'mark') {
                                mark = new fabric.Circle({
                                    originX: 'center',
                                    originY: 'center',
                                    left: pointer.x,
                                    top: pointer.y,
                                    radius: 3,
                                    stroke: 'black',
                                    strokeWidth: 0,
                                    fill: 'grey',
                                    perPixelTargetFind: true,
                                    hasBorders: false,
                                    objectCaching: false,
                                    selectable: false,
                                    lockMovementX: true,
                                    lockMovementY: true,
                                    lockScalingX: true,
                                    lockScalingY: true,
                                    evented: false,
                                    hoverCursor: 'crosshair',
                                });

                                let stackIdx = 0;
                                for (ii = 0; ii < sectors.length; ii++){
                                    if(sectorContainsPoint(sectors[ii].trapez, pointer)){
                                        if(canvas.getObjects().indexOf(sectors[ii].ID_text) > stackIdx) {
                                            stackIdx =canvas.getObjects().indexOf(sectors[ii].ID_text);
                                            mark.parentSector = [sectors[ii].ID, -1];
                                        }
                                    }
                                }

                                let trapezTransform = sectors[mark.parentSector[0]].trapez.calcTransformMatrix();
                                let invertedtrapezTransform = invert(trapezTransform);
                                let desiredTransform = multiply(
                                    invertedtrapezTransform,
                                    mark.calcTransformMatrix());


                                mark.relationship = desiredTransform;

                                mark.parentSector[1] = sectors[mark.parentSector[0]].markCircles.length;

                                sectors[mark.parentSector[0]].markCircles.push(mark);

                                canvas.insertAt(mark,stackIdx);

                                markPoints.push(mark);

                                canvas.renderAll();

                                toolChange('grab')
                            }
                            */
        }


        sectorParameterOnMousedown = getSectorParameterOnMousedown(this.parent.ID)
    });



    this.trapez.on('mouseup', async function (o) {

        if (turnLorentzTransformOn == 1){

            rapidity_after_something = this.parent.rapidity;

            //Der Sektor muss reinitialisiert werden, wenn die Maus losgelassen wird, jedoch nur, wenn sich an den Rapiditäten etwas getan hat.
            //Sonst wird die Boundingbox nicht aktualisiert
            //WICHTIG: Dies muss unabhängig vom Snapping passieren.
            //Dennoch müssen spätere Kriterien erfüllt und abgearbeitet werden.
            //Hierzu zählen das Setzen der entsprechenden Snap-Edges und das zurücksetzen der Färbung auf den Grundzustand

            if (Math.abs(rapidity_after_something - rapidity_before_something) > epsilon) {

                reinitialiseSector(dist_inv_min_x_old, dist_inv_max_y_old, this.parent.ID)

            }
        }


        if (textured == "1") {
            //nur drawSnapEdges weil der Sektor hier ja schon gesnappt sein sollte
            drawSnapEdges(this.parent.ID)
        }else {
            if (selectedTool === 'grab') {
                if (sectorToSnap > -1) {
                    await snapInitialSectorToTargetSector(this.parent.ID, sectorToSnap);
                }
                drawSnapEdges(this.parent.ID)
            }
        }

        //overlapControll nach dem Loslassen des Sektors funktioniert auch nach rotieren
        if (turnOverlapControllOn == "1") {
            for (let ii = 0; ii < sectors.length; ii++) {
                overlapControll(sectors[ii].trapez)
            }
        }



        if (toCalcSectorArea == true & selectedTool == 'grab'){

            if (showAreaSector == "earth") {
                let sectorTop = distance(this.points[0], this.points[1]) * 12.742;
                let sectorBottom = distance(this.points[2], this.points[3]) * 12.742;

                let sectorArea = 0.5 * (sectorTop + sectorBottom) * this.parent.sector_height * 12.742;
                let sectorArea4Dec = sectorArea.toFixed(1);
                let infoboxAreaTextByLanguageOnClick = "Sektorfläche:";
                if (language == "english") {
                    infoboxAreaTextByLanguageOnClick = "sector area:"
                }
                infoboxAreaText.set('text', infoboxAreaTextByLanguageOnClick + "\n" + sectorArea4Dec.toString() + " " + "km²");

                canvas_side_bar_perm.renderAll()
            }

            if (showAreaSector == "globe"){
                let sectorTop = distance(this.points[0], this.points[1]) * 0.03;
                let sectorBottom = distance(this.points[2], this.points[3]) * 0.03;

                let sectorArea = 0.5 * (sectorTop + sectorBottom) * this.parent.sector_height * 0.03;
                let sectorArea4Dec = sectorArea.toFixed(4);
                let infoboxAreaTextByLanguageOnClick = "Sektorfläche:";
                if (language == "english") {
                    infoboxAreaTextByLanguageOnClick = "sector area:"
                }
                infoboxAreaText.set('text', infoboxAreaTextByLanguageOnClick + "\n" + sectorArea4Dec.toString() + " " + "cm²");

                canvas_side_bar_perm.renderAll()
            }

        }

        sectorParameterOnMouseup = getSectorParameterOnMouseup(this.parent.ID);

        if (sectorParameterOnMousedown.length > 0){
            if (sectorParameterOnMousedown[0] === sectorParameterOnMouseup[0]){
                if (turnLorentzTransformOn == 1) {
                    if (sectorParameterOnMousedown[2] !== sectorParameterOnMouseup[2] || sectorParameterOnMousedown[3] !== sectorParameterOnMouseup[3] || sectorParameterOnMousedown[4] !== sectorParameterOnMouseup[4] || sectorParameterOnMousedown[5] !== sectorParameterOnMouseup[5]){
                        immediatehistory.push(sectorParameterOnMousedown);
                        sectorParameterOnMousedown = [];
                        history.push(immediatehistory);

                        immediatehistory = [1]
                    }
                }else{
                    if (sectorParameterOnMousedown[2] !== sectorParameterOnMouseup[2] || sectorParameterOnMousedown[3] !== sectorParameterOnMouseup[3] || sectorParameterOnMousedown[4] !== sectorParameterOnMouseup[4]){
                        immediatehistory.push(sectorParameterOnMousedown);
                        sectorParameterOnMousedown = [];
                        history.push(immediatehistory);

                        immediatehistory = [1]
                    }
                }

            }
        }


    });


    canvas.add(this.trapez);
    canvas.add(this.ID_text);
}

/**
 * Draw a slider element for interactive Lorentz transformations within the sector.
 *
 * @param {number} pos_x - The x-coordinate of the slider's center position.
 * @param {number} pos_y - The y-coordinate of the slider's center position.
 */
function drawSlider(pos_x, pos_y) {

    this.slider = [];

    let temporary;





    temporary = new fabric.Rect
    (
        {
            left: pos_x,
            top: pos_y,
            fill: 'white',
            width: 20,
            height: 40,
            stroke: '#848484',
            strokeWidth: 2,
            perPixelTargetFind: true,
            hasControls: false,
            hasBorders: false,
            objectCaching: false,
            lockMovementX: true,
            lockMovementY: false,
            opacity: 0.00,
            originX: 'center',
            originY: 'center',

        }
    );

    temporary.parent = this;
    this.slider.push(temporary);

    temporary = new fabric.Line
    ([pos_x, pos_y + slider_max, pos_x, pos_y - slider_max],
        {

            fill: '#585858',
            stroke: '#585858',
            strokeWidth: 3,
            selectable: false,
            evented: false,
            opacity: 0.00,
            originX: 'center',
            originY: 'center',
        }
    );
    temporary.parent = this;
    this.slider.push(temporary);

    temporary = new fabric.Line
    ([pos_x - 5, pos_y , pos_x + 5, pos_y],
        {

            fill: '#585858',
            stroke: '#585858',
            strokeWidth: 3,
            selectable: false,
            evented: false,
            opacity: 0.00,
            originX: 'center',
            originY: 'center',
        }
    );
    temporary.parent = this;
    this.slider.push(temporary);

    temporary = new fabric.Line
    ([pos_x - 5, pos_y + slider_max, pos_x + 5, pos_y + slider_max],
        {

            fill: '#585858',
            stroke: '#585858',
            strokeWidth: 3,
            selectable: false,
            evented: false,
            opacity: 0.00,
            originX: 'center',
            originY: 'center',
        }
    );
    temporary.parent = this;
    this.slider.push(temporary);


    temporary = new fabric.Line
    ([pos_x - 5, pos_y - slider_max, pos_x + 5, pos_y - slider_max],
        {

            fill: '#585858',
            stroke: '#585858',
            strokeWidth: 3,
            selectable: false,
            evented: false,
            opacity: 0.00,
            originX: 'center',
            originY: 'center',
        }
    );
    temporary.parent = this;
    this.slider.push(temporary);

    for(let ii = 0; ii < this.slider.length; ii++){
        canvas.add(this.slider[ii]);

    }
    canvas.bringToFront(this.slider[0]);


    /*
    //Anlegen der Variablen für die Koordinaten des neuen Sektors

    let xn0 ;
    let yn0 ;

    let xn1 ;
    let yn1 ;

    let xn2 ;
    let yn2 ;

    let xn3 ;
    let yn3 ;

    let transformMatrix;
    let transformedPoints = [{x: 0.0, y: 0.0}, {x: 0.0, y: 0.0}, {x: 0.0, y: 0.0}, {x: 0.0, y: 0.0}];




    //Berechnen der Sektorkoordinaten beim Klicken auf den Regler

    this.slider[0].on('mousedown', function f() {
        transformMatrix = this.parent.trapez.calcTransformMatrix('True');
        transformedPoints = [{x: 0.0, y: 0.0}, {x: 0.0, y: 0.0}, {x: 0.0, y: 0.0}, {x: 0.0, y: 0.0}];
        for (let ll = 0; ll < 4; ll++) {
            transformedPoints[ll].x = this.parent.trapez.points[ll].x - this.parent.trapez.width / 2.0 -this.parent.trapez.x_offset ;
            transformedPoints[ll].y = this.parent.trapez.points[ll].y - this.parent.trapez.height / 2.0 -this.parent.trapez.y_offset;
            transformedPoints[ll] = fabric.util.transformPoint(transformedPoints[ll], transformMatrix);
            transformedPoints[ll].x -= 0.5;
            transformedPoints[ll].y -= 0.5;

        }
    });
    */


    let dist_inv_min_x_old;
    let dist_inv_max_y_old;

    let immediatehistory = [1];
    let sectorParameterOnMousedown = [];
    let sectorParameterOnMouseup = [];

    this.slider[0].on('mousedown', function(o) {

        sectorParameterOnMousedown = getSectorParameterOnMousedown(this.parent.ID);

        this.opacity = 0.8;
        dist_inv_min_x_old = Math.min(this.parent.trapez.points[0].x, this.parent.trapez.points[1].x, this.parent.trapez.points[2].x, this.parent.trapez.points[3].x);
        dist_inv_max_y_old = Math.max(this.parent.trapez.points[0].y, this.parent.trapez.points[1].y, this.parent.trapez.points[2].y, this.parent.trapez.points[3].y);

    });

    //Wird der Regler bewegt, so passiert die Transformation
    this.slider[0].on('moving', function(o) {

        removeSnapEdges(this.parent.ID);
        changeSnapStatus(this.parent.ID);

        if(this.top > this.parent.slider[1].top + slider_max){
            this.set('top' , this.parent.slider[1].top + slider_max).setCoords();
        }

        if(this.top < this.parent.slider[1].top - slider_max){
            this.set('top' , this.parent.slider[1].top - slider_max).setCoords();
        }

        //Einrasten des Sliders auf Null

        let pointer = canvas.getPointer(o.e);

        if (Math.abs(pointer.y - this.parent.slider[1].top) < snap_radius_slider) {
            this.set('top' , this.parent.slider[1].top).setCoords();}

        let lastValueSlider = 0.00;
        let startValueSlider;
        startValueSlider = this.top - this.parent.slider[1].top ;

        //Die Rapidität wird wie üblich mit theta abgekürzt

        let theta = (startValueSlider - lastValueSlider) / slider_max; // '-' damit der Sektor nach oben verscheert wird
        this.parent.rapidity = theta;

        lorentzTransform(theta, this.parent.trapez);

    });


    this.slider[0].on('mouseup',function() {
        this.opacity = 1.0;

        sectorParameterOnMouseup = getSectorParameterOnMouseup(this.parent.ID);

        if (sectorParameterOnMousedown.length > 0){

            if (sectorParameterOnMousedown[5] !== sectorParameterOnMouseup[5]){

                immediatehistory.push(sectorParameterOnMousedown);
                sectorParameterOnMousedown = [];
                history.push(immediatehistory);

                immediatehistory = [1]
            }
        }

        reinitialiseSector(dist_inv_min_x_old, dist_inv_max_y_old, this.parent.ID)

    });


    this.slider[0].on('deselected', function () {
        for(let ii = 0; ii < this.parent.slider.length; ii++){
            this.parent.slider[ii].opacity = 0.00;
        }
    });
    this.slider[0].on('selected', function () {
        for(let ii = 0; ii < this.parent.slider.length; ii++){
            this.parent.slider[ii].opacity = 1.00;
            //this.parent.slider[0].opacity =0.80;
        }
        canvas.bringToFront(this);
    });


    //Berechnung der relativen Position von Objekten im lokalen Koordinatensystem der Parentalsektoren
    //wichtig für updateMinions
    let trapezTransform = this.trapez.calcTransformMatrix();
    let invertedtrapezTransform = invert(trapezTransform);
    let desiredTransform;
    for (let ii = 0; ii < this.slider.length; ii++){
        desiredTransform = multiply(
            invertedtrapezTransform,
            this.slider[ii].calcTransformMatrix());

        this.slider[ii].relationship = desiredTransform;
    }

}

/**
 * Draw snap edges between the given sector and its neighboring sectors. Then the edge between two snapped sectors is
 * dashed
 *
 * @param {number} initialSectorID - The ID of the initial sector for which snap edges should be drawn.
 */
function drawSnapEdges(initialSectorID) {

    for (let ii = 0; ii < 4; ii++) {

        if (sectors[initialSectorID].neighbourhood[ii] > -1) {

            let neighbourSectorID = sectors[initialSectorID].neighbourhood[ii];

            if (sectors[initialSectorID].snapEdges[ii] !== 0) {

                let edgeToRemove = sectors[initialSectorID].snapEdges[ii];
                canvas.remove(edgeToRemove);
                sectors[initialSectorID].snapEdges[ii] = [0];

            }

            if (sectors[initialSectorID].snapStatus[ii] !== 0) {

                //-----------IDEE UM DIE DRAGPOINTS NACH VORNE ZU HOLEN------------------
                for (let jj = 0; jj < sectors[neighbourSectorID].lineSegments.length; jj++) {
                    if (sectors[neighbourSectorID].lineSegments[jj].dragPoint !== undefined) {
                        canvas.bringToFront(sectors[neighbourSectorID].lineSegments[jj].dragPoint)
                    }
                }

                if (buildTicks == "1") return;

                let initialTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[initialSectorID].trapez);

                let point_1 = initialTrapezPointsAsGlobalCoords[ii];
                let point_2 = initialTrapezPointsAsGlobalCoords[(ii + 1) % 4];

                let stack_idx_initialSectorID = canvas.getObjects().indexOf(sectors[initialSectorID].trapez);

                let strokeDashArray;

                if (textured !== "1"){
                    strokeDashArray = [5, 5]
                }else{
                    strokeDashArray = [0, 0]
                }

                let offsetToAdd = 0;

                if (turnLorentzTransformOn == 1){
                    offsetToAdd = 0.5
                }

                let edge = new fabric.Line(
                    [point_1.x + offsetToAdd, point_1.y + offsetToAdd, point_2.x + offsetToAdd, point_2.y + offsetToAdd], {
                    strokeWidth: 1,
                    strokeDashArray: strokeDashArray,
                    fill: edgeColor,
                    stroke: edgeColor,
                    originX: 'center',
                    originY: 'center',
                    perPixelTargetFind: true,
                    objectCaching: false,
                    hasBorders: false,
                    hasControls: false,
                    evented: false,
                    selectable: false,
                    opacity: startOpacity,
                });

                edge.ID = ii;

                canvas.insertAt(edge, stack_idx_initialSectorID + 1);
                //edge.bringToFront();
                sectors[initialSectorID].snapEdges[ii] = edge;
            }

        }

    }
}


let tick_dist = 14.5;
let tick_length = 3;
let lightConeLength = 80;
let tickWidth = 1;

/**
 * Draw tick marks within the given trapezoid.
 *
 * @param {fabric.Polygon} trapez - The trapezoid within which to draw the tick marks.
 */
function drawTicks(trapez) {

    for (let ii = 0; ii < 4; ii++) {

        //Wichtig! Das Erstellen der Markierungen muss ausgelagert werden.
        // Ziel ist, dass diese einfach Lorentztransformiert werden und nicht jedes Mal neu initialisiert werden
        //FALSCH --> Durch das neu initialisieren werden sie ja bereits passend lorentztransformiert ;-)
        //WICHTIG! Trotzdem müssen sie mit lorentztransformiert werden!!!

        let directions = [
            [3, 0],
            [0, 1],
            [2, 1],
            [3, 2]
        ];

        dist_corners = distance(trapez.points[directions[ii][0]], trapez.points[directions[ii][1]]);

        let dx = (trapez.points[directions[ii][1]].x - trapez.points[directions[ii][0]].x);
        let dy = (trapez.points[directions[ii][1]].y - trapez.points[directions[ii][0]].y);
        let dx_normiert = dx / dist_corners;
        let dy_normiert = dy / dist_corners;

        for (let jj = 1; jj < 1000; jj++) {

            if (Math.sqrt(Math.pow((dx_normiert * tick_dist * jj), 2) + Math.pow((dy_normiert * tick_dist * jj), 2)) >= dist_corners) {
                break
            }

            let temporary_offset_x;
            if (trapez.points[0].x < 0) {
                temporary_offset_x = (Math.abs(Math.abs((trapez.points[1].x - trapez.points[0].x)) - Math.abs((trapez.points[2].x - trapez.points[3].x))))/2
            } else {
                temporary_offset_x = 0
            }

            let temporary_offset_y;
            if (trapez.points[2].y > 0) {
                temporary_offset_y = trapez.points[2].y + 0.5
            } else {
                temporary_offset_y = 0
            }

            let tickPoint_0;

            if (turnLorentzTransformOn == 1) {
                tickPoint_0 = [
                    trapez.points[directions[ii][0]].x + 0.5 + dx_normiert * tick_dist * jj + trapez.left + temporary_offset_x,
                    trapez.points[directions[ii][0]].y + dy_normiert * tick_dist * jj + trapez.top - temporary_offset_y
                ];
            } else {
                tickPoint_0 = [
                    trapez.points[directions[ii][0]].x + 0.5 + dx_normiert * tick_dist * jj + trapez.left - trapez.width / 2 - 1,
                    trapez.points[directions[ii][0]].y - 0.5 + dy_normiert * tick_dist * jj + trapez.top - temporary_offset_y + trapez.height / 2 + 1
                ];
            }

            let tickPoint_1;

            if (ii == 0 || ii == 1) {
                tickPoint_1 = [
                    tickPoint_0[0] - dy_normiert * tick_length,
                    tickPoint_0[1] + dx_normiert * tick_length
                ];
            } else {
                tickPoint_1 = [
                    tickPoint_0[0] + dy_normiert * tick_length,
                    tickPoint_0[1] - dx_normiert * tick_length
                ];
            }

            tickPoint_0 = rotatePoint(tickPoint_0, trapez.angle, trapez.left, trapez.top);
            tickPoint_1 = rotatePoint(tickPoint_1, trapez.angle, trapez.left, trapez.top);

            let tick = new fabric.Line(
                [tickPoint_0[0], tickPoint_0[1], tickPoint_1[0], tickPoint_1[1]],
                {
                    fill: '#666',
                    stroke: '#666',
                    strokeWidth: tickWidth,
                    evented: false,
                    objectCaching: false,
                    lockMovementX: false,
                    lockMovementY: false,
                    lockScalingX: true,
                    lockScalingY: true,
                    selectable: false,
                    originX: 'center',
                    originY: 'center',
                    hasBorders: false,
                    hasControls: false,

                }
            );

            tick.parentSector = [trapez.parent.ID, trapez.parent.ticks.length];

            tick.relationship = getRelationship(tick, tick.parentSector[0]);

            trapez.parent.ticks.push(tick);

            if (turnLorentzTransformOn == 1) {
                getStartAndEndPointCoordsBeforeLorentztransform(tick)
            }

            canvas.add(tick);

        }

    }
}


/**
 * Draw a light cone within the given trapezoid if Lorentz transformations are enabled.
 *
 * @param {fabric.Polygon} trapez - The trapezoid within which to draw the light cone.
 */
function drawLightCone(trapez) {
    if (turnLorentzTransformOn == 1){

        if (Math.abs(trapez.points[3].x - trapez.points[2].x) < epsilon){
            return
        }

        let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(trapez);

        let temporary_offset_y;

        if (trapez.points[2].y > 0){
            temporary_offset_y = trapez.points[2].y
        } else {
            temporary_offset_y = 0
        }

        let lightConesPoint_0 = [
            trapezPointsAsGlobalCoords[3].x + 0.5, trapezPointsAsGlobalCoords[3].y - 0.5
        ];


        let lightConesPoint_1 = [
            lightConesPoint_0[0] + lightConeLength / Math.sqrt(2),
            lightConesPoint_0[1] - lightConeLength / Math.sqrt(2)
        ];

            let   lightCone = new fabric.Line(
            [lightConesPoint_0[0], lightConesPoint_0[1], lightConesPoint_1[0], lightConesPoint_1[1]] ,
            {
                fill: '#666',
                stroke: '#666',
                strokeWidth: tickWidth/2,
                evented: false,
                objectCaching: false,
                lockMovementX: false,
                lockMovementY: false,
                lockScalingX: true,
                lockScalingY: true,
                selectable: false,
                originX: 'center',
                originY: 'center',
                hasBorders: false,
                hasControls: false,

            }
        );
        lightCone.parentSector = [trapez.parent.ID, trapez.parent.ticks.length];
        lightCone.relationship = getRelationship(lightCone, lightCone.parentSector[0]);
        trapez.parent.ticks.push(lightCone);
        getStartAndEndPointCoordsBeforeLorentztransform(lightCone);
        canvas.add(lightCone);
    }

}


/**
 * Draws a vector on the canvas.
 *
 * @param {fabric.Point} vectorPointCoords - The coordinates of the vector's starting point.
 * @param {fabric.Point} vectorHeadCoords - The coordinates of the vector's ending point.
 * @param {number} vectorParentID - The ID of the parent sector.
 * @param {number} vectorGlobalID - The global ID of the vector.
 * @param {number} vectorLocalID - The local ID of the vector within its parent sector.
 * @param {string} type - The type of vector ('vector' or 'duplicate').
 * @param {boolean} pushHistoryToSet - Indicates whether to push the vector creation to the history.
 */
function drawVector(vectorPointCoords, vectorHeadCoords, vectorParentID, vectorGlobalID, vectorLocalID, type, pushHistoryToSet) {

    let vectorHeadOrientation = toDegree(Math.atan2(vectorHeadCoords.y - vectorPointCoords.y, vectorHeadCoords.x - vectorPointCoords.x)) + 90;
    if (type === 'vector') {
        let vector = [];
        let immediatehistory = [5];
        let vectorParametersOnMouseDown;

        let vectorPoint = new fabric.Circle({
            ID: vectorGlobalID,
            radius: 5,
            fill: 'blue',
            padding: 5,
            left: vectorPointCoords.x,
            top: vectorPointCoords.y,
            evented: true,
            objectCaching: false,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            selectable: true,
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: true
        });
        vectorPoint.duplicateGlobalIDs = [];

        vectorPoint.setControlsVisibility({
            tl: false,
            mt: false,
            tr: false,
            mr: false,
            ml: false,
            bl: false,
            mb: false,
            br: false,
            mtr: false
        });

        vectorPoint.relationship = getRelationship(vectorPoint, vectorParentID);
        vectorPoint.parentSector = [vectorParentID, vectorLocalID];

        vectorPoint.on('mousedown', function (o) {

            isVectorPointDragged = true;
            changeVectorWidth();

            for (let ii = 0; ii < lines.length; ii++) {
                for (let jj = 0; jj < lines[ii].length; jj++) {
                    lines[ii][jj].strokeWidth = lineStrokeWidthWhenNotSelected;
                }
            }

            chosenLineGlobalID = -1;
            showGeodesicButtons(true);
            let sectorID = vectorPoint.parentSector[0];
            vectorParametersOnMouseDown = getVectorParameters(sectorID, vectorPoint.parentSector[1]);
            //Hier wird verhindert, dass ein Vektor in einen überlappenden Sektor bewegt wird.
            canvas.bringToFront(sectors[vectorPoint.parentSector[0]].trapez);
            updateMinions(sectors[vectorPoint.parentSector[0]].trapez);
            drawSnapEdges(sectors[vectorPoint.parentSector[0]].ID);

            let cloneIcon = 'button_icons/duplicate_vector.png'
            let cloneImg = document.createElement('img');
            cloneImg.src = cloneIcon;

            fabric.Circle.prototype.transparentCorners = true;
            fabric.Circle.prototype.cornerColor = 'blue';
            fabric.Circle.prototype.cornerStyle = 'circle';

            function renderIcon(icon) {
                return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
                    let size = this.cornerSize;
                    ctx.save();
                    ctx.translate(left, top);
                    // ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
                    ctx.drawImage(icon, -size/2, -size/2, size, size);
                    ctx.restore();
                }

            }

            let controlOffsetX;
            let controlOffsetY;
            let outboundParameter = 10;
            let outboundPoints = [];
            let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[vectorPoint.parentSector[0]].trapez);

            for (let ii = 0; ii < 4; ii++) {
                let outboundPoint = new fabric.Point(trapezPointsAsGlobalCoords[ii].x + (trapezPointsAsGlobalCoords[(ii + 2) % 4].x - trapezPointsAsGlobalCoords[ii].x) * outboundParameter,
                    trapezPointsAsGlobalCoords[ii].y + (trapezPointsAsGlobalCoords[(ii + 2) % 4].y - trapezPointsAsGlobalCoords[ii].y) * outboundParameter);
                outboundPoints.push(outboundPoint);
            }

            let vectorPointPosition = new fabric.Point(vectorPoint.left, vectorPoint.top);
            let vectorHeadPosition = new fabric.Point(vectorHead.left, vectorHead.top);

            if(distancePointStraightLine(vectorPointPosition.x, vectorPointPosition.y, outboundPoints[1].x, outboundPoints[1].y,
                outboundPoints[2].x - outboundPoints[1].x, outboundPoints[2].y - outboundPoints[1].y) >= distancePointStraightLine(vectorHeadPosition.x, vectorHeadPosition.y, outboundPoints[1].x, outboundPoints[1].y,
                outboundPoints[2].x - outboundPoints[1].x, outboundPoints[2].y - outboundPoints[1].y)) {
                controlOffsetX = 35;
            } else {
                controlOffsetX = -15;
            }

            if(distancePointStraightLine(vectorPointPosition.x, vectorPointPosition.y, outboundPoints[2].x, outboundPoints[2].y,
                outboundPoints[3].x - outboundPoints[2].x, outboundPoints[3].y - outboundPoints[2].y) >= distancePointStraightLine(vectorHeadPosition.x, vectorHeadPosition.y, outboundPoints[1].x, outboundPoints[1].y,
                outboundPoints[3].x - outboundPoints[2].x, outboundPoints[3].y - outboundPoints[2].y)) {
                controlOffsetY = -10;
            } else {
                controlOffsetY = 30;
            }

            fabric.Circle.prototype.controls.tl = new fabric.Control({
                x: -0.5,
                y: -0.5,
                offsetY: controlOffsetY,
                offsetX: controlOffsetX,
                cursorStyle: 'pointer',
                mouseUpHandler: cloneObject,
                render: renderIcon(cloneImg),
                cornerSize: 40
            });

            vectorPoint.setControlVisible('tl', true);
            canvas.bringToFront(vectors[vectorPoint.ID][1]);
            canvas.bringToFront(vectors[vectorPoint.ID][2]);
            console.log(vectorPoint.duplicateGlobalIDs);
        })

        function cloneObject(eventData, transform) {
            let target = transform.target;
            let canvas = target.canvas;
            let vectorPointPosition = new fabric.Point(vectorPoint.left, vectorPoint.top);
            let vectorHeadPosition = new fabric.Point(vectorHead.left, vectorHead.top);
            let vectorLocalID = sectors[vectorPoint.parentSector[0]].vectorDuplicates.length;
            drawVector(vectorPointPosition, vectorHeadPosition, vectorPoint.parentSector[0], vectorDuplicates.length, vectorLocalID, 'duplicate', true);
            vectorDuplicates[vectorDuplicates.length - 1][1].strokeWidth = vectorStrokeWidthWhenSelected;
            vectorPoint.duplicateGlobalIDs.push(vectorDuplicates.length - 1);
            canvas.bringToFront(vectorPoint);
        }

        vectorPoint.on('mouseup', function() {
            isVectorPointDragged = false;

            let vectorParentIDs = [];
            for (let ii = 0; ii < sectors.length; ii++) {
                if(sectors[ii].vectors.includes(vectors[vectorPoint.ID]) !== false) {
                    vectorParentIDs.push([ii, sectors[ii].vectors.indexOf(vectors[vectorPoint.ID])]);
                }
            }
            for (let ii = 0; ii < vectorParentIDs.length; ii++) {
                if(vectorParentIDs[ii][0] !== getParentSectorOfPoint(new fabric.Point(vectorPoint.left, vectorPoint.top))) {
                    sectors[vectorParentIDs[ii][0]].vectors.splice(vectorParentIDs[ii][1], 1);
                }
            }

            let immediatehistory = [6];
            let sectorID = vectorPoint.parentSector;
            let vectorParametersOnMouseUp = getVectorParameters(sectorID[0], vectorPoint.parentSector[1]);
            if(areArraysDifferent(vectorParametersOnMouseDown, vectorParametersOnMouseUp) !== false) {
                immediatehistory.push(sectorID[0], sectorID[1], vectorParametersOnMouseDown);
                history.push(immediatehistory);
            }
        })

        vector.push(vectorPoint);

        let points = [vectorPoint.left, vectorPoint.top, vectorHeadCoords.x, vectorHeadCoords.y];
        let vectorLine = new fabric.Line(points, {
            ID: vectors.length,
            strokeWidth: 3,
            stroke: 'blue',
            fill: 'blue',
            originX: 'center',
            originY: 'center',
            perPixelTargetFind: true,
            objectCaching: false,
            hasBorders: false,
            hasControls: false,
            evented: true,
            lockMovementX: true,
            lockMovementY: true
        });

        vectorLine.on('mousedown', function () {
            showGeodesicButtons(true);
            changeVectorWidth();
            for (let ii = 0; ii < lines.length; ii++) {
                for (let jj = 0; jj < lines[ii].length; jj++) {
                    lines[ii][jj].strokeWidth = lineStrokeWidthWhenNotSelected;
                }
            }
            chosenLineGlobalID = -1;
            canvas.bringToFront(vectors[vectorLine.ID][1]);
            canvas.bringToFront(vectors[vectorLine.ID][2]);
        });

        vector.push(vectorLine);
        vectorLine.relationship = getRelationshipForAnyObjecCombination(vectorLine, vectorPoint);

        let vectorHead = new fabric.Triangle({
            ID: vectors.length,
            stroke: "blue",
            strokeWidth: 3,
            fill: "blue",
            selectable: true,
            hasControls: false,
            top: vectorHeadCoords.y,
            left: vectorHeadCoords.x,
            originX: "center",
            originY: "center",
            evented: true,
            hasBorders: false,
            width: 12,
            height: 15,
            angle: vectorHeadOrientation
        });

        let dx = vectorHead.left - vectorPoint.left;
        let dy = vectorHead.top - vectorPoint.top;
        let unitVectorX_orientationLine = dx / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        let unitVectorY_orientationLine = dy / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        let orientationLineLength = 250;
        let orientationLinePoints = [vectorPoint.left, vectorPoint.top,
            vectorPoint.left + orientationLineLength * unitVectorX_orientationLine, vectorPoint.top + orientationLineLength * unitVectorY_orientationLine];
        vectorPoint.orientationLine = new fabric.Line(orientationLinePoints, {
            strokeWidth: 1,
            stroke: 'blue',
            fill: 'blue',
            originX: 'center',
            originY: 'center',
            perPixelTargetFind: true,
            objectCaching: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            opacity: 0
        })
        canvas.add(vectorPoint.orientationLine);
        vectorPoint.orientationLine.relationship = getRelationshipForAnyObjecCombination(vectorPoint.orientationLine, vectorPoint);

        vectorHead.on('mousedown', function(o) {

            pointer = canvas.getPointer(o.e);
            let sectorID = vectorPoint.parentSector[0];
            vectorParametersOnMouseDown = getVectorParameters(sectorID, vectorPoint.parentSector[1]);

            changeVectorWidth();
            for (let ii = 0; ii < lines.length; ii++) {
                for (let jj = 0; jj < lines[ii].length; jj++) {
                    lines[ii][jj].strokeWidth = lineStrokeWidthWhenNotSelected;
                }
            }
            chosenLineGlobalID = -1;

            showGeodesicButtons(true);

        })
        vectorHead.on('moving', function(o) {

            let vectorPointPosition = new fabric.Point(vectorPoint.left, vectorPoint.top);
            let dx = pointer.x - vectorPoint.left;
            let dy = pointer.y - vectorPoint.top;
            let vectorAngle = toDegree(Math.atan2(dy, dx)) + 90;
            let unitVectorX = dx / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            let unitVectorY = dy / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            if(distance(vectorPointPosition, pointer) >= abortLengthVector && distance(vectorPointPosition, pointer) <= maxLengthVector) {
                vectorHead.set({
                   left: pointer.x,
                   top: pointer.y,
                   angle: vectorAngle
                });
            } else if(distance(vectorPointPosition, pointer) < abortLengthVector) {
                vectorHead.set({
                   left: vectorPoint.left + unitVectorX * abortLengthVector,
                   top: vectorPoint.top + unitVectorY * abortLengthVector,
                   angle: vectorAngle
                });
            } else {
                vectorHead.set({
                    left: vectorPoint.left + unitVectorX * maxLengthVector,
                    top: vectorPoint.top + unitVectorY * maxLengthVector,
                    angle: vectorAngle
                });
            }

            let vectorPointPositionOnMouseDown = new fabric.Point(vectorParametersOnMouseDown[2], vectorParametersOnMouseDown[3]);
            let vectorHeadPositionOnMouseDown = new fabric.Point(vectorParametersOnMouseDown[4], vectorParametersOnMouseDown[5]);
            let vectorLengthOnMouseDown = distance(vectorPointPositionOnMouseDown, vectorHeadPositionOnMouseDown);
            let rotateEnvironment = 10;
            if(distance(pointer, vectorPointPositionOnMouseDown) >= vectorLengthOnMouseDown - rotateEnvironment && distance(pointer, vectorPointPositionOnMouseDown) <= vectorLengthOnMouseDown + rotateEnvironment) {
                vectorHead.set({
                    left: vectorPoint.left + unitVectorX * vectorLengthOnMouseDown,
                    top: vectorPoint.top + unitVectorY * vectorLengthOnMouseDown,
                    angle: vectorAngle
                });
            }

            let vectorHeadAngleOnMouseDown = toDegree(Math.atan2(vectorParametersOnMouseDown[5] - vectorParametersOnMouseDown[3], vectorParametersOnMouseDown[4] - vectorParametersOnMouseDown[2])) + 90;
            let scaleEnvironment = 5;
            let unitVectorHeadX = (vectorHeadPositionOnMouseDown.x - vectorPointPositionOnMouseDown.x) / vectorLengthOnMouseDown;
            let unitVectorHeadY = (vectorHeadPositionOnMouseDown.y - vectorPointPositionOnMouseDown.y) / vectorLengthOnMouseDown;
            let alpha = toRadians(vectorAngle - vectorHeadAngleOnMouseDown);
            let lambda = distance(vectorHeadPositionOnMouseDown, pointer) * Math.cos(alpha);
            if(distance(pointer, vectorPointPositionOnMouseDown) <= distance(vectorHeadPositionOnMouseDown, vectorPointPositionOnMouseDown)) {
                lambda = distance(vectorHeadPositionOnMouseDown, pointer) * Math.cos(alpha) * (-1);
            }
            if(vectorAngle >= vectorHeadAngleOnMouseDown - scaleEnvironment && vectorAngle <= vectorHeadAngleOnMouseDown + scaleEnvironment) {
                if(distance(pointer, vectorPointPosition) >= abortLengthVector && distance(pointer, vectorPointPosition) <= maxLengthVector) {
                    vectorHead.set({
                        left: vectorPoint.left + unitVectorHeadX * (vectorLengthOnMouseDown + lambda),
                        top: vectorPoint.top + unitVectorHeadY * (vectorLengthOnMouseDown + lambda),
                        angle: vectorHeadAngleOnMouseDown
                    });
                } else if(distance(pointer, vectorPointPosition) < abortLengthVector) {
                    vectorHead.set({
                        left: vectorPoint.left + unitVectorHeadX * abortLengthVector,
                        top: vectorPoint.top + unitVectorHeadY * abortLengthVector,
                        angle: vectorHeadAngleOnMouseDown
                    });
                } else {
                    vectorHead.set({
                        left: vectorPoint.left + unitVectorHeadX * maxLengthVector,
                        top: vectorPoint.top + unitVectorHeadY * maxLengthVector,
                        angle: vectorHeadAngleOnMouseDown
                    });
                }
            }

            vectorLine.set({
                x1: vectorPoint.left,
                y1: vectorPoint.top,
                x2: vectorHead.left,
                y2: vectorHead.top,
                angle: 0
            });
            vectorPoint.orientationLine.set({
                x1: vectorPoint.left,
                y1: vectorPoint.top,
                x2: vectorPoint.left + orientationLineLength * (vectorHead.left - vectorPoint.left) / Math.sqrt(Math.pow(vectorHead.left - vectorPoint.left, 2) + Math.pow(vectorHead.top - vectorPoint.top, 2)),
                y2: vectorPoint.top + orientationLineLength * (vectorHead.top - vectorPoint.top) / Math.sqrt(Math.pow(vectorHead.left - vectorPoint.left, 2) + Math.pow(vectorHead.top - vectorPoint.top, 2)),
                angle: 0
            });

            vectorLine.setCoords();
            vectorHead.setCoords();
            vectorPoint.orientationLine.setCoords();
            vectorPoint.orientationLine.relationship = getRelationshipForAnyObjecCombination(vectorPoint.orientationLine, vectorPoint);
            vectorLine.relationship = getRelationshipForAnyObjecCombination(vectorLine, vectorPoint);
            vectorHead.relationship = getRelationshipForAnyObjecCombination(vectorHead, vectorPoint);
            canvas.renderAll();

        })

        vectorHead.on('mouseup', function(o) {
                let immediatehistory = [6];
                let sectorID = vectorPoint.parentSector;
                let vectorParametersOnMouseUp = getVectorParameters(sectorID[0], vectorPoint.parentSector[1]);
                if(areArraysDifferent(vectorParametersOnMouseDown, vectorParametersOnMouseUp) !== false) {
                    immediatehistory.push(vectorPoint.parentSector[0], vectorPoint.parentSector[1], vectorParametersOnMouseDown);
                    history.push(immediatehistory);
                }
        })

        vector.push(vectorHead);
        vectorHead.relationship = getRelationshipForAnyObjecCombination(vectorHead, vectorPoint);
        sectors[vectorParentID].vectors.splice(vectorLocalID, 0, vector);
        vectors.splice(vectorGlobalID, 0, vector);
        for (let ii = 0; ii < vector.length; ii++) {
            canvas.add(vector[ii]);
        }
        if(pushHistoryToSet === true) {
            immediatehistory.push(vectorPoint.ID, vectorLine.ID, vectorHead.ID);
            history.push(immediatehistory);
        }
        canvas.setActiveObject(vectorPoint);
        canvas.renderAll();
    }

    if(type === 'duplicate') {
        let vectorDuplicate = [];
        let immediatehistory = [5, 'duplicate'];

        let vectorPointDuplicate = new fabric.Circle({
            ID: vectorGlobalID,
            radius: 5,
            fill: "grey",
            left: vectorPointCoords.x,
            top: vectorPointCoords.y,
            evented: true,
            objectCaching: false,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            selectable: true,
            originX: 'center',
            originY: 'center',
            hasBorders: false,
            hasControls: false
        });

        vectorDuplicate.push(vectorPointDuplicate);
        vectorPointDuplicate.on('mousedown', function() {
            canvas.setActiveObject(vectorPointDuplicate);
            changeVectorWidth();
            for (let ii = 0; ii < lines.length; ii++) {
                for (let jj = 0; jj < lines[ii].length; jj++) {
                    lines[ii][jj].strokeWidth = lineStrokeWidthWhenNotSelected;
                }
            }
            chosenLineGlobalID = -1;
            canvas.bringToFront(vectorDuplicates[vectorPointDuplicate.ID][1]);
            canvas.bringToFront(vectorDuplicates[vectorPointDuplicate.ID][2]);
            showGeodesicButtons(true);
        })

        let points = [
            vectorPointCoords.x,
            vectorPointCoords.y,
            vectorHeadCoords.x,
            vectorHeadCoords.y
        ]
        let vectorLineDuplicate = new fabric.Line(points, {
            ID: vectorGlobalID,
            strokeWidth: 3,
            stroke: 'grey',
            fill: 'grey',
            originX: 'center',
            originY: 'center',
            perPixelTargetFind: true,
            objectCaching: false,
            hasBorders: false,
            hasControls: false,
            evented: true,
            lockMovementX: true,
            lockMovementY: true,
        });
        vectorLineDuplicate.on('mousedown', function() {
            canvas.setActiveObject(vectorLineDuplicate);
            changeVectorWidth();
            for (let ii = 0; ii < lines.length; ii++) {
                for (let jj = 0; jj < lines[ii].length; jj++) {
                    lines[ii][jj].strokeWidth = lineStrokeWidthWhenNotSelected;
                }
            }
            chosenLineGlobalID = -1;
            showGeodesicButtons(true);
            canvas.bringToFront(vectorDuplicates[vectorPointDuplicate.ID][1]);
            canvas.bringToFront(vectorDuplicates[vectorPointDuplicate.ID][2]);
        })
        vectorDuplicate.push(vectorLineDuplicate);

        let vectorHeadDuplicate = new fabric.Triangle({
            ID: vectorGlobalID,
            stroke: "grey",
            strokeWidth: 3,
            fill: "grey",
            selectable: false,
            hasControls: false,
            hasBorders: false,
            left: vectorHeadCoords.x,
            top: vectorHeadCoords.y,
            originX: "center",
            originY: "center",
            evented: true,
            angle: vectorHeadOrientation,
            width: 12,
            height: 15,
            lockMovementX: true,
            lockMovementY: true
        });

        let dx = vectorHeadDuplicate.left - vectorPointDuplicate.left;
        let dy = vectorHeadDuplicate.top - vectorPointDuplicate.top;
        let unitVectorX = dx / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        let unitVectorY = dy / Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        let orientationLineLength = 250;
        let orientationLinePoints = [vectorPointDuplicate.left, vectorPointDuplicate.top,
            vectorPointDuplicate.left + orientationLineLength * unitVectorX, vectorPointDuplicate.top + orientationLineLength * unitVectorY];
        vectorPointDuplicate.orientationLine = new fabric.Line(orientationLinePoints, {
            strokeWidth: 1,
            stroke: 'grey',
            fill: 'grey',
            originX: 'center',
            originY: 'center',
            perPixelTargetFind: true,
            objectCaching: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            opacity: 0
        })
        canvas.add(vectorPointDuplicate.orientationLine);
        vectorPointDuplicate.orientationLine.relationship = getRelationshipForAnyObjecCombination(vectorPointDuplicate.orientationLine, vectorPointDuplicate);

        vectorHeadDuplicate.on('mousedown', function() {
            canvas.setActiveObject(vectorHeadDuplicate);
            changeVectorWidth();
            for (let ii = 0; ii < lines.length; ii++) {
                for (let jj = 0; jj < lines[ii].length; jj++) {
                    lines[ii][jj].strokeWidth = lineStrokeWidthWhenNotSelected;
                }
            }
            chosenLineGlobalID = -1;
            showGeodesicButtons(true);
        })
        vectorDuplicate.push(vectorHeadDuplicate);

        for (let ii = 0; ii < vectorDuplicate.length; ii++) {
            vectorDuplicate[ii].relationship = getRelationship(vectorDuplicate[ii], sectors[vectorParentID].ID);
            vectorDuplicate[ii].parentSector = [sectors[vectorParentID].ID, vectorLocalID];
        }

        vectorPointDuplicate.setCoords();
        vectorLineDuplicate.setCoords();
        vectorHeadDuplicate.setCoords();
        canvas.add(vectorPointDuplicate, vectorLineDuplicate, vectorHeadDuplicate);
        sectors[vectorParentID].vectorDuplicates.splice(vectorLocalID, 0, vectorDuplicate);
        vectorDuplicates.splice(vectorGlobalID, 0, vectorDuplicate);
        if(pushHistoryToSet === true) {
            immediatehistory.push(vectorPointDuplicate.ID, vectorLineDuplicate.ID, vectorHeadDuplicate.ID);
            history.push(immediatehistory);
        }
        canvas.setActiveObject(vectorPointDuplicate);
    }
}

/**
 * Change the stroke width of vectors based on their selection status.
 * When a vector is selected, it's given a thicker stroke; otherwise, it's set to the default stroke width.
 */
function changeVectorWidth() {

    for (let ii = 0; ii < vectors.length; ii++) {
        if(vectors[ii].includes(canvas.getActiveObject()) !== true) {
            vectors[ii][1].strokeWidth = vectorStrokeWidthWhenNotSelected;
        } else {
            vectors[ii][1].strokeWidth = vectorStrokeWidthWhenSelected;
        }
    }
    for (let ii = 0; ii < vectorDuplicates.length; ii++) {
        if(vectorDuplicates[ii].includes(canvas.getActiveObject()) !== true) {
            vectorDuplicates[ii][1].strokeWidth = vectorStrokeWidthWhenNotSelected;
        } else {
            vectorDuplicates[ii][1].strokeWidth = vectorStrokeWidthWhenSelected;
        }
    }

}

/**
 * Draws vertices (corner arcs) for each sector's trapezoid.
 * These vertices represent the corners of the trapezoids and allow for interaction.
 * Vertices are created as circular arcs with specific angles and colors.
 * When a vertex is clicked, it triggers actions related to sector snapping and angle calculations.
 */
function drawVertices() {


        for (let ii = 0; ii < sectors.length; ii++){

            let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[ii].trapez);

            for (let jj = 0; jj < 4; jj++) {

                let point_a = trapezPointsAsGlobalCoords[(jj + 1) % 4];
                let point_b = trapezPointsAsGlobalCoords[jj];
                let point_c = trapezPointsAsGlobalCoords[(jj + 3) % 4];

                let vec_ba_x = point_a.x - point_b.x;
                let vec_ba_y = point_a.y - point_b.y;

                let vec_bc_x = point_c.x - point_b.x;
                let vec_bc_y = point_c.y - point_b.y;

                let cornerAngle;

                cornerAngle = Math.acos((vec_ba_x * vec_bc_x + vec_ba_y * vec_bc_y) / (Math.sqrt(vec_ba_x * vec_ba_x + vec_ba_y * vec_ba_y) * Math.sqrt(vec_bc_x * vec_bc_x + vec_bc_y * vec_bc_y)))

                let strokeColooooor = ['red', 'blue', 'green', 'yellow'];

                let arc = new fabric.Circle({
                    radius: 8,
                    left: trapezPointsAsGlobalCoords[jj].x,
                    top: trapezPointsAsGlobalCoords[jj].y,
                    angle: 0 + 90 * jj + sectors[ii].trapez.angle - (jj % 2) * (toDegree(cornerAngle) - 90),
                    startAngle:0,
                    endAngle: cornerAngle,
                    stroke: '#575656',//strokeColooooor[jj],
                    strokeWidth: 16,
                    fill: '',
                    originY:'center',
                    originX:'center',
                    objectCaching: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    selectable: false,
                    hoverCursor: 'pointer',
                    perPixelTargetFind: true,
                    opacity: 0.0,
                });

                canvas.add(arc);


                arc.relationship = getRelationship(arc, sectors[ii].ID);

                arc.parentSector = sectors[ii].ID;
                arc.ID_on_sector = jj;

                sectors[ii].cornerArcs.push(arc);
                vertexAngleParts.push(arc);
                arc.ID_in_global = vertexAngleParts.length-1;

                arc.on('mouseup', function (o) {

                    let currentArcID = this.ID_on_sector;
                    let pickedSectorID = this.parentSector;
                    let nextSector = sectors[this.parentSector].neighbourhood[currentArcID];

                    let cornerAngleSum = this.endAngle;

                    let sectorsToSnap = [pickedSectorID];

                    for (let kk = 0; kk < 3; kk++){

                        if (nextSector > -1){

                            sectorsToSnap.push(nextSector);
                            //currentArcID im naechsten Sektor ermitteln
                            currentArcID = (currentArcID + 3) % 4;

                            cornerAngleSum += sectors[nextSector].cornerArcs[currentArcID].endAngle;

                            nextSector = sectors[nextSector].neighbourhood[currentArcID];

                        }else{
                            sectorsToSnap = [];
                            return
                        }
                    }


                    let deficitAngleRad = 2 * Math.PI - cornerAngleSum;

                    let deficitAngleDeg = 360 - toDegree(cornerAngleSum);

                    if (sectorsToSnap.length > 0){
                        for (let kk = 0; kk < 3; kk++){

                            snapInitialSectorToTargetSector(sectorsToSnap[kk + 1], sectorsToSnap[kk]);

                        }

                        for (let kk = 0; kk < 4; kk++){
                            removeSnapEdges(sectorsToSnap[kk]);
                            changeSnapStatus(sectorsToSnap[kk]);
                            drawSnapEdges(sectorsToSnap[kk])

                        }

                    }

                    if (turnOverlapControllOn == "1") {
                        for (let kk = 0; kk < sectors.length; kk++) {
                            overlapControll(sectors[kk].trapez)
                        }
                    }

                    removeDeficitAngleVisualize();

                    drawLongEdgeLine(sectorsToSnap[0], this.ID_on_sector, false);

                    drawLongEdgeLine(sectorsToSnap[sectorsToSnap.length - 1], (this.ID_on_sector + 1) % 4, true);

                    drawAngleArc(sectorsToSnap[0],this.ID_on_sector , deficitAngleRad);

                    //drawDeficitAngleVisualizePolygon(sectorsToSnap, this.ID_on_sector, deficitAngleRad)

                    let deficitAngleDeg4Dec = deficitAngleDeg.toFixed(4);
                    let infoboxDeficitAngleTextByLanguageOnClick = "Defizitwinkel:";
                    if (language == "english"){
                        infoboxDeficitAngleTextByLanguageOnClick = "deficit angle:"
                    }
                    infoboxDeficitAngleText.set('text', infoboxDeficitAngleTextByLanguageOnClick+"\n"+ deficitAngleDeg4Dec.toString() + "°")
                    canvas_side_bar_perm.renderAll()


                })


            }
        }

    canvas.renderAll();
}

/**
 * Adjusts the size and zoom level of the canvases and elements to fit the responsive container.
 * It calculates the scale ratio based on the container dimensions and scales the canvases and elements accordingly.
 * This function also handles fullscreen and exit fullscreen buttons' visibility.
 */
function fitResponsiveCanvas() {


    // canvas container dimensions
    let containerSize = {
        width: document.getElementById('canvas-overAll').offsetWidth,
        height: document.getElementById('canvas-overAll').offsetHeight
    };

    scaleRatio = Math.min(containerSize.width / canvasSize.width, containerSize.height / canvasSize.height);

    canvas_side_bar_perm.setWidth(100);
    canvas_side_bar_perm.setHeight(containerSize.height);

    canvas_side_tools_right.setWidth(360);
    canvas_side_tools_right.setHeight(80);

    if (showExerciseBox == "1"){
        canvas_exercise_box.setWidth(330);
        canvas_exercise_box.setHeight(200);
    }


    canvas.setWidth(containerSize.width * 1);
    canvas.setHeight(containerSize.height * 1);



    canvas.setZoom(scaleRatio);
    //canvas_side_bar_perm.setZoom(scaleRatio);
    //canvas_side_tools_right.setZoom(scaleRatio);
    if (showExerciseBox == "1") {
        //canvas_exercise_box.setZoom(scaleRatio);
    }
    setZoomPan(startZoom, startViewportTransform_4, startViewportTransform_5);

    if (!document.fullscreenElement) {
        if (fullscreen == undefined || exitFullscreen == undefined){
            return
        }
        exitFullscreen.opacity = 0;
        fullscreen.opacity = 1;
    }else {
        exitFullscreen.opacity = 1;
        fullscreen.opacity = 0;
    }

}

/**
 * changes the direction of a geodesic line to align with the direction of the triangle ruler
 */
function geodesicToGeodreieck(){
    let geodreieckWdithHalf = geodreieck.width / 2 * 0.12;


    //gEL1 = geodreieckEdgeLocal1
    //gEL2 = geodreieckEdgeLocal2
    let gEL1 = new fabric.Point(geodreieck.left - geodreieckWdithHalf, geodreieck.top);
    let gEL2 = new fabric.Point(geodreieck.left + geodreieckWdithHalf, geodreieck.top);

    let translation_x = geodreieck.left;
    let translation_y = geodreieck.top;

    let geodreieckEdgePoint1 = new fabric.Point(Math.cos(geodreieck.angle * Math.PI / 180) * (gEL1.x - translation_x) - Math.sin(geodreieck.angle * Math.PI / 180) * (gEL1.y - translation_y) + translation_x, Math.sin(geodreieck.angle * Math.PI / 180) * (gEL1.x - translation_x) + Math.cos(geodreieck.angle * Math.PI / 180) * (gEL1.y - translation_y) + translation_y);
    let geodreieckEdgePoint2 = new fabric.Point(Math.cos(geodreieck.angle * Math.PI / 180) * (gEL2.x - translation_x) - Math.sin(geodreieck.angle * Math.PI / 180) * (gEL2.y - translation_y) + translation_x, Math.sin(geodreieck.angle * Math.PI / 180) * (gEL2.x - translation_x) + Math.cos(geodreieck.angle * Math.PI / 180) * (gEL2.y - translation_y) + translation_y);


    if (Math.abs(geodreieck.angle - 90) < epsilon){
        line.set({x2: line.x1, y2: pointer.y})
    }
    if (Math.abs(geodreieck.angle - 90) > epsilon){
        if(Math.abs(geodreieckEdgePoint2.x - geodreieckEdgePoint1.x) > Math.abs(geodreieckEdgePoint2.y - geodreieckEdgePoint1.y)) {
            line.set({x2: pointer.x, y2: (pointer.x - line.x1) * Math.tan((geodreieck.angle) * Math.PI / 180) + line.y1});
        }else{
            line.set({x2: (pointer.y - line.y1) * Math.tan((- geodreieck.angle  + 90) * Math.PI / 180) + line.x1, y2: pointer.y});
        }
    }

}

/**
 * Calculates whether a geodesic line is aligned close enough to the triangle ruler so the geodesic can be drawn in the
 * triangle rulers direction
 *
 * @returns {boolean} True if the geodesics direction is close enough to the triangle rulers, false otherwise
 */
function geodesicToGeodreieckCalc(){



    if(button_dreieck_empty.opacity == 0){
        return false
    }

    let geodreieckWdithHalf = geodreieck.width / 2 * 0.12;
    let geodreieckHeightHalf = geodreieck.height / 2 * 0.12;
    let geodreieckMidPoint = new fabric.Point(geodreieck.left, geodreieck.top);

    //gEL1 = geodreieckEdgeLocal1
    //gEL2 = geodreieckEdgeLocal2
    let gEL1 = new fabric.Point(geodreieck.left - geodreieckWdithHalf, geodreieck.top);
    let gEL2 = new fabric.Point(geodreieck.left + geodreieckWdithHalf, geodreieck.top);

    let translation_x = geodreieck.left;
    let translation_y = geodreieck.top;


    // x = cos(geodreieckWinkel) * abstandPunktMittelpunkt + geodreieck.left
    // y = sin(geodreieckWinkel) * abstandPunktMittelpunkt + geodreieck.top

    //let geodreieckEdgeMidPoint = new fabric.Point(geodreieck.left + Math.cos((geodreieck.angle + 90) * Math.PI / 180) * geodreieckHeightHalf, geodreieck.top + Math.sin((geodreieck.angle + 90) * Math.PI / 180) * geodreieckHeightHalf);
    let geodreieckEdgeMidPoint = new fabric.Point(geodreieck.left, geodreieck.top);

    let xg1 = line.x1;
    let yg1 = line.y1;
    let xg2 = pointer.x;
    let yg2 = pointer.y;

    let delta_x = xg2 - xg1;
    let delta_y = yg2 - yg1;

    let geodreieckEdgePoint1 = new fabric.Point(Math.cos(geodreieck.angle * Math.PI / 180) * (gEL1.x - translation_x) - Math.sin(geodreieck.angle * Math.PI / 180) * (gEL1.y - translation_y) + translation_x, Math.sin(geodreieck.angle * Math.PI / 180) * (gEL1.x - translation_x) + Math.cos(geodreieck.angle * Math.PI / 180) * (gEL1.y - translation_y) + translation_y);
    let geodreieckEdgePoint2 = new fabric.Point(Math.cos(geodreieck.angle * Math.PI / 180) * (gEL2.x - translation_x) - Math.sin(geodreieck.angle * Math.PI / 180) * (gEL2.y - translation_y) + translation_x, Math.sin(geodreieck.angle * Math.PI / 180) * (gEL2.x - translation_x) + Math.cos(geodreieck.angle * Math.PI / 180) * (gEL2.y - translation_y) + translation_y);

    let deltaGeodreieck_x = geodreieckEdgePoint2.x - geodreieckEdgePoint1.x;
    let deltaGeodreieck_y = geodreieckEdgePoint2.y - geodreieckEdgePoint1.y;

    //atan2 bruacht zwei Argumente die eingegeben werden muessen. In diesem Fall die Differenzen der Koordinaten.
    let geodesicAngle = Math.atan2(delta_y, delta_x) * 180 / Math.PI;

    let lineStartPoint = new fabric.Point(line.x1, line.y1);

    let angleDifference = Math.abs((geodesicAngle - geodreieck.angle ) - Math.round((geodesicAngle - geodreieck.angle )/ 180) * 180);

    if (distancePointStraightLine(lineStartPoint.x, lineStartPoint.y, geodreieckEdgePoint1.x, geodreieckEdgePoint1.y, deltaGeodreieck_x, deltaGeodreieck_y) < 5 & angleDifference < 20) {

        return true
    }else{
        return false
    }
}

/**
 * Positions the geodesic line to the specified mark point or retrieves the coordinates of the mark point.
 *
 * @param {number} markNumber - The index of the mark point to interact with.
 *
 * @returns {fabric.Point|undefined} If `lineTypeToDraw` is "geodesic", updates the geodesic line's end point to the specified mark point.
 *                                  If `lineTypeToDraw` is not "geodesic," returns the coordinates of the specified mark point.
 *                                  Returns undefined if the markNumber is invalid.
 */
function geodesicToMark(markNumber) {
    let markPointCoords = new fabric.Point(markPoints[markNumber].left, markPoints[markNumber].top);
    if (lineTypeToDraw == "geodesic"){
        line.set({x2: markPointCoords.x, y2: markPointCoords.y})
    }else{return markPointCoords}

}

/**
 * Checks if the pointer is close to any visible mark point and returns information about the nearest mark point.
 *
 * @returns {Array} An array containing two elements:
 *   - A boolean indicating whether the pointer is close to a mark point.
 *   - The index of the nearest mark point, or undefined if none are close enough.
 */
function geodesicToMarkCalc() {

    if (markPoints.length > 0) {
        for (let ii = 0; ii < markPoints.length; ii++) {
            let markPointCoords = new fabric.Point(markPoints[ii].left, markPoints[ii].top);
            if (markPoints[ii].opacity !== 0){
                if (distance(markPointCoords, pointer) < snap_radius_markPoint) {
                    return [true, ii];
                }
            }
        }

    }

    return [false, ]
}

/**
 * Updates the geodesic line's endpoint to match the starting point of the current geodesic line.
 */
function geodesicToStart(){

    let geodesic_begin_point = new fabric.Point(lines[lineContinueAt][0].calcLinePoints().x1,lines[lineContinueAt][0].calcLinePoints().y1);
    geodesic_begin_point = fabric.util.transformPoint(geodesic_begin_point, lines[lineContinueAt][0].calcTransformMatrix() );

    line.set({x2: geodesic_begin_point.x, y2: geodesic_begin_point.y})
}

/**
 * Checks if the pointer is near the starting point of the current geodesic line.
 *
 * @returns {boolean} True if the pointer is near the starting point, otherwise false.
 */
function geodesicToStartCalc(){

    let geodesic_begin_point = new fabric.Point(lines[lineContinueAt][0].calcLinePoints().x1,lines[lineContinueAt][0].calcLinePoints().y1);
    geodesic_begin_point = fabric.util.transformPoint(geodesic_begin_point, lines[lineContinueAt][0].calcTransformMatrix() );

    if (distance(geodesic_begin_point, pointer) < 5) {
        return true
    }

    return false

}

/**
 * Moves the triangle ruler to the exact position of lines, vectors, and markPoints.
 *
 * @param {fabric.Object} geodreieckToMove - The triangle ruler to be moved.
 */
function geodreieckMove(geodreieckToMove){

    for (let ii = 0; ii < lines.length; ii++){
        if (lines[ii][lines[ii].length-1] !== undefined){

            let dragPointCoords = new fabric.Point(lines[ii][lines[ii].length-1].dragPoint.left, lines[ii][lines[ii].length-1].dragPoint.top);
            let geodreieckMidKante = new fabric.Point(geodreieck.left, geodreieck.top);
            if (distance(dragPointCoords, geodreieckMidKante) < snap_geodreieck_on_mark) {

                dist_x = dragPointCoords.x - geodreieckMidKante.x;
                dist_y = dragPointCoords.y - geodreieckMidKante.y;

                geodreieckToMove.left += dist_x;
                geodreieckToMove.top += dist_y
            }
        }
    }

    for (let ii = 0; ii < vectors.length; ii++) {
        if(vectors[ii][0] !== undefined) {
            let vectorPointPosition = new fabric.Point(vectors[ii][0].left, vectors[ii][0].top);
            let geodreieckMidKante = new fabric.Point(geodreieck.left, geodreieck.top);
            if(distance(vectorPointPosition, geodreieckMidKante) < snap_geodreieck_on_mark) {
                let dist_x = vectorPointPosition.x - geodreieckMidKante.x;
                let dist_y = vectorPointPosition.y - geodreieckMidKante.y;
                geodreieckToMove.left += dist_x;
                geodreieckToMove.top += dist_y;
                if(distance(vectorPointPosition, new fabric.Point(vectors[ii][2].left, vectors[ii][2].top)) <= 95) {
                    vectors[ii][0].orientationLine.opacity = 1;
                }
            } else {
                vectors[ii][0].orientationLine.opacity = 0;
            }
        }
    }

    for (let ii = 0; ii < vectorDuplicates.length; ii++) {
        if(vectorDuplicates[ii][0] !== undefined) {
            let vectorPointPosition = new fabric.Point(vectorDuplicates[ii][0].left, vectorDuplicates[ii][0].top);
            let geodreieckMidKante = new fabric.Point(geodreieck.left, geodreieck.top);
            if(distance(vectorPointPosition, geodreieckMidKante) < snap_geodreieck_on_mark) {
                let dist_x = vectorPointPosition.x - geodreieckMidKante.x;
                let dist_y = vectorPointPosition.y - geodreieckMidKante.y;
                geodreieckToMove.left += dist_x;
                geodreieckToMove.top += dist_y;
                if(distance(vectorPointPosition, new fabric.Point(vectorDuplicates[ii][2].left, vectorDuplicates[ii][2].top)) <= 95) {
                    vectorDuplicates[ii][0].orientationLine.opacity = 1;
                }
            } else {
                vectorDuplicates[ii][0].orientationLine.opacity = 0;
            }
        }
    }

    if (markPoints.length < 1) {
        return
    }

    for (let ii = 0; ii < markPoints.length; ii++) {
        let markPointCoords = new fabric.Point(markPoints[ii].left, markPoints[ii].top);
        let geodreieckMidKante = new fabric.Point(geodreieck.left, geodreieck.top);
        if (distance(markPointCoords, geodreieckMidKante) < snap_geodreieck_on_mark) {

            dist_x = markPointCoords.x - geodreieckMidKante.x;
            dist_y = markPointCoords.y - geodreieckMidKante.y;

            geodreieckToMove.left += dist_x;
            geodreieckToMove.top += dist_y
        }
    }

}

/**
 * Rotates the triangle ruler to align its orientation with lines and vectors.
 *
 * @param {fabric.Object} geodreieckToRotate - The triangle ruler to be rotated.
 */
function geodreieckRotate(geodreieckToRotate){

    let geodreieckWidthHalf = geodreieckToRotate.width / 2 * 0.12;
    let geodreieckHeightHalf = geodreieckToRotate.height / 2 * 0.12;
    let geodreieckMidPoint = new fabric.Point(geodreieckToRotate.left, geodreieckToRotate.top);

    //gEL1 = geodreieckEdgeLocal1
    //gEL2 = geodreieckEdgeLocal2
    let gEL1 = new fabric.Point(geodreieckToRotate.left - geodreieckWidthHalf, geodreieckToRotate.top);
    let gEL2 = new fabric.Point(geodreieckToRotate.left + geodreieckWidthHalf, geodreieckToRotate.top);

    let translation_x = geodreieckToRotate.left;
    let translation_y = geodreieckToRotate.top;


    // x = cos(geodreieckWinkel) * abstandPunktMittelpunkt + geodreieck.left
    // y = sin(geodreieckWinkel) * abstandPunktMittelpunkt + geodreieck.top

    //let geodreieckEdgeMidPoint = new fabric.Point(geodreieckToRotate.left + Math.cos((geodreieck.angle + 90) * Math.PI / 180) * geodreieckHeightHalf, geodreieckToRotate.top + Math.sin((geodreieck.angle + 90) * Math.PI / 180) * geodreieckHeightHalf);
    let geodreieckEdgeMidPoint = new fabric.Point(geodreieckToRotate.left, geodreieckToRotate.top);

    let geodreieckEdgePoint1 = new fabric.Point(Math.cos(geodreieck.angle * Math.PI / 180) * (gEL1.x - translation_x) - Math.sin(geodreieck.angle * Math.PI / 180) * (gEL1.y - translation_y) + translation_x, Math.sin(geodreieck.angle * Math.PI / 180) * (gEL1.x - translation_x) + Math.cos(geodreieck.angle * Math.PI / 180) * (gEL1.y - translation_y) + translation_y);
    let geodreieckEdgePoint2 = new fabric.Point(Math.cos(geodreieck.angle * Math.PI / 180) * (gEL2.x - translation_x) - Math.sin(geodreieck.angle * Math.PI / 180) * (gEL2.y - translation_y) + translation_x, Math.sin(geodreieck.angle * Math.PI / 180) * (gEL2.x - translation_x) + Math.cos(geodreieck.angle * Math.PI / 180) * (gEL2.y - translation_y) + translation_y);


    //canvas.add(new fabric.Circle({ radius: 5, fill: '#f55', left: geodreieckEdgePoint1.x , top: geodreieckEdgePoint1.y, originX: 'center', originY: 'center' }));
    //canvas.add(new fabric.Circle({ radius: 5, fill: '#f55', left: geodreieckEdgePoint2.x , top: geodreieckEdgePoint2.y, originX: 'center', originY: 'center' }));

    //canvas.add(new fabric.Circle({ radius: 5, fill: 'blue', left: geodreieckEdgeMidPoint.x, top: geodreieckEdgeMidPoint.y, originX: 'center', originY: 'center' }));
    for (let ii = 0; ii < lines.length; ii++){
        for (let jj = 0; jj < lines[ii].length; jj++)
        {

            let segment_end_point = new fabric.Point(lines[ii][jj].calcLinePoints().x2,lines[ii][jj].calcLinePoints().y2);
            segment_end_point = fabric.util.transformPoint(segment_end_point,lines[ii][jj].calcTransformMatrix() );

            let geodesic_start_point = new fabric.Point(lines[ii][jj].calcLinePoints().x1, lines[ii][jj].calcLinePoints().y1);
            geodesic_start_point = fabric.util.transformPoint(geodesic_start_point, lines[ii][jj].calcTransformMatrix());

            let xg1 = geodesic_start_point.x;
            let yg1 = geodesic_start_point.y;
            let xg2 = segment_end_point.x;
            let yg2 = segment_end_point.y;

            let delta_x = xg2 - xg1;
            let delta_y = yg2 - yg1;

            //atan2 bruacht zwei Argumente die eingegeben werden muessen. In diesem Fall die Differenzen der Koordinaten.
            let geodesicAngle = Math.atan2(delta_y, delta_x) * 180 / Math.PI;

            let lineSegmentMidPoint = new fabric.Point(xg1 + 0.5 * (xg2 - xg1), yg1 + 0.5 * (yg2 - yg1));

            //Float-Modulo: verschiebt die Winkeldifferenz so lange um 180, dass der Zielwert zwischen -90 und +90 liegt
            // -> Math.abs((geodesicAngle - geodreieck.angle ) - Math.round((geodesicAngle - geodreieck.angle )/ 180) * 180)
            if (Math.abs((geodesicAngle - geodreieckToRotate.angle ) - Math.round((geodesicAngle - geodreieckToRotate.angle )/ 180) * 180) < 5 & distancePointStraightLine(geodreieckEdgeMidPoint.x, geodreieckEdgeMidPoint.y, xg1, yg1, delta_x, delta_y) < 10 & distance(geodreieckEdgeMidPoint, lineSegmentMidPoint) < geodreieckWidthHalf - Math.sqrt(delta_x * delta_x + delta_y * delta_y)/2){

                geodreieckToRotate.angle += (geodesicAngle - geodreieckToRotate.angle ) - Math.round((geodesicAngle - geodreieckToRotate.angle )/ 180) * 180

            }
            if (Math.abs((geodesicAngle - geodreieckToRotate.angle ) - Math.round((geodesicAngle - geodreieckToRotate.angle )/ 180) * 180) < 5 & distance(geodreieckMidPoint, lineSegmentMidPoint) < 50){

                geodreieckToRotate.angle += (geodesicAngle - geodreieckToRotate.angle ) - Math.round((geodesicAngle - geodreieckToRotate.angle )/ 180) * 180

            }

        }




    }

    for (let ii = 0; ii < vectors.length; ii++) {
        let vectorPointPosition = new fabric.Point(vectors[ii][0].left, vectors[ii][0].top);
        if(distance(geodreieckMidPoint, vectorPointPosition) < 5) {
            let delta_x = vectors[ii][2].left - vectors[ii][0].left;
            let delta_y = vectors[ii][2].top - vectors[ii][0].top;
            let vectorLineAngle = toDegree(Math.atan2(delta_y, delta_x));
            if (Math.abs((vectorLineAngle - geodreieckToRotate.angle) - Math.round((vectorLineAngle - geodreieckToRotate.angle) / 180) * 180) < 5) {
                geodreieckToRotate.angle += (vectorLineAngle - geodreieckToRotate.angle) - Math.round((vectorLineAngle - geodreieckToRotate.angle) / 180) * 180
            }
        }
    }

    for (let ii = 0; ii < vectorDuplicates.length; ii++) {
        let vectorPointPosition = new fabric.Point(vectorDuplicates[ii][0].left, vectorDuplicates[ii][0].top);
        if(distance(geodreieckMidPoint, vectorPointPosition) < 5) {
            let delta_x = vectorDuplicates[ii][2].left - vectorDuplicates[ii][0].left;
            let delta_y = vectorDuplicates[ii][2].top - vectorDuplicates[ii][0].top;
            let vectorLineAngle = toDegree(Math.atan2(delta_y, delta_x));
            if (Math.abs((vectorLineAngle - geodreieckToRotate.angle) - Math.round((vectorLineAngle - geodreieckToRotate.angle) / 180) * 180) < 5) {
                geodreieckToRotate.angle += (vectorLineAngle - geodreieckToRotate.angle) - Math.round((vectorLineAngle - geodreieckToRotate.angle) / 180) * 180
            }
        }
    }


}

/**
 * gets the common edge index of two sectors
 * @param initialSectorID - the ID of the initial sector object
 * @param targetSectorID - the ID of the target sector object
 * @returns {number} - the common edge index of the given sectors with respect to the initial sector
 * or undefined in case the two sectors do not share an edge
 */
function getCommonEdgeNumber(initialSectorID, targetSectorID){
    let commonEdgeNumber;

    for (let ii = 0; ii < 4; ii++) {
        if (sectors[initialSectorID].neighbourhood[ii] === targetSectorID) {
            commonEdgeNumber = ii
        }
    }

    return commonEdgeNumber;
}

/**
 * Calculates the edge parameter for a given sector and coordinates.
 * @param {number} SectorID - The ID of the sector.
 * @param {number} xg1 - The x-coordinate of the starting point of the geodesic.
 * @param {number} yg1 - The y-coordinate of the starting point of the geodesic.
 * @param {number} dxg - The change in x-coordinate of the geodesic.
 * @param {number} dyg - The change in y-coordinate of the geodesic.
 * @returns {array} An array containing the edge parameter [alpha, lambda, kantenIndex].
 * kantenIndex is a number out of {0, 1, 2, 3} and indicates the edge a geodesic intersects with.
 * alpha and lambda indicate the exact intersection point on that edge.
 */
function getKantenParameter(SectorID, xg1, yg1, dxg, dyg){

    let alpha;
    let lambda;
    let kantenIndex;

    let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[SectorID].trapez);

    for (let kk = 0; kk < 4; kk++) {

        xt1 = trapezPointsAsGlobalCoords[kk].x;
        xt2 = trapezPointsAsGlobalCoords[(kk + 1) % 4].x;
        yt1 = trapezPointsAsGlobalCoords[kk].y;
        yt2 = trapezPointsAsGlobalCoords[(kk + 1) % 4].y;

        dxt12 = xt2 - xt1;
        dyt12 = yt2 - yt1;

        // Beachte, dass nun in der veraenderten Form vom Startpunkt der Geodaete ausgegangen wird -> deshalb ueberall xg1 und yg1

        if (dxg > epsilon) {
            alpha = (yg1 - yt1 + (dyg / dxg) * (xt1 - xg1)) / (dyt12 - ((dxt12 * dyg) / dxg));
            lambda = (xt1 + ((yg1 - yt1 + (dyg / dxg) * (xt1 - xg1)) / (dyt12 - ((dxt12 * dyg) / dxg))) * dxt12 - xg1) / dxg;
        }

        else {
            alpha = (xg1 - xt1 + (dxg / dyg) * (yt1 - yg1)) / (dxt12 - ((dyt12 * dxg) / dyg));
            lambda = (yt1 + ((xg1 - xt1 + (dxg / dyg) * (yt1 - yg1)) / (dxt12 - ((dyt12 * dxg) / dyg))) * dyt12 - yg1) / dyg;
        }


        if (lambda > epsilon) {
            if (alpha >= 0.0 && alpha <= 1.0) {
                kantenIndex = kk;
                break;
            }
        }


    }

    let kantenParameter = [alpha, lambda, kantenIndex];
    return kantenParameter
}

/**
 * Calculates the distance between the moving midpoint of a trapezoidal sector and the static midpoint
 * of one of its neighboring sectors in the specified direction.
 *
 * @param {fabric.Object} trapez - The trapezoidal sector for which the midpoint distance is calculated.
 * @returns {number} The distance between the moving midpoint and the static midpoint of the neighboring sector.
 */
function getMittelpunktsabstand(trapez) {
    let midpointSectorMoved = new fabric.Point(trapez.left, trapez.top);
    let midpointSectorStatic;
    let distanceMidPoints;
    for (let ii = 0; ii < 4; ii++) {
        let sec_idx = trapez.parent.neighbourhood[ii];


        if (sec_idx > -1) {
            midpointSectorStatic = new fabric.Point(sectors[sec_idx].trapez.left, sectors[sec_idx].trapez.top);
            distanceMidPoints = distance(midpointSectorMoved, midpointSectorStatic);
        }
    }
}

/**
 * gets the ID of the parent sector that contains a given point.
 * @param {Object} point - The point to check
 * @returns {number} The ID of the parent sector, or `undefined` if the point is not in any sector.
 */
function getParentSectorOfPoint(point){
    let sectorID;
    let stackIdx = -1;
    for (let jj = sectors.length - 1; jj >= 0; jj--) {
        if (sectorContainsPoint(sectors[jj].trapez, point)) {

            if (canvas.getObjects().indexOf(sectors[jj].ID_text) > stackIdx) {
                stackIdx = canvas.getObjects().indexOf(sectors[jj].ID_text);
                sectorID = jj
            }
        }
    }
    return sectorID
}

/**
 * Calculates the coordinates of a point before the Lorentz transformation is applied to its sector.
 *
 * @param {fabric.Point} point - The point to be transformed.
 * @param {fabric.Object} trapezToGetCoordsBL - The trapezoidal sector to which the point belongs in its original (before transformation) state.
 * @returns {fabric.Point} A new fabric.Point object representing the coordinates of the point in the sector's original (before transformation) frame of reference.
 */
function getPointCoordsBeforeLorentztransform (point, trapezToGetCoordsBL){

    let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(trapezToGetCoordsBL);
    let theta_of_this_sector =  trapezToGetCoordsBL.parent.rapidity;

    let point_AL_x = point.x - trapezPointsAsGlobalCoords[3].x;
    let point_AL_y = point.y - trapezPointsAsGlobalCoords[3].y;

    let point_BL_x = point_AL_x * Math.cosh(-theta_of_this_sector) + point_AL_y * Math.sinh(-theta_of_this_sector);
    let point_BL_y = point_AL_x * Math.sinh(-theta_of_this_sector) + point_AL_y * Math.cosh(-theta_of_this_sector);

    let point_BL = new fabric.Point(point_BL_x, point_BL_y);

    return point_BL
}

/**
 * Calculates and returns the points of opposite edges between two sectors before any rotation or transformation.
 *
 * @param {number} initialSectorID - The ID of the initial sector.
 * @param {number} targetSectorID - The ID of the target sector.
 * @returns {Array} An array containing the points of opposite edges between the initial and target sectors before any rotation or transformation.
 */
function getPointsOfOppositeEdges(initialSectorID, targetSectorID){

    let commonEdgeNumber = getCommonEdgeNumber(initialSectorID, targetSectorID);

    let initialTrapezPointsAsGlobalCoordsBeforeRotating = getTrapezPointsAsGlobalCoords(sectors[initialSectorID].trapez);
    let potentialtargetTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[targetSectorID].trapez);

    let point_1 = initialTrapezPointsAsGlobalCoordsBeforeRotating[commonEdgeNumber];
    let point_2 = initialTrapezPointsAsGlobalCoordsBeforeRotating[(commonEdgeNumber + 1) % 4];

    let point_a = potentialtargetTrapezPointsAsGlobalCoords[(commonEdgeNumber + 3) % 4];
    let point_b = potentialtargetTrapezPointsAsGlobalCoords[(commonEdgeNumber + 2) % 4];

    let edgePoints = [point_1, point_2, point_a, point_b];

    return edgePoints

}

/**
 * Calculates the transformation matrix required to apply the transformation of `ObjectToGiveRelation` relative to a specified parent sector.
 *
 * @param {fabric.Object} ObjectToGiveRelation - The fabric.js object whose transformation needs to be applied relative to the parent sector.
 * @param {number} parentSectorID - The ID of the parent sector to which the transformation should be related.
 * @returns {Array} A 6-element array representing the transformation matrix required to transform `ObjectToGiveRelation` relative to the specified parent sector.
 */
function getRelationship(ObjectToGiveRelation, parentSectorID) {
    let trapezTransform = sectors[parentSectorID].trapez.calcTransformMatrix();
    let invertedtrapezTransform = invert(trapezTransform);
    let desiredTransform = multiply(
        invertedtrapezTransform,
        ObjectToGiveRelation.calcTransformMatrix());

    return desiredTransform;
}

/**
 * Calculates the transformation matrix required to apply the transformation of `ObjectToGiveRelation` onto `ObjectRelatedTo`.
 *
 * @param {fabric.Object} ObjectToGiveRelation - The fabric.js object whose transformation needs to be applied.
 * @param {fabric.Object} ObjectRelatedTo - The fabric.js object to which the transformation should be applied.
 * @returns {Array} A 6-element array representing the transformation matrix required to transform `ObjectToGiveRelation` to match the transformation of `ObjectRelatedTo`.
 */
function getRelationshipForAnyObjecCombination(ObjectToGiveRelation, ObjectRelatedTo) {
    let objectTransform = ObjectRelatedTo.calcTransformMatrix();
    let invertedObjectTransform = invert(objectTransform);
    let desiredTransform = multiply(
        invertedObjectTransform,
        ObjectToGiveRelation.calcTransformMatrix());

    return desiredTransform;
}

/**
 * Calculates the parameters (lambda values) at which a line intersects with sector trapezes while applying padding to trapeze boundaries.
 *
 * @param {Array} sectors - An array of sector objects.
 * @param {Array} [xg1, yg1, xg2, yg2] - An array representing the coordinates of two points defining a line (global coordinates).
 * @returns {Array} An array of lambda values indicating the parameter values at which the line intersects with trapeze boundaries.
 *                   Lambda values are sorted in ascending order.
 */
function getSchnittpunktsparameterPadding(sectors,[xg1,yg1,xg2,yg2]) {

    let lambda;
    let alpha;

    let xt1;
    let xt2;
    let yt1;
    let yt2;

    // Geradengleichung der Linie und die der Sektorkante gleichsetzen
    //Orientierung der Sektorkante durch Reihenfolge der Eckpunkte: left-top -> right-top -> right-bottom -> left-bottom


    let lambdas = [0.0];
    for(let ii = 0; ii < sectors.length; ii++) {
        let object = sectors[ii].trapez;

        let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[ii].trapez);

        //Die folgenden Zeilen versetzen die zu verwendenden Eckpunkte des Trapzes nach Innen (bilden eines Padding)
        //Verhindert das fälsche overlapping
        trapezPointsAsGlobalCoords[0].x = trapezPointsAsGlobalCoords[0].x + paddingFactor * (trapezPointsAsGlobalCoords[2].x-trapezPointsAsGlobalCoords[0].x);
        trapezPointsAsGlobalCoords[0].y = trapezPointsAsGlobalCoords[0].y + paddingFactor * (trapezPointsAsGlobalCoords[2].y-trapezPointsAsGlobalCoords[0].y);

        trapezPointsAsGlobalCoords[2].x = trapezPointsAsGlobalCoords[2].x - paddingFactor * (trapezPointsAsGlobalCoords[2].x-trapezPointsAsGlobalCoords[0].x);
        trapezPointsAsGlobalCoords[2].y = trapezPointsAsGlobalCoords[2].y - paddingFactor * (trapezPointsAsGlobalCoords[2].y-trapezPointsAsGlobalCoords[0].y);

        trapezPointsAsGlobalCoords[1].x = trapezPointsAsGlobalCoords[1].x + paddingFactor * (trapezPointsAsGlobalCoords[3].x-trapezPointsAsGlobalCoords[1].x);
        trapezPointsAsGlobalCoords[1].y = trapezPointsAsGlobalCoords[1].y + paddingFactor * (trapezPointsAsGlobalCoords[3].y-trapezPointsAsGlobalCoords[1].y);

        trapezPointsAsGlobalCoords[3].x = trapezPointsAsGlobalCoords[3].x - paddingFactor * (trapezPointsAsGlobalCoords[3].x-trapezPointsAsGlobalCoords[1].x);
        trapezPointsAsGlobalCoords[3].y = trapezPointsAsGlobalCoords[3].y - paddingFactor * (trapezPointsAsGlobalCoords[3].y-trapezPointsAsGlobalCoords[1].y);


        for (let kk = 0; kk < 4; kk++) {


            xt1 =  trapezPointsAsGlobalCoords[kk].x;
            xt2 =  trapezPointsAsGlobalCoords[(kk + 1) % 4].x;
            yt1 =  trapezPointsAsGlobalCoords[kk].y;
            yt2 =  trapezPointsAsGlobalCoords[(kk + 1) % 4].y;


            let dxg = xg2 - xg1;
            let dyg = yg2 - yg1;
            let dxt12 = xt2 - xt1;
            let dyt12 = yt2 - yt1;


            if( dxg > epsilon)
            {
                alpha = (yg1 - yt1 + (dyg / dxg) * (xt1 - xg1)) / (dyt12 - ((dxt12 * dyg) / dxg));
                lambda = (xt1 + ((yg1 - yt1 + (dyg / dxg) * (xt1 - xg1)) / (dyt12 - ((dxt12 * dyg) / dxg))) * dxt12 - xg1) / dxg;

            }

            else{
                alpha = (xg1 - xt1 + (dxg / dyg) * (yt1 - yg1)) / (dxt12 - ((dyt12 * dxg) / dyg));
                lambda = (yt1 + ((xg1 - xt1 + (dxg / dyg) * (yt1 - yg1)) / (dxt12 - ((dyt12 * dxg) / dyg))) * dyt12 - yg1) / dyg;

            }

            if (epsilon <= lambda && lambda <= 1 && epsilon <= alpha && alpha <= 1) {
                lambdas.push(lambda);
            }
        }
    }
    if(lambdas.length > 1){lambdas =  lambdas.sort(function(a, b) {return a - b;});}
    return lambdas;
}

/**
 * Calculates the intersection points of the direction of a line segment with the edges of each sector in the sectors
 * array.
 * @param sectors - the array of sectors
 * @param xg1 - the x coord of the starting point of the line segment
 * @param yg1 - the y coord of the starting point of the line segment
 * @param xg2 - the x coord of the ending point of the line segment
 * @param yg2 - the y coord of the ending point of the line segment
 * @returns {*[]} - an array containing the intersection parameter of the line segment direction (lambda), the id of the sector
 * which the line segment direction intersects with (lineOverThisSector) and the index of the edge the line segment
 * direction intersects with (lineOverThisEdge).
 */
function getSchnittpunktsparameters(sectors,[xg1,yg1,xg2,yg2]) {

    let lambda;
    let alpha;

    let xt1;
    let xt2;
    let yt1;
    let yt2;

    let lambdaOfThisLineSegment;
    let lineOverThisSector;
    let lineOverThisEdge;

    let schnittpunktsparameters = [];

    // Geradengleichung der Linie und die der Sektorkante gleichsetzen
    //Orientierung der Sektorkante durch Reihenfolge der Eckpunkte: left-top -> right-top -> right-bottom -> left-bottom


    for(let ii = 0; ii < sectors.length; ii++) {

        let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[ii].trapez);

        for (let kk = 0; kk < 4; kk++) {


            xt1 =  trapezPointsAsGlobalCoords[kk].x;
            xt2 =  trapezPointsAsGlobalCoords[(kk + 1) % 4].x;
            yt1 =  trapezPointsAsGlobalCoords[kk].y;
            yt2 =  trapezPointsAsGlobalCoords[(kk + 1) % 4].y;


            let dxg = xg2 - xg1;
            let dyg = yg2 - yg1;
            let dxt12 = xt2 - xt1;
            let dyt12 = yt2 - yt1;


            if( Math.abs(dxg) > epsilon)
            {
                alpha = (yg1 - yt1 + (dyg / dxg) * (xt1 - xg1)) / (dyt12 - ((dxt12 * dyg) / dxg));
                lambda = (xt1 + ((yg1 - yt1 + (dyg / dxg) * (xt1 - xg1)) / (dyt12 - ((dxt12 * dyg) / dxg))) * dxt12 - xg1) / dxg;

            }

            else{
                alpha = (xg1 - xt1 + (dxg / dyg) * (yt1 - yg1)) / (dxt12 - ((dyt12 * dxg) / dyg));
                lambda = (yt1 + ((xg1 - xt1 + (dxg / dyg) * (yt1 - yg1)) / (dxt12 - ((dyt12 * dxg) / dyg))) * dyt12 - yg1) / dyg;

            }

            //console.log('lambda:', lambda)

            if ((0 - epsilon) <= lambda && lambda <= 1 && epsilon <= alpha && alpha <= 1){ // && Math.abs(lambdas[lambdas.length-1] - lambda) >= epsilon) {

                lambdaOfThisLineSegment = lambda;
                lineOverThisSector = ii;
                lineOverThisEdge = kk;

                let schnittpunktsparameter = [lambdaOfThisLineSegment, lineOverThisSector, lineOverThisEdge];

                schnittpunktsparameters.push(schnittpunktsparameter)

            }


        }
    }
    if(schnittpunktsparameters.length > 0){
        schnittpunktsparameters =  schnittpunktsparameters.sort(function(a, b) {
            return a[0] - b[0];
        });

        let lambdas = [0.0];
        for (let ii = 0; ii < schnittpunktsparameters.length; ii++){
            lambdaToPush = schnittpunktsparameters[ii][0];

            lambdas.push(lambdaToPush)
        }
        lambdas.push(1.0);

        let sectorsWhichContainsLineSegmentMidpoints = testLocation(lambdas, [xg1, yg1, xg2, yg2]);

        let removeEntryFromIndex = [];

        for (let ii = 0; ii < sectorsWhichContainsLineSegmentMidpoints.length -1; ii++){
            if (sectorsWhichContainsLineSegmentMidpoints[ii] !== -1 && sectorsWhichContainsLineSegmentMidpoints[ii] == sectorsWhichContainsLineSegmentMidpoints [ii + 1]){
                removeEntryFromIndex.push(ii)
            }
        }


        for (let ii = removeEntryFromIndex.length -1; ii >= 0; ii--){
            schnittpunktsparameters.splice(removeEntryFromIndex[ii], 1);
        }





    }

    return schnittpunktsparameters;
}

/**
 * gets the parameters of a sector (id, objects on the sector, coords, angle and rapidity in case of lorentz transform)
 * @param initialSectorID
 * @returns {*|[*,number,*,*,*]} - an array containing the sector parameters
 */
function getSectorParameterOnMousedown(initialSectorID){
    let stack_idx_of_initialSector = canvas.getObjects().indexOf(sectors[initialSectorID].trapez);
    if (turnLorentzTransformOn === 1){
        sectorParameterOnMousedown = [sectors[initialSectorID].ID, stack_idx_of_initialSector, sectors[initialSectorID].trapez.left, sectors[initialSectorID].trapez.top, sectors[initialSectorID].trapez.angle, sectors[initialSectorID].rapidity]
    } else{
        sectorParameterOnMousedown = [sectors[initialSectorID].ID, stack_idx_of_initialSector, sectors[initialSectorID].trapez.left, sectors[initialSectorID].trapez.top, sectors[initialSectorID].trapez.angle];

    }
    return sectorParameterOnMousedown
}

/**
 * same thing as getSectorParametersOnMouseDown but this function is used for mouse:up events.
 * @param initialSectorID
 * @returns {*|[*,number,*,*,*]|(*|number)[]}
 */
function getSectorParameterOnMouseup(initialSectorID){
    let stack_idx_of_initialSector = canvas.getObjects().indexOf(sectors[initialSectorID].trapez);
    if (turnLorentzTransformOn === 1){
        sectorParameterOnMouseup = [sectors[initialSectorID].ID, stack_idx_of_initialSector, sectors[initialSectorID].trapez.left, sectors[initialSectorID].trapez.top, sectors[initialSectorID].trapez.angle, sectors[initialSectorID].rapidity]
    } else{
        sectorParameterOnMouseup = [sectors[initialSectorID].ID, stack_idx_of_initialSector, sectors[initialSectorID].trapez.left, sectors[initialSectorID].trapez.top, sectors[initialSectorID].trapez.angle];

    }
    return sectorParameterOnMouseup
}

/**
 * gets parameters of a vector
 *
 * @param {number} initialSectorID - The ID of the sector the vector is placed
 * @param {number} vectorID - local ID of the vector
 * @returns {Array} An array containing the following parameters:
 *    - the ID of the vectors sector
 *    - the local ID of the vector
 *    - x coordinate of the start point of the vector
 *    - y coordinat of the start point of the vector
 *    - x coordinate of the end point of the vector
 *    - y coordinate of the end point of the vector
 */
function getVectorParameters(initialSectorID, vectorID) {

    let stack_idx_of_vectorPoint = canvas.getObjects().indexOf(sectors[initialSectorID].vectors[vectorID][0]);
    let stack_idx_of_vectorHead = canvas.getObjects().indexOf(sectors[initialSectorID].vectors[vectorID][2]);

    let vectorPoint = canvas.getObjects()[stack_idx_of_vectorPoint];
    let vectorHead = canvas.getObjects()[stack_idx_of_vectorHead];

    let vectorParameters = [vectorPoint.parentSector[0], vectorPoint.parentSector[1], vectorPoint.left, vectorPoint.top, vectorHead.left, vectorHead.top];

    return vectorParameters;

}

/**
 * Checks if two arrays are different in terms of their values or lengths.
 *
 * @param {Array} array1 - The first array for comparison.
 * @param {Array} array2 - The second array for comparison.
 * @returns {boolean} True if the arrays are different, false otherwise.
 */
function areArraysDifferent(array1, array2) {

    let arraysAreDifferent = false;
    if(array1.length !== array2.length) {
        arraysAreDifferent = true;
    } else {
        for (let ii = 0; ii < array1.length; ii++) {
            if(array1[ii] !== array2[ii]) {
                arraysAreDifferent = true;
                break;
            }
        }
    }
    return arraysAreDifferent;

}

/**
 * Calculates and stores the start and end point coordinates of a line segment in its local coordinates before a Lorentz transform.
 *
 * @param {fabric.Line} lineSegment - The line segment for which to calculate start and end point coordinates before a Lorentz transform.
 */
function getStartAndEndPointCoordsBeforeLorentztransform (lineSegment){

    geodesic_start_point = new fabric.Point(lineSegment.calcLinePoints().x1, lineSegment.calcLinePoints().y1);
    geodesic_start_point = fabric.util.transformPoint(geodesic_start_point, lineSegment.calcTransformMatrix());
    geodesic_end_point = new fabric.Point(lineSegment.calcLinePoints().x2, lineSegment.calcLinePoints().y2);
    geodesic_end_point = fabric.util.transformPoint(geodesic_end_point, lineSegment.calcTransformMatrix());

    lineSegment.start_point_BL = getPointCoordsBeforeLorentztransform(geodesic_start_point, sectors[lineSegment.parentSector[0]].trapez)
    lineSegment.end_point_BL = getPointCoordsBeforeLorentztransform(geodesic_end_point, sectors[lineSegment.parentSector[0]].trapez)

}

/**
 * Calculates and stores the path coordinates of a polyline line segment in its local coordinates before a Lorentz transform.
 *
 * @param {fabric.Polyline} lineSegment - The polyline line segment for which to calculate path coordinates before a Lorentz transform.
 */
function getPolylinePathCoordsBeforeLorentztransform (lineSegment){

    let polylinePointsAsGlobalCoords = getPolylinePointsImGlobalCoords(lineSegment);

    lineSegment.points_BL = polylinePointsAsGlobalCoords.slice();

    for (let ii = 0; ii < polylinePointsAsGlobalCoords.length; ii++){
        lineSegment.points_BL[ii] = getPointCoordsBeforeLorentztransform(polylinePointsAsGlobalCoords[ii], sectors[lineSegment.parentSector[0]].trapez)
    }

}

/**
 * Calculates and returns the global coordinates of the points in a polyline line segment.
 *
 * @param {fabric.Polyline} lineSegment - The polyline line segment for which to calculate global coordinates.
 * @returns {Array} An array containing objects with x and y properties representing the global coordinates of the points in the polyline.
 */
function getPolylinePointsImGlobalCoords(lineSegment){
    let lineSegmentUntransformedPoints = lineSegment.points;
    let lineSegmentTransformedPoints = lineSegmentUntransformedPoints.slice();
    for (let jj = 0; jj < lineSegment.points.length; jj++) {

        let lineSegmentPointUntransformed_x = lineSegment.points[jj].x;
        let lineSegmentPointUntransformed_y = lineSegment.points[jj].y;

        lineSegmentPointUntransformed_x -= lineSegment.pathOffset.x;
        lineSegmentPointUntransformed_y -= lineSegment.pathOffset.y;

        lineSegmentPointUntransformed = new fabric.Point(lineSegmentPointUntransformed_x, lineSegmentPointUntransformed_y);

        let lineSegmentPointTransformed = fabric.util.transformPoint(lineSegmentPointUntransformed, lineSegment.calcTransformMatrix());

        lineSegmentTransformedPoints[jj] = lineSegmentPointTransformed
    }
    return lineSegmentTransformedPoints
}

/**
 * Calculates and returns the global coordinates of the corner points of a trapezoid.
 *
 * @param {fabric.Trapezoid} trapezToGetGlobalCoords - The trapezoid for which to calculate global coordinates.
 * @returns {Array} An array containing four objects with x and y properties representing the global coordinates of the trapezoid's corner points.
 */
function getTrapezPointsAsGlobalCoords(trapezToGetGlobalCoords) {
    let transformMatrix = trapezToGetGlobalCoords.calcTransformMatrix('True');
    let globalCoords = [{x: 0.0, y: 0.0}, {x: 0.0, y: 0.0}, {x: 0.0, y: 0.0}, {x: 0.0, y: 0.0}];
    if (turnLorentzTransformOn == 1){
        for (let ii = 0; ii < 4; ii++) {
            globalCoords[ii].x = trapezToGetGlobalCoords.points[ii].x - trapezToGetGlobalCoords.width / 2 - trapezToGetGlobalCoords.x_offset;
            globalCoords[ii].y = trapezToGetGlobalCoords.points[ii].y - trapezToGetGlobalCoords.height / 2 - trapezToGetGlobalCoords.y_offset;
            globalCoords[ii] = fabric.util.transformPoint(globalCoords[ii], transformMatrix);
        }
    }else{
        for (let ii = 0; ii < 4; ii++) {
            globalCoords[ii].x = trapezToGetGlobalCoords.points[ii].x - trapezToGetGlobalCoords.width / 2; // - trapezToGetGlobalCoords.x_offset ;
            globalCoords[ii].y = trapezToGetGlobalCoords.points[ii].y - trapezToGetGlobalCoords.height / 2; // - trapezToGetGlobalCoords.y_offset ;
            globalCoords[ii] = fabric.util.transformPoint(globalCoords[ii], transformMatrix);
        }
    }


    return globalCoords
}

/**
 * Initializes and draws sectors based on configuration data.
 * This function creates Sector objects, sets their properties, and draws them on the canvas.
 * It also handles various options like sector naming, Lorentz transformations, and textures.
 */
function init() {
    for (let ii = 0; ii < sec_name.length; ii++) {

        let sec = new Sector();

        if (sectorIDText !== undefined){
            if (sectorIDText == "programID") {
                sec.name = ii;
            }
            if (sectorIDText == "off") {
                sec.name = "";
            }

        } else{
            sec.name = sec_name[ii];
        }

        sec.ID = sec_ID[ii];
        sec.sector_type = sec_type[ii];
        sec.fontSize = sec_fontSize[ii];
        sec.pos_x = sec_posx[ii] + window.innerWidth / 2;
        sec.pos_y = sec_posy[ii] + (window.innerHeight - window.innerHeight * 0.08) / 2;
        sec.sector_height = sec_height[ii];
        sec.sector_width = sec_width[ii];
        if (turnLorentzTransformOn !== 1) {
            //sec.sector_bottom = sec_bottom[ii];
            //sec.sector_top = sec_top[ii];
            sec.sector_angle = sec_angle[ii];
            //sec.offset_x = sec_offset[ii];
        } else {
            sec.sector_angle = 0;
            //sec.sec_diff_edges = Math.max(sec_timeEdgeLeft[ii], sec_timeEdgeRight[ii]) - Math.min(sec_timeEdgeLeft[ii], sec_timeEdgeRight[ii]);

        }

        sec.neighbourhood = [sec_neighbour_top[ii], sec_neighbour_right[ii], sec_neighbour_bottom[ii], sec_neighbour_left[ii]];

        if (textured !== "1") {
            sec.fill = sec_fill[ii];
        }
        sec.draw(sec_coords[ii][0], sec_coords[ii][1], sec_coords[ii][2], sec_coords[ii][3], sec_coords[ii][4], sec_coords[ii][5], sec_coords[ii][6], sec_coords[ii][7]);

        if (turnLorentzTransformOn == 1) {
            sec.draw_slider(sec.pos_x - 40, sec.pos_y - 20);
        }

        sectors.push(sec);

        if (textured == "1") {
            //----------------Nur wichtig, wenn Textur. Beachte, dass .fill in Overlap angepasst werden muss-------
            let panels =

                [
                    'textures/europe_0.png',
                    'textures/europe_1.png',
                    'textures/europe_2.png',
                    'textures/europe_3.png',
                    'textures/europe_4.png',
                    'textures/europe_5.png',
                    'textures/europe_6.png',
                    'textures/europe_7.png',
                    'textures/europe_8.png'
                ];
            if (textureColored == "1") {
                panels =
                    [
                        'textures/panel-7.3.jpg',
                        'textures/panel-7.4.jpg',
                        'textures/panel-7.5.jpg',
                        'textures/panel-8.3.jpg',
                        'textures/panel-8.4.jpg',
                        'textures/panel-8.5.jpg',
                        'textures/panel-9.3.jpg',
                        'textures/panel-9.4.jpg',
                        'textures/panel-9.5.jpg'
                    ];
            }
            if (textureColored == "2") {
                panels =
                    [
                        'textures/panel-8.3.jpg',
                        'textures/panel-8.4.jpg',
                        'textures/panel-8.5.jpg',
                        'textures/panel-9.3.jpg',
                        'textures/panel-9.4.jpg',
                        'textures/panel-9.5.jpg',
                        'textures/panel-10.3.jpg',
                        'textures/panel-10.4.jpg',
                        'textures/panel-10.5.jpg',
                    ];
            }
            if (textureColored == "big") {
                panels =
                    [
                        'textures/panel-0.0.jpg',
                        'textures/panel-0.1.jpg',
                        'textures/panel-0.2.jpg',
                        'textures/panel-0.3.jpg',
                        'textures/panel-0.4.jpg',
                        'textures/panel-0.5.jpg',
                        'textures/panel-0.6.jpg',
                        'textures/panel-0.7.jpg',
                        'textures/panel-0.8.jpg',
                        'textures/panel-1.0.jpg',
                        'textures/panel-1.1.jpg',
                        'textures/panel-1.2.jpg',
                        'textures/panel-1.3.jpg',
                        'textures/panel-1.4.jpg',
                        'textures/panel-1.5.jpg',
                        'textures/panel-1.6.jpg',
                        'textures/panel-1.7.jpg',
                        'textures/panel-1.8.jpg',
                        'textures/panel-2.0.jpg',
                        'textures/panel-2.1.jpg',
                        'textures/panel-2.2.jpg',
                        'textures/panel-2.3.jpg',
                        'textures/panel-2.4.jpg',
                        'textures/panel-2.5.jpg',
                        'textures/panel-2.6.jpg',
                        'textures/panel-2.7.jpg',
                        'textures/panel-2.8.jpg',
                        'textures/panel-3.0.jpg',
                        'textures/panel-3.1.jpg',
                        'textures/panel-3.2.jpg',
                        'textures/panel-3.3.jpg',
                        'textures/panel-3.4.jpg',
                        'textures/panel-3.5.jpg',
                        'textures/panel-3.6.jpg',
                        'textures/panel-3.7.jpg',
                        'textures/panel-3.8.jpg',
                        'textures/panel-4.0.jpg',
                        'textures/panel-4.1.jpg',
                        'textures/panel-4.2.jpg',
                        'textures/panel-4.3.jpg',
                        'textures/panel-4.4.jpg',
                        'textures/panel-4.5.jpg',
                        'textures/panel-4.6.jpg',
                        'textures/panel-4.7.jpg',
                        'textures/panel-4.8.jpg',
                        'textures/panel-5.0.jpg',
                        'textures/panel-5.1.jpg',
                        'textures/panel-5.2.jpg',
                        'textures/panel-5.3.jpg',
                        'textures/panel-5.4.jpg',
                        'textures/panel-5.5.jpg',
                        'textures/panel-5.6.jpg',
                        'textures/panel-5.7.jpg',
                        'textures/panel-5.8.jpg',
                        'textures/panel-6.0.jpg',
                        'textures/panel-6.1.jpg',
                        'textures/panel-6.2.jpg',
                        'textures/panel-6.3.jpg',
                        'textures/panel-6.4.jpg',
                        'textures/panel-6.5.jpg',
                        'textures/panel-6.6.jpg',
                        'textures/panel-6.7.jpg',
                        'textures/panel-6.8.jpg',
                        'textures/panel-7.0.jpg',
                        'textures/panel-7.1.jpg',
                        'textures/panel-7.2.jpg',
                        'textures/panel-7.3.jpg',
                        'textures/panel-7.4.jpg',
                        'textures/panel-7.5.jpg',
                        'textures/panel-7.6.jpg',
                        'textures/panel-7.7.jpg',
                        'textures/panel-7.8.jpg',
                        'textures/panel-8.0.jpg',
                        'textures/panel-8.1.jpg',
                        'textures/panel-8.2.jpg',
                        'textures/panel-8.3.jpg',
                        'textures/panel-8.4.jpg',
                        'textures/panel-8.5.jpg',
                        'textures/panel-8.6.jpg',
                        'textures/panel-8.7.jpg',
                        'textures/panel-8.8.jpg',
                        'textures/panel-9.0.jpg',
                        'textures/panel-9.1.jpg',
                        'textures/panel-9.2.jpg',
                        'textures/panel-9.3.jpg',
                        'textures/panel-9.4.jpg',
                        'textures/panel-9.5.jpg',
                        'textures/panel-9.6.jpg',
                        'textures/panel-9.7.jpg',
                        'textures/panel-9.8.jpg',
                        'textures/panel-10.0.jpg',
                        'textures/panel-10.1.jpg',
                        'textures/panel-10.2.jpg',
                        'textures/panel-10.3.jpg',
                        'textures/panel-10.4.jpg',
                        'textures/panel-10.5.jpg',
                        'textures/panel-10.6.jpg',
                        'textures/panel-10.7.jpg',
                        'textures/panel-10.8.jpg',
                        'textures/panel-11.0.jpg',
                        'textures/panel-11.1.jpg',
                        'textures/panel-11.2.jpg',
                        'textures/panel-11.3.jpg',
                        'textures/panel-11.4.jpg',
                        'textures/panel-11.5.jpg',
                        'textures/panel-11.6.jpg',
                        'textures/panel-11.7.jpg',
                        'textures/panel-11.8.jpg',
                        'textures/panel-12.0.jpg',
                        'textures/panel-12.1.jpg',
                        'textures/panel-12.2.jpg',
                        'textures/panel-12.3.jpg',
                        'textures/panel-12.4.jpg',
                        'textures/panel-12.5.jpg',
                        'textures/panel-12.6.jpg',
                        'textures/panel-12.7.jpg',
                        'textures/panel-12.8.jpg',
                        'textures/panel-13.0.jpg',
                        'textures/panel-13.1.jpg',
                        'textures/panel-13.2.jpg',
                        'textures/panel-13.3.jpg',
                        'textures/panel-13.4.jpg',
                        'textures/panel-13.5.jpg',
                        'textures/panel-13.6.jpg',
                        'textures/panel-13.7.jpg',
                        'textures/panel-13.8.jpg',
                        'textures/panel-14.0.jpg',
                        'textures/panel-14.1.jpg',
                        'textures/panel-14.2.jpg',
                        'textures/panel-14.3.jpg',
                        'textures/panel-14.4.jpg',
                        'textures/panel-14.5.jpg',
                        'textures/panel-14.6.jpg',
                        'textures/panel-14.7.jpg',
                        'textures/panel-14.8.jpg',
                        'textures/panel-15.0.jpg',
                        'textures/panel-15.1.jpg',
                        'textures/panel-15.2.jpg',
                        'textures/panel-15.3.jpg',
                        'textures/panel-15.4.jpg',
                        'textures/panel-15.5.jpg',
                        'textures/panel-15.6.jpg',
                        'textures/panel-15.7.jpg',
                        'textures/panel-15.8.jpg',
                        'textures/panel-16.0.jpg',
                        'textures/panel-16.1.jpg',
                        'textures/panel-16.2.jpg',
                        'textures/panel-16.3.jpg',
                        'textures/panel-16.4.jpg',
                        'textures/panel-16.5.jpg',
                        'textures/panel-16.6.jpg',
                        'textures/panel-16.7.jpg',
                        'textures/panel-16.8.jpg',
                        'textures/panel-17.0.jpg',
                        'textures/panel-17.1.jpg',
                        'textures/panel-17.2.jpg',
                        'textures/panel-17.3.jpg',
                        'textures/panel-17.4.jpg',
                        'textures/panel-17.5.jpg',
                        'textures/panel-17.6.jpg',
                        'textures/panel-17.7.jpg',
                        'textures/panel-17.8.jpg'
                    ];
            }


            /*
                        fabric.util.loadImage(panels[ii], function (img) {

                            img.scaleToWidth(sec_width[ii] + 4);

                            sec.trapez.set('fill', new fabric.Pattern({
                                source: img,
                                repeat: 'no-repeat'
                            }));
                        })
            */


            fabric.Image.fromURL(panels[ii], function (img) {

                let patternOffset_x

                if (textureColored == "big") {
                    if (ii % 9 == 3 | ii % 9 == 4 | ii % 9 == 5) {
                        img.scaleToWidth(sec_width[ii] + 4);
                        patternOffset_x = -2
                    } else {
                        if (ii % 9 == 2 | ii % 9 == 6) {
                            img.scaleToWidth(sec_width[ii] + 24);
                            patternOffset_x = -12
                        }
                        if (ii % 9 == 1 | ii % 9 == 7) {
                            img.scaleToWidth(sec_width[ii] + 64);
                            patternOffset_x = -32
                        }
                        if (ii % 9 == 0 | ii % 9 == 8) {
                            img.scaleToWidth(sec_width[ii] + 116);
                            patternOffset_x = -58
                        }
                    }
                }else{
                    img.scaleToWidth(sec_width[ii]+ 4);
                    patternOffset_x = -2
                }


                let patternSourceCanvas = new fabric.StaticCanvas(null, {enableRetinaScaling: false});
                patternSourceCanvas.add(img);

                patternSourceCanvas.setDimensions({
                    width: img.getScaledWidth(),
                    height: img.getScaledHeight(),

                });

                patternSourceCanvas.renderAll();

                //patternSourceCanvas.getElement() fixed das Problem mit der neuen Version
                let pattern = new fabric.Pattern({
                    source: patternSourceCanvas.getElement(),
                    repeat: 'no-repeat'
                });

                pattern.offsetX = patternOffset_x;

                sec.trapez.set('fill', pattern);
                canvas.renderAll();

            });
            //--------------------------------------------------------------------
        }

    }
}

/**
 * Checks if it's time to snap a trapezoidal sector to a neighboring sector based on certain conditions.
 *
 * @async
 * @param {fabric.Object} trapez - The trapezoidal sector object to check for snapping.
 * @returns {void}
 */
async function isItTimeToSnap(trapez) {
    let midpointSectorMoved = new fabric.Point(trapez.left, trapez.top);
    let midpointpotentialSnappingPartnerID;
    let distanceMidPoints;
    let dist_1a;
    let dist_2b;

    changeSnapStatus(trapez.parent.ID);

    for (let ii = 0; ii < 4; ii++){
        let potentialSnappingPartnerID = trapez.parent.neighbourhood[ii];

        if(potentialSnappingPartnerID > -1 && sectors[potentialSnappingPartnerID].trapez.opacity == startOpacity) {

            midpointpotentialSnappingPartnerID = new fabric.Point(sectors[potentialSnappingPartnerID].trapez.left, sectors[potentialSnappingPartnerID].trapez.top);
            distanceMidPoints = distance(midpointSectorMoved, midpointpotentialSnappingPartnerID);

            let edgePoints = getPointsOfOppositeEdges(trapez.parent.ID, potentialSnappingPartnerID);

            let point_1 = edgePoints[0];
            let point_2 = edgePoints[1];

            let point_a = edgePoints[2];
            let point_b = edgePoints[3];

            let point_1_2_mid = new fabric.Point(point_1.x + (point_1.x - point_2.x) * 0.5, point_1.y + (point_1.y - point_2.y) * 0.5);

            let point_a_b_mid = new fabric.Point(point_a.x + (point_a.x - point_b.x) * 0.5, point_a.y + (point_a.y - point_b.y) * 0.5);


            //---Falls die Textur eingeschaltet ist, wird Snapping direkt ausgeführt werden
            //---Es erfolgt keine Auswahl des Snappingpartners
            if (textured == "1"){
                if(distanceMidPoints <= trapez.aussenkreisradius + sectors[potentialSnappingPartnerID].trapez.aussenkreisradius) {

                    dist_1a = distance(point_1, point_a);
                    dist_2b = distance(point_2, point_b);

                }else{

                    dist_1a = snap_radius_sectors + 1;
                    dist_2b = snap_radius_sectors + 1;

                }

                if (dist_1a < snap_radius_sectors && dist_2b < snap_radius_sectors) {
                    snapInitialSectorToTargetSector(trapez.parent.ID, potentialSnappingPartnerID)
                }
            }else{
                if (distance(point_1_2_mid, point_a_b_mid) <= snap_radius_sectors || distanceMidPoints <= snappingToChosenDistance * trapez.aussenkreisradius ) {

                    for (let jj = 0; jj < 4; jj++) {
                        if (trapez.parent.neighbourhood[jj] > -1) {
                            sectors[trapez.parent.neighbourhood[jj]].trapez.fill = sec_fill[sectors[trapez.parent.neighbourhood[jj]].ID]
                        }
                    }

                    sectors[potentialSnappingPartnerID].trapez.fill = '#E6E6E6';

                    sectorToSnap = potentialSnappingPartnerID;

                    if (turnLorentzTransformOn == 1){

                        let rapidity_before = trapez.parent.rapidity;

                        let rapid_base;
                        if (Math.abs(sec_coords[trapez.parent.ID][(ii*2) % 8] - sec_coords[trapez.parent.ID][(ii*2+2) % 8]) > Math.abs(sec_coords[trapez.parent.ID][(ii*2 + 1) % 8] - sec_coords[trapez.parent.ID][(ii * 2 + 3) % 8])) {
                            rapid_base = Math.atanh((sec_coords[trapez.parent.ID][(ii * 2 + 1) % 8] - sec_coords[trapez.parent.ID][(ii * 2 + 3) % 8]) / (sec_coords[trapez.parent.ID][(ii * 2) % 8] - sec_coords[trapez.parent.ID][(ii * 2 + 2) % 8]));
                        }
                        else{
                            rapid_base = Math.atanh((sec_coords[trapez.parent.ID][(ii * 2) % 8] - sec_coords[trapez.parent.ID][(ii * 2 + 2) % 8]) / (sec_coords[trapez.parent.ID][(ii * 2 + 1) % 8] - sec_coords[trapez.parent.ID][(ii * 2 + 3) % 8]));
                        }

                        let rapid_target;
                        if (Math.abs(point_a.x - point_b.x) > Math.abs(point_a.y - point_b.y) ){
                            rapid_target = Math.atanh((point_a.y - point_b.y) / (point_a.x - point_b.x))
                            }
                        else {
                            rapid_target = Math.atanh( (point_a.x - point_b.x) / (point_a.y - point_b.y))
                            }

                        let rapid_sum = - rapid_base + rapid_target;

                        /*
                        let point_1_untransf = new fabric.Point(sec_coords[trapez.parent.ID][(ii * 2 + 1) % 8], sec_coords[trapez.parent.ID][(ii * 2) % 8])
                        let point_2_untransf = new fabric.Point(sec_coords[trapez.parent.ID][(ii * 2 + 3) % 8], sec_coords[trapez.parent.ID][(ii * 2 + 2) % 8])

                        let length_ausgang = distance(point_1_untransf, point_2_untransf);
                        let length_target = distance(point_a, point_b);
                        let rapid_sum;
                        if (ii == 0 || ii == 2) {
                            rapid_sum = Math.log(length_ausgang / length_target);
                        }else{
                            rapid_sum = - Math.log(length_ausgang / length_target);
                        }
                        */


                        //Anpassung des Sliders an die neue rapidity (Beachte, dass hier die relationship verändert wird, Bezug ist der Mittelpunkt der Sliderlinie)
                        trapez.parent.slider[0].relationship[5] = trapez.parent.slider[1].relationship[5] + rapid_sum * slider_max;

                        trapez.parent.rapidity = rapid_sum;


                        lorentzTransform(rapid_sum, trapez);

                        let rapidity_after = trapez.parent.rapidity;


                        if(Math.abs(rapidity_before - rapidity_after)>epsilon ) {

                            changeRelationShipAfterTransform(trapez, rapid_sum)

                        }



                        return
                    }else{

                        let newSectorAngle = getSectorAngleToAlign(trapez.parent.ID, potentialSnappingPartnerID, sectors[potentialSnappingPartnerID].trapez.angle)
                        await rotateSector(trapez.parent.ID, newSectorAngle)

                        return
                    }

                }else {

                    sectorToSnap = -1;

                    for (let jj = 0; jj < 4; jj++) {
                        if (trapez.parent.neighbourhood[jj] > -1) {

                            sectors[trapez.parent.neighbourhood[jj]].trapez.fill = sec_fill[sectors[trapez.parent.neighbourhood[jj]].ID]
                        }
                    }
                }
            }


        }
    }
}

/**
 * Apply a Lorentz transformation to the endpoints of a line segment (lineToTransform).
 *
 * This function takes a line segment (lineToTransform), a Lorentz transformation angle (theta), and an array
 * (trapezPointsAsGlobalCoords) containing global coordinates of a trapezoidal sector. It updates the endpoints
 * of the line segment to simulate the effects of a Lorentz transformation.
 *
 * @param {fabric.Line} lineToTransform - The fabric.js Line object to transform.
 * @param {number} theta - The Lorentz transformation angle.
 * @param {Array} trapezPointsAsGlobalCoords - An array of global coordinates of the trapezoidal sector.
 */
function lorentzTransformLinePoints(lineToTransform, theta, trapezPointsAsGlobalCoords) {
    lineToTransform.set({
        'x1': lineToTransform.start_point_BL.x * Math.cosh(theta) + lineToTransform.start_point_BL.y * Math.sinh(theta) + trapezPointsAsGlobalCoords[3].x,
        'y1': lineToTransform.start_point_BL.x * Math.sinh(theta) + lineToTransform.start_point_BL.y * Math.cosh(theta) + trapezPointsAsGlobalCoords[3].y,
        'x2': lineToTransform.end_point_BL.x * Math.cosh(theta) + lineToTransform.end_point_BL.y * Math.sinh(theta) + trapezPointsAsGlobalCoords[3].x,
        'y2': lineToTransform.end_point_BL.x * Math.sinh(theta) + lineToTransform.end_point_BL.y * Math.cosh(theta) + trapezPointsAsGlobalCoords[3].y,

        /*
        trapez.parent.lineSegments[ii].set({
            'x1': (geodesic_start_point.x - transformedPoints[3].x) * Math.cosh(theta) + (geodesic_start_point.y - transformedPoints[3].y) * Math.sinh(theta) + transformedPoints[3].x,
            'y1': (geodesic_start_point.x - transformedPoints[3].x) * Math.sinh(theta) + (geodesic_start_point.y - transformedPoints[3].y) * Math.cosh(theta) + transformedPoints[3].y,
            'x2': (geodesic_end_point.x - transformedPoints[3].x) * Math.cosh(theta) + (geodesic_end_point.y - transformedPoints[3].y) * Math.sinh(theta) + transformedPoints[3].x,
            'y2': (geodesic_end_point.x - transformedPoints[3].x) * Math.sinh(theta) + (geodesic_end_point.y - transformedPoints[3].y) * Math.cosh(theta) + transformedPoints[3].y,
        */
    })
}

/**
 * Apply a Lorentz transformation to the position of a fabric.js object.
 *
 * This function takes an object, a Lorentz transformation angle `theta`, and an array `trapezPointsAsGlobalCoords`
 * containing global coordinates of a trapezoidal sector. It updates the object's position by applying the Lorentz
 * transformation to its initial position.
 *
 * @param {fabric.Object} object - The fabric.js object to transform.
 * @param {number} theta - The Lorentz transformation angle.
 * @param {Array} trapezPointsAsGlobalCoords - An array of global coordinates of the trapezoidal sector.
 */
function lorentzTransformObjectPosition(object, theta, trapezPointsAsGlobalCoords) {
    object.set('left', object.start_pos_BL_x * Math.cosh(theta) + object.start_pos_BL_y * Math.sinh(theta) + trapezPointsAsGlobalCoords[3].x);
    object.set('top', object.start_pos_BL_x * Math.sinh(theta) + object.start_pos_BL_y * Math.cosh(theta) + trapezPointsAsGlobalCoords[3].y);
}

/**
 * Perform a Lorentz transformation on a trapezoidal sector and its associated objects.
 *
 * This function takes an angle `theta` and a `trapez` object representing a sector. It applies a Lorentz
 * transformation to the sector's points and associated objects to simulate relativistic effects.
 *
 * @param {number} theta - The Lorentz transformation angle.
 * @param {fabric.Polygon} trapez - The trapezoidal sector to transform.
 */
function lorentzTransform(theta, trapez) {


    let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(trapez);
    //**** !!!! Beachte, dass 'sector' das übergegebene Trapez ist !!!!

    for (let ii = 0; ii < 4; ii++){
        trapez.points[ii].x= sec_coords[trapez.parent.ID][ii*2] * Math.cosh(theta) + sec_coords[trapez.parent.ID][ii*2+1] * Math.sinh(theta);
        trapez.points[ii].y= sec_coords[trapez.parent.ID][ii*2] * Math.sinh(theta) + sec_coords[trapez.parent.ID][ii*2+1] * Math.cosh(theta);

    }

    lorentzTransformObjectPosition(trapez.parent.ID_text, theta, trapezPointsAsGlobalCoords);

    if (trapez.parent.markCircles.length > 0) {
        for (let ii = 0; ii < trapez.parent.markCircles.length; ii++) {
            lorentzTransformObjectPosition(trapez.parent.markCircles[ii], theta, trapezPointsAsGlobalCoords);
        }
    }

    if (trapez.parent.lineSegments.length > 0) {
        for (let ii = 0; ii < trapez.parent.lineSegments.length; ii++) {
            if (trapez.parent.lineSegments[ii].lineType == "geodesic"){

                lorentzTransformLinePoints(trapez.parent.lineSegments[ii], theta, trapezPointsAsGlobalCoords)

            }
            if (trapez.parent.lineSegments[ii].lineType == "polyline"){
                for (let jj = 0; jj < trapez.parent.lineSegments[ii].points_BL.length; jj++){
                    trapez.parent.lineSegments[ii].points[jj].x = trapez.parent.lineSegments[ii].points_BL[jj].x * Math.cosh(theta) + trapez.parent.lineSegments[ii].points_BL[jj].y * Math.sinh(theta) + trapezPointsAsGlobalCoords[3].x;
                    trapez.parent.lineSegments[ii].points[jj].y = trapez.parent.lineSegments[ii].points_BL[jj].x * Math.sinh(theta) + trapez.parent.lineSegments[ii].points_BL[jj].y * Math.cosh(theta) + trapezPointsAsGlobalCoords[3].y;

                }
                //Die Boundingbox der Polylines wird hier drüber nach jedem Schritt geupdatet
                trapez.parent.lineSegments[ii]._setPositionDimensions({})
            }

            if(trapez.parent.lineSegments[ii].dragPoint !== undefined) {
                lorentzTransformObjectPosition(trapez.parent.lineSegments[ii].dragPoint, theta, trapezPointsAsGlobalCoords);
                }

            if (buildGeodesicTicks == "1"){
                if (trapez.parent.lineSegments[ii].geodesicTicks.length > 0){
                    for (let jj = 0; jj < trapez.parent.lineSegments[ii].geodesicTicks.length; jj++) {
                        lorentzTransformObjectPosition(trapez.parent.lineSegments[ii].geodesicTicks[jj], theta, trapezPointsAsGlobalCoords);
                    }
                }
            }

        }
    }

    if (trapez.parent.ticks.length > 0) {
        for (let ii = 0; ii < trapez.parent.ticks.length; ii++) {
            lorentzTransformLinePoints(trapez.parent.ticks[ii], theta, trapezPointsAsGlobalCoords)
        }
    }
    if (trapez.parent.vectors.length > 0) {
        for (let ii = 0; ii < trapez.parent.vectors.length; ii++) {
            lorentzTransformLinePoints(trapez.parent.vectors[ii], theta, trapezPointsAsGlobalCoords)
        }
    }


    canvas.renderAll();


}

/**
 * Move objects associated with a sector to a specified stack (layer) on the canvas.
 *
 * This function takes a sector's ID and a sectorStackID as parameters and repositions various objects
 * associated with the sector to the specified stack on the canvas. It allows controlling the stacking
 * order of mark circles, sliders, line segments, texts, and corner arcs within the canvas.
 *
 * @param {number} initialSectorID - The ID of the sector whose objects need to be moved.
 * @param {number} sectorStackID - The stack (layer) to which the objects will be moved.
 */
function moveMinionsToStack(initialSectorID, sectorStackID){
    let addToStack = 1;
    for (let ii = 0; ii < sectors[initialSectorID].markCircles.length; ii++) {
        let markPoint = sectors[initialSectorID].markCircles[ii];
        canvas.moveTo(markPoint, sectorStackID + addToStack);
        addToStack += 1
    }
    if (turnLorentzTransformOn === 1) {
        for (let ii = 0; ii < sectors[initialSectorID].slider.length; ii++) {
            let slider_move = sectors[initialSectorID].slider[ii];
            canvas.moveTo(slider_move, sectorStackID + addToStack);
            addToStack += 1
        }
    }
    for (let ii = 0; ii < sectors[initialSectorID].lineSegments.length; ii++) {
        let segment = sectors[initialSectorID].lineSegments[ii];
        canvas.moveTo(segment, sectorStackID + addToStack);
        addToStack += 1;
        if(segment.dragPoint !== undefined) {
            let object = segment.dragPoint;
            canvas.moveTo(object, sectorStackID + addToStack);
            addToStack += 1
        }
    }
    for (let ii = 0; ii < sectors[initialSectorID].texts.length; ii++) {
        let text = sectors[initialSectorID].texts[ii];
        canvas.moveTo(text, sectorStackID + addToStack);
        addToStack += 1
    }
    for (let ii = 0; ii < sectors[initialSectorID].cornerArcs.length; ii++) {
        let cornerArc = sectors[initialSectorID].cornerArcs[ii];
        canvas.moveTo(cornerArc, sectorStackID + addToStack);
        addToStack += 1
    }
    if (sectors[initialSectorID].ID_text.relationship) {
        canvas.moveTo(sectors[initialSectorID].ID_text, sectorStackID + addToStack)
    }
}

/**
 * Perform overlap control for a trapezoid.
 *
 * This function checks for overlap between the given trapezoid and other trapezoids in the canvas.
 * It calculates overlap based on the intersection of edges and padding overlap based on contained points.
 * If overlap or padding overlap is detected, the trapezoid's opacity is reduced to 0.5, indicating overlap.
 *
 * @param {fabric.Polygon} trapez - The trapezoid object to perform overlap control on.
 */
function overlapControll(trapez) {

    let overlap = false;
    let paddingOverlap = false;

    let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(trapez);

    for (let ii = 0; ii < 4; ii++) {
        xg1 = trapezPointsAsGlobalCoords[ii].x;
        xg2 = trapezPointsAsGlobalCoords[(ii + 1) % 4].x;
        yg1 = trapezPointsAsGlobalCoords[ii].y;
        yg2 = trapezPointsAsGlobalCoords[(ii + 1) % 4].y;

        let kantenMittelpunkt = new fabric.Point(xg1 + (xg2 - xg1) / 2, yg1 + (yg2 - yg1) / 2);

        overlapParameter = getSchnittpunktsparameterPadding(sectors, [xg1, yg1, xg2, yg2]);
        for (let jj = 0; jj < overlapParameter.length; jj++)
            if (overlapParameter[jj] > 0.1 && overlapParameter[jj] < 0.979999999999999) {
                overlap = true;
            }

        for (let jj = 0; jj < sectors.length; jj++) {

            if(jj == trapez.parent.ID) {
                continue
            }
            else {
                if(paddingContainsPoint(sectors[jj].trapez, kantenMittelpunkt)){
                    paddingOverlap = true;
                }
            }
        }

    }

    if (overlap == true || paddingOverlap == true) {
        trapez.opacity = 0.5;
    }
    if (overlap == false && paddingOverlap == false) {
        trapez.opacity = 1.0;
    }

}

/**
 * Check if a point is inside a trapezoid with padding.
 *
 * This function determines whether a given point is inside a trapezoid with padding applied.
 * It first checks if the point is within the trapezoid's bounding box. If it is, it calculates
 * the relative position of the point to the trapezoid's edges and checks if it's inside the trapezoid.
 * Padding is applied by adjusting the trapezoid's corner points inward.
 *
 * @param {fabric.Polygon} trapez - The trapezoid object to check against.
 * @param {fabric.Point} segmentMittelpunkt - The point to check for containment.
 * @returns {boolean} - True if the point is inside the trapezoid with padding, otherwise false.
 */
function paddingContainsPoint(trapez,segmentMittelpunkt) {
    let isPointInsideSectors = false;
    //
    if (trapez.containsPoint(segmentMittelpunkt, undefined, 'absolute: false' )) {
        //Nach Überprüfen der bounding box prüfen ob tatsächlich innerhalb des Polygons
        //Dazu berechnen der relativen Position (links-/rechtsorientiert zu den Sektorkanten)
        //Wenn zu allen Kanten rechtsorientiert (d. h. beta > 0) dann innerhalb des Polygons
        isPointInsideSectors = true;

        let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(trapez);

        //Die folgenden Zeilen versetzen die zu verwendenden Eckpunkte des Trapzes nach Innen (bilden eines Padding)
        trapezPointsAsGlobalCoords[0].x = trapezPointsAsGlobalCoords[0].x + paddingFactor * (trapezPointsAsGlobalCoords[2].x-trapezPointsAsGlobalCoords[0].x);
        trapezPointsAsGlobalCoords[0].y = trapezPointsAsGlobalCoords[0].y + paddingFactor * (trapezPointsAsGlobalCoords[2].y-trapezPointsAsGlobalCoords[0].y);

        trapezPointsAsGlobalCoords[2].x = trapezPointsAsGlobalCoords[2].x - paddingFactor * (trapezPointsAsGlobalCoords[2].x-trapezPointsAsGlobalCoords[0].x);
        trapezPointsAsGlobalCoords[2].y = trapezPointsAsGlobalCoords[2].y - paddingFactor * (trapezPointsAsGlobalCoords[2].y-trapezPointsAsGlobalCoords[0].y);

        trapezPointsAsGlobalCoords[1].x = trapezPointsAsGlobalCoords[1].x + paddingFactor * (trapezPointsAsGlobalCoords[3].x-trapezPointsAsGlobalCoords[1].x);
        trapezPointsAsGlobalCoords[1].y = trapezPointsAsGlobalCoords[1].y + paddingFactor * (trapezPointsAsGlobalCoords[3].y-trapezPointsAsGlobalCoords[1].y);

        trapezPointsAsGlobalCoords[3].x = trapezPointsAsGlobalCoords[3].x - paddingFactor * (trapezPointsAsGlobalCoords[3].x-trapezPointsAsGlobalCoords[1].x);
        trapezPointsAsGlobalCoords[3].y = trapezPointsAsGlobalCoords[3].y - paddingFactor * (trapezPointsAsGlobalCoords[3].y-trapezPointsAsGlobalCoords[1].y);




        for (let kk = 0; kk < 4; kk++) {

            let xt1 =  trapezPointsAsGlobalCoords[kk].x;
            let xt2 =  trapezPointsAsGlobalCoords[(kk + 1) % 4].x;
            let yt1 =  trapezPointsAsGlobalCoords[kk].y;
            let yt2 =  trapezPointsAsGlobalCoords[(kk + 1) % 4].y;

            /*let object = new fabric.Circle({
                radius: 5,
                fill: 'blue',
                left: xt1,
                top: yt1,
                originX: 'center',
                originY: 'center'
            });
            canvas.add(object);

            let object2 = new fabric.Circle({
                radius: 5,
                fill: 'red',
                left: xt2,
                top: yt2,
                originX: 'center',
                originY: 'center'
            });
            canvas.add(object2); */



            let dxt12 = xt2 - xt1;
            let dyt12 = yt2 - yt1;


            let dxw = xt1 - xt2;
            let dyw = yt2 - yt1;
            let xp = segmentMittelpunkt.x;
            let yp = segmentMittelpunkt.y;


            let beta;
            if (Math.abs(dyw) > epsilon) {

                let gamma = (yp - yt1 + ((xt1 - xp) * dxw) / dyw) / (dyt12 - (dxt12 * dxw) / dyw);
                beta = ((xt1 - xp) / dyw) + (dxt12 / dyw) * gamma;
            }

            else {
                let gamma = (xp - xt1 + ((yt1 - yp) * dyw) / dxw) / (dxt12 - (dyt12 * dyw) / dxw);
                beta = ((yt1 - yp) / dxw) + (dyt12 / dxw) * gamma;
            }

            if (beta < 0.0){
                isPointInsideSectors = false;
            }
        }

    }
    return isPointInsideSectors;
}

/**
 * Position sectors based on their defined properties.
 *
 * This function iterates through the sectors and positions them based on their predefined properties.
 * It sets the top and left properties of each sector's trapezoid to its specified position coordinates (pos_x, pos_y).
 * It also rotates the trapezoid by the sector's angle (sector_angle) to align it correctly.
 * After positioning and rotating, it updates the coordinates of the trapezoid and its associated objects.
 */
function positionSectors() {
    for (let ii = 0; ii < sectors.length; ii++){
        sectors[ii].trapez.top = sectors[ii].pos_y;
        sectors[ii].trapez.left = sectors[ii].pos_x;
        sectors[ii].trapez.rotate(sectors[ii].sector_angle);
        //sectors[ii].trapez.angle = ;
        updateMinions(sectors[ii].trapez);
    }
}

/**
 * Randomly adjust the position and angle of sectors.
 *
 * This function iterates through the sectors and randomly adjusts their position and angle.
 * It randomly adds or subtracts values to the top, left, and angle properties of each sector's trapezoid.
 * After the adjustments, it updates the coordinates of the trapezoid and its associated objects.
 */
function randomPositionAndAngle(){
    for (let ii = 0; ii < sectors.length; ii++){
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        sectors[ii].trapez.top += 100 * Math.random() * plusOrMinus;
        sectors[ii].trapez.left += 100 * Math.random() * plusOrMinus;
        sectors[ii].trapez.angle += 360 * Math.random() * plusOrMinus;
        sectors[ii].trapez.setCoords();
        updateMinions(sectors[ii].trapez);
    }
}

/**
 * This function reinitializes a sector's position and associated objects on the canvas.
 * It is used to update the sector's position and maintain its visual components when changes occur.
 *
 * @param {number} dist_inv_min_x_old - The previous minimum x-coordinate value of the sector.
 * @param {number} dist_inv_max_y_old - The previous maximum y-coordinate value of the sector.
 * @param {number} initialSectorID - The ID of the sector to reinitialize.
 */
function reinitialiseSector(dist_inv_min_x_old, dist_inv_max_y_old, initialSectorID){

    let lastTopTrapez = sectors[initialSectorID].trapez.top;
    let lastLeftTrapez = sectors[initialSectorID].trapez.left;
    let lastTopID_text = sectors[initialSectorID].ID_text.top;
    let lastLeftID_text = sectors[initialSectorID].ID_text.left;

    let start_pos_BL_x = sectors[initialSectorID].ID_text.start_pos_BL_x;
    let start_pos_BL_y = sectors[initialSectorID].ID_text.start_pos_BL_y;

    let dist_inv_min_x_new = Math.min(sectors[initialSectorID].trapez.points[0].x, sectors[initialSectorID].trapez.points[1].x, sectors[initialSectorID].trapez.points[2].x, sectors[initialSectorID].trapez.points[3].x);
    let dist_inv_min_y_new = Math.max(sectors[initialSectorID].trapez.points[0].y, sectors[initialSectorID].trapez.points[1].y, sectors[initialSectorID].trapez.points[2].y, sectors[initialSectorID].trapez.points[3].y);


    canvas.remove(sectors[initialSectorID].trapez);

    canvas.remove(sectors[initialSectorID].ID_text);

    sectors[initialSectorID].draw(sectors[initialSectorID].trapez.points[0].x, sectors[initialSectorID].trapez.points[0].y, sectors[initialSectorID].trapez.points[1].x, sectors[initialSectorID].trapez.points[1].y, sectors[initialSectorID].trapez.points[2].x, sectors[initialSectorID].trapez.points[2].y, sectors[initialSectorID].trapez.points[3].x, sectors[initialSectorID].trapez.points[3].y);

    sectors[initialSectorID].trapez.set('left', lastLeftTrapez + dist_inv_min_x_new - dist_inv_min_x_old).setCoords();
    sectors[initialSectorID].trapez.set('top', lastTopTrapez + dist_inv_min_y_new - dist_inv_max_y_old).setCoords();

    sectors[initialSectorID].ID_text.set('left', lastLeftID_text).setCoords();
    sectors[initialSectorID].ID_text.set('top', lastTopID_text).setCoords();

    sectors[initialSectorID].ID_text.start_pos_BL_x = start_pos_BL_x;
    sectors[initialSectorID].ID_text.start_pos_BL_y = start_pos_BL_y;

    sectors[initialSectorID].ID_text.relationship = getRelationship(sectors[initialSectorID].ID_text, sectors[initialSectorID].ID);


    for (let ii = 0; ii < sectors[initialSectorID].slider.length; ii++) {
        sectors[initialSectorID].slider[ii].relationship = getRelationship(sectors[initialSectorID].slider[ii], sectors[initialSectorID].ID)
    }

    sectors[initialSectorID].slider[0].relationship[5] = sectors[initialSectorID].slider[1].relationship[5] + sectors[initialSectorID].rapidity * slider_max;

    if (sectors[initialSectorID].ticks.length > 0) {
        for (let ii = 0; ii < sectors[initialSectorID].ticks.length; ii++) {
            canvas.bringToFront(sectors[initialSectorID].ticks[ii]);
        }

        for (let ii = 0; ii < sectors[initialSectorID].ticks.length; ii++) {
            sectors[initialSectorID].ticks[ii].relationship = getRelationship(sectors[initialSectorID].ticks[ii], sectors[initialSectorID].ID);
        }
    }

    if (sectors[initialSectorID].markCircles.length > 0) {
        for (let ii = 0; ii < sectors[initialSectorID].markCircles.length; ii++) {
            canvas.bringToFront(sectors[initialSectorID].markCircles[ii]);
        }

        for (let ii = 0; ii < sectors[initialSectorID].markCircles.length; ii++) {
            sectors[initialSectorID].markCircles[ii].relationship = getRelationship(sectors[initialSectorID].markCircles[ii], sectors[initialSectorID].ID);
        }
    }

    if (sectors[initialSectorID].vectors.length > 0) {
        for (let ii = 0; ii < sectors[initialSectorID].vectors.length; ii++) {
            canvas.bringToFront(sectors[initialSectorID].vectors[ii]);
        }

        for (let ii = 0; ii < sectors[initialSectorID].vectors.length; ii++) {
            sectors[initialSectorID].vectors[ii].relationship = getRelationship(sectors[initialSectorID].vectors[ii], sectors[initialSectorID].ID);
        }
    }

    if (sectors[initialSectorID].lineSegments.length > 0) {

        for (let ii = 0; ii < sectors[initialSectorID].lineSegments.length; ii++) {
            canvas.bringToFront(sectors[initialSectorID].lineSegments[ii]);
        }

        for (let ii = 0; ii < sectors[initialSectorID].lineSegments.length; ii++) {
            sectors[initialSectorID].lineSegments[ii].relationship = getRelationship(sectors[initialSectorID].lineSegments[ii], sectors[initialSectorID].ID);

            if (sectors[initialSectorID].lineSegments[ii].dragPoint !== undefined) {
                canvas.bringToFront(sectors[initialSectorID].lineSegments[ii].dragPoint);
                sectors[initialSectorID].lineSegments[ii].dragPoint.relationship = getRelationship(sectors[initialSectorID].lineSegments[ii].dragPoint, sectors[initialSectorID].ID);
            }

            if(buildGeodesicTicks == "1"){
                if (sectors[initialSectorID].lineSegments[ii].geodesicTicks.length > 0){
                    for (let jj = 0; jj < sectors[initialSectorID].lineSegments[ii].geodesicTicks.length; jj++){
                        canvas.bringToFront(sectors[initialSectorID].lineSegments[ii].geodesicTicks[jj]);
                        sectors[initialSectorID].lineSegments[ii].geodesicTicks[jj].relationship = getRelationship(sectors[initialSectorID].lineSegments[ii].geodesicTicks[jj], sectors[initialSectorID].ID);
                    }
                }
            }
        }
    }
}

/**
 * Remove visualizations related to deficit angles.
 *
 * This function removes visualizations related to deficit angles from the canvas,
 * including objects stored in the `deficitAngleVisualizeGroup` group. It also updates
 * the infobox text and requests a render of the canvas sidebar.
 */
function removeDeficitAngleVisualize() {


    if (deficitAngleVisualizeGroup._objects.length > 0) {
        for (let ii = 0; ii < deficitAngleVisualizeGroup._objects.length; ii++) {
            let object = deficitAngleVisualizeGroup._objects[ii];
            canvas.remove(object);
        }
        deficitAngleVisualizeGroup = new fabric.Group();
        infoboxDeficitAngleText.set('text', infoboxDeficitAngleTextByLanguage);
        canvas_side_bar_perm.requestRenderAll()
    }

    /*
    if (deficitAngleVisualizePolygon !== undefined) {
        canvas.remove(deficitAngleVisualizePolygon);
        infoboxDeficitAngleText.set('text', infoboxDeficitAngleTextByLanguage)
        canvas_side_bar_perm.requestRenderAll()
    }
    */
}

/**
 * Remove snap edges associated with a sector and its neighboring sectors.
 *
 * This function removes snap edges from a sector and its neighboring sectors based on
 * the specified initial sector ID. It checks and clears snap edges in both directions.
 *
 * @param {number} initialSectorID - The ID of the sector for which snap edges should be removed.
 */
function removeSnapEdges(initialSectorID) {

    for (let ii = 0; ii < 4; ii++) {

        let neighbourSectorID = sectors[initialSectorID].neighbourhood[ii];

        if (sectors[initialSectorID].snapEdges[ii] !== 0) {
            let edgeToRemove = sectors[initialSectorID].snapEdges[ii];
            canvas.remove(edgeToRemove);
            sectors[initialSectorID].snapEdges[ii] = [0];
        }

        if (neighbourSectorID > -1) {

            if (sectors[neighbourSectorID].snapEdges[(ii + 2) % 4] !== 0) {
                let edgeToRemove = sectors[neighbourSectorID].snapEdges[(ii + 2) % 4];
                canvas.remove(edgeToRemove);
                sectors[neighbourSectorID].snapEdges[(ii + 2) % 4] = [0];
            }
        }
    }
}

/**
 * Pause execution for a specified number of milliseconds.
 *
 * This function creates a Promise that resolves after the specified duration,
 * effectively pausing the execution of code for the given time.
 *
 * @param {number} ms - The number of milliseconds to pause execution.
 * @returns {Promise} - A Promise that resolves after the specified time.
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Reset the sectors and their associated data.
 *
 * This asynchronous function performs various operations to reset sectors, including clearing
 * sector-related data, adjusting their positions, and performing optional transformations
 * based on configuration settings. It also manages snap status and overlap control.
 *
 * @async
 */
async function resetSectors() {

    canvas.discardActiveObject();
    canvas.renderAll();

    let immediatehistory = [1];

    /*if (showExerciseBox == "1" & currentSlide.sectorsSetToRingsOnR !== undefined){

            for (let rr = 0; rr < sectors.length; rr++) {
                removeSnapEdges(sectors[rr].ID);

                sectorParameterOnMousedown = getSectorParameterOnMousedown(sectors[rr].ID);
                immediatehistory.push(sectorParameterOnMousedown);


            }
        setSectorsToRingsOnR()
        return
    }
     */

    for (let rr = 0; rr < sectors.length; rr++){
        removeSnapEdges(sectors[rr].ID);

        sectorParameterOnMousedown = getSectorParameterOnMousedown(sectors[rr].ID);
        immediatehistory.push(sectorParameterOnMousedown);


        if (turnLorentzTransformOn == 1){
            if (Math.abs(sectors[rr].trapez.left - sec_posx[rr] + window.innerWidth/2) < epsilon || Math.abs(sectors[rr].trapez.top - sec_posy[rr] + (window.innerHeight - window.innerHeight*0.08)/2) < epsilon|| sectors[rr].rapidity !== 0) {


                let lastLeft = sectors[rr].trapez.left;
                let lastTop = sectors[rr].trapez.top;

                let dist_inv_min_x_new = Math.min(sectors[rr].trapez.points[0].x, sectors[rr].trapez.points[1].x, sectors[rr].trapez.points[2].x, sectors[rr].trapez.points[3].x);
                let dist_inv_min_y_new = Math.max(sectors[rr].trapez.points[0].y, sectors[rr].trapez.points[1].y, sectors[rr].trapez.points[2].y, sectors[rr].trapez.points[3].y);

                let trapez_x_min = Math.min(sec_coords[rr][0], sec_coords[rr][2], sec_coords[rr][4], sec_coords[rr][6]);

                lorentzTransform(0, sectors[rr].trapez);

                sectors[rr].slider[0].top = sectors[rr].slider[1].top;

                canvas.remove(sectors[rr].trapez);

                canvas.remove(sectors[rr].ID_text);

                sectors[rr].draw(sectors[rr].trapez.points[0].x, sectors[rr].trapez.points[0].y, sectors[rr].trapez.points[1].x, sectors[rr].trapez.points[1].y, sectors[rr].trapez.points[2].x, sectors[rr].trapez.points[2].y, sectors[rr].trapez.points[3].x, sectors[rr].trapez.points[3].y);

                sectors[rr].trapez.set('left', lastLeft - dist_inv_min_x_new + trapez_x_min).setCoords();
                sectors[rr].trapez.set('top', lastTop - dist_inv_min_y_new + sec_coords[rr][5]).setCoords();

                sectors[rr].ID_text.set('left', lastLeft - dist_inv_min_x_new + 90).setCoords();
                sectors[rr].ID_text.set('top', lastTop - dist_inv_min_y_new + sec_coords[rr][5] - 50).setCoords();

                for (let ss = 0; ss < sectors[rr].slider.length; ss++) {
                    sectors[rr].slider[ss].relationship = getRelationship(sectors[rr].slider[ss], sectors[rr].ID);
                }

                if (sectors[rr].ticks.length > 0) {
                    for (let ss = 0; ss < sectors[rr].ticks.length; ss++) {
                        canvas.bringToFront(sectors[rr].ticks[ss]);

                    }
                    for (let ss = 0; ss < sectors[rr].ticks.length; ss++) {
                        sectors[rr].ticks[ss].relationship = getRelationship(sectors[rr].ticks[ss], sectors[rr].ID);
                    }
                }

                if (sectors[rr].markCircles.length > 0) {
                    for (let ss = 0; ss < sectors[rr].markCircles.length; ss++) {
                        canvas.bringToFront(sectors[rr].markCircles[ss]);

                    }
                    for (let ss = 0; ss < sectors[rr].markCircles.length; ss++) {
                        sectors[rr].markCircles[ss].relationship = getRelationship(sectors[rr].markCircles[ss], sectors[rr].ID);
                    }
                }

                if (sectors[rr].lineSegments.length > 0) {
                    for (let ss = 0; ss < sectors[rr].lineSegments.length; ss++) {
                        canvas.bringToFront(sectors[rr].lineSegments[ss]);

                    }
                    for (let ss = 0; ss < sectors[rr].lineSegments.length; ss++) {
                        sectors[rr].lineSegments[ss].relationship = getRelationship(sectors[rr].lineSegments[ss], sectors[rr].ID);

                        if (sectors[rr].lineSegments[ss].dragPoint !== undefined) {
                            canvas.bringToFront(sectors[rr].lineSegments[ss].dragPoint);

                            sectors[rr].lineSegments[ss].dragPoint.relationship = getRelationship(sectors[rr].lineSegments[ss].dragPoint, sectors[rr].ID);
                        }


                        if (buildGeodesicTicks == "1"){

                            if (sectors[rr].lineSegments[ss].geodesicTicks.length > 0){

                                for (let kk = 0; kk < sectors[rr].lineSegments[ss].geodesicTicks.length; kk++){

                                    canvas.bringToFront(sectors[rr].lineSegments[ss].geodesicTicks[kk]);
                                    sectors[rr].lineSegments[ss].geodesicTicks[kk].relationship = getRelationship(sectors[rr].lineSegments[ss].geodesicTicks[kk], sectors[rr].ID);

                                }


                            }
                        }

                    }
                }
                sectors[rr].rapidity = 0;
            }

            if (buildTicks == "1"){
                drawTicks(sectors[rr].trapez)
            }
            if (buildLightCone == "1"){
                drawLightCone(sectors[rr].trapez)
            }
        }


        if (typeof sec_posx_sym === 'undefined') {

            rotateSector(rr, sec_angle[rr])
            translateSector(rr, sec_posx[rr] + window.innerWidth / 2, sec_posy[rr] + (window.innerHeight - window.innerHeight * 0.08) / 2)

            //sectors[rr].trapez.left = sec_posx[rr] + window.innerWidth / 2;
            //sectors[rr].trapez.top = sec_posy[rr] + (window.innerHeight - window.innerHeight * 0.08) / 2;
            //sectors[rr].trapez.angle = sec_angle[rr];
            sectors[rr].trapez.setCoords();

            updateMinions(sectors[rr].trapez);
        } else {
            sectors[rr].trapez.left = sec_posx_sym[rr] + window.innerWidth / 2;
            sectors[rr].trapez.top = sec_posy_sym[rr] + (window.innerHeight - window.innerHeight * 0.08) / 2;
            sectors[rr].trapez.angle = sec_angle_sym[rr];
            sectors[rr].trapez.setCoords();

            updateMinions(sectors[rr].trapez);
        }



    }

    history.push(immediatehistory);

    await wait(200)

    for (let rr = 0; rr < sectors.length; rr++){
        changeSnapStatus(sectors[rr].ID);
        if (turnOverlapControllOn == "1"){
            overlapControll(sectors[rr].trapez);
        }

    }

    canvas.renderAll();
}

/**
 * Reset the application state and canvas.
 *
 * This function clears various data structures and removes objects from the canvas
 * to reset the application state. It also optionally re-initializes start objects
 * based on configuration settings.
 */
function resetAppliction() {

    lines = [];
    markPoints = [];
    vectors = [];
    history = [];

    for( let ii = 0; ii < sectors.length; ii++){
        sectors[ii].lineSegments = [];
        sectors[ii].markCircles = [];
        sectors[ii].cornerArcs = [];
        sectors[ii].vectors = [];
    }

    let objects = canvas.getObjects('line');
    for (let ii=0; ii < objects.length; ii++) {
        canvas.remove(objects[ii]);
    }

    objects = canvas.getObjects('polyline');
    for (let ii=0; ii < objects.length; ii++) {
        canvas.remove(objects[ii]);
    }


    objects = canvas.getObjects('circle');
    for (let ii = 0; ii < objects.length; ii++) {
        canvas.remove(objects[ii]);
    }

    objects = canvas.getObjects('triangle');
    for (let ii = 0; ii < objects.length; ii++) {
        canvas.remove(objects[ii]);
    }

    resetSectors();
    if (buildStartGeodesics == "1"){startGeodesics();}

    if(buildStartVectors == "1"){startVectors();}

    if (buildStartMarks == "1"){startMarks();}

    if (showVerticesOn == "1"){drawVertices();}

    toolChange('grab');
    geodreieck.set('angle', 0);
    canvas.renderAll();

    if (showExerciseBox == "1"){
        currentSlideNumber = 0;
        showNextSlide()
    }

    setZoomPan(startZoom, startViewportTransform_4, startViewportTransform_5)

}

//------------Rotationskontrolle: Icon und Position werden verändert------------
//Rotationskontrolle: Icon und Position werden verändert

let rotateIcon = 'rotate.png';
let img = document.createElement('img');
img.src = rotateIcon;

fabric.Object.prototype.controls.mtr = new fabric.Control({
    x: 0,
    y: -0.5,
    offsetY: -15,
    cursorStyle: 'col-resize',
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    actionName: 'rotate',
    render: renderIcon,
    cornerSize: 40,
    withConnection: true
});

/**
 * Render an icon on a canvas context at a specified position.
 *
 * This function renders an icon on a canvas context at the specified `left` and `top`
 * coordinates. It allows for style customization through the `styleOverride` parameter.
 * The icon is rotated based on the `angle` property of the `fabricObject`.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context on which to render the icon.
 * @param {number} left - The x-coordinate at which to render the icon.
 * @param {number} top - The y-coordinate at which to render the icon.
 * @param {object} styleOverride - An optional object specifying style overrides for the icon rendering.
 * @param {fabric.Object} fabricObject - The fabric.js object associated with the icon.
 */
function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    let size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
}

//-----------------------------------------------------------------------------

/**
 * Rotate a point around a specified pivot point.
 *
 * This function takes a point and rotates it by a given angle (in degrees) around
 * a specified pivot point (trapez_left, trapez_top). It returns the new coordinates
 * of the point after the rotation.
 *
 * @param {number[]} point - The point to be rotated, represented as an array [x, y].
 * @param {number} rotationAngle - The angle (in degrees) by which to rotate the point.
 * @param {number} trapez_left - The x-coordinate of the pivot point.
 * @param {number} trapez_top - The y-coordinate of the pivot point.
 *
 * @returns {number[]} - The new coordinates of the rotated point, represented as an array [x, y].
 */
function rotatePoint(point, rotationAngle, trapez_left, trapez_top){

    point_x_tmp = point[0];
    point_y_tmp = point[1];

    point_x_new = trapez_left + Math.cos(rotationAngle * Math.PI / 180) * (point_x_tmp - trapez_left) - Math.sin(rotationAngle * Math.PI / 180) * (point_y_tmp - trapez_top);
    point_y_new = trapez_top + Math.sin(rotationAngle * Math.PI / 180) * (point_x_tmp - trapez_left) + Math.cos(rotationAngle * Math.PI / 180) * (point_y_tmp - trapez_top);

    let newPoint = [
        point_x_new, point_y_new
    ];

    return newPoint
}

/**
 * Rotate and translate a point around a specified center.
 *
 * This function takes a point and rotates it by a given angle (in degrees) around
 * a specified center point. It returns the new coordinates of the point after the
 * rotation and translation.
 *
 * @param {Object} point - The point to be rotated and translated, represented as {x, y}.
 * @param {number} angle - The angle (in degrees) by which to rotate the point.
 * @param {Object} center - The center point around which to rotate and translate, represented as {x, y}.
 *
 * @returns {Object} - The new coordinates of the rotated and translated point, represented as {x, y}.
 */
function rotateAndTranslatePoint(point, angle, center){


    const angleInRadians = (angle * Math.PI) / 180;
    const cosTheta = Math.cos(angleInRadians);
    const sinTheta = Math.sin(angleInRadians);

    const translatedX = point.x - center.x;
    const translatedY = point.y - center.y;

    const rotatedX = translatedX * cosTheta - translatedY * sinTheta;
    const rotatedY = translatedX * sinTheta + translatedY * cosTheta;

    const finalX = rotatedX + center.x;
    const finalY = rotatedY + center.y;

    let rotatedAndTranslatedPoint = new fabric.Point(finalX, finalY)

    return rotatedAndTranslatedPoint;
}

/**
 * Calculate the new angle needed to align a sector with another sector.
 *
 * This function computes the angle adjustment required for one sector to align
 * with another sector based on their shared edge and the desired new angle for
 * the target sector.
 *
 * @param {number} initialSectorID - The ID of the initial sector to be aligned.
 * @param {number} targetSectorID - The ID of the target sector with which alignment is desired.
 * @param {number} targetSectorNewAngle - The desired new angle (in degrees) for the target sector.
 *
 * @returns {number} - The new angle (in degrees) for the initial sector to align with the target sector.
 */
function getSectorAngleToAlign(initialSectorID, targetSectorID, targetSectorNewAngle) {

    let commonEdgeNumber = getCommonEdgeNumber(initialSectorID, targetSectorID);
    let dxs_tmp;
    let dys_tmp;
    let gamma_target;
    let gamma_initial;

    dxs_tmp = sectors[targetSectorID].trapez.points[commonEdgeNumber].x - sectors[targetSectorID].trapez.points[(commonEdgeNumber + 1) % 4].x;
    dys_tmp = sectors[targetSectorID].trapez.points[commonEdgeNumber].y - sectors[targetSectorID].trapez.points[(commonEdgeNumber + 1) % 4].y;

    if (Math.abs(dys_tmp) > epsilon) {
        gamma_target = Math.atan(dxs_tmp / dys_tmp);
    } else {
        gamma_target = 0.0
    }

    dxs_tmp = sectors[initialSectorID].trapez.points[(commonEdgeNumber + 2) % 4].x - sectors[initialSectorID].trapez.points[(commonEdgeNumber + 3) % 4].x;
    dys_tmp = sectors[initialSectorID].trapez.points[(commonEdgeNumber + 2) % 4].y - sectors[initialSectorID].trapez.points[(commonEdgeNumber + 3) % 4].y;

    if (Math.abs(dys_tmp) > epsilon) {
        gamma_initial = Math.atan(dxs_tmp / dys_tmp);
    } else {
        gamma_initial = 0.0
    }

    let newSectorAngle = targetSectorNewAngle + gamma_target / Math.PI * 180 - gamma_initial / Math.PI * 180;

    return newSectorAngle

}

/**
 * Rotate a sector to a new angle.
 *
 * @param {number} SectorToRotate - The ID or index of the sector to rotate.
 * @param {number} newSectorAngle - The target angle to which the sector should be rotated.
 * @returns {Promise} A promise that resolves when the rotation is complete.
 */
function rotateSector(SectorToRotate, newSectorAngle){

    return new Promise((resolve) => {
        if (animatedMovingOn == "1") {

            if(Math.abs(sectors[SectorToRotate].trapez.angle) < 180 ) {


                if (Math.abs(newSectorAngle - sectors[SectorToRotate].trapez.angle) > 180){
                    newSectorAngle-=360
                }

                sectors[SectorToRotate].trapez.animate('angle', newSectorAngle, {
                    onChange: function (){
                        canvas.renderAll;
                        updateMinions(sectors[SectorToRotate].trapez);
                    },
                    onComplete: function () {
                        resolve();
                    }
                })
            } else {

                let distance = newSectorAngle - sectors[SectorToRotate].trapez.angle;

                /*

                if (Math.abs(newSectorAngle - sectors[SectorToRotate].trapez.angle) > epsilon){
                    console.log("Sekotor", SectorToRotate)
                    console.log("Zielwinkel:", newSectorAngle)
                    console.log("sectorAngleActually:", sectors[SectorToRotate].trapez.angle)
                    console.log("distance:", distance)
                }
                */

                sectors[SectorToRotate].trapez.animate('angle', sectors[SectorToRotate].trapez.angle + distance, {
                    onChange: function (){
                        canvas.renderAll;
                        updateMinions(sectors[SectorToRotate].trapez);
                    },onComplete: function () {
                        resolve();
                    }
                })

            }

        } else {
            sectors[SectorToRotate].trapez.angle = newSectorAngle
            resolve()
        }

        sectors[SectorToRotate].trapez.setCoords();
    })
}

/**
 * Save the current state of the canvas as JavaScript code in a downloadable file.
 *
 * @param {fabric.Canvas} canvas - The fabric.js canvas to be saved.
 * @param {string} filename - The name for the downloaded JavaScript file.
 */
function saveCanvasAsJs(canvas, filename) {
    let data = {
        buildStartGeodesics: 0,
        turnLorentzTransformOn: 0,
        buildStartMarks: 0,
        buildStartTexts: 0,
        showResetSectors: 0,
        showAutoSet: 0,
        showChangeDirection: 0,
        showAutoComplete: 0,
        showChangeStartPoint: 0,
        startZoom: canvas.getZoom(),
        startViewportTransform_4: canvas.viewportTransform[4],
        startViewportTransform_5: canvas.viewportTransform[5],
        turnLorentzTransformOn: turnLorentzTransformOn,
        line_colors: line_colors,
        mark_colors: mark_colors,
        lineStrokeWidthWhenNotSelected: lineStrokeWidthWhenNotSelected,
        lineStrokeWidthWhenSelected: lineStrokeWidthWhenSelected,
        sec_name: sec_name,
        sec_fill: sec_fill,
        sec_ID: sec_ID,
        sec_type: sec_type,
        sec_fontSize: sec_fontSize,
        //sec_top: sec_top,
        //sec_bottom: sec_bottom,
        sec_height: sec_height,
        sec_width: sec_width,
        //sec_offset: sec_offset,
        sec_coords: sec_coords,
        sec_neighbour_top: sec_neighbour_top,
        sec_neighbour_right: sec_neighbour_right,
        sec_neighbour_bottom: sec_neighbour_bottom,
        sec_neighbour_left: sec_neighbour_left,
        sec_posx: [],
        sec_posy: [],
        sec_angle: [],
        sec_posx_sym: [],
        sec_posy_sym: [],
        sec_angle_sym: [],
        startSectors: [],
        x_Start: [],
        y_Start: [],
        x_End: [],
        y_End: [],
        startStrokeWidth: [],
        startFill: [],
        startStroke: [],
        startParentSector: [],
        startLineID: [],
        markStart_x: [],
        markStart_y: [],
        markStartStrokeWidth: [],
        markStartRadius: [],
        markStartFill: [],
        markStartStroke: [],
        markStartParentSector: [],
        markStartID: [],
        textStart_x: [],
        textStart_y: [],
        textStartContent: [],
        textStartFontSize: [],
        textStartParentSector: [],
        textStartID: [],
        textStartAngle: []
    };

    //Sektoren
    for (let ii = 0; ii < sectors.length; ii++){
        data.sec_posx.push(sectors[ii].trapez.left - window.innerWidth / 2);
        data.sec_posy.push(sectors[ii].trapez.top - (window.innerHeight - window.innerHeight * 0.08) / 2);
        data.sec_angle.push(sectors[ii].trapez.angle);
        if (typeof sec_posx_sym === 'undefined' || sec_posx_sym.length === 0) {
            data.sec_posx_sym.push(sec_posx[ii]);
            data.sec_posy_sym.push(sec_posy[ii]);
            data.sec_angle_sym.push(sec_angle[ii]);
        } else {
            data.sec_posx_sym.push(sec_posx_sym[ii]);
            data.sec_posy_sym.push(sec_posy_sym[ii]);
            data.sec_angle_sym.push(sec_angle_sym[ii]);
        }
    }
    //Linien
    for (let ii = 0; ii < lines.length; ii++){
        for (let jj = 0; jj < lines[ii].length; jj++) {
            data.startSectors.push(lines[ii][jj].parentSector[0])

            let line_start_point = new fabric.Point(lines[ii][jj].calcLinePoints().x1, lines[ii][jj].calcLinePoints().y1);
            line_start_point = fabric.util.transformPoint(line_start_point, lines[ii][jj].calcTransformMatrix());
            let line_end_point = new fabric.Point(lines[ii][jj].calcLinePoints().x2, lines[ii][jj].calcLinePoints().y2);
            line_end_point = fabric.util.transformPoint(line_end_point, lines[ii][jj].calcTransformMatrix());

            data.x_Start.push(line_start_point.x - window.innerWidth / 2)
            data.y_Start.push(line_start_point.y - (window.innerHeight - window.innerHeight * 0.08) / 2)
            data.x_End.push(line_end_point.x - window.innerWidth / 2)
            data.y_End.push(line_end_point.y - (window.innerHeight - window.innerHeight * 0.08) / 2)

            data.startStrokeWidth.push(lines[ii][jj].strokeWidth)
            data.startFill.push(lines[ii][jj].fill)
            data.startStroke.push(lines[ii][jj].stroke)
            data.startParentSector.push(lines[ii][jj].parentSector)

            data.startLineID.push(lines[ii][jj].ID)
        }
    }
    //Marks
    for (let ii = 0; ii < markPoints.length; ii++){
        data.markStart_x.push(markPoints[ii].left - window.innerWidth / 2)
        data.markStart_y.push(markPoints[ii].top - (window.innerHeight - window.innerHeight * 0.08) / 2)
        data.markStartStrokeWidth.push(markPoints[ii].strokeWidth)
        data.markStartRadius.push(markPoints[ii].radius)
        data.markStartFill.push(markPoints[ii].fill)
        data.markStartStroke.push(markPoints[ii].stroke)
        data.markStartParentSector.push(markPoints[ii].parentSector)
        data.markStartID.push(markPoints[ii].ID)
    }



    //URL-Parameter
    const URL_ParameterToUpdate = [
        'buildStartGeodesics',
        'turnLorentzTransformOn',
        'buildStartMarks',
        'buildStartTexts',
        'showResetSectors',
        'showAutoSet',
        'showChangeDirection',
        'showAutoComplete',
        'showChangeStartPoint'
    ];

    for (let property of URL_ParameterToUpdate) {
            if (eval(property) == 1) {
                data[property] = 1;
            }
    }

        let text = '';
    for (let key in data) {
        text += key + ' = ' + JSON.stringify(data[key]) + '\n';
    }

    let blob = new Blob([text], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);

    let link = document.createElement('a');
    link.href = url;
    link.download = filename;

    // Open the save as window
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Constructor for the Sector object, representing a geometric sector.
 * @constructor
 */
function Sector() {

    this.trapez; //Anlegen der Variablen trapez, undefiniert, um mehr als eines anlegen zu können

    //this.sector_top ;
    //this.sector_bottom;
    //this.offset_x;

    this.pos_x;
    this.pos_y;
    this.sector_height;
    this.sector_width;
    this.sector_angle;
    this.name;
    this.fontSize;
    this.ID;
    this.fill;
    this.sector_type;

    this.draw = drawSector; // das Objekt Sektor bekommt die Methode 'drawSectors' mitgegeben, keine Klammern

    if (turnLorentzTransformOn == 1){
        this.slider;
        this.rapidity = 0;
        this.draw_slider = drawSlider;
    }

    this.lineSegments = [];
    this.polylineSegments = [];
    this.markCircles = [];
    this.texts = [];
    this.cornerArcs = [];
    this.ticks = [];
    this.vectors = [];
    this.vectorDuplicates = [];

    this.ID_text;
    //Nachbarschaftsbeziehung (Indizes der benachbarten Sektoren; top, right , bottom, left)

    this.neighbourhood = [-1,-1,-1,-1];
    this.snapStatus = [0,0,0,0];
    this.snapEdges = [[0],[0],[0],[0]];
    //this.overlapStatus = [0,0,0,0];

}

/**
 * checks if a point is inside a sector (first bounding box, then trapez itself)
 * @param trapez - the trapez property of the sector
 * @param segmentMittelpunkt - point that is to check
 * @returns {boolean} - true for sector contains point, false for point is outside
 */
function sectorContainsPoint(trapez,segmentMittelpunkt) {
    let isPointInsideSectors = false;
    //
    if (trapez.containsPoint(segmentMittelpunkt, undefined, 'absolute: false' )) {
        //Nach Überprüfen der bounding box prüfen ob tatsächlich innerhalb des Polygons
        //Dazu berechnen der relativen Position (links-/rechtsorientiert zu den Sektorkanten)
        //Wenn zu allen Kanten rechtsorientiert (d. h. beta > 0) dann innerhalb des Polygons
        isPointInsideSectors = true;

        let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(trapez);


        for (let kk = 0; kk < 4; kk++) {



            let xt1 =  trapezPointsAsGlobalCoords[kk].x;
            let xt2 =  trapezPointsAsGlobalCoords[(kk + 1) % 4].x;
            let yt1 =  trapezPointsAsGlobalCoords[kk].y;
            let yt2 =  trapezPointsAsGlobalCoords[(kk + 1) % 4].y;


            let dxt12 = xt2 - xt1;
            let dyt12 = yt2 - yt1;


            let dxw = xt1 - xt2;
            let dyw = yt2 - yt1;
            let xp = segmentMittelpunkt.x;
            let yp = segmentMittelpunkt.y;


            let beta;
            if (Math.abs(dyw) > epsilon) {

                let gamma = (yp - yt1 + ((xt1 - xp) * dxw) / dyw) / (dyt12 - (dxt12 * dxw) / dyw);
                beta = ((xt1 - xp) / dyw) + (dxt12 / dyw) * gamma;
            }

            else {
                let gamma = (xp - xt1 + ((yt1 - yp) * dyw) / dxw) / (dxt12 - (dyt12 * dyw) / dxw);
                beta = ((yt1 - yp) / dxw) + (dyt12 / dxw) * gamma;
            }

            if (beta < epsilon){
                isPointInsideSectors = false;
            }
        }

    }
    return isPointInsideSectors;
}

/**
 * snaps every sector in the sectors array to the neighbor on top and on the right if its euklid
 * the top and right neighbors are being moved to the current (ausgangssektor) sector
 * updates the coords of non euklid sectors in the sectors array including its minions to center
 */
function setOuterSectorsToRing() {

    for (let ii = 0; ii < sectors.length; ii++) {
        removeSnapEdges(sectors[ii].ID)
    }

    for (let ii = 0; ii < sectors.length; ii++) {
        if (sectors[ii].sector_type == 'euklid') {

            let ausgangssektorID;
            let nachbarsektorTopID;
            let nachbarsektorRightID;


            ausgangssektor = sectors[sectors[ii].ID];
            ausgangssektorID = ausgangssektor.ID;
            nachbarsektorRightID = ausgangssektor.neighbourhood[1];
            nachbarsektorTopID= ausgangssektor.neighbourhood[0];

            if (nachbarsektorTopID !== -1){
                snapInitialSectorToTargetSector(nachbarsektorTopID, ausgangssektorID)
            }

            if (nachbarsektorRightID !== -1){
                snapInitialSectorToTargetSector(nachbarsektorRightID, ausgangssektorID)
            }

            drawSnapEdges(ausgangssektorID);
            drawSnapEdges(nachbarsektorRightID)
        }

        if (sectors[ii].sector_type !== 'euklid') {
            sectors[ii].trapez.set('top', 8000);
            sectors[ii].trapez.set('left', 8000);
            sectors[ii].trapez.setCoords();
            updateMinions(sectors[ii].trapez);

        }
    }
}

/**
 * Sets non-Euclidean sectors to the center of the canvas.
 */
function setSectorsToCenter(){

    for (let ii =0; ii < sectors.length; ii++){

        if (sectors[ii].sector_type !== 'euklid') {
            sectors[ii].trapez.set('top', 8000);
            sectors[ii].trapez.set('left', 8000);
            sectors[ii].trapez.setCoords();
            updateMinions(sectors[ii].trapez);

        }


    }
    canvas.renderAll();
}

/**
 * snaps every sector in the sectors array to its neighbor on top if there is one, so the sectors resemble rows or pillars
 * the top neighbors are being moved down to the current sector, not otherwise
 */
function setSectorsToRow(){
    for (let ii = 0; ii < sectors.length; ii++) {

            let ausgangssektorID;
            let nachbarsektorTopID;

            let ausgangssektor = sectors[sectors[ii].ID];
            ausgangssektorID = ausgangssektor.ID;

            nachbarsektorTopID= ausgangssektor.neighbourhood[0];

            if (nachbarsektorTopID !== -1){

                snapInitialSectorToTargetSector(nachbarsektorTopID, ausgangssektorID)

            }
            drawSnapEdges(ausgangssektorID)
        }



}

canvas.setZoom(startZoom);
canvas.viewportTransform[4]= startViewportTransform_4;
canvas.viewportTransform[5]= startViewportTransform_5;

/**
 * Sets the zoom level and adjusts the canvas viewport's transformation.
 *
 * @param {number} zoomToSet - The zoom level to be set for the canvas.
 * @param {number} viewportToTransform_4 - The new value for the 4th element of the canvas's viewport transformation matrix.
 * @param {number} viewportToTransform_5 - The new value for the 5th element of the canvas's viewport transformation matrix.
 */
function setZoomPan(zoomToSet, viewportToTransform_4, viewportToTransform_5){
    canvas.setZoom(zoomToSet);
    canvas.viewportTransform[4]= viewportToTransform_4;
    canvas.viewportTransform[5]= viewportToTransform_5;
}

/**
 * makes the deficit angle infobox visible or invisible depending on the argument
 * @param deficitAngleInfoboxVisibleToSet - boolean (true for showing the deficit angle infobox, false for hiding it)
 */
function showDeficitAngleInfobox(deficitAngleInfoboxVisibleToSet){
    if (deficitAngleInfoboxVisibleToSet == true) {
        canvas_side_bar_perm.setWidth(220);
        infoboxDeficitAngle.opacity = 1;
        infoboxDeficitAngleText.opacity = 1;
    }

    if (deficitAngleInfoboxVisibleToSet == false) {
        if (toCalcSectorArea !== true) {
            canvas_side_bar_perm.setWidth(100);
        }
        removeDeficitAngleVisualize();
        infoboxDeficitAngle.opacity = 0;
        infoboxDeficitAngleText.opacity = 0;
        infoboxDeficitAngleText.set('text', infoboxDeficitAngleTextByLanguage)
    }

}

/**
 * makes the sector area infobox visible or invisible depending on the argument.
 * @param sectorAreaInfoboxVisibleToSet - boolean (true for showing the area infobox, false for hiding it)
 */
function showSectorAreaInfobox(sectorAreaInfoboxVisibleToSet){
    if (sectorAreaInfoboxVisibleToSet == true) {
        canvas_side_bar_perm.setWidth(220);
        infoboxArea.opacity = 1;
        infoboxAreaText.opacity = 1;
    }

    if (sectorAreaInfoboxVisibleToSet == false) {
        if (verticesVisible !== true){
            canvas_side_bar_perm.setWidth(100);
        }
        infoboxArea.opacity = 0;
        infoboxAreaText.opacity = 0;
        infoboxAreaText.set('text', infoboxAreaTextByLanguage)
    }

}

/**
 * makes the vertices of a sector visible or invisible depending on the argument
 * @param toShowVertices - boolean (true for showing vertices, false for hiding them)
 */
function showVertices(toShowVertices){
    if (toShowVertices == true){
        verticesVisible = true;
        showDeficitAngleInfobox(true);
        for (let ii = 0; ii < vertexAngleParts.length; ii++){
            vertexAngleParts[ii].set('opacity', 0.7)
        }
        canvas.renderAll();

    }else {
        verticesVisible = false;
        showDeficitAngleInfobox(false);
        for (let ii = 0; ii < vertexAngleParts.length; ii++){
            vertexAngleParts[ii].set('opacity', 0.0)
        }
        canvas.renderAll();
    }
}

/**
 * Snaps the initial sector to align with the target sector.
 *
 * @param {number} initialSectorID - The ID of the initial sector to be snapped.
 * @param {number} targetSectorID - The ID of the target sector to align with.
 */
async function snapInitialSectorToTargetSector(initialSectorID, targetSectorID) {

    if(textured !== "1") {
        sectors[targetSectorID].trapez.fill = sec_fill[sectors[targetSectorID].ID];
    }

    if (turnLorentzTransformOn == 1){
        let staticSectorPos = new fabric.Point(sectors[targetSectorID].trapez.left, sectors[targetSectorID].trapez.top)

        let targetSectorIDAnglePos = [
            targetSectorID,
            sectors[targetSectorID].trapez.angle,
            staticSectorPos
        ]
        let newSectorPos = getSectorPosToAlign(initialSectorID, targetSectorID, targetSectorIDAnglePos)
        await translateSector(initialSectorID, newSectorPos.x, newSectorPos.y)

    }else{
        let newSectorAngle = getSectorAngleToAlign(initialSectorID, targetSectorID, sectors[targetSectorID].trapez.angle)

        console.log(newSectorAngle)

        let staticSectorPos = new fabric.Point(sectors[targetSectorID].trapez.left, sectors[targetSectorID].trapez.top)

        let targetSectorIDAnglePos = [
            targetSectorID,
            sectors[targetSectorID].trapez.angle,
            staticSectorPos
        ]

        console.log(targetSectorIDAnglePos)

        let newSectorPos = getSectorPosToAlign(initialSectorID, newSectorAngle, targetSectorIDAnglePos)

        console.log(newSectorPos)
        translateSector(initialSectorID, newSectorPos.x, newSectorPos.y)
        await rotateSector(initialSectorID, newSectorAngle)
    }

    updateMinions(sectors[initialSectorID].trapez);

    sectorToSnap = -1;

    changeSnapStatus(initialSectorID);

    if (showExerciseBox == "1"){
        checkSlideCondition();
        console.log('by snap');
        checkCheckBoxCondition();
    }

}

/**
 * creates geodesic line objects and adds them to the canvas when the application is started
 */
function startGeodesics(){

    for (let ii = 0; ii < startSectors.length; ii++) {

        //let sec = sectors[startSectors[ii]];
        let parentSectorID = startParentSector[ii][0];

        let lineStart_x = x_Start[ii] + window.innerWidth / 2;
        let lineStart_y = y_Start[ii] + (window.innerHeight - window.innerHeight * 0.08) / 2;
        let lineEnd_x = x_End[ii] + window.innerWidth / 2;
        let lineEnd_y = y_End[ii] + (window.innerHeight - window.innerHeight * 0.08) / 2;

        let lineSegment = drawLineSegment(startFill[ii], lineStrokeWidthWhenNotSelected, parentSectorID, lineStart_x, lineStart_y, lineEnd_x, lineEnd_y);

        lineSegment.ID = startLineID[ii];

        //sec.lineSegments.push(lineSegment);

        if (lines.length !== 0) {

            let foundMatch = false;

            for (let jj = 0; jj < lines.length; jj++) {
                if (lineSegment.ID[0] === lines[jj][0].ID[0]) {
                    lines[jj].push(lineSegment);
                    foundMatch = true;

                    if (foundMatch) {
                        console.log('check')
                        console.log(lines[jj][lines[jj].length-2])
                        canvas.remove(lines[jj][lines[jj].length-2].dragPoint);
                        delete lines[jj][lines[jj].length-2].dragPoint;
                    }

                    break; // Sobald ein Match gefunden wurde, wird die Schleife abgebrochen
                }
            }

            if (!foundMatch) {
                lines.push([lineSegment]);
            }
        } else {
            lines.push([lineSegment]);
        }



        if (buildGeodesicTicks == "1"){
            drawGeodesicTicks(lineSegment.ID[0])
        }

        if (turnLorentzTransformOn == 1){


            lines[ii].operational = startGeodesicOperational[ii];

            if (lines[ii].operational === false){
                continueGeodesic(ii)
                for (let jj = 0; jj < lines[ii].length; jj++){

                    lines[ii][jj].evented = false;


                }

            }

        }


        drawDragPoint(lineSegment.ID[0])

    }

}

/**
 * creates vector objects and adds them to the canvas when the application is started.
 */
function startVectors(){

    for (let ii = 0; ii < vectorStartSectors.length; ii++) {
        let vectorParentID = vectorStartSectors[ii];
        let vectorPointPosition = new fabric.Point(vectorStart_x[ii] + window.innerWidth / 2, vectorStart_y[ii] + (window.innerHeight - window.innerHeight * 0.08) / 2);
        let vectorHeadPosition = new fabric.Point(vectorEnd_x[ii] + window.innerWidth / 2, vectorEnd_y[ii] + (window.innerHeight - window.innerHeight * 0.08) / 2);
        drawVector(vectorPointPosition, vectorHeadPosition, vectorParentID, vectors.length, sectors[vectorParentID].vectors.length, 'vector', false);
    }

}


/**
 * creates mark objects and adds them to the canvas when the application is started
 * additionally enables the drawing of lines when clicking on a mark
 */
function startMarks() {

    for (let ii = 0; ii < markStartParentSector.length; ii++) {

        let sec = sectors[markStartParentSector[ii][0]];

        let mark = new fabric.Circle({
            originX: 'center',
            originY: 'center',
            left: markStart_x[ii]  + window.innerWidth/2,
            top: markStart_y[ii]  + (window.innerHeight - window.innerHeight*0.08)/2,
            radius: markStartRadius[ii],
            stroke: markStartStroke[ii],
            strokeWidth: markStartStrokeWidth[ii],
            fill: markStartFill[ii],
            perPixelTargetFind: false,
            hasBorders: false,
            objectCaching: false,
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            selectable: false,
            evented: false,
            hoverCursor: 'grabbing',
            padding: paddingStartMarks,
        });

        mark.parentSector = markStartParentSector[ii];

        mark.relationship = getRelationship(mark, sec.ID);
        mark.ID = markStartID[ii];

        let trapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[markStartParentSector[ii][0]].trapez);

        if (turnLorentzTransformOn == 1){
            mark.start_pos_BL_x = mark.left - trapezPointsAsGlobalCoords[3].x;
            mark.start_pos_BL_y = mark.top - trapezPointsAsGlobalCoords[3].y;
        }

        sec.markCircles.push(mark);
        let stackIdx = canvas.getObjects().indexOf(sectors[mark.parentSector[0]].ID_text);
        canvas.insertAt(mark,stackIdx);

        markPoints.push(mark);

        mark.on('mousedown',function(o){

            for (let kk = 0; kk < lines.length; kk++){
                for (let ll = 0; ll < lines[kk].length; ll++)
                    lines[kk][ll].strokeWidth = lineStrokeWidthWhenNotSelected ;
            }


            chosenLineGlobalID = -1;

            let color;
            color = line_colors[lines.length % line_colors.length];

            if (!isLineStarted) {

                startAtMarkPoint = this.ID;

                let pointer = canvas.getPointer(o.e);

                if (lineTypeToDraw == 'geodesic'){

                    isLineStarted = true;

                    let points = [this.left, this.top, pointer.x, pointer.y];

                    showGeodesicButtons(true);

                    line  = new fabric.Line(points, {
                        strokeWidth: lineStrokeWidthWhenSelected,
                        stroke: color,
                        fill: color,
                        originX: 'center',
                        originY: 'center',
                        perPixelTargetFind: true,
                        objectCaching: false,
                        hasBorders: false,
                        hasControls: false,
                        evented: true
                    });

                    canvas.add(line);

                    line.bringToFront();
                }

                if (lineTypeToDraw == 'polyline'){

                    isLineStarted = true;

                    let points = [this.left, this.top, pointer.x, pointer.y];

                    showGeodesicButtons(true);

                    pathCoords.push({x: points[0], y: points[1]});
                    pathCoords.push({x: points[2], y: points[3]});
                    polyline = new fabric.Polyline(pathCoords, {
                        stroke: color,
                        fill: '',
                        strokeWidth: 2,
                        perPixelTargetFind: true,
                        originX: 'center',
                        originY: 'center',
                        objectCaching: false,
                        hasBorders: false,
                        hasControls: false,
                        evented: false,
                        selectable: false,
                    });

                    canvas.add(polyline);

                    polyline.bringToFront();

                }




                canvas.renderAll();


            }

        });



    }
    canvas.renderAll();
}

/**
 * creates text objects and adds them to the canvas when the application is started.
 */
function startTexts() {
    for (let ii = 0; ii < textStartParentSector.length; ii++) {

        let sec = sectors[textStartParentSector[ii][0]];
        let text = new fabric.Text("" + (textStartContent[ii]), {
            fontSize : textStartFontSize[ii],
            originX: 'center',
            originY: 'center',
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            selectable: false,
            evented: false,
            left: textStart_x[ii]  + window.innerWidth/2,
            top: textStart_y[ii]  + (window.innerHeight - window.innerHeight*0.08)/2,
            angle: textStartAngle[ii],
        });

        text.parentSector = textStartParentSector[ii];

        text.relationship = getRelationship(text, textStartParentSector[ii][0]);
        text.ID = textStartID[ii];
        sec.texts.push(text);
        let stackIdx = canvas.getObjects().indexOf(sectors[text.parentSector[0]].ID_text);
        canvas.insertAt(text, stackIdx);
        texts.push(text);

    }
    canvas.renderAll();
}

/**
 * Determines the sectors intersected by a line defined by a set of lambdas and two endpoints.
 *
 * @param {number[]} lambdas - An array of lambda values representing the line's parameterization.
 * @param {number[]} [xg1, yg1, xg2, yg2] - An array containing the coordinates of two endpoints [x1, y1, x2, y2].
 * @returns {number[]} - An array of sector IDs intersected by the line segments.
 */
//Bestimmt die Sektorzugehörigkeit der Liniensegmente einer Geodäte über Mittelpunkte
function testLocation(lambdas, [xg1,yg1,xg2,yg2]) {

    let lineOverSectors = [];

    for (let ii = 0; ii < lambdas.length - 1; ii++) {
        let sectorID = -1;
        if (Math.abs(lambdas[ii] - lambdas[ii + 1])>epsilon){
            let lambdaMittelwert = (lambdas[ii] + lambdas[ii+1])/2;

            let segmentMittelpunkt = new fabric.Point((xg1 + lambdaMittelwert * (xg2 - xg1)),(yg1 + lambdaMittelwert * (yg2 - yg1)));

            let isPointInsideSectors = false;



            let stackIdx = 0;

            for(let jj = 0; jj < sectors.length; jj++){
                isPointInsideSectors = sectorContainsPoint(sectors[jj].trapez, segmentMittelpunkt);
                if (isPointInsideSectors) {
                    if (canvas.getObjects().indexOf(sectors[jj].ID_text) > stackIdx) {
                        sectorID = sectors[jj].ID;
                        //break;

                        stackIdx = canvas.getObjects().indexOf(sectors[jj].ID_text);
                    }
                }
            }


            segmentMittelpunkt = null;
        }

        lineOverSectors.push(sectorID)
    }

    return lineOverSectors;
}

/**
 * calculates the degree value of an angle given in radians
 * @param rad - the radian value of the angle
 * @returns {number} - the degree value of the angle
 */
function toDegree(rad) {
    return rad * 180 /Math.PI
}

/**
 * Changes the selected tool and object properties like lockMovement, evented etc. for interaction with the canvas
 * elements.
 *
 * @param {string} argument - The tool to be selected ('paint', 'mark', 'delete', etc.).
 */
//Werkzeugsänderung über die Button der Internetseite
function toolChange(argument) {

    canvas.discardActiveObject();
    canvas.renderAll();

    selectedTool = argument;


    if (selectedTool === 'paint'){
        for (let ii = 0; ii < markPoints.length; ii++){
            markPoints[ii].hoverCursor = 'crosshair';
            markPoints[ii].evented = true
        }

        for (let ii = 0; ii < lines.length; ii++) {
            for (let jj = 0; jj < lines[ii].length; jj++) {
                lines[ii][jj].evented = false;
                lines[ii][jj].hoverCursor = 'grabbing';
            }
        }
    }else{
        for (let ii = 0; ii < markPoints.length; ii++){
            markPoints[ii].hoverCursor = 'grabbing';
            markPoints[ii].evented = false
        }
        for (let ii = 0; ii < lines.length; ii++) {

            for (let jj = 0; jj < lines[ii].length; jj++) {

                if (lines[ii].operational !== false){
                    lines[ii][jj].evented = true;
                    lines[ii][jj].hoverCursor = 'pointer';
                }


                if (selectedTool == 'delete') {

                    showGeodesicButtons(false);
                    lines[ii][jj].evented = false;
                    lines[ii][jj].strokeWidth = lineStrokeWidthWhenNotSelected;
                    lines[ii][lines[ii].length - 1].hoverCursor = 'pointer';
                    lines[ii][lines[ii].length - 1].evented = true;
                    lines[ii][lines[ii].length - 1].strokeWidth = lineStrokeWidthWhenSelected;

                }

                if (typeof(lines[ii][jj].__eventListeners)=== 'undefined') {
                    lines[ii][jj].on('mousedown', function () {
                        chosenLineGlobalID = this.ID[0];
                        if (showExerciseBox == "1") {
                            console.log('by tool')
                            checkCheckBoxCondition()
                        }
                        for (let kk = 0; kk < lines.length; kk++){
                            for (let ll = 0; ll < lines[kk].length; ll++)
                                lines[kk][ll].strokeWidth = lineStrokeWidthWhenNotSelected ;
                        }
                        for (let kk = lines[chosenLineGlobalID].length - 1; kk >= 0; kk--) {
                            /*Idee: statt die Linien dicker werden lassen, ihnen einen Schatten geben
                              lines[chosenLineGlobalID][kk].setShadow({  color: 'rgba(0,0,0,0.2)',
                                  blur: 10,
                                  offsetX: 50,
                                  offsetY: 0
                              })
                              canvas.renderAll()
                              */
                            lines[chosenLineGlobalID][kk].strokeWidth = lineStrokeWidthWhenSelected ;
                        }

                        if (selectedTool !== 'delete') {
                            showGeodesicButtons(true);
                            showSectorAreaInfobox(false);
                            showDeficitAngleInfobox(false);
                            showVertices(false);
                            changeVectorWidth();
                        }

                        chosenLineGlobalID = this.ID[0];




                        if (selectedTool == 'delete') {
                            cursor = 'not-allowed';
                            lines[this.ID[0]].splice(this.ID[1], 1);
                            if (this.ID[1] === 0) {
                                lines[this.ID[0]] = [];
                            }
                            if (this.parentSector[0] >= 0) {
                                sectors[this.parentSector[0]].lineSegments.splice(this.parentSector[1], 1);
                            }
                            canvas.remove(this);
                            toolChange(selectedTool);
                        }


                    })
                }
            }
        }
    }



    if (selectedTool !== 'delete' && selectedTool !== 'delete_whole') {

        for (let ii = 0; ii < sectors.length; ii++) {
            if (selectedTool === 'paint' || selectedTool === 'mark') {
                cursor = 'crosshair';
                sectors[ii].trapez.evented = true;
                sectors[ii].trapez.hasControls = false;
                sectors[ii].trapez.lockMovementX = true;
                sectors[ii].trapez.lockMovementY = true;
                if (geodreieck !== undefined){
                    geodreieck.selectable = false
                }
                if (add !== undefined){
                    if (lineTypeToDraw == "geodesic"){
                        add.opacity = 0;
                        add_dark.opacity = 1;
                        add.set('shadow', new fabric.Shadow(shadowOff));
                        canvas_side_bar_perm.renderAll()
                    }

                }
                if (add_curved !== undefined){
                    if (showAddCurvedLine == "1"){
                        if (lineTypeToDraw == "polyline") {
                            add_curved.opacity = 0;
                            add_dark_curved.opacity = 1;
                            add_curved.set('shadow', new fabric.Shadow(shadowOff));
                            canvas_side_bar_perm.renderAll()
                        }
                    }
                }

            } else {
                cursor = 'grabbing';
                sectors[ii].trapez.evented = true;
                sectors[ii].trapez.hasControls = true;
                sectors[ii].trapez.lockMovementX = false;
                sectors[ii].trapez.lockMovementY = false;
                if (geodreieck !== undefined){
                    geodreieck.selectable = true
                }
                if (add_dark !== undefined){
                    add.opacity = 1;
                    add_dark.opacity = 0;
                    add.set('shadow', new fabric.Shadow(shadowOff));
                    canvas_side_bar_perm.renderAll()
                }
                if (showAddCurvedLine == "1") {
                    if (add_dark_curved !== undefined) {
                        add_curved.opacity = 1;
                        add_dark_curved.opacity = 0;
                        add_curved.set('shadow', new fabric.Shadow(shadowOff));
                        canvas_side_bar_perm.renderAll()
                    }
                }
            }
            sectors[ii].trapez.hoverCursor = cursor;
        }
    }


    if (selectedTool === 'delete') {

        for (let ii = 0; ii < sectors.length; ii++) {
            sectors[ii].trapez.evented = false;
        }

        for (let ii = 0; ii < lines.length; ii++) {

            for (let jj = 0; jj < lines[ii].length; jj++) {



                if (selectedTool == 'delete') {
                    lines[ii][jj].evented = false;
                    lines[ii][jj].strokeWidth = lineStrokeWidthWhenNotSelected;
                    lines[ii][lines[ii].length - 1].hoverCursor = 'pointer';
                    lines[ii][lines[ii].length - 1].evented = true;
                    lines[ii][lines[ii].length - 1].strokeWidth = lineStrokeWidthWhenSelected;

                }
            }
        }
    }
    if (lockAllSectors=="1") {
        for (let ii = 0; ii < sectors.length; ii++) {
            sectors[ii].trapez.hasControls = false;
            sectors[ii].trapez.lockMovementX = true;
            sectors[ii].trapez.lockMovementY = true;
        }
    }

    canvas.renderAll()
}

/**
 * calculates the radian value of an angle given in degrees
 * @param deg - the degree value of the angle
 * @returns {number} - the radian value of the angle
 */
function toRadians(deg) {
    return deg * Math.PI / 180
}

/**
 * Calculates the position to align a sector with a target sector by specifying a new angle.
 *
 * @param {string} initialSectorID - The identifier of the initial sector.
 * @param {number} newSectorAngle - The new angle at which to align the initial sector.
 * @param {Array} targetSectorIDAnglePos - An array containing target sector information:
 *   - [0]: targetSectorID (string) - The identifier of the target sector.
 *   - [1]: targetSectorAngle (number) - The angle of the target sector.
 *   - [2]: targetSectorPosition (fabric.Point) - The position of the target sector.
 * @returns {fabric.Point} - A fabric.Point object representing the new position for the initial sector.
 */
function getSectorPosToAlign(initialSectorID, newSectorAngle, targetSectorIDAnglePos){

    targetSectorID = targetSectorIDAnglePos[0]

    let commonEdgeNumber = getCommonEdgeNumber(initialSectorID, targetSectorID)

    if(Math.abs(newSectorAngle - sectors[initialSectorID].trapez.angle) < epsilon){
        newSectorAngle = sectors[initialSectorID].trapez.angle
    }

    let initialTrapezPointsAsGlobalCoordsBeforeRotating = getTrapezPointsAsGlobalCoords(sectors[initialSectorID].trapez);
    let targetTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[targetSectorID].trapez);

    let point_1
    let point_a

    //console.log("new:", newSectorAngle)
    //console.log("old:", sectors[initialSectorID].trapez.angle)
    //console.log("sum:", newSectorAngle +sectors[initialSectorID].trapez.angle)

    if (turnLorentzTransformOn==1){
        point_1 = initialTrapezPointsAsGlobalCoordsBeforeRotating[commonEdgeNumber];

        point_a = targetTrapezPointsAsGlobalCoords[(commonEdgeNumber + 3) % 4];

        //drawOrientationCirc('green', point_1.x, point_1.y)
        //drawOrientationCirc('red', point_a.x, point_a.y)

    }else {

        let point_1_temp = initialTrapezPointsAsGlobalCoordsBeforeRotating[commonEdgeNumber];

        //drawOrientationCirc("yellow", point_1_temp.x, point_1_temp.y)
        let point_1_rotated = rotatePoint(
            [
                point_1_temp.x,
                point_1_temp.y
            ],
            newSectorAngle - sectors[initialSectorID].trapez.angle,
            sectors[initialSectorID].trapez.left,
            sectors[initialSectorID].trapez.top,
        )

        point_1 = new fabric.Point(point_1_rotated[0], point_1_rotated[1])
        //drawOrientationCirc('red', point_1_rotated[0], point_1_rotated[1])

        let point_a_tmp = targetTrapezPointsAsGlobalCoords[(commonEdgeNumber + 3) % 4];

        let point_a_tmp_rotated = rotatePoint(
            [point_a_tmp.x, point_a_tmp.y],
            targetSectorIDAnglePos[1] - sectors[targetSectorID].trapez.angle,
            sectors[targetSectorID].trapez.left,
            sectors[targetSectorID].trapez.top,
        )

        //drawOrientationCirc('red', point_a_tmp_rotated[0], point_a_tmp_rotated[1])

        point_a = new fabric.Point(
            point_a_tmp_rotated[0] - (sectors[targetSectorID].trapez.left - targetSectorIDAnglePos[2].x),
            point_a_tmp_rotated[1] - (sectors[targetSectorID].trapez.top - targetSectorIDAnglePos[2].y),
        )

        //drawOrientationCirc('blue', point_a.x, point_a.y)
    }
    let newSectorX = sectors[initialSectorID].trapez.left + (point_a.x - point_1.x)
    let newSectorY = sectors[initialSectorID].trapez.top + (point_a.y - point_1.y)


    let newSectorPos = new fabric.Point(newSectorX, newSectorY)
    //drawOrientationCirc('yellow', newSectorPos.x, newSectorPos.y)
    return newSectorPos

}

/**
 * Translates a sector's position on the canvas.
 *
 * @param {string} SectorToTRanslate - The identifier of the sector to be translated.
 * @param {number} newSectorX - The new X-coordinate for the sector's position.
 * @param {number} newSectorY - The new Y-coordinate for the sector's position.
 * @returns {Promise} - A Promise that resolves when the translation is complete.
 */
function translateSector(SectorToTRanslate, newSectorX, newSectorY){
    return new Promise((resolve) => {
        if (animatedMovingOn == "1"){
            sectors[SectorToTRanslate].trapez.animate({'left': newSectorX, 'top': newSectorY}, {
                onChange: function () {
                    updateMinions(sectors[SectorToTRanslate].trapez)
                    canvas.renderAll.bind(canvas)
                },
                onComplete: function () {
                    resolve();
                }
            });
        }else{
            sectors[SectorToTRanslate].trapez.set({ 'left': newSectorX, 'top': newSectorY })
            sectors[SectorToTRanslate].trapez.setCoords();
            updateMinions(sectors[SectorToTRanslate].trapez)
            resolve();
        }
    })
}

//Zuletzt gesetzte Linie wird gelöscht
/**
 * reverses the last action done in the application
 * the action that can be undone are:
 * drawing a line,
 * moving a sector,
 * deleting a line or vector,
 * drawing a vector,
 * changing a vector in position, angle or length
 */
function undoLastAction(){
    if (history.length <= 0){return}
    let immediatehistory = history.pop();
    //zeichnen von Linien rückgängig
    if (immediatehistory[0] === 0) {

        for (let jj = 1; jj < immediatehistory.length; jj++) {

            let lineID = immediatehistory[immediatehistory.length - jj];

            let lineSegment = lines[lineID[0]][lineID[1]];

            if (lines[lineID[0]][lines[lineID[0]].length - 1].dragPoint !== undefined) {
                canvas.remove(lines[lineID[0]][lines[lineID[0]].length - 1].dragPoint);
                delete lines[lineID[0]][lines[lineID[0]].length - 1].dragPoint;

            }

            if (buildGeodesicTicks == "1"){
                for (let kk = lineSegment.geodesicTicks.length - 1; kk >= 0; kk--){
                    canvas.remove(lineSegment.geodesicTicks[kk]);
                    delete lineSegment.geodesicTicks[kk]
                }
                lines[lineID[0]].lastLineSegmentWithRem -= 1
            }

            if (typeof(lineSegment) !== undefined) {
                let secID = lineSegment.parentSector;

                if (secID[0] >= 0) {
                    sectors[secID[0]].lineSegments.splice(secID[1], 1);
                }

                lines[lineID[0]].splice(lineID[1], 1);

                if (lineID[1] === 0) {
                    lines[lineID[0]] = [];
                }

                canvas.remove(lineSegment);

            }

            lineSegment = lines[lineID[0]][lines[lineID[0]].length - 1];

            drawDragPoint(lineID[0])
        }

    }

    if (immediatehistory[0] === 1) {
        //bewegen von sektoren rückgängig
        for (let jj = 1; jj < immediatehistory.length; jj++) {
            let sectorID = immediatehistory[immediatehistory.length - jj][0];
            let sectorStackID = immediatehistory[immediatehistory.length - jj][1];
            let rapidityBefore = immediatehistory[immediatehistory.length - jj][5];

            removeSnapEdges(sectorID);

            if (turnLorentzTransformOn == 1) {

                let dist_inv_min_x_old = Math.min(sectors[sectorID].trapez.points[0].x, sectors[sectorID].trapez.points[1].x, sectors[sectorID].trapez.points[2].x, sectors[sectorID].trapez.points[3].x);
                let dist_inv_max_y_old = Math.max(sectors[sectorID].trapez.points[0].y, sectors[sectorID].trapez.points[1].y, sectors[sectorID].trapez.points[2].y, sectors[sectorID].trapez.points[3].y);

                sectors[sectorID].slider[0].top = sectors[sectorID].slider[1].top + rapidityBefore * slider_max;
                sectors[sectorID].slider[0].relationship = getRelationship(sectors[sectorID].slider[0], sectorID);

                lorentzTransform(rapidityBefore, sectors[sectorID].trapez);
                sectors[sectorID].rapidity = rapidityBefore;
                reinitialiseSector(dist_inv_min_x_old, dist_inv_max_y_old, sectorID)
            }


            sectors[sectorID].trapez.set('left', immediatehistory[immediatehistory.length - jj][2]);
            sectors[sectorID].trapez.set('top', immediatehistory[immediatehistory.length - jj][3]);
            sectors[sectorID].trapez.set('angle', immediatehistory[immediatehistory.length - jj][4]);
            updateMinions(sectors[sectorID].trapez);
            changeSnapStatus(sectorID);
            drawSnapEdges(sectorID);
            canvas.moveTo(sectors[sectorID].trapez, sectorStackID);
            moveMinionsToStack(sectorID, sectorStackID)

        }
    }

    if (immediatehistory[0] === 2) {
        //Löschen einer Linie rückgängig
        if(immediatehistory[1] !== 'vector' && immediatehistory[1] !== 'duplicate') {
            let line = [];

            for (let jj = immediatehistory.length - 1; jj > 1; jj--) {
                let lineSegment;

                let lineSegmentParameter = immediatehistory[jj];

                if (lineSegmentParameter[0] == 'geodesic'){
                    lineSegment = drawLineSegment(lineSegmentParameter[1], lineSegmentParameter[2], lineSegmentParameter[3], lineSegmentParameter[4], lineSegmentParameter[5], lineSegmentParameter[6], lineSegmentParameter[7])
                }

                if (lineSegmentParameter[0] == 'polyline'){
                    lineSegment = drawPolylineSegment(lineSegmentParameter[1], lineSegmentParameter[2], lineSegmentParameter[3], lineSegmentParameter[4])
                }


                lineSegment.ID = [immediatehistory[1], line.length];
                line.push(lineSegment);
            }
            for (let jj = 0; jj < line.length; jj++){
                lines[immediatehistory[1]].push(line[jj])
            }

            drawDragPoint(line[line.length - 1].ID[0]);

            if (buildGeodesicTicks == "1"){
                drawGeodesicTicks(immediatehistory[1])
            }

        } else if(immediatehistory[1] === 'vector') {
            let vectorPointPosition = new fabric.Point(immediatehistory[4], immediatehistory[5]);
            let vectorHeadPosition = new fabric.Point(immediatehistory[6], immediatehistory[7]);
            drawVector(vectorPointPosition, vectorHeadPosition, immediatehistory[3][0], immediatehistory[2], immediatehistory[3][1], 'vector', false);
            for (let ii = 0; ii < vectors.length; ii++) {
                let vectorPointParentID = getParentSectorOfPoint(new fabric.Point(vectors[ii][0].left, vectors[ii][0].top));
                vectors[ii][0].parentSector = [vectorPointParentID, sectors[vectorPointParentID].vectors.indexOf(vectors[ii])];
                vectors[ii][0].ID = vectors.indexOf(vectors[ii]);
                vectors[ii][1].ID = vectors.indexOf(vectors[ii]);
                vectors[ii][2].ID = vectors.indexOf(vectors[ii]);
            }
        } else {
            let vectorPointPosition = new fabric.Point(immediatehistory[4], immediatehistory[5]);
            let vectorHeadPosition = new fabric.Point(immediatehistory[6], immediatehistory[7]);
            drawVector(vectorPointPosition, vectorHeadPosition, immediatehistory[3][0], immediatehistory[2], immediatehistory[3][1], 'duplicate', false);
            for (let ii = 0; ii < vectorDuplicates.length; ii++) {
                let vectorPointParentID = getParentSectorOfPoint(new fabric.Point(vectorDuplicates[ii][0].left, vectorDuplicates[ii][0].top));
                vectorDuplicates[ii][0].parentSector = [vectorPointParentID, sectors[vectorPointParentID].vectorDuplicates.indexOf(vectorDuplicates[ii])];
                vectorDuplicates[ii][0].ID = vectorDuplicates.indexOf(vectorDuplicates[ii]);
                vectorDuplicates[ii][1].ID = vectorDuplicates.indexOf(vectorDuplicates[ii]);
                vectorDuplicates[ii][2].ID = vectorDuplicates.indexOf(vectorDuplicates[ii]);
            }
        }

    }


    if (immediatehistory[0] === 3) {
        for (let jj = 0; jj < immediatehistory[1]; jj++) {
            undoLastAction()
        }
    }

    if (immediatehistory[0] === 4) {

        for (let jj = 1; jj < immediatehistory.length; jj++) {

            let polylineID = immediatehistory[immediatehistory.length - jj];

            let polylineSegment = lines[polylineID[0]][polylineID[1]];

            if (lines[polylineID[0]][lines[polylineID[0]].length - 1].dragPoint !== undefined) {
                canvas.remove(lines[polylineID[0]][lines[polylineID[0]].length - 1].dragPoint);
                delete lines[polylineID[0]][lines[polylineID[0]].length - 1].dragPoint;

            }

            if (polylineSegment.parentSector !== undefined) {
                let secID = polylineSegment.parentSector;
                if (secID[0] >= 0) {
                    sectors[secID[0]].polylineSegments.splice(secID[1], 1);
                }
                lines[polylineID[0]].splice(polylineID[1], 1);
                if (polylineID[1] === 0) {
                    lines[polylineID[0]] = [];
                }
                canvas.remove(polylineSegment);
            }
            polylineSegment = lines[polylineID[0]][lines[polylineID[0]].length - 1];

            drawDragPoint(lineID[0])

        }
    }
// Zeichnen von Vektoren und Duplikaten zurueck nehmen
    if(immediatehistory[0] === 5) {
        if(immediatehistory[1] !== 'duplicate') {
            canvas.remove(vectors[immediatehistory[1]][0], vectors[immediatehistory[1]][1], vectors[immediatehistory[1]][2]);
            if(vectors[immediatehistory[1]][0].parentSector !== undefined) {
                //sectors[vectors[immediatehistory[1]][0].parentSector[0]].vectors.splice(vectors[immediatehistory[1]][0].parentSector[1], 1);
                sectors[vectors[immediatehistory[1]][0].parentSector[0]].vectors.pop();
            }
            //vectors.splice(immediatehistory[1], 1);
            vectors.pop();
        } else {
            canvas.remove(vectorDuplicates[immediatehistory[2]][0], vectorDuplicates[immediatehistory[2]][1], vectorDuplicates[immediatehistory[2]][2]);
            if(vectorDuplicates[immediatehistory[2]][0].parentSector !== undefined) {
                //sectors[vectorDuplicates[immediatehistory[2]][0].parentSector[0]].vectorDuplicates.splice(vectorDuplicates[immediatehistory[2]][0].parentSector[1], 1);
                sectors[vectorDuplicates[immediatehistory[2]][0].parentSector[0]].vectorDuplicates.pop();
            }
            //vectorDuplicates.splice(immediatehistory[2], 1);
            vectorDuplicates.pop();
        }

    }
    // Position, Laenge und Richtung von Vektoren zurueck nehmen
    if(immediatehistory[0] === 6) {

        let vectorPoint = sectors[immediatehistory[1]].vectors[immediatehistory[2]][0];
        let vectorLine = sectors[immediatehistory[1]].vectors[immediatehistory[2]][1];
        let vectorHead = sectors[immediatehistory[1]].vectors[immediatehistory[2]][2];

        canvas.remove(vectorPoint, vectorLine, vectorHead);
        sectors[immediatehistory[1]].vectors.splice(immediatehistory[2], 1);
        vectors.splice(vectorPoint.ID, 1);
        let vectorPointPositionBefore = new fabric.Point(immediatehistory[3][2], immediatehistory[3][3]);
        let vectorHeadPositionBefore = new fabric.Point(immediatehistory[3][4], immediatehistory[3][5]);
        drawVector(vectorPointPositionBefore, vectorHeadPositionBefore, immediatehistory[3][0], vectorPoint.ID, immediatehistory[3][1], 'vector', false);
        for (let ii = 0; ii < vectors.length; ii++) {
            let vectorPointParentID = getParentSectorOfPoint(new fabric.Point(vectors[ii][0].left, vectors[ii][0].top));
            vectors[ii][0].parentSector = [vectorPointParentID, sectors[vectorPointParentID].vectors.indexOf(vectors[ii])];
        }

    }

    canvas.renderAll();

}



//Mitbewegen von untergeordneten Objekten (zugehörig zu einem Parentalsektor)
//TODO: Vereinfachen durch function
/**
 * calculates the necessary transformation of object coordinates to maintain their position and orientation relative to
 * another object when its coordinates have changed
 * @param boss - changed object
 * @param minion - object that follows boss
 */
function updateMinionsPosition(boss, minion) {
    if (minion.relationship) {
        minion.bringToFront();
        let relationship = minion.relationship;
        let newTransform = multiply(
            boss.calcTransformMatrix(),
            relationship
        );
        let options;
        options = fabric.util.qrDecompose(newTransform);
        minion.set({
            flipX: false,
            flipY: false,
        });
        minion.setPositionByOrigin(
            {x: options.translateX, y: options.translateY},
            'center',
            'center'
        );
        minion.set(options);
        minion.setCoords();
    }
}

/**
 * updates position and orientation of all objects drawn on a sector to maintain their relation to the sector using the
 * updateMinionsPosition method.
 * @param boss - trapez property of the parent sector
 */
function updateMinions(boss) {
    boss.bringToFront();
    /*
    for(let ii=0;ii<4;ii++) {
        if (boss.parent.snapStatus[ii] !== 0) {
            boss.parent.snapEdges[ii].bringToFront();
        }
    }
    */

    for (let ii = 0; ii < boss.parent.markCircles.length; ii++) {
        let markPoint = boss.parent.markCircles[ii];
        updateMinionsPosition(boss, markPoint);
    }

    /*for (let ii = 0; ii < boss.parent.vectorDuplicates.length; ii++) {
        let vectorDuplicate = boss.parent.vectorDuplicates[ii];
        updateMinionsPosition(boss, vectorDuplicate[0]);
        updateMinionsPosition(boss, vectorDuplicate[1]);
        updateMinionsPosition(boss, vectorDuplicate[2]);
        updateMinionsPosition(vectorDuplicate[0], vectorDuplicate[0].orientationLine);
    }

    for (let ii = 0; ii < boss.parent.vectors.length; ii++) {
        let vector = boss.parent.vectors[ii];
        updateMinionsPosition(boss, vector[0]);
        updateMinionsPosition(vector[0], vector[1]);
        updateMinionsPosition(vector[0], vector[2]);
        updateMinionsPosition(vector[0], vector[0].orientationLine);
    } */



    if (turnLorentzTransformOn === 1){
        for (let ii = 0; ii < boss.parent.slider.length; ii++){
            let slider_move = boss.parent.slider[ii];
            updateMinionsPosition(boss, slider_move);

        }
    }

    for (let ii = 0; ii < boss.parent.ticks.length; ii++) {
        let tick = boss.parent.ticks[ii];
        updateMinionsPosition(boss, tick)
    }

    for (let ii = 0; ii < boss.parent.lineSegments.length; ii++) {
        let segment = boss.parent.lineSegments[ii];
        updateMinionsPosition(boss, segment);

        if(segment.dragPoint !== undefined){
            let segmentDragPoint = segment.dragPoint;
            updateMinionsPosition(boss, segmentDragPoint);

        }

        if(segment.geodesicTicks !== undefined){
            for(let jj =0; jj < segment.geodesicTicks.length; jj++){
                let segmentGeodesicTick = segment.geodesicTicks[jj];
                updateMinionsPosition(boss, segmentGeodesicTick);
            }
        }
    }



    for (let ii = 0; ii < boss.parent.texts.length; ii++) {
        let text = boss.parent.texts[ii];
        updateMinionsPosition(boss, text);
    }


    for (let ii = 0; ii < boss.parent.cornerArcs.length; ii++) {
        let cornerArc = boss.parent.cornerArcs[ii];
        updateMinionsPosition(boss, cornerArc);
    }

    updateMinionsPosition(boss, boss.parent.ID_text);

    for (let ii = 0; ii < boss.parent.vectorDuplicates.length; ii++) {
        let vectorDuplicate = boss.parent.vectorDuplicates[ii];
        updateMinionsPosition(boss, vectorDuplicate[0]);
        updateMinionsPosition(boss, vectorDuplicate[1]);
        updateMinionsPosition(boss, vectorDuplicate[2]);
        updateMinionsPosition(vectorDuplicate[0], vectorDuplicate[0].orientationLine);
    }

    for (let ii = 0; ii < boss.parent.vectors.length; ii++) {
        let vector = boss.parent.vectors[ii];
        updateMinionsPosition(boss, vector[0]);
        updateMinionsPosition(vector[0], vector[1]);
        updateMinionsPosition(vector[0], vector[2]);
        updateMinionsPosition(vector[0], vector[0].orientationLine);
    }




    if (turnLorentzTransformOn == 1){
        canvas.bringToFront(boss.parent.slider[0])
    }

}


/*********************************** MAIN ***********************************/

//***************************Sektoren entsprechend der Metrik anlegen********************************
// Für Programmierung sec.name = ii, ansonsten sec.name = sec_name[ii], wenn keine (für Bilder) sec.name = "";

init();

fitResponsiveCanvas();

if (buildTicks == "1"){
    for (let ii = 0; ii < sectors.length; ii++){
        drawTicks(sectors[ii].trapez);
    }
}

if (buildLightCone == "1"){
    for (let ii = 0; ii < sectors.length; ii++){
        drawLightCone(sectors[ii].trapez);
    }
}

// Ein Relikt aus alten Tagen:
//positionSectors();

if (buildStartGeodesics == "1"){startGeodesics();}

if (buildStartMarks == "1"){startMarks();}

if (buildStartTexts == "1"){startTexts();}

if (buildStartVectors == "1"){startVectors();}

if (showVerticesOn == "1"){drawVertices();}

//startTexts();

toolChange(selectedTool);

if (setPositionAndAngleRandomly == "1"){randomPositionAndAngle();}

canvas.renderAll();
//----------------------TODOs-------------------------
//TODO: Sektor nach oben holen beim drüber zeichnen
//TODO: Werkzeug zum Messen von Linien
//TODO: Exercise: Event für Drehen und Verschieben
//TODO: Offset sorgt dafuer, dass es Probleme mit Linien gibt. Die Punkte der Trapeze werden ungleich verschoben


//--------------------Ausschuss-----------------------

//verworfene Idee zur Rotation

/*function rotateAtPivot(object,angle,pivot){
    let point = new fabric.Point(pivot.x-object.width/2.0,pivot.y-object.height/2);
    angle2 = Math.atan2(point.y,point.x);
    angle3 = (2*angle2+angle-Math.PI)/2.0;
    pdist_sq = Math.pow(point.x, 2) + Math.pow(point.y, 2);
    displacement = Math.sqrt(2 * pdist_sq * (1- Math.cos(angle)));
    object.set({transformMatrix:[
            Math.cos(angle),
            Math.sin(angle),
            -Math.sin(angle),
            Math.cos(angle),
            displacement * Math.cos(angle3),
            displacement * Math.sin(angle3)
        ]});
}*/

/*
let deficitAngleVisualizePolygon

function drawDeficitAngleVisualizePolygon(sectorsToSnap, initialArcID_onSector, deficitAngleRad){

    let initialTrapezPointsAsGlobalCoords = getTrapezPointsAsGlobalCoords(sectors[sectorsToSnap[0]].trapez);

    let point_1 = initialTrapezPointsAsGlobalCoords[initialArcID_onSector]
    let point_2 = initialTrapezPointsAsGlobalCoords[(initialArcID_onSector + 3) % 4]

    let dx_tmp = point_2.x - point_1.x;
    let dy_tmp = point_2.y - point_1.y;

    let betrag_vec_12 = Math.sqrt(dx_tmp * dx_tmp + dy_tmp * dy_tmp)

    let lengthFactorSide = 1.2
    let lengthFactorTip = 1.01

    let angleToRotate = toDegree(Math.atan2(dy_tmp, dx_tmp))

    let x0 = 0;
    let y0 = 0;
    let x1 = betrag_vec_12 * lengthFactorSide;
    let y1 = 0;
    let x2 =  (x1 * lengthFactorTip * Math.cos(deficitAngleRad/2) - y1 * lengthFactorTip * Math.sin(deficitAngleRad/2));
    let y2 =  (x1 * lengthFactorTip * Math.sin(deficitAngleRad/2) + y1 * lengthFactorTip * Math.cos(deficitAngleRad/2));
    let x3 =  (x1 * Math.cos(deficitAngleRad) - y1 * Math.sin(deficitAngleRad));
    let y3 =  (x1 * Math.sin(deficitAngleRad) + y1 * Math.cos(deficitAngleRad));

    let toSetOriginY
    if (deficitAngleRad < 0){
        toSetOriginY = 'bottom'
    }else{
        toSetOriginY = 'top'
    }

    deficitAngleVisualizePolygon = new fabric.Polygon //Anlegen des Polygons (noch nicht geaddet), unter 'trapez' abgespeichert
        (
            [   {x: x0, y: y0},
                {x: x1, y: y1},
                {x: x2, y: y2},
                {x: x3, y: y3},
            ],

            {
                originX: 'left',
                originY: toSetOriginY,
                left: point_1.x , //Koordinaten der linken oberen Ecke der Boundingbox
                top: point_1.y,
                angle: angleToRotate,
                fill: '',
                strokeWidth: 1,
                stroke: 'red',
                perPixelTargetFind: true,
                hasControls: false,
                hasBorders: false,
                objectCaching: false,
                lockMovementX: true,
                lockMovementY: true,
                lockScalingX: true,
                lockScalingY: true,
                evented: false,
                opacity: 0.85,

            });

    canvas.add(deficitAngleVisualizePolygon)
}
*/
