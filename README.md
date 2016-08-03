#JSandBox: an efficient and safe sandbox for JavaScript


> JSandBox is an efficient and safe sandbox for JavaScript, where some JS code is
executed in a safe environment. Actually, JSandBox is able to detect several
problems your JS code could be affected by.

[JSandBox](https://lukesmolo.github.io/JSandBox)

##How does it work?
First, your JS code is parsed for finding dangerous/not desirable functions, like __eval__,
	__alert__,  __Function()__ or a custom one. Then, your code is
	executed on a local web worker, so in a safe environment, in order to find some syntax errors, or
	__infinite loops__.
	If no problems are detected, you are able to safely execute your JS code.
	<br>
	You can try it [here](https://lukesmolo.github.io/JSandBox/demo/index.html).



##Usage
Clone the repository:
```
$ git clone git@github.com:lukesmolo/JSandBox.git
```

Include JSandBox in your page:
```html
<script type="text/javascript" src="JSandBox.js"></script>
```
You have to include [JQuery](https://jquery.com/) too.

Call JSandBox on the code you want to check.
```javascript
var code = 'alert("hello world")';
//with default settings
code.JSandBox();
//or with custom settings
code.JSandBox({
		'check_functions': false,
		'worker': 'js/JSandBox-worker.js',
		'functions': ['alert', 'eval', 'Function', 'myFunc'],
		'callback': myCallback
	});

```

By default, JSandBox have these options enabled:
```javascript
var settings = {
		'check_functions': true,
		'check_syntax': true,
		'check_loops': true,
		'functions': ['alert', 'eval', 'Function'],
		'worker': 'JSandBox-worker.js',
		'timeout' : 2000,
		'callback' : null
};
```
#####__check\_functions__, __check\_syntax__, __check\_loops__
specify which features are enabled. You can disable what you want, but please, take into account that
_check\_loops_ requires _check\_syntax_ too. Also remember that without
_check\_loops_ enabled, your worker could loop forever.

#####functions
specify which functions are not allowed. For example:

```javascript
['alert', 'eval', 'Function', 'myFunc']

```
#####worker
specify the path of the web worker. According to [http://www.w3.org/TR/workers/](https://www.w3.org/TR/workers):
> When the Worker(scriptURL) constructor is invoked, the user agent must run the following steps:
<br>
**1)** Resolve the scriptURL argument relative to the entry script's base URL, when the method is invoked.

#####timeout
specify the timeout after which worker will be stopped.


#####callback
specify a callback for returning your JS code status. By default, there is a
simple alert. A callback has to be defined in this way:
```javascript
function myCallback(msg, error)
```
_msg_ is a string containing the description of the returned status, _error_ is a
flag set when there is a problem.

##Demo
You can find a demo [here](https://lukesmolo.github.io/JSandBox/demo/index.html).

##License
JSandBox is released under the MIT License.

