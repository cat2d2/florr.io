// ==UserScript==
// @name         florrehoh hackering
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  take over the florr.io better now!
// @author       m28 (so real)
// @match        https://florr.io/*
// @icon         data:image/gif;base64,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
// @grant        none
// @run-at       document-start
// @require      https://unpkg.com/string-similarity@4.0.4/umd/string-similarity.min.js
// @license      AGPL
// ==/UserScript==
 
(function() {
  'use strict';
  const client = {
    autoRespawn: {
      enabled: 1,
      spawnBiome: 'Garden'
    },
    bypassAfkCheck: {
      movementCheck: 1,
      afkButton: 1,
    },
    autoGrind: {
     enabled: 1,
    },
    tracers: 1,
  }
 
  let respawnState = 0
  let lastCheck = 0
  const _console = {
    _log: window.console.log,
    log: function() {
      this._log(`%c[https://github.com/kit2d2alt]`, `color: rgb(25, 156, 35); background: rgb(200, 255, 200)`, ...arguments)
    }
  }
  const multiply = function(t,l){let e=t.length,n=t[0].length,$=l[0].length,r=Array(e);for(let f=0;f<e;++f){let o=Array($);r[f]=o;let g=t[f];for(let h=0;h<$;++h){let u=0;for(let i=0;i<n;++i)u+=g[i]*l[i][h];o[h]=u}}return r}
 
  let identity = function(a, b, c) {
    return Reflect.apply(a, b, c)
  }
  let beforeAnimationFrame = identity
  let tracers = {}, addTracer = function(t, color) {
    if(!color) { color = '#000000' } // if no color
    if(!tracers[color]) { tracers[color] = [] }
    tracers[color].push(t)
  }, mobs = []
  const parseColor = function(str) {//converter
    return [parseInt(str[1] + str[2], 16), parseInt(str[3] + str[4], 16), parseInt(str[5] + str[6], 16)]
  }
  let mouse = {
    dx: 0,
    dy: 0
  }
  const main = function() {
    const canvas = document.getElementById('canvas')
    canvas._addEventListener('mousemove', function(e) {
      mouse.dx = (e.clientX - window.innerWidth * 0.5)
      mouse.dy = (e.clientY - window.innerHeight * 0.5)
    })
    const ctx = canvas.getContext('2d')
    beforeAnimationFrame = function(a, b, c) {
      let n = performance.now()
      let w = canvas.width * 0.5, h = canvas.height * 0.5
      let ir = 1 / window.devicePixelRatio
      let dw = w * ir, dh = h * ir
      if(client.autoGrind.enabled) {
        let closestMob = false, closestDistance = -1
        for(let i=mobs.length-1;i>=0;i--) {
          let m = mobs[i]
          let dx = m[0] - w, dy = m[1] - h
          let d = dx * dx + dy * dy
          if(d < closestDistance || closestDistance < 0) {
            closestDistance = d
            closestMob = [dx, dy]
          }
        }
        if(closestMob) {
          let d = 100 * (closestDistance < 1 ? 1 : 1 / Math.sqrt(closestDistance))
          mouse.dx = closestMob[0] * d
          mouse.dy = closestMob[1] * d
        }
      }
      if(!buttons.Ready || !client.autoRespawn.enabled) { respawnState = 0 }
      if(n - lastCheck > 100) {
        lastCheck = n
        !function() {
          if(client.autoRespawn.enabled) {
            if(respawnState < 1) {
              if(buttons[client.autoRespawn.spawnBiome]) {
                if(clickButton(client.autoRespawn.spawnBiome)) {
                  respawnState ++
                }
                return
              }
            } else {
              if(buttons.Ready) {
                clickButton('Ready')
                return
              }
            } if(buttons.Continue) {
              clickButton('Continue')
              respawnState = 0
            }
          }
          if(client.bypassAfkCheck.afkButton) {
            // broken
            clickButton(`I'm here`)
          }
        }()
      } else if(!buttons.Continue && (client.bypassAfkCheck.movementCheck || client.autoGrind.enabled)) {
        let a = (n / 1000) % (2 * Math.PI)
        let tx = mouse.dx + dw + Math.sin(a), ty = mouse.dy + dh + Math.cos(a)
        listeners.mousemove({
          clientX: tx,
          screenX: tx,
          clientY: ty,
          screenY: ty
        })
      }
      let transform = ctx.getTransform()
      ctx.translate(w, h)
      ctx.lineCap = 'round'
      ctx.miterLimit = 1.68
      ctx.font = '14px Ubuntu'
      for(let color in tracers) {
        let o = tracers[color]
        for(let i=o.length-1;i>=0;i--) {
          let t = o[i]
          let l = 1, a = 1
          if(t[2] > 3) {
            l += (t[2] - 3) * 0.5
          } else {
            a = (t[2] + 1) / 4
          }
          let j = a
          a *= 0.5
          let r = parseColor(color)
          ctx.strokeStyle = `rgba(${r[0]}, ${r[1]}, ${r[2]}, ${a})`
          ctx.setLineDash([10, 15])
          ctx.lineWidth = l
          ctx._beginPath()
          let dx = t[0] - w, dy = t[1] - h
          ctx._moveTo(dx, dy)
          let d = dx * dx + dy * dy
          ctx._lineTo(0, 0)
          ctx._stroke()
          a *= 0.25
          ctx.strokeStyle = `rgba(${r[0]}, ${r[1]}, ${r[2]}, ${a})`
          ctx.setLineDash([])
          ctx._stroke()
          ctx._closePath()
          if(d > 300 * 300) {
            let rd = Math.sqrt(d)
            if(rd < 350) {
              j *= (rd - 300) * 0.02
            }
            if(j > 0.05) {
              d = 1 / rd
              let y = 300 + (rd - 300) / (rd - 100) * 100
              let tx = dx * d * y
              let ty = dy * d * y + 7
              if(r[0] === 0 && r[1] === 0 && r[2] === 0) { r[0] = r[1] = r[2] = 255 }
              ctx.fillStyle = `rgb(${r[0]}, ${r[1]}, ${r[2]})`
              ctx.strokeStyle = '#000000'
              ctx.lineWidth = 1.68
              j *= j
              if(j < 0.95) { ctx.globalAlpha = j }
              let text = '' + Math.round(rd / 100)
              ctx.textAlign = 'center'
              ctx._strokeText(text, tx, ty)
              ctx.lineWidth = 10
              ctx._fillText(text, tx, ty)
              if(j < 0.95) { ctx.globalAlpha = 1 }
            }
          }
        }
      }
      ctx.setTransform(transform)
      let f = c[0]
      if(f.proxy) { c[0] = f.proxy } else {
        c[0] = f.proxy = new Proxy(f, { apply:function(a, b, c) {
          lbuttons = buttons
          buttons = {}
          tracers = {}
          mobs = []
          window.l = listeners
          window.b = buttons
          return Reflect.apply(a, b, c)
        } })
      }
      return Reflect.apply(a, b, c)
    }
  }
  window.console.log = new Proxy(window.console.log, { apply:function(a, b, c) {
    return Reflect.apply(a, b, c)
  } })
  const untransform = function(x, y, t) {
    let r = multiply([[x, y, 1]], [[t.a, t.b, 0], [t.c, t.d, 0], [t.e, t.f, 1]])[0]
    return [r[0] / r[2], r[1] / r[2]]
  }
  let lastText = [], lastWhiteText = []
  let rarities = {
    Common: {
      name: 'Common',
      color: '#7eef6d',
      index: 0
    },
    Unusual: {
      name: 'Unusual',
      color: '#ffe65d',
      index: 1
    },
    Rare: {
      name: 'Rare',
      color: '#4d52e3',
      index: 2
    },
    Epic: {
      name: 'Epic',
      color: '#861fde',
      index: 3
    },
    Legendary: {
      name: 'Legendary',
      color: '#de1f1f',
      index: 4
    },
    Mythic: {
      name: 'Mythic',
      color: '#1fdbde',
      index: 5
    },
    Ultra: {
      name: 'Ultra',
      color: '#ff2b75',
      index: 6
    },
    Super: {
      name: 'Super',
      color: '#000000',
      index: 7
    }
  }
  let colors = {}
  for(let r in rarities) {
    colors[rarities[r].color] = rarities[r]
  }
  const textTransform = function(text, ctx) {
    if(text === 'Plinko') {
      text = 'scammer'
    }
    return text
  }
  let buttons = {}, lbuttons = {}
  window.CanvasRenderingContext2D.prototype._measureText = window.CanvasRenderingContext2D.prototype.measureText
  window.CanvasRenderingContext2D.prototype.measureText = new Proxy(window.CanvasRenderingContext2D.prototype.measureText, { apply:function(a, b, c) {
    c[0] = textTransform(c[0], b)
    return Reflect.apply(a, b, c)
  } })
  window.CanvasRenderingContext2D.prototype._strokeText = window.CanvasRenderingContext2D.prototype.strokeText
  window.CanvasRenderingContext2D.prototype.strokeText = new Proxy(window.CanvasRenderingContext2D.prototype.strokeText, { apply:function(a, b, c) {
    c[0] = textTransform(c[0], b)
    return Reflect.apply(a, b, c)
  } })
  window.CanvasRenderingContext2D.prototype._fillText = window.CanvasRenderingContext2D.prototype.fillText
  window.CanvasRenderingContext2D.prototype.fillText = new Proxy(window.CanvasRenderingContext2D.prototype.fillText, { apply:function(a, b, c) {
    if(lastText[1]) {
      if(colors[b.fillStyle] && b.globalAlpha >= 1 && lastPaths[0][3] && client.tracers) {
        let t = lastPaths[0]
        if(c[0].startsWith('Lvl ') && parseInt(c[0].slice(4)) >= 0) {
          t = untransform((t[0] + t[1]) * 0.5, t[2], t[3])
          addTracer([t[0], t[1], colors[b.fillStyle].index], '#000000')
          lastPaths = [[], [], []]
        } else if(rarities[c[0]]) { // includes summons
          t = untransform((t[0] + t[1]) * 0.5, t[2], t[3])
          addTracer([t[0], t[1], colors[b.fillStyle].index], b.fillStyle)
          mobs.push([t[0], t[1]])
          lastPaths = [[], [], []]
        }
      }
    }
    let bd = buttonData[c[0]]
    if(bd && (!bd.color || bd.color === b.fillStyle) && (!bd.font || bd.font === b.font)) {
      let t = untransform(c[1], c[2], b.getTransform())
      let o = lbuttons[c[0]]
      let n = buttons[c[0]] = {
        x: t[0],
        y: t[1],
        d: 1,
        s: performance.now(), // **WAIT BEFORE CLICKING A BUTTON** Removing this will
                              // probably get you banned faster
        fillStyle: b.fillStyle,
        font: b.font
      }
      if(o) {
        n.d = Math.abs(n.x - o.x) + Math.abs(n.y - o.y)
        n.s = o.s
      }
    }
    if(c[0] === `I'm here` && client.bypassAfkCheck.afkButton) {
      afkButton(untransform(c[1], c[2], b.getTransform()))
    }
    lastText = [c, b.fillStyle]
    if(b.fillStyle === '#ffffff') {
      lastWhiteText = [c, b.fillStyle]
    }
    c[0] = textTransform(c[0], b)
    return Reflect.apply(a, b, c)
  } })
  let clicking = false
  const afkButton = function(t) {
    if(clicking) { return }
    clicking = true
    setTimeout(function() {
      clicking = false
      clickAt(t.x, t.y)
    }, 500 + 2000 * Math.random())
  }
  let buttonData = {
    Ready: {
      color: '#ffffff',
      font: '27.5px Ubuntu'
    },
    Garden: {
      color: '#ffffff',
      font: '16px Ubuntu'
    },
    Desert: {
      color: '#ffffff',
      font: '16px Ubuntu'
    },
    Ocean: {
      color: '#ffffff',
      font: '16px Ubuntu'
    },
    Jungle: {
      color: '#ffffff',
      font: '16px Ubuntu'
    },
    Hel: {
      color: '#ffffff',
      font: '16px Ubuntu'
    },
    'Play as guest': {},
    Continue: {
      color: '#ffffff',
    }
  }
  let lastPaths = [[], [], []], lastFill = ''
  let path = [], topPath = false, addSegment = function(s) {
    if(topPath) {
      topPath.push(s)
    } else {
      path.push(topPath = [s])
    }
  }
  window.CanvasRenderingContext2D.prototype._beginPath = window.CanvasRenderingContext2D.prototype.beginPath
  window.CanvasRenderingContext2D.prototype.beginPath = new Proxy(window.CanvasRenderingContext2D.prototype.beginPath, { apply:function(a, b, c) {
    path = []
    topPath = false
    return Reflect.apply(a, b, c)
  } })
  window.CanvasRenderingContext2D.prototype._moveTo = window.CanvasRenderingContext2D.prototype.moveTo
  window.CanvasRenderingContext2D.prototype.moveTo = new Proxy(window.CanvasRenderingContext2D.prototype.moveTo, { apply:function(a, b, c) {
    addSegment({
      type: 'moveTo',
      x: c[0],
      y: c[1]
    })
    return Reflect.apply(a, b, c)
  } })
  window.CanvasRenderingContext2D.prototype._lineTo = window.CanvasRenderingContext2D.prototype.lineTo
  window.CanvasRenderingContext2D.prototype.lineTo = new Proxy(window.CanvasRenderingContext2D.prototype.lineTo, { apply:function(a, b, c) {
    addSegment({
      type: 'lineTo',
      x: c[0],
      y: c[1]
    })
    return Reflect.apply(a, b, c)
  } })
  window.CanvasRenderingContext2D.prototype._closePath = window.CanvasRenderingContext2D.prototype.closePath
  window.CanvasRenderingContext2D.prototype.closePath = new Proxy(window.CanvasRenderingContext2D.prototype.closePath, { apply:function(a, b, c) {
    path = []
    topPath = false
    return Reflect.apply(a, b, c)
  } })
  window.CanvasRenderingContext2D.prototype._stroke = window.CanvasRenderingContext2D.prototype.stroke
  window.CanvasRenderingContext2D.prototype.stroke = new Proxy(window.CanvasRenderingContext2D.prototype.stroke, { apply:function(a, b, c) {
    if(path.length === 1 && path[0].length === 2 && path[0][0].y === path[0][1].y) {
      lastPaths[0] = lastPaths[1]
      lastPaths[1] = lastPaths[2]
      lastPaths[2] = [path[0][0].x, path[0][1].x, path[0][0].y, b.getTransform()]
    }
    return Reflect.apply(a, b, c)
  } })
  window.CanvasRenderingContext2D.prototype._fill = window.CanvasRenderingContext2D.prototype.fill
  window.CanvasRenderingContext2D.prototype.fill = new Proxy(window.CanvasRenderingContext2D.prototype.fill, { apply:function(a, b, c) {
    lastFill = b.fillStyle
    return Reflect.apply(a, b, c)
  } })
  window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, { apply:function(a, b, c) {
    return beforeAnimationFrame(a, b, c)
  } })
  const interval = setInterval(function() {
    if(document.body) {
      clearInterval(interval)
      main()
    }
  })
  if(0) {
    window.WebAssembly.instantiateStreaming = new Proxy(window.WebAssembly.instantiateStreaming, { apply:function(a, b, c) {
      let d = new Response()
      c[0] = d
      return Reflect.apply(a, b, c)
    } })
  }
  const listeners = {}, trigger = function(type, data) {
    if(listeners[type]) { listeners[type](data) }
  }
  const listenerApply = function(a, b, c) {
    if(c[0] === 'mousemove') {
      listeners.mousemove = c[1]
    }
    if(c[0] === 'blur' || c[0] === 'focus' || c[0] === 'visibilitychange') {
      return
    }
    if(b && b.id === 'canvas') {
      if(c[0] === 'mousedown') {
        listeners.mousedown = c[1]
      }
    }
    if(c[0] === 'mouseup') {
      listeners.mouseup = c[1]
    }
    if(c[0] === 'keydown') {
      listeners.keydown = c[1]
    }
    if(c[0] === 'keyup') {
      listeners.keyup = c[1]
    }
    return Reflect.apply(a, b, c)
  }
  const clickAt = function(x, y) {
    let ir = 1 / window.devicePixelRatio
    x *= ir
    y *= ir
    listeners.mousemove({
      clientX: x,
      screenX: x,
      clientY: y,
      screenY: y
    })
    listeners.mousedown({
      preventDefault: function() {},
      clientX: x,
      clientY: y
    })
    listeners.mouseup({
      preventDefault: function() {},
      clientX: x,
      clientY: y
    })
  }
  const clickButton = function(text) {
    if(buttons[text]) {
      if(buttons[text].d > 0.01) {
        return
      }
      let n = performance.now()
      if(n - buttons[text].s < 2000) {
        return
      }
      clickAt(buttons[text].x, buttons[text].y)
      return true
    }
  }
  HTMLElement.prototype._addEventListener = HTMLElement.prototype.addEventListener
  HTMLElement.prototype.addEventListener = new Proxy(HTMLElement.prototype.addEventListener, { apply:listenerApply })
  window.addEventListener = new Proxy(window.addEventListener, { apply:listenerApply })
  document.addEventListener = new Proxy(document.addEventListener, { apply:listenerApply })
  localStorage.florrio_tutorial = 'complete'
})();
 
