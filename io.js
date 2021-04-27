function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    hexagon.x = innerWidth/(2 * scale);
    hexagon.y = innerHeight/(2 * scale);
}
addEventListener("resize", resize);
addEventListener("load", () => {
    var {body} = document;
    body.appendChild(canvas);
    resize();
    square.draw();
    hexagon.draw();
    hexagon.isTouching(square, "red");
    square.isTouching(hexagon, "blue");
});
addEventListener("mousemove", ({x, y}) => {
    ctx.clearRect(0, 0, innerWidth, innerWidth);
    square.x = x/scale;
    square.y = y/scale;
    square.draw();
    hexagon.draw();
    hexagon.isTouching(square);
    square.isTouching(hexagon);
})

var square = new Polygon(0, 0,
    4, //Number of sides
    2, //Radius
    PI/4, //Rotation
);
var hexagon = new Polygon(0, 0,
    6, //Number of sides
    5 //Radius
    //Rotation
);