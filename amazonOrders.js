// ==UserScript==
// @name         Amazon Orders
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Mobilize Amazon Order Page
// @updateURL    https://raw.githubusercontent.com/jtshiv/Tampermonkey/main/amazonOrders.js
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @author       jtshiv
// @include      https://www.amazon.com/gp/your-account/order-history/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    
    // this code will make a frame and have it target the order page of the first item on the orders
    let frame=document.createElement('iframe');
    frame.id='theframe';
    document.body.appendChild(frame);
    document.querySelectorAll('.a-section.js-item');
    frame.src='https://www.amazon.com/gp/aw/ya?oid=' + document.querySelectorAll('.a-section.js-item a')[0].href.match(/(?:.*orderId=)(.*)(?:&.*)/)[1];
    frame.contentDocument.querySelector('#od-formatted-total')
})();
