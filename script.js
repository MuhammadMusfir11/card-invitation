// ===== UBAH DATA DI SINI =====
var CFG = {
  tanggal: "2026-12-20T11:00:00+07:00",
  lokasi: "Gedung Serbaguna Melati, Jl. Merdeka No. 10, Bandung",
  wa: "6281234567890",
  pesan: "Halo, saya akan hadir di pernikahan Rina & Dimas.",
  tirai_awal: true                  // true = tirai membuka saat link dibuka; false = langsung tampil nama
};

// Link Google Maps & WhatsApp
document.getElementById("maps").href =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CFG.lokasi);
document.getElementById("wa").href =
  "https://wa.me/" + CFG.wa + "?text=" + encodeURIComponent(CFG.pesan);

// Nama tamu dari link, contoh: ?to=Budi+Santoso (mengisi kolom RSVP)
var tamu = new URLSearchParams(location.search).get("to");

// ===== COVER NAMA + TIRAI =====
var stage = document.getElementById("stage");
var invite = document.getElementById("invite");
var angel = document.getElementById("angel");
var opened = false, ready = false;
document.body.classList.add("lock");     // halaman terkunci sampai tirai kedua
document.body.classList.add("opened");   // tombol musik langsung tampil

// huruf pada nama muncul satu per satu
document.querySelectorAll(".cv-w").forEach(function (w) {
  var t = w.textContent;
  w.textContent = "";
  t.split("").forEach(function (ch, i) {
    var s = document.createElement("span");
    s.textContent = ch;
    s.style.setProperty("--i", i);
    w.appendChild(s);
  });
});

// 1. tirai pertama: tertutup lalu membuka, memperlihatkan nama mempelai
if (CFG.tirai_awal === false) {
  angel.classList.remove("close", "covered");
  stage.classList.add("go");
  ready = true;
} else {
  setTimeout(function () {
    angel.classList.add("open");
    stage.classList.add("go");
    setTimeout(function () {
      angel.classList.remove("close", "covered", "open");   // sayap & awan kembali ke tepi layar
      ready = true;
    }, 2600);
  }, 700);
}

// 2. gulir / geser / tekan panah bawah -> tirai kedua, lalu masuk ke surat
function bukaSurat() {
  if (opened || !ready) return;
  opened = true;
  playMusic();
  angel.classList.add("close");                                       // tirai menutup (sayap + awan) sambil mengepak
  setTimeout(function () { angel.classList.add("covered"); featherBurst(); }, 1600);
  setTimeout(function () {                                            // di balik tirai: pindah ke surat
    stage.classList.add("gone");
    invite.classList.add("show");
    invite.removeAttribute("aria-hidden");
    document.body.classList.remove("lock");
    window.scrollTo(0, 0);
    startReveal();
  }, 1900);
  setTimeout(function () { angel.classList.add("open"); }, 2300);     // tirai membuka, surat terlihat
  setTimeout(function () { angel.style.display = "none"; }, 4400);
}
window.addEventListener("wheel", function (e) { if (e.deltaY > 0) bukaSurat(); }, { passive: true });
var y0 = null;
window.addEventListener("touchstart", function (e) { y0 = e.touches[0].clientY; }, { passive: true });
window.addEventListener("touchmove", function (e) { if (y0 !== null && y0 - e.touches[0].clientY > 24) bukaSurat(); }, { passive: true });
window.addEventListener("keydown", function (e) { if (["ArrowDown", "PageDown", " "].indexOf(e.key) > -1) bukaSurat(); });
document.getElementById("cue").addEventListener("click", bukaSurat);

// musik baru boleh diputar browser setelah ada sentuhan/klik pertama
["touchend", "click", "keydown"].forEach(function (ev) {
  window.addEventListener(ev, function once() {
    window.removeEventListener(ev, once);
    if (bgm.paused) playMusic();
  }, { passive: true });
});

// ===== ANIMASI SAAT SCROLL =====
function startReveal() {
  var items = document.querySelectorAll(".reveal, .orn");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) { io.observe(el); });
}

// Garis progres scroll
var bar = document.getElementById("progress");
window.addEventListener("scroll", function () {
  var h = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
}, { passive: true });

// ===== HITUNG MUNDUR =====
function tick() {
  var el = document.getElementById("count");
  var d = new Date(CFG.tanggal) - new Date();
  if (d < 0) { el.textContent = "Acara telah berlangsung"; return; }
  var s = Math.floor(d / 1000);
  var v = [[Math.floor(s / 86400), "hari"], [Math.floor(s % 86400 / 3600), "jam"],
           [Math.floor(s % 3600 / 60), "menit"], [s % 60, "detik"]];
  el.innerHTML = v.map(function (x) {
    return "<div><b>" + x[0] + "</b><span>" + x[1] + "</span></div>";
  }).join("");
}
tick();
setInterval(tick, 1000);

