	(function () {
		var acos = __init__ (__world__.math).acos;
		var acosh = __init__ (__world__.math).acosh;
		var asin = __init__ (__world__.math).asin;
		var asinh = __init__ (__world__.math).asinh;
		var atan = __init__ (__world__.math).atan;
		var atan2 = __init__ (__world__.math).atan2;
		var atanh = __init__ (__world__.math).atanh;
		var ceil = __init__ (__world__.math).ceil;
		var cos = __init__ (__world__.math).cos;
		var cosh = __init__ (__world__.math).cosh;
		var degrees = __init__ (__world__.math).degrees;
		var e = __init__ (__world__.math).e;
		var exp = __init__ (__world__.math).exp;
		var expm1 = __init__ (__world__.math).expm1;
		var floor = __init__ (__world__.math).floor;
		var hypot = __init__ (__world__.math).hypot;
		var inf = __init__ (__world__.math).inf;
		var log = __init__ (__world__.math).log;
		var log10 = __init__ (__world__.math).log10;
		var log1p = __init__ (__world__.math).log1p;
		var log2 = __init__ (__world__.math).log2;
		var nan = __init__ (__world__.math).nan;
		var pi = __init__ (__world__.math).pi;
		var pow = __init__ (__world__.math).pow;
		var radians = __init__ (__world__.math).radians;
		var sin = __init__ (__world__.math).sin;
		var sinh = __init__ (__world__.math).sinh;
		var sqrt = __init__ (__world__.math).sqrt;
		var tan = __init__ (__world__.math).tan;
		var tanh = __init__ (__world__.math).tanh;
		var trunc = __init__ (__world__.math).trunc;
		var status = function (message) {
			document.getElementById ('status').innerHTML = message;
		};
		var debug = function () {
			var info = tuple ([].slice.apply (arguments).slice (0));
			var element = document.getElementById ('status');
			element.innerHTML += ' '.join (function () {
				var __accu0__ = [];
				var __iterable0__ = info;
				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
					var i = __iterable0__ [__index0__];
					__accu0__.append (str (i));
				}
				return __accu0__;
			} ()) + '<br>';
		};
		var check = function (result, message) {
			if (!(result)) {
				debug (message);
			}
		};
		var GREEN = 'forestgreen';
		var BROWN = 'peru';
		var canvas = document.getElementById ('canvas');
		var width = canvas.width;
		var height = canvas.height;
		var ctx = canvas.getContext ('2d');
		var mouse_x = 0.5 * width;
		var mouse_y = 0.5 * height;
		var mouse_event = function (e) {
			mouse_x = e.offsetX;
			mouse_y = e.offsetY;
			status ('mouse_event');
		};
		var keydown_event = function (e) {
			var key = e.key;
			status ('keydown: {}'.format (key));
		};
		canvas.addEventListener ('mousedown', mouse_event, false);
		ctx.font = '38pt Arial';
		ctx.lineWidth = 5;
		var hexagon = function (x0, y0, r) {
			var theta = 0.0;
			ctx.beginPath ();
			var x = x0 + r * cos (theta);
			var y = y0 + r * sin (theta);
			ctx.moveTo (x, y);
			for (var i = 0; i < 6; i++) {
				theta += pi / 3;
				var x = x0 + r * cos (theta);
				var y = y0 + r * sin (theta);
				ctx.lineTo (x, y);
			}
			ctx.fill ();
		};
		var padd = function (p, q) {
			return tuple ([p [0] + q [0], p [1] + q [1]]);
		};
		var prmul = function (s, p) {
			return tuple ([s * p [0], s * p [1]]);
		};
		var radius = 50;
		var radius1 = 0.85 * radius;
		var dps = list ([]);
		var theta = 0.0;
		for (var i = 0; i < 6; i++) {
			dps.append (tuple ([radius * cos (theta), radius * sin (theta)]));
			theta += pi / 3.0;
		}
		var Player = __class__ ('Player', [object], {
			get __init__ () {return __get__ (this, function (self) {
				self.point = dps [0];
				self.line = 0;
				self.face = +(1);
				canvas.addEventListener ('keydown', self.keydown_event, false);
			});},
			get render () {return __get__ (this, function (self) {
				var __left0__ = self.point;
				var x = __left0__ [0];
				var y = __left0__ [1];
				var r = 5;
				ctx.fillStyle = GREEN;
				ctx.strokeStyle = GREEN;
				ctx.beginPath ();
				ctx.arc (x, y, r, 0.0, 2 * pi);
				ctx.fill ();
				ctx.lineWidth = 3;
				ctx.beginPath ();
				ctx.moveTo (x, y);
				check ((0 <= self.line && self.line < 6), 'line = {}'.format (str (self.line)));
				var __left0__ = dps [self.line];
				var dx = __left0__ [0];
				var dy = __left0__ [1];
				ctx.lineTo (x + dx, y + dy);
				ctx.stroke ();
				var __left0__ = dps [__mod__ (self.line + self.face, 6)];
				var dx = __left0__ [0];
				var dy = __left0__ [1];
				hexagon (x + dx, y + dy, radius1);
			});},
			get send_point () {return __get__ (this, function (self) {
				self.point = padd (self.point, dps [self.line]);
				self.line = __mod__ (self.line + 3, 6);
				self.face = -(self.face);
			});},
			get send_line () {return __get__ (this, function (self) {
				self.line = __mod__ (self.line + 2 * self.face, 6);
				self.face = -(self.face);
			});},
			get send_face () {return __get__ (this, function (self) {
				self.face = -(self.face);
			});},
			get keydown_event () {return __get__ (this, function (self, e) {
				status ('keydown {}'.format (e.key));
				if (e.key == 'j') {
					self.send_point ();
				}
				else {
					if (e.key == 'k') {
						self.send_line ();
					}
					else {
						if (e.key == 'l') {
							self.send_face ();
						}
					}
				}
				window.requestNextAnimationFrame (render);
			});}
		});
		var player = Player ();
		var render = function (time) {
			ctx.clearRect (0, 0, width, height);
			ctx.save ();
			var offset = tuple ([width / 2, height / 2]);
			ctx.translate (offset [0], offset [1]);
			var N = 5;
			ctx.fillStyle = BROWN;
			var di = padd (dps [1], dps [0]);
			var dj = padd (dps [5], dps [0]);
			for (var i = -(N); i < N; i++) {
				for (var j = -(N); j < N; j++) {
					var p = padd (prmul (i, di), prmul (j, dj));
					hexagon (p [0], p [1], radius1);
				}
			}
			player.render ();
			ctx.restore ();
		};
		window.requestNextAnimationFrame (render);
		__pragma__ ('<use>' +
			'math' +
		'</use>')
		__pragma__ ('<all>')
			__all__.BROWN = BROWN;
			__all__.GREEN = GREEN;
			__all__.Player = Player;
			__all__.acos = acos;
			__all__.acosh = acosh;
			__all__.asin = asin;
			__all__.asinh = asinh;
			__all__.atan = atan;
			__all__.atan2 = atan2;
			__all__.atanh = atanh;
			__all__.canvas = canvas;
			__all__.ceil = ceil;
			__all__.check = check;
			__all__.cos = cos;
			__all__.cosh = cosh;
			__all__.ctx = ctx;
			__all__.debug = debug;
			__all__.degrees = degrees;
			__all__.dps = dps;
			__all__.e = e;
			__all__.exp = exp;
			__all__.expm1 = expm1;
			__all__.floor = floor;
			__all__.height = height;
			__all__.hexagon = hexagon;
			__all__.hypot = hypot;
			__all__.i = i;
			__all__.inf = inf;
			__all__.keydown_event = keydown_event;
			__all__.log = log;
			__all__.log10 = log10;
			__all__.log1p = log1p;
			__all__.log2 = log2;
			__all__.mouse_event = mouse_event;
			__all__.mouse_x = mouse_x;
			__all__.mouse_y = mouse_y;
			__all__.nan = nan;
			__all__.padd = padd;
			__all__.pi = pi;
			__all__.player = player;
			__all__.pow = pow;
			__all__.prmul = prmul;
			__all__.radians = radians;
			__all__.radius = radius;
			__all__.radius1 = radius1;
			__all__.render = render;
			__all__.sin = sin;
			__all__.sinh = sinh;
			__all__.sqrt = sqrt;
			__all__.status = status;
			__all__.tan = tan;
			__all__.tanh = tanh;
			__all__.theta = theta;
			__all__.trunc = trunc;
			__all__.width = width;
		__pragma__ ('</all>')
	}) ();
