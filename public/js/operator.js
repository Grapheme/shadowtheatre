$(window).on("load", function() {
	var part = location.pathname.substring(0, location.pathname.lastIndexOf("/")+1);
	if(part[0] === '/') {
		part = part.substring(1);
	}

	var socket = io.connect(location.origin, {
		resource : part + "socket.io"
	});

	socket.on("message", function(message) {
		$(".notification-area").text(message);
	});
});