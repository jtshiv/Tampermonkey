// ==UserScript==
// @name         Orlando Sentinel
// @namespace    https://github.com/jtshiv/Tampermonkey
// @version      0.1
// @description  Remove blocks that block you from reading
// @author       You
// @match        https://www.orlandosentinel.com
// @include      https://www.orlandosentinel.com*
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

	});

	var observer = new MutationObserver(function(mutations) {


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