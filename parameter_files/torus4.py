import io
import math
import geodesicsTextsMarksVectors as gtm

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
maxWinkelMittellinienKreis = 2 * math.pi / 3

scaleFactor = 30

#Abstaende der Sektoren zueinander
sectorDistance_x = 50
sectorDistance_y = 10

#Kameraeinstellungen
startZoom = 1
startViewportTransform_4 = -500
startViewportTransform_5 = -200

#Schriftgroesse im Modell
fontSize = 15

lineStrokeWidthWhenNotSelected = 2
lineStrokeWidthWhenSelected = 5

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





def main():


    nRowsInModel = int(maxWinkelQuerschnittsKreis / deltaWinkelQuerschnittsKreis)
    nColumnsInModel = int(maxWinkelMittellinienKreis / deltaWinkelMittellinienKreis)


    maxSectorWidth = 120

    file = io.open("torus4.js",'w')

    file.write( "/*" +"\n"
                "------Parameter-------" + "\n"
                "turnLorentzTransformOn = " + str(lorentzTransform) + "\n"
                "radiusQuerschnittsKreis: " + str(radiusQuerschnittsKreis) + "\n"
                "radiusMittellinienKreis: " + str(radiusMittellinienKreis) + "\n"
                "deltaWinkelQuerschnittsKreis: " + str(deltaWinkelQuerschnittsKreis) + "\n"
                "deltaWinkelMittellinienKreis: " + str(deltaWinkelMittellinienKreis) + "\n"
                "maxWinkelQuerschnittsKreis: " + str(maxWinkelQuerschnittsKreis) + "\n"
                "scaleFactor: " + str(scaleFactor) + "\n"
                "sectorDistance_x: " + str(sectorDistance_x) + "\n"
                "sectorDistance_y: " + str(sectorDistance_y) + "\n"
                "startZoom =" + str(startZoom) + "\n"
                "startViewportTransform_4 =" + str(startViewportTransform_4) + "\n"
                "startViewportTransform_5 =" + str(startViewportTransform_5) + "\n"
                "fontSize: " + str(fontSize) + "\n"
                "startGeodesicsSectors: " + str(startGeodesicsSectors) + "\n"
                "startGeodesicsAngle: " + str(startGeodesicsAngle) + "\n"
                "startGeodesicsOffset_x: " + str(startGeodesicsOffset_x) + "\n"
                "startGeodesicsOffset_y: " + str(startGeodesicsOffset_y) + "\n"
                "startGeodesicsLength: " + str(startGeodesicsLength) + "\n"
                "startGeodesicsOperational: " + str(startGeodesicsOperational) + "\n"
                "startMarksSectors: " + str(startMarksSectors) + "\n"
                "startMarksRadius: " + str(startMarksRadius) + "\n"
                "startMarksOffset_x: " + str(startMarksOffset_x) + "\n"
                "startMarksOffset_y: " + str(startMarksOffset_y) + "\n"
                "startTextsSectors: " + str(startTextsSectors) + "\n"
                "startTextContent: " + str(startTextContent) + "\n"
                "startTextsOffset_x: " + str(startTextsOffset_x) + "\n"
                "startTextsOffset_y: " + str(startTextsOffset_y) + "\n"
                "----------------------"
                + "\n"
                  "*/"
                )

    file.write("\n")
    file.write("\n")

    file.write(
        "startZoom =" + str(startZoom) + "\n"
        "startViewportTransform_4 =" + str(startViewportTransform_4) + "\n"
        "startViewportTransform_5 =" + str(startViewportTransform_5) + "\n"
    )
    file.write("\n")


    file.write("let turnLorentzTransformOn =" + str(lorentzTransform) + "\n")

    file.write("\n")

    file.write(
        "let line_colors = ['blue', 'black', 'grey', 'purple', 'orange', 'fuchsia', 'deepskyblue', 'gold', 'silver', 'lightskyblue', 'lightsteelblue', 'greenyellow', 'tomato', 'darkorchid', 'mistyrose', 'salmon'];")
    file.write("\n")
    file.write(
        "let mark_colors = ['grey', 'grey', 'grey', 'grey'];")
    file.write("\n")
    file.write(
        "let lineStrokeWidthWhenNotSelected = " + str(lineStrokeWidthWhenNotSelected)
    )
    file.write("\n")
    file.write(
        "let lineStrokeWidthWhenSelected =" + str(lineStrokeWidthWhenSelected)
    )
    file.write("\n")
    variablenamesSectors = ["sec_name", "sec_fill", "sec_ID", "sec_type", "sec_fontSize", "sec_top","sec_bottom", "sec_height", "sec_width", "sec_offset", "sec_coords", "sec_neighbour_top", "sec_neighbour_right", "sec_neighbour_bottom", "sec_neighbour_left", "sec_posx","sec_posy","sec_angle"  ]
    sectorDict = dict(zip(variablenamesSectors,range(len(variablenamesSectors))))

    anzahlDerSektoren = int(nRowsInModel * nColumnsInModel)

    #sectorValues = np.zeros((len(variablenamesSectors),anzahlDerSektoren))
    sectorValues = [[[] for ii in range(anzahlDerSektoren)] for jj in range(len(variablenamesSectors))]

    jj =0

    for id in range(0, anzahlDerSektoren):
        if (id == 5 or id == 8 ):
            sectorValues[sectorDict["sec_name"]][id] = "'" + str(id + 1)+"." "'"
        else:
            sectorValues[sectorDict["sec_name"]][id] = id + 1
        sectorValues[sectorDict["sec_ID"]][id] = id
        # Bei Bedarf muss die Fläche dazu genommen werden: Wichtig, "sec_fill" muss der Liste variablenamesSectors hinzugefügt werden!!!
        sectorValues[sectorDict["sec_fill"]][id] = "'white'"
        sectorValues[sectorDict["sec_fontSize"]][id] = fontSize

    for zeile in range(0, nRowsInModel):
        for ii in range(0, nColumnsInModel):

            sectorValues[sectorDict["sec_top"]][jj + ii * nRowsInModel] = ((radiusMittellinienKreis - radiusQuerschnittsKreis * math.cos((zeile) * deltaWinkelQuerschnittsKreis)) *  deltaWinkelMittellinienKreis) * scaleFactor

            print(sectorValues[sectorDict["sec_top"]][jj + ii * nRowsInModel])

            sectorValues[sectorDict["sec_bottom"]][jj + ii * nRowsInModel] = ((radiusMittellinienKreis - radiusQuerschnittsKreis * math.cos((zeile + 1) * deltaWinkelQuerschnittsKreis)) *  deltaWinkelMittellinienKreis) * scaleFactor

            print(sectorValues[sectorDict["sec_bottom"]][jj + ii * nRowsInModel])

            offset = (sectorValues[sectorDict["sec_top"]][jj + ii * nRowsInModel] - sectorValues[sectorDict["sec_bottom"]][jj + ii * nRowsInModel])/2

            sector_width = max(sectorValues[sectorDict["sec_top"]][jj + ii * nRowsInModel],sectorValues[sectorDict["sec_bottom"]][jj + ii * nRowsInModel])

            sector_height = math.sqrt(math.pow(radiusQuerschnittsKreis *scaleFactor * deltaWinkelQuerschnittsKreis, 2) - math.pow(offset, 2))

            sectorValues[sectorDict["sec_height"]][jj + ii * nRowsInModel] = sector_height

            sectorValues[sectorDict["sec_width"]][jj + ii * nRowsInModel] = sector_width

            sector_y_dist = sector_height + sectorDistance_y

            sectorValues[sectorDict["sec_offset"]][jj + ii * nRowsInModel] = offset

            sectorValues[sectorDict["sec_coords"]][jj + ii * nRowsInModel] = ([-min(0, offset),
                                                                                          0,
                                                                                          sectorValues[sectorDict["sec_top"]][jj + ii * nRowsInModel] - min(0, offset),
                                                                                          0,
                                                                                          sectorValues[sectorDict["sec_bottom"]][jj + ii * nRowsInModel] + max(0, offset),
                                                                                          sectorValues[sectorDict["sec_height"]][jj + ii * nRowsInModel],
                                                                                          max(0, offset),
                                                                                          sectorValues[sectorDict["sec_height"]][jj + ii * nRowsInModel]])

            sectorValues[sectorDict["sec_posx"]][jj + ii * nRowsInModel] = ii * (maxSectorWidth + sectorDistance_x)
            print(zeile)
            if(zeile == 0):
                sectorValues[sectorDict["sec_posy"]][jj + ii * nRowsInModel] = 0
            else:
                sectorValues[sectorDict["sec_posy"]][jj + ii * nRowsInModel] = sectorValues[sectorDict["sec_posy"]][jj - 1 + ii * nRowsInModel] + sectorValues[sectorDict["sec_height"]][jj - 1 + ii * nRowsInModel] + sectorDistance_y

            sectorValues[sectorDict["sec_angle"]][jj + ii * nRowsInModel] = 0


            if (zeile == 0):
                sectorValues[sectorDict["sec_neighbour_top"]][jj + ii * nRowsInModel] = (ii + 1) * nRowsInModel - 1
            else:
                sectorValues[sectorDict["sec_neighbour_top"]][jj + ii * nRowsInModel] = zeile + ii * nRowsInModel - 1
            if (ii == (nColumnsInModel - 1)):
                sectorValues[sectorDict["sec_neighbour_right"]][jj + ii * nRowsInModel] = zeile
            else:
                sectorValues[sectorDict["sec_neighbour_right"]][jj + ii * nRowsInModel] = zeile + (ii + 1) * nRowsInModel

            if (zeile == nRowsInModel -1):
                sectorValues[sectorDict["sec_neighbour_bottom"]][jj + ii * nRowsInModel] = ii * nRowsInModel
            else:
                sectorValues[sectorDict["sec_neighbour_bottom"]][jj + ii * nRowsInModel] = zeile + ii * nRowsInModel + 1

            if (ii == 0):
                sectorValues[sectorDict["sec_neighbour_left"]][jj + ii * nRowsInModel] = (nColumnsInModel * nRowsInModel - nRowsInModel + zeile)
            else:
                sectorValues[sectorDict["sec_neighbour_left"]][jj + ii * nRowsInModel] = (ii - 1) * nRowsInModel + zeile

        jj = jj + 1


    for ii in range(0,len(variablenamesSectors)):
        file.write(variablenamesSectors[ii]+"= [ ")
        for jj in range(0,anzahlDerSektoren):
            file.write(str( sectorValues[ii][jj])+', ')
        file.write("];\n")

#    gtm.startprocess(file, sectorValues, startGeodesicsSectors, startGeodesicsAngle, startGeodesicsLength,
#                 startGeodesicsOffset_x,startGeodesicsOffset_y,
#                 startMarksSectors,startMarksOffset_x,startMarksOffset_y,startMarksRadius,
#                 startTextsSectors,startTextsOffset_x,startTextsOffset_y, startTextContent)


    file.close()





if (__name__=="__main__" or __name__=="builtins"):
    main()
    print("done_2")
