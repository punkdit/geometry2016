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
		var padd = function (p, q) {
			return tuple ([p [0] + q [0], p [1] + q [1]]);
		};
		var psub = function (p, q) {
			return tuple ([p [0] - q [0], p [1] - q [1]]);
		};
		var prmul = function (s, p) {
			return tuple ([s * p [0], s * p [1]]);
		};
		var pnorm = function (p) {
			return Math.pow (Math.pow (p [0], 2) + Math.pow (p [1], 2), 0.5);
		};
		var pdist = function (p, q) {
			return pnorm (psub (p, q));
		};
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
			} ());
		};
		var check = function (result, message) {
			if (!(result)) {
				debug (message);
			}
		};
		var Graphic = __class__ ('Graphic', [object], {
			get __init__ () {return __get__ (this, function (self, canvas, colour) {
				self.canvas = canvas;
				self.ctx = canvas.ctx;
				self.children = list ([]);
				self.colour = colour;
				self.highlight = false;
				canvas.items.add (self);
			});},
			get distance () {return __get__ (this, function (self, x, y) {
				return 99999;
			});}
		});
		var HIGHTLIGHT = 'orange';
		var EXPAND = 2.0;
		var Line = __class__ ('Line', [Graphic], {
			get __init__ () {return __get__ (this, function (self, canvas, x0, y0, x1, y1, width, colour) {
				if (typeof width == 'undefined' || (width != null && width .__class__ == __kwargdict__)) {;
					var width = 1.0;
				};
				if (typeof colour == 'undefined' || (colour != null && colour .__class__ == __kwargdict__)) {;
					var colour = 'black';
				};
				self.c0 = tuple ([x0, y0]);
				self.c1 = tuple ([x1, y1]);
				self.width = width;
				Graphic.__init__ (self, canvas, colour);
			});},
			get render () {return __get__ (this, function (self) {
				var ctx = self.ctx;
				if (self.highlight) {
					ctx.strokeStyle = HIGHTLIGHT;
					ctx.lineWidth = EXPAND * self.width;
					ctx.beginPath ();
					ctx.moveTo (self.c0 [0], self.c0 [1]);
					ctx.lineTo (self.c1 [0], self.c1 [1]);
					ctx.stroke ();
				}
				ctx.strokeStyle = self.colour;
				ctx.lineWidth = self.width;
				ctx.beginPath ();
				ctx.moveTo (self.c0 [0], self.c0 [1]);
				ctx.lineTo (self.c1 [0], self.c1 [1]);
				ctx.stroke ();
			});},
			get distance () {return __get__ (this, function (self, x, y) {
				var p = tuple ([x, y]);
				var __left0__ = tuple ([self.c0, self.c1]);
				var c0 = __left0__ [0];
				var c1 = __left0__ [1];
				var r = pdist (c0, c1);
				var a = pdist (c0, p);
				var b = pdist (c1, p);
				return (1.0 + (a + b)) - r;
			});}
		});
		var Circle = __class__ ('Circle', [Graphic], {
			get __init__ () {return __get__ (this, function (self, canvas, x, y, r, width, colour) {
				if (typeof width == 'undefined' || (width != null && width .__class__ == __kwargdict__)) {;
					var width = 1.0;
				};
				if (typeof colour == 'undefined' || (colour != null && colour .__class__ == __kwargdict__)) {;
					var colour = 'black';
				};
				self.c = tuple ([x, y]);
				self.r = r;
				self.width = width;
				Graphic.__init__ (self, canvas, colour);
			});},
			get render () {return __get__ (this, function (self) {
				var ctx = self.ctx;
				if (self.highlight) {
					ctx.strokeStyle = HIGHTLIGHT;
					ctx.lineWidth = EXPAND * self.width;
					ctx.beginPath ();
					ctx.arc (self.c [0], self.c [1], self.r, 0, 2 * pi);
					ctx.stroke ();
				}
				ctx.strokeStyle = self.colour;
				ctx.lineWidth = self.width;
				ctx.beginPath ();
				ctx.arc (self.c [0], self.c [1], self.r, 0, 2 * pi);
				ctx.stroke ();
			});},
			get distance () {return __get__ (this, function (self, x, y) {
				var r = pdist (self.c, tuple ([x, y]));
				return 0.5 * abs (r - self.r);
			});}
		});
		var Text = __class__ ('Text', [Graphic], {
			get __init__ () {return __get__ (this, function (self, canvas, x, y, text) {
				self.x = x;
				self.y = y;
				self.text = text;
				Graphic.__init__ (self, canvas, 'black');
			});},
			get render () {return __get__ (this, function (self) {
				var ctx = self.ctx;
				ctx.font = '48px serif';
				ctx.fillStyle = self.colour;
				ctx.fillText (self.text, self.x, self.y);
			});}
		});
		var Disc = __class__ ('Disc', [Circle], {
			get render () {return __get__ (this, function (self) {
				var ctx = self.ctx;
				if (self.highlight) {
					ctx.fillStyle = HIGHTLIGHT;
					ctx.beginPath ();
					ctx.arc (self.c [0], self.c [1], (0.8 * EXPAND) * self.r, 0, 2 * pi);
					ctx.fill ();
				}
				ctx.fillStyle = self.colour;
				ctx.beginPath ();
				ctx.arc (self.c [0], self.c [1], self.r, 0, 2 * pi);
				ctx.fill ();
			});},
			get distance () {return __get__ (this, function (self, x, y) {
				var r = pdist (self.c, tuple ([x, y]));
				if (r > self.r) {
					return r - self.r;
				}
				return 0.0;
			});}
		});
		var Rectangle = __class__ ('Rectangle', [Graphic], {
			get __init__ () {return __get__ (this, function (self, canvas, x, y, w, h, colour) {
				self.x = x;
				self.y = y;
				self.w = w;
				self.h = h;
				Graphic.__init__ (self, canvas, colour);
			});},
			get render () {return __get__ (this, function (self) {
				var ctx = self.ctx;
				ctx.fillStyle = self.colour;
				ctx.beginPath ();
				ctx.rect (self.x, self.y, self.w, self.h);
				ctx.fill ();
			});}
		});
		var Canvas = __class__ ('Canvas', [object], {
			get __init__ () {return __get__ (this, function (self, py_name, offset) {
				if (typeof py_name == 'undefined' || (py_name != null && py_name .__class__ == __kwargdict__)) {;
					var py_name = 'canvas';
				};
				if (typeof offset == 'undefined' || (offset != null && offset .__class__ == __kwargdict__)) {;
					var offset = tuple ([0, 0]);
				};
				var canvas = document.getElementById (py_name);
				self.width = canvas.width;
				self.height = canvas.height;
				self.ctx = canvas.getContext ('2d');
				self.offset = offset;
				self.items = list ([]);
				canvas.addEventListener ('mousedown', self.mouse_event, false);
			});},
			get mouse_event () {return __get__ (this, function (self, e) {
				var mouse_x = e.offsetX;
				var mouse_y = e.offsetY;
				window.requestNextAnimationFrame (self.render);
				var __iterable0__ = self.items;
				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
					var item = __iterable0__ [__index0__];
					item.highlight = false;
				}
				var item = self.hit (mouse_x, mouse_y);
				if (item === null) {
					return ;
				}
				if (len (item.children)) {
					var __iterable0__ = item.children;
					for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
						var child = __iterable0__ [__index0__];
						child.highlight = true;
					}
				}
				item.highlight = true;
			});},
			get translate () {return __get__ (this, function (self, dx, dy) {
				self.offset = padd (self.offset, tuple ([dx, dy]));
			});},
			get line () {return __get__ (this, function (self, x0, y0, x1, y1, width, colour) {
				if (typeof width == 'undefined' || (width != null && width .__class__ == __kwargdict__)) {;
					var width = 1.0;
				};
				if (typeof colour == 'undefined' || (colour != null && colour .__class__ == __kwargdict__)) {;
					var colour = 'black';
				};
				var __left0__ = self.offset;
				var dx = __left0__ [0];
				var dy = __left0__ [1];
				var line = Line (self, x0 + dx, y0 + dy, x1 + dx, y1 + dy, width, colour);
				return line;
			});},
			get circle () {return __get__ (this, function (self, x, y, r, width, colour) {
				if (typeof width == 'undefined' || (width != null && width .__class__ == __kwargdict__)) {;
					var width = 1.0;
				};
				if (typeof colour == 'undefined' || (colour != null && colour .__class__ == __kwargdict__)) {;
					var colour = 'black';
				};
				var __left0__ = self.offset;
				var dx = __left0__ [0];
				var dy = __left0__ [1];
				return Circle (self, x + dx, y + dy, r, width, colour);
			});},
			get disc () {return __get__ (this, function (self, x, y, r, colour) {
				if (typeof colour == 'undefined' || (colour != null && colour .__class__ == __kwargdict__)) {;
					var colour = 'black';
				};
				var __left0__ = self.offset;
				var dx = __left0__ [0];
				var dy = __left0__ [1];
				return Disc (self, x + dx, y + dy, r, width, colour);
			});},
			get rectangle () {return __get__ (this, function (self, x, y, w, h, colour) {
				var __left0__ = self.offset;
				var dx = __left0__ [0];
				var dy = __left0__ [1];
				return Rectangle (self, x + dx, y + dy, w, h, colour);
			});},
			get text () {return __get__ (this, function (self, x, y, text) {
				var __left0__ = self.offset;
				var dx = __left0__ [0];
				var dy = __left0__ [1];
				return Text (self, x + dx, y + dy, text);
			});},
			get render () {return __get__ (this, function (self) {
				var ctx = self.ctx;
				var __left0__ = tuple ([self.width, self.height]);
				var width = __left0__ [0];
				var height = __left0__ [1];
				ctx.clearRect (0, 0, width, height);
				ctx.save ();
				ctx.translate (width / 2, height / 2);
				var __iterable0__ = self.items;
				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
					var item = __iterable0__ [__index0__];
					item.render (ctx);
				}
				ctx.restore ();
			});},
			get hit () {return __get__ (this, function (self, x, y) {
				var items = self.items;
				if (!(items)) {
					return null;
				}
				var __left0__ = tuple ([self.width, self.height]);
				var width = __left0__ [0];
				var height = __left0__ [1];
				x -= width / 2;
				y -= height / 2;
				var best = null;
				var r = 20;
				var __iterable0__ = items;
				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
					var item = __iterable0__ [__index0__];
					var r1 = item.distance (x, y);
					if (r1 < r) {
						var best = item;
						var r = r1;
					}
				}
				return best;
			});}
		});
		var Flag = __class__ ('Flag', [object], {
			get __init__ () {return __get__ (this, function (self, line) {
				self.line = line;
				self.point = null;
			});}
		});
		var POINT = 'ForestGreen';
		var LINE = 'FireBrick';
		var SURFACE = 'SteelBlue';
		var render_flag = function () {
			var canvas = Canvas ('canvas-flag');
			var __left0__ = tuple ([canvas.width, canvas.height]);
			var width = __left0__ [0];
			var height = __left0__ [1];
			var R = 0.4 * height;
			var r = 10;
			canvas.rectangle (0, -(R), 1.3 * R, 1.0 * R, SURFACE);
			canvas.line (0, -(R), 0, +(R), 5, LINE);
			canvas.disc (0, -(R), r, POINT);
			canvas.render ();
		};
		render_flag ();
		var fano_chambers = function () {
			var canvas = Canvas ('canvas-fano-chambers');
			var __left0__ = tuple ([canvas.width, canvas.height]);
			var width = __left0__ [0];
			var height = __left0__ [1];
			var R = 0.22 * height;
			var R1 = R / cos (pi / 3);
			var R2 = R * tan (pi / 3);
			var r = 10;
			canvas.translate (-(0.25) * width, 0.0);
			var L1 = canvas.circle (0, 0, R, 5, LINE);
			var L2 = canvas.line (0, -(R1), R2, R, 5, LINE);
			var L3 = canvas.line (R2, R, -(R2), R, 5, LINE);
			var L4 = canvas.line (-(R2), R, 0, -(R1), 5, LINE);
			var theta = pi / 2;
			var L5 = canvas.line (R * cos (theta), R * sin (theta), R1 * cos (theta + pi), R1 * sin (theta + pi), 5, LINE);
			var P1 = canvas.disc (R * cos (theta), R * sin (theta), r, POINT);
			var P2 = canvas.disc (R1 * cos (theta + pi), R1 * sin (theta + pi), r, POINT);
			theta += (2 * pi) / 3;
			var L6 = canvas.line (R * cos (theta), R * sin (theta), R1 * cos (theta + pi), R1 * sin (theta + pi), 5, LINE);
			var P3 = canvas.disc (R * cos (theta), R * sin (theta), r, POINT);
			var P4 = canvas.disc (R1 * cos (theta + pi), R1 * sin (theta + pi), r, POINT);
			theta += (2 * pi) / 3;
			var L7 = canvas.line (R * cos (theta), R * sin (theta), R1 * cos (theta + pi), R1 * sin (theta + pi), 5, LINE);
			var P5 = canvas.disc (R * cos (theta), R * sin (theta), r, POINT);
			var P6 = canvas.disc (R1 * cos (theta + pi), R1 * sin (theta + pi), r, POINT);
			var P7 = canvas.disc (0, 0, r, POINT);
			var points = list ([P7, P4, P6, P3, P1, P2, P5]);
			var lines = list ([L7, L6, L3, L4, L1, L5, L2]);
			canvas.text (-(100), 0.4 * height, 'Geometry');
			var R = 0.35 * height;
			canvas.translate (+(0.5) * width, -(0.1) * height);
			var dtheta = (2 * pi) / 14;
			var theta = (3 * pi) / 2;
			for (var i = 0; i < 14; i++) {
				var item = canvas.line (R * cos (theta), R * sin (theta), R * cos (theta - dtheta), R * sin (theta - dtheta), 5.0);
				if (__mod__ (i, 2) == 0) {
					item.children.append (points [i / 2]);
					item.children.append (lines [i / 2]);
				}
				else {
					item.children.append (points [(i - 1) / 2]);
					item.children.append (lines [__mod__ ((i + 1) / 2, 7)]);
				}
				if (__mod__ (i, 2) == 0) {
					var item = canvas.line (R * cos (theta), R * sin (theta), R * cos (theta + 9 * dtheta), R * sin (theta + 9 * dtheta), 5.0);
					item.children.append (points [__mod__ ((i + 4) / 2, 7)]);
					item.children.append (lines [i / 2]);
				}
				theta -= dtheta;
			}
			var theta = pi / 2;
			for (var i = 0; i < 7; i++) {
				var item = canvas.disc (R * cos (theta), -(R) * sin (theta), r, LINE);
				item.children.append (lines [i]);
				lines [i].children.append (item);
				theta += dtheta;
				var item = canvas.disc (R * cos (theta), -(R) * sin (theta), r, POINT);
				item.children.append (points [i]);
				points [i].children.append (item);
				theta += dtheta;
			}
			canvas.text (-(100), 0.5 * height, 'Incidence');
			canvas.render ();
		};
		fano_chambers ();
		var fano_appartment = function () {
			var canvas = Canvas ('canvas-fano-appartment');
			var __left0__ = tuple ([canvas.width, canvas.height]);
			var width = __left0__ [0];
			var height = __left0__ [1];
			var R = 0.4 * height;
			var r = 10;
			canvas.translate (-(0.25) * width, -(0.1) * height);
			var pts = list ([]);
			var theta = (3 * pi) / 12.0 + pi / 2.0;
			var dtheta = (2 * pi) / 12.0;
			for (var i = 0; i < 12; i++) {
				var x = R * cos (theta);
				var y = -(R) * sin (theta);
				pts.append (tuple ([x, y]));
				theta += dtheta;
			}
			var __left0__ = tuple ([pts [0], pts [7]]);
			var p = __left0__ [0];
			var q = __left0__ [1];
			var L1 = canvas.line (p [0], p [1], q [0], q [1], 5, LINE);
			var __left0__ = tuple ([pts [3], pts [8]]);
			var p = __left0__ [0];
			var q = __left0__ [1];
			var L2 = canvas.line (p [0], p [1], q [0], q [1], 5, LINE);
			var __left0__ = tuple ([pts [4], pts [11]]);
			var p = __left0__ [0];
			var q = __left0__ [1];
			var L3 = canvas.line (p [0], p [1], q [0], q [1], 5, LINE);
			var R1 = 0.5 * R;
			var theta = pi / 2.0 + pi / 6.0;
			var P1 = canvas.disc (R1 * cos (theta), -(R1) * sin (theta), r, POINT);
			theta += (2 * pi) / 3;
			var P2 = canvas.disc (R1 * cos (theta), -(R1) * sin (theta), r, POINT);
			theta += (2 * pi) / 3;
			var P3 = canvas.disc (R1 * cos (theta), -(R1) * sin (theta), r, POINT);
			canvas.text (-(100), 0.5 * height, 'Geometry');
			var R = 0.35 * height;
			canvas.translate (+(0.5) * width, -(0.0) * height);
			var pts = list ([]);
			var theta = pi / 2.0 + pi / 6.0;
			for (var i = 0; i < 6; i++) {
				var x = R1 * cos (theta);
				var y = -(R1) * sin (theta);
				pts.append (tuple ([x, y]));
				theta += (2 * pi) / 6.0;
			}
			var points = list ([P1, P2, P2, P3, P3, P1]);
			var lines = list ([L3, L3, L2, L2, L1, L1]);
			for (var i = 0; i < 6; i++) {
				var p = pts [i];
				var q = pts [__mod__ (i + 1, 6)];
				var item = canvas.line (p [0], p [1], q [0], q [1], 5.0);
				item.children.append (points [i]);
				item.children.append (lines [i]);
			}
			for (var i = 0; i < 6; i++) {
				var p = pts [i];
				if (__mod__ (i, 2) == 0) {
					var item = canvas.disc (p [0], p [1], r, POINT);
					item.children.append (points [i]);
					points [i].children.append (item);
				}
				else {
					var item = canvas.disc (p [0], p [1], r, LINE);
					item.children.append (lines [i]);
					lines [i].children.append (item);
				}
			}
			canvas.text (-(100), 0.5 * height, 'Incidence');
			canvas.render ();
		};
		fano_appartment ();
		var canvas = document.getElementById ('canvas-fano');
		var width = canvas.width;
		var height = canvas.height;
		var ctx = canvas.getContext ('2d');
		var POINT = 'ForestGreen';
		var LINE = 'FireBrick';
		var render_fano = function (ctx) {
			ctx.fillStyle = POINT;
			ctx.strokeStyle = LINE;
			ctx.lineWidth = 5;
			var offset = tuple ([width / 2, height / 2]);
			ctx.save ();
			ctx.translate (offset [0], 1.3 * offset [1]);
			var R = width / 8.0;
			var R1 = R / cos (pi / 3);
			var R2 = R * tan (pi / 3);
			var r = 10;
			ctx.beginPath ();
			ctx.arc (0, 0, R, 0, 2 * pi);
			ctx.stroke ();
			ctx.beginPath ();
			ctx.moveTo (0, -(R1));
			ctx.lineTo (R2, R);
			ctx.lineTo (-(R2), R);
			ctx.closePath ();
			ctx.stroke ();
			var theta = pi / 2;
			for (var i = 0; i < 3; i++) {
				ctx.beginPath ();
				ctx.moveTo (R * cos (theta), R * sin (theta));
				ctx.lineTo (R1 * cos (theta + pi), R1 * sin (theta + pi));
				ctx.stroke ();
				ctx.beginPath ();
				ctx.arc (R * cos (theta), R * sin (theta), r, 0, 2 * pi);
				ctx.fill ();
				ctx.beginPath ();
				ctx.arc (R1 * cos (theta + pi), R1 * sin (theta + pi), r, 0, 2 * pi);
				ctx.fill ();
				theta += (2 * pi) / 3;
			}
			ctx.beginPath ();
			ctx.arc (0, 0, r, 0, 2 * pi);
			ctx.fill ();
			ctx.restore ();
		};
		render_fano (ctx);
		var canvas = document.getElementById ('canvas-chambers');
		var width = canvas.width;
		var height = canvas.height;
		var ctx = canvas.getContext ('2d');
		var render_chambers = function (ctx) {
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 5;
			var offset = tuple ([width / 2, height / 2]);
			ctx.save ();
			ctx.translate (offset [0], 1.0 * offset [1]);
			var R = 0.44 * width;
			var r = 10;
			var theta = pi / 2;
			var dtheta = (2 * pi) / 14;
			for (var i = 0; i < 14; i++) {
				ctx.beginPath ();
				ctx.moveTo (R * cos (theta), R * sin (theta));
				ctx.lineTo (R * cos (theta + dtheta), R * sin (theta + dtheta));
				ctx.stroke ();
				theta += dtheta;
			}
			var theta = pi / 2;
			for (var i = 0; i < 7; i++) {
				ctx.beginPath ();
				ctx.moveTo (R * cos (theta), -(R) * sin (theta));
				ctx.lineTo (R * cos (theta + 5 * dtheta), -(R) * sin (theta + 5 * dtheta));
				ctx.stroke ();
				theta += dtheta;
				ctx.beginPath ();
				ctx.moveTo (R * cos (theta), -(R) * sin (theta));
				ctx.lineTo (R * cos (theta - 5 * dtheta), -(R) * sin (theta - 5 * dtheta));
				ctx.stroke ();
				theta += dtheta;
			}
			var theta = pi / 2;
			for (var i = 0; i < 7; i++) {
				ctx.fillStyle = LINE;
				ctx.beginPath ();
				ctx.arc (R * cos (theta), -(R) * sin (theta), r, 0, 2 * pi);
				ctx.fill ();
				theta += dtheta;
				ctx.fillStyle = POINT;
				ctx.beginPath ();
				ctx.arc (R * cos (theta), -(R) * sin (theta), r, 0, 2 * pi);
				ctx.fill ();
				theta += dtheta;
			}
			ctx.restore ();
		};
		render_chambers (ctx);
		var GREEN = 'forestgreen';
		var BROWN = 'peru';
		var canvas = document.getElementById ('canvas-thin');
		var width = canvas.width;
		var height = canvas.height;
		var offset = tuple ([width / 2, height / 2]);
		var ctx = canvas.getContext ('2d');
		var mouse_x = 0.5 * width;
		var mouse_y = 0.5 * height;
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
		var radius = 50;
		var radius1 = 0.95 * radius;
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
				self.word = '';
				canvas.addEventListener ('keydown', self.keydown_event, false);
			});},
			get render () {return __get__ (this, function (self) {
				var __left0__ = self.point;
				var x = __left0__ [0];
				var y = __left0__ [1];
				ctx.fillStyle = SURFACE;
				var __left0__ = dps [__mod__ (self.line + self.face, 6)];
				var dx = __left0__ [0];
				var dy = __left0__ [1];
				hexagon (x + dx, y + dy, radius1);
				ctx.strokeStyle = LINE;
				ctx.lineWidth = 5;
				ctx.beginPath ();
				ctx.moveTo (x, y);
				check ((0 <= self.line && self.line < 6), 'line = {}'.format (str (self.line)));
				var __left0__ = dps [self.line];
				var dx = __left0__ [0];
				var dy = __left0__ [1];
				ctx.lineTo (x + dx, y + dy);
				ctx.stroke ();
				var r = 8;
				ctx.fillStyle = POINT;
				ctx.beginPath ();
				ctx.arc (x, y, r, 0.0, 2 * pi);
				ctx.fill ();
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
				var word = self.word;
				if (e.key == 'j') {
					self.send_point ();
					var word = 'J' + word;
				}
				else {
					if (e.key == 'k') {
						self.send_line ();
						var word = 'K' + word;
					}
					else {
						if (e.key == 'l') {
							self.send_face ();
							var word = 'L' + word;
						}
					}
				}
				status (word);
				self.word = word;
				window.requestNextAnimationFrame (render);
			});}
		});
		var player = Player ();
		var state = 'paused';
		var render = function (time) {
			ctx.clearRect (0, 0, width, height);
			ctx.save ();
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
			if (state == 'paused') {
				render_paused (ctx);
			}
			else {
				ctx.globalAlpha = 1.0;
			}
		};
		var render_paused = function (ctx) {
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = 'black';
			ctx.beginPath ();
			ctx.rect (0, 0, width, height);
			ctx.fill ();
			ctx.save ();
			ctx.translate (offset [0], offset [1]);
			ctx.globalAlpha = 1.0;
			ctx.beginPath ();
			ctx.arc (0, 0, 70, 0, 2 * pi);
			ctx.fill ();
			ctx.globalAlpha = 1.0;
			ctx.lineWidth = 10;
			ctx.strokeStyle = 'white';
			ctx.fillStyle = 'white';
			ctx.beginPath ();
			ctx.arc (0, 0, 50, 0, 2 * pi);
			ctx.stroke ();
			ctx.beginPath ();
			ctx.moveTo (20, 0);
			ctx.lineTo (-(10), 20);
			ctx.lineTo (-(10), -(20));
			ctx.closePath ();
			ctx.fill ();
			ctx.restore ();
		};
		var mouse_event = function (e) {
			mouse_x = e.offsetX;
			mouse_y = e.offsetY;
			state = 'playing';
			ctx.globalAlpha = 1.0;
			window.requestNextAnimationFrame (render);
		};
		canvas.addEventListener ('mousedown', mouse_event, false);
		window.requestNextAnimationFrame (render);
		__pragma__ ('<use>' +
			'math' +
		'</use>')
		__pragma__ ('<all>')
			__all__.BROWN = BROWN;
			__all__.Canvas = Canvas;
			__all__.Circle = Circle;
			__all__.Disc = Disc;
			__all__.EXPAND = EXPAND;
			__all__.Flag = Flag;
			__all__.GREEN = GREEN;
			__all__.Graphic = Graphic;
			__all__.HIGHTLIGHT = HIGHTLIGHT;
			__all__.LINE = LINE;
			__all__.Line = Line;
			__all__.POINT = POINT;
			__all__.Player = Player;
			__all__.Rectangle = Rectangle;
			__all__.SURFACE = SURFACE;
			__all__.Text = Text;
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
			__all__.fano_appartment = fano_appartment;
			__all__.fano_chambers = fano_chambers;
			__all__.floor = floor;
			__all__.height = height;
			__all__.hexagon = hexagon;
			__all__.hypot = hypot;
			__all__.i = i;
			__all__.inf = inf;
			__all__.log = log;
			__all__.log10 = log10;
			__all__.log1p = log1p;
			__all__.log2 = log2;
			__all__.mouse_event = mouse_event;
			__all__.mouse_x = mouse_x;
			__all__.mouse_y = mouse_y;
			__all__.nan = nan;
			__all__.offset = offset;
			__all__.padd = padd;
			__all__.pdist = pdist;
			__all__.pi = pi;
			__all__.player = player;
			__all__.pnorm = pnorm;
			__all__.pow = pow;
			__all__.prmul = prmul;
			__all__.psub = psub;
			__all__.radians = radians;
			__all__.radius = radius;
			__all__.radius1 = radius1;
			__all__.render = render;
			__all__.render_chambers = render_chambers;
			__all__.render_fano = render_fano;
			__all__.render_flag = render_flag;
			__all__.render_paused = render_paused;
			__all__.sin = sin;
			__all__.sinh = sinh;
			__all__.sqrt = sqrt;
			__all__.state = state;
			__all__.status = status;
			__all__.tan = tan;
			__all__.tanh = tanh;
			__all__.theta = theta;
			__all__.trunc = trunc;
			__all__.width = width;
		__pragma__ ('</all>')
	}) ();
