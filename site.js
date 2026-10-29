(function() {
  // Terminal status ticker
  const status = document.getElementById("status");
  if (!status) return;
  const lines = [
    "reading the economic system",
    "mapping First Nations development pathways",
    "sequencing regional investment logic",
    "keeping a community plan in use",
    "turning evidence into decisions",
    "building strategy that survives reality"
  ];
  let i = 0;
  setInterval(function() {
    i = (i + 1) % lines.length;
    status.textContent = lines[i];
  }, 2800);
})();

(function() {
  // Scroll reveal
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function(el) { el.classList.add("in"); });
    return;
  }
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14 });
  items.forEach(function(el) { observer.observe(el); });
})();

(function() {
  // Hero systems map canvas
  const canvas = document.getElementById("systems-map");
  if (!canvas) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");

  const points = [
    { x: .16, y: .22, r: 4,   c: "#A85F38" },
    { x: .39, y: .18, r: 3,   c: "#ECEEE8" },
    { x: .72, y: .31, r: 5,   c: "#6E9BB0" },
    { x: .58, y: .52, r: 3,   c: "#ECEEE8" },
    { x: .28, y: .68, r: 5,   c: "#6E9BB0" },
    { x: .78, y: .76, r: 4,   c: "#C58A2E" },
    { x: .45, y: .84, r: 3,   c: "#ECEEE8" }
  ];
  const links = [[0,1],[1,2],[2,3],[3,4],[3,5],[4,6],[1,3],[0,4]];
  const linkColors = [
    "rgba(168,95,56,.42)",
    "rgba(197,138,46,.34)",
    "rgba(110,155,176,.44)",
    "rgba(236,238,232,.2)",
    "rgba(110,155,176,.32)",
    "rgba(197,138,46,.38)",
    "rgba(236,238,232,.18)",
    "rgba(168,95,56,.3)"
  ];
  let frame = 0;

  function draw() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = Math.max(1, Math.floor(rect.width  * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineWidth = 1;

    links.forEach(function(link, i) {
      const a = points[link[0]], b = points[link[1]];
      const ax = a.x * rect.width,  ay = a.y * rect.height;
      const bx = b.x * rect.width,  by = b.y * rect.height;
      ctx.strokeStyle = linkColors[i];
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.bezierCurveTo(ax + 36, ay - 22, bx - 42, by + 28, bx, by);
      ctx.stroke();
    });

    points.forEach(function(pt, i) {
      const pulse = reduce ? 0 : Math.sin(frame / 38 + i) * 1.8;
      ctx.beginPath();
      ctx.fillStyle = pt.c;
      ctx.arc(pt.x * rect.width, pt.y * rect.height, pt.r + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(236,238,232,.14)";
      ctx.arc(pt.x * rect.width, pt.y * rect.height, pt.r + 12 + pulse, 0, Math.PI * 2);
      ctx.stroke();
    });

    if (!reduce) {
      frame++;
      requestAnimationFrame(draw);
    }
  }

  draw();
  if (reduce) window.addEventListener("resize", draw);
})();
(function() {
  // Mobile nav toggle (accessible)
  var header = document.getElementById("site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;
  function closeMenu() {
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  toggle.addEventListener("click", function() {
    var open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", function(e) {
    if (e.target.tagName === "A") closeMenu();
  });
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeMenu();
  });
})();


(function() {
  // Write to me form (scroll to #write is native anchor + CSS smooth scroll)
  var form = document.getElementById("write-form");
  if (!form) return;
  var status = document.getElementById("write-status");
  var success = document.getElementById("write-success");

  function setError(id, msg) {
    var input = document.getElementById(id);
    var err = document.getElementById(id + "-error");
    if (!input || !err) return;
    if (msg) {
      input.setAttribute("aria-invalid", "true");
      input.classList.add("is-error");
      err.textContent = msg;
      err.hidden = false;
    } else {
      input.removeAttribute("aria-invalid");
      input.classList.remove("is-error");
      err.textContent = "";
      err.hidden = true;
    }
  }

  function checkField(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (id === "wf-name") {
      setError(id, el.value.trim() ? "" : "Please enter your name.");
    } else if (id === "wf-email") {
      setError(id, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()) ? "" : "Please enter a valid email address.");
    } else if (id === "wf-message") {
      setError(id, el.value.trim().length >= 10 ? "" : "Please tell me a little more (10+ characters).");
    }
  }

  function validateAll() {
    var ok = true;
    ["wf-name", "wf-email", "wf-message"].forEach(function(id) {
      checkField(id);
      if (!document.getElementById(id + "-error").hidden) ok = false;
    });
    return ok;
  }

  ["wf-name", "wf-email", "wf-message"].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("blur", function() { checkField(id); });
  });

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    status.textContent = "";
    if (!validateAll()) return;
    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Sending…";
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    }).then(function(res) {
      if (!res.ok) throw new Error("bad response");
      return res.json();
    }).then(function() {
      form.hidden = true;
      success.hidden = false;
    }).catch(function() {
      status.textContent = "Something went wrong. Please email me directly at naser@talplay.ca.";
      btn.disabled = false;
      btn.textContent = "Send message";
    });
  });
})();