var obj =
    {
        rarity: 0,
        id: 1,
        aim: 5,
        basicId: 605463,
        find: {
            petal: "Basic",
            value: [5, 0, 0, 0, 0, 0, 0, 0]
        },
        config: {
            top: false,
            left: false,
            x: "-20px",
            y: "-20px",
            scale: 1,
            key: "Equal"
        },
        version: "1.2",
        versionHash: versionHash,
        autoFind: true,
        multipleCounting: {
            enable: false,
            petal: {
                "Common Basic": 5,
                "Common Light": 5
            },
            key: "Minus"
        }
    },
    petal = "Common Basic",
    rarityArr = [
        "Common",
        "Unusual",
        "Rare",
        "Epic",
        "Legendary",
        "Mythic",
        "Ultra",
        "Super"
    ],
    rarityColors = [
        "#7EEF6D",
        "#FFE65D",
        "#4D52E3",
        "#861FDE",
        "#DE1F1F",
        "#1FDBDE",
        "#FF2B75",
        "#2BFFA3",
    ],
    petalArr = [
        "Basic",
        "Light",
        "Rock",
        "Square",
        "Rose",
        "Stinger",
        "Iris",
        "Wing",
        "Missile",
        "Grapes",
        "Cactus",
        "Faster",
        "Bubble",
        "Pollen",
        "Dandelion",
        "Beetle Egg",
        "Antennae",
        "Heavy",
        "Yin Yang",
        "Web",
        "Honey",
        "Leaf",
        "Salt",
        "Rice",
        "Corn",
        "Sand",
        "Pincer",
        "Yucca",
        "Magnet",
        "Yggdrasil",
        "Starfish",
        "Pearl",
        "Lightning",
        "Jelly",
        "Claw",
        "Shell",
        "Cutter",
        "Dahlia",
        "Uranium",
        "Sponge",
        "Soil",
        "Fangs",
        "Third Eye",
        "Peas",
        "Stick",
        "Clover",
        "Powder",
        "Air",
        "Basil",
        "Orange",
        "Ant Egg",
        "Poo",
        "Relic",
        "Lotus",
        "Bulb",
        "Cotton",
        "Carrot",
        "Bone",
        "Plank",
        "Tomato",
        "Mark",
        "Rubber",
        "Blood Stinger",
        "Bur",
        "Root",
        "Ankh",
        "Dice",
        "Talisman",
        "Battery",
        "Amulet",
        "Compass",
        "Disc",
        "Shovel",
        "Coin",
        "Chip",
        "Card",
        "Moon",
        "Privet",
        "Glass"
    ]
 
