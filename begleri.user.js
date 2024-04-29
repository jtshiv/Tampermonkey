// ==UserScript==
// @name         Begleri Beta
// @namespace    http://tampermonkey.net/
// @version      2024.04.29.002
// @match        https://begleritricks.com/progression-ladder
// @icon         https://www.google.com/s2/favicons?sz=64&domain=begleritricks.com
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(async function() {
    'use strict';

    // load script info
    var info = GM_info;
    console.log(info.script.name + " has started");
    
    let begleriStyle = `
        .mainhere h1, .mainhere h2, .mainhere h3, .mainhere p {
            max-width: 100% !important;
        }
        #rightside {
            display: none !important;
        }`;

    // waits until myapi is loaded by utilities
    //      this is needed for adding the max width style
    var apiPromise = new Promise(async resolve=>{
        while (typeof myapi !== 'object') {
            //console.log('api not object');
            await new Promise(r => setTimeout(r, 100))
        };
        resolve(true);
    });
    // after myapi exists
    apiPromise.then(()=>{
        //console.log("api exists")
        myapi.addStyle(begleriStyle);
    });


})();