// ==UserScript==
// @name         Blocker
// @namespace    https://github.com/jtshiv/Tampermonkey
// @version      0.5.5
// @description  Custom set of rules to block sites
// @updateURL    https://raw.githubusercontent.com/jtshiv/Tampermonkey/main/blocker.js
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @author       jtshiv
// @include      *
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
        let d = document.domain;
        let stkexch = ['stackexchange.com','stackoverflow.com','askubuntu.com'];
        let stkWin = stkexch.filter(x=>{return window.location.href.includes(x)});
        if (d === 'www.automateexcel.com'){
            automateExcel();
        } else if(document.querySelectorAll('.s-topbar--item[href="https://stackexchange.com"]').length){
            // alternate stack exchange site finder based on link to main site
            stackexchange();
        } else if (d === 'www.reddit.com'){
            reddit();
        } else if (d === 'twitter.com'){
            twitter();
        } else if (d === "www.amazon.com"){
            amazon();
        } else if (d === "stackoverflow.com"){
            stackexchange();
        }
        // default will clear the interval if not on supported url
        else {
            clearInterval(startInt);
        }
    }
    
    // Amazon
    function amazon(){
        // buy again at bottom
        [...document.querySelectorAll('#rhf')].forEach(x=>x.remove());
    }

    // Twitter
    function twitter(){
        // the you gotsta sign in herp derp window and scroll block
        [...document.querySelectorAll('div[role="group"]')].forEach(x=>{
                [...document.querySelectorAll('[data-testid="sheetDialog"]')].forEach(y=>x.remove());
        });
        document.querySelector('html').style.overflow="auto";
        // credential picker for google
        document.querySelectorAll('#credential_picker_iframe').forEach(x=>x.remove());
        // twits are better in app dawg
        document.querySelectorAll('.r-l5o3uw').forEach(x=>{
            x.querySelectorAll('span').forEach(y=>{
                y.innerText === "Not now" ? y.click() : null;
            })
        });
    }

    // Reddit
    function reddit(){
        // auto click the stupid 'see this post in app' banner
        try{
            [...document.querySelector('shreddit-experience-tree').shadowRoot.querySelector('shreddit-async-loader').shadowRoot.querySelector('xpromo-app-selector').shadowRoot.querySelectorAll('button.continue')].forEach(x=>x.click());
        }catch(e){};
        // another type of 'see in app' banner
        try{
            document.querySelectorAll('button.XPromoPopup__actionButton').forEach(x=>{
                if(x.innerText=="Continue"){x.click()};
            });
        }catch(e){};
        // auto click stupid view more button
        try{
            [...document.querySelector('shreddit-comment-tree').shadowRoot.querySelectorAll('button.expand-button')].forEach(x=>x.click());
        }catch(e){};
        // remove stupid unverified subreddit blocker garbage shit
        try{
            [...document.querySelectorAll('.XPromoBlockingModal.m-active')].forEach(x=>x.classList.remove('m-active'));
        }catch(e){};
        // allow scroll when their shitty blocker pops up
        try{
            [...document.querySelectorAll('body.scroll-disabled')].forEach(x=>x.classList.remove('scroll-disabled'));
        }catch(e){};

    }

    // Duck Duck Go web default if not defined
    // Not in the interval so that it loads earlier
    /*if (document.domain === 'duckduckgo.com'){
        if (!window.location.href.includes("&ia=")){
            window.open(window.location.href + "&ia=web","_self");
        }
    };*/

    // Stack Exchange Sites
    function stackexchange(){
        // bottom sign up bar
        [...document.querySelectorAll('[data-campaign-name="stk"]')].forEach(x=>x.remove());
        // remove sidebar & make main bar fill space
        [...document.querySelectorAll('#sidebar')].forEach(x=>x.remove());
        [...document.querySelectorAll('#mainbar')].forEach(x=>x.style.width = 'auto');
        // bottom-left consent pane
        [...document.querySelectorAll('.js-consent-banner')].forEach(x=>x.remove());
        // top info pane about other se sites
        [...document.querySelectorAll('.js-dismissable-hero')].forEach(x=>x.remove());
        // teams pane in left sidebar
        [...document.querySelectorAll('.js-freemium-cta')].forEach(x=>x.remove());
    }

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
