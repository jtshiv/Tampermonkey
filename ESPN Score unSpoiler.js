// ==UserScript==
// @name         ESPN Score unSpoiler
// @namespace    https://github.com/jtshiv/Tampermonkey
// @version      0.9.5
// @description  Remove scores and spoilers from espn.com
// @updateURL    https://raw.githubusercontent.com/jtshiv/Tampermonkey/main/ESPN%20Score%20unSpoiler.js
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @author       jtshiv
// @match        https://www.espn.com/
// @include      https://www.espn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=espn.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Dev brach:
    // https://raw.githubusercontent.com/jtshiv/Tampermonkey/dev/ESPN%20Score%20unSpoiler.js

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
            .editedBorder{
                border-style:solid;
                border-color:red;
                border-width:thin;
            }
            .scoresTab .cscore_name {
                color: black !important;
            }
            .scoresTab .cscore_score {
                display: none !important;
            }
            .scoresTab .cscore_team:after{
                border-color: transparent !important;
            }
            .scoresTab .cscore_commentary{
                display: none !important;
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
            .lScoresTab .ScoreboardScoreCell__WinnerIcon{
                display: none !important;
            }
            .lScoresTab .ScoreboardScoreCell_Linescores{
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

    

    /**
     * Function to unhide originals when clicked
     * @param  {node} elems element to add class and listener to
     * @param  {string} className class name to remove to unhide
     */
    function clickUnhide(elems,className){
        // This allows for specific css only to this
        elems.addClass('edited editedBorder');
        // The actual listener
        elems.on("click.clickUnhide", function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            this.classList.remove(className);
            this.classList.remove('editedBorder');
            $(this).off("click.clickUnhide");
        });
    };

    // Scores Tab Updates
    function scoresTab(){
        //This section is for the mobile scores overlay from the top right
        
        // Grabs the selector that doesn't already have scoresTab. Needed as
        // otherwise it'll keep adding event listeners to trigger multiple times
        var items=$('.cscore:not(.scoresTab):not(.edited)').has('[data-mptype="scoreboard"]').not(":has('.cscore_score--record')")
        items.addClass('scoresTab');
        
        // Add the click listener to unhide the class
        clickUnhide(items,'scoresTab');
    };

    // Home Tab Articles w/Games
    function homeTab(){
        //This will be for the main page articles that have a score (not scoreboards)
        
        var items=$('article.hasGame:not(.homeTab):not(.edited)').has('[class*="team-"][class*="-winner"]');
        items.addClass('homeTab');
        
        // Add the click listener to unhide the class
        clickUnhide(items,'homeTab');
        
        items=$('section.hasGame:not(.homeTab):not(.edited)').has('[class*="team-"]')
        items.addClass('homeTab');
        clickUnhide(items,'homeTab');

        items=$('article.hasGame:not(.homeTab):not(.edited)').has('[class*="team-"]')
        items.addClass('homeTab');
        clickUnhide(items,'homeTab');
    };

    // League Scores Tab
    // function lScoresTab(){
    //     //Scores tab instead of a league
        
    //     try{
    //         var items=$('section.Scoreboard:not(.lScoresTab)');
    //     }catch(e){
    //         console.log(e);
    //     };
    //     if (!items.length){
    //         try{
    //             var items=$$('section.Scoreboard:not(.lScoresTab)');
    //         }catch(e){
    //             console.log(e);
    //         };
    //     }
    //     items.forEach(function(elem){
    //         elem.classList.add('lScoresTab');
    //     });

    //     // Add the click listener to unhide the class
    //     clickUnhide(items,'lScoresTab');
        
    // };

    // This is what runs where there are changes
	var observer = new MutationObserver(function(mutations) {
        
        scoresTab();
        homeTab();
        // lScoresTab();
        
        
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