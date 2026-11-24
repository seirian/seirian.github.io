"use strict";

const themeToggle = document.getElementById("theme-toggle");
const systemTheme = matchMedia("(prefers-color-scheme: dark)");
const themeKey = "yeop-portfolio-theme";
const page = document.documentElement;

try {
  const preference = localStorage.getItem(themeKey);
  if (preference === "light" || preference === "dark") {
    page.dataset.theme = preference;
  }
} catch {
  // Browsing modes that restrict storage can still change the current theme.
}

function darkModeIsOn() {
  return page.dataset.theme ? page.dataset.theme === "dark" : systemTheme.matches;
}

function updateThemeToggle() {
  const dark = darkModeIsOn();
  const label = dark ? "라이트 모드로 전환" : "다크 모드로 전환";
  themeToggle.dataset.theme = dark ? "dark" : "light";
  themeToggle.title = label;
  themeToggle.setAttribute("aria-label", label);
}

updateThemeToggle();
themeToggle.hidden = false;
systemTheme.addEventListener("change", updateThemeToggle);

themeToggle.addEventListener("click", () => {
  page.dataset.theme = darkModeIsOn() ? "light" : "dark";
  try {
    localStorage.setItem(themeKey, page.dataset.theme);
  } catch {
    // The theme still applies until the page is closed.
  }
  updateThemeToggle();
});

const search = document.getElementById("project-search");
const category = document.getElementById("project-category");
const countLabel = document.getElementById("project-count");
const empty = document.getElementById("no-results");
const projects = [...document.querySelectorAll(".project-row")];

function normalize(text) {
  return text.normalize("NFC").toLocaleLowerCase("ko-KR").trim();
}

const projectTexts = projects.map(project => normalize(project.textContent));

function filterProjects() {
  const words = normalize(search.value).split(/\s+/).filter(Boolean);
  let visible = 0;
  projects.forEach((project, index) => {
    const categoryMatches = category.value === "all" || project.dataset.category === category.value;
    const searchMatches = words.every(word => projectTexts[index].includes(word));
    project.hidden = !(categoryMatches && searchMatches);
    if (!project.hidden) visible += 1;
  });
  countLabel.textContent = visible === projects.length
    ? `업무 프로젝트 ${projects.length}개`
    : `검색 결과 ${visible}개 / 전체 ${projects.length}개`;
  empty.hidden = visible !== 0;
}

function resetFilters() {
  category.value = "all";
  search.value = "";
  filterProjects();
}

function revealLinkedProject() {
  const linked = projects.find(project => "#" + project.id === location.hash);
  if (!linked) return;
  if (linked.hidden) resetFilters();
  linked.querySelector("details").open = true;
  linked.scrollIntoView({ block: "start" });
}

document.getElementById("project-tools").hidden = false;
search.addEventListener("input", filterProjects);
category.addEventListener("change", filterProjects);
document.getElementById("reset-projects").addEventListener("click", () => {
  resetFilters();
  search.focus();
});
window.addEventListener("hashchange", revealLinkedProject);
window.addEventListener("pageshow", () => {
  filterProjects();
  revealLinkedProject();
});
