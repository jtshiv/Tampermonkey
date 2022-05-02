// ==UserScript==
// @name         ESPN Score unSpoiler
// @namespace    https://github.com/jtshiv/Tampermonkey
// @version      0.4
// @description  Remove scores and spoilers from espn.com
// @updateURL    https://github.com/jtshiv/Tampermonkey/raw/main/ESPN%20Score%20unSpoiler.js
// @author       jtshiv
// @match        https://www.espn.com/
// @include      https://www.espn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=espn.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Dev brach:
    // https://github.com/jtshiv/Tampermonkey/raw/espnDev/ESPN%20Score%20unSpoiler.js

    console.log('ESPN Score unSpoiler script started');
	$(document).ready(function(){
		console.log('Document ready');

        // Add CSS to do the edits to the classes
        if ($('#unspoilerStyle').length){
            $('#unspoilerStyle').remove();
        };
        var style = document.createElement('style');
        style.id = "unspoilerStyle";
        style.innerHTML = 
            `
            .scoresTab .cscore_name {
                color: black !important;
            }
            .scoresTab .cscore_score {
                display: none !important;
            }
            .scoresTab .cscore_team:after{
                border-color: transparent !important;
            }
            `;
        document.head.appendChild(style);
	});

    // Function to insert node in after another
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    // Function to clone based on received items
    function cloneNodes(items){
        for (var i=0;i<items.length;i++){
            var clone = items[i].cloneNode(true);
            items[i].classList.add('cloned');
            $(items[i]).hide();
            clone.classList.add('clone');
            insertAfter(clone,items[i]);
        };
    };

    // Function to unhide originals when clone clicked
    function clickUnhide(elems,className){
        elems.on("click.clickUnhide", function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            this.classList.remove(className);
            $(this).off("click.clickUnhide");
            /* this.classList.add('clicked');
            console.log(this);
            $('.cscore_link').has('.clicked').find('.cloned').show();
            $('.cscore_link').has('.clicked').find('.clone').hide();
            this.classList.remove('clicked'); */
        });
    };

    // Scores Tab Updates
    function scoresTab(){
        //This section is for the mobile scores overlay from the top right
        
        // items are all the non clone/clones since we only want to do this once and it refreshes
        // on dom changes
        var items=$('.cscore--final:not(.scoresTab)').has('[data-mptype="scoreboard"]');
        items.addClass('scoresTab');
        
        // after formatting changes, add the click listener to unhide the originals
        clickUnhide(items,'scoresTab');
    };

    // Home Tab Articles w/Games
    function homeTab(){
        //This will be for the main page articles that have a score (not scoreboards)
        
        var items=$('article.hasGame:not(.cloned):not(.clone)').has('[class*="team-"][class*="-winner"]');
        cloneNodes(items);

        
    };

    // This is what runs where there are changes
	var observer = new MutationObserver(function(mutations) {
        
        scoresTab();
        //homeTab();

        
        
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