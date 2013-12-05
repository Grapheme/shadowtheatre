$(window).load(function() {
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


	// function drawpath( canvas, pathstr, duration, attr, callback ) {
	//     var guide_path = canvas.path( pathstr ).attr( { stroke: "none", fill: "none" } );
	//     var path = canvas.path( guide_path.getSubpath( 0, 1 ) ).attr( attr );
	//     var total_length = guide_path.getTotalLength( guide_path );
	//     var last_point = guide_path.getPointAtLength( 0 );
	//     var start_time = new Date().getTime();
	//     var interval_length = 500;
	//     var result = path;        

	//     var interval_id = setInterval( function()
	//     {
	//         var elapsed_time = new Date().getTime() - start_time;
	//         var this_length = elapsed_time / duration * total_length;
	//         var subpathstr = guide_path.getSubpath( 0, this_length );            
	//         attr.path = subpathstr;

	//         path.animate( attr, interval_length );
	//         if ( elapsed_time >= duration )
	//         {
	//             clearInterval( interval_id );
	//             if ( callback != undefined ) callback();
	//                 guide_path.remove();
	//         }                                       
	//     }, interval_length );  
	//     return result;
	// };




	// ---
	// Обработчики нажатия цифровых кнопок
	// ---
	$('.app-button').bind( "vmousedown", function() {
		$(this).addClass("active");
		typeThis( $(this).data("number") );
	});

	$('.app-button').bind( "vmouseup", function() {
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


    var canChoose = true;
    
    $(".fotorama").bind("tap", function() {
    	if(!canChoose) return;

    	var activeFrame = $($(".fotorama").data("fotorama").activeFrame.html);
    	var shadow = shadows[ activeFrame.data("shadow") ];

    	socket.emit("message", shadow.name);
    	canChoose = false;

    	setTimeout(function() {
    		gotoFinal();
	
	    	setTimeout(function() {
	    		canChoose = true;
	    		gotoMain();
	    	}, 10000);
	    }, 2000);
    });

	// $('.fotorama').bind('tap',function(){
	// 	window.socket.emit("message", "Эйфория");

	//  	// drawpath(window.paper, shadowPaths.euphoria, 4000, {
	//  	//  	 "stroke" : "white"
	//  	// }, function() {});

	//  	setTimeout(function() {
	// 	gotoFinal();

	// 		setTimeout(function() {
	// 		gotoMain();
	// 		clearType();
	// 		}, 10000);
	// 	}, 6000);
	// });

	// window.paper = Raphael( $(".canvas-container")[0], 600, 600);
	// var telka = paper.path( shadowPaths.euphoria );
	// telka.attr("fill", "#000000");


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

	gotoMain();

	// ---
	//  Логика ввода пароля
	// ---
	var pass = "";
	var pass_allow = true;

	function typeThis(number) {
		if(pass_allow) {
			if ( $('.closed')[0] ) {
				$('.closed').last().next().html(number).addClass('closed');
			} else {
				$('.typing-div span').first().html(number);
				$('.typing-div span').first().addClass('closed');
			}
			pass += number;
			if(pass.length == 4) {
				$.post("password", {password : pass})
				.done(function() {
					pass = "";
					$('.closed').html('*').removeClass('closed');
					gotoShadow();

				})
				.fail(function() {
					pass_allow = false;
					clearType();
					pass = "";
				});
			}
		}
	}

	function clearType() {
		$('.app-button').effect("shake", {times: 3, distance: 10}, function(){
			$('.closed').html('*').removeClass('closed');
			setTimeout(function() { pass_allow = true; }, 300);
		});
	}
});
