// ==UserScript==
// @name         Shaders
// @namespace    https://florr.io
// @version      1.3
// @description  Shadows in florr.io
// @author       kit2d2, Jekyll
// @match        https://florr.io/*
// @run-at       document-end
// @icon         data:image/gif;base64,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
// ==/UserScript==

! function() {
    "use strict";
    let menuStatus = false;
    let menuAlpha = 0;
    let menuHasOpened = localStorage.getItem("Shader Menu Opened") != null ? JSON.parse(localStorage.getItem("Shader Menu Opened")) : false;
    let helpAlpha = 0;

    const lerp = (a, b, c) => a + c * (b - a);
    const holder = document.createElement("div");

    const shadowProperties = {};

    function HandleColor(self, color, isStroke, isOffscreen) {
        if (isOffscreen && !shadowProperties.shadowOffscreenCanvas) return color;
        for (let key in shadowProperties) self[key] = shadowProperties[key];
        if (shadowProperties.shadowColorInherit) self.shadowColor = color;
        return color;
    }

    codeblock_one: {
        const {
            set: _setFillStyle,
            get: _getFillStyle
        } = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'fillStyle');
        Object.defineProperty(CanvasRenderingContext2D.prototype, 'fillStyle', {
            get() {
                return _getFillStyle.call(this);
            },
            set(v) {
                _setFillStyle.call(this, HandleColor(this, v, false, false));
            }
        });
        const {
            set: _setStrokeStyle,
            get: _getStrokeStyle
        } = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'strokeStyle');
        Object.defineProperty(CanvasRenderingContext2D.prototype, 'strokeStyle', {
            get() {
                return _getStrokeStyle.call(this);
            },
            set(v) {
                _setStrokeStyle.call(this, HandleColor(this, v, true, false));
            }
        });
    }

    codeblock_two: {
        const {
            set: _setFillStyle,
            get: _getFillStyle
        } = Object.getOwnPropertyDescriptor(OffscreenCanvasRenderingContext2D.prototype, 'fillStyle');
        Object.defineProperty(OffscreenCanvasRenderingContext2D.prototype, 'fillStyle', {
            get() {
                return _getFillStyle.call(this);
            },
            set(v) {
                _setFillStyle.call(this, HandleColor(this, v, false, true));
            }
        });
        const {
            set: _setStrokeStyle,
            get: _getStrokeStyle
        } = Object.getOwnPropertyDescriptor(OffscreenCanvasRenderingContext2D.prototype, 'strokeStyle');
        Object.defineProperty(OffscreenCanvasRenderingContext2D.prototype, 'strokeStyle', {
            get() {
                return _getStrokeStyle.call(this);
            },
            set(v) {
                _setStrokeStyle.call(this, HandleColor(this, v, true, true));
            }
        });
    }

    const help = document.createElement("p");
    help.style.position = "absolute";
    help.style.top = "0%";
    help.style.left = "50%";
    help.style.fontFamily = "Ubuntu";
    help.style.fontSize = "3vw";
    help.innerText = "Press + to open menu";
    help.style.color = "#FFFFFF";
    help.style.transform = "translate(-50%, -50%)";
    help.style.pointerEvents = "none";
    document.body.appendChild(help);

    holder.style.position = "absolute";
    holder.style.backgroundColor = "#1a1a1a";
    holder.style.border = "1.6vw ridge #333333";
    holder.style.top = "50%";
    holder.style.left = "50%";
    holder.style.fontFamily = "Ubuntu";
    holder.style.transform = "translate(-50%, -50%)";
    holder.style.padding = "0.5vw";
    const settings = [
        ["Shadow Offset X", 0, "slider", [-20, 20], "shadowOffsetX"],
        ["Shadow Offset Y", 0, "slider", [-20, 20], "shadowOffsetY"],
        ["Shadow Strength", 0, "slider", [0, 30], "shadowBlur"],
        ["Shadow Color", "#FFFFFF", "color", [], "shadowColor"],
        ["Shadow Inherits Color", false, "checkbox", [], "shadowColorInherit"],
        ["Shadow on GUI (Reload Required)", false, "checkbox", [], "shadowOffscreenCanvas"],
    ].map(data => {
        data[1] = localStorage.getItem(data[0]) != null ? localStorage.getItem(data[0]) : data[1];
        const div = document.createElement("div");
        div.style.width = "100%";
        div.style.height = "4vw";
        div.style.fontSize = "2vw";
        div.style.color = "#ffffff";
        const text = document.createElement("p");
        text.style.margin = "0px";
        text.style.padding = "0px";
        text.style.display = "inline";
        div.appendChild(text);
        let shadowinput = null;
        switch (data[2]) {
            case "slider": {
                const slider = document.createElement('input');
                slider.style.verticalAlign = 'middle';
                slider.style.width = '40%';
                slider.type = 'range';
                text.innerText = `${data[0]} (${data[1]})`;
                slider.min = data[3][0];
                slider.max = data[3][1];
                slider.value = JSON.parse(data[1]);
                slider.style.margin = "0px";
                slider.style.display = "inline";
                slider.style.marginLeft = "1.5vw";
                slider.style.float = "right";

                slider.style["-webkit-appearance"] = "none";
                slider.style.height = "1vw";

                slider.addEventListener('input', event => {
                    text.innerText = `${data[0]} (${event.target.value})`;
                    localStorage.setItem(data[0], event.target.value);
                });

                slider.step = 1;
                shadowinput = slider;
                div.appendChild(slider);
            };
            break;
            case "color": {
                const input = document.createElement('input');
                input.style.verticalAlign = "middle";
                input.type = "color";
                input.value = data[1];

                input.style.margin = "0px";
                input.style.display = "inline";
                input.style.marginLeft = "1.5vw";
                input.style.float = "right";

                input.style.width = '40%';
                input.style.border = "0px";
                shadowinput = input;
                text.innerText = `${data[0]}`;

                input.addEventListener('input', event => {
                    localStorage.setItem(data[0], event.target.value);
                });

                div.appendChild(input);
            };
            break;
            case "checkbox": {
                const box = document.createElement("input");
                box.style.verticalAlign = "middle";
                box.type = "checkbox";
                text.innerText = `${data[0]}`;
                box.style.display = "inline";
                box.style.float = "right";
                box.checked = JSON.parse(data[1]);

                box.style.width = "1.5vw";
                box.style.height = "1.5vw";

                box.addEventListener('input', event => {
                    localStorage.setItem(data[0], event.target.checked);
                    console.log(event.target.checked);
                });

                shadowinput = box;
                div.appendChild(box);
            }
            break;
        }

        holder.appendChild(div);

        return {
            getValue: () => shadowinput.value === "on" ? shadowinput.checked : shadowinput.value,
            property: data[4]
        };
    });

    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "1.5vw";
    div.style.fontSize = "1vw";
    div.style.color = "#ffffff";
    div.style.position = "absolute";
    div.style.bottom = "0px";
    const text = document.createElement("a");
    text.text = "";
    text.title = "Discord";
    text.href = "https://discord.gg/MqvmBu5tWa";
    text.style.float = "right";
    text.style.padding = "0px";
    text.style.margin = "0px";
    text.style.marginRight = "1vw";

    div.appendChild(text);
    holder.appendChild(div);

    document.body.appendChild(holder);

    const animationLoop = () => {
        menuAlpha = lerp(menuAlpha, menuStatus, 0.2);
        holder.style.opacity = menuAlpha;
        holder.style.top = `${50 * menuAlpha | 0}%`;

        helpAlpha = lerp(helpAlpha, !menuHasOpened, 0.2);
        help.style.opacity = helpAlpha;

        if (menuAlpha > 0.8) holder.style.pointerEvents = "auto";
        else holder.style.pointerEvents = "none";

        const ratio = Math.min(innerWidth, innerHeight) / 1080;
        holder.style.width = `${800 * ratio}px`;
        holder.style.height = `${500 * ratio}px`;

        requestAnimationFrame(animationLoop);
        for (let setting of settings) {
            let value = isNaN(setting.getValue()) ? setting.getValue() : +(setting.getValue());
            shadowProperties[setting.property] = value;
        };
    }
    animationLoop();

    window.addEventListener("keydown", event => {
        if (event.key === "Plus" || event.key === "+") {
            event.preventDefault();
            menuStatus = !menuStatus
            localStorage.setItem("Shader Menu Opened", true);
            menuHasOpened = true;
        };
    });
}();