// ===== MUSIK =====
// Taruh file lagu di folder "musik" dengan nama lagu.mp3
var bgm = document.getElementById("bgm");
var musicBtn = document.getElementById("music");
function playMusic() {
  var p = bgm.play();
  if (p && p.catch) p.catch(function () {});
}
bgm.addEventListener("play", function () { musicBtn.classList.add("playing"); });
bgm.addEventListener("pause", function () { musicBtn.classList.remove("playing"); });
bgm.addEventListener("error", function () { musicBtn.classList.add("off"); }); // tombol disembunyikan jika file lagu belum ada
musicBtn.addEventListener("click", function () { bgm.paused ? playMusic() : bgm.pause(); });

// ===== GALERI: klik foto untuk memperbesar =====
var lb = document.getElementById("lightbox");
var lbImg = lb.querySelector("img");
document.querySelectorAll(".gallery img").forEach(function (img) {
  img.addEventListener("click", function () {
    lbImg.src = img.src;
    lb.classList.add("show");
  });
});
lb.addEventListener("click", function () { lb.classList.remove("show"); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") lb.classList.remove("show"); });

// ===== TAMBAHAN: kalender, kelopak, parallax, RSVP =====
(function () {
  document.getElementById("maps2").href = document.getElementById("maps").href;

  // Tambah ke Google Calendar
  var s = new Date(CFG.tanggal), e = new Date(s.getTime() + 3 * 3600e3);
  function f(d) { return d.toISOString().replace(/[-:]|\.\d{3}/g, ""); }
  document.getElementById("cal").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent("Pernikahan Rina & Dimas") +
    "&dates=" + f(s) + "/" + f(e) + "&location=" + encodeURIComponent(CFG.lokasi);

  // Kelopak jatuh
  var box = document.getElementById("petals");
  for (var i = 0; i < 16; i++) {
    var p = document.createElement("span");
    p.className = "petal";
    p.style.cssText = "left:" + Math.random() * 100 + "%;--s:" + (8 + Math.random() * 10) + "px;--t:" + (12 + Math.random() * 12) +
      "s;--d:-" + Math.random() * 20 + "s;--x:" + (Math.random() * 80 - 40) + "px;--c:" + (i % 3 ? "#f1b9c6" : "#a9bde8");
    box.appendChild(p);
  }

  // RSVP & ucapan (disimpan di browser; ganti ke Firebase agar semua tamu bisa melihat)
  var nm = document.getElementById("rname");
  if (tamu) nm.value = tamu;
  var list = document.getElementById("wishes"), cnt = document.getElementById("wcount"), KEY = "ucapan-undangan", data = [];
  try { data = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (x) {}
  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  function draw() {
    cnt.textContent = data.length;
    list.innerHTML = data.map(function (w) {
      return '<div class="wish"><b>' + esc(w.n) + '</b> <small>' + esc(w.s) + '</small><p>' + esc(w.t) + '</p></div>';
    }).join("");
  }
  draw();
  document.getElementById("rsvp").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var fm = ev.target, w = { n: fm.nama.value.trim(), s: fm.hadir.value || "Hadir", t: fm.ucapan.value.trim() };
    if (!w.n) return;
    data.unshift(w);
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (x) {}
    draw();
    fm.ucapan.value = "";
  });
})();

// ===== BULU: dipercikkan saat surat dibuka =====
function featherBurst() {
  var r = { left: window.innerWidth / 2, width: 0, top: window.innerHeight * 0.5, height: 0 };
  for (var i = 0; i < 18; i++) {
    var f = document.createElement("i");
    f.className = "fthr";
    f.style.cssText = "left:" + (r.left + r.width / 2) + "px;top:" + (r.top + r.height * 0.3) + "px;--x:" + (Math.random() * 240 - 120) +
      "px;--y:" + (-80 - Math.random() * 220) + "px;--r:" + (Math.random() * 360) + "deg;--t:" + (2.5 + Math.random() * 2) +
      "s;animation-delay:" + Math.random() * 0.6 + "s";
    document.body.appendChild(f);
    setTimeout((function (el) { return function () { el.remove(); }; })(f), 5500);
  }
}

// ===== SAYAP MALAIKAT & BURUNG =====
(function () {
  var big = "";
  [[1, 40], [0.78, 36], [0.58, 32], [0.4, 28]].forEach(function (rw, ri) {   // 4 lapis bulu
    for (var a = -100 + ri * 3; a <= 100; a += 7) {
      var L = (440 - Math.abs(a) * 0.35) * rw[0];
      big += '<ellipse cx="' + (L / 2) + '" cy="0" rx="' + (L / 2) + '" ry="' + rw[1] + '" transform="rotate(' + a +
        ')" fill="url(#bgw)" stroke="#c3cdf0" stroke-width="1"/>';
    }
  });
  document.getElementById("bigL").innerHTML = big;
  document.getElementById("bigR").innerHTML = big;


  var BIRD = '<svg viewBox="0 0 40 20"><path class="bw1" d="M20 11Q12 -1 0 3Q11 6 20 11Z"/><path class="bw2" d="M20 11Q28 -1 40 3Q29 6 20 11Z"/><ellipse cx="20" cy="11.5" rx="2.4" ry="1.7"/></svg>';
  var sc = document.getElementById("birds");
  for (var f = 0; f < 4; f++) {                       // 4 kawanan, masing-masing 3 burung
    var base = 6 + Math.random() * 30, dur = 24 + Math.random() * 18, rtl = f % 2, del = -Math.random() * dur;
    for (var j = 0; j < 3; j++) {
      var b = document.createElement("div");
      b.className = "bird" + (rtl ? " rtl" : "");
      b.style.cssText = "top:" + (base + j * 2.5 + Math.random() * 2) + "%;width:" + (16 + Math.random() * 12) + "px;--dur:" + dur +
        "s;--dy:" + (Math.random() * 60 - 30) + "px;--f:" + (0.4 + Math.random() * 0.2) + "s;animation-delay:" + (del - j * 0.9) + "s";
      b.innerHTML = BIRD;
      sc.appendChild(b);
    }
  }
})();

// ===== ELEMEN BERGERAK: kristal, bunga, kupu-kupu, kilau, mutiara, tirai =====
(function () {
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var scene = document.querySelector(".scene"), deco = document.getElementById("deco"), i, h = "";
  function rose(x, y, s, c1, c2) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"><circle r="11" fill="' + c1 + '"/><circle r="7.5" fill="' + c2 +
      '"/><circle r="4" fill="#e88aa3"/><path d="M-5 0Q0 -6 5 0" stroke="#d96f8f" fill="none" stroke-width="1"/></g>';
  }
  function leaf(x, y, a) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="12" ry="5" transform="rotate(' + a + ' ' + x + ' ' + y + ')" fill="#9cc98f"/>';
  }

  // kristal gantung di atas
  [8, 19, 30, 42, 54, 66, 77, 89].forEach(function (x, n) {
    h += '<i class="hang" style="left:' + x + '%;--len:' + (30 + (n * 19) % 50) + 'px;--sp:' + (2.6 + (n % 3) * 0.7) + 's;--dl:-' + (n * 0.6) + 's"><b></b></i>';
  });

  // kupu-kupu
  var BF = '<svg viewBox="0 0 30 24"><g class="bwl"><path d="M15 12C10 0 0 2 2 11C3 17 10 18 15 12Z"/></g><g class="bwr"><path d="M15 12C20 0 30 2 28 11C27 17 20 18 15 12Z"/></g><rect x="14.2" y="6" width="1.6" height="12" rx=".8" fill="#6b5aa0"/></svg>';
  [[18, 26, 30, "bf1"], [52, 22, 38, "bf2"], [74, 30, 34, "bf3"]].forEach(function (p, n) {
    h += '<div class="bfly ' + p[3] + '" style="--top:' + p[0] + '%;--w:' + p[1] + 'px;--dur:' + p[2] + 's;--dl:-' + (n * 11) + 's">' + BF + '</div>';
  });
  deco.innerHTML = h;

  // tirai, kilau, dan mutiara naik di latar
  var t = '<div class="curtain cl"></div><div class="curtain cr"></div>';
  for (i = 0; i < 24; i++) {
    var z = rnd(2, 5);
    t += '<i class="sp" style="left:' + rnd(2, 98) + '%;top:' + rnd(3, 85) + '%;width:' + z + 'px;height:' + z + 'px;--t:' + rnd(2, 4.5) + 's;--d:-' + rnd(0, 4) + 's"></i>';
  }
  for (i = 0; i < 10; i++) {
    t += '<i class="pearl" style="left:' + rnd(2, 96) + '%;--s:' + rnd(7, 18) + 'px;--x:' + rnd(-40, 40) + 'px;--t:' + rnd(14, 26) + 's;--d:-' + rnd(0, 20) + 's"></i>';
  }
  scene.insertAdjacentHTML("beforeend", t);
})();

