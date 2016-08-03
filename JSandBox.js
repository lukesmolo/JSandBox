/*
 * JSandBox
 * https://github.com/lukesmolo/JSandBox
 *
 * Copyright 2016, Luca Sciullo
 * https://lukesmolo.github.io/JSandBox
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 */

String.prototype.JSandBox = function (options) {
	code = this;
	var not_allowed = function(name){
		return function(){
			check = name + "() is not allowed";
			console.warn(name + "() is not allowed");
			return function(){};
		};
	};

	var functions = {};
	var settings = {
		'check_functions': true,
		'check_syntax': true,
		'check_loops': true,
		'functions': ['alert', 'eval', 'Function'],
		'worker': 'JSandBox-worker.js',
		'timeout' : 2000,
		'callback' : null
	};

	if(options) {
		$.extend(settings, options);
	}
	for(var i = 0; i < settings.functions.length; i++) {
		functions[settings.functions[i]] =  not_allowed(settings.functions[i]);
	}
	function
		check_functions(script, context){
			check = 1;
			if(context === null || jQuery.isEmptyObject(context)) {
				alert('no functions to be checked');
				return 0;
			}
			context.window = {};

			for (var key in context){
				context.window[key] = context[key];
			}

			context.global = context.window;
			var lines = script.split('\n');
			for(var i = 0;i < lines.length;i++){
				try {
					lines[i] = lines[i].replace(/while\(([^\)]*\))/g, "");
					lines[i] = lines[i].replace(/for\(([^\)]*\))/g, "");
					eval("with (context){ " + lines[i]+ " }");

				} catch(e) {
				}
			}
			return check;
		}

	function
		check_loops(code, fnOnStop, opt_timeoutInMS) {
			var id = Math.random() + 1;
			var myWorker = new Worker(settings.worker);


			function onDone() {
				fnOnStop.apply(this, arguments);
			}

			myWorker.onmessage = function (data) {
				data = data.data;
				if (data) {
					if (data.i === id) {
						id = 0;
						onDone(true, data.r);
					}
					else if (data.i === id + 1) {
						setTimeout(function() {
							if (id) {
								myWorker.terminate();
								onDone(false);
							}
						}, opt_timeoutInMS || 1000);
					}
				}
			};

			myWorker.postMessage({ c: code, i: id });
		}

	function
		check_code(code) {
			tmp_code = code;
			check = 1;
			if(settings.check_functions === true) {
				check = check_functions(code, functions);
				if(check != 1 && check !== 0) {
					if(settings.callback) {
						settings.callback(check, 1);
					} else {
						alert(check);
					}
				}
				code = tmp_code;
			}
			if(check == 1 && (settings.check_loops === true || settings.check_syntax === true)) {


				check_loops(code, function(success, returnValue) {
					if (success) {
						if(returnValue != 1 && settings.check_syntax === true) {
							error = returnValue;
							if(settings.callback) {
								settings.callback(error, 1);
							} else {
								alert(error);
							}

						} else {
							if(settings.callback) {
								settings.callback('Code seems to be OK', 0);
							} else {
								alert('Code seems to be OK');
							}
						}
					}
					else {
						if(settings.check_loops) {
							error = 'Code takes too long to run.  Is there an infinite loop?';

							if(settings.callback) {
								settings.callback(error, 1);
							} else {
								alert(error);
							}
						}
					}
				}, settings.timeout);
			}
		}
	console.log('chek_functions: '+settings.check_functions+'\n'+ 'chek_syntax: '+settings.check_syntax+'\n'+ 'chek_loops: '+settings.check_loops);
	check_code(code);
	return this;
};

