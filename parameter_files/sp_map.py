import kugelmetrik as km
import geodesicsTextsMarksVectors as gtmv


filename = "sp_map.js"

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
startMarksSectors = [0, 1, 2, 3, 4, 4, 5]
startMarksRadius = [2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5]
startMarksOffset_x = [0.52, 0.8, 0.68, 0.36, 0.25, 0.35, 0.4]
startMarksOffset_y = [0.27, 0.68, 0.68, 0.8, 0.2, 0.8, 0.84]

#Parameter fuer die Starttexte
startTextsSectors = [0, 1, 2, 3, 4, 4, 5]
startTextContent = ['Reykjavik', 'Dublin', 'Casablanca', 'Helsinki', 'Monaco', 'Kopenhagen', 'Tunis']
startTextsOffset_x = [0.5, 0.62, 0.42, 0.65, 0.45, 0.62, 0.55]
startTextsOffset_y = [0.37, 0.68, 0.68, 0.8, 0.2, 0.8, 0.84]


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