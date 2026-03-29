import neutronstar_schwarzschild_mix as ne
import geodesicsTextsMarksVectors as gtmv

filename = "nech1.js"

# modeltype:
# spatial: turnLorentzTransformOn = 0
# spacetime: turnLorentzTransformOn = 1
lorentzTransform = 0

nSektorzeilenVonRing = 11
nSektorspaltenVonRing = 12

schwarzschildradius = 120
dradius = (0.4) * schwarzschildradius

fontSizeStern = 8
fontSizeAussenraum = 15

lineColors = ['blue', 'black', 'grey', 'purple', 'orange', 'fuchsia', 'deepskyblue', 'gold', 'silver', 'lightskyblue', 'lightsteelblue', 'greenyellow', 'tomato', 'darkorchid', 'mistyrose', 'salmon']
lineStrokeWidthWhenNotSelected = 2
lineStrokeWidthWhenSelected = 5

markColors = ['grey', 'green', 'green', 'green', 'green', 'green']

vectorColors = ['blue', 'black']

#Kameraeinstellungen
startZoom = 1
startViewportTransform_4 = 0
startViewportTransform_5 = 0

# Parameter fuer die Startgeodaeten
startGeodesicsSectors = [47, 58, 69,]
# Winkel in Grad
startGeodesicsAngle = [90, 140.99, 160]
# Startpunkt der Geodaete liegt in der unteren linken Ecke
# Versatz Anteilig der Sektorbreite
startGeodesicsOffset_x = [0.5, 0.5, 0.3]
# Versatz Anteilig der Sektorhoehe
startGeodesicsOffset_y = [0.0001, 0.0001, 0.0001]
# Laenge der Geodaete in Pixel
startGeodesicsLength = [10, 10, 10]
# operational bedeutet, dass sie wie eine echte Geodaete behandelt werden
startGeodesicsOperational = ['true', 'true', 'true']

# Parameter fuer die Startmarkierungen
startMarksSectors = [43, 47, 58, 69, 80, 124]
startMarksRadius = [5, 5, 5, 5, 5, 5]
startMarksOffset_x = [0.5, 0.5, 0.5, 0.3, 0.75, 0.25]
startMarksOffset_y = [0.5, 0.0001, 0.0001, 0.0001, 0.0001, 0.0001]

# Parameter fuer die Starttexte
startTextsSectors = [43, 43, 47, 58, 69, 80, 124]
startTextContent = ['Karl &\\n  Lisa', 'Karl', 'Lisa', 'Lisa', 'Lisa', 'Lisa', 'Lisa']
startTextsOffset_x = [0.6, 0.58, 0.7, 0.7, 0.5, 0.7, 0.3]
startTextsOffset_y = [0.55, 0.55, 0.2, 0.2, 0.25, 0.25, 0.25]

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

sectorValues = ne.buildSectors(filename,
                               lorentzTransform,
                               nSektorzeilenVonRing,
                               nSektorspaltenVonRing,
                               schwarzschildradius,
                               dradius,
                               fontSizeStern,
                               fontSizeAussenraum,
                               startZoom,
                               startViewportTransform_4,
                               startViewportTransform_5,
                               lineColors,
                               lineStrokeWidthWhenNotSelected,
                               lineStrokeWidthWhenSelected,
                               markColors,
                               vectorColors,)

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