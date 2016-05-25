var socket;

function setupSocket(){
    socket = io.connect('/');
    if(!$.cookie("UUID")){
        socket.on("newuser", function(data){
            $.cookie("UUID", data.id);
            $("#userid").html($.cookie("UUID"));
            checkNameTag();
        });
        socket.emit("newuser");
    }
    else {
        socket.emit("returninguser", {id: $.cookie("UUID")});
        $("#userid").html($.cookie("UUID"));
        checkNameTag();
    }
    socket.emit("onconnected");
}

function checkNameTag(){
    if($.cookie("name")){
        $("#nametag").html("&nbsp;Welcome&nbsp;" + $.cookie("name") + "&nbsp;<button class='headerbtn' style='margin-left: 10px;' id='createGame'>Create Game</button>");
    }
    else {
        $("#nametag").html("<form id='newname'>Set Name:&nbsp;<input></input>&nbsp;<button class='headerbtn' style='margin-right: 5px;'>Submit</button></form>");
        $("#newname").submit(function(){
            $.cookie("name", $("#newname input").val());
            checkNameTag();
            return false;
        });
    }
}

function createGame(){
    socket.emit("newgame", {"id": $.cookie("UUID")})
}

$(document).ready(function(){
    setupSocket();
    $("#createGame").click(function(){
        createGame();
    });
    $("#joinGame").click(function(){
        window.location = "/game.html";
    });
});
