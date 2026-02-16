
(function () {
  var soon = document.querySelectorAll("[data-soon='1']")
  for (var i = 0; i < soon.length; i++) {
    soon[i].addEventListener("click", function (e) {
      e.preventDefault()
    })
  }
})()
