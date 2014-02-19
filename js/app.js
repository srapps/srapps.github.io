// get away from index.html
if ((""+window.location.href).match(/index.html[#?]*/)) {
	window.location = (""+window.location.href).replace(/\/index.html([#?]*)/, "\/$1");
}

$(document).ready(function(){
	var quotes = $("#secThree").find("blockquote");
	var lastQ = quotes.length;
	var index = Math.floor(Math.random()*(lastQ--));

	for(var i=0; i<4; i++) {
		quotes.eq(index).show();
		if(++index > lastQ) index = 0;
	}

	$("a[href$='.mp3']").each(function(i_not_used, elem) {
		$(elem).
			before( $(elem).clone().addClass("sm2_button") ).
			before("&nbsp;");
	});
});
