(function () {
  var button = document.querySelector(".menu-button");
  var menu = document.querySelector(".menu");
  if (button && menu) {
    button.innerHTML = "☰"; // Default hamburger
    button.addEventListener("click", function () {
      menu.classList.toggle("open");
      if (menu.classList.contains("open")) {
        button.innerHTML = "✕"; // Close icon
      } else {
        button.innerHTML = "☰"; // Hamburger icon
      }
    });

    // Add gear icon at bottom of menu for mobile - only if not already added by gashi-render.js
    document.addEventListener('DOMContentLoaded', function() {
      if (!document.querySelector('.admin-icon')) {
        var gear = document.createElement("a");
        gear.href = "../dashboard/index.html";
        gear.innerHTML = "⚙️";
        gear.style.marginTop = "auto";
        gear.style.fontSize = "24px";
        gear.style.color = "#f47320";
        menu.appendChild(gear);
      }
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
