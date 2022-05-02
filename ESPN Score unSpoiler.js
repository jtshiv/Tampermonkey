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
    function clickUnhide(){
        var elems = $('.clone:not(".clicker")');
        elems.addClass('clicker');
        elems.on("click.clickUnhide", function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            this.classList.add('clicked');
            console.log(this);
            $('.cscore_link').has('.clicked').find('.cloned').show();
            $('.cscore_link').has('.clicked').find('.clone').hide();
            this.classList.remove('clicked');
        });
    };

    // Scores Tab Updates
    function scoresTab(){
        //This section is for the mobile scores overlay from the top right
        
        // items are all the non clone/clones since we only want to do this once and it refreshes
        // on dom changes
        var items=$('.cscore_details[data-mptype="scoreboard"]:not(.cloned):not(.clone)');
        cloneNodes(items);

        // Now make format edits to only the clones
        var clones=$('.clone');
        try{
            $(clones).find('.cscore_name').css('color','black');
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
            $(clones).find('.cscore_score').hide();
        } catch(e){
            console.log(e);
        }
        
        // after formatting changes, add the click listener to unhide the originals
        clickUnhide();
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