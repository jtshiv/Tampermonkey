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
    span.onclick = async function() {
        modal.style.display = "none";
        await new Promise(r=>setTimeout(r,5000));
        modal.remove();
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = async function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            await new Promise(r=>setTimeout(r,5000));
            modal.remove();
        }
    }
    // Set functions
    myapi.addElem('p',{id:'toggledys',textContent:'Toggle Dyslexic'},modal.querySelector('.modal-body')).addEventListener('click',myapi.toggleDyslexic);
    myapi.addElem('p',{id:'copyClicked',textContent:'Copy Clicked Element'},modal.querySelector('.modal-body')).addEventListener('click',copyClicked);

    // functions by host
    if (host == 'mail.google.com'){
        myapi.addElem('p',{id:'hostheader',textContent:'~~~Host Specific~~~'},modal.querySelector('.modal-body'));
        myapi.addElem('p',{id:'gmQuote',textContent:'GMail Quotes'},modal.querySelector('.modal-body')).addEventListener('click',gmQuote);
        
        
    } else if (host == 'en.wikipedia.org'){
        myapi.addElem('p',{id:'rmWikiRef',textContent:'Remove Wikipedia References'},modal.querySelector('.modal-body')).addEventListener('click',rmWikiRef);
    }

    // functions by baseurl
    if (baseurl == 'https://verizon.us2.blackline.com/Modules/Reconciliations/ExecGrid.aspx'){ // bsqSearch function
        myapi.addElem('p',{id:'baseheader',textContent:'~~~Base URL Specific~~~'},modal.querySelector('.modal-body'));
        myapi.addElem('p',{id:'bsqSearch',textContent:'BSQ ID Search'},modal.querySelector('.modal-body')).addEventListener('click',bsqSearch);
    }

    // functions by href
    if (href == 'https://oldschool.runescape.wiki/w/Optimal_quest_guide'){
        /*
        createNodes('p','hrefheader','~~~Page Specific~~~',modal.querySelector('.modal-body'));
        createNodes('p', 'osrsOptimalQuestGuide', 'Check boxes based on completed quests', modal.querySelector('.modal-body'), osrsOptimalQuestGuide);
        createNodes('p', 'osrsOqgToggle', 'Toggle visibility of completed quests', modal.querySelector('.modal-body'), osrsOqgToggleCompleted);
        */
    }



}

function hideModal(){
    document.querySelectorAll('#myModal').forEach(x=>x.style.display="none");
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