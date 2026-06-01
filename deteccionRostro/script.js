
let faceMesh;
let video;
let faces = [];

function preload(){
    faceMesh = ml5.faceMesh({ maxFaces: 1 });
}

function setup(){
    createCanvas(640,480);

    video = createCapture(VIDEO);
    video.size(640,480);
    video.hide();

    faceMesh.detectStart(video, gotFaces);
}

function gotFaces(results){
    faces = results;
}

function draw(){

    image(video,0,0,width,height);

    if(faces.length == 0) return;

    let face = faces[0];

    let parte = document.getElementById("parte").value;
    let colorHex = document.getElementById("color").value;

    fill(colorHex);
    stroke(colorHex);
    strokeWeight(2);

    let region = face[parte];

    if(region && region.keypoints){

        beginShape();

        for(let p of region.keypoints){
            vertex(p.x, p.y);
            circle(p.x, p.y, 4);
        }

        endShape(CLOSE);
    }

}
