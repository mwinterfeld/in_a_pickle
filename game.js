var nCardsInHand = 5;
var CANVAS_WIDTH = $(document).outerWidth() * 0.9;
var CANVAS_HEIGHT = $(document).outerHeight() * 0.9;

function Card(name, x, y, stage){
    this.rect = new createjs.Shape(new createjs.Graphics().f("#eeeeee").s("rbga(20,20,20,1)").rr(x, y, Card.width, Card.height, 3));
    this.text = new createjs.Text(name, Card.fontsize + "px Serif", "#212121"); 
    this.text.x = x + Card.width / 2 - this.text.getBounds().width / 2;
    this.text.y = y + Card.height / 3;
    stage.addChild(this.rect);
    stage.addChild(this.text);
}

Card.width = CANVAS_WIDTH / 12;
Card.height = CANVAS_WIDTH / 10;
Card.fontsize = CANVAS_WIDTH / 80;

function runGame(){
    $("#canvas").attr("height", CANVAS_HEIGHT);
    $("#canvas").attr("width", CANVAS_WIDTH);
    var stage = new createjs.Stage("canvas");

    window.socket.on("getcard", function(data){
        var card = new Card(data.name, data.x, data.y, stage);
        stage.update();
    });

    for(var i = 0; i < nCardsInHand; i++){
        window.socket.emit("getcard", {"x": 50 + 100 * i, "y": CANVAS_HEIGHT / 2})
    }
}

runGame();