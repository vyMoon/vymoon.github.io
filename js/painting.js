const paintingColors = {    // доступные цвета
    red: '#ea5d56',
    yellow: '#f3d135',
    green: '#6cbe47',
    blue: '#53a7f5',
    purple: '#b36ade'
};

const painting = {

get canvas() {
    return domOperations.finder('.canvas');
},

sender: undefined,

ctx: undefined,
ctxHelper: undefined,
drawing: false,
needsRepaint: false,
needsSend: false,

brushRadius: 4,
// arrays with lines
curves: [],

// ищем инпут, который  чекнут по умолчанию и присваиваем переменной код выбранного цвета
actualColor: paintingColors[ menu.colorInputs.find( el => {return el.hasAttribute('checked')} ).value ],

actualColorChanger(event) {
    // handles clicks on colors changers
    painting.actualColor = paintingColors[event.target.value];
},

canvasCleaner() {
    //cleans lines array
    painting.curves = [];
    painting.curvesHelper = [];
},

// makes point on canvas
circle(point, color, ctx) {
    painting[ctx].beginPath();
    painting[ctx].arc(...point, painting.brushRadius / 2, 0, 2 * Math.PI);
    painting[ctx].fillStyle = color;
    painting[ctx].fill();
},
    
smoothCurveBetween (p1, p2, ctx) {
    //makes line betwen two points
    const cp = p1.map((coord, idx) => (coord + p2[idx]) / 2);
    painting[ctx].quadraticCurveTo(...p1, ...cp);
},
    
smoothCurve(points, color, ctx) {
    // makes line
    painting[ctx].beginPath();
    painting[ctx].lineWidth = painting.brushRadius;
    painting[ctx].lineJoin = 'round';
    painting[ctx].lineCap = 'round';
    
    painting[ctx].moveTo(...points[0]);
    
    for(let i = 1; i < points.length - 1; i++) {
        painting.smoothCurveBetween(points[i], points[i + 1], ctx);
    }
    
    painting[ctx].strokeStyle = color;
    painting[ctx].stroke();
},

ticker(ctx, canvas, curves) {
    // repaints the canvas
    const doodle = domOperations.finder(canvas);
        
    painting[ctx].clearRect(0, 0, doodle.width, doodle.height);
    
    curves.forEach((curve) => {
        painting.circle(curve.curve[0], curve.color, ctx);
        painting.smoothCurve(curve.curve, curve.color, ctx);
    });
},
    
tick () {
    if(painting.needsRepaint) {

        painting.ticker('ctx', '.canvas', painting.curves);
        painting.needsRepaint = false;

    }
    window.requestAnimationFrame(painting.tick);
},

paint() {
    const doodle = domOperations.finder('.commentsContainer');
    // block click on butons of forms
    doodle.addEventListener('click', painting.paintPrevent)
    doodle.addEventListener("mousedown", painting.canvasMousedown);
    doodle.addEventListener("mouseup", painting.canvasDrawingFalse);
    doodle.addEventListener("mouseleave", painting.canvasDrawingFalse);
    doodle.addEventListener("mousemove", painting.canvasMousemove);

    painting.tick();
    // sends canvas data
    painting.sender = setInterval(function() {
        
        if (!painting.drawing && painting.needsSend) {

            domOperations.finder('.canvas').toBlob((el) => linkage.ws.send(el));
            painting.needsSend = false;
            painting.curves = [];
            painting.needsRepaint = true;

        }
    }, 1200)
},

stopPaint() { // remones events listeners
    const doodle = domOperations.finder('.commentsContainer');
    doodle.removeEventListener('click', painting.paintPrevent);
    doodle.removeEventListener("mousedown", painting.canvasMousedown);
    doodle.removeEventListener("mouseup", painting.canvasDrawingFalse);
    doodle.removeEventListener("mouseleave", painting.canvasDrawingFalse);
    doodle.removeEventListener("mousemove", painting.canvasMousemove);
    // stops sending canvas
    clearInterval(painting.sender);
},

canvasMousedown(event) {
    // if click on the canvas makes the first point
    if (event.currentTarget === event.target) {
        painting.drawing = true;

        const curve = {};
        curve.color = painting.actualColor;
        curve.curve = [];
        
        curve.curve.push([event.offsetX, event.offsetY]);
        painting.curves.push(curve); 
        // painting.curvesHelper.push(curve);

        painting.needsRepaint = true;
        painting.needsSend = true;
    }
},

canvasMousemove(event) {
    // makes the line
    if (painting.drawing && event.currentTarget === event.target) {

        const point = [event.offsetX, event.offsetY]
        painting.curves[painting.curves.length - 1].curve.push(point);
        
        painting.needsRepaint = true;

    } else if (painting.drawing && event.currentTarget !== event.target) {
        // stops painting on the comennts form
        painting.canvasDrawingFalse();
    }
},

canvasDrawingFalse() {
    // stops painting
    if(painting.drawing) {
        
        painting.drawing = false;
        painting.needsSend = true;

    }
},

paintPrevent(event) {
    // prevent click on comments form buttons if a form is open
    event.preventDefault();
}

}
