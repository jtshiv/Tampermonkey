// ==UserScript==
// @name         ESPN Score unSpoiler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.espn.com/
// @include https://www.espn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=espn.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    console.log('Tampermonkey script started');
	$(document).ready(function(){
		console.log('Document ready');

	});

	var observer = new MutationObserver(function(mutations) {
        try{
            $('.cscore_name').css('color','black');
        } catch(e){
            console.log(e);
        }

        try{
            $('.cscore--home-winner').removeClass('cscore--home-winner');
        } catch(e){
            console.log(e);
        }

        try{
            $('.cscore--away-winner').removeClass('cscore--away-winner');
        } catch(e){
            console.log(e);
        }

        try{
            $('.cscore_score').hide();
        } catch(e){
            console.log(e);
        }

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