// Homepage behaviour: sticky header line, active nav mark, mobile menu, service tabs, mobile action bar.
// Everything degrades to plain anchors and native <details> without JS.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const wide = window.matchMedia("(min-width: 1024px)");

/* Header line after scroll */
const header = document.querySelector<HTMLElement>("[data-header]");
const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 4);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* Active nav item: a short accent «level» under the current section */
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".site-nav__link"));
const sections = navLinks
  .map((a) => document.querySelector<HTMLElement>(a.hash))
  .filter((el): el is HTMLElement => el !== null);
if ("IntersectionObserver" in window && sections.length) {
  const visible = new Map<string, number>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
      let best = "";
      let max = 0;
      for (const [id, r] of visible) if (r > max) { max = r; best = id; }
      navLinks.forEach((a) => {
        if (a.hash === `#${best}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
  );
  sections.forEach((s) => io.observe(s));
}

/* Mobile menu */
const menu = document.querySelector<HTMLElement>("[data-menu]");
const openBtn = document.querySelector<HTMLButtonElement>("[data-menu-open]");
const closeBtn = document.querySelector<HTMLButtonElement>("[data-menu-close]");
const setMenu = (open: boolean) => {
  if (!menu || !openBtn) return;
  menu.hidden = !open;
  menu.classList.toggle("is-open", open);
  openBtn.setAttribute("aria-expanded", String(open));
  document.documentElement.classList.toggle("menu-open", open);
  if (open) closeBtn?.focus();
  else openBtn.focus({ preventScroll: true });
};
openBtn?.addEventListener("click", () => setMenu(true));
closeBtn?.addEventListener("click", () => setMenu(false));
menu?.querySelectorAll("[data-menu-link]").forEach((a) =>
  a.addEventListener("click", () => {
    if (!menu || !openBtn) return;
    menu.hidden = true;
    menu.classList.remove("is-open");
    openBtn.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("menu-open");
  }),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu && !menu.hidden) setMenu(false);
});
menu?.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const f = Array.from(menu.querySelectorAll<HTMLElement>("a[href], button"));
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
wide.addEventListener("change", () => { if (wide.matches && menu && !menu.hidden) setMenu(false); });

/* Services: tabs on wide screens, native <details> on phones */
const tabsRoot = document.querySelector<HTMLElement>("[data-tabs]");
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-tab]"));
const groups = Array.from(document.querySelectorAll<HTMLDetailsElement>("[data-group]"));
const photos = Array.from(document.querySelectorAll<HTMLImageElement>("[data-photo]"));
let active = groups[0]?.dataset.group ?? "";

const activate = (id: string, focus = false) => {
  if (!groups.some((g) => g.dataset.group === id)) return;
  active = id;
  tabs.forEach((t) => {
    const on = t.dataset.tab === id;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  });
  groups.forEach((g) => g.classList.toggle("is-active", g.dataset.group === id));
  photos.forEach((p) => {
    const on = p.dataset.photo === id;
    p.classList.toggle("is-active", on);
    if (on) p.removeAttribute("aria-hidden");
    else p.setAttribute("aria-hidden", "true");
  });
};

const applyMode = () => {
  if (!tabsRoot) return;
  const tabMode = wide.matches;
  tabsRoot.classList.toggle("is-tabs", tabMode);
  groups.forEach((g) => {
    const summary = g.querySelector("summary");
    if (tabMode) {
      g.open = true;
      g.setAttribute("role", "tabpanel");
      g.setAttribute("aria-labelledby", `tab-${g.dataset.group}`);
      summary?.setAttribute("tabindex", "-1");
    } else {
      g.removeAttribute("role");
      g.removeAttribute("aria-labelledby");
      summary?.removeAttribute("tabindex");
      g.open = g.dataset.group === active;
    }
  });
  activate(active);
};

tabs.forEach((t, i) => {
  t.addEventListener("click", () => activate(t.dataset.tab ?? ""));
  t.addEventListener("keydown", (e) => {
    const n = tabs.length;
    let j = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") j = (i + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") j = (i - 1 + n) % n;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = n - 1;
    if (j >= 0) { e.preventDefault(); activate(tabs[j].dataset.tab ?? "", true); }
  });
});
groups.forEach((g) => {
  g.querySelector("summary")?.addEventListener("click", (e) => { if (wide.matches) e.preventDefault(); });
  g.addEventListener("toggle", () => { if (!wide.matches && g.open) active = g.dataset.group ?? active; });
});

const goToGroup = (id: string, e?: Event) => {
  const g = groups.find((x) => x.dataset.group === id);
  if (!g) return;
  activate(id);
  if (wide.matches) {
    e?.preventDefault();
    const target = document.getElementById("services");
    target?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
  } else {
    g.open = true;
  }
};
document.querySelectorAll<HTMLAnchorElement>("[data-group-link]").forEach((a) =>
  a.addEventListener("click", (e) => goToGroup(a.dataset.groupLink ?? "", e)),
);

applyMode();
wide.addEventListener("change", applyMode);
if (location.hash.startsWith("#services-")) goToGroup(location.hash.slice(1));

/* Mobile action bar: appears after the first screen */
const bar = document.querySelector<HTMLElement>("[data-mobile-bar]");
const heroActions = document.querySelector<HTMLElement>(".hero__actions");
if (bar && heroActions && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    const e = entries[0];
    const passed = !e.isIntersecting && e.boundingClientRect.top < 0;
    bar.classList.toggle("is-shown", passed);
  });
  io.observe(heroActions);
} else {
  bar?.classList.add("is-shown");
}
