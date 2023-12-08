// ==UserScript==
// @name         Menu
// @namespace    http://tampermonkey.net/
// @version      2023.11.07.02
// @description  Show menu of scripts
// @author       You
// @include      *
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(async function() {
    'use strict';
    console.log("Menu script has started");

    // waits until myapi is loaded by utilities
    while (typeof myapi !== 'object') {
        await new Promise(r => setTimeout(r, 100))
    };

    async function checkLoadRequest(force=false){
        // requested by bookmark
        if (typeof (window.menuRequest) != 'undefined' || force === true) {
            // library hasn't yet been loaded
            if (typeof (window.menuLoaded) == 'undefined' || force === true){
                await myapi.httpReq({
                    method: 'GET',
                    url: "http://localhost:8000/menuscripts.js",
                    onload: function (response){
                        myapi.addElem('script',{
                            textContent: response.responseText
                        },document.body);
                        window.menuLoaded = true;
                    }
                })
            }
        } else {
            setTimeout(checkLoadRequest, 100); 
        }
        return;
    }
    checkLoadRequest();

})();