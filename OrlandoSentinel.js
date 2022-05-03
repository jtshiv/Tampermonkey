// ==UserScript==
// @name         Orlando Sentinel
// @namespace    https://github.com/jtshiv/Tampermonkey
// @version      0.4
// @description  Remove blocks that block you from reading
// @author       jtshiv
// @match        https://www.orlandosentinel.com
// @include      https://www.orlandosentinel.com*
// @updateURL    https://raw.githubusercontent.com/jtshiv/Tampermonkey/main/OrlandoSentinel.js
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-idle
// @grant        none
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    /* Your code here... */


	console.log('Orlando Sentinel script started');
	$(document).ready(function(){
		console.log('Document ready');
		if ($('#osStyle').length){
            $('#osStyle').remove();
        };
        var style = document.createElement('style');
        style.id = "osStyle";
        style.innerHTML = 
            `
            .overflow_hidden{
				overflow: auto !important;
			}
            `;
        document.head.appendChild(style);
	});

	var observer = new MutationObserver(function(mutations) {
		try{
			$('#right-rail').remove();
			$('section#left')[0].style="width:100%";
		} catch(e){
			null
		};
		if ($('div[class*="onesignal-slidedown"]').length){
			$('div[class*="onesignal-slidedown"]').remove();
		};
		if ($('div[class*="ads"]').length){
			$('div[class*="ads"]').remove();
		};
		if ($("div.met-footer-toast").length){
			$("div.met-footer-toast").remove();
		};
		if ($('#zephr-overlay').length){
			$('#zephr-overlay').remove();
		};
		if ($('#regiwall-overlay').length){
			$('#regiwall-overlay').remove();
		};
		for (img of $find('img')){
			if (img.getAttribute('data-src')){
				img.src = img.getAttribute('data-src');
			};
		};
		unsafeWindow.addEventListener("scroll", function (event) {
			event.stopPropagation();
			event.stopImmediatePropagation();
		}, true);
		$('html')[0].addEventListener("scroll", function (event) {
			event.stopPropagation();
			event.stopImmediatePropagation();
		}, true);
		$('html').css("overflow","auto");
		

	});

	/* Notify me of everything! */
	var observerConfig = {
		/*attributes: true,*/
		childList: true,
		/*characterData: true,*/
		subtree: true
	};

	/* Node, config */
	/* In this case we'll listen to all changes to body and child nodes */
	var targetNode = document.body;
	observer.observe(targetNode, observerConfig);


})();