function getNewPetal(petalName) {
    var tempObj = {
        id : 1,
        rarity: 0,
        petal: ""
    }
    if (petalName.split(" ").length <= 0) return
    if (petalName.split(" ").length == 1) {
        if (petalName.startsWith("un")) tempObj.rarity = "Unusual"
        else if (petalName.startsWith("r")) tempObj.rarity = "Rare"
        else if (petalName.startsWith("e")) tempObj.rarity = "Epic"
        else if (petalName.startsWith("l")) tempObj.rarity = "Legendary"
        else if (petalName.startsWith("m")) tempObj.rarity = "Mythic"
        else if (petalName.startsWith("u")) tempObj.rarity = "Ultra"
        else if (petalName.startsWith("s")) tempObj.rarity = "Super"
        else tempObj.rarity = "Common"
        tempObj.id = stringSimilarity.findBestMatch(petalName.slice(1), petalArr)
        petalName = tempObj.rarity + " " + tempObj.id.bestMatch.target
        tempObj.rarity = rarityArr.indexOf(tempObj.rarity)
    } else {
        tempObj.rarity = stringSimilarity.findBestMatch(petalName.split(" ").shift(), rarityArr)
        tempObj.id = stringSimilarity.findBestMatch(petalName.split(" ").splice(1).join(" "), petalArr)
        petalName = tempObj.rarity.bestMatch.target + " " + tempObj.id.bestMatch.target
        tempObj.rarity = tempObj.rarity.bestMatchIndex
    }
    tempObj.id = tempObj.id.bestMatchIndex + 1
    tempObj.petal = petalName
    return tempObj
}
var thisNewPetal = getNewPetal(petal)
obj.id = thisNewPetal.id
obj.rarity = thisNewPetal.rarity
petal = thisNewPetal.petal
 
