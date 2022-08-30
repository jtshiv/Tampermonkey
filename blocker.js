// ==UserScript==
// @name         Blocker
// @namespace    https://github.com/jtshiv/Tampermonkey
// @version      0.2
// @description  Custom set of rules to block sites
// @updateURL    https://raw.githubusercontent.com/jtshiv/Tampermonkey/main/blocker.js
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @author       jtshiv
// @match        https://www.automateexcel.com/*
// @match        https://duckduckgo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("Blocker script has started");

    // interval that loads fn based on domain
    var startInt = setInterval(starter,500);
    function starter(){
        switch (document.domain){
            case 'www.automateexcel.com':
                automateExcel();
                break;
            default:
                // clear interval if not on supported domain
                clearInterval(startInt);
        }
    }

    // Duck Duck Go web default if not defined
    // Not in the interval so that it loads earlier
    if (document.domain === 'duckduckgo.com'){
        if (!window.location.href.includes("&ia=")){
            window.open(window.location.href + "&ia=web","_self");
        }
    };

    // Automate Excel
    function automateExcel(){
        // any paid vba button
        [...document.querySelectorAll('.success')].filter(x=>{
            return x.querySelector('.vba-button');
        }).forEach(x=>x.remove());
        // any paras with the link for their automacro
        [...document.querySelectorAll('p')].filter(x=>{
            return x.querySelector('a[href*="automacro"]');
        }).forEach(x=>x.remove());
        // their sidebars
        document.querySelectorAll('#right-column').forEach(x=>x.remove());
        document.querySelectorAll('#left-column').forEach(x=>x.remove());
        // bottom floating ad
        document.querySelectorAll('.floating-footer').forEach(x=>x.remove());
        // delayed popup ad
        document.querySelectorAll('#delayed-vba-popup-wrapper').forEach(x=>x.remove());
        // info-box w/ link to automacro
        [...document.querySelectorAll('.code-block')].filter(x=>{
            return x.querySelector('.info-box');
        }).forEach(x=>{
            if (x.querySelector('a[href*="automacro"]')){
                x.remove();
            }
        });
    }

})();
