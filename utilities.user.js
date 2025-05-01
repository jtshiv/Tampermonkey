// ==UserScript==
// @name         Utilities Beta
// @supportURL	 https://github.com/jtshiv/Tampermonkey/issues/new
// @version      2025.05.01.001
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("Utilities script has started");

    // object with the utilities scripts in them
    // const myapi = 
    // Define a function to initialize the API object
    function initialize_myapi() {
        return {
            /**
             * Description
             * @param {object} details js object such as { method: 'GET', url: 'https://blah', onload:function(response){} }
             * @returns {any}
             */
            async httpReq(details){
                return await ((typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest : console.log("Error: GM_xmlhttpRequest"))(details);
            },
            /**
             * Add element to page.
             * @param {string} tag type of element to add
             * @param {object} attributes js object such as { textContent: this is the innerHTML } or { src: 'http://blah.js', type: 'text/javascript' }
             * @param {element} parent optional element to append to
             * @returns {element} created element
             */
            addElem(tag,attributes,parent = false){
                let elem;
                if (parent === false){
                    elem = GM_addElement(tag,attributes);
                } else {
                    elem = GM_addElement(parent,tag,attributes);
                };
                return elem;
            },
            /**
             * Description
             * @param {innerHTML} s the css
             * @returns {element} the added element
             */
            addStyle(s){
                return this.addElem("style",{textContent: s})
            },
            snackbar: snackbar_class,
            createSnackbar(message){
                return createSnackbar(message);
            },
            createSnackbarFade(message){
                return createSnackbarFade(message);
            },
            createSnackbarFn1(message,callback){
                return createSnackbarFn1(message,callback);
            },
            toggleDyslexic(){
                return toggleDyslexic();
            },
            async getValue(name, defaultVal){
                return await (GM_getValue)(name, defaultVal)
            },
            async setValue(name, defaultVal){
                return await (GM_setValue)(name, value)
            },
            async deleteValue(name){
                return await (GM_deleteValue)(name)
            },
            message(text,disappearTime = 5000){

            },
            async copyText(text){
                await (GM_setClipboard)(text);
                console.log("clipboard set: " + text);
                return text;
            }
        };
    };
    




    // iframe information exchange
    if (unsafeWindow.top === unsafeWindow.self) {   // Top level window
        unsafeWindow.addEventListener("message", async (e) => {
            if (e.data === "myapi"){

            }
        })
    } else {                            // somewhere inside an iframe
        //unsafeWindow.top.postMessage("myapi","*");
    }
    

    let styleMain = {
        '.snackbar': {
            visibility: 'hidden',
            transition: 'opacity 1s',
            minWidth: '250px',
            marginLeft: '-125px',
            backgroundColor: '#333',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '2px',
            padding: '16px',
            position: 'fixed',
            zIndex: 1,
            left: '50%',
            bottom: '90px',
        },
        '.snackbar.show': {
            visibility: 'visible',
            WebkitAnimation: 'fadein 0.5s',
            animation: 'fadein 0.5s',
        },
        '.snackbar .close': {
            float: 'right',
            cursor: 'pointer',
        },
        '.snackbar .fn1': {
            cursor: 'pointer',
        },
        '@-webkit-keyframes fadein': {
            from: {
                bottom: '0',
                opacity: 0,
            },
            to: {
                bottom: '30px',
                opacity: 1,
            },
        },
        '@keyframes fadein': {
            from: {
                bottom: '0',
                opacity: 0,
            },
            to: {
                bottom: '30px',
                opacity: 1,
            },
        },
        '@-webkit-keyframes fadeout': {
            from: {
                bottom: '30px',
                opacity: 1,
            },
            to: {
                bottom: '0',
                opacity: 0,
            },
        },
        '@keyframes fadeout': {
            from: {
                bottom: '30px',
                opacity: 1,
            },
            to: {
                bottom: '0',
                opacity: 0,
            },
        },
    };
    // convert it to a string for uses below
    styleMain = objectToCssString(styleMain);

    /**
     * Converts a JavaScript object of CSS styles into a valid CSS string.
     * 
     * @param {Object} styles - A JavaScript object where keys are CSS selectors and values are objects of CSS properties.
     * @returns {string} - A string of valid CSS rules derived from the object.
     */
    function objectToCssString(styles) {
        let cssString = '';
    
        for (let selector in styles) {
            cssString += `${selector} {`;
    
            for (let property in styles[selector]) {
                if (typeof styles[selector][property] === 'object') {
                    // For keyframes and nested objects (like 'from' and 'to')
                    cssString += `${property} {`;
                    for (let subProp in styles[selector][property]) {
                        cssString += `${convertCamelToKebab(subProp)}: ${styles[selector][property][subProp]}; `;
                    }
                    cssString += '}';
                } else {
                    cssString += `${convertCamelToKebab(property)}: ${styles[selector][property]}; `;
                }
            }
    
            cssString += '} ';
        }
    
        return cssString;
    }
    /**
     * Converts a camelCase string into kebab-case format (CSS naming convention).
     * This function also handles vendor-prefixed properties specifically for WebKit.
     *
     * For example:
     * - 'backgroundColor' becomes 'background-color'
     * - 'WebkitAnimation' becomes '-webkit-animation'
     *
     * @param {string} str - A camelCase string (e.g., 'backgroundColor').
     * @returns {string} - A kebab-case string (e.g., 'background-color').
     *
     * @remarks
     * This function specifically checks for strings that start with 'Webkit'.
     * If the input string starts with 'Webkit', it converts it into a 
     * vendor-prefixed version by:
     * - Adding '-webkit-' prefix.
     * - Removing the 'Webkit' part of the string.
     * - Converting the rest of the string from camelCase to kebab-case.
     * 
     * Considerations:
     * - Additional vendor prefixes (like 'Moz', 'Ms', 'O') should be handled similarly if needed.
     * - Ensure that input strings are always in camelCase format; if not, the conversion may not work as intended.
     * - This function only converts camelCase to kebab-case and does not validate CSS properties; ensure that the input is a valid CSS property name.
     */
    function convertCamelToKebab(str) {
        if (str.startsWith('Webkit')) {
            return `-webkit-${str.slice(6).replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        }
        return str.replace(/([A-Z])/g, "-$1").toLowerCase();
    }


    // load functions into window.
    unsafeWindow.createSnackbar = createSnackbar;
    unsafeWindow.createSnackbarFade = createSnackbarFade;
    unsafeWindow.createSnackbarFn1 = createSnackbarFn1;

    
    class snackbar_class{
        constructor(text,fade = false,callback = null) {
            this.#text = text
            this.#fade = Boolean(fade)
            if(callback){this.#callback = callback}
            this.snackbar = null
            this.#initElems()
        }
        #text
        #fade
        #callback
        #style
        show(){
            this.#testSnack()
            this.snackbar.classList.add('show');
        }
        hide(){
            this.snackbar.classList.remove('show');
        }
        close(){
            this.#testSnack()
            this.snackbar.style.opacity = '0';
        }
        setText(text){
            this.#text = text
            this.#testSnack()
            this.snackbar.querySelector('.text').innerText = this.#text;
        }

        // private internal functions start with #

        /**
         * test if snackbar is set
         */
        #testSnack(){
            if(this.snackbar == null){this.#initElems()}
        }
        #killSnack(){
            this.snackbar.remove();
            this.snackbar = null;
            this.#style.remove();
        }
        #initElems(){
            let time = Date.now();

            this.#style = document.createElement('style');
            this.#style.id = "snackbarstyle" + time;
            this.#style.innerHTML = this.#styleMain;
            document.head.appendChild(this.#style);

            this.snackbar = document.createElement('div');
            this.snackbar.id = "snackbar" + time;
            this.snackbar.classList.add('snackbar');
            
            // this.snackbar.innerText = this.#text;
            this.snackbar.innerHTML=`
                <span class="fn1"><span class="text">`+this.#text+`</span></span>
                <span class="close">&times;</span>
            `;
            this.snackbar.querySelector('.close').addEventListener('click',x=>{
                this.snackbar.style.opacity=0;
            });

            // callback if given
            if (this.#callback){
                this.snackbar.querySelector('.fn1').addEventListener('click',this.#callback);
            }

            // fade if given
            if (this.#fade){
                setTimeout(function(){
                    this.snackbar.style.opacity = '0';
                },5000);
            }

            this.snackbar.style.zIndex = this.#getMaxZIndex() + 1;

            // when opacity set and it finishes fading, kill elem
            this.snackbar.addEventListener('transitionend', this.#killSnack.bind(this));

            document.body.appendChild(this.snackbar);
            
        }
        #getMaxZIndex() {
            try{
                return Math.max(
                    ...Array.from(document.querySelectorAll('body *'), el =>
                        parseFloat(window.getComputedStyle(el).zIndex),
                    ).filter(zIndex => !Number.isNaN(zIndex)),
                    0,
                );
            }catch(e){
                return Math.max(
                    ...Array.from(document.querySelectorAll('body *'), el =>
                        parseFloat(unsafeWindow.getComputedStyle(el).zIndex),
                    ).filter(zIndex => !Number.isNaN(zIndex)),
                    0,
                );
            }

        }
        #styleMain = styleMain;
    }


    function getMaxZIndex() {
        return Math.max(
            ...Array.from(document.querySelectorAll('body *'), el =>
                parseFloat(unsafeWindow.getComputedStyle(el).zIndex),
            ).filter(zIndex => !Number.isNaN(zIndex)),
            0,
        );
    }

    function createSnackbar(message){
        /*to remove, set snackbar.style.opacity = '0'*/
        let time = Date.now();
        var style = document.createElement('style');
        style.id = "snackbarstyle" + time;
        style.innerHTML = styleMain;
        document.head.appendChild(style);
        var snackbar = document.createElement('div');
        snackbar.id = "snackbar" + time;
        snackbar.classList.add('snackbar');
        snackbar.innerText = message;
        snackbar.style.zIndex = getMaxZIndex() + 1;
        /* add null close function that can be overwritten for custom fns to run before close */
        snackbar.close = function(){null};
        snackbar.addEventListener('transitionend', function() {
            snackbar.close();
            snackbar.remove();
            style.remove();
        });
        document.body.appendChild(snackbar);

        snackbar.classList.add('show');
        return snackbar;
    };
    function createSnackbarFade(message){
        /*to remove, set snackbar.style.opacity = '0'*/
        let time = Date.now();
        var style = document.createElement('style');
        style.id = "snackbarstyle" + time;
        style.innerHTML = styleMain;
        document.head.appendChild(style);
        var snackbar = document.createElement('div');
        snackbar.id = "snackbar" + time;
        snackbar.classList.add('snackbar');
        snackbar.innerText = message;
        snackbar.style.zIndex = getMaxZIndex() + 1;
        /* add null close function that can be overwritten for custom fns to run before close */
        snackbar.close = function(){null};
        snackbar.addEventListener('transitionend', function() {
            snackbar.close();
            snackbar.remove();
            style.remove();
        });
        document.body.appendChild(snackbar);

        snackbar.classList.add('show');
        setTimeout(function(){
            snackbar.style.opacity = '0';
        },5000);
    };
    function createSnackbarFn1(message,callback){
        /*to remove, set snackbar.style.opacity = '0'*/
        let time = Date.now();
        var style = document.createElement('style');
        style.id = "snackbarstyle" + time;
        style.innerHTML = styleMain;
        document.head.appendChild(style);
        var snackbar = document.createElement('div');
        snackbar.id = "snackbar" + time;
        snackbar.classList.add('snackbar');
        snackbar.innerHTML=`
            <span class="fn1">`+message+`</span>
            <span class="close">&times;</span>
        `;
        snackbar.querySelector('.close').addEventListener('click',x=>{
            snackbar.style.opacity=0;
        });
        snackbar.querySelector('.fn1').addEventListener('click',callback);
        snackbar.style.zIndex = getMaxZIndex() + 1;
        /* add null close function that can be overwritten for custom fns to run before close */
        snackbar.close = function(){null};
        snackbar.addEventListener('transitionend', function() {
            snackbar.close();
            snackbar.remove();
            style.remove();
        });
        document.body.appendChild(snackbar);

        snackbar.classList.add('show');
        return snackbar;
    };



    // Set OpenDyslexic font
    let excepts = ['.wf-family-owa','.el','.fa','.fab','.fad','.fal','.far','.fas','.btn--icon, .btn--top, .header__button, .header__button--menu','.search__button','.ddgsi-horn'];
    let wilds = ['Icon','icon','material-symbols','google-symbols','-fa','lni-'];
    let begins = ['devsite-nav'];
    let custom = []; // have inside with attribute and value pairs: custom = [["attribute","val of attribute"],[ect,val]]
    let host = window.location.host;
    // host specific
    if (host === "www.walmart.com" ){
        // add walmart's ld classes
        excepts.push('.ld');
        begins.push('.ld-');
    } else if (host === "play.google.com" ){
        // add playstore's logo to custom
        custom.push(["aria-label","Google Play logo"]);
    }

    var surrounded = excepts.map(item => `:not(${item})`).join('');
    let wildsmap = wilds.map(item => `:not([class*="${item}"])`).join('');
    surrounded = surrounded + wildsmap;
    let beginsmap = begins.map(item => `:not([class^="${item}"])`).join('');
    surrounded = surrounded + beginsmap;
    let custommap = custom.map(item => `:not(["${item[0]}"="${item[1]}"])`).join('');
    surrounded = surrounded + custommap;

    let dyslexic = `@font-face {
	font-family: 'mobiledyslexic-opendyslexic-regular';
    line-height: normal;
	src: url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff');
        }

/*
* Force OpenDyslexic font to every element except some well known glyphs.
*
*   .wf-family-owa == Outlook web access
* 	.el == Elusive Icons
* 	.fa == Font Awesome
* 	.fab == Font Awesome
* 	.fad == Font Awesome
* 	.fal == Font Awesome
* 	.far == Font Awesome
* 	.fas == Font Awesome
*   .btn--icon, .btn--top, .header__button, .header__button--menu == duckduckgo icons
*   .sapUshellShellHeadItmCntnt == top search buttons in fiori
*/

    ` + surrounded + `{
        /* original selector here -> :not(.wf-family-owa):not(.el):not(.fa):not(.fab):not(.fad):not(.fal):not(.far):not(.fas):not([class*="Icon"]):not([class*="icon"]) { */
	    font-family: mobiledyslexic-opendyslexic-regular, sans-serif !important;
        line-height: normal;
    }`;


    document.querySelectorAll('#dyslexicstyle').forEach(x=>x.remove());
    let dyslexicstyle = document.createElement('style');
    dyslexicstyle.id = 'dyslexicstyle';
    dyslexicstyle.innerHTML = dyslexic;
    addStyle(dyslexicstyle);

    /* function to add styles to head
     * if head doesn't exist, waits
     * and tries again */
    function addStyle(elem){
        if (!document.head){
            setTimeout(addStyle,100,elem);
            return;
        };
        document.head.append(elem);
        // have dyslexic off for some domains
        if (elem.id !== 'dyslexicstyle'){return};
        let d = document.domain;
        if (d === "www.youtube.com" || d === "m.youtube.com" || d === "melvoridle.com" || d === "app.ynab.com" || d === "wiki.local"){
            elem.disabled = true;
        } else if (document.location.host === "docs.google.com" ) {
            elem.disabled = true;
        } 
    };


    /*
    This section is to toggle the css for the open dyslexic font
    */
    unsafeWindow.toggleDyslexic = toggleDyslexic;
    function toggleDyslexic() {
        // Get the element with the specified ID
        var element = document.getElementById('dyslexicstyle');

        // Toggle the css disabled method
        if (element.disabled) {
            element.disabled = false;
            console.log('Enabled OpenDyslexic');
        } else {
            element.disabled = true;
            console.log('Disabled OpenDyslexic');
        }
    }




    const myapi = initialize_myapi();
    unsafeWindow.myapi = myapi;

})();