// ===== AWAN: menutup & membuka seperti tirai, dan tetap bergerak di atas-bawah =====
(function () {
  var c = "";
  for (var x = 0, n = 0; x <= 800; x += 44, n++) {
    c += '<circle cx="' + x + '" cy="' + (28 + (n * 13) % 9) + '" r="' + (26 + (n * 37) % 21) + '"/>';
  }
  c += '<circle cx="800" cy="28" r="26"/>';                       // ujung = awal, supaya sambungan mulus
  var PUFF = '<svg viewBox="0 0 800 100" preserveAspectRatio="xMinYMid meet">' + c + '</svg>';
  function strips() {
    return '<div class="strip s2">' + PUFF + PUFF + '</div><div class="strip s1">' + PUFF + PUFF + '</div>';
  }
  // awan besar (ikut menutup layar saat amplop diklik)
  document.getElementById("angel").insertAdjacentHTML("afterbegin",
    '<div class="cb top"><div class="body"></div><div class="edge">' + strips() + '</div></div>' +
    '<div class="cb bot"><div class="body"></div><div class="edge">' + strips() + '</div></div>');
  // awan tipis yang tetap ada setelah undangan terbuka
  document.getElementById("deco").insertAdjacentHTML("afterbegin",
    '<div class="dc top"><div class="wrap">' + strips() + '</div></div><div class="dc bot"><div class="wrap">' + strips() + '</div></div>');
})();
