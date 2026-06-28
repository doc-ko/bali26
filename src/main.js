import content from "./content.js";

// ---------------------------------------------------------------------------
// Image URLs. Wikimedia Commons hotlinks work fine and keep the repo light.
// A section's `image` field is just the Commons filename; we build the URL here.
// ---------------------------------------------------------------------------
const COMMONS = (file) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    file
  )}?width=1600`;

// Tiny helpers --------------------------------------------------------------
const el = (tag, className, text) => {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
};

// Minimal inline markdown: **bold** and *italic* only. Everything else is
// escaped, so the content file stays plain text and safe.
function mdInline(str) {
  const escaped = str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

const setMd = (node, str) => {
  node.innerHTML = mdInline(str);
  return node;
};

// ---------------------------------------------------------------------------
// Render one section from its content object.
// ---------------------------------------------------------------------------
function renderSection(s, index) {
  const section = el("section", `scene s-${s.id}`);
  section.dataset.label = s.label || s.title || "";

  // Background image (optional) with gradient fallback already in CSS.
  if (s.image) {
    const bg = el("div", "bg");
    bg.style.backgroundImage = `url('${COMMONS(s.image)}')`;
    section.appendChild(bg);
  }
  section.appendChild(el("div", "overlay"));

  // Decorative big number (optional).
  if (s.deco) {
    const deco = el("span", index % 2 === 0 ? "deco tl" : "deco br", s.deco);
    section.appendChild(deco);
  }

  const content = el("div", "content");

  if (s.eyebrow) content.appendChild(el("div", "eyebrow", s.eyebrow));
  if (s.nights) content.appendChild(el("div", "nights", s.nights));

  // Title may contain \n for line breaks.
  if (s.title) {
    const h = el(index === 0 ? "h1" : "h2");
    h.innerHTML = s.title
      .split("\n")
      .map((line) => mdInline(line))
      .join("<br>");
    content.appendChild(h);
  }

  if (s.body) content.appendChild(setMd(el("p", "sub"), s.body));

  // Bullet feature list.
  if (Array.isArray(s.bullets) && s.bullets.length) {
    const list = el("div", "feature-list");
    s.bullets.forEach((b) => list.appendChild(setMd(el("div", "f"), b)));
    content.appendChild(list);
  }

  // Pill tags (e.g. Canggu venues).
  if (Array.isArray(s.tags) && s.tags.length) {
    const row = el("div", "pill-row");
    s.tags.forEach((t) => row.appendChild(setMd(el("span", "tag"), t)));
    content.appendChild(row);
  }

  // Arc steps (loud -> adventure -> slow).
  if (Array.isArray(s.arc) && s.arc.length) {
    const arc = el("div", "arc");
    s.arc.forEach((step, i) => {
      arc.appendChild(setMd(el("span", "step"), step));
      if (i < s.arc.length - 1) arc.appendChild(el("span", "arr", "→"));
    });
    content.appendChild(arc);
  }

  if (s.note) content.appendChild(setMd(el("p", "sub note"), s.note));
  if (s.dates) content.appendChild(el("div", "dates", s.dates));

  // Decision block (single-select vote, visual only).
  if (s.decision) {
    const ask = el("div", "ask");
    ask.appendChild(el("div", "q", s.decision.label));
    ask.appendChild(setMd(el("p"), s.decision.question));
    const vote = el("div", "vote");
    vote.dataset.group = s.decision.group;
    s.decision.options.forEach((opt) => {
      const btn = el("button", null, opt);
      btn.type = "button";
      vote.appendChild(btn);
    });
    ask.appendChild(vote);
    content.appendChild(ask);
  }

  // Hype meter (close section).
  if (s.hypeMeter) {
    const wrap = el("div", "hype-meter");
    const input = el("input");
    input.type = "range";
    input.min = "0";
    input.max = "100";
    input.value = "75";
    input.id = "hype";
    input.setAttribute("aria-label", "Enthusiasm level");
    const val = el("div", "hype-val");
    val.id = "hypeval";
    wrap.appendChild(input);
    wrap.appendChild(val);
    content.appendChild(wrap);
  }

  section.appendChild(content);

  if (s.scrollHint !== false) {
    section.appendChild(el("div", "scroll-hint", "Scroll ↓"));
  }

  return section;
}

// ---------------------------------------------------------------------------
// Build the page.
// ---------------------------------------------------------------------------
const deck = document.getElementById("deck");
const navdots = document.getElementById("navdots");
const sections = content.sections;

document.title = content.meta?.title || document.title;

sections.forEach((s, i) => {
  const node = renderSection(s, i);
  // Last section gets no scroll hint.
  if (i === sections.length - 1) {
    const hint = node.querySelector(".scroll-hint");
    if (hint) hint.remove();
  }
  deck.appendChild(node);

  const dot = el("a");
  dot.title = s.label || s.title || "";
  dot.href = `#${s.id}`;
  node.id = s.id;
  dot.addEventListener("click", (e) => {
    e.preventDefault();
    node.scrollIntoView({ behavior: "smooth" });
  });
  navdots.appendChild(dot);
});

const sectionEls = [...deck.querySelectorAll("section")];
const dotEls = [...navdots.children];

// --- HMR: preserve scroll position on live reload --------------------------
const HMR_KEY = "hmr-section";
const savedId = sessionStorage.getItem(HMR_KEY);
if (savedId) {
  sessionStorage.removeItem(HMR_KEY);
  const target = document.getElementById(savedId);
  if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant" }));
}
const saveCurrentSection = () => {
  const active = sectionEls.find((s) => {
    const r = s.getBoundingClientRect();
    return r.top > -window.innerHeight * 0.5 && r.top <= window.innerHeight * 0.5;
  });
  if (active) sessionStorage.setItem(HMR_KEY, active.id);
};
if (import.meta.hot) import.meta.hot.on("vite:beforeFullReload", saveCurrentSection);

// --- Vote buttons: single-select per group, visual only --------------------
deck.querySelectorAll(".vote").forEach((group) => {
  group.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      group
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
    });
  });
});

// --- Hype meter ------------------------------------------------------------
const hype = document.getElementById("hype");
const hypeVal = document.getElementById("hypeval");
if (hype && hypeVal) {
  const emoji = (v) =>
    v < 25 ? "😐" : v < 50 ? "🙂" : v < 75 ? "😄" : v < 95 ? "🔥" : "🌋";
  const update = () => (hypeVal.textContent = `${hype.value}% ${emoji(+hype.value)}`);
  hype.addEventListener("input", update);
  update();
}

// --- Nav dots track active section -----------------------------------------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const i = sectionEls.indexOf(entry.target);
        dotEls.forEach((d) => d.classList.remove("active"));
        if (dotEls[i]) dotEls[i].classList.add("active");
      }
    });
  },
  { root: deck, threshold: 0.55 }
);
sectionEls.forEach((s) => io.observe(s));

// --- Arrow-key navigation --------------------------------------------------
document.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  const cur = sectionEls.findIndex((s) => {
    const r = s.getBoundingClientRect();
    return r.top >= -5 && r.top < window.innerHeight * 0.5;
  });
  if (e.key === "ArrowDown" && cur < sectionEls.length - 1) {
    e.preventDefault();
    sectionEls[cur + 1].scrollIntoView({ behavior: "smooth" });
  }
  if (e.key === "ArrowUp" && cur > 0) {
    e.preventDefault();
    sectionEls[cur - 1].scrollIntoView({ behavior: "smooth" });
  }
});
