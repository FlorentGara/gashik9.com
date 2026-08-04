(function () {
  var button = document.querySelector(".menu-button");
  var menu = document.querySelector(".menu");
  if (button && menu) {
    button.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  if (window.innerWidth > 1024) {
    var cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", function (e) {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });

    var hoverElements = document.querySelectorAll("a, button, .dog-card, .footer-links a");
    hoverElements.forEach(function(el) {
      el.addEventListener("mouseenter", function() {
        cursor.classList.add("hovering");
      });
      el.addEventListener("mouseleave", function() {
        cursor.classList.remove("hovering");
      });
    });
  }
})();
