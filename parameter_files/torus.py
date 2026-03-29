import io
import math

def buildSectors(filename,
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
                 vectorColors):


    nRowsInModel = int(maxWinkelQuerschnittsKreis / deltaWinkelQuerschnittsKreis)
    nColumnsInModel = int(maxWinkelMittellinienKreis / deltaWinkelMittellinienKreis)


    maxSectorWidth = 120

    file = io.open(filename,'w')

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
        "let line_colors = " + str(lineColors)
    )
    file.write("\n")
    file.write(
        "let mark_colors = " + str(markColors)
    )
    file.write("\n")
    file.write(
        "let vector_colors = " + str(vectorColors)
    )
    file.write("\n")
    file.write(
        "let lineStrokeWidthWhenNotSelected = " + str(lineStrokeWidthWhenNotSelected)
    )
    file.write("\n")
    file.write(
        "let lineStrokeWidthWhenSelected =" + str(lineStrokeWidthWhenSelected)
    )
    file.write("\n")

    variablenamesSectors = ["sec_name",
                            "sec_fill",
                            "sec_ID",
                            "sec_type",
                            "sec_fontSize",
                            "sec_height",
                            "sec_width",
                            "sec_offset",
                            "sec_coords",
                            "sec_neighbour_top",
                            "sec_neighbour_right",
                            "sec_neighbour_bottom",
                            "sec_neighbour_left",
                            "sec_posx",
                            "sec_posy",
                            "sec_angle"]

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

            secIdx = jj + ii * nRowsInModel

            sectorTop = ((radiusMittellinienKreis - radiusQuerschnittsKreis * math.cos((zeile) * deltaWinkelQuerschnittsKreis)) *  deltaWinkelMittellinienKreis) * scaleFactor

            sectorBottom = ((radiusMittellinienKreis - radiusQuerschnittsKreis * math.cos((zeile + 1) * deltaWinkelQuerschnittsKreis)) *  deltaWinkelMittellinienKreis) * scaleFactor

            offset = (sectorTop - sectorBottom)/2

            sector_width = max(sectorTop, sectorBottom)

            sector_height = math.sqrt(math.pow(radiusQuerschnittsKreis *scaleFactor * deltaWinkelQuerschnittsKreis, 2) - math.pow(offset, 2))

            sectorValues[sectorDict["sec_top"]][secIdx] = sectorTop

            sectorValues[sectorDict["sec_bottom"]][secIdx] = sectorBottom

            sectorValues[sectorDict["sec_height"]][secIdx] = sector_height

            sectorValues[sectorDict["sec_width"]][secIdx] = sector_width

            sectorValues[sectorDict["sec_offset"]][secIdx] = offset

            sectorValues[sectorDict["sec_coords"]][secIdx] = ([-min(0, offset),
                                                               0,
                                                               sectorTop - min(0, offset),
                                                               0,
                                                               sectorBottom + max(0, offset),
                                                               sector_height,
                                                               max(0, offset),
                                                               sector_height])

            sectorValues[sectorDict["sec_posx"]][secIdx] = ii * (maxSectorWidth + sectorDistance_x)
            print(zeile)
            if(zeile == 0):
                sectorValues[sectorDict["sec_posy"]][secIdx] = 0
            else:
                sectorValues[sectorDict["sec_posy"]][secIdx] = sectorValues[sectorDict["sec_posy"]][jj - 1 + ii * nRowsInModel] + sectorValues[sectorDict["sec_height"]][jj - 1 + ii * nRowsInModel] + sectorDistance_y

            sectorValues[sectorDict["sec_angle"]][secIdx] = 0


            if (zeile == 0):
                sectorValues[sectorDict["sec_neighbour_top"]][secIdx] = (ii + 1) * nRowsInModel - 1
            else:
                sectorValues[sectorDict["sec_neighbour_top"]][secIdx] = secIdx - 1
            if (ii == (nColumnsInModel - 1)):
                sectorValues[sectorDict["sec_neighbour_right"]][secIdx] = zeile
            else:
                sectorValues[sectorDict["sec_neighbour_right"]][secIdx] = zeile + (ii + 1) * nRowsInModel

            if (zeile == nRowsInModel -1):
                sectorValues[sectorDict["sec_neighbour_bottom"]][secIdx] = ii * nRowsInModel
            else:
                sectorValues[sectorDict["sec_neighbour_bottom"]][secIdx] = secIdx + 1

            if (ii == 0):
                sectorValues[sectorDict["sec_neighbour_left"]][secIdx] = (nColumnsInModel * nRowsInModel - nRowsInModel + zeile)
            else:
                sectorValues[sectorDict["sec_neighbour_left"]][secIdx] = zeile + (ii - 1) * nRowsInModel

        jj = jj + 1


    for ii in range(0,len(variablenamesSectors)):
        file.write(variablenamesSectors[ii]+"= [ ")
        for jj in range(0,anzahlDerSektoren):
            file.write(str( sectorValues[ii][jj])+', ')
        file.write("];\n")


    file.close()

    return sectorValues