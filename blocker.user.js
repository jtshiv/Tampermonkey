// ==UserScript==
// @name         Blocker
// @namespace    https://github.com/jtshiv/Tampermonkey
// @version      2024.10.01.001
// @description  Custom set of rules to block sites
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @author       jtshiv
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(async function() {
    'use strict';

    // Your code here...
    console.log("Blocker script has started");

    // waits until myapi is loaded by utilities
    async function getmyapi(){
        while (typeof myapi !== 'object') {
            await new Promise(r => setTimeout(r, 100))
        };
        return myapi
    }

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
        } else if (d === 'www.youtube.com'){
            youtube();
        } else if (d === 'm.youtube.com'){
            youtube();
        } else if (d === 'twitter.com'){
            twitter();
        } else if (d === "www.amazon.com"){
            amazon();
        } else if (d === "stackoverflow.com"){
            stackexchange();
        } else if (d === "www.duolingo.com" ){
            duolingo();
        }
        // default will clear the interval if not on supported url
        else {
            clearInterval(startInt);
        }
    }
    
    // Duolingo
    function duolingo(){
        // decline notification prompt
        document.querySelectorAll("[data-focus-lock-disabled]").forEach(x=>{
            x.querySelectorAll("button[data-test='notification-drawer-no-thanks-button']").forEach(y=>y.click());
        });
        
    }

    // Youtube
    var yt_watch_ran = false;
    function youtube(){
        
        // if on video (has watch in url) show snack for 2x speed
        if (document.location.href.indexOf("watch") != -1 && yt_watch_ran == false) {
            yt_watch_ran = true;
            // make sure myapi is loaded
            getmyapi();
            let speed_controller = new function () {
                this.speed_bool = false; // false for 1x, true for 2x
                this.val_speed = 2
                this.val_nospeed = 1
                this.player = document.getElementById("movie_player") || document.getElementsByClassName("html5-video-player")[0]
                
                this.toggleSpeed = function(){
                    // if new speed isn't 1x, have next toggle change back to 1x
                    this.speed_bool = this.getSpeedModified()
                    // toggle speed bool
                    this.speed_bool = !this.speed_bool;
                    // speed
                    if (this.speed_bool){
                        this.snackbar.hide()
                        speedSet(this.val_speed)
                        this.snackbar.setText(this.val_speed + "x speed")
                        this.snackbar.show()
                    } else{
                        this.snackbar.hide()
                        speedSet(this.val_nospeed)
                        this.snackbar.setText(this.val_nospeed + "x speed")
                        this.snackbar.show()
                    }
                    // set snackbar
                }

                this.getSpeedModified = function(){
                    return this.player.getPlaybackRate() != 1
                }

                // yt natively has an iframe api for playback rate change. this attaches to that and updates the snackbar text for the current speed
                this.player.addEventListener('onPlaybackRateChange', function(event) {
                    // if new speed isn't 1x, have next toggle change back to 1x
                    this.speed_bool = this.getSpeedModified()
                    this.snackbar.setText(event + "x speed")
                    this.snackbar.show()
                    console.log('Playback rate changed to:', event); // returns the int value of the speed
                }.bind(this));
                console.log("Playback listener attached")
                
                // this has to be below the toggleSpeed declaration as it won't hoist
                this.snackbar = new myapi.snackbar(this.player.getPlaybackRate() + "x speed",0,this.toggleSpeed.bind(this))
                this.snackbar.show()
            
                // Add an event listener for the fullscreenchange event
                document.addEventListener('fullscreenchange', function(event) {
                    // Check if the element is currently in fullscreen mode
                    if (!document.fullscreenElement) {
                        this.snackbar.show();
                    } else {
                        this.snackbar.hide();
                    }
                }.bind(this));

                // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                // The below function is private
                // with it being let, it's only visible to this object
                // remember to bind this to it if using this
                // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                let speedSet = function(value){
                    this.player.setPlaybackRate(parseFloat(value))
                    this.snackbar.show();
                }.bind(this)
                
            }
            console.log("speed_controller initialized")
        }

        // pause overlay
        document.querySelectorAll('.ytp-pause-overlay-container').forEach(x=>x.remove());
        document.querySelectorAll('a[href]').forEach(x=>{
            let newHref = stripTParameters(x.href);
            x.href = newHref;
        });
        // kill element causing scroll lock for their stupid vendetta against adblock
        document.querySelectorAll('tp-yt-paper-dialog.ytd-popup-container').forEach(x=>x.remove());

        // follow links instead of loading in a frame
        var theinterval = setInterval(function(){
            // Select your fallback links using a unique class or ID
            let fallbackLinks = document.querySelectorAll('a:not(.editedByMe)');
            let shortsLinks = document.querySelectorAll('a[href*="youtube.com/shorts/"]');

            // console.log(fallbackLinks.length);
            var comments = document.querySelectorAll('#comment:not(.editedByMe) a');
            // console.log(comments.length);
            var newFall = [...fallbackLinks].filter(x=>{
	            for (let i=0; i<comments.length; i++){
		            if (x == comments[i]){
			            return false;
		            }
	            }
	            return true;
            })
            fallbackLinks = newFall;
            comments.forEach(x=>{
                x.classList.add('editedByMe');
            });

            // Attach event listeners to the fallback links
            fallbackLinks.forEach(link => {
                link.classList.add('editedByMe');
                // change click function to use href
                link.addEventListener('click', function (event) {
                    event.stopImmediatePropagation();
                    event.preventDefault(); // Prevent the default link behavior

                    let href = link.href;
                    // change shorts to normal videos
                    href = href.replace("youtube.com/shorts/","youtube.com/watch?v=");
                    window.location.href = href;

                });
            });

            // remove the yt shorts url with normal watch
            shortsLinks.forEach(link => {
                let href = link.href;
                // change shorts to normal videos
                href = href.replace("youtube.com/shorts/","youtube.com/watch?v=");
                link.href = href
            })

        }, 500);
    };

    function stripTParameters(text) {
        const regex = /(\?|&amp;|&)t=\d+/gi;
        return text.replace(regex, '');
    };

    // Amazon
    function amazon(){
        // buy again at bottom
        [...document.querySelectorAll('#rhf')].forEach(x=>x.remove());
        // remove tracker portion in <a> links
        document.querySelectorAll('a').forEach(x=>{
            if (!x.href.includes('/dp/')){return};
            x.href = x.href.match(/(^.*\/dp\/(?:(?!\/|\?).)*)/gi,"")[0];
        });
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
