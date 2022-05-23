// ==UserScript==
// @name         xkcd
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       jtshiv
// @updateURL	 https://raw.githubusercontent.com/jtshiv/Tampermonkey/main/xkcd.js
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @match        https://xkcd.com/
// @include      https://xkcd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xkcd.com
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

	// This is to add left right arrow paging
	window.addEventListener('keydown',e=>{
		switch(e.key){
			case "ArrowLeft":
				document.querySelector('[rel="prev"]').click();
				break;
			case "ArrowRight":
				document.querySelector('[rel="next"]').click();
				break;
		}
	});
	
	// Get alt text and add to div below image
	let comic = document.querySelector('#comic img');
	let elem = document.createElement('div');
	elem.innerHTML = comic.title;
	document.querySelector('#comic').appendChild(elem);

	// scroll page so that title is aligned at top of page by default
	document.querySelector('#ctitle').scrollIntoView(true);



})();
