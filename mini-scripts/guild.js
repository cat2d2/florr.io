// ==UserScript==
// @name       Guild Script
// @namespace  http://tampermonkey.net/
// @version    0.8
// @description Stylish guild bar
// @author     kit2d2
// @match      https://florr.io/*
// @require    https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant      GM_addStyle
// ==/UserScript==

GM_addStyle(`
    .guild-capacity-bar {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 200px;
      height: 30px;
      background-color: #1FDBDE; /* Blue color */
      border: 2px solid #444;
      border-radius: 15px;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      overflow: hidden;
      transition: width 0.5s ease-in-out, height 0.5s ease-in-out, background-color 0.5s ease-in-out;
      z-index: 9999;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 10px;
      color: white;
      font-family: 'Ubuntu', sans-serif;
      font-weight: 700;
      font-size: 14px;
      text-align: center;
      line-height: 30px;
    }
  
    .guild-capacity-bar.expanded {
      width: 300px;
      height: 200px;
      background-color: #444;
      border: 15px solid #444;
      border-radius: 15px;
      color: #1FDBDE;
      transition: background-color 0.5s ease-in-out;
    }
  
    .inner-content {
      color: white;
      font-family: 'Ubuntu', sans-serif;
      font-weight: 700;
      font-size: 14px;
      overflow-y: auto;
      height: 100%;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
  
    .inner-content::-webkit-scrollbar {
      width: 10px;
    }
  
    .inner-content::-webkit-scrollbar-track {
      background: #1FDBDE;
    }
  
    .inner-content::-webkit-scrollbar-thumb {
      background-color: #444;
      border-radius: 5px;
    }
  `);
  
  (function() {
      let bar = document.createElement('div');
      bar.className = 'guild-capacity-bar';
      bar.textContent = 'Capacity of Guild: 100/100';
  
      let innerContent = document.createElement('div');
      innerContent.className = 'inner-content';
      innerContent.textContent = 'M28 Locktrap kit2d2';
  
      bar.appendChild(innerContent);
  
      document.body.appendChild(bar);
  
      bar.addEventListener('click', function() {
          bar.classList.toggle('expanded');
          if (bar.classList.contains('expanded')) {
              innerContent.textContent = '7/12/2024 - script creationed';
          } else {
              innerContent.textContent = 'M28 Locktrap kit2d2';
          }
      });
  })();
  