let classifier;
let modeloListo = false;

// cargar modelo
ml5.imageClassifier("MobileNet").then(model => {
    classifier = model;
    modeloListo = true;
    console.log("Modelo cargado");
});


// seleccionar imagen del catálogo
function seleccionar(img){

    document.getElementById("preview").src = img.src;

    document.getElementById("preview").style.display = "block";
    document.getElementById("question").style.display = "none";

    clasificar(img);
}


// clasificar imagen
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
        `📌 ${etiqueta}<br>🎯 ${confianza.toFixed(2)}%`;

        document.getElementById("preview").style.display = "block";
        document.getElementById("question").style.display = "none";

    }else{

        document.getElementById("resultado").innerHTML =
        `❓ No se pudo identificar (${confianza.toFixed(2)}%)`;

        document.getElementById("preview").style.display = "none";
        document.getElementById("question").style.display = "block";
    }
}


// subir imagen
document.getElementById("subir").addEventListener("change", function(e){

    let file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = function(event){

        let img = document.getElementById("preview");
        img.src = event.target.result;

        img.style.display = "block";
        document.getElementById("question").style.display = "none";

        clasificar(img);
    }

    reader.readAsDataURL(file);
});