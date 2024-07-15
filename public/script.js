const socket = io("/");

var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "443",
});

const user = prompt("Enter your name");
const myvideo = document.createElement("video")
myvideo.muted = true;
var mystream 
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream)=>{
    mystream = stream;
    videoStreaming(mystream, myvideo);
    socket.on("user-connected", (userId)=>{
        connectNewUser(userId, stream);
        console.log(connectNewUser(userId, stream));
    })
})

function connectNewUser(userId, stream){
    var call = peer.call(userId, stream);
    const video = document.createElement("video"); 
    console.log(call);
    call.on("stream", (stream)=>{
        videoStreaming(stream, video);
        console.log(videoStreaming(stream,video));
    });
}

function videoStreaming(stream, video){
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", ()=>{
        video.play();
        $("#videoStream").append(video);
    });
}
$(function () {
    $("#show_chat").click(function () {
        $(".left-window").css("display", "none")
        $(".right-window").css("display", "block")
        $(".header_back").css("display", "block")
    })
    $(".header_back").click(function () {
        $(".left-window").css("display", "block")
        $(".right-window").css("display", "none")
        $(".header_back").css("display", "none")
    })

    $("#send").click(function () {
        if ($("#chat_message").val().length !== 0) {
            socket.emit("message", $("#chat_message").val());
            $("#chat_message").val("");
        }
    })

    $("#chat_message").keydown(function (e) {
        if (e.key == "Enter" && $("#chat_message").val().length !== 0) {
            socket.emit("message", $("#chat_message").val());
            $("#chat_message").val("");
        }
    })
    $("#stop_video").click(function(){
        var enable = mystream.getVideoTracks()[0].enabled
        if(enable){
            mystream.getVideoTracks()[0].enabled = false
            $("#stop_video").toggleClass("black")
            
        }
        else{
            mystream.getVideoTracks()[0].enabled = true
        }
    })
    $("#mute_button").click(function(){
        var muted = mystream.getAudioTracks()[0].enabled
        if(muted){
            mystream.getAudioTracks()[0].enabled = false
            
        }
        else{
           mystream.getAudioTracks()[0].enabled = true 
        }
    })

})

peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id, user);
});

socket.on("createMessage", (message, userName) => {
    $(".messages").append(`
        <div class="message">
            <b><i class="far fa-user-circle"></i> <span> ${userName === user ? "me" : userName
        }</span> </b>
            <span>${message}</span>
        </div>
    `)
});
