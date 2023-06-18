/*
$(window).resize (function () {
	if ($(window).width () > 1000) {
		$("html").css ("font-size", ($(window).width () / 200) + "px");
	}
});
*/

$(document).ready (function () {
/*
	if ($(window).width () > 1000) {
		$("html").css ("font-size", ($(window).width () / 200) + "px");
	}
*/
	var $checkTime = $("var[n='check_time']");
	
	if ($checkTime.length) {
//		var $offset = new Date();
		
		ajax ("formaction=check_time&offset=" + new Date ().getTimezoneOffset() + "&timezone=" + encodeURIComponent (new Date ()));
	}
	
	var $errors = $("e");
	
	if (! isVoid ($errors)) {
		var $target = $(".pp_error");
		var $content = $(".pp_error .pp_content");
		$content.html ("");
		var ts = [], tfs = [];
		
		$errors.each (function () {
			var $this = $(this);
			ts.push ($this.html ());
			
			if (! isVoid ($this.attr ("field"))) {
				tfs.push ($this.attr ("field"));
			}
		});
		
		if (! isVoid (ts)) {
			openModal ("error", ts);
		}
	}
	
	var $messages = $("m");
	
	if (! isVoid ($messages)) {
		var $target = $(".pp_error");
		var $content = $(".pp_error .pp_content");
		$content.html ("");
		var ts = [], tfs = [];
		
		$messages.each (function () {
			var $this = $(this);
			ts.push ($this.html ());
			
			if (! isVoid ($this.attr ("field"))) {
				tfs.push ($this.attr ("field"));
			}
		});
		
		if (! isVoid (ts)) {
			openModal ("message", ts);
		}
	}
	
	$("ee").each (function () {
		var $this = $(this);
		var $form = $("form[name='"+ $this.attr ("form-name") +"']");
		var $field;
		var elId = Math.round (Math.random () * 1000000000);
		var $box;

		if (! isVoid ($form)) {
			$field = $form.find ("[name='"+ $this.attr ('field') +"']");
			
			if (isVoid ($field)) {
				$field = $form.find ('#' + $this.attr ("field"));
			}
			
			if (! isVoid ($field)) {
				txt = $this.html ();
				
				$box = $field.parents (".field_box_");
				
				if (! isVoid ($box)) {
					$box.addClass ("error");
					
					if (! isVoid (txt)) {
						$("<div class='input_message'>"+ txt +"</div>").insertAfter ($field);
					}
				}
			

			}
		}
	});

	$(".jq-selectbox__dropdown li").each (function () {
		$(this).html ($(this).html ().replace (/&gt;/g,'>').replace (/&lt;/g,'<'));
	});
	
	setTimeout (function () {
		$(".sup_.field_").each (function () {
			var $f = $(this);
			if (! isVoid ($f.val ())) {
				$f.parents (".field_box_").addClass ("filled_");
			}
			else {
				$f.parents (".field_box_").removeClass ("filled_");
			}
		});
	}, 100);
	
	
	
	clock ();
	styleForms ();
	cbinit ();
	grinit ();
	
	var authed = getCookie ("ga_chk_stmt");
	
	if (authed === undefined) {
		$(".public_auth_button.out").show ();
	}
	else {
		$(".public_auth_button.auth").css ("display", "inline-block");
	}
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function grinit () {
	$("form").each (function () {
		var $form = $(this);

		if ($form.hasClass ("c_protected")) {
			grInstall ($form);
		}
	});
}

function grInstall ($form) {
	if (! isVoid ($form)) {
		$form.find ("input[name='gr_token'][type='hidden']").remove ();
		var key = $("var[n='captcha']").attr ("v");
		
		if (! void (key)) {
			grecaptcha.ready (function () {
//				cl (grecaptcha);
//				cl (grecaptcha.getResponse ());
				grecaptcha.execute (key, {action:"submit"}).then (function (token) {
					$form.append ("<input type='hidden' name='gr_token' value='"+ token +"'>");
					
					setTimeout (function () {
//						var res = grecaptcha.getResponse (token);
//						cl (res);
						grInstall ($form);
					}, 50000);
				});
			});
		}
	}
}

$(document).on ("input", ".field_box_.error .sup_.field_", function () {
	var $el = $(this);
	var $box = $el.parents (".field_box_");

	$box.removeClass ("error");
	$box.find (".input_message").remove ();
});

$(document).on ("focus", ".sup_.field_", function () {
	$(this).parents (".field_box_").addClass ("filled_");
})

$(document).on ("click", ".tab.master", function (e) {
	e.preventDefault ();
	var $this = $(this);
	var tabId = $this.attr ("tab");
	var tabGroup = $this.attr ("group");
	var func = $this.attr ("f");
	
	if (isVoid (func)) {
		func = tabCallBack ($this);
	}
	else {
		window[func] ($this);
	}
});

$(document).on ("click", ".ajax", function (e) {
	e.preventDefault ();

	var $this = $(this);
	var tag = $this.prop ("tagName");
	var type = $this.prop ("type").toLowerCase ();
	var fb = $this.attr ("fb");
	var fa = $this.attr ("fa");
	var fe = $this.attr ("fe");
	var t;
	var buttonVal = "";

	$(".ferror").removeClass ("ferror");

	if (! isVoid (fb)) {
		execByName (fb);
	}
	
	var form = myForm ($this);
	var formData = new FormData ();
	var hasFile = false;

	form.find (".ferror").removeClass ("ferror");
	form.find (".error_explained").remove ();

	form.find ("input, select, button").each (function () {
		var $el = $(this);

		if (! isVoid ($el.prop ("name"))) {
			if (! isVoid ($el.prop ("files"))) {
				if ($el.prop ("files")) {
					hasFile = true;
					formData.append ($el.prop ("name"), $el.prop ("files")[0]);
				}
			}
			else {
				var name = $el.prop ("name");
				var value = $el.val ();
				formData.append (name, value);
			}
		}
		
	});

	if (tag == "BUTTON" || tag == "INPUT") {
		if (type == "submit") {
			buttonVal = encodeURI ($this.attr ("name")) + "=" + encodeURI ($this.attr ("value")) + "&";
			formData.append (encodeURI ($this.attr ("name")), encodeURI ($this.attr ("value")));
		}
	}
	if (hasFile) {
		var res = ajax (formData, $this, fa, fe, undefined, undefined, true, undefined);
	}
	else {
		var res = ajax (buttonVal + form.serialize (), $this, fa, fe, undefined, undefined, undefined, undefined);
	}
});

$(document).on ("click", ".js-copy", function (e) {
	e.preventDefault ();
	var $this = $(e.target);
	
	$this.addClass ("success"); 

	setTimeout (function () {
		$this.removeClass ("success");
	}, 2000);
});

$(document).on ("change", ".paginator_filter", function () {
	paginate ($(this).attr ("pag"));
});

$(document).on ("click", ".paginate .paginate__item", function (e) {
	e.preventDefault ();
	var $this = $(this);
	
	if (! $this.hasClass ("active") && ! $this.hasClass ("inactive")) {
		var pag = $this.attr ("pag");
		var page = $this.attr ("page");
		
		if (pag > 0 && page > 0) {
			paginate (pag, page);
		}
	}
	
});

window.protected_forms = {};

$(document).ready (function () {
});
/*
window.cpInit = function () {
	setTimeout (function () {
		$("form.c_protected").each (function () {
			var $form = $(this);
			var formName = $form.attr ("name");
			var pubKey = $("var[n='captcha']").attr ("v");
			
			$form.find (".c_protect_box[protect-box='"+ formName +"']").remove ();
			
			if (! isVoid (formName)) {
				if (! isVoid (pubKey)) {
					$form.append ("<div class='c_protect_box' protect-box='"+ formName +"'></div>");
					
					window.protected_forms[formName] = turnstile.render (".c_protect_box[protect-box='"+ formName +"']", {
						sitekey: pubKey,
						theme: "dark",
						callback: function () {
							setTimeout (function () {
								$form.find (".c_protect_box iframe").fadeOut (500, function () {
									$form.find (".c_protect_box iframe").remove ();
								});
							}, 1000)
						}
					});
				}
			}
		});
	}, 100);
	
	setTimeout (function () {
		cpInit ();
	}, 200000);
}
*/
$(document).on ("input", ".pin_field", function () {
	var $this = $(this);
	var value = Number ($this.val ());
	var group = Number ($this.attr ("pin_box"));
	var place = Number ($this.attr ("pin"));
	
	if (! isNaN (value) && ! isNaN (group) && ! isNaN (place)) {
		if (value >= 0 && value <= 9) {
			if (place <= 3) {
				$(".pin_box[pin_box='"+ group +"'] .pin_field[pin_box='"+ group +"'][pin='"+ (place + 1) +"']").focus ();
				setTimeout (function () {
					$this.val ("*");
				}, 500);
			}
			else {
				$this.blur ();
				setTimeout (function () {
					$this.val ("*");
				}, 500);
			}
			
			$(".pin_box_value[pin_box='"+ group +"'][pin='"+ place +"']").val (value);
		}
		else {
			$this.val ("");
		}
	}
	else {
		$this.val ("");
	}
});

$(document).on ("focus", ".pin_field", function () {
	var $this = $(this);
	var group = Number ($this.attr ("pin_box"));
	var place = Number ($this.attr ("pin"));
	
	$this.val ("");
	$(".pin_box_value[pin_box='"+ group +"'][pin='"+ place +"']").val ("");
});

$(document).on ("click", ".call_modal", function (e) {
	e.preventDefault ();
	
	var $this = $(this);
	var type = $this.attr ("type");
	var name = $this.attr ("modal");
	var inputs = $this.attr ("inputs");
	var fa = $this.attr ("fa");
	var fz = $this.attr ("fz");
	var query;
	var path = "/modal/";
//cl (inputs);
	if (isVoid (fa)) {
		fa = "closeOtherModals";
	}
	
	if (! isVoid (name)) {
		openModal (name, inputs, type, fz, fa);
	}
});

$(document).on ("click", "#open_notifications", function (e) {
	e.preventDefault ();

	openModal ("notifications", "", "", "displayNotifications");
});

function displayNotifications () {
	paginate (10, 1);
	$(".alert_amount").html ("").hide ();
}

function closeOtherModals () {
	$(".modal_box[role!='primary'][role!='preload']").remove ();
}

function openModal (name, inputs, type, fz, fa) {
	var query;
	var path = "/modal/";
	var $prObj, $obj;

	if (! isVoid (fa)) {
		window[fa] ();
	}

	if (! isVoid (name)) {
		if (isVoid (type)) {
			type = "standard";
		}
		
		if (! isVoid (inputs)) {
			query = "?inputs=" + inputs;
		}
		
		path += name + "/";
		
		if (! isVoid (query)) {
			path += query;
		}
		
		$prObj = $(".modal_box[type='"+ type +"'][role='primary']");

		if (! isVoid ($prObj)) {
			$("#modal_bg").addClass ("active");
			$obj = $prObj.clone ();
			$obj.attr ("role", "");
			$("body").append ($obj);
			$obj.addClass (type);
			$obj.attr ("window_name", name);
			
			if (name == "error") {
				$obj.addClass ("error");
				$obj.attr ("type", "error");
				$obj.find (".modal_content .title").html (inputs.join ("<br>"));
				$obj.addClass ("active");
			}
			else if (name == "message") {
				$obj.addClass ("message");
				$obj.attr ("type", "message");
				$obj.find (".modal_content .title").html (inputs.join ("<br>"));
				$obj.addClass ("active");
			}
			else {
				var init = function () {
						$obj.addClass ("active");
						cbinit ();
						styleForms ();

						if (! isVoid (fz)) {
							window[fz] ();
						}
					},
					pre = $('.modal_box[role=preload][source="'+path+'"] .modal_content');
				if(pre.length){$obj.find (".modal_content").replaceWith(pre.clone());init.apply(this);}
				else $obj.find (".modal_content").load (path,init);
			}
		}
	}
}

function openErrorModal (inputs, fz, fa) {
	if (! isVoid (inputs)) {
		var $prObj, $obj;
		
		$prObj = $(".modal_box[type='error'][role='primary']");

		if (! isVoid ($prObj)) {
			$("#modal_bg").addClass ("active");
			$obj = $prObj.clone ();
			$obj.attr ("role", "");
			$("body").append ($obj);
			$obj.addClass ("error");
			$obj.attr ("window_name", "error");
			$obj.find (".modal_content .title").html (inputs.join ("<br>"));
			$obj.addClass ("active");
		}
	}
}

$(document).on ("click", ".modal_close", function (e) {
	e.preventDefault ();

	var $this = $(this);
	var name = $this.parents (".modal_box").attr ("window_name");
	
	closeModal (name);
}); 

function closeModal (name, fz, fa) {
	if (! isVoid (name)) {
		$(".modal_box[window_name='"+ name +"']").remove ();
		
		var $otherModals = $(".modal_box[role='']");

		if ($otherModals.length < 1) {
			$("#modal_bg").removeClass ("active");
		}
	}
}

$(document).on ("click", ".modal_box", function (e) {
	if ($(e.target).hasClass ("modal_box")) {
		var $otherModals = $(".modal_box[role='']").remove ();
		$("#modal_bg").removeClass ("active");
	}
});

$(document).on ("click", ".sup_.label_", function () {
	$(this).parents (".field_box_").addClass ("filled_");
});

$(document).on ("blur", ".sup_.field_", function () {
	if ($(this).prop ("tagName") != "DIV") {
		if (isVoid ($(this).val ()) && $(this).prop ("tagName") != "SELECT") {
			$(this).parents (".field_box_").removeClass ("filled_");
		}
	}
});

$(document).on ("input", ".home_calc #amount", function () {
	var amount = Number ($(this).val ());
	var daily, total;
	var calc = false;
	
	if (! isNaN (amount)) {
		if (! isVoid (amount)) {
			if (amount > 30000) {
				amount = 30000;
				$(".home_calc #amount").val (amount);
			}
			
			daily = Math.round (amount * 0.1 * 100) / 100;
			total = Math.round (daily * 15 * 100) / 100;
			$(".home_calc #daily_profit").html (daily);
			$(".home_calc #total_roi").html (total);
			calc = true;
		}
	}
	
	if (calc === false) {
		$(".home_calc #daily_profit").html ("0.00");
		$(".home_calc #total_roi").html ("0.00");
	}
});

$(document).on ("click", ".scroll_from_", function (e) {
	e.preventDefault ();
	
	var $el = $(this);
	var target = $el.attr ("target");
	var $target;
	
	if (! isVoid (target)) {
		$target = $(".scroll_to_[target='"+ target +"']");
		
		if (! isVoid ($target)) {
			$("html").animate ({
				scrollTop: $target.offset ().top
			}, 2000, "swing");
		}
	}
});

$(document).on ("change", ".select_language", function () {
	var lc = $(this).find ("option:selected").attr ("value");
	var url = window.location.href;
	var joiner = "?";
	
	if (url.indexOf ("?") >= 0) {
		joiner = "&";
	}
	
	if (! isVoid (lc)) {
		window.location.href = url + joiner + "language=" + lc;
	}
});

$(document).on ("click", ".elhint.master", function () {
	var $this = $(this);
	var hint = $this.attr ("hint");
	var $hint = $(".elhint.slave[hint='"+ hint +"']");

	if ($hint.hasClass ("active")) {
		$hint.hide (0, function () {
			$hint.removeClass ("active");
		});
	}
	else {
		$hint.show (0, function () {
			$hint.addClass ("active");
		});
	}
});

$(document).on ("click", "body", function (e) {
	var $ms = $(".elhint.master");
	var $ss = $(".elhint.slave");
	var $m, $s;
	var ins = 0;
	
	$ms.each (function () {
		$m = $(this);
		
		$ss.each (function () {
			$s = $(this);
			
			if (e.target == $m[0] || e.target == $s[0] || $m.has (e.target).length > 0 || $s.has (e.target).length > 0) {
				ins ++;
			}
		})
	});
	
	if (ins == 0) {
	
		$ss.hide ().removeClass ("active");
	}
});

$(document).on ("click", ".check_click", function (e) {
	e.preventDefault ();
	
	var $this = $(this);
	
	if (e.originalEvent === undefined) {

	}
	else {
		var $form = myForm ($(this));
		var fName = $form.attr ("name");
		
		openModal ("check_click", [fName]);
	}
});

$(document).on ("click", ".input_confirm", function (e) {
	e.preventDefault ();
	
	var $this = $(this);
	var fName = $this.attr ("form");
	var $form = $("form[name='"+ fName +"']");

	if (! isVoid (fName)) {
		if (! isVoid ($form)) {
			$form.find ("input[name='captcha']").remove ();
			$form.find ("input[name='send_']").remove ();
			
			setTimeout (function () {
				$form.append ("<input type='hidden' name='captcha' value='"+ $("#form_"+ fName +"_captcha").val () +"'>");
				$form.append ("<input type='hidden' name='send_' value='1'>");
				$form.submit ();
			}, 40);
		}
	}
});

$(document).on ("click", ".captcha_image", function () {
	$(this).attr ("src", "/captcha?reset");
});




// Miguel, 02.03.2023.
$(function(){
	$('#footer .back_btn a.scroll_from_').click(function(){window.scroll(0,0);});
});