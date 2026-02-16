
(function () {
  var tabSe = document.getElementById("tabSe")
  var tabNb = document.getElementById("tabNb")
  var tabMap = document.getElementById("tabMap")
  var panelSe = document.getElementById("panelSe")
  var panelNb = document.getElementById("panelNb")
  var panelMap = document.getElementById("panelMap")

  var badge = document.getElementById("platformBadge")

  var search = document.getElementById("search")
  var clearBtn = document.getElementById("clearBtn")

  var seList = document.getElementById("seList")
  var nbList = document.getElementById("nbList")
  var mapList = document.getElementById("mapList")

  var MAP = [
    {
      se: "$(sender)",
      nb: "$(user)",
      note: "Person who typed the command.",
      moreSe: "https://docs.streamelements.com/chatbot/variables/sender",
      moreNb: "https://docs.nightbot.tv/variables/user"
    },
    {
      se: "$(args)",
      nb: "$(query)",
      note: "All words after the command, as one string.",
      moreSe: "https://docs.streamelements.com/chatbot/variables/args",
      moreNb: "https://docs.nightbot.tv/variables/query"
    },
    {
      se: "$(touser)",
      nb: "$(touser)",
      note: "First word after the command. If empty, it falls back to the sender/user.",
      moreSe: "https://docs.streamelements.com/chatbot/variables/touser",
      moreNb: "https://docs.nightbot.tv/variables/touser"
    },
    {
      se: "$(title)",
      nb: "$(twitch $(channel) \"{{title}}\")",
      note: "Stream title.",
      moreSe: "https://docs.streamelements.com/chatbot/variables/title",
      moreNb: "https://docs.nightbot.tv/variables/twitch"
    },
    {
      se: "$(game)",
      nb: "$(twitch $(channel) \"{{game}}\")",
      note: "Current game/category.",
      moreSe: "https://docs.streamelements.com/chatbot/variables/game",
      moreNb: "https://docs.nightbot.tv/variables/twitch"
    },
    {
      se: "$(uptime)",
      nb: "$(twitch $(channel) \"{{uptimeLength}}\")",
      note: "Uptime string.",
      moreSe: "https://docs.streamelements.com/chatbot/variables/uptime",
      moreNb: "https://docs.nightbot.tv/variables/twitch"
    },
    {
      se: "$(time)",
      nb: "$(time US/Pacific)",
      note: "Time. Nightbot usually expects a timezone param.",
      moreSe: "https://docs.streamelements.com/chatbot/variables/time",
      moreNb: "https://docs.nightbot.tv/variables/time"
    },
    {
      se: "$(weather los angeles)",
      nb: "$(weather los angeles)",
      note: "Weather lookup.",
      moreSe: "https://docs.streamelements.com/chatbot/variables/weather",
      moreNb: "https://docs.nightbot.tv/variables/weather"
    }
  ]

  var SE_VARS = [
    {
      v: "$(sender)",
      d: "Person who typed the command. Best choice for printing the real username.",
      ex1: "@$(sender) is now lurking",
      ex2: "!cmd add !hi hi @$(sender)",
      type: "user",
      url: "https://docs.streamelements.com/chatbot/variables/sender"
    },
    {
      v: "$(touser)",
      d: "First word after the command. If empty, it falls back to the sender. This is why '!lurk going to get food' can turn into 'going'.",
      ex1: "hello $(touser)",
      ex2: "!cmd add !slap $(touser) got slapped",
      type: "text",
      url: "https://docs.streamelements.com/chatbot/variables/touser"
    },
    {
      v: "$(args)",
      d: "Everything after the command as one string. Good for letting people add a message.",
      ex1: "note: $(args)",
      ex2: "!cmd add !say $(args)",
      type: "text",
      url: "https://docs.streamelements.com/chatbot/variables/args"
    },
    {
      v: "$(title)",
      d: "Current stream title.",
      ex1: "title: $(title)",
      ex2: "!cmd add !title title: $(title)",
      type: "twitch",
      url: "https://docs.streamelements.com/chatbot/variables/title"
    },
    {
      v: "$(game)",
      d: "Current game/category.",
      ex1: "game: $(game)",
      ex2: "!cmd add !game game: $(game)",
      type: "twitch",
      url: "https://docs.streamelements.com/chatbot/variables/game"
    },
    {
      v: "$(uptime)",
      d: "Stream uptime.",
      ex1: "uptime: $(uptime)",
      ex2: "!cmd add !uptime uptime: $(uptime)",
      type: "twitch",
      url: "https://docs.streamelements.com/chatbot/variables/uptime"
    },
    {
      v: "$(random.pick 'a' 'b')",
      d: "Pick one item from a list. Great for random responses.",
      ex1: "$(random.pick 'hi' 'yo' 'sup')",
      ex2: "!cmd add !mood $(random.pick 'chill' 'hype' 'sleepy')",
      type: "random",
      url: "https://docs.streamelements.com/chatbot/variables/random"
    },
    {
      v: "$(random 1-100)",
      d: "Random number in a range.",
      ex1: "roll: $(random 1-100)",
      ex2: "!cmd add !roll you rolled $(random 1-6)",
      type: "random",
      url: "https://docs.streamelements.com/chatbot/variables/random"
    },
    {
      v: "$(math 2+2)",
      d: "Math helper.",
      ex1: "2+2 is $(math 2+2)",
      ex2: "!cmd add !double $(math $(args)*2)",
      type: "tools",
      url: "https://docs.streamelements.com/chatbot/variables/math"
    },
    {
      v: "$(repeat 3 hi)",
      d: "Repeat text N times.",
      ex1: "$(repeat 3 hi)",
      ex2: "!cmd add !spam $(repeat 5 pog)",
      type: "tools",
      url: "https://docs.streamelements.com/chatbot/variables/repeat"
    },
    {
      v: "$(time)",
      d: "Prints the current time (bot time).",
      ex1: "time: $(time)",
      ex2: "!cmd add !time time: $(time)",
      type: "tools",
      url: "https://docs.streamelements.com/chatbot/variables/time"
    },
    {
      v: "$(weather los angeles)",
      d: "Weather lookup for a location.",
      ex1: "weather: $(weather los angeles)",
      ex2: "!cmd add !weather $(weather $(args))",
      type: "tools",
      url: "https://docs.streamelements.com/chatbot/variables/weather"
    }
  ]

  var NB_VARS = [
    {
      v: "$(user)",
      d: "Person who typed the command. Best choice for printing the real username.",
      ex1: "@$(user) is now lurking",
      ex2: "!commands add !hi hi @$(user)",
      type: "user",
      url: "https://docs.nightbot.tv/variables/user"
    },
    {
      v: "$(touser)",
      d: "First word after the command. If empty, it falls back to the user. Same gotcha as StreamElements.",
      ex1: "hello $(touser)",
      ex2: "!commands add !slap $(touser) got slapped",
      type: "text",
      url: "https://docs.nightbot.tv/variables/touser"
    },
    {
      v: "$(query)",
      d: "Everything after the command as one string.",
      ex1: "note: $(query)",
      ex2: "!commands add !say $(query)",
      type: "text",
      url: "https://docs.nightbot.tv/variables/query"
    },
    {
      v: "$(channel)",
      d: "Current channel name.",
      ex1: "channel: $(channel)",
      ex2: "!commands add !followers $(channel) has $(twitch $(channel) \"{{followers}}\") followers",
      type: "channel",
      url: "https://docs.nightbot.tv/variables/channel"
    },
    {
      v: "$(1) ... $(9)",
      d: "Argument slots. $(1) is the first word after the command, $(2) is the second, etc.",
      ex1: "first: $(1) second: $(2)",
      ex2: "!commands add !swap $(2) then $(1)",
      type: "text",
      url: "https://docs.nightbot.tv/variables/arguments"
    },
    {
      v: "$(eval ... )",
      d: "Run JavaScript. Used for custom random, math, and logic.",
      ex1: "$(eval Math.floor(Math.random()*100)+1)",
      ex2: "!commands add !roll you rolled $(eval Math.floor(Math.random()*6)+1)",
      type: "tools",
      url: "https://docs.nightbot.tv/variables/eval"
    },
    {
      v: "$(twitch $(channel) \"{{title}}\")",
      d: "Twitch data via a template. You can ask for title, game, uptimeLength, followers, and more.",
      ex1: "title: $(twitch $(channel) \"{{title}}\")",
      ex2: "!commands add !uptime uptime: $(twitch $(channel) \"{{uptimeLength}}\")",
      type: "twitch",
      url: "https://docs.nightbot.tv/variables/twitch"
    },
    {
      v: "$(count)",
      d: "Auto increment counter. Every time the command runs, it goes up by 1.",
      ex1: "this ran $(count) times",
      ex2: "!commands add !bonk bonks: $(count)",
      type: "tools",
      url: "https://docs.nightbot.tv/variables/count"
    },
    {
      v: "$(time US/Pacific)",
      d: "Time variable. Nightbot wants a timezone.",
      ex1: "time: $(time US/Pacific)",
      ex2: "!commands add !time time: $(time US/Pacific)",
      type: "tools",
      url: "https://docs.nightbot.tv/variables/time"
    },
    {
      v: "$(weather los angeles)",
      d: "Weather lookup for a location.",
      ex1: "weather: $(weather los angeles)",
      ex2: "!commands add !weather $(weather $(query))",
      type: "tools",
      url: "https://docs.nightbot.tv/variables/weather"
    }
  ]

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
  }

  function setBadge(mode) {
    if (mode === "nb") {
      badge.textContent = "Nightbot"
      badge.classList.remove("badgeSe")
      badge.classList.remove("badgeMap")
      badge.classList.add("badgeNb")
      return
    }
    if (mode === "map") {
      badge.textContent = "Swap map"
      badge.classList.remove("badgeSe")
      badge.classList.remove("badgeNb")
      badge.classList.add("badgeMap")
      return
    }
    badge.textContent = "StreamElements"
    badge.classList.remove("badgeNb")
    badge.classList.remove("badgeMap")
    badge.classList.add("badgeSe")
  }

  function setTab(active) {
    var isSe = active === "se"
    var isNb = active === "nb"
    var isMap = active === "map"

    tabSe.setAttribute("aria-selected", isSe ? "true" : "false")
    tabNb.setAttribute("aria-selected", isNb ? "true" : "false")
    tabMap.setAttribute("aria-selected", isMap ? "true" : "false")

    panelSe.classList.toggle("hide", !isSe)
    panelNb.classList.toggle("hide", !isNb)
    panelMap.classList.toggle("hide", !isMap)

    setBadge(isNb ? "nb" : (isMap ? "map" : "se"))

    localStorage.setItem("help_tab", active)
    applyFilter()
  }

  function renderVarList(el, items) {
    el.innerHTML = ""
    for (var i = 0; i < items.length; i++) {
      var it = items[i]
      var div = document.createElement("div")
      div.className = "item"
      div.setAttribute("data-text", (it.v + " " + it.d + " " + it.ex1 + " " + it.ex2 + " " + (it.type || "")).toLowerCase())

      var more = it.url
        ? '<a class="more" href="' + esc(it.url) + '" target="_blank" rel="noreferrer">Learn more</a>'
        : ""

      var ex2 = it.ex2
        ? '<div class="codeBlock"><div class="codeLabel">Example command</div><div class="code">' + esc(it.ex2) + "</div></div>"
        : ""

      div.innerHTML =
        '<div class="varRow">' +
          '<div class="var">' + esc(it.v) + "</div>" +
          '<div class="pill">' + esc(it.type || "var") + "</div>" +
        "</div>" +
        '<div class="desc">' + esc(it.d) + "</div>" +
        '<div class="moreRow">' + more + "</div>" +
        '<div class="codeBlock">' +
          '<div class="codeLabel">Example output</div>' +
          '<div class="code">' + esc(it.ex1) + "</div>" +
        "</div>" +
        ex2

      el.appendChild(div)
    }
  }

  function renderMap(el, items) {
    el.innerHTML = ""
    for (var i = 0; i < items.length; i++) {
      var it = items[i]
      var div = document.createElement("div")
      div.className = "item"
      div.setAttribute("data-text", (it.se + " " + it.nb + " " + it.note).toLowerCase())

      var more = '<a class="more" href="' + esc(it.moreSe) + '" target="_blank" rel="noreferrer">SE docs</a>' +
                 '<span class="arrow"> </span>' +
                 '<a class="more" href="' + esc(it.moreNb) + '" target="_blank" rel="noreferrer">NB docs</a>'

      div.innerHTML =
        '<div class="varRow">' +
          '<div class="varStack">' +
            '<div class="var">' + esc(it.se) + '</div>' +
            '<div class="arrow">to</div>' +
            '<div class="var">' + esc(it.nb) + '</div>' +
          "</div>" +
          '<div class="pill">swap</div>' +
        "</div>" +
        '<div class="desc">' + esc(it.note) + "</div>" +
        '<div class="moreRow">' + more + "</div>"

      el.appendChild(div)
    }
  }

  function activeKey() {
    if (tabNb.getAttribute("aria-selected") === "true") return "nb"
    if (tabMap.getAttribute("aria-selected") === "true") return "map"
    return "se"
  }

  function applyFilter() {
    var q = (search.value || "").trim().toLowerCase()
    var key = activeKey()

    var listEl = key === "se" ? seList : (key === "nb" ? nbList : mapList)
    var kids = listEl.children

    for (var i = 0; i < kids.length; i++) {
      var t = kids[i].getAttribute("data-text") || ""
      kids[i].classList.toggle("hide", q && t.indexOf(q) === -1)
    }
  }

  tabSe.addEventListener("click", function () { setTab("se") })
  tabNb.addEventListener("click", function () { setTab("nb") })
  tabMap.addEventListener("click", function () { setTab("map") })

  search.addEventListener("input", applyFilter)
  clearBtn.addEventListener("click", function () {
    search.value = ""
    applyFilter()
    search.focus()
  })

  renderVarList(seList, SE_VARS)
  renderVarList(nbList, NB_VARS)
  renderMap(mapList, MAP)

  var saved = localStorage.getItem("help_tab")
  if (saved === "nb" || saved === "map") setTab(saved)
  else setTab("se")
})()
