let handPose;
let video;
let hands = [];

function preload(){
    handPose = ml5.handPose({ maxHands: 2 });
}

function setup(){
    createCanvas(640,480);

    video = createCapture(VIDEO);
    video.size(640,480);
    video.hide();

    handPose.detectStart(video, gotHands);
}

function gotHands(results){
    hands = results;
}

function draw(){

    image(video,0,0,width,height);

    if(hands.length >= 2){

        let index1 = hands[0].keypoints[8];
        let index2 = hands[1].keypoints[8];

        // distancia entre dedos
        let d = dist(index1.x, index1.y, index2.x, index2.y);

        // COLOR SEGÚN DISTANCIA
        let r, g, b;

        if(d < 120){
            // cerca → azul
            r = 0; g = 150; b = 255;
        }
        else if(d < 250){
            // medio → amarillo
            r = 255; g = 200; b = 0;
        }
        else{
            // lejos → rojo
            r = 255; g = 0; b = 0;
        }

        stroke(r,g,b);
        strokeWeight(5);
        line(index1.x, index1.y, index2.x, index2.y);

        // puntos
        fill(r,g,b);
        noStroke();
        circle(index1.x,index1.y,12);
        circle(index2.x,index2.y,12);
    }
}
