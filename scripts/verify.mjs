import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("site");
const expected = ["index.html","assets/site.css","assets/site.js","assets/favicon.svg","robots.txt","sitemap.xml"];
const files = Object.fromEntries(expected.map((name) => {
  const file = path.join(root,name);
  const stat = fs.lstatSync(file);
  assert.ok(stat.isFile() && !stat.isSymbolicLink(), "Invalid asset: " + name);
  assert.ok(stat.size > 0 && stat.size < 180_000, "Invalid asset size: " + name);
  return [name, fs.readFileSync(file,"utf8")];
}));
const html = files["index.html"];
assert.match(html, /<html lang="ko"/);
assert.match(html, /data-site="yeop-portfolio-v2"/);
assert.match(html, /<main id="main">/);
assert.match(html, /<h1 id="hero-title">/);
assert.match(html, /<title>.+<\/title>/);
assert.match(html, /https:\/\/yeop\.net\//);
assert.match(html, /href="\/assets\/site\.css"/);
assert.match(html, /src="\/assets\/site\.js"/);
assert.match(html, /href="\/assets\/favicon\.svg"/);
for (const id of ["work", "experience", "approach", "side", "contact"]) {
  assert.ok(html.includes('id="' + id + '"'), "Missing section: " + id);
}
const primaryCases = ["project-air","project-water","project-haps","project-plan"];
for (const id of primaryCases) {
  assert.ok(html.includes('id="' + id + '"'), "Missing professional project: " + id);
  assert.ok(html.includes('href="#' + id + '"'), "Missing project navigation: " + id);
}
assert.equal((html.match(/class="case-card(?:\s|\")/g) || []).length, 4,
  "Four verified professional cases required");
assert.equal((html.match(/class="side-link"/g) || []).length, 3,
  "Hobby projects must be limited to three compact secondary links");
assert.ok(html.indexOf('id="project-air"') < html.indexOf('id="side"'), "Work must precede hobby projects");
assert.ok(html.indexOf('id="experience"') < html.indexOf('id="side"'), "Career must precede hobbies");
assert.match(html, /실무 개발 과제/);
assert.match(html, /AS-IS → TO-BE/);
assert.match(html, /HAPs운영일지/);
assert.match(html, /완료 여부·기여 범위·정량 성과는 단정하지 않았습니다/);
for (const url of [
 "https://mir.yeop.net/",
 "https://github.com/seirian/isegye-idol-fansite",
 "https://subculture-radar-kr-sy.goodvale15.chatgpt.site/",
 "https://yeops.notion.site/Portfolio-a13980c2a70b4f1f9e32e2f1b80fc193"
]) assert.ok(html.includes(url), "Missing source link " + url);
assert.match(files["assets/site.css"], /@media \(max-width:580px\)/);
assert.match(files["assets/site.css"], /prefers-reduced-motion/);
assert.match(files["assets/site.js"], /aria-current/);
assert.match(files["robots.txt"], /Sitemap: https:\/\/yeop\.net\/sitemap\.xml/);
assert.match(files["sitemap.xml"], /<loc>https:\/\/yeop\.net\/<\/loc>/);
assert.ok(!html.includes("http://"), "HTTPS only external content");
console.log("PASS: professional-first layout, four cases, separated hobby projects, assets, responsive UI and metadata");
