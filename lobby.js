function setupSocket(){
    window.socket = io.connect('/');
    if(!$.cookie("UUID")){
        window.socket.on("newuser", function(data){
            $.cookie("UUID", data.id);
            checkNameTag();
        });
        window.socket.emit("newuser");
    }
    else {
        window.socket.emit("returninguser", {id: $.cookie("UUID")});
        $("#userid").html($.cookie("UUID"));
        checkNameTag();
    }
    window.socket.emit("onconnected");
}

function checkNameTag(){
    if($.cookie("name")){
        $("#nametag").html("&nbsp;Welcome&nbsp;" + $.cookie("name") + "&nbsp;<button class='headerbtn' style='margin-left: 10px;' id='createGame'>Create Game</button>");
        $("#createGame").click(function(){
            createGame();
        });
    }
    else {
        $("#nametag").html("<form id='newname'>Set Name:&nbsp;<input></input>&nbsp;<button class='headerbtn' style='margin-right: 5px;'>Submit</button></form>");
        $("#newname").submit(function(){
            $.cookie("name", $("#newname input").val());
            window.socket.emit("setname", $.cookie("name"));
            checkNameTag();
            return false;
        });
    }
}

function createGame(){
    window.socket.emit("newgame", {"id": $.cookie("UUID"), "name": $.cookie("name")});
    window.socket.on("newgame", function(data){
        window.location = "/game/" + data.id;
    });
}

$(document).ready(function(){
    setupSocket();
    $("#joinGame").click(function(){
        window.location = "/game.html";
    });
});
