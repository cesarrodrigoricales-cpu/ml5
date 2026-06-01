let classifier;

// cargar modelo
ml5.imageClassifier("MobileNet").then(model => {
    classifier = model;
});

// seleccionar imagen
function seleccionar(img){

    document.getElementById("preview").src = img.src;

    document.getElementById("preview").style.display = "block";
    document.getElementById("question").style.display = "none";

    clasificar(img);
}

// clasificar
async function clasificar(img){

    if(!classifier) return;

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

        document.getElementById("preview").src = event.target.result;

        document.getElementById("preview").style.display = "block";
        document.getElementById("question").style.display = "none";

        clasificar(document.getElementById("preview"));
    }

    reader.readAsDataURL(file);
});
