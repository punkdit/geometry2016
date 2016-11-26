"use strict";
// Transcrypt'ed from Python, 2016-11-26 14:02:16
function geometry () {
	var __symbols__ = ['__esv5__'];
	var __all__ = {};
	var __world__ = __all__;
	
	// Nested object creator, part of the nesting may already exist and have attributes
	var __nest__ = function (headObject, tailNames, value) {
		// In some cases this will be a global object, e.g. 'window'
		var current = headObject;
		
		if (tailNames != '') {	// Split on empty string doesn't give empty list
			// Find the last already created object in tailNames
			var tailChain = tailNames.split ('.');
			var firstNewIndex = tailChain.length;
			for (var index = 0; index < tailChain.length; index++) {
				if (!current.hasOwnProperty (tailChain [index])) {
					firstNewIndex = index;
					break;
				}
				current = current [tailChain [index]];
			}
			
			// Create the rest of the objects, if any
			for (var index = firstNewIndex; index < tailChain.length; index++) {
				current [tailChain [index]] = {};
				current = current [tailChain [index]];
			}
		}
		
		// Insert it new attributes, it may have been created earlier and have other attributes
		for (var attrib in value) {
			current [attrib] = value [attrib];			
		}		
	};
	__all__.__nest__ = __nest__;
	
	// Initialize module if not yet done and return its globals
	var __init__ = function (module) {
		if (!module.__inited__) {
			module.__all__.__init__ (module.__all__);
			module.__inited__ = true;
		}
		return module.__all__;
	};
	__all__.__init__ = __init__;
	
	// Since we want to assign functions, a = b.f should make b.f produce a bound function
	// So __get__ should be called by a property rather then a function
	// Factory __get__ creates one of three curried functions for func
	// Which one is produced depends on what's to the left of the dot of the corresponding JavaScript property
	var __get__ = function (self, func, quotedFuncName) {
		if (self) {
			if (self.hasOwnProperty ('__class__') || typeof self == 'string' || self instanceof String) {			// Object before the dot
				if (quotedFuncName) {									// Memoize call since fcall is on, by installing bound function in instance
					Object.defineProperty (self, quotedFuncName, {		// Will override the non-own property, next time it will be called directly
						value: function () {							// So next time just call curry function that calls function
							var args = [] .slice.apply (arguments);
							return func.apply (null, [self] .concat (args));
						},				
						writable: true,
						enumerable: true,
						configurable: true
					});
				}
				return function () {									// Return bound function, code dupplication for efficiency if no memoizing
					var args = [] .slice.apply (arguments);				// So multilayer search prototype, apply __get__, call curry func that calls func
					return func.apply (null, [self] .concat (args));
				};
			}
			else {														// Class before the dot
				return func;											// Return static method
			}
		}
		else {															// Nothing before the dot
			return func;												// Return free function
		}
	}
	__all__.__get__ = __get__;
			
	// Mother of all metaclasses		
	var py_metatype = {
		__name__: 'type',
		__bases__: [],
		
		// Overridable class creation worker
		__new__: function (meta, name, bases, attribs) {
			// Create the class cls, a functor, which the class creator function will return
			var cls = function () {						// If cls is called with arg0, arg1, etc, it calls its __new__ method with [arg0, arg1, etc]
				var args = [] .slice.apply (arguments);	// It has a __new__ method, not yet but at call time, since it is copied from the parent in the loop below
				return cls.__new__ (args);				// Each Python class directly or indirectly derives from object, which has the __new__ method
			};											// If there are no bases in the Python source, the compiler generates [object] for this parameter
			
			// Copy all methods, including __new__, properties and static attributes from base classes to new cls object
			// The new class object will simply be the prototype of its instances
			// JavaScript prototypical single inheritance will do here, since any object has only one class
			// This has nothing to do with Python multiple inheritance, that is implemented explictly in the copy loop below
			for (var index = bases.length - 1; index >= 0; index--) {	// Reversed order, since class vars of first base should win
				var base = bases [index];
				for (var attrib in base) {
					var descrip = Object.getOwnPropertyDescriptor (base, attrib);
					Object.defineProperty (cls, attrib, descrip);
				}
				

			}
			
			// Add class specific attributes to the created cls object
			cls.__metaclass__ = meta;
			cls.__name__ = name;
			cls.__bases__ = bases;
			
			// Add own methods, properties and own static attributes to the created cls object
			for (var attrib in attribs) {
				var descrip = Object.getOwnPropertyDescriptor (attribs, attrib);
				Object.defineProperty (cls, attrib, descrip);
			}
			
					
			// Return created cls object
			return cls;
		}
	};
	py_metatype.__metaclass__ = py_metatype;
	__all__.py_metatype = py_metatype;
	
	// Mother of all classes		
	var object = {
		__init__: function (self) {},
		
		__metaclass__: py_metatype,	// By default, all classes have metaclass type, since they derive from object
		__name__: 'object',
		__bases__: [],
			
		// Object creator function is inherited by all classes (so in principle it could be made global)
		__new__: function (args) {	// Args are just the constructor args		
			// In JavaScript the Python class is the prototype of the Python object
			// In this way methods and static attributes will be available both with a class and an object before the dot
			// The descriptor produced by __get__ will return the right method flavor
			var instance = Object.create (this, {__class__: {value: this, enumerable: true}});
			
			// Call constructor
			this.__init__.apply (null, [instance] .concat (args));
			
			// Return instance
			return instance;
		}	
	};
	__all__.object = object;
	
	// Class creator facade function, calls class creation worker
	var __class__ = function (name, bases, attribs, meta) {			// Parameter meta is optional
		if (meta == undefined) {
			meta = bases [0] .__metaclass__;
		}
				
		return meta.__new__ (meta, name, bases, attribs);
	}
	__all__.__class__ = __class__;
	
	// Define __pragma__ to preserve '<all>' and '</all>', since it's never generated as a function, must be done early, so here
	var __pragma__ = function () {};
	__all__.__pragma__ = __pragma__;
	
		__nest__ (
		__all__,
		'org.transcrypt.__base__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var __Envir__ = __class__ ('__Envir__', [object], {
						get __init__ () {return __get__ (this, function (self) {
							self.transpiler_name = 'transcrypt';
							self.transpiler_version = '3.5.234';
							self.target_subdir = '__javascript__';
						});}
					});
					var __envir__ = __Envir__ ();
					__pragma__ ('<all>')
						__all__.__Envir__ = __Envir__;
						__all__.__envir__ = __envir__;
					__pragma__ ('</all>')
				}
			}
		}
	);
	__nest__ (
		__all__,
		'org.transcrypt.__standard__', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var Exception = __class__ ('Exception', [object], {
						get __init__ () {return __get__ (this, function (self) {
							var kwargs = {};
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											default: kwargs [__attrib0__] = __allkwargs0__ [__attrib0__];
										}
									}
									kwargs.__class__ = null;
								}
								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							self.__args__ = args;
							try {
								self.stack = kwargs.error.stack;
							}
							catch (__except0__) {
								self.stack = 'No stack trace available';
							}
						});},
						get __repr__ () {return __get__ (this, function (self) {
							if (len (self.__args__)) {
								return '{}{}'.format (self.__class__.__name__, repr (tuple (self.__args__)));
							}
							else {
								return '{}()'.format (self.__class__.__name__);
							}
						});},
						get __str__ () {return __get__ (this, function (self) {
							if (len (self.__args__) > 1) {
								return str (tuple (self.__args__));
							}
							else {
								if (len (self.__args__)) {
									return str (self.__args__ [0]);
								}
								else {
									return '';
								}
							}
						});}
					});
					var IterableError = __class__ ('IterableError', [Exception], {
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, "Can't iterate over non-iterable", __kwargdict__ ({error: error}));
						});}
					});
					var StopIteration = __class__ ('StopIteration', [Exception], {
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, 'Iterator exhausted', __kwargdict__ ({error: error}));
						});}
					});
					var ValueError = __class__ ('ValueError', [Exception], {
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, 'Erroneous value', __kwargdict__ ({error: error}));
						});}
					});
					var KeyError = __class__ ('KeyError', [Exception], {
						get __init__ () {return __get__ (this, function (self, error) {
							Exception.__init__ (self, 'Invalid key', __kwargdict__ ({error: error}));
						});}
					});
					var AssertionError = __class__ ('AssertionError', [Exception], {
						get __init__ () {return __get__ (this, function (self, message, error) {
							if (message) {
								Exception.__init__ (self, message, __kwargdict__ ({error: error}));
							}
							else {
								Exception.__init__ (self, __kwargdict__ ({error: error}));
							}
						});}
					});
					var __sort__ = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .__class__ == __kwargdict__)) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .__class__ == __kwargdict__)) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						if (key) {
							iterable.sort ((function __lambda__ (a, b) {
								if (arguments.length) {
									var __ilastarg0__ = arguments.length - 1;
									if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
										var __allkwargs0__ = arguments [__ilastarg0__--];
										for (var __attrib0__ in __allkwargs0__) {
											switch (__attrib0__) {
												case 'a': var a = __allkwargs0__ [__attrib0__]; break;
												case 'b': var b = __allkwargs0__ [__attrib0__]; break;
											}
										}
									}
								}
								else {
								}
								return key (a) > key (b);
							}));
						}
						else {
							iterable.sort ();
						}
						if (reverse) {
							iterable.reverse ();
						}
					};
					var sorted = function (iterable, key, reverse) {
						if (typeof key == 'undefined' || (key != null && key .__class__ == __kwargdict__)) {;
							var key = null;
						};
						if (typeof reverse == 'undefined' || (reverse != null && reverse .__class__ == __kwargdict__)) {;
							var reverse = false;
						};
						if (arguments.length) {
							var __ilastarg0__ = arguments.length - 1;
							if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
								var __allkwargs0__ = arguments [__ilastarg0__--];
								for (var __attrib0__ in __allkwargs0__) {
									switch (__attrib0__) {
										case 'iterable': var iterable = __allkwargs0__ [__attrib0__]; break;
										case 'key': var key = __allkwargs0__ [__attrib0__]; break;
										case 'reverse': var reverse = __allkwargs0__ [__attrib0__]; break;
									}
								}
							}
						}
						else {
						}
						if (py_typeof (iterable) == dict) {
							var result = copy (iterable.py_keys ());
						}
						else {
							var result = copy (iterable);
						}
						__sort__ (result, key, reverse);
						return result;
					};
					var map = function (func, iterable) {
						return function () {
							var __accu0__ = [];
							var __iterable0__ = iterable;
							for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
								var item = __iterable0__ [__index0__];
								__accu0__.append (func (item));
							}
							return __accu0__;
						} ();
					};
					var filter = function (func, iterable) {
						return function () {
							var __accu0__ = [];
							var __iterable0__ = iterable;
							for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
								var item = __iterable0__ [__index0__];
								if (func (item)) {
									__accu0__.append (item);
								}
							}
							return __accu0__;
						} ();
					};
					var __Terminal__ = __class__ ('__Terminal__', [object], {
						get __init__ () {return __get__ (this, function (self) {
							try {
								self.element = document.getElementById ('__terminal__');
							}
							catch (__except0__) {
								self.element = null;
							}
							if (self.element) {
								self.buffer = '';
								self.element.style.overflowX = 'auto';
								self.element.style.boxSizing = 'border-box';
								self.element.style.padding = '5px';
								self.element.innerHTML = '_';
							}
						});},
						get print () {return __get__ (this, function (self) {
							var sep = ' ';
							var end = '\n';
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'sep': var sep = __allkwargs0__ [__attrib0__]; break;
											case 'end': var end = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
								var args = tuple ([].slice.apply (arguments).slice (1, __ilastarg0__ + 1));
							}
							else {
								var args = tuple ();
							}
							var printAsync = function () {
								if (arguments.length) {
									var __ilastarg0__ = arguments.length - 1;
									if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
										var __allkwargs0__ = arguments [__ilastarg0__--];
										for (var __attrib0__ in __allkwargs0__) {
										}
									}
								}
								else {
								}
								if (self.element) {
									self.buffer = '{}{}{}'.format (self.buffer, sep.join (function () {
										var __accu0__ = [];
										var __iterable0__ = args;
										for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
											var arg = __iterable0__ [__index0__];
											__accu0__.append (str (arg));
										}
										return __accu0__;
									} ()), end).__getslice__ (-(4096), null, 1);
									self.element.innerHTML = self.buffer.py_replace ('\n', '<br>');
									self.element.scrollTop = self.element.scrollHeight;
								}
								else {
									console.log (sep.join (function () {
										var __accu0__ = [];
										var __iterable0__ = args;
										for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
											var arg = __iterable0__ [__index0__];
											__accu0__.append (str (arg));
										}
										return __accu0__;
									} ()));
								}
							};
							setTimeout (printAsync, 5);
						});},
						get input () {return __get__ (this, function (self, question) {
							if (arguments.length) {
								var __ilastarg0__ = arguments.length - 1;
								if (arguments [__ilastarg0__] && arguments [__ilastarg0__].__class__ == __kwargdict__) {
									var __allkwargs0__ = arguments [__ilastarg0__--];
									for (var __attrib0__ in __allkwargs0__) {
										switch (__attrib0__) {
											case 'self': var self = __allkwargs0__ [__attrib0__]; break;
											case 'question': var question = __allkwargs0__ [__attrib0__]; break;
										}
									}
								}
							}
							else {
							}
							self.print ('{}_'.format (question), __kwargdict__ ({end: ''}));
							try {
								var answer = window.prompt (question);
							}
							catch (__except0__) {
								var answer = '';
								console.log ('Error: Blocking input not yet implemented outside browser');
							}
							if (hasattr (self, 'buffer')) {
								self.buffer = self.buffer.__getslice__ (0, -(1), 1);
							}
							self.print (answer);
							return answer;
						});}
					});
					var __terminal__ = __Terminal__ ();
					__pragma__ ('<all>')
						__all__.AssertionError = AssertionError;
						__all__.Exception = Exception;
						__all__.IterableError = IterableError;
						__all__.KeyError = KeyError;
						__all__.StopIteration = StopIteration;
						__all__.ValueError = ValueError;
						__all__.__Terminal__ = __Terminal__;
						__all__.__sort__ = __sort__;
						__all__.__terminal__ = __terminal__;
						__all__.filter = filter;
						__all__.map = map;
						__all__.sorted = sorted;
					__pragma__ ('</all>')
				}
			}
		}
	);

	// Initialize non-nested modules __base__ and __standard__ and make its names available directly and via __all__
	// They can't do that itself, because they're regular Python modules
	// The compiler recognizes their names and generates them inline rather than nesting them
	// In this way it isn't needed to import them everywhere
	 	
	// __base__
	
	__nest__ (__all__, '', __init__ (__all__.org.transcrypt.__base__));
	var __envir__ = __all__.__envir__;

	// __standard__
	
	__nest__ (__all__, '', __init__ (__all__.org.transcrypt.__standard__));
	
	var Exception = __all__.Exception;
	var IterableError = __all__.IterableError;
	var StopIteration = __all__.StopIteration;
	var ValueError = __all__.ValueError;
	var AssertionError = __all__.AssertionError;
	
	var __sort__ = __all__.__sort__;
	var sorted = __all__.sorted;
	
	var map = __all__.map;
	var filter = __all__.filter;
	
	__all__.print = __all__.__terminal__.print;
	__all__.input = __all__.__terminal__.input;
	
	var __terminal__ = __all__.__terminal__;
	var print = __all__.print;
	var input = __all__.input;

	// Complete __envir__, that was created in __base__, for non-stub mode
	__envir__.executor_name = __envir__.transpiler_name;
	
	// Make make __main__ available in browser
	var __main__ = {__file__: ''};
	__all__.main = __main__;
	
	// Define current exception, there's at most one exception in the air at any time
	var __except__ = null;
	__all__.__except__ = __except__;
		
	// Define recognizable dictionary for **kwargs parameter
	var __kwargdict__ = function (anObject) {
		anObject.__class__ = __kwargdict__;	// This class needs no __name__
		anObject.constructor = Object;
		return anObject;
	}
	__all__.___kwargdict__ = __kwargdict__;
	
	// Property installer function, no member since that would bloat classes
	var property = function (getter, setter) {	// Returns a property descriptor rather than a property
		if (!setter) {	// ??? Make setter optional instead of dummy?
			setter = function () {};
		}
		return {get: function () {return getter (this)}, set: function (value) {setter (this, value)}, enumerable: true};
	}
	__all__.property = property;
	
	// Assert function, call to it only generated when compiling with --dassert option
	function assert (condition, message) {	// Message may be undefined
		if (!condition) {
			throw AssertionError (message, new Error ());
		}
	}
	
	__all__.assert = assert;
	
	var __merge__ = function (object0, object1) {
		var result = {};
		for (var attrib in object0) {
			result [attrib] = object0 [attrib];
		}
		for (var attrib in object1) {
			result [attrib] = object1 [attrib];
		}
		return result;
	}
	__all__.__merge__ = __merge__;
	
	/* Not needed anymore?
	// Make console.log understand apply
	console.log.apply = function () {
		print ([] .slice.apply (arguments) .slice (1));
	};
	*/

	// Manipulating attributes by name
	
	var dir = function (obj) {
		var aList = [];
		for (var aKey in obj) {
			aList.push (aKey);
		}
		aList.sort ();
		return aList;
	}
	
	var setattr = function (obj, name, value) {
		obj [name] = value;
	};
		
	__all__.setattr = setattr;
	
	var getattr = function (obj, name) {
		return obj [name];
	};
	
	__all__.getattr= getattr
	
	var hasattr = function (obj, name) {
		return name in obj;
	};
	__all__.hasattr = hasattr;
	
	var delattr = function (obj, name) {
		delete obj [name];
	};
	__all__.delattr = (delattr);
	
	// The __in__ function, used to mimic Python's 'in' operator
	// In addition to CPython's semantics, the 'in' operator is also allowed to work on objects, avoiding a counterintuitive separation between Python dicts and JavaScript objects
	// In general many Transcrypt compound types feature a deliberate blend of Python and JavaScript facilities, facilitating efficient integration with JavaScript libraries
	// If only Python objects and Python dicts are dealt with in a certain context, the more pythonic 'hasattr' is preferred for the objects as opposed to 'in' for the dicts
	var __in__ = function (element, container) {
		if (py_typeof (container) == dict) {
			return container.py_keys () .indexOf (element) > -1;                                   // The keys of parameter 'element' are in an array
		}
		else {
			return container.indexOf ? container.indexOf (element) > -1 : element in container; // Parameter 'element' itself is an array, string or object
		}
	}
	__all__.__in__ = __in__;
	
	// Find out if an attribute is special
	var __specialattrib__ = function (attrib) {
		return (attrib.startswith ('__') && attrib.endswith ('__')) || attrib == 'constructor' || attrib.startswith ('py_');
	}
	__all__.__specialattrib__ = __specialattrib__;
		
	// Len function for any object
	var len = function (anObject) {
		if (anObject) {
			var l = anObject.length;
			if (l == undefined) {
				var result = 0;
				for (var attrib in anObject) {
					if (!__specialattrib__ (attrib)) {
						result++;
					}
				}
				return result;
			}
			else {
				return l;
			}
		}
		else {
			return 0;
		}
	}
	__all__.len = len;

	// General conversions
	
	function __i__ (any) {	//	Conversion to iterable
		return py_typeof (any) == dict ? any.py_keys () : any;		
	}
	
	function __t__ (any) {	// Conversion to truthyness, __ ([1, 2, 3]) returns [1, 2, 3], needed for nonempty selection: l = list1 or list2]
		return (['boolean', 'number'] .indexOf (typeof any) >= 0 || any instanceof Function || len (any)) ? any : false;
		// JavaScript functions have a length attribute, denoting the number of parameters
		// Python objects are JavaScript functions, but their length doesn't matter, only their existence
		// By the term 'any instanceof Function' we make sure that Python objects aren't rejected when their length equals zero
	}
	__all__.__t__ = __t__;
	
	var bool = function (any) {		// Always truly returns a bool, rather than something truthy or falsy
		return !!__t__ (any);
	}
	bool.__name__ = 'bool'			// So it can be used as a type with a name
	__all__.bool = bool;
	
	var float = function (any) {
		if (isNaN (any)) {
			throw ValueError (new Error ());
		}
		else {
			return +any;
		}
	}
	float.__name__ = 'float'
	__all__.float = float;
	
	var int = function (any) {
		return float (any) | 0
	}
	int.__name__ = 'int';
	__all__.int = int;
	
	var py_typeof = function (anObject) {
		try {
			var result = anObject.__class__;
			return result;
		}
		catch (exception) {
			var aType = typeof anObject;
			if (aType == 'boolean') {
				return bool;
			}
			else if (aType == 'number') {
				if (anObject % 1 == 0) {
					return int;
				}
				else {
					return float;
				}				
			}
			else {
				return aType;
			}
		}
	}
	__all__.py_typeof = py_typeof;
	
	var isinstance = function (anObject, classinfo) {
		function isA (queryClass) {
			if (queryClass == classinfo) {
				return true;
			}
			for (var index = 0; index < queryClass.__bases__.length; index++) {
				if (isA (queryClass.__bases__ [index], classinfo)) {
					return true;
				}
			}
			return false;
		}
		return '__class__' in anObject ? isA (anObject.__class__) : anObject instanceof classinfo;
	};
	__all__.isinstance = isinstance;
	
	// Repr function uses __repr__ method, then __str__ then toString
	var repr = function (anObject) {
		try {
			return anObject.__repr__ ();
		}
		catch (exception) {
			try {
				return anObject.__str__ ();
			}
			catch (exception) {	// It was a dict in Python, so an Object in JavaScript
				try {
					if (anObject == null) {
						return 'None'
					}
					else if (anObject.constructor == Object) {
						var result = '{';
						var comma = false;
						for (var attrib in anObject) {
							if (!__specialattrib__ (attrib)) {
								if (attrib.isnumeric ()) {
									var attribRepr = attrib;				// If key can be interpreted as numerical, we make it numerical 
								}											// So we accept that '1' is misrepresented as 1
								else {
									var attribRepr = '\'' + attrib + '\'';	// Alpha key in dict
								}
								
								if (comma) {
									result += ', ';
								}
								else {
									comma = true;
								}
								try {
									result += attribRepr + ': ' + anObject [attrib] .__repr__ ();
								}
								catch (exception) {
									result += attribRepr + ': ' + anObject [attrib] .toString ();
								}
							}
						}
						result += '}';
						return result;					
					}
					else {
						return typeof anObject == 'boolean' ? anObject.toString () .capitalize () : anObject.toString ();
					}
				}
				catch (exception) {
					console.log ('ERROR: Could not evaluate repr (<object of type ' + typeof anObject + '>)');
					console.log (exception);
					return '???';
				}
			}
		}
	}
	__all__.repr = repr;
	
	// Char from Unicode or ASCII
	var chr = function (charCode) {
		return String.fromCharCode (charCode);
	}
	__all__.chr = chr;

	// Unicode or ASCII from char
	var ord = function (aChar) {
		return aChar.charCodeAt (0);
	}
	__all__.org = ord;
	
	// Maximum of n numbers
	var max = Math.max;
	__all__.max = max;
	
	// Minimum of n numbers
	var min = Math.min;
	__all__.min = min;
	
	// Absolute value
	var abs = Math.abs;
	__all__.abs = abs;
	
	// Bankers rounding
	var round = function (number, ndigits) {
		if (ndigits) {
			var scale = Math.pow (10, ndigits);
			number *= scale;
		}
			
		var rounded = Math.round (number);
		if (rounded - number == 0.5 && rounded % 2) {	// Has rounded up to odd, should have rounded down to even
			rounded -= 1;
		}
			
		if (ndigits) {
			rounded /= scale;
		}
		
		return rounded
 	}
	__all__.round = round;
		
	// BEGIN unified iterator model
	
	function __jsUsePyNext__ () {		// Add as 'next' method to make Python iterator JavaScript compatible
		try {
			var result = this.__next__ ();
			return {value: result, done: false};
		}
		catch (exception) {
			return {value: undefined, done: true};
		}
	}
	
	function __pyUseJsNext__ () {		// Add as '__next__' method to make JavaScript iterator Python compatible
		var result = this.next ();
		if (result.done) {
			throw StopIteration (new Error ());
		}
		else {
			return result.value;
		}
	}
	
	function py_iter (iterable) {					// Alias for Python's iter function, produces a universal iterator / iterable, usable in Python and JavaScript
		if (typeof iterable == 'string' || '__iter__' in iterable) {	// JavaScript Array or string or Python iterable (string has no 'in')
			var result = iterable.__iter__ ();							// Iterator has a __next__
			result.next = __jsUsePyNext__;								// Give it a next
		}
		else if ('selector' in iterable) { 								// Assume it's a JQuery iterator
			var result = list (iterable) .__iter__ ();					// Has a __next__
			result.next = __jsUsePyNext__;								// Give it a next
		}
		else if ('next' in iterable) {									// It's a JavaScript iterator already,  maybe a generator, has a next and may have a __next__
			var result = iterable
			if (! ('__next__' in result)) {								// If there's no danger of recursion
				result.__next__ = __pyUseJsNext__;						// Give it a __next__
			}
		}
		else if (Symbol.iterator in iterable) {							// It's a JavaScript iterable such as a typed array, but not an iterator
			var result = iterable [Symbol.iterator] ();					// Has a next
			result.__next__ = __pyUseJsNext__;							// Give it a __next__
		}
		else {
			throw IterableError (new Error ());	// No iterator at all
		}
		result [Symbol.iterator] = function () {return result;};
		return result;
	}
	
	function py_next (iterator) {				// Called only in a Python context, could receive Python or JavaScript iterator
		try {									// Primarily assume Python iterator, for max speed
			var result = iterator.__next__ ();
		}
		catch (exception) {						// JavaScript iterators are the exception here
			var result = iterator.next ();
			if (result.done) {
				throw StopIteration (new Error ());
			}
			else {
				return result.value;
			}
		}	
		if (result == undefined) {
			throw StopIteration (new Error ());
		}
		else {
			return result;
		}
	}
		
	function __PyIterator__ (iterable) {
		this.iterable = iterable;
		this.index = 0;
	}
	
	__PyIterator__.prototype.__next__ = function () {
		if (this.index < this.iterable.length) {
			return this.iterable [this.index++];
		}
		else {
			throw StopIteration (new Error ());
		}
	}
	
	function __JsIterator__ (iterable) {
		this.iterable = iterable;
		this.index = 0;
	}

	__JsIterator__.prototype.next = function () {
		if (this.index < this.iterable.py_keys.length) {
			return {value: this.index++, done: false};
		}
		else {
			return {value: undefined, done: true};
		}
	}
	
	// END unified iterator model
	
	// Reversed function for arrays
	var py_reversed = function (iterable) {
		iterable = iterable.slice ();
		iterable.reverse ();
		return iterable;
	}
	__all__.py_reversed = py_reversed;
	
	// Zip method for arrays
	var zip = function () {
		var args = [] .slice.call (arguments);
		var shortest = args.length == 0 ? [] : args.reduce (	// Find shortest array in arguments
			function (array0, array1) {
				return array0.length < array1.length ? array0 : array1;
			}
		);
		return shortest.map (					// Map each element of shortest array
			function (current, index) {			// To the result of this function
				return args.map (				// Map each array in arguments
					function (current) {		// To the result of this function
						return current [index]; // Namely it's index't entry
					}
				);
			}
		);
	}
	__all__.zip = zip;
	
	// Range method, returning an array
	function range (start, stop, step) {
		if (stop == undefined) {
			// one param defined
			stop = start;
			start = 0;
		}
		if (step == undefined) {
			step = 1;
		}
		if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
			return [];
		}
		var result = [];
		for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
			result.push(i);
		}
		return result;
	};
	__all__.range = range;
	
	// Any, all and sum
	
	function any (iterable) {
		for (var index = 0; index < iterable.length; index++) {
			if (bool (iterable [index])) {
				return true;
			}
		}
		return false;
	}
	function all (iterable) {
		for (var index = 0; index < iterable.length; index++) {
			if (! bool (iterable [index])) {
				return false;
			}
		}
		return true;
	}
	function sum (iterable) {
		var result = 0;
		for (var index = 0; index < iterable.length; index++) {
			result += iterable [index];
		}
		return result;
	}

	__all__.any = any;
	__all__.all = all;
	__all__.sum = sum;
	
	// Enumerate method, returning a zipped list
	function enumerate (iterable) {
		return zip (range (len (iterable)), iterable);
	}
	__all__.enumerate = enumerate;
		
	// Shallow and deepcopy
	
	function copy (anObject) {
		if (anObject == null || typeof anObject == "object") {
			return anObject;
		}
		else {
			var result = {}
			for (var attrib in obj) {
				if (anObject.hasOwnProperty (attrib)) {
					result [attrib] = anObject [attrib];
				}
			}
			return result;
		}
	}
	__all__.copy = copy;
	
	function deepcopy (anObject) {
		if (anObject == null || typeof anObject == "object") {
			return anObject;
		}
		else {
			var result = {}
			for (var attrib in obj) {
				if (anObject.hasOwnProperty (attrib)) {
					result [attrib] = deepcopy (anObject [attrib]);
				}
			}
			return result;
		}
	}
	__all__.deepcopy = deepcopy;
		
	// List extensions to Array
	
	function list (iterable) {										// All such creators should be callable without new
		var instance = iterable ? [] .slice.apply (iterable) : [];	// Spread iterable, n.b. array.slice (), so array before dot
		// Sort is the normal JavaScript sort, Python sort is a non-member function
		return instance;
	}
	__all__.list = list;
	Array.prototype.__class__ = list;	// All arrays are lists (not only if constructed by the list ctor), unless constructed otherwise
	list.__name__ = 'list';
	
	/*
	Array.from = function (iterator) { // !!! remove
		result = [];
		for (item of iterator) {
			result.push (item);
		}
		return result;
	}
	*/
	
	Array.prototype.__iter__ = function () {return new __PyIterator__ (this);}
	
	Array.prototype.__getslice__ = function (start, stop, step) {
		if (start < 0) {
			start = this.length + start;
		}
		
		if (stop == null) {
			stop = this.length;
		}
		else if (stop < 0) {
			stop = this.length + stop;
		}
		else if (stop > this.length) {
			stop = this.length;
		}
			
		var result = list ([]);
		for (var index = start; index < stop; index += step) {
			result.push (this [index]);
		}
		
		return result;
	}
		
	Array.prototype.__setslice__ = function (start, stop, step, source) {
		if (start < 0) {
			start = this.length + start;
		}
			
		if (stop == null) {
			stop = this.length;
		}
		else if (stop < 0) {
			stop = this.length + stop;
		}
			
		if (step == null) {	// Assign to 'ordinary' slice, replace subsequence
			Array.prototype.splice.apply (this, [start, stop - start] .concat (source)) 
		}
		else {				// Assign to extended slice, replace designated items one by one
			var sourceIndex = 0;
			for (var targetIndex = start; targetIndex < stop; targetIndex += step) {
				this [targetIndex] = source [sourceIndex++];
			}
		}
	}
	
	Array.prototype.__repr__ = function () {
		if (this.__class__ == set && !this.length) {
			return 'set()';
		}
		
		var result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';
		
		for (var index = 0; index < this.length; index++) {
			if (index) {
				result += ', ';
			}
			try {
				result += this [index] .__repr__ ();
			}
			catch (exception) {
				result += this [index] .toString ();
			}
		}
		
		if (this.__class__ == tuple && this.length == 1) {
			result += ',';
		}
		
		result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';;
		return result;
	};
	
	Array.prototype.__str__ = Array.prototype.__repr__;
	
	Array.prototype.append = function (element) {
		this.push (element);
	};

	Array.prototype.clear = function () {
		this.length = 0;
	};
	
	Array.prototype.extend = function (aList) {
		this.push.apply (this, aList);
	};
	
	Array.prototype.insert = function (index, element) {
		this.splice (index, 0, element);
	};

	Array.prototype.remove = function (element) {
		var index = this.indexOf (element);
		if (index == -1) {
			throw KeyError (new Error ());
		}
		this.splice (index, 1);
	};

	Array.prototype.index = function (element) {
		return this.indexOf (element)
	};
	
	Array.prototype.py_pop = function (index) {
		if (index == undefined) {
			return this.pop ()	// Remove last element
		}
		else {
			return this.splice (index, 1) [0];
		}
	};	
	
	Array.prototype.py_sort = function () {
		__sort__.apply  (null, [this].concat ([] .slice.apply (arguments)));	// Can't work directly with arguments
		// Python params: (iterable, key = None, reverse = False)
		// py_sort is called with the Transcrypt kwargs mechanism, and just passes the params on to __sort__
		// __sort__ is def'ed with the Transcrypt kwargs mechanism
	};
	
	Array.prototype.__add__ = function (aList) {
		return list (this.concat (aList))
	}
	
	Array.prototype.__mul__ = function (scalar) {
		var result = this;
		for (var i = 1; i < scalar; i++) {
			result = result.concat (this);
		}
		return result;
	}
	
	Array.prototype.__rmul__ = Array.prototype.__mul__;
		
	// Tuple extensions to Array
	
	function tuple (iterable) {
		var instance = iterable ? [] .slice.apply (iterable) : [];
		instance.__class__ = tuple;	// Not all arrays are tuples
		return instance;
	}
	__all__.tuple = tuple;
	tuple.__name__ = 'tuple';
	
	// Set extensions to Array
	// N.B. Since sets are unordered, set operations will occasionally alter the 'this' array by sorting it
		
	function set (iterable) {
		var instance = [];
		if (iterable) {
			for (var index = 0; index < iterable.length; index++) {
				instance.add (iterable [index]);
			}
			
			
		}
		instance.__class__ = set;	// Not all arrays are sets
		return instance;
	}
	__all__.set = set;
	set.__name__ = 'set';
	
	Array.prototype.__bindexOf__ = function (element) {	// Used to turn O (n^2) into O (n log n)
	// Since sorting is lex, compare has to be lex. This also allows for mixed lists
	
		element += '';
	
		var mindex = 0;
		var maxdex = this.length - 1;
			 
		while (mindex <= maxdex) {
			var index = (mindex + maxdex) / 2 | 0;
			var middle = this [index] + '';
	 
			if (middle < element) {
				mindex = index + 1;
			}
			else if (middle > element) {
				maxdex = index - 1;
			}
			else {
				return index;
			}
		}
	 
		return -1;
	}
	
	Array.prototype.add = function (element) {		
		if (this.indexOf (element) == -1) {	// Avoid duplicates in set
			this.push (element);
		}
	};
	
	Array.prototype.discard = function (element) {
		var index = this.indexOf (element);
		if (index != -1) {
			this.splice (index, 1);
		}
	};
	
	Array.prototype.isdisjoint = function (other) {
		this.sort ();
		for (var i = 0; i < other.length; i++) {
			if (this.__bindexOf__ (other [i]) != -1) {
				return false;
			}
		}
		return true;
	};
	
	Array.prototype.issuperset = function (other) {
		this.sort ();
		for (var i = 0; i < other.length; i++) {
			if (this.__bindexOf__ (other [i]) == -1) {
				return false;
			}
		}
		return true;
	};
	
	Array.prototype.issubset = function (other) {
		return set (other.slice ()) .issuperset (this);	// Sort copy of 'other', not 'other' itself, since it may be an ordered sequence
	};
	
	Array.prototype.union = function (other) {
		var result = set (this.slice () .sort ());
		for (var i = 0; i < other.length; i++) {
			if (result.__bindexOf__ (other [i]) == -1) {
				result.push (other [i]);
			}
		}
		return result;
	};
	
	Array.prototype.intersection = function (other) {
		this.sort ();
		var result = set ();
		for (var i = 0; i < other.length; i++) {
			if (this.__bindexOf__ (other [i]) != -1) {
				result.push (other [i]);
			}
		}
		return result;
	};
	
	Array.prototype.difference = function (other) {
		var sother = set (other.slice () .sort ());
		var result = set ();
		for (var i = 0; i < this.length; i++) {
			if (sother.__bindexOf__ (this [i]) == -1) {
				result.push (this [i]);
			}
		}
		return result;
	};
	
	Array.prototype.symmetric_difference = function (other) {
		return this.union (other) .difference (this.intersection (other));
	};
	
	Array.prototype.update = function () {	// O (n)
		var updated = [] .concat.apply (this.slice (), arguments) .sort ();		
		this.clear ();
		for (var i = 0; i < updated.length; i++) {
			if (updated [i] != updated [i - 1]) {
				this.push (updated [i]);
			}
		}
	};
	
	Array.prototype.__eq__ = function (other) {	// Also used for list
		if (this.length != other.length) {
			return false;
		}
		if (this.__class__ == set) {
			this.sort ();
			other.sort ();
		}	
		for (var i = 0; i < this.length; i++) {
			if (this [i] != other [i]) {
				return false;
			}
		}
		return true;
	};
	
	Array.prototype.__ne__ = function (other) {	// Also used for list
		return !this.__eq__ (other);
	}
		
	Array.prototype.__le__ = function (other) {
		return this.issubset (other);
	}
		
	Array.prototype.__ge__ = function (other) {
		return this.issuperset (other);
	}
		
	Array.prototype.__lt__ = function (other) {
		return this.issubset (other) && !this.issuperset (other);
	}
		
	Array.prototype.__gt__ = function (other) {
		return this.issuperset (other) && !this.issubset (other);
	}
	
	// String extensions
	
	function str (stringable) {
		try {
			return stringable.__str__ ();
		}
		catch (exception) {
			return new String (stringable);
		}
	}
	__all__.str = str;	
	
	String.prototype.__class__ = str;	// All strings are str
	str.__name__ = 'str';
	
	String.prototype.__iter__ = function () {new __PyIterator__ (this);}
		
	String.prototype.__repr__ = function () {
		return (this.indexOf ('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"') .replace ('\t', '\\t') .replace ('\n', '\\n');
	};
	
	String.prototype.__str__ = function () {
		return this;
	};
	
	String.prototype.capitalize = function () {
		return this.charAt (0).toUpperCase () + this.slice (1);
	};
	
	String.prototype.endswith = function (suffix) {
		return suffix == '' || this.slice (-suffix.length) == suffix;
	};
	
	String.prototype.find  = function (sub, start) {
		return this.indexOf (sub, start);
	};
	
	String.prototype.__getslice__ = function (start, stop, step) {
		if (start < 0) {
			start = this.length + start;
		}
		
		if (stop == null) {
			stop = this.length;
		}
		else if (stop < 0) {
			stop = this.length + stop;
		}
		
		var result = '';
		if (step == 1) {
			result = this.substring (start, stop);
		}
		else {
			for (var index = start; index < stop; index += step) {
				result = result.concat (this.charAt(index));
			}
		}
		return result;
	}
	
	// Since it's worthwhile for the 'format' function to be able to deal with *args, it is defined as a property
	// __get__ will produce a bound function if there's something before the dot
	// Since a call using *args is compiled to e.g. <object>.<function>.apply (null, args), the function has to be bound already
	// Otherwise it will never be, because of the null argument
	// Using 'this' rather than 'null' contradicts the requirement to be able to pass bound functions around
	// The object 'before the dot' won't be available at call time in that case, unless implicitly via the function bound to it
	// While for Python methods this mechanism is generated by the compiler, for JavaScript methods it has to be provided manually
	// Call memoizing is unattractive here, since every string would then have to hold a reference to a bound format method
	Object.defineProperty (String.prototype, 'format', {
		get: function () {return __get__ (this, function (self) {
			var args = tuple ([] .slice.apply (arguments).slice (1));			
			var autoIndex = 0;
			return self.replace (/\{(\w*)\}/g, function (match, key) { 
				if (key == '') {
					key = autoIndex++;
				}
				if (key == +key) {	// So key is numerical
					return args [key] == undefined ? match : args [key];
				}
				else {				// Key is a string
					for (var index = 0; index < args.length; index++) {
						// Find first 'dict' that has that key and the right field
						if (typeof args [index] == 'object' && args [index][key] != undefined) {
							return args [index][key];	// Return that field field
						}
					}
					return match;
				}
			});
		});},
		enumerable: true
	});
	
	String.prototype.isnumeric = function () {
		return !isNaN (parseFloat (this)) && isFinite (this);
	};
	
	String.prototype.join = function (strings) {
		return strings.join (this);
	};
	
	String.prototype.lower = function () {
		return this.toLowerCase ();
	};
	
	String.prototype.py_replace = function (old, aNew, maxreplace) {
		return this.split (old, maxreplace) .join (aNew);
	};
	
	String.prototype.lstrip = function () {
		return this.replace (/^\s*/g, '');
	};
	
	String.prototype.rfind = function (sub, start) {
		return this.lastIndexOf (sub, start);
	};
	
	String.prototype.rsplit = function (sep, maxsplit) {	// Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
		if (sep == undefined || sep == null) {
			sep = /\s+/;
			var stripped = this.strip ();
		}
		else {
			var stripped = this;
		}
			
		if (maxsplit == undefined || maxsplit == -1) {
			return stripped.split (sep);
		}
		else {
			var result = stripped.split (sep);
			if (maxsplit < result.length) {
				var maxrsplit = result.length - maxsplit;
				return [result.slice (0, maxrsplit) .join (sep)] .concat (result.slice (maxrsplit));
			}
			else {
				return result;
			}
		}
	};
	
	String.prototype.rstrip = function () {
		return this.replace (/\s*$/g, '');
	};
	
	String.prototype.py_split = function (sep, maxsplit) {	// Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
		if (sep == undefined || sep == null) {
			sep = /\s+/
			var stripped = this.strip ();
		}
		else {
			var stripped = this;
		}
			
		if (maxsplit == undefined || maxsplit == -1) {
			return stripped.split (sep);
		}
		else {
			var result = stripped.split (sep);
			if (maxsplit < result.length) {
				return result.slice (0, maxsplit).concat ([result.slice (maxsplit).join (sep)]);
			}
			else {
				return result;
			}
		}
	};
	
	String.prototype.startswith = function (prefix) {
		return this.indexOf (prefix) == 0;
	};
	
	String.prototype.strip = function () {
		return this.trim ();
	};
		
	String.prototype.upper = function () {
		return this.toUpperCase ();
	};
	
	String.prototype.__mul__ = function (scalar) {
		var result = this;
		for (var i = 1; i < scalar; i++) {
			result = result + this;
		}
		return result;
	}
	
	String.prototype.__rmul__ = String.prototype.__mul__;

	
	// Dict extensions to object
	
	function __keys__ () {
		var keys = []
		for (var attrib in this) {
			if (!__specialattrib__ (attrib)) {
				keys.push (attrib);
			}     
		}
		return keys;
	}
		
	function __items__ () {
		var items = []
		for (var attrib in this) {
			if (!__specialattrib__ (attrib)) {
				items.push ([attrib, this [attrib]]);
			}     
		}
		return items;
	}
		
	function __del__ (key) {
		delete this [key];
	}
	
	function __clear__ () {
		for (var attrib in this) {
			delete this [attrib];
		}
	}
	
	function __getdefault__ (aKey, aDefault) {	// Each Python object already has a function called __get__, so we call this one __getdefault__
		var result = this [aKey];
		return result == undefined ? (aDefault == undefined ? null : aDefault) : result;
	}
	
	function __setdefault__ (aKey, aDefault) {
		var result = this [aKey];
		if (result != undefined) {
			return result;
		}
		var val = aDefault == undefined ? null : aDefault;
		this [aKey] = val;
		return val;
	}
	
	function __pop__ (aKey, aDefault) {
		var result = this [aKey];
		if (result != undefined) {
			delete this [aKey];
			return result;
		}
		return aDefault;
	}	
	
	function __update__(aDict) {
		for (var aKey in aDict) {
			this [aKey] = aDict [aKey];
		}
	}
	
	function dict (objectOrPairs) {
		if (!objectOrPairs || objectOrPairs instanceof Array) {	// It's undefined or an array of pairs
			var instance = {};
			if (objectOrPairs) {
				for (var index = 0; index < objectOrPairs.length; index++) {
					var pair = objectOrPairs [index];
					instance [pair [0]] = pair [1];
				}
			}
		}
		else {													// It's a JavaScript object literal
			var instance = objectOrPairs;
		}
		
		// Trancrypt interprets e.g. {aKey: 'aValue'} as a Python dict literal rather than a JavaScript object literal
		// So dict literals rather than bare Object literals will be passed to JavaScript libraries
		// Some JavaScript libraries call all enumerable callable properties of an object that's passed to them
		// So the properties of a dict should be non-enumerable
		Object.defineProperty (instance, '__class__', {value: dict, enumerable: false, writable: true});
		Object.defineProperty (instance, 'py_keys', {value: __keys__, enumerable: false});
		Object.defineProperty (instance, '__iter__', {value: function () {new __PyIterator__ (this.py_keys ());}, enumerable: false});
		Object.defineProperty (instance, Symbol.iterator, {value: function () {new __JsIterator__ (this.py_keys ());}, enumerable: false});
		Object.defineProperty (instance, 'items', {value: __items__, enumerable: false});		
		Object.defineProperty (instance, 'del', {value: __del__, enumerable: false});
		Object.defineProperty (instance, 'clear', {value: __clear__, enumerable: false});
		Object.defineProperty (instance, 'get', {value: __getdefault__, enumerable: false});
		Object.defineProperty (instance, 'setdefault', {value: __setdefault__, enumerable: false});
		Object.defineProperty (instance, 'py_pop', {value: __pop__, enumerable: false});
		Object.defineProperty (instance, 'update', {value: __update__, enumerable: false});
		return instance;
	}

	__all__.dict = dict;
	dict.__name__ = 'dict';
		
	// General operator overloading, only the ones that make most sense in matrix and complex operations
	
	var __neg__ = function (a) {
		if (typeof a == 'object' && '__neg__' in a) {
			return a.__neg__ ();
		}
		else {
			return -a;
		}
	};  
	__all__.__neg__ = __neg__;
	
	var __matmul__ = function (a, b) {
		return a.__matmul__ (b);
	};  
	__all__.__matmul__ = __matmul__;
	
	var __pow__ = function (a, b) {
		if (typeof a == 'object' && '__pow__' in a) {
			return a.__pow__ (b);
		}
		else if (typeof b == 'object' && '__rpow__' in b) {
			return b.__rpow__ (a);
		}
		else {
			return Math.pow (a, b);
		}
	};	
	__all__.pow = __pow__;
	
	var __jsmod__ = function (a, b) {
		if (typeof a == 'object' && '__mod__' in a) {
			return a.__mod__ (b);
		}
		else if (typeof b == 'object' && '__rpow__' in b) {
			return b.__rmod__ (a);
		}
		else {
			return a % b;
		}
	}
	
	var __mod__ = function (a, b) {
		if (typeof a == 'object' && '__mod__' in a) {
			return a.__mod__ (b);
		}
		else if (typeof b == 'object' && '__rpow__' in b) {
			return b.__rmod__ (a);
		}
		else {
			return ((a % b) + b) % b;
		}
	};	
	__all__.pow = __pow__;
	
	var __mul__ = function (a, b) {
		if (typeof a == 'object' && '__mul__' in a) {
			return a.__mul__ (b);
		}
		else if (typeof b == 'object' && '__rmul__' in b) {
			return b.__rmul__ (a);
		}
		else if (typeof a == 'string') {
			return a.__mul__ (b);
		}
		else if (typeof b == 'string') {
			return b.__rmul__ (a);
		}
		else {
			return a * b;
		}
	};  
	__all__.__mul__ = __mul__;
	
	var __div__ = function (a, b) {
		if (typeof a == 'object' && '__div__' in a) {
			return a.__div__ (b);
		}
		else if (typeof b == 'object' && '__rdiv__' in b) {
			return b.__rdiv__ (a);
		}
		else {
			return a / b;
		}
	};  
	__all__.__div__ = __div__;
	
	var __add__ = function (a, b) {
		if (typeof a == 'object' && '__add__' in a) {
			return a.__add__ (b);
		}
		else if (typeof b == 'object' && '__radd__' in b) {
			return b.__radd__ (a);
		}
		else {
			return a + b;
		}
	};  
	__all__.__add__ = __add__;
	
	var __sub__ = function (a, b) {
		if (typeof a == 'object' && '__sub__' in a) {
			return a.__sub__ (b);
		}
		else if (typeof b == 'object' && '__rsub__' in b) {
			return b.__rsub__ (a);
		}
		else {
			return a - b;
		}
	};  
	__all__.__sub__ = __sub__;
	
	var __eq__ = function (a, b) {
		if (typeof a == 'object' && '__eq__' in a) {
			return a.__eq__ (b);
		}
		else {
			return a == b
		}
	};
	__all__.__eq__ = __eq__;
		
	var __ne__ = function (a, b) {
		if (typeof a == 'object' && '__ne__' in a) {
			return a.__ne__ (b);
		}
		else {
			return a != b
		}
	};
	__all__.__ne__ = __ne__;
		
	var __lt__ = function (a, b) {
		if (typeof a == 'object' && '__lt__' in a) {
			return a.__lt__ (b);
		}
		else {
			return a < b
		}
	};
	__all__.__lt__ = __lt__;
		
	var __le__ = function (a, b) {
		if (typeof a == 'object' && '__le__' in a) {
			return a.__le__ (b);
		}
		else {
			return a <= b
		}
	};
	__all__.__le__ = __le__;
		
	var __gt__ = function (a, b) {
		if (typeof a == 'object' && '__gt__' in a) {
			return a.__gt__ (b);
		}
		else {
			return a > b
		}
	};
	__all__.__gt__ = __gt__;
		
	var __ge__ = function (a, b) {
		if (typeof a == 'object' && '__ge__' in a) {
			return a.__ge__ (b);
		}
		else {
			return a >= b
		}
	};
	__all__.__ge__ = __ge__;
		
	var __getitem__ = function (container, key) {							// Slice c.q. index, direct generated call to runtime switch
		if (typeof container == 'object' && '__getitem__' in container) {
			return container.__getitem__ (key);								// Overloaded on container
		}
		else {
			return container [key];											// Container must support bare JavaScript brackets
		}
	};
	__all__.__getitem__ = __getitem__;

	var __setitem__ = function (container, key, value) {					// Slice c.q. index, direct generated call to runtime switch
		if (typeof container == 'object' && '__setitem__' in container) {
			container.__setitem__ (key, value);								// Overloaded on container
		}
		else {
			container [key] = value;										// Container must support bare JavaScript brackets
		}
	};
	__all__.__setitem__ = __setitem__;

	var __getslice__ = function (container, lower, upper, step) {			// Slice only, no index, direct generated call to runtime switch
		if (typeof container == 'object' && '__getitem__' in container) {
			return container.__getitem__ ([lower, upper, step]);			// Container supports overloaded slicing c.q. indexing
		}
		else {
			return container.__getslice__ (lower, upper, step);				// Container only supports slicing injected natively in prototype
		}
	};
	__all__.__getslice__ = __getslice__;

	var __setslice__ = function (container, lower, upper, step, value) {	// Slice, no index, direct generated call to runtime switch
		if (typeof container == 'object' && '__setitem__' in container) {
			container.__setitem__ ([lower, upper, step], value);			// Container supports overloaded slicing c.q. indexing
		}
		else {
			container.__setslice__ (lower, upper, step, value);				// Container only supports slicing injected natively in prototype
		}
	};
	__all__.__setslice__ = __setslice__;

	var __call__ = function (/* <callee>, <params>* */) {
		var args = [] .slice.apply (arguments)
		if (typeof args [0] == 'object' && '__call__' in args [0]) {
			return args [0] .__call__ .apply (null,  args.slice (1));
		}
		else {
			return args [0] .apply (null, args.slice (1));
		}		
	};
	__all__.__call__ = __call__;

	__nest__ (
		__all__,
		'math', {
			__all__: {
				__inited__: false,
				__init__: function (__all__) {
					var pi = Math.PI;
					var e = Math.E;
					var exp = Math.exp;
					var expm1 = function (x) {
						return Math.exp (x) - 1;
					};
					var log = function (x, base) {
						return (base === undefined ? Math.log (x) : Math.log (x) / Math.log (base));
					};
					var log1p = function (x) {
						return Math.log (x + 1);
					};
					var log2 = function (x) {
						return Math.log (x) / Math.LN2;
					};
					var log10 = function (x) {
						return Math.log (x) / Math.LN10;
					};
					var pow = Math.pow;
					var sqrt = Math.sqrt;
					var sin = Math.sin;
					var cos = Math.cos;
					var tan = Math.tan;
					var asin = Math.asin;
					var acos = Math.acos;
					var atan = Math.atan;
					var atan2 = Math.atan2;
					var hypot = Math.hypot;
					var degrees = function (x) {
						return (x * 180) / Math.PI;
					};
					var radians = function (x) {
						return (x * Math.PI) / 180;
					};
					var sinh = Math.sinh;
					var cosh = Math.cosh;
					var tanh = Math.tanh;
					var asinh = Math.asinh;
					var acosh = Math.acosh;
					var atanh = Math.atanh;
					var floor = Math.floor;
					var ceil = Math.ceil;
					var trunc = Math.trunc;
					var inf = Infinity;
					var nan = NaN;
					__pragma__ ('<all>')
						__all__.acos = acos;
						__all__.acosh = acosh;
						__all__.asin = asin;
						__all__.asinh = asinh;
						__all__.atan = atan;
						__all__.atan2 = atan2;
						__all__.atanh = atanh;
						__all__.ceil = ceil;
						__all__.cos = cos;
						__all__.cosh = cosh;
						__all__.degrees = degrees;
						__all__.e = e;
						__all__.exp = exp;
						__all__.expm1 = expm1;
						__all__.floor = floor;
						__all__.hypot = hypot;
						__all__.inf = inf;
						__all__.log = log;
						__all__.log10 = log10;
						__all__.log1p = log1p;
						__all__.log2 = log2;
						__all__.nan = nan;
						__all__.pi = pi;
						__all__.pow = pow;
						__all__.radians = radians;
						__all__.sin = sin;
						__all__.sinh = sinh;
						__all__.sqrt = sqrt;
						__all__.tan = tan;
						__all__.tanh = tanh;
						__all__.trunc = trunc;
					__pragma__ ('</all>')
				}
			}
		}
	);
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
	return __all__;
}
window ['geometry'] = geometry ();
