function setupSocket(){
    window.socket = io.connect('/');
    window.socket.emit("returninguser", {id: $.cookie("UUID")});
}

function joinGame(){
    window.socket.emit("joingame", {"userid": $.cookie("UUID"), "gameid": document.location.pathname.replace("/game/", "")});
}

function runGame(){
    $("html").keyup(function(e){
        window.socket.emit('keyup', {"name": $.cookie("name"), "msg": e.keyCode});
    });

    window.socket.on("keyup", function(data){
        $("ul").append("<li>" + data + "</li>");
    });
}

$(document).ready(function(){
    setupSocket();
    joinGame();
    runGame();

    // var CANVAS_WIDTH = $(document).innerWidth() * 0.9;
    // var CANVAS_HEIGHT = $(document).innerHeight() * 0.9;
    // $("#canvas").attr("height", CANVAS_HEIGHT);
    // $("#canvas").attr("width", CANVAS_WIDTH);

    // var stage = new createjs.Stage("canvas");

    // var circle = new createjs.Shape();
    // circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    // circle.x = 100;
    // circle.y = 100;
    // stage.addChild(circle);

    // createjs.Ticker.addEventListener("tick", tick);
    // function tick(event) {
    //     circle.x += event.delta/1000*100;
    //     if(circle.x > CANVAS_WIDTH + 50){
    //         circle.x = 0;
    //     }
    //     stage.update();
    // }
});