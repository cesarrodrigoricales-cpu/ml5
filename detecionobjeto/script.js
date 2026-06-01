let video;
let classifier;

let label = "Esperando...";
let confidence = 0;

let ultimoObjeto = "";

function preload() {
    classifier = ml5.imageClassifier(
        "https://teachablemachine.withgoogle.com/models/neeRu3ppe/model.json"
    );
}

function setup() {
    createCanvas(640, 480);

    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    classifier.classifyStart(video, gotResult);
}

function draw() {

    image(video, 0, 0, width, height);

    fill(0);
    rect(0, height - 90, width, 90);

    fill(255);
    textSize(28);
    textAlign(CENTER, CENTER);

    text(
        label,
        width / 2,
        height - 60
    );
    text(
        confidence.toFixed(2) + " %",
        width / 2,
        height - 25
    );
}

function gotResult(results) {

    if (results.length < 1) return;

    let nombre = results[0].label;
    let conf = results[0].confidence * 100;

    if (conf > 50) {

        label = nombre;
        confidence = conf;

        document.getElementById("resultado").innerHTML = nombre;
        document.getElementById("porcentaje").innerHTML =
            conf.toFixed(2) + " %";

        if (nombre !== ultimoObjeto) {
            hablar(nombre);
            ultimoObjeto = nombre;
        }
    }
    else {

        label = "No identificado";
        confidence = conf;

        document.getElementById("resultado").innerHTML =
            "No identificado";

        document.getElementById("porcentaje").innerHTML =
            conf.toFixed(2) + " %";
    }
}

function hablar(texto) {

    speechSynthesis.cancel();

    const voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";
    voz.rate = 1;
    voz.pitch = 1;
    voz.volume = 1;

    speechSynthesis.speak(voz);
}