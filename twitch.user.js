// ==UserScript==
// @name         Twitch Beta
// @namespace    http://tampermonkey.net/
// @version      2023.10.18.01
// @description  try to take over the world!
// @downloadURL  https://raw.githubusercontent.com/jtshiv/Tampermonkey/twitch/twitch.user.js
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @author       jtshiv
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // interval loop to make links behave as links instead of an app
    var linkInterval = setInterval(function(){
        // Select your fallback links using a unique class or ID
        let fallbackLinks = document.querySelectorAll('a:not(.editedByMe)');

        // Attach event listeners to the fallback links
        fallbackLinks.forEach(link => {
            link.classList.add('editedByMe');
            link.addEventListener('click', function (event) {
                event.stopImmediatePropagation();
                event.preventDefault(); // Prevent the default link behavior

                let href = link.href;
                window.location.href = href;

            });
        });
    },500)

    // interval to set handler onto video
    var theInterval = setInterval(function(){
        let video = document.querySelector('video');
        if (video == null){return};

        console.log('video found');
        let overlay = document.querySelector('.click-handler');
        overlay.addEventListener('click',handlePause);
        clearInterval(theInterval);
    },200);

    function handlePause(){
        let video = document.querySelector('video');
        if (video.paused == true){
            video.play();
            console.log('play video');
        } else {
            video.pause();
            console.log('pause video');
        }
    }

})();
