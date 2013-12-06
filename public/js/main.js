
$(window).load(function() {
	$(".extra-button").bind("tap", function() {
		location.reload(false);
	});

	// ----
	// Сокеты
	// ----
	var part = location.pathname.substring(0, location.pathname.lastIndexOf("/")+1);
	if(part[0] === '/') {
		part = part.substring(1);
	}

	socket = io.connect(location.origin, {
		resource : part + "socket.io"
	});

	// ----
	// Отключаем возможность ресайза и движения окна в браузере
	// ----
	$(document).bind('touchmove', false);


	// ---
	// Обработчики нажатия цифровых кнопок
	// ---
	var canType = true;

	$('.app-button').bind( "vmousedown", function(e) {
		if(canType) {
			var number = $(e.target).attr("data-number");
			typeThis( number );
			canType = false;
		}

		$(this).addClass("active");
		
	});

	$('.app-button').bind( "vmouseup", function() {
		canType = true;
		$(this).removeClass('active');
	});


	// ---
	// Обработчики нажатия стрелочек влево/вправо
	// ---
	$(".left-arrow").bind("tap", function(e) {
    	$(".fotorama").data("fotorama").show('<');
    });

    $(".right-arrow").bind("tap", function() {
    	$(".fotorama").data("fotorama").show('>');
    });


    $(".fotorama").bind("tap", function() {

    	var activeFrame = $($(".fotorama").data("fotorama").activeFrame.html);

    	var shadow = activeFrame.data("shadow");

    	socket.emit("message", shadows[shadow].name);
    	gotoAnimation( shadow, function() {
    		gotoFinal();

    		setTimeout(function() {
	    		canChoose = true;
	    		gotoMain();
	    	}, 10000);
    	});
    });


	$.each( $(".app-in"), function(i) {
		var paper = Raphael( this, 700, 700);

		var shadow = $(this).parent(".fotorama-slide").data("shadow");

		if(shadows[shadow]) {
			var path = paper.path( shadows[shadow].path );
			path.attr("fill", window.options.fillColor);
			path.attr("stroke", "none");
		}
	});

	var animationPaper = Raphael( $(".app-in-animation")[0], 700, 700);


	function shadowsEffect(paper, shadow) {
		paper.circle(50, 50, 50).attr("fill", "white");
	}

	var fadeDuration = 750;
	function gotoShadow() {
		socket.emit("message", "Внимание");

		$('.app:visible').fadeOut(fadeDuration);
		$('.app.shadow').fadeIn(fadeDuration);
	}

	function gotoFinal() {

		$('.app:visible').fadeOut(fadeDuration);
		$('.app.final').fadeIn(fadeDuration);
	}

	function gotoMain() {
		socket.emit("message", "");

		$(".app:visible").fadeOut(fadeDuration);
		$(".app.main").fadeIn(fadeDuration);
	}

	function gotoAnimation(shadow, callback) {
		$(".app:visible").hide(0);
		$(".app.shadow-animation").show(0);

		$(".app.shadow-animation .shadow-name").text( shadows[shadow].name );
		animationPaper.clear();

		superAnimation(animationPaper, shadows[shadow].path, callback);
	}

	gotoMain();

	// ---
	//  Логика ввода пароля
	// ---
	var pass = "";
	var pass_allow = true;

String.prototype.repeat = function(times) {
   return (new Array(times + 1)).join(this);
};
	var pass = "";
	function typeThis(number) {
		pass += number;
		$(".typing-div").text( pass + "*".repeat(4 - pass.length) );

		if( pass.length >= 4) {
			$.post("password", {password : pass})
			.done(function() {
				gotoShadow();

			})
			.fail(function() {
				clearType();
			})
			.always(function() {
				pass = "";
				$(".typing-div").text( "****" );
			});
		}
	}


	function clearType() {
		$('.app-button').effect("shake", {times: 3, distance: 10}, function(){
			setTimeout(function() { pass_allow = true; }, 300);
		});
	}
});
