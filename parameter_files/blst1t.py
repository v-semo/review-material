import schwarzschildmetrik_rz as smrz
import geodesicsTextsMarksVectors as gtmv

filename = "blst_test.js"

# modeltype:
# spatial: turnLorentzTransformOn = 0
# spacetime: turnLorentzTransformOn = 1
lorentzTransform = 1

nRowsInModel = 6
nColumnsInModel = 1

radius = 120
delta_r = 1.25
delta_t = 1.25
sectorDistance_x = 60
sectorDistance_y = 30

start_x = 150
start_y = 150

#Kameraeinstellungen
startZoom = 0.8
startViewportTransform_4 = -200
startViewportTransform_5 = -350

fontSize = 15

lineColors = ['blue', 'black', 'grey', 'purple', 'orange', 'fuchsia', 'deepskyblue', 'gold', 'silver', 'lightskyblue', 'lightsteelblue', 'greenyellow', 'tomato', 'darkorchid', 'mistyrose', 'salmon']
lineStrokeWidthWhenNotSelected = 2
lineStrokeWidthWhenSelected = 5

markColors = ['black', 'black','black','black','black','black','black','black','black', 'grey', 'grey', 'grey']

vectorColors = ['blue', 'black']



# Parameter fuer die Startgeodaeten
startGeodesicsSectors = [5]
# Winkel in Grad
startGeodesicsAngle = [65]
# Startpunkt der Geodaete liegt in der unteren linken Ecke
# Versatz Anteilig der Sektorbreite
startGeodesicsOffset_x = [0.3]
# Versatz Anteilig der Sektorhoehe
startGeodesicsOffset_y = [0.2]
# Laenge der Geodaete in Pixel
startGeodesicsLength = [40]
# operational bedeutet, dass sie wie eine echte Geodaete behandelt werden
startGeodesicsOperational = ['true']

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

sectorValues = smrz.buildSectors(filename,
                                 lorentzTransform,
                                 nRowsInModel,
                                 nColumnsInModel,
                                 radius,
                                 delta_r,
                                 delta_t,
                                 sectorDistance_x,
                                 sectorDistance_y,
                                 start_x,
                                 start_y,
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
                  vectorStartOffset_y,)

print('done')
