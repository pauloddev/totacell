(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Intro
  var intro = $("#intro");
  if (intro) {
    var hide = function () { intro.classList.add("is-done"); };
    if (reduce) hide(); else window.addEventListener("load", function () { setTimeout(hide, 700); });
    setTimeout(hide, 2500);
  }

  // Header + menu
  var header = $(".header");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 10); };
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  var burger = $(".burger"), drawer = $("#drawer");
  var setMenu = function (open) {
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    drawer.classList.toggle("is-open", open);
  };
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  $$("#drawer a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Revelar ao rolar
  var items = $$("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add("is-in"); });

  // Entrada escalonada, varredura nas seções e rótulos que se "decodificam"
  $$("[data-stagger]").forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (el, i) { el.style.setProperty("--i", i); });
  });
  var GLYPHS = "01<>/#_[]{}=+*";
  var decode = function (el) {
    if (el.dataset.decoded || el.children.length) return;
    el.dataset.decoded = "1";
    var final = el.textContent, len = final.length, frame = 0, total = 18;
    el.setAttribute("aria-label", final);
    el.classList.add("is-decoding");
    var tick = function () {
      frame++;
      var done = Math.floor((frame / total) * len), out = "";
      for (var i = 0; i < len; i++) {
        var c = final[i];
        out += i < done || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (frame < total) requestAnimationFrame(tick);
      else { el.textContent = final; el.classList.remove("is-decoding"); el.removeAttribute("aria-label"); }
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !reduce) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sec = e.target;
        sec.style.setProperty("--sh", sec.offsetHeight + "px");
        sec.classList.add("is-live");
        $$(".eyebrow", sec).forEach(decode);
        sio.unobserve(sec);
      });
    }, { threshold: 0.12 });
    $$("main > .section").forEach(function (sec) { sio.observe(sec); });
  }

  // Vídeos: carrossel com reprodução automática, um vídeo de cada vez
  var reel = $("#reel");
  if (reel) {
    var track = $("#reel-track", reel);
    var cards = $$(".reel__item", reel);
    var bars = $$(".reel__bars span", reel);
    var playBtn = $("#reel-play"), soundBtn = $("#reel-sound"), status = $("#reel-status"), cta = $("#reel-cta");
    var cur = -1, visible = false, userPaused = reduce, muted = true, raf = 0, progScroll = 0;
    var vid = function (i) { return $("video", cards[i]); };
    // MP4 (H.264) primeiro; WebM (VP9) para navegadores sem H.264
    var useMp4 = !!document.createElement("video").canPlayType('video/mp4; codecs="avc1.4d401f"');
    var srcOf = function (v) { return useMp4 ? v.dataset.src : v.dataset.src.replace(/\.mp4$/, ".webm"); };
    var label = function (i) { return $(".reel__cap b", cards[i]).textContent; };

    var paintBars = function () {
      var v = vid(cur);
      bars.forEach(function (b, i) {
        b.classList.toggle("is-done", i < cur);
        if (i !== cur) b.firstChild.style.transform = "";
      });
      if (v && v.duration) bars[cur].firstChild.style.transform = "scaleX(" + Math.min(1, v.currentTime / v.duration) + ")";
      raf = requestAnimationFrame(paintBars);
    };
    var syncUi = function () {
      var paused = userPaused || !visible;
      playBtn.classList.toggle("is-paused", userPaused);
      playBtn.setAttribute("aria-label", userPaused ? "Reproduzir vídeos" : "Pausar vídeos");
      cards.forEach(function (c, i) { c.classList.toggle("is-paused", i === cur && paused); });
      $(".reel__now", cards[cur]).textContent = paused ? "Pausado" : "Tocando agora";
    };
    var run = function () {
      var v = vid(cur);
      if (!v) return;
      if (!v.src) v.src = srcOf(v);
      v.muted = muted;
      if (visible && !userPaused && !document.hidden) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
      syncUi();
    };
    var center = function (i) {
      var c = cards[i];
      var left = c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2;
      progScroll = Date.now();
      track.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
    };
    var go = function (i, scroll) {
      i = (i + cards.length) % cards.length;
      if (i === cur) return;
      if (cur > -1) { var old = vid(cur); old.pause(); try { old.currentTime = 0; } catch (e) {} cards[cur].classList.remove("is-active", "is-paused"); }
      cur = i;
      cards.forEach(function (c, k) { $(".reel__card", c).setAttribute("aria-current", k === i ? "true" : "false"); });
      cards[i].classList.add("is-active");
      status.textContent = label(i) + " · " + (i + 1) + " de " + cards.length;
      cta.href = cards[i].dataset.wa;
      var nx = vid((i + 1) % cards.length); if (!nx.src) { nx.preload = "metadata"; nx.src = srcOf(nx); }
      if (scroll !== false) center(i);
      run();
    };

    cards.forEach(function (c, i) {
      vid(i).addEventListener("ended", function () { if (i === cur) go(cur + 1); });
      $(".reel__card", c).addEventListener("click", function () {
        if (i === cur) { userPaused = !userPaused; run(); }
        else { userPaused = false; go(i); }
      });
    });
    $$("[data-reel-go]").forEach(function (b) {
      b.addEventListener("click", function () { userPaused = false; go(cur + Number(b.dataset.reelGo)); });
    });
    playBtn.addEventListener("click", function () { userPaused = !userPaused; run(); });
    soundBtn.addEventListener("click", function () {
      muted = !muted;
      soundBtn.setAttribute("aria-pressed", String(!muted));
      soundBtn.setAttribute("aria-label", muted ? "Ligar o som" : "Desligar o som");
      if (!muted) userPaused = false;
      run();
    });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(cur + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(cur - 1); }
    });
    // arrastar no celular: o vídeo que parar no centro passa a tocar
    var st;
    track.addEventListener("scroll", function () {
      clearTimeout(st);
      st = setTimeout(function () {
        if (Date.now() - progScroll < 900) return;
        var mid = track.scrollLeft + track.clientWidth / 2, best = cur, d = Infinity;
        cards.forEach(function (c, i) { var m = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (m < d) { d = m; best = i; } });
        if (best !== cur) go(best, false);
      }, 160);
    }, { passive: true });
    // só toca quando a seção está na tela (economiza dados e bateria)
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; run(); }, { threshold: 0.35 }).observe(track);
    } else visible = true;
    document.addEventListener("visibilitychange", run);

    go(0, false);
    raf = requestAnimationFrame(paintBars);
  }

  // Vista 360° e mapa: o iframe só é criado quando a seção chega perto da tela
  var embeds = $$("[data-embed]");
  var mount = function (box) {
    if (box.dataset.mounted) return;
    box.dataset.mounted = "1";
    var f = document.createElement("iframe");
    f.src = box.dataset.embed; f.title = box.dataset.embedTitle || ""; f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade"; f.allowFullscreen = true;
    box.appendChild(f);
  };
  if ("IntersectionObserver" in window) {
    var eio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { mount(e.target); eio.unobserve(e.target); } });
    }, { rootMargin: "500px" });
    embeds.forEach(function (b) { eio.observe(b); });
  } else embeds.forEach(mount);

  var ano = $("#ano"); if (ano) ano.textContent = new Date().getFullYear();
})();
