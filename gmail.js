// ==UserScript==
// @name         Gmail
// @namespace    http://tampermonkey.net/
// @version      2023.08.30.3
// @description  try to take over the world!
// @author       You
// @match        https://mail.google.com/mail/u/0/#inbox
// @include      https://mail.google.com/mail/u/0/*
// @require      file://C:\Users\shivjo5\Documents\Scripts\Tampermonkey\Gmail.js
// @icon         https://mail.google.com/favicon.ico
// @run-at       document-idle
// @grant        none
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    /* Your code here... */
    console.log('Gmail script started');

    var tableChngWrk;
    var download;
    var dragdownload = document.createElement("span");
    dragdownload.innerText = "Download";

    if(document.querySelector('#thestyle')){document.querySelector('#thestyle').remove()};
    let thestyle = document.createElement('style');
    thestyle.id = 'thestyle';
    thestyle.innerHTML=
        `   :root{
                --threadWidth: 100px
            }

            /* reader window disable horizontal scroll */
            .aZ6 {overflow-x: hidden !important}

            /* image max width */
            .CToWUd { max-width:100% !important;height:auto !important; }

            /* hide bart solutions logo */
            .sgn_bart_logo_top {display: none !important}

            .table-scroll{overflow:auto;}
            table[role="presentation"] > tr{display:inline !important;}

            /* sender field max width so you can see email title */
            .zA>.yX {max-width: 125px !important}

            /* for agenda portion of calendar invites be readable. will cause to scroll */
            /* cal block */
            .aU9 {max-width: var(--threadWidth) !important}
            /* icon portion */
            /* .aU9 .aRi {} */
            /* agenda portion */
            .aU9 .aRc {width:40% !important}

            /* individual email match thread width */
            div.adn.ads .gs{max-width:var(--threadWidth) !important;}

            /* table-wrapper match thread width */
            .table-wrapper, .table-wrapper table {max-width: var(--threadWidth) !important}

            /* gmail quoted blocks for prior emails. first scrolls */
            div.first_gmail_quote {
                overflow-x: auto !important;
                max-width: var(--threadWidth) !important;
            }
            div.gmail_quote {
                width: fit-content !important
            }
            /*div.first_gmail_quote div {max-width: var(--threadWidth) !important}*/
            `

            //.xT{flex-direction: column !important}
    document.head.append(thestyle);
    tableChngWrk = 0;

    function wrap(toWrap, wrapper) {
        wrapper = wrapper || document.createElement('div');
        toWrap.parentNode.appendChild(wrapper);
        wrapper.appendChild(toWrap);
        return wrapper;
    };

    function tableChng() {

        document.querySelectorAll('div[role=main] div.gs :not(.gE) table:not(.tableformatted)').forEach(x=>{
            let scr = wrap(x)
            scr.classList.add('table-scroll');
            wrap(scr).classList.add('table-wrapper');
            x.classList.add('tableformatted');
        });
        tableChngWrk=0;
    };

    /* run formatting function every half second */
    setInterval(formatting,500);
    function formatting() {
        try{
            /*sets div.gs (the individual email thread box) to the header width minus the left border for profile icons*/

            /* define offset due to profile image */
            var maxOffset = 0;
            let profileImg = document.querySelectorAll('div[role=main] div.adn.ads div.aju');
            profileImg.forEach(x=>{
                if(x.offsetParent!=null){
                    maxOffset = Math.max(maxOffset, x.offsetWidth);
                }
            });
            maxOffset+=48;

            // Remove Bart Solutions add from threads
            //document.querySelectorAll('.sgn_bart_logo_top').forEach(x=>x.remove());

            /* identify the thread which contains the profile img of senders and individual emails */
            let thread = document.querySelector('div[role=main] div.nH.ao8');

            /* set css variable threadWidth to thread - profile image offset */
            let r = document.querySelector(':root');
            r.style.setProperty('--threadWidth',(thread.offsetWidth-maxOffset) + 'px');

            let eml = Array.from(document.querySelectorAll('div[role=main] div.gs'));

            /* Look at each email in opened thread and add class to first gmail quote
            This is so that you can horizontal scroll them
            */
            eml.forEach(x=>{
                try{
                    x.querySelector('div.gmail_quote').classList.add('first_gmail_quote');
                }catch(e){};
            });


            if (tableChngWrk === 0) {
                tableChngWrk = 1;
                tableChng();
            };


        }catch(e){};
    };




    // Set OpenDyslexic font for Gmail from Utilities
    function initialDyslexic() {
        console.log("Gmail trying to enable OpenDyslexic...");
        if (typeof toggleDyslexic === 'function') {
            // if the function from Utilities exists, execute
            window.toggleDyslexic();
        } else {
            setTimeout(initialDyslexic,500);
        }
    }
    initialDyslexic()

})();
