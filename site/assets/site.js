(() => {
  "use strict";
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const year = document.getElementById("copyright-year");
  const progress = document.getElementById("scroll-progress");
  const headerLinks = [...document.querySelectorAll(".desktop-nav a")];
  const sections = headerLinks.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean);

  const storedTheme = (() => {
    try { return window.localStorage.getItem("yeop-portfolio-theme"); }
    catch { return null; }
  })();
  if (storedTheme === "light" || storedTheme === "dark") root.dataset.theme = storedTheme;

  const setTheme = (theme) => {
    const light = theme === "light";
    root.dataset.theme = light ? "light" : "dark";
    themeButton?.setAttribute("aria-label", light ? "다크 모드로 전환" : "라이트 모드로 전환");
    themeButton?.setAttribute("title", light ? "다크 모드" : "라이트 모드");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = light ? "#f7f7f4" : "#0e1513";
    try { window.localStorage.setItem("yeop-portfolio-theme", theme); }
    catch { /* Storage may be disabled in private mode. */ }
  };
  setTheme(root.dataset.theme === "dark" ? "dark" : "light");
  themeButton?.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

  const closeMenu = () => {
    if (!mobileNav || !menuButton) return;
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "모바일 메뉴 열기");
  };
  menuButton?.addEventListener("click", () => {
    if (!mobileNav) return;
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "모바일 메뉴 닫기" : "모바일 메뉴 열기");
  });
  mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 870) closeMenu();
  }, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

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

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        headerLinks.forEach((link) => {
          const current = link.hash === "#" + entry.target.id;
          link.classList.toggle("is-current", current);
          if (current) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    }, { rootMargin: "-23% 0px -62% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }
})();