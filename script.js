/* SubDebt Manager — minimal site behaviour.
   Single source of truth for the release version shown on the page. */
const APP = Object.freeze({
  version: "2.18.0",
  packageName: "com.subdebt.app",
  playUrl: "https://play.google.com/store/apps/details?id=com.subdebt.app",
  releasesUrl: "https://github.com/zer0k7/SubDebt-Manager/releases/latest",
});

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Version and year are rendered from constants so a release bump is one line.
document.querySelectorAll("[data-app-version]").forEach((node) => {
  if (node.textContent !== APP.version) node.textContent = APP.version;
});

document.querySelectorAll("[data-year]").forEach((node) => {
  const year = String(new Date().getFullYear());
  if (node.textContent !== year) node.textContent = year;
});

/* ------------------------------------------------------------------
   Theme
------------------------------------------------------------------- */

const themeToggle = document.querySelector("[data-theme-toggle]");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function paintTheme(theme) {
  if (root.dataset.theme !== theme) {
    root.dataset.theme = theme;
  }

  if (themeToggle) {
    const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";
    if (themeToggle.getAttribute("aria-label") !== label) {
      themeToggle.setAttribute("aria-label", label);
    }
  }

  if (themeMeta) {
    const color = theme === "light" ? "#F5F7F4" : "#090D16";
    if (themeMeta.getAttribute("content") !== color) {
      themeMeta.setAttribute("content", color);
    }
  }
}

function storedTheme() {
  try {
    const value = localStorage.getItem("subdebt-theme");
    return value === "light" || value === "dark" ? value : null;
  } catch (error) {
    return null;
  }
}

paintTheme(root.dataset.theme || storedTheme() || systemTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    paintTheme(next);

    try {
      localStorage.setItem("subdebt-theme", next);
    } catch (error) {
      /* The visual toggle still works for this session. */
    }
  });
}

// If the visitor has not chosen a theme, keep following the OS.
const systemQuery = window.matchMedia("(prefers-color-scheme: light)");
systemQuery.addEventListener("change", (event) => {
  if (!storedTheme()) {
    paintTheme(event.matches ? "light" : "dark");
  }
});

/* ------------------------------------------------------------------
   Header and mobile navigation
------------------------------------------------------------------- */

const header = document.querySelector("[data-site-header]");
const nav = document.querySelector("#site-nav");
const navToggle = document.querySelector("[data-nav-toggle]");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

function setNav(open) {
  if (!nav || !navToggle) return;
  nav.dataset.open = String(open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("nav-open", open);
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    setNav(nav.dataset.open !== "true");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.dataset.open === "true") {
      setNav(false);
      navToggle.focus();
    }
  });

  window.matchMedia("(min-width: 981px)").addEventListener("change", (event) => {
    if (event.matches) setNav(false);
  });
}

/* ------------------------------------------------------------------
   Scroll reveal
------------------------------------------------------------------- */

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));
  }
}

/* ------------------------------------------------------------------
   Snapshot privacy mask
------------------------------------------------------------------- */

const maskToggle = document.querySelector("[data-mask-toggle]");
const maskLabel = document.querySelector("[data-mask-label]");
const snapshotValues = document.querySelectorAll(".snap-value");

if (maskToggle && snapshotValues.length) {
  maskToggle.addEventListener("click", () => {
    const nowMasked = maskToggle.getAttribute("aria-pressed") !== "true";

    maskToggle.setAttribute("aria-pressed", String(nowMasked));

    snapshotValues.forEach((value) => {
      value.textContent = nowMasked ? value.dataset.masked : value.dataset.real;
    });

    if (maskLabel) {
      maskLabel.textContent = nowMasked ? "Privacy mask on" : "Privacy mask off";
    }
  });
}
