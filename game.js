function setupSocket(){
    var socket = io.connect('/');
    if(!$.cookie("UUID")){
        socket.on("newuser", function(data){
            $.cookie("UUID", data.id);
            $("#userid").html($.cookie("UUID"))
        });
        socket.emit("newuser");
    }
    else {
        socket.emit("returninguser", {id: $.cookie("UUID")});
        $("#userid").html($.cookie("UUID"));
    }
    return socket;
}

$(document).ready(function(){
    var socket = setupSocket();
    console.log($.cookie("UUID"));
    socket.emit("onconnected");
    $("html").keyup(function(e){
    socket.emit('keyup', e.keyCode);
    });

    $(function() {
      window.keydown = {};

      $(document).bind("keydown", function(event) {
        keydown[event.keyCode] = true;
      });

      $(document).bind("keyup", function(event) {
        keydown[event.keyCode] = false;
      });
    });

    var CANVAS_WIDTH = $(document).innerWidth() * 0.9;
    var CANVAS_HEIGHT = $(document).innerHeight() * 0.9;
    $("#canvas").attr("height", CANVAS_HEIGHT);
    $("#canvas").attr("width", CANVAS_WIDTH);

    var stage = new createjs.Stage("canvas");

    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);

    createjs.Ticker.addEventListener("tick", tick);
    function tick(event) {
        circle.x += event.delta/1000*100;
        if(circle.x > CANVAS_WIDTH + 50){
            circle.x = 0;
        }
        stage.update();
    }
});