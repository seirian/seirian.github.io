import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("site");
const required = ["index.html", "assets/site.css", "assets/site.js", "assets/favicon.svg", "robots.txt", "sitemap.xml"];
const files = Object.fromEntries(required.map((name) => {
  const full = path.join(root, name);
  const stat = fs.lstatSync(full);
  assert.ok(stat.isFile() && !stat.isSymbolicLink(), "Invalid file: " + name);
  assert.ok(stat.size > 0 && stat.size < 180_000, "Unexpected file size: " + name);
  return [name, fs.readFileSync(full, "utf8")];
}));
const html = files["index.html"];
assert.match(html, /<html lang="ko"/);
assert.match(html, /data-site="yeop-portfolio-v1"/);
assert.match(html, /<main id="main">/);
assert.match(html, /<h1 id="hero-title">/);
assert.match(html, /<title>.+<\/title>/);
assert.match(html, /https:\/\/yeop\.net\//);
assert.match(html, /href="\/assets\/site\.css"/);
assert.match(html, /src="\/assets\/site\.js"/);
assert.match(html, /href="\/assets\/favicon\.svg"/);
assert.equal((html.match(/class="project-card /g) || []).length, 4, "Expect 4 real project cards");
for (const anchor of ["about", "work", "approach", "contact"]) {
  assert.ok(html.includes('id="' + anchor + '"'), "Missing section " + anchor);
  assert.ok(html.includes('href="#' + anchor + '"'), "Missing navigation link " + anchor);
}
for (const url of ["https://mir.yeop.net/", "https://github.com/seirian/isegye-idol-fansite", "https://yeops.notion.site/Portfolio-a13980c2a70b4f1f9e32e2f1b80fc193"]) {
  assert.ok(html.includes(url), "Missing sourced link " + url);
}
assert.match(files["assets/site.css"], /@media \(max-width: 580px\)/);
assert.match(files["assets/site.css"], /prefers-reduced-motion/);
assert.match(files["assets/site.js"], /aria-pressed/);
assert.match(files["robots.txt"], /Sitemap: https:\/\/yeop\.net\/sitemap\.xml/);
assert.match(files["sitemap.xml"], /<loc>https:\/\/yeop\.net\/<\/loc>/);
assert.ok(!html.includes("http://"), "Only HTTPS external resources allowed");
console.log("PASS: six static resources, links, responsiveness, accessibility and SEO metadata");
