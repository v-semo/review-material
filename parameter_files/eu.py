import euklid as eu
import geodesicsTextsMarksVectors as gtmv


filename = "eu.js"

# modeltype:
# spatial: turnLorentzTransformOn = 0
# spacetime: turnLorentzTransformOn = 1
lorentzTransform = 0

nSektorzeilenVonRing = 3
nSektorspaltenVonRing = 12

dr = 100

#Kameraeinstellungen
startZoom = 1
startViewportTransform_4 = 0
startViewportTransform_5 = 0

fontSize = 15

lineColors = ['blue', 'black', 'grey', 'purple', 'orange', 'fuchsia', 'deepskyblue', 'gold', 'silver', 'lightskyblue', 'lightsteelblue', 'greenyellow', 'tomato', 'darkorchid', 'mistyrose', 'salmon']
lineStrokeWidthWhenNotSelected = 2
lineStrokeWidthWhenSelected = 5

markColors = ['black', 'black','black','black','black','black','black','black','black', 'grey', 'grey', 'grey']

vectorColors = ['blue', 'black']

# Parameter fuer die Startgeodaeten
startGeodesicsSectors = []
# Winkel in Grad
startGeodesicsAngle = []
# Startpunkt der Geodaete liegt in der unteren linken Ecke
# Versatz Anteilig der Sektorbreite
startGeodesicsOffset_x = []
# Versatz Anteilig der Sektorhoehe
startGeodesicsOffset_y = []
# Laenge der Geodaete in Pixel
startGeodesicsLength = []
# operational bedeutet, dass sie wie eine echte Geodaete behandelt werden
startGeodesicsOperational = []

# Parameter fuer die Startmarkierungen
startMarksSectors = []
startMarksRadius = []
startMarksOffset_x = []
startMarksOffset_y = []

# Parameter fuer die Starttexte
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


sectorValues = eu.buildSectors(filename,
                               lorentzTransform,
                               nSektorzeilenVonRing,
                               nSektorspaltenVonRing,
                               dr,
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