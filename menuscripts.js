/*
Load a function from this using the following bookmarklet:

javascript:(
    async()=>{
        var fn='mainScript';
        var par=null;
        window.menuRequest=1;
        await new Promise(async (res)=>{
            while (typeof window[fn]!=='function'){
                await new Promise(r=>setTimeout(r,100));
            };
            res();
        });
        window[fn](par)
    }
)()

*/

console.log("menuscripts.js loaded");

function mainScript(){
    // Basing modals off this:
    // https://www.w3schools.com/howto/howto_css_modals.asp

    let host = document.location.host;
    let href = document.location.href;
    let baseurl = location.protocol + '//' + location.host + location.pathname;

    // Create the CSS
    let innerstyle=`
        /* The Modal (background) */
        .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 99999999999999; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            font-size: 20px;
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0,0,0); /* Fallback color */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }
        /* Modal Header */
        .modal-header {
            padding: 2px 16px;
            font-size: 120%;
            font-weight: bold;
            background-color: #f44336;
            color: white;
        }
        /* Modal Body */
        .modal-body {
            padding: 2px 16px;
            color: black;
        }

        .modal-body:hover{
            cursor: pointer;
        }

        /* Modal Content */
        .modal-content {
            position: relative;
            background-color: #fefefe;
            margin: auto;
            padding: 0;
            border: 1px solid #888;
            width: 80%;
            max-width: 400px;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
        }
        @media only screen and (max-width: 600px) {
            .modal{
                font-size: 18px;
            }
            .modal-content {
                width: 90%;
            }
        }

        /* The Close Button */
        .close {
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
    `
    let style = myapi.addElem("style",{id:"mainstyle",textContent:innerstyle},document.head);


    // Create the modal
        // needed to use GM's add element to bypass csp errores editing innerHTML
    let modal = myapi.addElem("div",{id:"myModal",class:'modal',style:'display:block'},document.body);
        let modalcontent = myapi.addElem("div",{class:"modal-content"},modal);
            let modalheader = myapi.addElem("div",{class:"modal-header"},modalcontent);
                myapi.addElem("span",{class:"close",textContent:"x"},modalheader);
                myapi.addElem("div",{textContent:"Scripts"},modalheader);
            myapi.addElem("div",{class:"modal-body"},modalcontent);

    // Show and add listener to close on x
    let span = document.getElementsByClassName("close")[0];
    span.addEventListener('click', hideModal);
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', hideModal);

    // Set functions
    myapi.addElem('p',{id:'toggledys',textContent:'Toggle Dyslexic'},modal.querySelector('.modal-body')).addEventListener('click',myapi.toggleDyslexic);
    myapi.addElem('p',{id:'copyClicked',textContent:'Copy Clicked Element'},modal.querySelector('.modal-body')).addEventListener('click',copyClicked);
    myapi.addElem('p',{id:'playbackSpeed',textContent:'Playback Speed'},modal.querySelector('.modal-body')).addEventListener('click',playbackSpeed);

    // functions by host
    if (host == 'mail.google.com'){
        myapi.addElem('p',{id:'hostheader',textContent:'~~~Host Specific~~~'},modal.querySelector('.modal-body'));
        myapi.addElem('p',{id:'gmQuote',textContent:'GMail Quotes'},modal.querySelector('.modal-body')).addEventListener('click',gmQuote);
        
        
    } else if (host == 'en.wikipedia.org'){
        myapi.addElem('p',{id:'rmWikiRef',textContent:'Remove Wikipedia References'},modal.querySelector('.modal-body')).addEventListener('click',rmWikiRef);
    
    } else if (host == 'oldschool.runescape.wiki'){
        myapi.addElem('p',{id:'hostheader',textContent:'~~~Host Specific~~~'},modal.querySelector('.modal-body'));
        myapi.addElem('p',{id:'osrsToc',textContent:'OSRS Floating ToC'},modal.querySelector('.modal-body')).addEventListener('click',osrsToc);
        
    } else if (host == 'www.youtube.com' || host == 'm.youtube.com'){
        myapi.addElem('p',{id:'hostheader',textContent:'~~~Host Specific~~~'},modal.querySelector('.modal-body'));
        myapi.addElem('p',{id:'rmListYt',textContent:'Remove List from YT Urls'},modal.querySelector('.modal-body')).addEventListener('click',rmListYt);
        myapi.addElem('p',{id:'rmWatchedYt',textContent:'Remove Watched from YT Playlist'},modal.querySelector('.modal-body')).addEventListener('click',rmWatchedYt);
        myapi.addElem('p',{id:'ytChannelToPlaylist',textContent:'YT Channel to Upload Playlist'},modal.querySelector('.modal-body')).addEventListener('click',ytChannelToPlaylist);

    } else if (host == "www.biblegateway.com"){
        myapi.addElem('p',{id:'hostheader',textContent:'~~~Host Specific~~~'},modal.querySelector('.modal-body'));
        myapi.addElem('p',{id:'bibleGateRemVerse',textContent:'Remove Verse Numbers'},modal.querySelector('.modal-body')).addEventListener('click',bibleGateRemVerse);
        myapi.addElem('p',{id:'bibleGateRemVerse',textContent:'Remove Verse Numbers - HTML'},modal.querySelector('.modal-body')).addEventListener('click',bibleGateRemVerse.bind(null,true));

    }


    // functions by baseurl
    if (baseurl == 'https://verizon.us2.blackline.com/Modules/Reconciliations/ExecGrid.aspx'){ // bsqSearch function
        myapi.addElem('p',{id:'baseheader',textContent:'~~~Base URL Specific~~~'},modal.querySelector('.modal-body'));
        myapi.addElem('p',{id:'bsqSearch',textContent:'BSQ ID Search'},modal.querySelector('.modal-body')).addEventListener('click',bsqSearch);
    }

    // functions by href
    if (href == 'https://oldschool.runescape.wiki/w/Optimal_quest_guide'){
        myapi.addElem('p',{id:'hrefheader',textContent:'~~~Page Specific~~~'},modal.querySelector('.modal-body'));
        myapi.addElem('p',{id:'osrsOptimalQuestGuide',textContent:'Check boxes based on completed quests'},modal.querySelector('.modal-body')).addEventListener('click',osrsOptimalQuestGuide);
        myapi.addElem('p',{id:'osrsOqgToggle',textContent:'Toggle visibility of completed quests'},modal.querySelector('.modal-body')).addEventListener('click',osrsOqgToggleCompleted);
        myapi.addElem('p',{id:'osrsFirstIncomplete',textContent:'Scroll to first incomplete quest'},modal.querySelector('.modal-body')).addEventListener('click',osrsFirstIncomplete);

    }



}

