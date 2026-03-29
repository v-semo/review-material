window.addEventListener('DOMContentLoaded', (event) => {
  const dropZone = document.getElementById('drop-zone');
  const fileContents = document.getElementById('file-contents');

  // Drag & Drop-Events abfangen
  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('drag-over');

    const file = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target.result;
      parseFileContents(contents);
      loadAdditionalScripts(); // Laden der weiteren Skripte
    };

    reader.readAsText(file);
  });

  // Funktion zum Analysieren des Dateiinhalts
  function parseFileContents(contents) {
    // Führen Sie hier den gewünschten Code aus, um den Inhalt der Datei zu analysieren
    // In diesem Fall können Sie die Inhalte in Ihre JavaScript-Variablen einfügen
    eval(contents); // Ausführen des JavaScript-Codes aus der Datei
    console.log(startZoom); // Beispiel: Ausgabe des Wertes von startZoom
  }

  // Funktion zum Laden der weiteren Skripte


  function loadAdditionalScripts() {
    const scripts = [
      'main_button_side_bar_perm.js',
      'exercises/kugel_exercise.js',
      'main_exercise_box.js',
      'main_application.js'
      // Weitere Skript-URLs können hier hinzugefügt werden
    ];

    loadScript(0);

    function loadScript(index) {
      if (index >= scripts.length) {
        console.log('Alle Skripte wurden geladen und ausgeführt');
        removeDropZone(); // Drop-Zone entfernen
        return;
      }

      const script = document.createElement('script');
      script.src = scripts[index];
      script.onload = () => {
        console.log(`Script ${index + 1} wurde geladen und ausgeführt`);
        loadScript(index + 1); // Nächstes Skript laden
      };
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  }

  function removeDropZone() {
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
      dropZone.remove();
    }
  }
});