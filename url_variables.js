// URL-Parameter

// Im HTML-File können Vorgabewerte für die Parameter definiert werden.
// Sie müssen als Dictionary angegeben werden, zB:
// <script>
//   defaultParams = {textured: 1, showResetSectors: 1};
// </script>

// Defaultparameter
var defaultParams;

// Parameter (ggf mit Defaultparametern vorbesetzen)
let params = (defaultParams !== undefined) ? defaultParams : {};

// liest URL-Parameter ein u. überschreibt ggf Defaultparameter
window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    params[key] = value;
});


//? um die Variablen anzukuendigen

//language=english& um die Sprache auf Englisch zu stellen (das &-Zeichen zum trennen der Variablen)
let lang = params.lang ?? params.language;
if (lang == 'english') lang = 'en'; // Abwärtskompatibiliät: kann später entfernt werden
if (!['de', 'en'].includes(lang)) lang = 'de'; // Defaultwert, wenn undefiniert
let language = {'en': 'english', 'de': 'german'}[lang]; // Abwärtskompatibiliät: kann später entfernt werden

//turnLorentzTransformOn=1& um lorentzTransform einzuschalten
//let turnLorentzTransformOn = params.turnLorentzTransformOn;

//goThroughStar=1& um lorentzTransform einzuschalten
let goThroughStar = params.goThroughStar;

//sectorIDText=programID& oder sectorIDText=off& um den Button fuer die Sektorflaeche anzuzeigen
let sectorIDText = params.sectorIDText;

//setPositionAndAngleRandomly=1& um die Startposition und den Startwinkel der Sektoren zufaellig einzurichten
let setPositionAndAngleRandomly = params.setPositionAndAngleRandomly;

//showExerciseBox=1& um die ExerciseBox einzuschalten
let showExerciseBox = params.showExerciseBox;

//textured=1& um die Texturen der Erdkarte einzuschalten (nur fuer die Kugel)
let textured = params.textured;

//textureColored=1& um die Texturen der Erdkarte farbig darzustellen (beachte, dass es dann Nordafrika ist)
let textureColored = params.textureColored;


//buildStartGeodesics=1& um die Startgeodaeten einzuschalten
let buildStartGeodesics = params.buildStartGeodesics;

//buildStartVectors=1& um die Startgeodaeten einzuschalten
let buildStartVectors = params.buildStartVectors;

//buildStartMarks=1& um die Markierungen zu Anfang einzuschalten
let buildStartMarks = params.buildStartMarks;

//buildStartTexts=1& um die Markierungen zu Anfang einzuschalten
let buildStartTexts = params.buildStartTexts;

//buildTicks=1& um die ticks zu Anfang einzuschalten
let buildTicks = params.buildTicks;

//buildLightCone=1& um den Lichtkegel zu Anfang einzuschalten
let buildLightCone = params.buildLightCone;

//showResetSectors=1& um den Button fuer das Zuruecksetzten aller Sektoren zu aktivieren
let showResetSectors = params.showResetSectors;

//showSetSectorsToRing=1& um den Button fuer das automatische Zusammensetzen der euklidischen Sektoren zu einem Ring
let showSetSectorsToRing = params.showSetSectorsToRing;

//showAddCurvedLine=1& um den Button fuer krumme Linien anzuzeigen
let showAddCurvedLine = params.showAddCurvedLine;

//showAddVector=1& um den Button fuer Vektor zeichnen anzuzeigen
let showAddVector = params.showAddVector;

//showAreaSector=globe& oder showAreaSector=earth& um den Button fuer die Sektorflaeche anzuzeigen
let showAreaSector = params.showAreaSector;

//showVerticesOn=1& um den Button fuer die Vertices der Sektoren anzuzeigen
let showVerticesOn = params.showVerticesOn;

//showAutoSet=1& um den Button fuer das automatische Zusammensetzen entlang einer Geodaete einzuschalten
let showAutoSet = params.showAutoSet;

//showAutoComplete=1& um den Button fuer die automatische Vervollstaendigung anzuzeigen
let showAutoComplete = params.showAutoComplete;

//showChangeDirection=1& um den Button fuer die Aenderung der Startrichtung anzuzeigen
let showChangeDirection = params.showChangeDirection;

//showChangeStartPoint=1& um den Joystick fuer die Aenderung der Startposition anzuzeigen
let showChangeStartPoint = params.showChangeStartPoint;

//showSaveOption=1&
let showSaveOption = params.showSaveOption;

//turnOverlapControllOn=1& um die OverlapControll ein- und auszuschalten
let turnOverlapControllOn = params.turnOverlapControllOn;

//defineLaufContinueGeodesicMax=XX& XX is a number to limit the function
let defineLaufContinueGeodesicMax = params.defineLaufContinueGeodesicMax;

let userName = params.userName;

//autoSetOnDraw=1& um das automatische Zusammensetzen der Sektoren beim Zeichnen einer Linie zu aktivieren
//noch zu entwickeln
let autoSetOnDraw = params.autoSetOnDraw;

//buildGeodesicTicks=1&
let buildGeodesicTicks = params.buildGeodesicTicks;

//geodesicsLightLike=1&
let geodesicsLightLike = params.geodesicsLightLike;

//animatedMovingOn=1&
let animatedMovingOn = params.animatedMovingOn;

let animatedLineDrawingOn = params.animatedLineDrawingOn;

//lineEndsAtUnsnappedBorder=1&
let lineEndsAtUnsnappedBorder = params.lineEndsAtUnsnappedBorder;

//autoCompleteOnMouseUp=1&
let autoCompleteOnMouseUp = params.autoCompleteOnMouseUp;

//lockAllSectors=1&
let lockAllSectors = params.lockAllSectors;
