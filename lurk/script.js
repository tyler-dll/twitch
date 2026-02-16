(function () {
  var MAX = 6
  var MIN = 1
  var MAXLEN = 60

  var PRESETS = [
    "@$(user/sender) is lurking, my controller needs a pep talk",
    "@$(user/sender) activated lurk mode, I am here in spirit",
    "@$(user/sender) is lurking, my fridge called and I answered",
    "@$(user/sender) went lurk, brb negotiating with the microwave",
    "@$(user/sender) went lurk, side quest time",
    "@$(user/sender) is lurking, gonna go touch grass, maybe",
    "@$(user/sender) is lurking, I have to do one adult thing, tragic",
    "@$(user/sender) went lurk, doing cardio, walking to other room",
    "@$(user/sender) activated stealth mode, if spotted it was lag",
    "@$(user/sender) is lurking, brb finding where I left my brain",
    "@$(user/sender) is lurking, if you need me, yell into the void",
    "@$(user/sender) activated ninja lurk, you saw nothing",
    "@$(user/sender) is lurking, brb turning 1 min into 12 mins",
    "@$(user/sender) is lurking, brb going to pretend I am productive",
    "@$(user/sender) is going to deal with real life for a sec",
    "@$(user/sender) is lurking for a bit, still watching, probably",
    "@$(user/sender) is lurking, don't forget me",
    "@$(user/sender) went lurk, brb",
    "@$(user/sender) is lurking for a bit, still watching",
    "@$(user/sender) stepped away, will be back soon",
    "@$(user/sender) is in the background, still here",
    "@$(user/sender) is still around, just not typing",
    "@$(user/sender) is lurking, still vibing",
    "@$(user/sender) is lurking, back in a few"
  ]


  var rowsEl = document.getElementById("rows")
  var tpl = document.getElementById("rowTpl")
  var addBtn = document.getElementById("addBtn")
  var resetBtn = document.getElementById("resetBtn")
  var copyBtn = document.getElementById("copyBtn")
  var outEl = document.getElementById("out")
  var countText = document.getElementById("countText")
  var errorText = document.getElementById("errorText")
  var platformSel = document.getElementById("platformSel")
  var modeSel = document.getElementById("modeSel")
  var varsBox = document.getElementById("varsBox")
  var varsTplSe = document.getElementById("varsTplSe")
  var varsTplNb = document.getElementById("varsTplNb")

  var lastPlatform = "se"
  var suppressChange = false

  function userVar() {
    return platformSel.value === "nb" ? "@$(user)" : "@$(sender)"
  }

  function applyUserVar(s) {
    return String(s || "").split("@$(user/sender)").join(userVar())
  }

  function pickPreset() {
    if (!PRESETS || !PRESETS.length) return userVar() + " is lurking"
    var i = Math.floor(Math.random() * PRESETS.length)
    return applyUserVar(PRESETS[i])
  }

  function pickPresetBatch(n) {
    n = n || 1
    var out = []
    if (!PRESETS || !PRESETS.length) {
      out.push(userVar() + " is lurking")
      while (out.length < n) out.push(out[0])
      return out
    }

    var idxs = []
    for (var i = 0; i < PRESETS.length; i++) idxs.push(i)

    for (var j = idxs.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1))
      var tmp = idxs[j]
      idxs[j] = idxs[k]
      idxs[k] = tmp
    }

    for (var t = 0; t < n; t++) {
      out.push(applyUserVar(PRESETS[idxs[t % idxs.length]]))
    }
    return out
  }

  function setRandomIntoInput(input) {
    if (!input) return
    input.value = normalizeText(pickPreset()).slice(0, MAXLEN)
  }

  var MAP = {
    se_to_nb: [
      { re: /\$\(\s*sender\s*\)/gi, to: "$(user)" },
      { re: /\$\(\s*source\s*\)/gi, to: "$(user)" },
      { re: /\$\(\s*args\s*\)/gi, to: "$(query)" },
      { re: /\$\(\s*title\s*\)/gi, to: '$(twitch $(channel) "{{title}}}")' },
      { re: /\$\(\s*game\s*\)/gi, to: '$(twitch $(channel) "{{game}}}")' },
      { re: /\$\(\s*uptime\s*\)/gi, to: '$(twitch $(channel) "{{uptimeLength}}}")' }
    ],
    nb_to_se: [
      { re: /\$\(\s*user\s*\)/gi, to: "$(sender)" },
      { re: /\$\(\s*query\s*\)/gi, to: "$(args)" },

      { re: /\$\(\s*twitch\s*\$\(\s*channel\s*\)\s*"\{\{title\}\}"\s*\)/gi, to: "$(title)" },
      { re: /\$\(\s*twitch\s*\$\(\s*channel\s*\)\s*"\{\{game\}\}"\s*\)/gi, to: "$(game)" },
      { re: /\$\(\s*twitch\s*\$\(\s*channel\s*\)\s*"\{\{uptimeLength\}\}"\s*\)/gi, to: "$(uptime)" }
    ]
  }

  var SE_TO_NB_WARN = [
    { key: "$(random) / $(random.pick)", re: /\$\(\s*random(\.| |\)|$)/i },
    { key: "$(repeat)", re: /\$\(\s*repeat\b/i },
    { key: "$(math)", re: /\$\(\s*math\b/i },
    { key: "$(sender.xxx) / $(source.xxx)", re: /\$\(\s*(sender|source)\.[^)]+\)/i }
  ]

  var NB_TO_SE_WARN = [
    { key: "$(eval)", re: /\$\(\s*eval\b/i },
    { key: "$(urlfetch)", re: /\$\(\s*urlfetch\b/i },
    { key: "$(twitch ...)", re: /\$\(\s*twitch\b/i }
  ]

  function normalizeText(s) {
    if (s == null) return ""
    s = String(s)
    s = s.replace(/\u2019/g, "'").replace(/\u2018/g, "'")
    s = s.replace(/\u201C/g, '"').replace(/\u201D/g, '"')
    return s
  }

  function getRows() {
    return Array.prototype.slice.call(rowsEl.querySelectorAll(".row"))
  }

  function getInputs() {
    return Array.prototype.slice.call(rowsEl.querySelectorAll(".rowMsg"))
  }

  function getMessages() {
    var inputs = getInputs()
    var msgs = []
    for (var i = 0; i < inputs.length; i++) {
      var v = normalizeText(inputs[i].value).trim()
      if (v.length) msgs.push(v)
    }
    return msgs
  }

  function setError(msg, good) {
    errorText.textContent = msg || ""
    if (!msg) return
    errorText.style.color = good ? "var(--good)" : "var(--bad)"
  }

  function updateCounts() {
    var rows = getRows()
    countText.textContent = rows.length + " of " + MAX

    for (var i = 0; i < rows.length; i++) {
      var input = rows[i].querySelector(".rowMsg")
      var chars = rows[i].querySelector(".rowChars")
      var v = normalizeText(input.value)
      if (v !== input.value) input.value = v
      chars.textContent = input.value.length + "/" + MAXLEN
    }

    addBtn.disabled = rows.length >= MAX
  }

  function escapeForSingleQuotes(s) {
    return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")
  }

  function applyMap(text, fromPlatform, toPlatform) {
    var t = text
    var list = (fromPlatform === "se" && toPlatform === "nb") ? MAP.se_to_nb : MAP.nb_to_se
    for (var i = 0; i < list.length; i++) {
      t = t.replace(list[i].re, list[i].to)
    }
    return t
  }

  function setPlaceholders(platform) {
    var ph = platform === "nb"
      ? "@$(user) is now lurking, snack quest in progress"
      : "@$(sender) is now lurking, snack quest in progress"

    var inputs = getInputs()
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].placeholder = ph
    }
  }

  function buildSECommand(msgs) {
    var mode = modeSel.value === "edit" ? "edit" : "add"
    var parts = []
    for (var j = 0; j < msgs.length; j++) {
      parts.push("'" + escapeForSingleQuotes(msgs[j]) + "'")
    }
    return "!command " + mode + " !lurk $(random.pick " + parts.join(" ") + ")"
  }

  function buildNBCommand(msgs) {
    var mode = modeSel.value === "edit" ? "editcom" : "addcom"
    var parts = []
    for (var j = 0; j < msgs.length; j++) {
      parts.push("'" + escapeForSingleQuotes(msgs[j]) + "'")
    }
    return "!" + mode + " !lurk $(eval msgs=[" + parts.join(",") + "], msgs[Math.floor(Math.random()*msgs.length)])"
  }

  function buildCommand() {
    var msgs = getMessages()
    if (msgs.length < MIN) return ""

    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].length > MAXLEN) return ""
    }

    return platformSel.value === "nb" ? buildNBCommand(msgs) : buildSECommand(msgs)
  }

  function updateVarsHelp() {
    varsBox.innerHTML = ""
    var t = platformSel.value === "nb" ? varsTplNb : varsTplSe
    if (t && t.content) varsBox.appendChild(t.content.cloneNode(true))
  }

  function updateOutput() {
    setError("")
    var msgs = getMessages()

    if (msgs.length < MIN) {
      outEl.value = ""
      copyBtn.disabled = true
      setError("Add at least 1 option")
      return
    }

    if (msgs.length > MAX) {
      outEl.value = ""
      copyBtn.disabled = true
      setError("Too many options. Max is " + MAX)
      return
    }

    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].length > MAXLEN) {
        outEl.value = ""
        copyBtn.disabled = true
        setError("One option is over " + MAXLEN + " chars")
        return
      }
    }

    outEl.value = buildCommand()
    copyBtn.disabled = !outEl.value
  }

  function addRow(value) {
    var rows = getRows()
    if (rows.length >= MAX) return

    var node = tpl.content.firstElementChild.cloneNode(true)
    var input = node.querySelector(".rowMsg")
    var del = node.querySelector(".rowDel")
    var rand = node.querySelector(".rowRand")

    input.value = normalizeText(value || "")
    input.addEventListener("input", function () {
      updateCounts()
      updateOutput()
    })

    if (rand) {
      rand.addEventListener("click", function () {
        setRandomIntoInput(input)
        updateCounts()
        updateOutput()
      })
    }

    del.addEventListener("click", function () {
      node.remove()
      updateCounts()
      updateOutput()
      if (getMessages().length < MIN) setError("Add at least 1 option")
    })

    rowsEl.appendChild(node)
    setPlaceholders(platformSel.value)
    updateCounts()
    updateOutput()
  }
  function resetAll() {
    rowsEl.innerHTML = ""
    var picks = pickPresetBatch(3)
    addRow(picks[0])
    addRow(picks[1])
    addRow(picks[2])
    setError("")
  }

  function copyText(text) {
    if (!text) return
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        setError("Copied", true)
        setTimeout(function () { setError("") }, 900)
      }).catch(function () {
        fallbackCopy()
      })
      return
    }
    fallbackCopy()
  }

  function fallbackCopy() {
    outEl.focus()
    outEl.select()
    try {
      document.execCommand("copy")
      setError("Copied", true)
      setTimeout(function () { setError("") }, 900)
    } catch (e) {
      setError("Copy failed. Select and copy it yourself")
    }
  }

  function loadSettings() {
    var p = localStorage.getItem("lurk_platform")
    var m = localStorage.getItem("lurk_mode")
    if (p === "nb" || p === "se") platformSel.value = p
    if (m === "add" || m === "edit") modeSel.value = m
    lastPlatform = platformSel.value
  }

  function saveSettings() {
    localStorage.setItem("lurk_platform", platformSel.value)
    localStorage.setItem("lurk_mode", modeSel.value)
  }

  function gatherWarnings(texts, fromPlatform, toPlatform) {
    var list = (fromPlatform === "se" && toPlatform === "nb") ? SE_TO_NB_WARN : NB_TO_SE_WARN
    var found = []
    for (var i = 0; i < list.length; i++) {
      var hit = false
      for (var j = 0; j < texts.length; j++) {
        if (list[i].re.test(texts[j])) {
          hit = true
          break
        }
      }
      if (hit) found.push(list[i].key)
    }
    return found
  }

  function attemptPlatformSwitch(next) {
    var inputs = getInputs()
    var mapped = []
    for (var i = 0; i < inputs.length; i++) {
      mapped.push(applyMap(inputs[i].value, lastPlatform, next))
    }

    var warns = gatherWarnings(mapped, lastPlatform, next)
    if (warns.length) {
      var msg = "Some vars may not convert clean.\n\nFound:\n"
      for (var w = 0; w < warns.length; w++) msg += "- " + warns[w] + "\n"
      msg += "\nSwitch anyway?"
      if (!window.confirm(msg)) {
        suppressChange = true
        platformSel.value = lastPlatform
        suppressChange = false
        return
      }
    }

    suppressChange = true
    platformSel.value = next
    suppressChange = false

    for (var k = 0; k < inputs.length; k++) inputs[k].value = mapped[k]
    lastPlatform = next
    saveSettings()
    updateVarsHelp()
    setPlaceholders(next)
    updateCounts()
    updateOutput()
  }

  addBtn.addEventListener("click", function () {
    if (getRows().length >= MAX) return
    addRow("")
    setError("")
  })

  resetBtn.addEventListener("click", function () {
    resetAll()
  })

  copyBtn.addEventListener("click", function () {
    var cmd = buildCommand()
    if (!cmd) {
      setError("Add at least 1 option")
      return
    }
    copyText(cmd)
  })

  platformSel.addEventListener("change", function () {
    if (suppressChange) return
    var next = platformSel.value
    if (next === lastPlatform) return
    attemptPlatformSwitch(next)
  })

  modeSel.addEventListener("change", function () {
    saveSettings()
    updateOutput()
  })

  loadSettings()
  updateVarsHelp()
  setPlaceholders(platformSel.value)
  resetAll()
  updateCounts()
  updateOutput()
})()
