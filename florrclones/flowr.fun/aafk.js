// ==UserScript==
// @name         antiafk
// @namespace    http://tampermonkey.net/
// @version      .5
// @description  anti afk
// @author       You
// @match        *://flowr.fun/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.alert = function(message) {
        console.log("ok" + message);
    };
})();
