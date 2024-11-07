const { Spring, update } = require("@react-spring/web");

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

let mouseMove =  false;

const pointer ={
    x: 0.5 * window.innerWidth,
    y: 0.5 * window.innerHeight,
};

const params = {
    pointsNumber : 40,
    widthFactor: 10,
    mouseThreshold: 0.5,
    Spring: 0.25,
    friction: 0.5,
}


const trail = new Array(params.pointsNumber)



for (let i = 0; i < params.pointsNumber; i++) {
    trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy:0,
    }; 
}

window.addEventListener("click" , (e) => {
    updateMouseposition(e.pageX, e.pageY)
})

window.addEventListener("mousemove" , (e) => {
    mouseMove= true
    updateMouseposition(e.pageX, e.pageY)
})

window.addEventListener("touchmove" , (e) => {
    mouseMove= true
    updateMouseposition(e.targetTouches[0].pageX, e.targetTouches[0].pageY)
})



function updateMouseposition (eX, eY){
    pointer.x = eX
    pointer.y = eY
}

setupCanvas();
update(0);
window.addEventListener('resize', setupCanvas);

function update(t){
    if(!mouseMove){
        pointer.x= (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 *t)) * window.innerWidth;
        pointer.y= (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 *t)) * window.innerHeight;
    }



ctx.clearRect(0,0, canvas.width , canvas.height);
trail.forEach((p, pIdx) =>{
    const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
    const Spring = pIdx === 0 ? 0.4 * params.Spring : params.Spring;
    p.dx += (prev.x - p.x) * Spring;
    p.dy += (prev.y - p.y) * Spring;
    p.dy *= params.friction;
    p.dx *= params.friction;
    p.x += p.dx;
    p.y += p.dy;
} )


var gradiant = ctx.createLinearGradient(0,0, canvas.width , canvas.height);
gradiant.addColorStop(0, "#D3D3D3")
gradiant.addColorStop(1, "#A9A9A9")

ctx.strokeStyle = gradiant;
ctx.lineCap = "round";
ctx.beginPath()
ctx.moveTo (trail[0].x , trail[0].y);

for (let i = 0; i < trail.length; i++) {
    const xc = 0.5 *  (trail[i].x + trail[i + 1].x);
    const yc = 0.5 *  (trail[i].y + trail[i + 1].y);
    ctx.quadraticCurveTo(trail[i].x , trail[i].y , xc, yc);
    ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
    ctx.stroke();
}

ctx.lineTo(trail[trail.length - 1].x , trail[trail.length-1].y);
ctx.stroke();

window.requestAnimationFrame(updete);

}


function setupCanvas (){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}