function hideModal(){
    document.querySelectorAll('#myModal').forEach(async modal=>{
        modal.style.display="none";
        await new Promise(r=>setTimeout(r,5000));
        modal.remove();
    });
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//
//
//
//
//
// functions below
//
//
//
//
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~





function bibleGateRemVerse(getHtml=false){
    hideModal();

    document.querySelectorAll('sup.versenum').forEach(x=>x.remove());
    document.querySelectorAll('.footnotes').forEach(x=>x.remove());
    document.querySelectorAll('.footnote').forEach(x=>x.remove());
    document.querySelectorAll('.full-chap-link').forEach(x=>x.remove());
    document.querySelectorAll('.passage-other-trans').forEach(x=>x.remove());
    document.querySelectorAll('.copyright-table').forEach(x=>x.remove());
    document.querySelectorAll('.passage-scroller').forEach(x=>x.remove());
    if (getHtml == true){
        var day = prompt("What day?");
        if (day == undefined){return};
        var text = "<h1>Day " + day + "</h1>\n" + document.querySelector('.passage-box').innerText;
        text = text.replaceAll("\n","<br>");
        text = text.replaceAll(/\s+/g, ' '); // to fix BG's weird spacing on poems

         // Convert day to a 3-digit number with leading zeros for file
        var paddedDay = day.toString().padStart(3, '0');
        // Create a Blob containing the text
        var blob = new Blob([text], { type: 'text/html' });
        // Create a download link
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'day' + paddedDay + '.html';
        a.style.display = 'none';
        document.body.appendChild(a);

        // Trigger the download
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    } else{
        var text = document.querySelector('.passage-box').innerText;
    }
    
    myapi.copyText(text);
    myapi.createSnackbarFade("Copied verse");
}



function rmListYt(){
    hideModal();

    // run every second for when user scrolls down
    let listInterval = setInterval(function(){
        let reg = /&list=.*&index=\d+/;
        /*desktop*/
        let elem;
        for (elem of document.querySelectorAll('#video-title')){
            try{
                elem.href = elem.href.replace(reg,"");
            }catch(e){};
        }
        /*mobile image*/
        for (elem of document.querySelectorAll('.compact-media-item-image')){
            try{
                elem.href = elem.href.replace(reg,"");
            }catch(e){};
        }
        /*mobile other*/
        for (elem of document.querySelectorAll('.compact-media-item-metadata-content')){
            try{
                elem.href = elem.href.replace(reg,"");
            }catch(e){};
        }

    },1000);

}

function rmWatchedYt(){
    hideModal();

    // run every second for when user scrolls down
    let listInterval = setInterval(function(){
        let elems = document.querySelectorAll('ytd-playlist-video-renderer.ytd-playlist-video-list-renderer,ytm-playlist-video-renderer');

        //check if there's loading spinner in the bottom
        // mobile is: ytm-continuation-item-renderer class=spinner
        if(document.querySelectorAll('ytd-continuation-item-renderer,ytm-continuation-item-renderer').length > 0){
            let ratio = .8;
            elems.forEach(x=>{
                let y = x.querySelectorAll('#progress,div.thumbnail-overlay-resume-playback-progress');
                y.forEach(prog=>{
                    try {
                        if(prog.offsetWidth / prog.parentNode.offsetWidth >= ratio){
                            x.remove();
                        };
                    } catch(e){};
                });
            });
        } else { // desktop
            let ratio = .8;
            elems.forEach(x=>{
                let y = x.querySelectorAll('#progress,div.thumbnail-overlay-resume-playback-progress');
                y.forEach(prog=>{
                    try {
                        if(prog.offsetWidth / prog.parentNode.offsetWidth >= ratio){
                            x.remove();
                        };
                    } catch(e){};
                });
            });
        }
    },1000);
};

// Go from YouTube Channel to the uploads playlist full
function ytChannelToPlaylist(){
    let base = document.querySelector('meta[property="og:url"][content*="channel\/UC"]');
    if (base===null){return};
    let id = "UU" + base.content.replace(/.*channel\/UC/,'');
    window.open('https://www.youtube.com/playlist?list=' + id,'_self');
}


function playbackSpeed(){
    hideModal();

    let answer = prompt("What playback speed? Set as 1 for 100%.");/* Pausing will reset the playback speed");*/
    if(answer!=null){
        let elems = document.getElementsByTagName('video');
        if(elems.length){
            elems[0].playbackRate=parseFloat(answer);
        } else{
            alert("Video element not found");
        };
    };
};


function osrsFirstIncomplete(){
    hideModal();
    // it finds and scrolls to the first red X for an incomplete quest
    document.querySelectorAll('img.qc-not-started')[0].scrollIntoView( {
        block: "center", inline: "nearest", behavior:"smooth"
    });
}

function osrsToc() {
    hideModal();
    /* Check if the floating-toc style element already exists */
    if (document.getElementById('floating-toc-style')) {
        return; /* Exit if the style element already exists */
    }

    /* Select the table of contents element */
    var tocElement = document.querySelector('#toc');
    document.querySelectorAll('#tocclone').forEach(x=>x.remove());
    var tocClone = tocElement.cloneNode(true);
    tocClone.id = 'tocclone';
    // tocClone.classList.add('toc-hide');
    tocElement.parentElement.insertBefore(tocClone,tocElement);
    var r = document.querySelector(':root');
    function getRect(){
        let rect = tocElement.getBoundingClientRect();
        r.style.setProperty('--tocTop',rect.top + "px");
        r.style.setProperty('--tocLeft',rect.left + "px");
        r.style.setProperty('--tocWidth',rect.width + "px");
        r.style.setProperty('--tocHeight',rect.height + "px");
    }
    getRect();

    /* Get the initial offset position of the table of contents */
    var tocOffset = tocElement.offsetTop;
    var tocOffsetLeft = tocElement.offsetLeft;

    /* Create a new <style> element for the floating-toc CSS */
    document.querySelectorAll('#floating-toc-style').forEach(x=>x.remove());
    var styleElement = document.createElement('style');
    styleElement.id = 'floating-toc-style';
    styleElement.innerHTML = `
        /* CSS for the floating-toc */
        .floating-toc {
        position: fixed !important;
        top: var(--tocTop) !important;
        left: var(--tocLeft) !important;
        z-index: 9999 !important;
        }
        .toc {
        margin-top: 1em;
        padding: 0;
        }
        .toc-hide {
            display: none !important;
        }
        /* without this the sidebar stays on top of toc */
        .vector-body {
            z-index: auto !important;
        }
        #tocclone{
            position: fixed !important;
            z-index: 9999 !important;
        }
        .toc-move-forwards{
            animation: slideRect 1s forwards;
        }
        .toc-move-backwards{
            animation: slideRectBack 1s forwards;
        }
        @keyframes slideRect {
            from {
                top: var(--tocTop);
                left: var(--tocLeft);
                width: var(--tocWidth);
            }
            to {
                top: 0px;
                left: 0px;
                width: 13em;
            }
        }
        @keyframes slideRectBack {
            from {
                top: 0px;
                left: 0px;
                width: 13em;
                opacity: 100%;
            }
            to {
                top: var(--tocTop);
                left: var(--tocLeft);
                width: var(--tocWidth);
                opacity: 0;
            }
        }
        
    `;

    /* Inject the <style> element into the <head> of the document */
    document.head.appendChild(styleElement);
    
    function scrollListener() {
        /* Calculate the current scroll position */
        var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        /* Check if the scroll position has passed the table of contents */
        if (scrollPosition >= tocOffset) {
            /* Add a CSS class to make the table of contents float */
            getRect();
            tocClone.classList.remove('toc-move-backwards');
            tocClone.classList.add('toc-move-forwards');
            getRect();
        } else {
            /* Remove the CSS class if the scroll position is above the table of contents */
            getRect();
            tocClone.classList.remove('toc-move-forwards');
            tocClone.classList.add('toc-move-backwards');
            getRect();
        }
    }

    /* Add a scroll event listener */
    window.addEventListener('scroll', scrollListener);
    scrollListener();
};

/**
 * Goes through the Optimal Quest Guide on OSRS Wiki and checks the boxes at the
 * top based on the quests marked as completed in the main list.
 * @returns {any}
 */
function osrsOptimalQuestGuide(){
    hideModal();
    document.querySelectorAll('li:not(.checked)>a:first-child').forEach(x=>{
        let y = document.querySelector('tr.highlight-on[data-rowid="' + x.innerText + '"]');
        if (y){
            x.parentElement.classList.add("checked");
        }
    });

}

/**
 * Toggle the completed quests on list to make scrolling easier
 * @returns {any}
 */
function osrsOqgToggleCompleted(){
    
    let tohide;
    // check if .hide-highlight is used or not
    let hidden = document.querySelectorAll('.hide-highlight').length;
    if (hidden >= 1){ // at least some hidden so rem classes
        tohide = 0;
    } else{
        tohide = 1;
    }

    // go through and either add class or remove
    let highlighted = document.querySelectorAll('tr.highlight-on');

    highlighted.forEach(x=>{
        if (tohide === 1){
            x.classList.add('hide-highlight');
        } else {
            try {
                x.classList.remove('hide-highlight');
            } catch (error) {
                
            }
        }
    })


    /* css to hide children of highlighted */
    let id = 'osrsOqgT';
    document.querySelectorAll('#' + id).forEach(x=>{x.remove()});
    let styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.innerHTML = `
        .hide-highlight{
            height: 20px;
            display: block;
            background-color: #bbee91;
        }
        .hide-highlight > * {
            display: none;
        }
    `;

    document.head.appendChild(styleElement);
}


function rmWikiRef(){
    hideModal();
    document.querySelectorAll('.reference').forEach(x=>x.remove());
}

function gmQuote(){
    hideModal();

    var quoteObj = {snackbar:undefined,n:-1,max:null};
    window.quoteObj = quoteObj;
    /* let snackbar=null;
    let n=-1;
    let max=null; */

    /* This script's goal is to find the original quoted email, scroll the window to it,
        /* then flash the block red to be easier to get the background on an email.
         * needs flags to work. check here for support
         * https://caniuse.com/css-has
        */

    scrollToBlock();

    function scrollToBlock(){
        var elem;
        var arr=[];
        quoteObj.n++;
        document.querySelectorAll('#gblockhighlightStyle').forEach(x=>x.remove());
        
        var backgroundColor = window.getComputedStyle(document.body).backgroundColor;
        let innerstyle = `.gblockhighlight{
            background-color: #f7d0d0 !important;
            border-style: solid !important;
            border-color: red !important;
        }
        .gblockhighlight-prev{
            border-style: solid !important;
            border-color: red !important;
            border-width: thin !important;
            background-color: rgb(255, 255, 255) !important;
        }`;
        let style = myapi.addElem('style',{id:'gblockhighlightStyle'},document.head).innerHTML=innerstyle;

        /* remove .gblockhighlight class from elements before running */
        document.querySelectorAll('.gblockhighlight').forEach(x=>{
            x.classList.add('gblockhighlight-prev');
            x.classList.remove('gblockhighlight');
        });

        /* find header that has quotes and isn't hidden */
        let elems = document.querySelectorAll('.h7:has(div.gmail_quote,blockquote:not(.gmail_quote)');
        let fArr = [];
        elems = Array.from(elems).filter(x=>{
            let quo = Array.from(x.querySelectorAll('div.gmail_quote,blockquote:not(.gmail_quote)')).filter(y=>{
                return y.offsetParent!=null;
            });
            console.log(quo.length);
            return x.offsetParent!=null && quo.length;
        });
        fArr.push(elems[0]);
        fArr.push(...elems[0].querySelectorAll('div.gmail_quote,blockquote:not(.gmail_quote)'));
        fArr = fArr.filter(x=>x.offsetParent!=null);
        console.log("fArr: " + fArr.length);
        quoteObj.max=fArr.length;

        console.log(quoteObj.n);
        elem = fArr[fArr.length -1 - quoteObj.n];
        console.log(elem);


        /* try to load snackbar from tampermonkey
        */
        try {
            snackParent(elem,function(){
                elem.classList.remove('gblockhighlight');
                elem.classList.remove('gblockhighlight-prev');
                document.querySelectorAll('.gblockhighlight-prev').forEach(x=>{
                    x.classList.remove('gblockhighlight-prev');
                });
            });
        }catch(e){
            setTimeout(function(){
                elem.classList.remove('gblockhighlight');
                elem.classList.remove('gblockhighlight-prev');
                document.querySelectorAll('.gblockhighlight-prev').forEach(x=>{
                    x.classList.remove('gblockhighlight-prev');
                });

            },5000);
        };

        elem.classList.add('gblockhighlight');

        /* Smooth scroll the element to the center of the window if n=0
         * this keeps the frame from scrolling to center when n is higher
         * bc that would tend to scroll the frame down then up since all
         * the children are below
        */
        if (quoteObj.n===0){
            elem.scrollIntoView( {
                block: "center", inline: "nearest", behavior:"smooth"
            });
            setTimeout(()=>{
                elem.scrollIntoView( {
                    block: "start", inline: "nearest", behavior:"smooth"
                });
            },1000);
        }else{
            elem.scrollIntoView( {
                block: "start", inline: "nearest", behavior:"smooth"
            });
        };

        /*setTimeout(function(){elem.classList.remove('gblockhighlight')},5000);*/
    };

    function snackParent(elem,callback){
        
        if(quoteObj.snackbar===undefined){
            console.log('snackbar is null');
            if(quoteObj.n===(quoteObj.max-1)){
                console.log("n1:" + quoteObj.max);
                quoteObj.snackbar=myapi.createSnackbarFade(quoteObj.n+'/'+(quoteObj.max-1)+': Last Block');
                quoteObj.snackbar.close = callback;
            } else {
                console.log("n2:" + quoteObj.n);
                quoteObj.snackbar=myapi.createSnackbarFn1(quoteObj.n+'/'+(quoteObj.max-1)+': Next Block',scrollToBlock);
                quoteObj.snackbar.close = callback;
            };
        }else{
            if(quoteObj.n===(quoteObj.max-1)){
                console.log("n3:" + quoteObj.max);
                console.log(quoteObj.snackbar);
                quoteObj.snackbar.querySelector('.close').click();
                quoteObj.snackbar=myapi.createSnackbarFade(quoteObj.n+'/'+(quoteObj.max-1)+': Last Block');
                quoteObj.snackbar.close = callback;
            } else {
                console.log("n4:" + quoteObj.max);
                console.log(quoteObj.snackbar);
                quoteObj.snackbar.querySelector('.fn1').innerText = quoteObj.n+`/`+(quoteObj.max-1)+': Next Block';
                quoteObj.snackbar.close = callback;
            };
        };
        
    };
}


async function copyClicked(off=false) {
    hideModal();

    // wait a bit before triggering
    await new Promise(r=>setTimeout(r,1000));
    /*click function*/

    // create object to hold all the onclick functions
    if (typeof window.fnObj==="undefined"){
        window.fnObj = {};
    }

    // function to generate random number not in fnObj
    function randNotObj(){
        var total = 10000000;
        var random = Math.floor(Math.random() * total);
        // if fnObj is full return
        if (Object.keys(fnObj).length === total){
            console.log("fnObj is full");
            return false;
        }
        // if in object
        if (fnObj[random]){
            console.log(random + " is already in obj, retrying...")
            return randNotObj();
        } else {
            console.log(random);
            return random;
        }
    }

    /* tampermonkey send function down the frames */
    if(document.querySelectorAll('iframe').length){
        try{
        Array.from(document.querySelectorAll('iframe')).forEach(x=>{
            x.contentWindow.postMessage({tmscript:1,tmPassFn:fnsToObj(copyClicked)},"*");
            x.contentWindow.postMessage({tmscript:1,tmExecWinFn:'copyClicked.bind(null,'+off+')'},"*");

        });
        }catch(e){
            console.log(e);
        };
    };

    /* this will remove from current level and delete from window */
    if(off===true){
        /* remove preventer from all */
        Array.from(document.querySelectorAll('*')).forEach(x=>{
            x.removeEventListener('click', window.preventer);
        });
        // add back onclick from removed onclick attribute
        console.log(fnObj);
        document.querySelectorAll('[randomonclick]').forEach(x=>{
            let random = x.getAttribute('randomonclick');
            x.addEventListener('click',fnObj[random]);
            delete fnObj[x.getAttribute('randomonclick')];
            x.removeAttribute('randomonclick');
        })
        // add back href 
        document.querySelectorAll('a[randomonhref]').forEach(x=>{
            let random = x.getAttribute('randomonhref');
            x.href = fnObj[random];
            delete fnObj[x.getAttribute('randomonhref')];
            x.removeAttribute('randomonhref');
        })
        console.log('Removed preventer listener');
        if(window.top !== window.self){
            window.copyClicked = null;
        }
        return;
    };

    /* add fn to window so it can be removed */
    window.copyClicked = copyClicked;

    let elementMouseIsOver;
    window.preventer = preventer;

    let style = document.createElement('style');
    style.id = 'selectStyle';
    style.innerHTML = `
    .selectStyle{
            border:2px solid red;
    }
    `;
    if (document.querySelector('#selectStyle')) { document.querySelector('#selectStyle').remove() };
    document.head.appendChild(style);

    /* disable click on all elements */
    Array.from(document.querySelectorAll('*')).forEach(x=>{
        x.addEventListener('click', window.preventer,{once:true});

    });

    // disable onclick attributes and give random number to reclaim from fnObj
    document.querySelectorAll('[onclick]').forEach(x=>{
        let random = randNotObj();
        console.log(random);
        x.setAttribute("randomonclick", random);
        fnObj[random] = x.onclick;
        x.removeAttribute('onclick');
    })
    // disable href attributes and give random number to reclaim from fnObj
    document.querySelectorAll('a[href]').forEach(x=>{
        let random = randNotObj();
        console.log(random);
        x.setAttribute("randomonhref", random);
        fnObj[random] = x.href;
        x.setAttribute('href',"javascript: void(0)");
    })

    function preventer(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        console.log('Prevented click');

        let x = e.clientX, y = e.clientY;
        elementMouseIsOver = document.elementFromPoint(x, y);
        console.log(elementMouseIsOver);
        let sel = window.getSelection();
        let rng = document.createRange();
        rng.selectNodeContents(elementMouseIsOver);
        sel.removeAllRanges();
        sel.addRange(rng);
        document.execCommand('copy');
        elementMouseIsOver.classList.add('selectStyle');
        myapi.createSnackbarFade("Copied: " + elementMouseIsOver.innerText);
        setTimeout(function () {
            elementMouseIsOver.classList.remove('selectStyle');
        }, 1500);
        /* remove preventer from all */
        Array.from(document.querySelectorAll('*')).forEach(x=>{
            x.removeEventListener('click', window.preventer);
        });
        console.log('Removed preventer listener');
        window.top.postMessage({tmscript:1,tmExecWinFn:'copyClicked.bind(null,true)'},"*");
    };

}


function bsqSearch() {
    hideModal();
    
    window.scrollTo(0,0);
    var id = prompt("What BSQ ID to search");
    if (id === null){return};
    toOne();
    function searchId(id){
        var items = document.querySelectorAll('.atlas--ui-grid-row:has([data-attribs-assignmentid])').length;
        /* if not done loading, pause for a bit then rerun function */
        if (items === 0){
            setTimeout(searchId,100,id);
            return;
        };
        let elem = document.querySelector('[data-attribs-assignmentid="' + id + '"]');
        console.log(elem);
        if (elem){
            console.log('found');
            elem.scrollIntoView( {
                block: "center", inline: "nearest", behavior:"instant"
            });
            window.scrollTo(0,0);
            let parent = document.querySelector('.atlas--ui-grid-row:has([data-attribs-assignmentid="' + id + '"])');
            parent.classList.add('foundrec');
            setTimeout(function(){parent.classList.remove('foundrec')},30000);

        } else {
            console.log('not found');
            if (document.querySelector('.atlas--ui-grid-footer-nav-btn-next').disabled){
                alert('Not found');
                return;
            };
            document.querySelector('.atlas--ui-grid-footer-nav-btn-next').click();
            setTimeout(searchId,100,id);
        }
    }
    /* sets page 1 then hits enter */
    function toOne(){
        document.querySelector('#currentPageInput3').value = 1;
        var curr = document.querySelector('#currentPageInput3');
        var keyup = new KeyboardEvent('keyup', {
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
            charCode: 13,
        });
        curr.dispatchEvent(keyup);
    };
    /* add style */
    if(document.getElementById('foundrec')){
        document.getElementById('foundrec').remove();
    };
    var backgroundColor = window.getComputedStyle(document.body).backgroundColor;
    var style = document.createElement('style');
    style.id='foundrec';
    style.innerHTML=`.foundrec{
            background-color: #f7d0d0 !important;
            border-style: solid !important;
            border-color: red !important;
        }`;
    document.head.appendChild(style);

    setTimeout(searchId,1000,id);
}