(() => {
  "use strict";
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const year = document.getElementById("copyright-year");
  const progress = document.getElementById("scroll-progress");
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const projectCards = [...document.querySelectorAll("[data-category]")];

  const storedTheme = (() => {
    try { return window.localStorage.getItem("yeop-portfolio-theme"); }
    catch { return null; }
  })();
  if (storedTheme === "dark" || storedTheme === "light") root.dataset.theme = storedTheme;

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const isLight = theme === "light";
    themeButton?.setAttribute("aria-label", isLight ? "다크 모드로 전환" : "라이트 모드로 전환");
    themeButton?.setAttribute("title", isLight ? "다크 모드" : "라이트 모드");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isLight ? "#f7f8f4" : "#10131d";
    try { window.localStorage.setItem("yeop-portfolio-theme", theme); }
    catch { /* Private browsing must not break site interactions. */ }
  };
  setTheme(root.dataset.theme === "light" ? "light" : "dark");
  themeButton?.addEventListener("click", () => setTheme(root.dataset.theme === "light" ? "dark" : "light"));

  const closeMenu = () => {
    if (!mobileNav || !menuButton) return;
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "모바일 메뉴 열기");
  };
  menuButton?.addEventListener("click", () => {
    if (!mobileNav) return;
    const opening = mobileNav.hidden;
    mobileNav.hidden = !opening;
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute("aria-label", opening ? "모바일 메뉴 닫기" : "모바일 메뉴 열기");
  });
  mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 780) closeMenu(); }, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  filterButtons.forEach((button) => button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(/\s+/);
      card.hidden = selected !== "all" && !categories.includes(selected);
    });
  }));

  if (year) year.textContent = String(new Date().getFullYear());
  if (progress) {
    let scheduled = false;
    const update = () => {
      const fullHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.max(0, Math.min(1, window.scrollY / fullHeight));
      progress.style.width = (ratio * 100).toFixed(2) + "%";
      scheduled = false;
    };
    window.addEventListener("scroll", () => {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }
})();