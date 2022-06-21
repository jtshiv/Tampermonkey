// ==UserScript==
// @name         Mutation Observer Template
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://mail.google.com/mail/u/0/#inbox
// @include      https://mail.google.com/mail/u/0/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-idle
// @grant        none
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    /* Your code here... */


	console.log('Tampermonkey script started');
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