/* -----------Eintragungen--------------*/
// id: slideID
// text: "editierbare Textbausteine"
// sectorsToHide: [SektorID 1, SektorID 2, ...] Array der zu versteckenden Sektoren
// sectorsToShow: [SektorID 1, SektorID 2, ...] Array der zu zeigenden Sektoren
// geodesicsToHide: [GeodaeteID 1, GeodaeteID 2, ...] Array der zu versteckenden Geodaeten
// geodesicsToShow: [GeodaeteID 1, GeodaeteID 2, ...] Array der zu zeigenden Geodaeten
// marksToHide: [MarkID 1, MarkID 2, ...] Array der versteckenden StartMarks
// marksToShow: [MarkID 1, MarkID 2, ...] Array der zeigenden StartMarks
// textsToHide: [TextID 1, TextID 2, ...] Array der versteckenden StartTexts
// textsToShow: [TextID 1, TextID 2, ...] Array der zeigenden StartTexts
// startToRemoveAllLines: true; um alle Geoda eten zu loeschen. Beachte, dass die History geleert wird
// geodesicsToAutoSetAlong: [GeodaeteID 1, GeodaeteID 2, ...], Array der Geodaeten, entlang derer die Sektoren zusammengesetzt werden sollen
// sectorsToSnapTogether: [[SektorIDToSnap, SektorIDZielsektor], [SektorIDToSnap, SektorIDZielsektor], ...],
// -> Array der Snappartner. Erster Eintrag gilt dem zu bewegenden Sektor der an den Zielsektor sngesnappt wird
// slideCondition: [['snappedSectors', [2, 5]]],
//textIfSlideConditionIsNotFulfilled: 'Du hast Sektor 5 noch nicht richtig angelegt!'

/* bedingte Checkboxes:
    checkBoxesWithText: [
        {
            text_de: '2 und 3 &',
            text_en: '2 and 3 &',
            condition: ['snappedSectors', [1, 2]]
        },
    ]
 */

// imageToAdd: 'add.png' fügt ein Bild ein
/* -------------------------------------*/

/*  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    Beachte, dass der erste SlideContent
    alle Sektoren, Geodaeten,Texte und
    Marks verstecken sollte, die nicht
    von Anfang an sichtbar sein sollen
*/

let turnBackwardOff = true;

let slideContent = [
    {
        id: 0,
        text_de: 'Willkommen zur Vorstellung von V-SeMo. Klicke auf den Pfeil, um zu beginnen.',
        text_en: 'Welcome to the introduction of V-SeMo. Click on the arrow to begin.',
        sectorsToShow: [4],
        sectorsToHide: [0, 1, 2, 3, 5, 6, 7, 8],
        marksToHide: [0, 1, 2, 3, 4, 5, 6],
        textsToHide: [0, 1, 2, 3, 4, 5, 6],
    },

    {
        id: 1,
        text_de: 'Die Sektoren des Sektormodells ähneln kleinen Papierschnippseln. Sie lassen sich frei bewegen. Probiere es mal.',
        text_en: 'The sectors of the sector model resemble small pieces of paper. They can be moved freely. Give it a try.',
    },

    {
        id: 2,
        text_de: 'Du kannst jeden Sektor auch drehen. Teste es mal.',
        text_en: 'You can also rotate each sector. Try it out.',
    },

    {
        id: 2,
        text_de: 'Tipp:\nDu kannst entweder mit zwei Fingern auf deinem Tablet oder mit Hilfe des Mausrades in die Arbeitsfläche hinein- oder herauszoomen.',
        text_en: 'Tip:\nYou can either use two fingers on your tablet or the mouse wheel to zoom in or out of the workspace.',
    },


    {
        id: 3,
        text_de: '',
        text_en: '',
        marksToShow: [4, 5],
        textsToShow: [4, 5],

        checkBoxesWithText: [
            {
                text_de: 'Wir beginnen mit einer Städtereise, welche in Kopenhagen startet. Zeichne eine erste Route beginnend in Kopenhagen nach Monaco ein.',
                text_en: 'We start with a city trip that starts in Copenhagen. Draw a first route from Copenhagen to Monaco.',
                type: 'tracker',
                condition: ['lineCrossTwoMarks', ['chosenLineGlobalID', 5, 4]],
            },
        ],

    },

    {
        id: 4,
        text_de: '',
        text_en: '',
        sectorsToShow: [5],
        marksToShow: [6],
        textsToShow: [6],

        checkBoxesWithText: [
            {
                text_de: 'Von Monaco geht es weiter nach Tunis. Zeichne auch diese Route ein.',
                text_en: 'From Monaco, the route continues to Tunis. Draw this route as well.',
                type: 'tracker',
                condition: ['lineCrossTwoMarks', ['chosenLineGlobalID', 4, 6]],
            },
        ],

    },

    {
        id: 5,
        text_de: '',
        text_en: '',
        sectorsToShow: [2],
        marksToShow: [2],
        textsToShow: [2],

        checkBoxesWithText: [
            {
                text_de: 'Nun wollen wir unsere Reise nach Casablanca in Marokko fortsetzen.',
                text_en: 'Now we want to continue our journey to Casablanca in Morocco.',
                type: 'tracker',
                condition: ['lineCrossTwoMarks', ['chosenLineGlobalID', 6, 2]],
            },
        ],
    },

    {
        id: 6,
        text_de: '',
        text_en: '',
        sectorsToShow: [1],
        marksToShow: [1],
        textsToShow: [1],

        checkBoxesWithText: [
            {
                text_de: 'Die letzte Station ist die irische Hauptstadt Dublin.',
                text_en: 'The last stop is the Irish capital Dublin.',
                type: 'tracker',
                condition: ['lineCrossTwoMarks', ['chosenLineGlobalID', 2, 1]],
            },
        ],
    },

    {
        id: 7,
        text_de: '',
        text_en: '',

        checkBoxesWithText: [
            {
                text_de: 'Nach unserer letzten Station wollen wir mit dem Flugzeug die kürzeste Route zurück nach Kopenhagen nehmen.',
                text_en: 'After our last stop, we want to take the shortest route back to Copenhagen by plane.',
                type: 'tracker',
                condition: ['lineCrossTwoMarks', ['chosenLineGlobalID', 1, 5]],
            },
        ],
    },

    {
        id: 8,
        text_de: 'Gut gemacht. Kehre nun wieder zur Kursseite zurück.',
        text_en: 'Well done. Return to the course.',

    },

];
