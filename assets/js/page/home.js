$(document).on ("click", "#home_next_step", function (e) {
	e.preventDefault ();
	$("#h_signin").removeClass ("step_active_1").addClass ("step_active_2");
	$("#home_prev_step, #home_signup_submit").show ();
});

$(document).on ("click", "#home_prev_step", function (e) {
	e.preventDefault ();
	$("#h_signin").removeClass ("step_active_2").addClass ("step_active_1");
	$("#home_prev_step, #home_signup_submit").hide ();
});


function doEffect1 () {
	var $obj = $("#effect_1");
	var w = $obj.innerWidth ();
	var h = $obj.innerHeight ();
	var str = $obj.html ();
	var chars = "";
	var sym;
	var symCode;
	var newStr = "";
	var varSym = "";
	var si;
	var index = 0;
	var count = 1;
	var strToShow = "";
	
	$obj.css ("width", w + "px");
	$obj.css ("height", h + "px");
	
	$obj.html ("&nbsp;");
	$obj.css ("opacity", 1);

	if (str.length > 0) {
		for (i = 0; i < str.length; i ++) {
			sym = str[i];
			symCode = str.charCodeAt (i);
			
			if (symCode != 10 && symCode !=9 && symCode != 32 && symCode != 13) {
				chars += sym;
			}
		}
		
		if (chars.length > 0) {
			si = setInterval (function () {
				sym = str[index];
				symCode = str.charCodeAt (index);
				
				if (symCode == 10 || symCode == 9 || symCode == 32 || symCode == 13) {
					newStr += sym;
					strToShow = newStr;
					index ++;
					count = 1;
				}
				else {
					if (count < 5) {
						varSym = chars[Math.floor (Math.random () * chars.length)];
						strToShow = newStr + varSym;
						count ++;
					}
					else {
						newStr += sym;
						strToShow = newStr;
						count = 1;
						index ++;
					}
				}
				
				$obj.html (strToShow);
				
				if (newStr == str || sym === undefined) {
					clearInterval (si);
				}
				
			}, 5000 / ((chars.length * 5 + (str.length - chars.length))));
		}
	}
}

$(document).on ("load", "#telegram-post-c12net-10", function () {
	var $head = $("#telegram-post-c12net-10").contents ().find ("head");
	
	var $css = $("<style>* {font-size:0.5rem;}</style>");
	
	$head.append ($css);
	
	$("#tg_widget").show ();
})

$(document).ready (function () {
	setTimeout (function () {doEffect1 ()}, 1000);
	
	setTimeout (function () {
		var $head = $("#telegram-post-c12net-10").contents ().find ("head");
		
		$head.append ("<style>* {font-size:0.5rem;}</style>");
		
		$("#tg_widget").show ();
	}, 1000);
	
	paginate (1);
});

$(document).on ("click", ".tgme_widget_message_text", function () {
	alert (1);
});