function findSequence(seq, mem) {
    let match = 0
    for (let addr = 0; addr < mem.length; addr++) {
        if (mem[addr] === seq[match]) match++
        else if (mem[addr] === seq[0]) match = 1
        else match = 0
        if (match === seq.length) return addr - match + 1
    }
}
 
// https://stackoverflow.com/questions/47011055/smooth-vertical-scrolling-on-mouse-wheel-in-vanilla-javascript
function SmoothScroll(target, speed, smooth) {
    if (target === document) target = (document.scrollingElement || document.documentElement || document.body.parentNode || document.body)
    var moving = false
    var pos = target.scrollTop
    var frame = target === document.body && document.documentElement ? document.documentElement : target
    target.addEventListener('mousewheel', scrolled, { passive: false })
    target.addEventListener('DOMMouseScroll', scrolled, { passive: false })
    function scrolled(e) {
        e.preventDefault()
        var delta = normalizeWheelDelta(e)
        pos += -delta * speed
        pos = Math.max(0, Math.min(pos, target.scrollHeight - frame.clientHeight))
        if (!moving) update()
    }
    function normalizeWheelDelta(e) {
        if(e.detail) {
            if(e.wheelDelta) return e.wheelDelta/e.detail/40 * (e.detail>0 ? 1 : -1)
            else return -e.detail / 3
        } else return e.wheelDelta / 120
    }
    function update() {
        moving = true
        var delta = (pos - target.scrollTop) / smooth
        target.scrollTop += delta
        if (Math.abs(delta) > 0.5) requestFrame(update)
        else moving = false
    }
    var requestFrame = function() {
        return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(func) {window.setTimeout(func, 1000 / 50)})
    }();
}
 
if (localStorage.getItem('petalFarmingCounter') == null) {
    localStorage.setItem('petalFarmingCounter', JSON.stringify(obj))
    setTimeout(() => {
        toggleCon()
        conCon.scrollTo(0, 110)
    }, 5000)
}
else {
    var thisObj = JSON.parse(localStorage.getItem('petalFarmingCounter'))
    if (thisObj.version != obj.version) {
        thisObj.version = obj.version
        setTimeout(() => {
            toggleCon()
            conCon.scrollTo(0, 110)
        }, 5000)
    }
    if (thisObj.versionHash != versionHash) {
        thisObj.versionHash = versionHash
        if (thisObj.autoFind) {
            setInterval(() => {
                thisObj.basicId = findSequence(thisObj.find.value, unsafeWindow.Module.HEAPU32) - ((stringSimilarity.findBestMatch(thisObj.find.petal, petalArr).bestMatchIndex + 1) * 8) + 8
                document.getElementById("Capply").innerHTML = `Basic ID: ${coloringValue(thisObj.basicId)}`
                var thisObj_ = JSON.parse(localStorage.getItem('petalFarmingCounter'))
                thisObj_.basicId = thisObj.basicId
                localStorage.setItem('petalFarmingCounter', JSON.stringify(thisObj_))
            }, 10000)
        }
    }
    if (Object.keys(thisObj.multipleCounting.petal).length < 2) thisObj.multipleCounting.petal = obj.multipleCounting.petal
    Object.keys(obj).forEach(k => {
        if (!Object.keys(thisObj).includes(k)) thisObj[k] = obj[k]
    })
    obj = thisObj
    localStorage.setItem('petalFarmingCounter', JSON.stringify(thisObj))
}
 
