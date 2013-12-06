$(function() {
	var updateInterval = 703;

	function updateMessage() {
		$.get("/message")
		.done(function(message) {
			$(".notification-area").text(message.message);
		})
		.fail(function() {
			$(".notification-area").text("Проблема соединения!");
		})
		.always(function() {
			setTimeout(updateMessage, updateInterval);
		});

	};

	updateMessage();
});