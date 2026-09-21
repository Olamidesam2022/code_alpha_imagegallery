(function () {
  "use strict";

  var grid = document.getElementById("grid");
  var items = Array.prototype.slice.call(grid.querySelectorAll(".item"));
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var statusEl = document.getElementById("status");

  var dialog = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbTitle = document.getElementById("lb-title");
  var lbCat = document.getElementById("lb-cat");
  var lbCount = document.getElementById("lb-count");
  var lbFigure = document.getElementById("lb-figure");
  var prevBtn = document.getElementById("lb-prev");
  var nextBtn = document.getElementById("lb-next");
  var closeBtn = document.getElementById("lb-close");

  var visibleTiles = [];
  var index = 0;
  var loadToken = 0;

  /* ---------- Filtering ---------- */

  function applyFilter(name, label) {
    var shown = 0;

    items.forEach(function (item) {
      var match = name === "all" || item.dataset.category === name;
      if (match && item.hidden) {
        item.classList.remove("is-entering");
        // Restart the entrance animation
        void item.offsetWidth;
        item.classList.add("is-entering");
      }
      item.hidden = !match;
      if (match) shown++;
    });

    filterBtns.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.dataset.filter === name));
    });

    if (name === "all") {
      statusEl.textContent = "Showing all " + shown + " images";
    } else {
      statusEl.textContent = "Showing " + shown + " images in " + label;
    }
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyFilter(btn.dataset.filter, btn.textContent.trim());
    });
  });

  items.forEach(function (item) {
    item.addEventListener("animationend", function () {
      item.classList.remove("is-entering");
    });
  });

  /* ---------- Lightbox ---------- */

  function preload(url) {
    var img = new Image();
    img.src = url;
  }

  function show(i) {
    var total = visibleTiles.length;
    if (!total) return;

    index = (i + total) % total;
    var tile = visibleTiles[index];
    var url = tile.href;
    var thumb = tile.querySelector("img");
    var token = ++loadToken;

    lbTitle.textContent = tile.dataset.title || "";
    lbCat.textContent = tile.querySelector(".tile-cat").textContent;
    lbCount.textContent = index + 1 + " of " + total;

    // Fade the old image out, swap once the new one has loaded, then fade in
    lbImg.classList.add("is-loading");
    var loader = new Image();
    loader.onload = function () {
      if (token !== loadToken) return;
      lbImg.src = url;
      lbImg.alt = thumb ? thumb.alt : "";
      lbImg.classList.remove("is-loading");
    };
    loader.onerror = function () {
      if (token !== loadToken) return;
      lbImg.removeAttribute("src");
      lbImg.alt = "This image could not be loaded";
      lbImg.classList.remove("is-loading");
    };
    loader.src = url;

    prevBtn.disabled = nextBtn.disabled = total < 2;

    if (total > 1) {
      preload(visibleTiles[(index + 1) % total].href);
      preload(visibleTiles[(index - 1 + total) % total].href);
    }
  }

  function step(direction) {
    show(index + direction);
  }

  grid.addEventListener("click", function (e) {
    var tile = e.target.closest(".tile");
    if (!tile) return;
    // Without dialog support, the link simply opens the full image
    if (typeof dialog.showModal !== "function") return;

    e.preventDefault();
    visibleTiles = items
      .filter(function (item) { return !item.hidden; })
      .map(function (item) { return item.querySelector(".tile"); });

    show(visibleTiles.indexOf(tile));
    if (!dialog.open) {
      dialog.showModal();
      document.body.classList.add("no-scroll");
    }
  });

  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });
  closeBtn.addEventListener("click", function () { dialog.close(); });

  // Click on the dark area around the image to close
  dialog.addEventListener("click", function (e) {
    if (!e.target.closest("img, figcaption, .lb-nav, .lb-close, .lb-count")) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", function () {
    document.body.classList.remove("no-scroll");
  });

  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      show(0);
    } else if (e.key === "End") {
      e.preventDefault();
      show(visibleTiles.length - 1);
    }
  });

  // Swipe left or right on touch screens
  var startX = null;
  lbFigure.addEventListener("touchstart", function (e) {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });

  lbFigure.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
