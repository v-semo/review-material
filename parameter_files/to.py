import torus as to
import geodesicsTextsMarksVectors as gtmv
import math

filename = "to.js"

# modeltype:
# spatial: turnLorentzTransformOn = 0
# spacetime: turnLorentzTransformOn = 1
lorentzTransform = 0

#Eigenschaften des Ausgangsobjekts
radiusQuerschnittsKreis = 2.5
radiusMittellinienKreis = 7

deltaWinkelQuerschnittsKreis = math.pi/3
deltaWinkelMittellinienKreis = math.pi/6

maxWinkelQuerschnittsKreis = 2 * math.pi
maxWinkelMittellinienKreis = 2 * math.pi

scaleFactor = 30

#Abstaende der Sektoren zueinander
sectorDistance_x = 50
sectorDistance_y = 10

#Kameraeinstellungen
startZoom = 0.5
startViewportTransform_4 = -200
startViewportTransform_5 = 0

#Schriftgroesse im Modell
fontSize = 15

lineColors = ['blue', 'black', 'grey', 'purple', 'orange', 'fuchsia', 'deepskyblue', 'gold', 'silver', 'lightskyblue', 'lightsteelblue', 'greenyellow', 'tomato', 'darkorchid', 'mistyrose', 'salmon']
lineStrokeWidthWhenNotSelected = 2
lineStrokeWidthWhenSelected = 5

markColors = ['black', 'black','black','black','black','black','black','black','black', 'grey', 'grey', 'grey']

vectorColors = ['blue', 'black']

#Parameter fuer die Startgeodaeten
startGeodesicsSectors = []
#Winkel in Grad
startGeodesicsAngle = []
#Startpunkt der Geodaete liegt in der unteren linken Ecke
#Versatz Anteilig der Sektorbreite
startGeodesicsOffset_x = []
#Versatz Anteilig der Sektorhoehe
startGeodesicsOffset_y = []
#Laenge der Geodaete in Pixel
startGeodesicsLength = []
#operational bedeutet, dass sie wie eine echte Geodaete behandelt werden
startGeodesicsOperational = []

#Parameter fuer die Startmarkierungen
startMarksSectors = []
startMarksRadius = []
startMarksOffset_x = []
startMarksOffset_y = []

#Parameter fuer die Starttexte
startTextsSectors = []
startTextContent = []
startTextsOffset_x = []
startTextsOffset_y = []

#Parameter fuer die Startvektoren
vectorStartSectors = []
#Winkel in Grad
vectorStartAngle = []
#Startpunkt der Geodaete liegt in der unteren linken Ecke
#Versatz Anteilig der Sektorbreite
vectorStartOffset_x = []
#Versatz Anteilig der Sektorhoehe
vectorStartOffset_y = []
#Laenge der Geodaete in Pixel
vectorStartLength = []
#operational bedeutet, dass sie wie eine echte Geodaete behandelt werden
vectorStartType = []


sectorValues = to.buildSectors(filename,
                               lorentzTransform,
                               radiusQuerschnittsKreis,
                               radiusMittellinienKreis,
                               deltaWinkelQuerschnittsKreis,
                               deltaWinkelMittellinienKreis,
                               maxWinkelQuerschnittsKreis,
                               maxWinkelMittellinienKreis,
                               scaleFactor,
                               sectorDistance_x,
                               sectorDistance_y,
                               startZoom,
                               startViewportTransform_4,
                               startViewportTransform_5,
                               fontSize,
                               lineColors,
                               lineStrokeWidthWhenNotSelected,
                               lineStrokeWidthWhenSelected,
                               markColors,
                               vectorColors)

gtmv.startprocess(filename,
                  lorentzTransform,
                  sectorValues,
                  startGeodesicsSectors,
                  startGeodesicsAngle,
                  startGeodesicsLength,
                  startGeodesicsOffset_x,
                  startGeodesicsOffset_y,
                  startGeodesicsOperational,
                  startMarksSectors,
                  startMarksOffset_x,
                  startMarksOffset_y,
                  startMarksRadius,
                  startTextsSectors,
                  startTextsOffset_x,
                  startTextsOffset_y,
                  startTextContent,
                  vectorStartSectors,
                  vectorStartAngle,
                  vectorStartLength,
                  vectorStartOffset_x,
                  vectorStartOffset_y)

print('done')