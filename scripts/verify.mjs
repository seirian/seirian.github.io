import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=path.resolve("site");
const expected=["index.html","assets/site.css","assets/site.js","assets/favicon.svg","assets/avatar-yeop.webp","assets/og-portfolio.jpg","robots.txt","sitemap.xml"];
const files=Object.fromEntries(expected.map(name=>{
  const file=path.join(root,name);
  const stat=fs.lstatSync(file);
  assert.ok(stat.isFile()&&!stat.isSymbolicLink(),"Invalid asset: "+name);
  assert.ok(stat.size>0 && stat.size<180_000,"Invalid asset size: "+name);
  return [name,/\.(?:webp|jpg)$/.test(name)?fs.readFileSync(file):fs.readFileSync(file,"utf8")];
}));
const html=files["index.html"];
assert.match(html,/<html lang="ko"/);
assert.match(html,/data-site="yeop-portfolio-v4"/);
assert.match(html,/<main id="main">/);
assert.match(html,/<h1 id="hero-title">/);
assert.match(html,/<title>.+<\/title>/);
assert.match(html,/https:\/\/yeop\.net\//);
for(const asset of ['href="/assets/site.css"','src="/assets/site.js"','href="/assets/favicon.svg"','src="/assets/avatar-yeop.webp"']){
  assert.ok(html.includes(asset),"Missing reference: "+asset);
}
for(const id of ["work","career","skills","about","side","contact"]){
  assert.ok(html.includes('id="'+id+'"'),"Missing section: "+id);
  assert.ok(html.includes('href="#'+id+'"'),"Missing section link: "+id);
}
const projectIds=[
 "sme","kb-fcc","fitpet","eqst","groupware","learningpro",
 "judicial","kifin","health-edu","startup-school","avalon","samsung-learning",
];
assert.equal((html.match(/class="project-card /g)||[]).length,12,"Exact 12 Notion projects required");
for(const project of projectIds){
  assert.ok(html.includes('id="project-'+project+'"'),"Missing real project: "+project);
  assert.ok(html.includes('href="#project-'+project+'"'),"Missing deep link: "+project);
}
assert.equal((html.match(/class="side-link"/g)||[]).length,3,"Exactly 3 compact hobby links");

const heroText=(html.match(/<p class="hero-description">([\s\S]*?)<\/p>/)||[])[1]||"";
assert.ok(heroText.includes("API 개발부터 레거시 개선, 데이터 연동, 시스템 운영 등"),"Updated hero summary is missing");
assert.ok(!heroText.includes("시스템 운영과 인프라 구성"),"Previous hero wording must be removed");
assert.ok(html.includes('class="ai-development-note"'),"Side projects must explain AI-assisted development");
assert.ok(html.includes("AI 개발 도구 Codex"),"Codex must be named in the side-project introduction");
assert.ok(html.includes("Codex와 함께 코드를 작성·개선"),"AI assistance must describe a concrete development workflow");
assert.ok(html.includes("직접 검증·운영"),"Human oversight and production operation must be clear");
assert.ok(html.indexOf('id="side"')<html.indexOf('class="ai-development-note"') &&
  html.indexOf('class="ai-development-note"')<html.indexOf('class="side-list"'),
  "AI-assisted description belongs inside the side-project section before the projects");
assert.ok(html.indexOf('id="work"')<html.indexOf('class="ai-development-note"'),
  "AI hobby projects must not replace professional work");
assert.match(files["assets/site.css"],/\.ai-development-note/);

assert.ok(html.indexOf('id="project-sme"')<html.indexOf('id="side"'),"Professional work must precede hobbies");
assert.ok(html.indexOf('id="career"')<html.indexOf('id="side"'),"Career must precede hobbies");
assert.ok(html.indexOf('id="skills"')<html.indexOf('id="side"'),"Skills must precede hobbies");
for(const project of [
"중소기업중앙회","KB FCC","핏펫","EQST LMS","러닝프로",
"사법연수원","금융투자협회","보건산업교육본부","창업스쿨",
"아발론","삼성전자 러닝허브"
])assert.ok(html.includes(project),"Missing Notion work title: "+project);
assert.ok(html.includes('각 프로젝트의 수행 기간, 참여 형태, 개발 업무와 사용 기술을 직접 확인할 수 있습니다.'),"Project introduction should focus on visitor value");
assert.ok(!html.includes('원본 Notion에 기록된 <strong>업무 프로젝트 12개 전체</strong>를 이관했습니다.'),"Internal migration wording must not appear publicly");
assert.ok(html.includes('그룹웨어 운영과 중소기업중앙회 현업 담당자와의 협업 등'),"SME business stakeholder collaboration must be featured");
assert.ok(!html.includes('핏펫의 CS 협업'),"Outdated collaboration example remains");
assert.ok(html.includes("2012.06.01 ~ 2012.12.31"));
assert.ok(html.includes("2023.08.07 ~ 2026.02.27"));
for(const url of [
"https://mir.yeop.net/",
"https://isegye-idol.kr/",
"https://subculture-radar-kr-sy.goodvale15.chatgpt.site/",
"https://yeops.notion.site/Portfolio-a13980c2a70b4f1f9e32e2f1b80fc193"
])assert.ok(html.includes(url),"Missing link: "+url);
assert.equal((html.match(/class="project-scene"/g)||[]).length,12,"Each professional project needs distinct illustration");
assert.ok(html.includes('13년 8개월'),"Career length must be exact sum of actual periods");
assert.ok(html.includes('(2012.03 ~ 2026.02)'),"Career period must be explicit");
assert.ok(html.includes('개발 경력 기간'),"Career section wording must be clear");
assert.ok(html.includes('함께 고민하겠습니다.'),"Requested contact wording is missing");
assert.ok(!html.includes('함께 고민해요.'),"Old contact wording remains");
assert.ok(html.includes('src="https://mir.yeop.net/_yeop_releases/'),"Original MIR logo must be used");
assert.ok(html.includes('raw.githubusercontent.com/seirian/isegye-idol-fansite/main/assets/favicon.svg'),"Use original ISEGYE favicon asset");
assert.ok(html.includes('subculture-radar-kr-sy.sengyb.chatgpt.site/favicon.svg'),"Use live Subradar favicon");
assert.equal(files["assets/avatar-yeop.webp"].toString("ascii",0,4),"RIFF","Notion portrait must be real WEBP");
assert.ok(files["assets/avatar-yeop.webp"].length>1000,"Notion portrait is unexpectedly small");
// Crawlers must find an explicit and unique OG image without executing JavaScript.
const ogExpected="https://yeop.net/_portfolio_releases/__PORTFOLIO_RELEASE__/assets/og-portfolio.jpg";
assert.ok(html.includes('<meta property="og:image" content="'+ogExpected+'">'),"Missing OG image");
assert.ok(html.includes('<meta property="og:image:secure_url" content="'+ogExpected+'">'),"Missing OG secure URL");
assert.ok(html.includes('<meta name="twitter:image" content="'+ogExpected+'">'),"Missing Twitter image");
assert.ok(html.includes('<meta property="og:image:width" content="1200">'),"OG dimensions missing");
assert.ok(html.includes('<meta property="og:image:height" content="630">'),"OG dimensions missing");
assert.ok(html.includes('<meta property="og:image:type" content="image/jpeg">'),"OG MIME missing");
assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image">'),"Twitter card missing");
assert.equal((html.match(/property="og:image"/g)||[]).length,1,"Only one OG primary image allowed");
assert.ok(!html.slice(0,html.indexOf("</head>")).includes("mir.yeop.net"),"MIR brand must not be in portfolio head");
assert.equal(files["assets/og-portfolio.jpg"].subarray(0,3).toString("hex"),"ffd8ff","Social image must be real JPEG");
assert.ok(files["assets/og-portfolio.jpg"].length>20000,"OG image unexpectedly small");
assert.ok(!html.includes("1984. 09. 25"),"Do not publish birth date");
assert.ok(!html.includes("남부순환로"),"Do not publish home address");
assert.match(files["assets/site.css"],/@media \(max-width:580px\)/);
assert.match(files["assets/site.css"],/prefers-reduced-motion/);
assert.match(files["assets/site.js"],/aria-pressed/);
assert.match(files["assets/site.js"],/project-search/);
assert.match(files["robots.txt"],/Sitemap: https:\/\/yeop\.net\/sitemap\.xml/);
assert.match(files["sitemap.xml"],/<loc>https:\/\/yeop\.net\/<\/loc>/);
assert.ok(!/(?:href|src)="http:\/\//.test(html),"Only HTTPS external resources");
assert.match(html,/<a class="view-switch" href="\/simple\/">간소화 버전<\/a>/);
const simple = fs.readFileSync(path.join(root, "simple/index.html"), "utf8");
assert.match(simple,/<a class="view-switch" href="\/">기본 버전<\/a>/);
assert.match(simple,/<h1 id="name">Yeop<\/h1>/);
const fullTagline = html.match(/<h1 id="hero-title">(.+?)<\/h1>/)?.[1]
  .replaceAll("<br>", " ").replace(/<[^>]+>/g, "").trim();
const simpleTagline = simple.match(/<p class="intro-tagline">(.+?)<\/p>/)?.[1];
const simpleIntro = simple.match(/<p class="intro-description">(.+?)<\/p>/)?.[1];
assert.ok(fullTagline, "Missing main tagline");
assert.equal(simpleTagline, fullTagline, "Both views must use the same tagline");
assert.equal(simpleIntro, heroText, "Both views must use the same introduction and emphasis");

function navLinks(page, selector) {
  const menu = page.match(selector)?.[1] ?? "";
  return [...menu.matchAll(/<a href="(#[^"]+)">([^<]+)<\/a>/g)].map(([, target, label]) => [target, label]);
}
const simpleNav = navLinks(simple, /<nav aria-label="주요 메뉴">([\s\S]*?)<\/nav>/);
assert.equal(simpleNav.length, 6, "The shared menu must have six section links");
assert.deepEqual(navLinks(html, /<nav class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/), simpleNav);
assert.deepEqual(navLinks(html, /<nav class="mobile-nav"[^>]*>([\s\S]*?)<\/nav>/), simpleNav);
assert.equal((simple.match(/class="project-row"/g) || []).length, projectIds.length);
for (const project of projectIds) {
  assert.ok(simple.includes('id="project-' + project + '"'), "Missing simplified project: " + project);
}
assert.match(simple,/<link rel="canonical" href="https:\/\/yeop\.net\/simple\/">/);
assert.doesNotMatch(simple, /noindex|yeop-portfolio-review/);
const simpleOg = "https://yeop.net/_portfolio_releases/__PORTFOLIO_RELEASE__/assets/simple-profile.jpg";
assert.equal(simple.split(simpleOg).length - 1, 3, "Use one simplified profile JPEG for social previews");
const simpleProfile = fs.readFileSync(path.join(root, "assets/simple-profile.jpg"));
assert.equal(simpleProfile.subarray(0, 3).toString("hex"), "ffd8ff");
for (const [, relative] of simple.matchAll(/(?:src|href)="\.\.\/(assets\/[^"]+)"/g)) {
  assert.ok(fs.statSync(path.join(root, relative)).isFile(), "Missing simplified asset: " + relative);
}
console.log("PASS: all 12 Notion professional projects, career/skills before hobbies, search/filter, privacy, responsive UI and SEO");
