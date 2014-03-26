var socket = io.connect('http://localhost/session');
var key = $("#key").val();
var user = $("#username").val();

socket.emit("newStudent", {key: key, user: user });