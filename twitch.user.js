// ==UserScript==
// @name         Twitch
// @namespace    http://tampermonkey.net/
// @version      2023.09.21.01
// @description  try to take over the world!
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

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