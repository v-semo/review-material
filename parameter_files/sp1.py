import kugelmetrik as km
import geodesicsTextsMarksVectors as gtmv


filename = "sp1.js"

# modeltype:
# spatial: turnLorentzTransformOn = 0
# spacetime: turnLorentzTransformOn = 1
lorentzTransform = 0

# Einteilung der Kugeloberfläche
nSectorRowsFromSphere = 9
nSectorColumnsFromSphere = 18

#Eigenschaften des Ausgangsobjekts
radius = 500

#Eigenschaften des Sektormodells
nRowsInModel = 3
nColumnsInModel = 3

#Abstaende der Sektoren zueinander
sectorDistance_x = 30
sectorDistance_y = 30

#Kameraeinstellungen
startZoom = 1.0
startViewportTransform_4 = 0
startViewportTransform_5 = 0

#Schriftgroesse im Modell
fontSize = 15

lineColors = ['blue', 'black', 'grey', 'purple', 'orange', 'fuchsia', 'deepskyblue', 'gold', 'silver', 'lightskyblue', 'lightsteelblue', 'greenyellow', 'tomato', 'darkorchid', 'mistyrose', 'salmon']
lineStrokeWidthWhenNotSelected = 2
lineStrokeWidthWhenSelected = 5

markColors = ['black', 'black','black','black','black','black','black','black','black', 'grey', 'grey', 'grey']

vectorColors = ['blue', 'black']

#Parameter fuer die Startgeodaeten
startGeodesicsSectors = [2]
#Winkel in Grad
startGeodesicsAngle = [40]
#Startpunkt der Geodaete liegt in der unteren linken Ecke
#Versatz Anteilig der Sektorbreite
startGeodesicsOffset_x = [0.35]
#Versatz Anteilig der Sektorhoehe
startGeodesicsOffset_y = [0.05]
#Laenge der Geodaete in Pixel
startGeodesicsLength = [80]
#operational bedeutet, dass sie wie eine echte Geodaete behandelt werden
startGeodesicsOperational = ['true']

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


sectorValues = km.buildSectors(filename,
                               lorentzTransform,
                               nSectorRowsFromSphere,
                               nSectorColumnsFromSphere,
                               radius,
                               nRowsInModel,
                               nColumnsInModel,
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