$.getScript('debug.js');
//$.getScript('/_/js/main.js');

function cl (foo) {
	console.log(foo);
}

function isVoid (what) {
	if (what === null) {
		return true;
	}
	else if (what === false) {
		return true;
	}
	else if (typeof what == "undefined") {
		return true;
	}
	else if (typeof what == "object") {
		return what.length == 0;
	}
	else if (typeof what == "null") {
		return true;
	}
	else if (typeof what == "boolean") {
		return what !== true;
	}
	else if (typeof what == "number") {
		return what == 0;
	}
	else if (typeof what == "string") {
		return what == "";
	}
	else if (typeof what == "symbol") {
		return what == "";
	}
	else {
		return false;
	}
}

function closeAllModals () {
	$("#modal_bg").hide ();
	
}

function styleForms () {
	$('.simple-select').styler({
		selectSearch:true,
		onFormStyled:function () {
			$(".simple-select .jq-selectbox__select").each (function () {
				var $this = $(this);
				var $select = $this.prev ();
				$this.attr ("field_name", $select.attr ("name"));
			})
		}
	});
}

function ajax (data, obj, fa, fe, path, decode, asyncr, method) {
	if (isVoid (data)) {
		data='';
	}
	
	if (isVoid (path)) {
		path="/ajax/";
	}
	else {
		if (path.indexOf ("/") != 0) {
			path="/ajax/"+path+".php";
		}
	}
	
	if (isVoid (method)) {
		method="POST";
	}
	
	if (isVoid (asyncr)) {
		$.ajax({
			url:path,
			method:method,
			async:false,
			cache:false,
			data:data,
			success:function (response) {
cl (response);
				if (! isVoid (obj)) {
					processAjaxRequest (JSON.parse (response), obj, fa, fe);
				}
			}
		});
	}
	else {
		$.ajax({
			url:path,
			method:method,
			type: method,
			data:data,
			async:true,
			enctype:'multipart/form-data',
			contentType:false,
			cache:false,
			processData:false,
			success:function (response) {
cl (response);
				if (! isVoid (obj)) {
					processAjaxRequest (JSON.parse (response), obj, fa, fe);
				}
			}
		});
	}
}

function processAjaxRequest (res, obj, fa, fe) {
	var $this = obj;
	var $form = myForm ($this);

	if (res.status == "success") {
		if (isVoid (res.pp_remains)) {
			ppCloseCurrent ();
		}
		
		if (! isVoid (res.funcs)) {
			for (i of res.funcs) {
				if (! isVoid (i[0])) {
					if (! isVoid (i[1])) {
						window[i[0]] (i[1]);
					}
					else {
						window[i[0]] ();
						window[i[0]] ();
					}
				}
			}
		}
		
		if (! isVoid (res.ppfields)) {
			ppMes (res);
		}
		
		if (fa !== undefined) {
			execByName (fa);
		}
		
		if ($this !== undefined) {
			$this.show ();
		}
		
		if (res.goto) {
			window.location.href = res.goto;
		}
	}
	
	if (! isVoid (res.e)) {
		$(".input_message").remove ();
		
		if (! isVoid (res.e.i)) {
			for (var k in res.e.i) {
				var $inputByName = $form.find ("[name='"+ k +"']");
				var $inputById = $form.find ("#" + k);
				var $input = {};
				
				if (! isVoid ($inputByName)) {
					$input = $inputByName;
				}
				else if (! isVoid ($inputById)) {
					$input = $inputById;
				}
				
				if (! isVoid ($input)) {
					$input.addClass ("ferror");
					var elId = Number (new Date ());
					$("<div class='input_message' element_id='"+ elId +"'>"+ res.e.i[k] +"</div>").insertAfter ($input).css ("opacity", 1);
				}
			}
		}
		
		if (! isVoid (res.e.g)) {
			var t = "";
			for (i in res.e.g) {
				t += res.e.g[i] +"<br>";
			}
			
			if (! isVoid (t)) {
				ppError (t); /* ? */
			}
		}
		
		if (! isVoid (res.e.f)) {
cl (res.e.f);
			var formName = "";
			
			for (formName in res.e.f) {
				if (! isVoid (formName)) {
					var formErrs = res.e.f[formName];
					
					var $form = $("form[name='"+ formName +"']");
					
					if (! isVoid ($form)) {
						var $errPlace = $form.find (".form_error");
						$errPlace.hide ();
						
						if (! isVoid ($errPlace)) {
							var t = [];
							
							for (i in formErrs) {
								t.push (formErrs[i]);
								
								if (! isVoid (t)) {
									$errPlace.html (t.join ("<br>"));
									$errPlace.show ();
								}
							}
						}
					}
				}
			}
		}
	}
	
	if (! isVoid (res.m)) {
		if (! isVoid (res.m.g)) {
			var m = [];
			
			for (i of res.m.g) {
				m.push (i);
			}
			
			if (! isVoid (m)) {
				closeAllModals ();
			}
		}
	}

	if (res.status == "error") {
		if ($this !== undefined) {
			$this.show ();
		}
		
		if (! isVoid (res.fields)) {
			for (i in res.fields) {
				var $field = $form.find("[name='" + i + "']");
				var $ferror = $form.find("[name='" + i + "'] + .ferror");
//					$form.find("#" + res.fields[i]).addClass ("error");
				$field.addClass ("error");
				
				if (res.fields[i]) {
					$ferror.html (res.fields[i]);
					$ferror.show ();
				}
			}
		}
		
		if (fe !== undefined) {
			execByName (fe);
		}
		
		if (! isVoid (res.ppfields)) {
			t = "";
			
			for (i in res.ppfields) {
				t += res.ppfields[i] + "\n";
			}
			
			if (t != "") {
				err (t);
			}
		}
	}
	
	if (! isVoid (res.funcs)) {
		for (i of res.funcs) {
			if (! isVoid (window[i])) {
				window[i] ();
			}
		}
	}
	
	if (! isVoid (res.modal)) {
		if (! isVoid (res.modal.name)) {
			ppOpenByName ({
				name:res.modal.name,
				data:res.modal.data,
				ppId:res.modal.name,
				params:res.modal.params
			});
		}
	}
	
	if (! isVoid (res.cb)) {
		if (! isVoid (res.cb.name)) {
			if (! isVoid (window[res.cb.name])) {
				if (! isVoid (res.cb.args)) {
					window[res.cb.name] (res.cb.args);
				}
				else {
					window[res.cb.name] ();
				}
			}
		}
	}
	
	$(".loading").removeClass ("loading");
}