var thisPetalObj = {}
for (const [index, [key, value]] of Object.entries(Object.entries(obj.multipleCounting.petal))) {
    thisPetalObj[index] = {
        id: getNewPetal(key).id,
        rarity: getNewPetal(key).rarity,
        aim: value,
    }
}
 
var container = document.createElement("div")
container.id = "container"
container.style = `
    padding: 5px;
    height: 24px;
    width: 350px;
    position: absolute;
    transform: translate(${obj.config.x}, ${obj.config.y}) scale(${obj.config.scale});
    background: #333333;
    border-radius: 24px;
    transition: all 1s ease-in-out;
    opacity: 1;
    box-shadow: 5px 5px rgba(0, 0, 0, 0.3);
    pointer-events: all;
    cursor: pointer;
    overflow: hidden;
`
container.onclick = function() {
    toggleCon()
}
 
function toggleCon() {
    if (conCon.style.overflow == "hidden") {
        container.style.height = "300px"
        container.style.width = "400px"
        conCon.style.overflow = "hidden scroll"
        container.style.borderRadius = "5px"
        barProgress.style.maxHeight = "300px"
        barProgress.style.maxWidth = "400px"
        barProgress.style.height = "300px"
        barProgress.style.width = "400px"
        barProgress.style.borderRadius = "0px"
        barProgress.style.opacity = 0
        barProgress.style.background = "#1FDBDE"
        barProgress.style.pointerEvents = "none"
        barText.style.opacity = 0
        settings.style.pointerEvents = "all"
        settings.style.opacity = 1
        changelog.style.pointerEvents = "all"
        changelog.style.opacity = 1
    } else {
        container.style.height = "24px"
        container.style.width = "350px"
        conCon.style.overflow = "hidden"
        container.style.borderRadius = "24px"
        barProgress.style.maxHeight = "24px"
        barProgress.style.maxWidth = "350px"
        barProgress.style.height = "24px"
        barProgress.style.width = "350px"
        barProgress.style.borderRadius = "24px"
        barProgress.style.opacity = 1
        barProgress.style.background = "#F5FF65"
        barProgress.style.pointerEvents = "all"
        barText.style.opacity = 1
        settings.style.pointerEvents = "none"
        settings.style.opacity = 0
        changelog.style.pointerEvents = "none"
        changelog.style.opacity = 0
        updateProgress()
        updateMultiProgress()
    }
}
document.querySelector('body').appendChild(container)
 
var conCon = document.createElement("div")
conCon.style = `
    overflow: hidden;
    height: 300px;
`
container.appendChild(conCon)
 
new SmoothScroll(conCon, 90, 7)
 
containerPos()
 
petal = rarityArr[obj.rarity] + " " + petalArr[obj.id - 1]
thisNewPetal = getNewPetal(petal)
obj.id = thisNewPetal.id
obj.rarity = thisNewPetal.rarity
petal = thisNewPetal.petal
function convertNumber(value) {
    return Math.abs(Number(value)) >= 1.0e+9
        ? (Math.abs(Number(value)) / 1.0e+9).toFixed(2) + "B"
    : Math.abs(Number(value)) >= 1.0e+6
        ? (Math.abs(Number(value)) / 1.0e+6).toFixed(2) + "M"
    : Math.abs(Number(value)) >= 1.0e+3
        ? (Math.abs(Number(value)) / 1.0e+3).toFixed(2) + "K"
    : Math.abs(Number(value))
}
 
function containerPos() {
    if (obj.config.top) {
        container.style.top = "0"
        container.style.bottom = "unset"
    } else {
        container.style.top = "unset"
        container.style.bottom = "0"
    }
 
    if (obj.config.left) {
        container.style.left = "0"
        container.style.right = "unset"
    } else {
        container.style.left = "unset"
        container.style.right = "0"
    }
 
    container.style.transform = `translate(${obj.config.x}, ${obj.config.y}) scale(${obj.config.scale})`
}
 
function coloringBool(bool) {
    if (bool) return `<a style="color: #2BFFA3">${bool}</a>`
    else return `<a style="color: #DB5A5A">${bool}</a>`
}
 
function coloringValue(value) {
    return `<a style="color: #DBD74B">${value}</a>`
}
 
function coloringFunction(value) {
    return `<a style="color: #1FDBDE">${value}</a>`
}
 
obj.aim = Math.abs(Math.floor(obj.aim))
obj.aim = obj.aim == 0 ? 1 : obj.aim
 
function updateMultiProgress() {
    var multiProgressInnerHTML = "",
        thisMultiProgressValue
    if (obj.multipleCounting.enable) {
        for (const [index, [key, value]] of Object.entries(Object.entries(obj.multipleCounting.petal))) {
            thisMultiProgressValue = unsafeWindow.Module.HEAPU32[obj.basicId + (getNewPetal(key).id * 8) - (8 - getNewPetal(key).rarity)]
            multiProgressInnerHTML += `
        <br>
        <div style="margin-top: 5px">
            <div style="text-align: left; float: left; position: relative; top: -15px;">${key}</div>
            <div style="text-align: right; float: right; position: relative; top: -15px;">${convertNumber(thisMultiProgressValue)}/${convertNumber(value)}</div>
        </div>
        <div style="width: 99%;height: 7px;background: #222;border-radius: 5px;padding: 3px;margin: 2px 0 5px 0;">
            <div style="width: ${thisMultiProgressValue / value * 100}%;max-width:100%;background: ${rarityColors[getNewPetal(key).rarity]};height: 100%;border-radius: 3px; transition: all 1s ease-in-out;"></div>
        </div>
    `
        }
        multiProgress.innerHTML = multiProgressInnerHTML
    }
}
var multiProgress = document.createElement("div")
multiProgress.style = `
    top: 20px;
    right: -290px;
    width: 250px;
    height: auto;
    max-height: 200px;
    background: #333333;
    position: absolute;
    border-radius: 5px;
    padding: 15px;
    box-shadow: 5px 5px rgba(0, 0, 0, 0.3);
    overflow: hidden scroll;
    color: white;
    font-family: 'Ubuntu';
    transition: all 1s ease-in-out;
    font-size: 12px;
    text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
`
document.querySelector("body").appendChild(multiProgress)
new SmoothScroll(multiProgress, 90, 7)
 
