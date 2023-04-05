// ==UserScript==
// @name         Mobile Edit
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Modify css on pages to format better for mobile
// @updateURL    https://raw.githubusercontent.com/jtshiv/Tampermonkey/main/mobileEdit.js
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @author       You
// @match        https://www.amazon.com/gp/your-account/order-history*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("Starting Mobile Edit");

    // Amazon Orders
    if(document.location.href.includes("https://www.amazon.com/gp/your-account/order-history")){
        document.head.querySelectorAll('meta[name="viewport"]').forEach(x=>x.remove());
        var meta = document.createElement('meta');
        meta.content = "width=device-width, maximum-scale=1, minimum-scale=1, initial-scale=1, user-scalable=no, shrink-to-fit=no";
        meta.name = "viewport";
        document.head.appendChild(meta);
        console.log(meta);
        var theid = "styleForMobile";
        document.head.querySelectorAll('#' + theid).forEach(x=>x.remove());
        var css = document.createElement('style');
        css.innerHTML = `
        /* For screens smaller than 1000px (amazon's min width for desktop) */
        @media screen and (max-width: 1000px) {
            [class^="your-orders-content-container"], #navbar-main, #navbar{
                max-width: 100% !important;
            }
            #nav-belt, #navbar, #nav-tools{
                flex-wrap: wrap !important;
            }
            #navbar, #navFooter{
                min-width: unset !important;
            }
            #navFooter{
                overflow: auto !important;
            }
            #nav-belt, #nav-main, #nav-tools a{
                flex: 1 !important;
            }
            .nav-fill{
                /*width: 100% !important;*/
                }
            .a-fixed-right-grid-inner {
                padding-right: 0 !important; /* make full width */
            }
            .a-fixed-right-grid-col { /* make each row take up the full width of the screen and remove the right margin to avoid overlap */
                float: none !important;
                width: 100% !important;
                margin-right: 0 !important;
                margin-bottom: 10px !important; /* add some space between rows */
            }
            /* Order placed and Total columns */
            .a-row{
                display: flex !important;
                /* allow this and child flex's to have even spacing */
            }
            .a-column {
                flex: 1 !important;
            }
            /* Order # and View order details/View invoice columns */
            .a-text-right {
                flex: 1 !important;
                text-align: left !important; /* left-align text */
                /*float: left !important;
                width: 50% !important;
                */
            }
        }`;
        css.id = theid;
        document.head.appendChild(css);
    };


})();
