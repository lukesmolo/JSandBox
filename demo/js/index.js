var editor = null;

var default_code = `alert('hello world!');

myFunc();

syntax errorrrr ;;;

while(1);
`;

$(document).ready(function() {

	editor = ace.edit("textarea");
	editor.setTheme("ace/theme/twilight");
	editor.setOptions({fontSize: "12pt "});
	editor.getSession().setMode("ace/mode/javascript");
	$('#eval_code').on('click', eval_code);
	$('#reset_code').on('click', reset_code);
	editor.getSession().setValue(default_code);
	$('#check_syntax').change(function() {
		if($(this).is(":not(:checked)")) {
			if($('#check_loops').is(":checked")) {
				append_info('Check Loops requires Check Syntax', 0);
				$('#check_loops').prop('checked', false);
			}
			
		}
	});
	$('#check_loops').change(function() {
		if($(this).is(":checked")) {
			if($('#check_syntax').is(":not(:checked)")) {
				$('#check_syntax').prop('checked', true);
				append_info('Check Loops requires Check Syntax', 0);
			}
		}
	});



});


function
eval_code() {
	code = editor.getSession().getValue();
	check_functions = $('#check_functions').is(':checked');
	check_syntax = $('#check_syntax').is(':checked');
	check_loops = $('#check_loops').is(':checked');
	code.JSandBox({
		'check_functions': check_functions,
		'check_syntax': check_syntax,
		'check_loops': check_loops,
		'worker': 'js/JSandBox-worker.js',
		'functions': ['alert', 'eval', 'Function', 'myFunc'],
		'callback': append_info
	});
}

function
reset_code() {
	editor.getSession().setValue(default_code);

}

function
append_info(what, error){
	$('#error_alert').empty();
	$('#error_alert').text(what);
	if(error == 1) {
		$('#error_alert').css('color', 'red');
	} else {
		$('#error_alert').css('color', 'blue');
	}

}