function multiProgressToggle() {
    multiProgress.style.right = multiProgress.style.right == "20px" ? "-290px" : "20px"
}
var settings = document.createElement("div")
settings.style = `
    padding: 10px;
    color: white;
    font-family: 'Ubuntu';
    z-index: 1;
    font-size: 12px;
    line-height: 15px;
    opacity: 0;
    transition: all 1s ease-in-out;
    pointer-events: none;
    text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
`
conCon.appendChild(settings)
 
var settings_transform = document.createElement("div")
settings_transform.innerHTML = `
    <div style="font-size: 18px; margin-bottom: 10px; text-align: center;">Settings</div>
    <div id="sProgress" style="font-size: 15px; margin-top: 5px; margin-bottom: 5px;">Progress Counter</div>
    <div id="kProgress" style="margin-left: 10px; height: 0px; opacity: 0; pointer-events: none;">
        <div id="Cpetal">Petal: ${coloringValue(petal)}</div>
        <div id="Caim">Aim: ${coloringValue(obj.aim)}</div>
        <br>
        <div id="CMultiple_Toggle">Multiple counting: ${coloringBool(obj.multipleCounting.enable)}</div>
        <div id="CMultiple_petal">Petals: ${coloringValue(JSON.stringify(obj.multipleCounting.petal, null, "\u2001").replaceAll("\n", "<br>"))}</div>
        <div id="CMultiple_key">Key: ${coloringValue(obj.multipleCounting.key)}</div>
        <div id="CMultiple_view">${coloringFunction("View Progresses")}</div>
    </div>
    <div id="sTransform" style="font-size: 15px; margin-top: 5px; margin-bottom: 5px;">Position & Scale</div>
    <div id="kTransform" style="margin-left: 10px; height: 0px; opacity: 0; pointer-events: none;">
        <div id="Ctop">top: ${coloringBool(obj.config.top)}</div>
        <div id="Cleft">left: ${coloringBool(obj.config.left)}</div>
        <div id="CposX">x: ${coloringValue(obj.config.x)}</div>
        <div id="CposY">y: ${coloringValue(obj.config.y)}</div>
        <div id="Cscale">scale: ${coloringValue(obj.config.scale)}</div>
        <div id="CkeyToggle">Key: ${coloringValue(obj.config.key)}</div>
    </div>
    <div id="sFindId" style="font-size: 15px; margin-top: 5px; margin-bottom: 5px;">Find & Apply Basic ID</div>
    <div id="kFindId" style="margin-left: 10px; height: 0px; opacity: 0; pointer-events: none;">
        <div id="Cfind">${coloringFunction("Find & Apply")}</div>
        <div id="Capply">Basic ID: ${coloringValue(obj.basicId)}</div>
        <div id="CautoFind">Auto Update: ${coloringBool(obj.autoFind)}</div>
        <div id="Cinstruction">${coloringFunction("How to use?")}</div>
    </div>
`
settings.appendChild(settings_transform);
 
["sProgress", "sTransform", "sFindId"].forEach(x => {
    document.getElementById(x).onclick = function(e) {
        e.stopPropagation()
        var kTransform = document.getElementById("k"+ this.id.slice(1))
        if (kTransform.style.opacity != 1) {
            kTransform.style.opacity = 1
            kTransform.style.height = "auto"
            kTransform.style.pointerEvents = "all"
        } else {
            kTransform.style.opacity = 0
            kTransform.style.height = "0px"
            kTransform.style.pointerEvents = "none"
        }
    };
});
 
