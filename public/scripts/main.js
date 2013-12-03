$(function() {

	$(".login-button").click(function() {
		var password = $(".password-input").val();

		$.post("password", { password : password })
		.done(function() {
			console.log("OK!");
		})
		.fail(function() {
			$(".pure-form").addClass("animated wobble");
		});
	});
});
