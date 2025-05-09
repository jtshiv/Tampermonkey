// ==UserScript==
// @name         OSRS Wiki Beta
// @namespace    https://oldschool.runescape.wiki/
// @version      2025.05.09.004
// @description  Redirect mobile edit hash URLs to full desktop edit, preserving all params and section number.
// @match        https://oldschool.runescape.wiki/w/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Get script version
    var info = GM_info;
    var version;
    if (info.script.name.indexOf("Beta") == 1){
        version = "beta";
    } else {
        version = "prod";
    }

    function redirectIfMobileEditor() {
      // Check for #/editor or #/editor/<n>
      const m = location.hash.match(/^#\/editor\/?(\d+)?/);
      if (m) {
        // Extract section number if present (m[1]), else undefined
        const sectionNum = m[1];
  
        // Build URL object and params
        const url = new URL(location.href);
        const params = new URLSearchParams(url.search);
  
        params.set('action', 'edit');
        params.set('useskin', 'vector');
  
        // If we got a section number, set it
        if (sectionNum) {
          params.set('section', sectionNum);
        }
  
        // Rebuild URL and replace
        const newUrl = `${url.origin}${url.pathname}?${params.toString()}`;
        window.location.replace(newUrl);
      }
    }
  
    // On initial load
    redirectIfMobileEditor();
    // On any hashchange
    window.addEventListener('hashchange', redirectIfMobileEditor, false);
  })();
  