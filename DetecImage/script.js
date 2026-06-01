let classifier;
let modeloListo = false;

ml5.imageClassifier("MobileNet").then(model => {
    classifier = model;
    modeloListo = true;
    console.log("Modelo cargado");
});

function seleccionar(img){
    mostrarImagen(img.src);
}

function mostrarImagen(src){

    let img = document.getElementById("preview");

    img.src = "";
    document.getElementById("resultado").innerHTML = "Analizando...";

    img.onload = () => {

        document.getElementById("question").style.display = "none";
        img.style.display = "block";

        clasificar(img);
    };

    img.src = src;
}

async function clasificar(img){

    if(!modeloListo){
        document.getElementById("resultado").innerHTML =
        "Cargando modelo...";
        return;
    }

    const results = await classifier.classify(img);

    let etiqueta = results[0].label;
    let confianza = results[0].confidence * 100;

    if(confianza >= 50){

        document.getElementById("resultado").innerHTML =
        ` ${etiqueta}<br ${confianza.toFixed(2)}%`;

    } else {

        document.getElementById("resultado").innerHTML =
        `❓ No se pudo identificar (${confianza.toFixed(2)}%)`;
    }
}

document.getElementById("subir").addEventListener("change", function(e){

    let file = e.target.files[0];
    if(!file) return;

    let reader = new FileReader();

    reader.onload = function(event){
        mostrarImagen(event.target.result);
    };

    reader.readAsDataURL(file);
});