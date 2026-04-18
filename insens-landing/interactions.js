// Interactions: cursor, scroll reveals, tweak mode handshake
(function () {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let rx = cx, ry = cy;

  window.addEventListener("mousemove", (e) => {
    cx = e.clientX; cy = e.clientY;
    if (cursor) cursor.style.transform = `translate(${cx}px, ${cy}px)`;
  });

  function tick() {
    rx += (cx - rx) * 0.12;
    ry += (cy - ry) * 0.12;
    if (ring) ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(tick);
  }
  tick();

  document.addEventListener("mouseover", (e) => {
    const t = e.target.closest("[data-hover]");
    if (t) cursor && cursor.classList.add("hover");
  });
  document.addEventListener("mouseout", (e) => {
    const t = e.target.closest("[data-hover]");
    if (t) cursor && cursor.classList.remove("hover");
  });

  // Scroll reveal via IntersectionObserver — re-attach as content mounts
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) en.target.classList.add("inview");
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

  function attach() {
    document.querySelectorAll(".reveal, .reveal-mask, .anatomy .row").forEach(el => {
      if (!el.__observed) { io.observe(el); el.__observed = true; }
    });
    // Ensure hero masks are visible immediately on load (above the fold)
    document.querySelectorAll(".hero .reveal-mask, .hero .reveal").forEach(el => {
      requestAnimationFrame(() => el.classList.add("inview"));
    });
  }
  const mo = new MutationObserver(attach);
  mo.observe(document.body, { childList: true, subtree: true });
  attach();

  // ---------- Tweak mode ----------
  const panel = document.getElementById("tweaks");
  const root = document.documentElement;

  const accents = {
    amber: "#c89b5a",
    rust: "#b1452a",
    moss: "#6a6a3a",
    ink: "#e5e5e5",
    orchid: "#9d6aa0"
  };

  function applyTweaks(t) {
    if (t.palette) root.setAttribute("data-palette", t.palette);
    if (t.motion) root.setAttribute("data-motion", t.motion);
    if (t.accent && accents[t.accent]) root.style.setProperty("--accent", accents[t.accent]);
    if (t.type) {
      if (t.type === "swiss") {
        root.style.setProperty("--serif", '"Inter Tight", "Helvetica Neue", sans-serif');
      } else if (t.type === "monodisp") {
        root.style.setProperty("--serif", '"JetBrains Mono", ui-monospace, monospace');
      } else {
        root.style.setProperty("--serif", '"Fraunces", "Times New Roman", serif');
      }
    }
    // highlight active buttons
    panel.querySelectorAll(".group").forEach(g => {
      const key = g.querySelector(".opts")?.getAttribute("data-tw");
      if (!key) return;
      g.querySelectorAll(".opt").forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-v") === t[key]);
      });
    });
  }

  let current = Object.assign({}, window.TWEAK_DEFAULTS || {
    palette: "noir", type: "editorial", motion: "full", accent: "amber"
  });
  applyTweaks(current);

  panel.addEventListener("click", (e) => {
    const btn = e.target.closest(".opt");
    if (!btn) return;
    const group = btn.closest(".opts");
    const key = group.getAttribute("data-tw");
    const val = btn.getAttribute("data-v");
    current = Object.assign({}, current, { [key]: val });
    applyTweaks(current);
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: val } }, "*");
    } catch (_) {}
  });

  // Tweak mode host handshake
  window.addEventListener("message", (e) => {
    const d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type === "__activate_edit_mode") panel.classList.add("open");
    if (d.type === "__deactivate_edit_mode") panel.classList.remove("open");
  });

  try {
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
  } catch (_) {}
})();
