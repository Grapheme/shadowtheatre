var options = {
	fillColor : "none"
};

function random( min, max ) {
	return min + Math.random() * ( max - min );
}

function Particle( x, y, theta ) {
	this.alive = true;

	this.x = x;
	this.y = y;

	this.radius = random(0, 5);
	this.theta = random( 0, Math.PI * 2 );

	this.wander = random( 0.1, 1.0 );
	this.drag = random( 0.9, 0.99 );

	var force = random( 1, 3 );
	this.vx = Math.sin( theta ) * force;
	this.vy = Math.cos( theta ) * force;
}

Particle.prototype = {
	move: function() {
		this.x += this.vx;
		this.y += this.vy;

		this.vx *= this.drag;
		this.vy *= this.drag;

		this.theta += random( -0.5, 0.5 ) * this.wander;
		this.vx += Math.sin( this.theta ) * 0.05;
		this.vy += Math.cos( this.theta ) * 0.05;

		this.radius *= 0.9;
		this.alive = this.radius > 0.3;

		this.elem.attr("cx", this.x);
		this.elem.attr("cy", this.y);
	}
};	



function superAnimation(paper, path, callback) {
	var p = paper.path(path)
		.attr("fill", options.fillColor)
		.attr("stroke", "none");

	var dp = paper.path("")
		.attr("stroke", "white")
		.attr("stroke-width", "2");

	var len = p.getTotalLength();
	var period = 55;
	var l = 0;

	var particles = [];
	var pool = [];

	function tick() {
		l += 0.01;
		if(l > 1.2) return callback();

		var point = p.getPointAtLength(len * l);

		dp.attr({ path : p.getSubpath(0, len * l) });

		if(l <= 1 ){
			for(var i =0; i < Math.floor(random(0, 3)); ++i) {
				var particle = new Particle(point.x, point.y,  point.alpha);

				var c = Math.floor( random(220, 255) );
				particle.elem = paper.circle(particle.x, particle.y, particle.radius)
					.attr("fill", "rgb(" + c + "," + c + "," + c + ")")
					.attr("stroke", "none");
				particles.push( particle );
			}
		}

		for (var i = particles.length - 1; i >= 0; i-- ) {
			var particle = particles[i];

			if ( particle.alive ) {
				 particle.move();
			}
			else {
				particles.splice( i, 1 )[0];
				particle.elem.remove();
			}
		}


		setTimeout(tick, period);
	};

	setTimeout(tick, period);
}
