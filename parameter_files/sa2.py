import sattelflaeche as sa
import geodesicsTextsMarksVectors as gtmv


filename = "sa2.js"

# modeltype:
# spatial: turnLorentzTransformOn = 0
# spacetime: turnLorentzTransformOn = 1
lorentzTransform = 0

#Eigenschaften des Ausgangsobjekts
radius = 500

#Eigenschaften des Sektormodells
nRowsInModel = 3
nColumnsInModel = 3

#Abstaende der Sektoren zueinander
sectorDistance_x = 100
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
startGeodesicsSectors = [2, 2]
#Winkel in Grad
startGeodesicsAngle = [39, 39]
#Startpunkt der Geodaete liegt in der unteren linken Ecke
#Versatz Anteilig der Sektorbreite
startGeodesicsOffset_x = [0.145, 0.42]
#Versatz Anteilig der Sektorhoehe
startGeodesicsOffset_y = [0.56, 0.06]
#Laenge der Geodaete in Pixel
startGeodesicsLength = [70, 70]
#operational bedeutet, dass sie wie eine echte Geodaete behandelt werden
startGeodesicsOperational = ['true', 'true']

#Parameter fuer die Startmarkierungen
startMarksSectors = [6, 7]
startMarksRadius = [5, 5]
startMarksOffset_x = [0.81, 0.99]
startMarksOffset_y = [0.99, 0.84]

#Parameter fuer die Starttexte
startTextsSectors = []
startTextContent = []
startTextsOffset_x = []
startTextsOffset_y = []

#Parameter fuer die Startvektoren
vectorStartSectors = [2]
#Winkel in Grad
vectorStartAngle = [65]
#Startpunkt der Geodaete liegt in der unteren linken Ecke
#Versatz Anteilig der Sektorbreite
vectorStartOffset_x = [0.5]
#Versatz Anteilig der Sektorhoehe
vectorStartOffset_y = [0.2]
#Laenge der Geodaete in Pixel
vectorStartLength = [100]
#operational bedeutet, dass sie wie eine echte Geodaete behandelt werden
vectorStartType = []

sectorValues = sa.buildSectors(filename,
                               lorentzTransform,
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
