let detector;
let video;
let objects = [];

let tiempoInicio = null;
let alarmaSonada = false;

function setup(){
    createCanvas(640,480);

    video = createCapture(VIDEO);
    video.size(640,480);
    video.hide();

    video.elt.onloadeddata = () => {

        detector = ml5.objectDetector("cocossd", modelLoaded);
    };
}

function modelLoaded(){
    console.log("Modelo cargado");

    detector.detect(video, gotResults);
}

function gotResults(err, results){

    if(err){
        console.error(err);
        return;
    }

    objects = results;

    detector.detect(video, gotResults);
}

function draw(){

    image(video,0,0,width,height);

    let persona = false;

    for(let obj of objects){

        if(obj.label === "person"){
            persona = true;

            stroke(0,255,0);
            noFill();
            rect(obj.x, obj.y, obj.width, obj.height);
        }
    }

    if(persona){

        if(tiempoInicio === null){
            tiempoInicio = millis();
        }

        let t = (millis() - tiempoInicio) / 1000;

        let progreso = map(t,0,5,0,100);
        progreso = constrain(progreso,0,100);

        document.getElementById("barra").style.width = progreso + "%";

        if(t >= 5 && !alarmaSonada){
            hablarAlerta();
            alarmaSonada = true;
        }

    } else {

        tiempoInicio = null;
        alarmaSonada = false;
        document.getElementById("barra").style.width = "0%";
    }
}

function hablarAlerta(){
    let msg = new SpeechSynthesisUtterance(
        "Se ha detectado una amenaza"
    );
    msg.lang = "es-ES";
    speechSynthesis.speak(msg);
}