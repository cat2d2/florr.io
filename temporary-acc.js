// ==UserScript==
// @name         Florr.io Temporary Account
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Creates a temporary account whenever you join the game. Good for using cheats and not get banned.
// @author       Blossom
// @match        *://florr.io/*
// @icon         data:image/gif;base64,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
// @run-at       document-start
// @grant        none
// ==/UserScript==
 
const style = document.createElement('style');
style.textContent = `
    span {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translate(-50%, 0);
        color: #fff;
        font-family: Ubuntu;
        z-index: 999;
        cursor: pointer;
        padding: 4px 8px;
        text-shadow: 1px 0 #000, -1px 0 #000, 0 1px #000, 0 -1px #000, 1px 1px #000, -1px -1px #000;
    }
 
    span:active {
        background: rgba(0, 0, 0, 0.25);
    }
`;
 
const span = document.createElement('span');
span.style.display = 'none';
span.textContent = 'waiting  for account';
span.onclick = function() {
    navigator.clipboard.writeText(span.textContent);
};
 
window.addEventListener('DOMContentLoaded', function() {
    document.body.appendChild(style);
    document.body.appendChild(span);
});
 
Object.defineProperty(window, 'localStorage', {
    value: new Proxy(window.localStorage, {
        get(target, prop, receiver) {
            if (prop === 'cp6_player_id') {
                return '';
            }
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            if (prop === 'cp6_player_id') {
                span.textContent = value;
                return true;
            }
            return Reflect.set(target, prop, value, receiver);
        }
    })
});
