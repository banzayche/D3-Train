var addTollTip = function(options){
	$('body').append('\<div class\=\"mouse great-tooltip tooltip\" \>Click to go to\<br\>\<span class\=\"anchor-name\"\>\<\/span\>\<\/div\>')

	options.carriages.forEach(function(elem, index){
		elem.element
			.attr('data-anchor-name', options.menuNames[index]);
	});

	var tooltip = $(".great-tooltip");
	var HTMLmouseTip = $("div.great-tooltip.mouse");

	$(options.eventElement)
		.on("mousemove", function (e) {	    					
			var anchorName = $(this).attr('data-anchor-name');
			HTMLmouseTip.find( ".anchor-name" ).html(anchorName);
			tooltip.css("opacity", "1");

			// To add new coords for tooltip
	    	HTMLmouseTip
	    	    .css("left", Math.max(0, e.pageX - HTMLmouseTip.width() - 10 - 5) + "px")
		        .css("top", (e.pageY - HTMLmouseTip.height() - 10 - 20) + "px");
			})
		.on("mouseout", function (e) {
			tooltip.css("opacity", "0");
		});
};