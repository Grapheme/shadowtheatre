function random( min, max ) {
	return min + Math.random() * ( max - min );
}

function Particle( x, y, theta ) {
	this.alive = true;

	this.radius = random(0, 3);
	this.theta = random( 0, Math.PI * 2 );

	this.x = x;
	this.y = y;

	this.wander = random( 0.1, 4.0 );
	this.drag = random( 0.9, 0.99 );

	var force = random( 0, 2 );
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
		this.vx += Math.sin( this.theta ) * 0.01;
		this.vy += Math.cos( this.theta ) * 0.01 + 0.05;

		this.radius *= 0.9;
		this.alive = this.radius > 0.02;

		this.elem.attr("cx", this.x);
		this.elem.attr("cy", this.y);
	}
};	



function superAnimation(paper, path, callback) {
	var p = paper.path(path).attr("fill", "black").attr("stroke", "none");

	var len = p.getTotalLength();
	var period = 35;
	var l = 0;

	var particles = [];
	var pool = [];

	function tick() {
		l += 0.005;
		if(l > 1) return callback();

		var point = p.getPointAtLength(len * l);


		for(var i =0; i < 4; ++i) {
			var particle = new Particle(point.x, point.y, point.alpha);
			particle.elem = paper.circle(particle.x, particle.y, particle.radius)
				.attr("fill", "white").attr("stroke", "none");
			particles.push( particle );
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