["Cpetal", "Caim", "CMultiple_Toggle", "CMultiple_petal", "CMultiple_key", "CMultiple_view", "Ctop", "Cleft", "CposX", "CposY", "Cscale", "CkeyToggle", "Cfind", "Capply", "CautoFind", "Cinstruction"].forEach(x => {
    document.getElementById(x).onclick = function(e) {
        e.stopPropagation()
        var value = "",
            value2 = [],
            endTime = 0,
            keysPressed = []
        if (["Cpetal", "Caim", "CMultiple_Toggle", "CMultiple_petal", "CMultiple_aim", "CMultiple_key", "CMultiple_view"].includes(this.id)) {
            if (["Cpetal"].includes(this.id)) {
                value = prompt('Petal name?', petal)
                if (petal == null) return
                petal = value
                var thisNewPetal = getNewPetal(petal)
                obj.id = thisNewPetal.id
                obj.rarity = thisNewPetal.rarity
                petal = thisNewPetal.petal
                this.innerHTML = `Petal: ${coloringValue(petal)}`
                barText.innerHTML = `${petal}: ${convertNumber(thisPetal)} / ${convertNumber(obj.aim)} (${(thisPetal * 100 / obj.aim).toFixed(2)}%)`
            } else if (["Caim"].includes(this.id)) {
                value = prompt('Aim?', obj.aim)
                if (value == null) return
                if (isNaN(value)) return alert(`Invalid input: [Aim] must be a number!`)
                obj.aim = Number(value)
                obj.aim = Math.abs(Math.floor(obj.aim))
                obj.aim = obj.aim == 0 ? 1 : obj.aim
                this.innerHTML = `Aim: ${coloringValue(obj.aim)}`
            } else if (["CMultiple_Toggle"].includes(this.id)) {
                value = !obj.multipleCounting.enable
                this.innerHTML = `Multiple counting: ${coloringBool(value)}`
                obj.multipleCounting.enable = value
            } else if (["CMultiple_petal"].includes(this.id)) {
                var count = 0,
                    petalObj = {},
                    thisPetalId, thisPetalRarity,
                    thisPetalObj = {}
                while (true) {
                    value = prompt(`${count + 1}. Petal name: Aim\nClick Cancel to Save & Exit`, `${Object.keys(obj.multipleCounting.petal)[count]}: ${Object.values(obj.multipleCounting.petal)[count]}`)
                    if (value == null) {
                        if (Object.keys(petalObj).length < 2) petalObj = obj.multipleCounting.petal
                        obj.multipleCounting.petal = petalObj
                        for (const [index, [key, value]] of Object.entries(Object.entries(obj.multipleCounting.petal))) {
                            thisPetalObj[index] = {
                                id: getNewPetal(key).id,
                                rarity: getNewPetal(key).rarity,
                                aim: value,
                            }
                        }
                        this.innerHTML = `Petals: ${coloringValue(JSON.stringify(obj.multipleCounting.petal, null, "\u2001").replaceAll("\n", "<br>"))}`
                        localStorage.setItem('petalFarmingCounter', JSON.stringify(obj))
                        return
                    }
                    value = value.split(":").map(x => x.trim())
                    if (isNaN(value[1])) {
                        alert(`Invalid input: [Aim] must be a number!`)
                        continue
                    }
                    petalObj[getNewPetal(value[0]).petal] = Number(value[1])
                    count++
                }
            } else if (["CMultiple_key"].includes(this.id)) {
                endTime = Date.now() + 5 * 1000
                this.innerHTML = `Key: <a class="blink">Press a key!</a>`
                var keyInterval_ = setInterval(() => {
                    keysPressed.unshift(lastKey)
                    if (keysPressed.length > 2) keysPressed.splice(2)
                    if (keysPressed[keysPressed.length - 1] != keysPressed[0]) {
                        obj.multipleCounting.key = keysPressed[0]
                        this.innerHTML = `Key: ${coloringValue(keysPressed[0])}`
                        clearInterval(keyInterval_)
                        localStorage.setItem('petalFarmingCounter', JSON.stringify(obj))
                        return
                    }
                    if (Date.now() > endTime) {
                        this.innerHTML = `Key: ${coloringValue(obj.multipleCounting.key)}`
                        clearInterval(keyInterval_)
                        return
                    }
                });
            } else if (["CMultiple_view"].includes(this.id)) multiProgressToggle()
        } else if (["Ctop", "Cleft", "CposX", "CposY", "Cscale", "CkeyToggle"].includes(this.id)) {
            if (["Ctop", "Cleft"].includes(this.id)) {
                value = !obj.config[x.slice(1)]
                this.innerHTML = `${x.slice(1)}: ${coloringBool(value)}`
                obj.config[x.slice(1)] = value
            } else if (["CposX", "CposY"].includes(this.id)) {
                value = prompt(x.slice(1), obj.config[x[x.length - 1].toLowerCase()].slice(0, -2))
                if (value == null) return
                if (isNaN(value)) return alert(`Invalid input: [${x.slice(1)}] must be a number!`)
                value = Number(value)
                this.innerHTML = `${x[x.length - 1].toLowerCase()}: ${coloringValue(value + "px")}`
                obj.config[x[x.length - 1].toLowerCase()] = value + "px"
            } else if (["Cscale"].includes(this.id)) {
                value = prompt(x.slice(1), obj.config[x.slice(1)])
                if (value == null) return
                if (isNaN(value)) return alert(`Invalid input: [${x.slice(1)}] must be a number!`)
                value = Number(value)
                if (value == 0) return
                this.innerHTML = `${x.slice(1)}: ${coloringValue(value)}`
                obj.config[x.slice(1)] = value
            } else if (["CkeyToggle"].includes(this.id)) {
                endTime = Date.now() + 5 * 1000
                this.innerHTML = `Key: <a class="blink">Press a key!</a>`
                var keyInterval = setInterval(() => {
                    keysPressed.unshift(lastKey)
                    if (keysPressed.length > 2) keysPressed.splice(2)
                    if (keysPressed[keysPressed.length - 1] != keysPressed[0]) {
                        obj.config.key = keysPressed[0]
                        this.innerHTML = `Key: ${coloringValue(keysPressed[0])}`
                        clearInterval(keyInterval)
                        localStorage.setItem('petalFarmingCounter', JSON.stringify(obj))
                        return
                    }
                    if (Date.now() > endTime) {
                        this.innerHTML = `Key: ${coloringValue(obj.config.key)}`
                        clearInterval(keyInterval)
                        return
                    }
                });
            }
            containerPos()
        } else if (["Cfind", "Capply", "CautoFind", "Cinstruction"].includes(this.id)) {
            if (["Cfind"].includes(this.id)) {
                var thisPetalName = ""
                value = prompt("Petal?", obj.find.petal)
                value = stringSimilarity.findBestMatch(value, petalArr)
                thisPetalName = value.bestMatch.target
                value = value.bestMatchIndex + 1
                rarityArr.forEach((x, i) => {
                    var temporaryValue = prompt(`Amount of ${x} ${thisPetalName}`, obj.find.value[i])
                    if (temporaryValue == null) temporaryValue = 0
                    if (isNaN(temporaryValue)) temporaryValue = 0
                    value2.push(Number(temporaryValue))
                })
                obj.find.petal = thisPetalName
                obj.find.value = value2
                obj.basicId = findSequence(value2, unsafeWindow.Module.HEAPU32) - (value * 8) + 8
                document.getElementById("Capply").innerHTML = `Basic ID: ${coloringValue(obj.basicId)}`
            } else if (["Capply"].includes(this.id)) {
                value = prompt('Basic ID?', obj.basicId)
                if (value == null) return
                if (isNaN(value)) return
                obj.basicId = Number(value)
                this.innerHTML = `Basic ID: ${coloringValue(obj.basicId)}`
            } else if (["CautoFind"].includes(this.id)) {
                value = !obj.autoFind
                this.innerHTML = `Auto Update: ${coloringBool(value)}`
                obj.autoFind = value
            } else if (["Cinstruction"].includes(this.id)) window.open("https://youtu.be/W2K6mWIzmHA?si=JWHOLJ67LSntThGW");
        }
        localStorage.setItem('petalFarmingCounter', JSON.stringify(obj))
    }
})
 
