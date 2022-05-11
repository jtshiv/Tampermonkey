// ==UserScript==
// @name         Bookmarklet Library
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       jtshiv
// @include      *
// @updateURL	 https://github.com/jtshiv/Tampermonkey/raw/main/bookmarkLibrary.js
// @downloadURL	 https://github.com/jtshiv/Tampermonkey/raw/main/bookmarkLibrary.js
// @resource     bmlib    https://github.com/jtshiv/Bookmarklets/raw/main/bmlib.js?v=" + Date.now() + "'
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_getResourceText
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    function checkLibraryLoadRequest(){
        if (typeof (unsafeWindow.Bm_bLibraryRequest) != 'undefined') {      // value set as request from bookmarklet
            if (typeof (unsafeWindow.Bm_bLibraryLoaded) == 'undefined') {    // value set inside library script
                var sBMLibSource = GM_getResourceText ('bmlib');
                var oScript = document.createElement ('script');
                oScript.type = 'text/javascript';
                oScript.text = sBMLibSource;
                // document.getElementsByTagName ('head')[0].appendChild (oScript);
                document.body.appendChild (oScript);
            }

        } else {
            setTimeout (checkLibraryLoadRequest, 100);   // check every 100 ms
        }

        return;
    } // checkLibraryLoadRequest


    checkLibraryLoadRequest();


    // EXAMPLE Bookmarklet shell/template:
    // javascript:(function(){window.Bm_bLibraryRequest=true;setTimeout(function(){window['***FUNCTION-NAME***']();},200);})()
})();