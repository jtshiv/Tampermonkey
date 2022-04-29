// ==UserScript==
// @name         ESPN Score unSpoiler
// @namespace    http://tampermonkey.net/
// @version      0.2
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


    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

	var observer = new MutationObserver(function(mutations) {
        /*
        //var test=document.createElement('div');
        //test.innerText="Show Score";
        //var referenceNode=$('.cscore_details[data-mptype="scoreboard"] > .cscore_competitors')[0];
        //referenceNode.parentNode.insertBefore(test, referenceNode.nextSibling);

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
        */



        var items=$('.cscore_details[data-mptype="scoreboard"]:not(.cloned):not(.clone)');
        for (var i=0;i<items.length;i++){
            var clone = items[i].cloneNode(true);
            items[i].classList.add('cloned');
            //items[i].classList.add('hidden');
            $(items[i]).hide();
            clone.classList.add('clone');
            insertAfter(clone,items[i]);
        };
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

        //var elems = $('.cscore_time:contains(Final):not(".clicker")');
        var elems = $('.clone:not(".clicker")');
        elems.addClass('clicker');
        elems.on( "click", function(e){
            e.preventDefault();
            this.classList.add('clicked');
            console.log(this);
            $('.cscore_link').has('.clicked').find('.cloned').show();
            $('.cscore_link').has('.clicked').find('.clone').hide();
            this.classList.remove('clicked');
        });

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