// ==UserScript==
// @name         Orlando Sentinel
// @namespace    https://github.com/jtshiv/Tampermonkey
// @version      2023.04.26.1
// @description  Remove blocks that block you from reading
// @author       jtshiv
// @match        https://www.orlandosentinel.com
// @include      https://www.orlandosentinel.com*
// @downloadURL  https://raw.githubusercontent.com/jtshiv/Tampermonkey/main/os.user.js
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-idle
// @grant        unsafeWindow
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // Dev Branch:
	// https://raw.githubusercontent.com/jtshiv/Tampermonkey/osDev/OrlandoSentinel.js


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
			html{
				overflow: auto !important;
			}
            `;
        document.head.appendChild(style);
		unsafeWindow.document.addEventListener("scroll", function (event) {
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();
		}, true);
		console.log('window scroll event listener added');
		$('html').css("overflow","auto");
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
		// Some ads
		if ($('div[class*="ads"]').length){
			$('div[class*="ads"]').remove();
		};
		// Floating video player
		if ($('stn-player').length){
			$('stn-player').remove();
		};
		// weather block
		if ($('section').has('[data-pb-id="weather-sponsorship"]').length){
			$('section').has('[data-pb-id="weather-sponsorship"]').remove();
		};
		if ($("div.met-footer-toast").length){
			$("div.met-footer-toast").remove();
		};
		// One type of overlay
		if ($('#zephr-overlay').length){
			$('#zephr-overlay').remove();
		};
		// One type of overlay
		if ($('#regiwall-overlay').length){
			$('#regiwall-overlay').remove();
		};
		try{
            for (img of $find('img')){
                if (img.getAttribute('data-src')){
                    img.src = img.getAttribute('data-src');
                };
            }
        }catch(e){
            console.log(e);
        };
		
		

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
