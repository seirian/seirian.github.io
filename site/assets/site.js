(() => {
  "use strict";
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const year = document.getElementById("copyright-year");
  const progress = document.getElementById("scroll-progress");
  const links = [...document.querySelectorAll(".desktop-nav a")];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);

  const persisted = (() => {
    try { return window.localStorage.getItem("yeop-portfolio-theme"); } catch { return null; }
  })();
  if (persisted === "light" || persisted === "dark") root.dataset.theme = persisted;
  const setTheme = value => {
    const light = value === "light";
    root.dataset.theme = light ? "light" : "dark";
    themeButton?.setAttribute("aria-label", light ? "다크 모드로 전환" : "라이트 모드로 전환");
    themeButton?.setAttribute("title", light ? "다크 모드로 전환" : "라이트 모드로 전환");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", light ? "#f6f7f2" : "#0e1513");
    try { window.localStorage.setItem("yeop-portfolio-theme",value); } catch {}
  };
  setTheme(root.dataset.theme === "dark" ? "dark" : "light");
  themeButton?.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

  const closeMenu=()=>{
    if (!mobileNav || !menuButton) return;
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded","false");
    menuButton.setAttribute("aria-label","메뉴 열기");
  };
  menuButton?.addEventListener("click",()=>{
    if (!mobileNav) return;
    const opened=mobileNav.hidden;
    mobileNav.hidden=!opened;
    menuButton.setAttribute("aria-expanded",String(opened));
    menuButton.setAttribute("aria-label",opened?"메뉴 닫기":"메뉴 열기");
  });
  mobileNav?.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
  window.addEventListener("resize",()=>{if(window.innerWidth>1010)closeMenu();},{passive:true});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();});

  const filterButtons=[...document.querySelectorAll("[data-filter]")];
  const cards=[...document.querySelectorAll(".project-card[data-kind]")];
  const search=document.getElementById("project-search");
  const result=document.getElementById("project-count");
  const empty=document.getElementById("no-results");
  let category="all";
  const applyFilters=()=>{
    const text=(search?.value||"").trim().toLocaleLowerCase("ko-KR");
    let count=0;
    for (const card of cards) {
      const categoryMatches=category==="all"||card.dataset.kind===category;
      const searchMatches=!text||(card.dataset.search||"").toLocaleLowerCase("ko-KR").includes(text);
      card.hidden=!(categoryMatches&&searchMatches);
      if(!card.hidden)count+=1;
    }
    if(result)result.textContent=count+"개 / 전체 "+cards.length+"개 프로젝트";
    if(empty)empty.hidden=count!==0;
  };
  filterButtons.forEach(button=>button.addEventListener("click",()=>{
    category=button.dataset.filter||"all";
    for(const option of filterButtons){
      const active=option===button;
      option.classList.toggle("is-active",active);
      option.setAttribute("aria-pressed",String(active));
    }
    applyFilters();
  }));
  search?.addEventListener("input",applyFilters);
  document.getElementById("reset-projects")?.addEventListener("click",()=>{
    category="all";
    if(search)search.value="";
    for(const option of filterButtons){
      const active=option.dataset.filter==="all";
      option.classList.toggle("is-active",active);
      option.setAttribute("aria-pressed",String(active));
    }
    applyFilters();
  });
  applyFilters();
  if (year) year.textContent=String(new Date().getFullYear());
  if(progress){
    let pending=false;
    const update=()=>{
      const extent=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
      progress.style.width=(Math.max(0,Math.min(1,window.scrollY/extent))*100).toFixed(2)+"%";
      pending=false;
    };
    window.addEventListener("scroll",()=>{
      if(!pending){pending=true;window.requestAnimationFrame(update);}
    },{passive:true});
    window.addEventListener("resize",update,{passive:true});
    update();
  }
  if("IntersectionObserver" in window&&sections.length){
    const observer=new IntersectionObserver(entries=>{
      for (const entry of entries) {
        if(!entry.isIntersecting)continue;
        links.forEach(link=>{
          const active=link.hash==="#"+entry.target.id;
          link.classList.toggle("is-current",active);
          if(active)link.setAttribute("aria-current","location");
          else link.removeAttribute("aria-current");
        });
      }
    },{rootMargin:"-20% 0px -60% 0px",threshold:0});
    sections.forEach(section=>observer.observe(section));
  }
})();