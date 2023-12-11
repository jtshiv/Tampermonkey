// ==UserScript==
// @name         Menu Beta
// @version      2023.12.11.02
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

    // load script info to determine which menu url to open
    var info = GM_info;
    var scriptslink;
    if (info.script.name === "Menu"){
        scriptslink = "https://github.com/jtshiv/Tampermonkey/raw/main/menuscripts.js";
    } else { // is beta
        scriptslink = "https://github.com/jtshiv/Tampermonkey/raw/menu/menuscripts.js";
    }

    console.log("Menu will load from: " + scriptslink);

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
                    url: scriptslink,
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