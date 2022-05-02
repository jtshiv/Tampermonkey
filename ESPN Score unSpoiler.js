// ==UserScript==
// @name         ESPN Score unSpoiler
// @namespace    https://github.com/jtshiv/Tampermonkey
// @version      0.8
// @description  Remove scores and spoilers from espn.com
// @updateURL    https://github.com/jtshiv/Tampermonkey/raw/main/ESPN%20Score%20unSpoiler.js
// @author       jtshiv
// @match        https://www.espn.com/
// @include      https://www.espn.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=espn.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Dev brach:
    // https://github.com/jtshiv/Tampermonkey/raw/espnDev/ESPN%20Score%20unSpoiler.js

    console.log('ESPN Score unSpoiler script started');
	$(document).ready(function(){
		console.log('Document ready');

        // Add CSS to do the edits to the classes.
        // This does the heavy lifting then the other
        // JS will just add or remove classes.
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

            .homeTab .game-details span{
                display: none !important;
            }
            .homeTab .record{
                display: none !important;
            }
            .homeTab .team-name > *{
                color: black !important;
            }
            .homeTab .team-name{
                color: black !important;
            }
            .homeTab .score-container{
                display: none !important;
            }
            .homeTab .contentItem__title{
                display: none !important;
            }

            .lScoresTab [class^="ScoreCell__"]{
                color: black !important;
            }
            .lScoresTab .ScoreCell__Score{
                display: none !important;
            }
            .lScoresTab .ScoreCell__WinnerIcon{
                display: none !important;
            }
            `;
        document.head.appendChild(style);
	});

    // Function to insert node in after another
    // Keeping here just in case
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    

    // Function to unhide originals when clicked
    function clickUnhide(elems,className){
        elems.on("click.clickUnhide", function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            this.classList.remove(className);
            $(this).off("click.clickUnhide");
        });
    };

    // Scores Tab Updates
    function scoresTab(){
        //This section is for the mobile scores overlay from the top right
        
        // Grabs the selector that doesn't already have scoresTab. Needed as
        // otherwise it'll keep adding event listeners to trigger multiple times
        var items=$('.cscore--final:not(.scoresTab)').has('[data-mptype="scoreboard"]');
        items.addClass('scoresTab');
        
        // Add the click listener to unhide the class
        clickUnhide(items,'scoresTab');
    };

    // Home Tab Articles w/Games
    function homeTab(){
        //This will be for the main page articles that have a score (not scoreboards)
        
        var items=$('article.hasGame:not(.homeTab)').has('[class*="team-"][class*="-winner"]');
        items.addClass('homeTab'); // Does nothing yet

        // Add the click listener to unhide the class
        clickUnhide(items,'homeTab');
        
    };

    // League Scores Tab
    function lScoresTab(){
        //Scores tab instead of a league
        
        var items=$('section.Scoreboard:not(.lScoresTab)');
        items.addClass('lScoresTab'); // Does nothing yet

        // Add the click listener to unhide the class
        clickUnhide(items,'lScoresTab');
        
    };

    // This is what runs where there are changes
	var observer = new MutationObserver(function(mutations) {
        
        scoresTab();
        homeTab();
        lScoresTab();
        
        
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