var changelog = document.createElement("div")
changelog.style = `
    padding: 10px;
    color: white;
    font-family: 'Ubuntu';
    z-index: 1;
    font-size: 12px;
    line-height: 15px;
    opacity: 0;
    transition: all 1s ease-in-out;
    pointer-events: none;
    text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
`
changelog.innerHTML = `
    <div style="font-size: 18px; margin-bottom: 10px; text-align: center;">Hackering (By kit2d2alt)</div>
    <div style="color: #1FDBDE; font-size: 15px; margin-top: 5px; margin-bottom: 5px">7/15/24 - v1.3</div>
    <div style="margin-left: 10px">
        - Added counting script from Furaken.<br>
        - Added ${coloringValue("Auto update ID")} (this requires you to use ${coloringValue("Find & Apply")} at least one times).
    </div>
    <div style="color: #1FDBDE; font-size: 15px; margin-top: 5px; margin-bottom: 5px">5/15/24 - v1.1</div>
    <div style="margin-left: 10px">
        - Updated tracers and removed some detectable features.
    </div>
`
conCon.appendChild(changelog)
 
var barText = document.createElement("div")
barText.style = `
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    width: 100%;
    color: white;
    font-family: 'Ubuntu';
    text-align: center;
    transition: all 1s ease-in-out;
    text-wrap: nowrap;
    z-index: 1;
    pointer-events: none;
    font-size: 14px;
    text-shadow: rgb(0 0 0) 2px 0px 0px, rgb(0 0 0) 1.75517px 0.958851px 0px, rgb(0 0 0) 1.0806px 1.68294px 0px, rgb(0 0 0) 0.141474px 1.99499px 0px, rgb(0 0 0) -0.832294px 1.81859px 0px, rgb(0 0 0) -1.60229px 1.19694px 0px, rgb(0 0 0) -1.97998px 0.28224px 0px, rgb(0 0 0) -1.87291px -0.701566px 0px, rgb(0 0 0) -1.30729px -1.5136px 0px, rgb(0 0 0) -0.421592px -1.95506px 0px, rgb(0 0 0) 0.567324px -1.91785px 0px, rgb(0 0 0) 1.41734px -1.41108px 0px, rgb(0 0 0) 1.92034px -0.558831px 0px;
`
container.appendChild(barText)
 
var barProgress = document.createElement("div")
barProgress.style = `
    background: #F5FF65;
    border-radius: 24px;
    width: 0px;
    max-width: 350px;
    max-height: 24px;
    transition: all 1s ease-in-out;
    opacity: 0;
    height: 0px;
    top: 50%;
    position: absolute;
    transform: translate(0px, -50%);
`
container.appendChild(barProgress)
barText.innerHTML = `${petal}: 0 / ${convertNumber(obj.aim)} (0.00%)`
 
var thisPetal, thisWidth, thisAim, thisPetalObj_
function updateProgress() {
    if (!obj.multipleCounting.enable) {
        thisPetal = unsafeWindow.Module.HEAPU32[obj.basicId + (obj.id * 8) - (8 - obj.rarity)]
        thisAim = obj.aim
    } else {
        thisPetal = 0
        thisAim = 0
        thisPetalObj_ = {}
        for (const [index, [key, value]] of Object.entries(Object.entries(obj.multipleCounting.petal))) {
            thisPetalObj_[index] = {
                id: getNewPetal(key).id,
                rarity: getNewPetal(key).rarity,
                aim: value,
            }
        }
        for (const [index, [key, value]] of Object.entries(Object.entries(thisPetalObj_))) {
            thisPetal += Number(unsafeWindow.Module.HEAPU32[obj.basicId + (value.id * 8) - (8 - value.rarity)])
            thisAim += Number(value.aim)
        }
    }
    thisWidth = container.style.width.slice(0, -2) * thisPetal / thisAim
    barProgress.style.height = thisWidth + "px"
    barProgress.style.width = thisWidth + "px"
    barProgress.style.opacity = thisPetal / (thisAim * 0.08)
    if (!obj.multipleCounting.enable) barText.innerHTML = `${petal}: ${convertNumber(thisPetal)} / ${convertNumber(thisAim)} (${(thisPetal * 100 /thisAim).toFixed(2)}%)`
    else barText.innerHTML = `${Object.keys(obj.multipleCounting.petal).length} petals: ${convertNumber(thisPetal)} / ${convertNumber(thisAim)} (${(thisPetal * 100 / thisAim).toFixed(2)}%)`
}
 
setInterval(() => {
    if (conCon.style.overflow != "hidden") return
    updateProgress()
    updateMultiProgress()
}, 10000)
 
var lastKey
document.documentElement.addEventListener("keydown", function (e) {
    lastKey = e.code
    if (event.code == obj.config.key) {
        if (container.style.opacity == "0") {
            container.style.opacity = 1
            container.style.pointerEvents = "all"
            settings.style.pointerEvents = "all"
            changelog.style.pointerEvents = "all"
        } else {
            container.style.opacity = 0
            container.style.pointerEvents = "none"
            settings.style.pointerEvents = "none"
            changelog.style.pointerEvents = "none"
        }
    }
    if (event.code == obj.multipleCounting.key) multiProgressToggle()
})
 
document.querySelector('canvas').onclick = function () {
    container.style.height = "20px"
    container.style.width = "300px"
    conCon.style.overflow = "hidden"
    container.style.borderRadius = "20px"
    barProgress.style.maxHeight = "20px"
    barProgress.style.maxWidth = "300px"
    barProgress.style.height = "20px"
    barProgress.style.width = "300px"
    barProgress.style.borderRadius = "20px"
    barProgress.style.opacity = 1
    barProgress.style.background = "#F5FF65"
    barProgress.style.pointerEvents = "all"
    barText.style.opacity = 1
    settings.style.pointerEvents = "none"
    settings.style.opacity = 0
    changelog.style.pointerEvents = "none"
    changelog.style.opacity = 0
    updateProgress()
    updateMultiProgress()
}
 
GM_addStyle(`
@keyframes blink {
    0% {color: #DBD74B}
    50% {color: #1FDBDE}
    100% {color: #DBD74B}
}
 
.blink {
    animation-name: blink;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
}
 
::-webkit-scrollbar {
    width: 5px;
}
::-webkit-scrollbar-track {
    background: #00000000;
}
::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
    background: #444;
}
`)
