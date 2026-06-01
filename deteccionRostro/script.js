// Dependencias en el HTML:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/ml5@1.3.1/dist/ml5.min.js"></script>

let video;
let detector;
let objects = [];
let tiempoPersona = 0;
let ultimoT = null;

function preload() {
  detector = ml5.objectDetector('cocossd');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  detector.detectStart(video, function(results) {
    objects = results;
  });
}

function draw() {
  image(video, 0, 0);

  let hayPersona = false;

  for (let obj of objects) {
    let esPersona = obj.label === 'person';
    if (esPersona) hayPersona = true;

    stroke(esPersona ? color(255,60,60) : color(60,180,255));
    strokeWeight(2);
    noFill();
    rect(obj.x, obj.y, obj.width, obj.height);

    fill(esPersona ? color(255,60,60) : color(60,180,255));
    noStroke();
    textSize(13);
    text(obj.label + ' ' + nf(obj.confidence*100,1,0) + '%', obj.x+4, obj.y+14);
  }

  // Acumular tiempo si hay persona
  let ahora = millis();
  if (hayPersona) {
    if (ultimoT === null) ultimoT = ahora;
    tiempoPersona += (ahora - ultimoT) / 1000;
    ultimoT = ahora;
  } else {
    tiempoPersona = max(0, tiempoPersona - 0.01);
    ultimoT = null;
  }
  tiempoPersona = min(tiempoPersona, 5);

  // Barra de presencia
  drawPresenceBar(tiempoPersona);

  if (tiempoPersona >= 5) {
    fill(255, 0, 0, 150);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(36);
    text('⚠ ALERTA', width/2, height/2);
    textAlign(LEFT, BASELINE);
    tiempoPersona = 0;
  }
}

function drawPresenceBar(t) {
  let pct = t / 5;
  noStroke();
  fill(0, 0, 0, 120);
  rect(10, height-30, 300, 16, 4);
  fill(lerpColor(color(255,180,0), color(255,30,0), pct));
  rect(10, height-30, 300*pct, 16, 4);
  fill(255);
  textSize(11);
  text(nf(t,1,1) + 's / 5s', 316, height-18);
}