function ppError (t) {
	if (! isVoid (t)) {
		var path = "/popup/error";
		var $target = $("#modal_place").clone ();
		var modalID = Number (new Date ());
		$target.attr ("id", "");
				
		$("body").append ($target);
		var $overlay = $(".pp_overlay");
				
		$target.attr ("modal_id", modalID);
				
		$target.addClass ("pp_active");
				
		$target.load (path, function () {
			$("#pp_error_text").html (t);
			styleForms ();
			
			if ($overlay.css ("display") == "none") {
				$overlay.show ();
			}
					
			$target.show ();
		});
	}
}

function processAjaxResponse (res) {
	if (! isVoid (res)) {
		if (res.status == "success") {
			if (isVoid (res.pp_remains)) {
				ppCloseCurrent ();
			}
			
			if (! isVoid (res.funcs)) {
				for (i of res.funcs) {
					if (! isVoid (i[0])) {
						if (! isVoid (i[1])) {
							window[i[0]] (i[1]);
						}
						else {
							window[i[0]] ();
							window[i[0]] ();
						}
					}
				}
			}
		}
	}
}

function myForm ($obj) { 
	var $form = $obj.parents ("form");

	if (! isVoid ($form)) {
		return $form;
	}
	else {
		return false;
	}
}

function inArray(needle, haystack) { /*???*/
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

var cbinit = function() { 
	if ( $(".js-copy").length   ) {
		var clipboard = new Clipboard('.js-copy');
		
		clipboard.on('success', function() {
		});
	}
}

$(window).bind ("focus", function(){
	window.active = true;
});

$(window).bind ("blur", function(){
	window.active = false;
});

function paginate (index, page) {
	if (isVoid (index)) {
		index = 1;
	}

	if (isNaN (Number (index))) {
		index = 1;
	}
	
	if (isVoid (page)) {
		page = 1;
	}
	
	var $filters = {};
	var filters;
	var $box = $(".paginator_content[pag='"+ index +"']");
	var pat = $box.attr ("data-pattern");
	var path = "/pattern/" + pat + "/";
	var $pgn = $(".paginator_controls_box[pag='"+ index +"']");
	var fa = $box.attr ("fa");
	var fz = $box.attr ("fz");
	var joiner = "?";
	
	$(".paginator_filter[pag='"+ index +"']").each (function () {
		$filters[$(this).attr ("name")] = $(this).val ();
	});

	if (! isVoid ($filters)) {
		filters = btoa (JSON.stringify ($filters));
	}
	
	if (! isVoid (fa)) {
		window.fa ();
	}

	if (! isVoid (filters)) {
		path += joiner + "filters=" + filters;
		joiner = "&";
	}

	path += joiner + "pag=" + index;
	
	if (page > 0) {
		path += joiner + "page=" + page;
	}
	
	$box.load (path, function () {
		var $pagData = $(".paginator_data[pag='"+ index +"']");
			
		clock ();
		
		if (! isVoid ($pagData)) {
			$pgn.load ("/pattern/paginator/?params=" + encodeURIComponent ($pagData.val ()));
		}
		else {
			$(".paginate").html ("");
		}
	});
}

var clock = function() {
	if ($(".clock").length > 0) {
		if (! isVoid (window.clocks)) {
			clearInterval (window.clocks);
		}
		
		window.clocks = setInterval (function(){
			$(".clock").each (function(){
				var me = $(this);
				var time = me.attr ("data-clock");
				var mode = me.attr ("mode");
				var rem, y, M, d, h, m, s;

				if (time >= 0) {
					rem = time;
					
					if (mode != "hms") {
						y = rem / (365 * 24 * 3600) | 0;
						rem -= y * 365 * 24 * 3600;
						M = rem / (30 * 24 * 3600) | 0;
						rem -= M * 30 * 24 * 3600;
						d = rem / (24 * 3600) | 0;
						rem -= d * 24 * 3600;
					}
					
					h = rem / 3600 | 0;
					rem -= h * 3600;
					m = rem / 60 | 0;
					rem -= m * 60;
					s = rem;
					
					if (mode != "hms") {
						me.find (".clock_years").html (y);
						me.find (".clock_months").html (M);
						me.find (".clock_days").html (d);
					}
					
					me.find (".clock_hours").html (fwz (h, 2));
					me.find (".clock_minutes").html (fwz (m, 2));
					me.find (".clock_seconds").html (fwz (s, 2));
					
					me.attr ("data-clock", time - 1);
				}
			});
		}, 1000);
	}
}

function fwz (val, syms) { // fill with zeros
	var out = "";
	
	if (syms === undefined) {
		syms = 2;
	}

	for (i = String (val).length; i < syms; i ++) {
		out += String ("0");
	}
	
	out += String (val);
	
	return out;
}

$(document).on ("click", ".noclick", function(e){
	e.preventDefault();
	return false;
});

function number_format (number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
		
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function execByName (func, args) {
	if (typeof window[func] == "function") {
		if (! isVoid (args)) {
			window[func] (args);
		}
		else {
			window[func] ();
		}
	}
}

function ppOpenByName (obj) {
	var path = "";
	var ppId;
	
	if (typeof obj == "object") {
		if (! isVoid (obj.name)) {
			path += "/popup/" + obj.name + "/";
			
			if (! isVoid (obj.data)) {
				path += "?data=" + obj.data;
			}

			if (! isVoid (obj.fa)) {
				if (! typeof window[obj.fa] == "function") {
					if (! isVoid (obj.faArgs)) {
						window[obj.fa] (obj.faArgs);
					}
					else {
						window[obj.fa] ();
					}
				}
			}
				
			var $target = $("#modal_place").clone ();
			$target.attr ("id", "");
			
			$("body").append ($target);
			var $overlay = $(".pp_overlay");
			
			if (! isVoid (obj.ppId)) {
				ppId = obj.ppId;
			}
			else {
				ppId = Number (new Date ());
			}
			
			$target.attr ("modal_id", ppId);

			$target.addClass ("pp_active");
			
			$target.load (path, function () {
				styleForms ();
				
				if ($overlay.css ("display") == "none") {
					$overlay.show ();
					
					if (! isVoid (obj.fz)) {
						if (typeof window[obj.fz] == "function") {
							if (! isVoid (obj.fzArgs)) {
								window[obj.fz] (obj.fzArgs);
							}
							else {
								window[obj.fz] ();
							}
						}
					}
					
					$target.show ();
				}
			})
		}
	}
}

function ppCloseCurrent () {
	$(".modal.active").remove ();
	$("#modal_bg").hide ();
}

function roundIt (number, dec) {
	var result;
	
	result = Math.round (number * Math.pow (10, dec)) / Math.pow (10, dec);
	
	if (result < (1 / Math.pow (10, dec))) {
		result = 0;
	}
	
	return result;
}

function tabCallBack ($this) {
	if (! isVoid ($this)) {
		var tabId = $this.attr ("tab");
		var tabGroup = $this.attr ("group");
		
		$(".tab.master[group='"+ tabGroup +"']").removeClass ("active");
		$this.addClass ("active");
		
		$(".tab.slave[group='"+ tabGroup +"']").removeClass ("active");
		$(".tab.slave[tab='"+ tabId +"'][group='"+ tabGroup +"']").addClass ("active");
	}
}

function playSound (src, vol, loop) {
	if (! isVoid (src)) {
		if (isVoid (vol)) {
			vol = 0.1;
		}
		
		if (isVoid (loop)) {
			loop = false;
		}
		
		var $sound = new Audio (src);
		$sound.volume = vol;
		$sound.loop = loop;
		
		$sound.play ();
	}	
}