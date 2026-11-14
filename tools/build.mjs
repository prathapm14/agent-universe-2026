// Builds the Agent Universe 2026 speaker banners and event posters as PNGs.
// Run from this folder: node build.mjs   (uses the website repo's Playwright and the installed Google Chrome)
// Writes the posters, the banner templates the website uses, and speaker banner previews in .cache/preview.
// The shareable speaker banners in ../banners come from the website (see README.md), so they always match the live profile.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(join(process.env.HOME, "innovationtechcommunity", "package.json"));
const { chromium } = require("playwright");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FONTS = join(process.env.HOME, "innovationtechcommunity", "public", "fonts");
const url = (path) => pathToFileURL(join(ROOT, path)).href;
const sessions = JSON.parse(readFileSync(join(ROOT, "tools", "sessions.json"), "utf8"));

const EVENT = { date: "14th NOVEMBER 2026", time: "9:00 AM – 3:25 PM (IST)", place: "VIRTUAL EVENT", link: "innovationtechcommunity.com/agent-universe" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const clock = (iso, add = 0) => new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(new Date(iso).getTime() + add * 60_000)).toUpperCase();
const slot = (s) => `${clock(s.start)} – ${clock(s.start, s.minutes)}`;
const slug = (s) => `${String(s.n).padStart(2, "0")}-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`;
const roleLine = (s) => s.role.split("|").map((part) => part.trim()).filter(Boolean).slice(0, 2).join(" · ");

const icon = {
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l3.5 2.5" stroke-linecap="round"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="1.5" y="5" width="15" height="14" rx="3.5"/><path d="M17.5 10.2 22.5 7v10l-5-3.2z"/></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7.1a1.5 1.5 0 0 1 1.06.44l8 8a1.5 1.5 0 0 1 0 2.12l-7.1 7.1a1.5 1.5 0 0 1-2.12 0l-8-8A1.5 1.5 0 0 1 3 11.6zM8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="8.5" y="2.5" width="7" height="12" rx="3.5"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/></svg>`,
};

const css = `
@font-face { font-family: J; font-weight: 500; src: url(${pathToFileURL(join(FONTS, "PlusJakartaSans-500.ttf")).href}); }
@font-face { font-family: J; font-weight: 700; src: url(${pathToFileURL(join(FONTS, "PlusJakartaSans-700.ttf")).href}); }
@font-face { font-family: J; font-weight: 800; src: url(${pathToFileURL(join(FONTS, "PlusJakartaSans-800.ttf")).href}); }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: J, sans-serif; color: #0b1630; }
.canvas { position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center;
  background: radial-gradient(60% 40% at 100% 0%, rgba(168,85,247,.22), transparent 70%), radial-gradient(55% 40% at 0% 8%, rgba(37,99,235,.18), transparent 70%),
  radial-gradient(70% 30% at 50% 100%, rgba(99,102,241,.28), transparent 70%), linear-gradient(180deg, #f7f9ff 0%, #eef2fe 100%); }
.stage { position: absolute; left: 0; bottom: 0; width: 100%; opacity: .95; z-index: 0; }
.card { position: relative; z-index: 1; }
.foot, .cat { z-index: 2; }
.brand { display: flex; align-items: center; gap: 16px; }
.brand img { width: 1em; height: 1em; }
.brand b { display: block; font-weight: 800; line-height: 1.05; letter-spacing: .01em; font-size: .36em; }
.ms { display: flex; align-items: center; gap: .28em; font-weight: 700; color: #5d6170; letter-spacing: -.01em; }
.ms i { display: grid; grid-template-columns: 1fr 1fr; gap: .05em; width: 1.05em; height: 1.05em; }
.ms i span:nth-child(1) { background: #f25022 } .ms i span:nth-child(2) { background: #7fba00 } .ms i span:nth-child(3) { background: #00a4ef } .ms i span:nth-child(4) { background: #ffb900 }
.presents { display: flex; align-items: center; gap: 22px; letter-spacing: .5em; font-weight: 700; color: #1e2a55; }
.presents::before, .presents::after { content: ""; width: 120px; height: 2px; background: linear-gradient(90deg, transparent, #3b6be0); }
.presents::after { transform: scaleX(-1); }
.tagline { display: flex; gap: .9em; letter-spacing: .3em; font-weight: 800; color: #0b1630; }
.tagline span:nth-child(even) { letter-spacing: 0; color: #4f46e5; }
.info { display: flex; align-items: center; background: rgba(255,255,255,.82); border: 1px solid rgba(99,102,241,.18); border-radius: 999px; box-shadow: 0 10px 30px rgba(49,46,129,.08); font-weight: 800; }
.info > div { display: flex; align-items: center; gap: .55em; padding: 0 1.1em; }
.info > div + div { border-left: 2px solid #c7d2fe; }
.info svg { width: 1.6em; height: 1.6em; color: #1d4ed8; flex: none; }
.card { background: rgba(255,255,255,.9); border: 1px solid rgba(99,102,241,.16); border-radius: 32px; box-shadow: 0 24px 60px rgba(49,46,129,.12); }
.ring { border-radius: 50%; padding: 9px; background: linear-gradient(135deg, #1d4ed8, #7c3aed 55%, #d946ef); flex: none; }
.ring img { display: block; width: 100%; height: 100%; border-radius: 50%; border: 7px solid #fff; object-fit: cover; background: #dfe5f2; }
.pill { display: inline-block; color: #fff; font-weight: 800; letter-spacing: .22em; border-radius: 999px; background: linear-gradient(90deg, #1d4ed8, #a855f7); box-shadow: 0 8px 20px rgba(91,33,182,.25); }
.name { font-weight: 800; text-transform: uppercase; letter-spacing: .01em; line-height: 1.08; text-wrap: balance; }
.role { font-weight: 700; color: #4b5875; text-transform: uppercase; letter-spacing: .12em; line-height: 1.35; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
.co { font-weight: 500; color: #4b5875; text-transform: uppercase; letter-spacing: .18em; }
.session-tag { display: inline-flex; align-items: center; gap: .55em; color: #fff; font-weight: 800; letter-spacing: .14em; padding: .45em 1.3em .45em .9em; border-radius: 16px 999px 999px 16px; background: linear-gradient(90deg, #1d4ed8, #7c3aed 70%, #c026d3); }
.session-tag svg { width: 1.2em; height: 1.2em; }
.title { font-weight: 800; line-height: 1.18; letter-spacing: -.01em; }
.summary { font-weight: 500; color: #4b5875; line-height: 1.45; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
.facts { display: grid; border-top: 2px solid #e4e8f6; }
.fact { display: flex; align-items: center; gap: .7em; }
.fact svg { width: 1.5em; height: 1.5em; color: #1d4ed8; flex: none; }
.fact small { display: block; font-weight: 800; font-size: .62em; letter-spacing: .16em; color: #1d4ed8; }
.fact b { display: block; font-weight: 600; }
.facts[data-row] { grid-template-columns: repeat(3, auto); justify-content: space-between; }
.foot { position: absolute; left: 0; right: 0; display: flex; justify-content: center; }
.link { background: #0b1630; color: #fff; font-weight: 800; letter-spacing: .04em; border-radius: 999px; box-shadow: 0 12px 30px rgba(11,22,48,.3); }
.link em { font-style: normal; background: linear-gradient(90deg, #93c5fd, #f0abfc); -webkit-background-clip: text; color: transparent; }
.hosts { display: flex; align-items: center; gap: .6em; padding: .45em 1.1em .45em .9em; border-radius: 999px; background: rgba(255,255,255,.92); border: 1px solid rgba(99,102,241,.2); box-shadow: 0 10px 26px rgba(30,27,75,.18); font-weight: 800; color: #0b1630; white-space: nowrap; }
.hosts small { font-size: .72em; letter-spacing: .2em; color: #4f46e5; margin-right: .3em; }
.hosts span { display: flex; align-items: center; gap: .45em; }
.hosts img { width: 2.1em; height: 2.1em; border-radius: 50%; object-fit: cover; border: 2px solid #a855f7; }
.hosts i { font-style: normal; color: #7c3aed; }
.cat { position: absolute; filter: drop-shadow(0 12px 20px rgba(30,27,75,.25)); }
.script { position: absolute; font-family: "Snell Roundhand", "Segoe Script", cursive; font-weight: 700; color: #1e2a55; transform: rotate(-12deg); line-height: 1.1; }
.script::after { content: ""; display: block; width: 70%; height: 3px; margin-top: 6px; border-radius: 3px; background: linear-gradient(90deg, #a855f7, #ec4899); }
`;

const header = (size, ms) => `<div style="position:absolute;left:0;right:0;top:${size * 0.55}px;display:flex;justify-content:space-between;align-items:center;padding:0 ${size * 0.55}px">
  <div class="brand" style="font-size:${size}px"><img src="${url("art/logo.png")}"><div><b>INNOVATION</b><b>TECH COMMUNITY</b></div></div>
  <div class="ms" style="font-size:${ms}px"><i><span></span><span></span><span></span><span></span></i>Microsoft</div></div>`;
const info = (font, height) => `<div class="info" style="font-size:${font}px;height:${height}px">
  <div>${icon.calendar}${EVENT.date}</div><div>${icon.clock}${EVENT.time}</div><div>${icon.video}${EVENT.place}</div></div>`;
const tagline = (font) => `<div class="tagline" style="font-size:${font}px"><span>BUILD</span><span>•</span><span>LEARN</span><span>•</span><span>CONNECT</span><span>•</span><span>INNOVATE</span></div>`;
const wordmark = (width, top) => `<img src="${url("art/wordmark.png")}" style="width:${width}px;margin-top:${top}px">`;
const facts = (s, font) => `<div class="facts" style="font-size:${font}px;gap:${font * 0.75}px;padding-top:${font * 0.9}px">
  <div class="fact">${icon.clock}<div><small>TIME</small><b>${slot(s)} (IST)</b></div></div>
  <div class="fact">${icon.mic}<div><small>FORMAT</small><b>${esc(s.format)}</b></div></div>
  <div class="fact">${icon.tag}<div><small>LEVEL</small><b>${esc(s.level)}</b></div></div></div>`;
const person = (s, ring, nameFont) => `<div style="display:flex;flex-direction:column;align-items:center;text-align:center">
  <div class="ring" style="width:${ring}px;height:${ring}px"><img src="${url(s.photo)}"></div>
  <span class="pill" style="font-size:${nameFont * 0.62}px;padding:${nameFont * 0.3}px ${nameFont}px;margin-top:-${nameFont * 0.8}px;position:relative">SPEAKER</span>
  <div class="name" style="font-size:${s.name.length > 18 ? nameFont * 0.82 : nameFont}px;margin-top:${nameFont * 0.6}px">${esc(s.name)}</div>
  <div class="role" style="font-size:${nameFont * 0.44}px;margin-top:${nameFont * 0.35}px;max-width:${ring + 40}px">${esc(roleLine(s))}</div>
  ${s.company ? `<div class="co" style="font-size:${nameFont * 0.4}px;margin-top:${nameFont * 0.2}px">${esc(s.company)}</div>` : ""}</div>`;
const sessionBlock = (s, font, lines) => `<span class="session-tag" style="font-size:${font * 0.72}px;align-self:flex-start">${icon.mic}SESSION</span>
  <div class="title" style="font-size:${s.title.length > 80 ? font * 0.9 : font}px;margin-top:${font * 0.6}px">${esc(s.title)}</div>
  ${s.summary ? `<div class="summary" style="font-size:${font * 0.56}px;margin-top:${font * 0.45}px;-webkit-line-clamp:${lines}">${esc(s.summary)}</div>` : ""}`;

export const HOSTS = [["Prathap Reddy", "photos/01.jpg"], ["Divya Akula", "photos/04.jpg"]];
const hosts = (font) => `<div class="hosts" style="font-size:${font}px"><small>HOSTED BY</small>${HOSTS.map(([name, photo]) => `<span><img src="${url(photo)}">${name}</span>`).join("<i>&amp;</i>")}</div>`;
// Card rectangles: the website draws the speaker card here on top of the template (keep in sync with src/lib/banner.tsx).
const CARD = { portrait: [48, 556, 984, 560], story: [60, 630, 960, 960], landscape: [774, 150, 770, 480] };
const cardBox = (size, inner, style = "") => { const [l, t, w, h] = CARD[size]; return `<div class="card" style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:${h}px;${style}">${inner}</div>`; };

// 1080 × 1350 (4:5) — LinkedIn and Instagram feed.
const portrait = (s) => `<div class="canvas" style="width:1080px;height:1350px">
  <img class="stage" src="${url("art/stage.png")}" style="height:250px;object-fit:cover">
  ${header(84, 40)}
  <div class="presents" style="font-size:20px;margin-top:168px">PRESENTS</div>
  ${wordmark(700, 4)}
  ${tagline(22)}
  <div style="margin-top:22px">${info(22, 66)}</div>
  ${s ? cardBox("portrait", `<div style="width:340px;flex:none">${person(s, 300, 38)}</div>
    <div style="display:flex;flex-direction:column;flex:1;min-width:0">${sessionBlock(s, 32, 4)}<div style="margin-top:22px">${facts(s, 22)}</div></div>`, "padding:38px 40px;display:flex;gap:40px;align-items:flex-start") : ""}
  <div class="foot" style="top:1140px">${hosts(19)}</div>
  <div class="foot" style="bottom:30px"><div class="link" style="font-size:22px;padding:16px 34px">Register free · <em>${EVENT.link}</em></div></div>
  <img class="cat" src="${url("art/itc-cat-wave.webp")}" style="width:165px;right:8px;bottom:14px">
</div>`;

// 1080 × 1920 (9:16) — Instagram and WhatsApp status, stories.
const story = (s) => `<div class="canvas" style="width:1080px;height:1920px">
  <img class="stage" src="${url("art/stage.png")}" style="height:300px;object-fit:cover">
  ${header(96, 44)}
  <div class="presents" style="font-size:22px;margin-top:190px">PRESENTS</div>
  ${wordmark(820, 4)}
  ${tagline(26)}
  <div style="margin-top:28px">${info(24, 74)}</div>
  ${s ? cardBox("story", `${person(s, 300, 44)}
    <div style="display:flex;flex-direction:column;width:100%;margin-top:26px;padding-top:24px;border-top:2px solid #e4e8f6">${sessionBlock(s, 34, 2)}<div style="margin-top:22px">${facts(s, 25).replace('class="facts"', 'class="facts" data-row')}</div></div>`, "padding:36px 50px;display:flex;flex-direction:column;align-items:center") : ""}
  <div class="foot" style="top:1626px">${hosts(22)}</div>
  <div class="foot" style="bottom:48px"><div class="link" style="font-size:25px;padding:20px 40px">Register free · <em>${EVENT.link}</em></div></div>
  <img class="cat" src="${url("art/itc-cat-wave.webp")}" style="width:180px;right:6px;bottom:128px">
</div>`;

// 1600 × 900 (16:9) — the same frame as the horizontal poster, for LinkedIn, X and YouTube.
const landscape = (s) => `<div class="canvas" style="width:1600px;height:900px;align-items:flex-start">
  <img class="stage" src="${url("art/stage.png")}" style="height:260px;object-fit:cover;opacity:.9">
  ${header(76, 38)}
  <div style="position:absolute;left:56px;top:150px;width:700px;display:flex;flex-direction:column;align-items:center">
    <div class="presents" style="font-size:18px">PRESENTS</div>
    ${wordmark(660, 6)}
    ${tagline(19)}
    <div style="margin-top:22px;display:flex;flex-direction:column;gap:14px;font-size:22px;font-weight:800;align-self:center">
      <div class="fact">${icon.calendar.replace("<svg", '<svg style="color:#1d4ed8"')}${EVENT.date}</div>
      <div class="fact">${icon.clock}${EVENT.time}</div>
      <div class="fact">${icon.video.replace("<svg", '<svg style="color:#1d4ed8"')}${EVENT.place}</div></div>
  </div>
  ${s ? cardBox("landscape", `<div style="width:270px;flex:none">${person(s, 250, 30)}</div>
    <div style="display:flex;flex-direction:column;flex:1;min-width:0">${sessionBlock(s, 27, 3)}<div style="margin-top:18px">${facts(s, 19)}</div></div>`, "padding:34px 38px;display:flex;gap:34px") : ""}
  <div style="position:absolute;left:56px;top:600px;width:700px;display:flex;justify-content:center;z-index:2">${hosts(17)}</div>
  <div class="foot" style="bottom:30px"><div class="link" style="font-size:20px;padding:14px 30px">Register free · <em>${EVENT.link}</em></div></div>
  <img class="cat" src="${url("art/itc-cat-wave.webp")}" style="width:170px;right:40px;bottom:30px">
</div>`;

// Event posters (no speaker).
const eventPoster = (w, h) => {
  const tall = h / w > 1.5, k = w / 1080;
  return `<div class="canvas" style="width:${w}px;height:${h}px">
  <img class="stage" src="${url("art/stage.png")}" style="height:${tall ? 560 : 420}px;object-fit:cover">
  ${header(92 * k, 44 * k)}
  <div class="presents" style="font-size:22px;margin-top:${tall ? 300 : 200}px">PRESENTS</div>
  ${wordmark(940, 14)}
  ${tagline(28)}
  <div style="margin-top:${tall ? 54 : 34}px">${info(24, 76)}</div>
  <div style="margin-top:${tall ? 50 : 32}px;width:860px;text-align:center;font-size:${tall ? 32 : 28}px;line-height:1.45;font-weight:500;font-style:italic;color:#1e2a55">
    A global gathering for AI builders, creators, and changemakers to explore the next frontier of <b style="color:#4f46e5">Agentic AI</b>.</div>
  <div style="display:flex;gap:22px;margin-top:${tall ? 56 : 34}px">
    ${[[String(sessions.length), "SESSIONS"], [String(sessions.length), "SPEAKERS"], ["1", "DAY · LIVE"]].map(([n, t]) => `<div class="card" style="width:230px;padding:22px 0;text-align:center;border-radius:26px">
      <div style="font-size:58px;font-weight:800;line-height:1;background:linear-gradient(90deg,#1d4ed8,#a855f7);-webkit-background-clip:text;color:transparent">${n}</div>
      <div style="font-size:18px;font-weight:800;letter-spacing:.2em;margin-top:8px;color:#1e2a55">${t}</div></div>`).join("")}
  </div>
  <div style="margin-top:${tall ? 50 : 30}px;font-size:22px;font-weight:700;letter-spacing:.12em;color:#4b5875">LIVE ON YOUTUBE · LINKEDIN · INSTAGRAM</div>
  <div class="foot" style="bottom:${tall ? 190 : 136}px">${hosts(tall ? 24 : 21)}</div>
  <div class="foot" style="bottom:${tall ? 70 : 44}px"><div class="link" style="font-size:28px;padding:22px 44px">Register free · <em>${EVENT.link}</em></div></div>
  <div class="script" style="font-size:44px;left:60px;top:${tall ? 1120 : 820}px;display:none">Same Curiosity<br>Bigger Possibilities</div>
  <img class="cat" src="${url("art/itc-cat-wave.webp")}" style="width:${tall ? 260 : 210}px;right:24px;bottom:${tall ? 170 : 120}px">
</div>`;
};

// Full lineup: every speaker with their time.
const lineup = (w, h, cols) => {
  const tall = h / w > 1.5, wide = w > h, k = wide ? 1 : w / 1080;
  const tile = wide ? 230 : tall ? 300 : 236, face = wide ? 120 : tall ? 146 : 130;
  return `<div class="canvas" style="width:${w}px;height:${h}px">
  <img class="stage" src="${url("art/stage.png")}" style="height:${wide ? 200 : 300}px;object-fit:cover;opacity:.85">
  ${header((wide ? 70 : 84) * k, (wide ? 34 : 40) * k)}
  ${wordmark(wide ? 520 : tall ? 720 : 640, wide ? 104 : tall ? 150 : 120)}
  <div style="margin-top:${wide ? 4 : 10}px">${info(wide ? 18 : 21, wide ? 56 : 64)}</div>
  <div style="font-size:${wide ? 22 : 30}px;font-weight:800;letter-spacing:.3em;margin:${wide ? 18 : tall ? 30 : 24}px 0 ${wide ? 14 : 20}px;color:#1e2a55">SPEAKER LINEUP</div>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;width:${cols * tile + (cols - 1) * (wide ? 14 : tall ? 18 : 16)}px;gap:${wide ? 14 : tall ? 18 : 16}px">
    ${sessions.map((s) => `<div class="card" style="width:${tile}px;display:flex;flex-direction:column;align-items:center;text-align:center;padding:${tall ? 18 : 14}px 10px ${tall ? 16 : 12}px;border-radius:24px">
      <div class="ring" style="width:${face}px;height:${face}px;padding:5px"><img src="${url(s.photo)}" style="border-width:4px"></div>
      <div class="name" style="font-size:${wide ? 17 : tall ? 23 : 18}px;margin-top:${tall ? 14 : 9}px">${esc(s.name)}</div>
      <div style="font-size:${wide ? 14 : tall ? 18 : 15}px;font-weight:800;margin-top:${tall ? 8 : 5}px;color:#4f46e5">${clock(s.start)}</div></div>`).join("")}
  </div>
  <div class="foot" style="${wide ? "top:34px" : `bottom:${tall ? 150 : 112}px`}">${hosts(wide ? 16 : tall ? 21 : 18)}</div>
  <div class="foot" style="bottom:${wide ? 24 : 40}px"><div class="link" style="font-size:${wide ? 19 : 24}px;padding:${wide ? 12 : 18}px 34px">Register free · <em>${EVENT.link}</em></div></div>
</div>`;
};

// The day's agenda with titles.
const agenda = (w, h) => `<div class="canvas" style="width:${w}px;height:${h}px">
  <img class="stage" src="${url("art/stage.png")}" style="height:260px;object-fit:cover;opacity:.8">
  ${header(84, 40)}
  ${wordmark(620, 140)}
  <div style="margin-top:6px">${info(21, 64)}</div>
  <div style="font-size:28px;font-weight:800;letter-spacing:.3em;margin:24px 0 16px;color:#1e2a55">AGENDA</div>
  <div class="card" style="width:980px;padding:14px 30px">
    ${sessions.map((s, i) => `<div style="display:flex;align-items:center;gap:20px;padding:10px 0;${i ? "border-top:1.5px solid #e4e8f6" : ""}">
      <div style="width:110px;flex:none;font-size:20px;font-weight:800;color:#4f46e5">${clock(s.start)}</div>
      <div class="ring" style="width:66px;height:66px;padding:3px"><img src="${url(s.photo)}" style="border-width:3px"></div>
      <div style="min-width:0"><div style="font-size:19px;font-weight:800;line-height:1.25;width:690px">${esc(s.title)}</div>
        <div style="font-size:17px;font-weight:700;color:#4b5875;margin-top:4px">${esc(s.name)}<span style="font-weight:500"> · ${esc(s.format)}</span></div></div></div>`).join("")}
  </div>
  <div class="foot" style="bottom:150px">${hosts(21)}</div>
  <div class="foot" style="bottom:40px"><div class="link" style="font-size:24px;padding:18px 36px">Register free · <em>${EVENT.link}</em></div></div>
</div>`;

// 1080 × 1350 agenda, for LinkedIn and Instagram multi-image posts.
const agendaPost = () => `<div class="canvas" style="width:1080px;height:1350px">
  <img class="stage" src="${url("art/stage.png")}" style="height:200px;object-fit:cover;opacity:.8">
  ${header(72, 34)}
  ${wordmark(460, 104)}
  <div style="margin-top:2px">${info(18, 54)}</div>
  <div style="font-size:22px;font-weight:800;letter-spacing:.3em;margin:16px 0 12px;color:#1e2a55">AGENDA</div>
  <div class="card" style="width:1000px;padding:8px 26px">
    ${sessions.map((s, i) => `<div style="display:flex;align-items:center;gap:16px;padding:7px 0;${i ? "border-top:1.5px solid #e4e8f6" : ""}">
      <div style="width:96px;flex:none;font-size:17px;font-weight:800;color:#4f46e5">${clock(s.start)}</div>
      <div class="ring" style="width:50px;height:50px;padding:3px"><img src="${url(s.photo)}" style="border-width:2px"></div>
      <div style="min-width:0"><div style="font-size:16px;font-weight:800;line-height:1.22;width:760px">${esc(s.title)}</div>
        <div style="font-size:14px;font-weight:700;color:#4b5875;margin-top:2px">${esc(s.name)}<span style="font-weight:500"> · ${esc(s.format)}</span></div></div></div>`).join("")}
  </div>
  <div class="foot" style="bottom:96px">${hosts(17)}</div>
  <div class="foot" style="bottom:24px"><div class="link" style="font-size:20px;padding:14px 30px">Register free · <em>${EVENT.link}</em></div></div>
</div>`;

// Thank-you poster for after the event (4:5 feed and 9:16 story).
const STACK = ["Microsoft Foundry", "Foundry IQ", "Copilot Studio", "Azure AI", "Microsoft Agent Framework", "Multi-agent systems", "MCP", "Azure Logic Apps", "Agent governance", "AI security & trust", "Enterprise AI agents"];
// Vinit Metange could not join on the day, so the thank-you posters list the 10 sessions that ran.
const DELIVERED = sessions.filter((s) => !/vinit/i.test(s.name));
const TEAM = ["Prathap Reddy", "Divya Akula", "Sujith Sukumaran", "Lingaraj Benni"];
const thankYou = (w, h) => {
  const tall = h / w > 1.5, k = tall ? 1.12 : 1;
  const stat = (v, l, c) => `<div class="card" style="flex:1;padding:${tall ? 26 : 18}px 12px;border-radius:26px;text-align:center">
    <div style="font-size:${58 * k}px;font-weight:800;line-height:1;background:${c};-webkit-background-clip:text;color:transparent">${v}</div>
    <div style="font-size:${17 * k}px;font-weight:700;color:#4b5875;margin-top:${8 * k}px;line-height:1.3">${l}</div></div>`;
  return `<div class="canvas" style="width:${w}px;height:${h}px">
  <img class="stage" src="${url("art/stage.png")}" style="height:${tall ? 330 : 230}px;object-fit:cover;opacity:.8">
  ${header(tall ? 84 : 72, tall ? 40 : 34)}
  ${wordmark(tall ? 560 : 420, tall ? 150 : 100)}
  <div style="font-size:${(tall ? 150 : 118)}px;font-weight:800;line-height:1;letter-spacing:-.02em;margin-top:${tall ? 26 : 8}px;background:linear-gradient(90deg,#1d4ed8,#7c3aed 55%,#d946ef);-webkit-background-clip:text;color:transparent;padding-bottom:6px">THANK YOU!</div>
  <div style="font-size:${24 * k}px;font-weight:700;color:#1e2a55;margin-top:${6 * k}px;text-align:center;line-height:1.35">for making <b style="font-weight:800;color:#4f46e5">Agent Universe 2026</b> a huge success 💜</div>
  <div style="display:flex;gap:${16 * k}px;width:${tall ? 960 : 980}px;margin-top:${tall ? 34 : 20}px">
    ${stat("1K+", "watched live<br>on YouTube", "linear-gradient(90deg,#dc2626,#f97316)")}
    ${stat("500+", "attendees on<br>LinkedIn Live", "linear-gradient(90deg,#0a66c2,#2563eb)")}
    ${stat(String(DELIVERED.length), "expert speakers<br>&amp; sessions", "linear-gradient(90deg,#7c3aed,#d946ef)")}
  </div>
  <div style="font-size:${17 * k}px;font-weight:800;letter-spacing:.3em;color:#1e2a55;margin-top:${tall ? 34 : 20}px">THANK YOU TO OUR SPEAKERS</div>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;column-gap:${tall ? 12 : 8}px;row-gap:${tall ? 16 : 10}px;width:${tall ? 5 * 152 + 4 * 12 : 5 * 150 + 4 * 8}px;margin-top:${12 * k}px">
    ${DELIVERED.map((s) => `<div style="display:flex;flex-direction:column;align-items:center;width:${tall ? 152 : 150}px">
      <div class="ring" style="width:${tall ? 104 : 80}px;height:${tall ? 104 : 80}px;padding:3px"><img src="${url(s.photo)}" style="border-width:3px"></div>
      <div style="font-size:${tall ? 15 : 13}px;font-weight:800;margin-top:${tall ? 6 : 4}px;text-align:center;line-height:1.15;white-space:nowrap">${esc(s.name)}</div></div>`).join("")}
  </div>
  <div style="font-size:${17 * k}px;font-weight:800;letter-spacing:.3em;color:#1e2a55;margin-top:${tall ? 34 : 20}px">TODAY WE COVERED</div>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:${9 * k}px;width:${tall ? 960 : 1000}px;margin-top:${12 * k}px">
    ${STACK.map((t, i) => `<span style="font-size:${16 * k}px;font-weight:800;color:#fff;padding:${8 * k}px ${16 * k}px;border-radius:999px;background:${["#2563eb", "#7c3aed", "#c026d3", "#0ea5e9", "#f59e0b", "#10b981"][i % 6]}">${esc(t)}</span>`).join("")}
  </div>
  <div class="card" style="position:absolute;left:50%;transform:translateX(-50%);bottom:${tall ? 110 : 34}px;width:${tall ? 960 : 1000}px;padding:${tall ? 26 : 18}px 30px;border-radius:28px;text-align:center">
    <div style="font-family:'Snell Roundhand','Segoe Script',cursive;font-size:${36 * k}px;font-weight:700;color:#4f46e5;line-height:1">Sincerely,</div>
    <div style="font-size:${22 * k}px;font-weight:800;letter-spacing:.06em;color:#0b1630;margin-top:${8 * k}px">INNOVATION TECH COMMUNITY TEAM</div>
    <div style="font-size:${18 * k}px;font-weight:700;color:#4b5875;margin-top:${6 * k}px">${TEAM.join("  ·  ")}</div>
  </div>
  <img class="cat" src="${url("art/itc-cat-wave.webp")}" style="width:${tall ? 230 : 170}px;right:${tall ? 30 : 14}px;bottom:${tall ? 250 : 150}px">
  ${tall ? `<div class="foot" style="bottom:36px"><div class="link" style="font-size:22px;padding:16px 34px">#AgentUniverse2026 · <em>innovationtechcommunity.com</em></div></div>` : ""}
</div>`;
};

// Thank-you letter (no photos), with the Agent Universe passport stamp and the ITC Learning Passport.
const stampSvg = (size, c = "#4338ca") => `<svg viewBox="0 0 120 120" width="${size}" height="${size}">
  <defs><filter id="ink"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.4"/></filter></defs>
  <g filter="url(#ink)" font-family="J, sans-serif">
    <circle cx="60" cy="60" r="54" fill="none" stroke="${c}" stroke-width="3"/><circle cx="60" cy="60" r="46" fill="none" stroke="${c}" stroke-width="1.2" stroke-dasharray="2 2.5"/>
    <text x="60" y="38" text-anchor="middle" font-size="7" font-weight="800" fill="${c}" letter-spacing="2">ATTENDEE</text>
    <line x1="30" y1="44" x2="90" y2="44" stroke="${c}" stroke-width="1"/>
    <text x="60" y="58" text-anchor="middle" font-size="9.5" font-weight="800" fill="${c}">AGENT UNIVERSE</text>
    <text x="60" y="69" text-anchor="middle" font-size="9.5" font-weight="800" fill="${c}">2026</text>
    <line x1="30" y1="75" x2="90" y2="75" stroke="${c}" stroke-width="1"/>
    <text x="60" y="85" text-anchor="middle" font-size="7" font-weight="800" fill="${c}" letter-spacing="1">NOV 2026</text>
    <text x="60" y="94" text-anchor="middle" font-size="6" font-weight="700" fill="${c}" letter-spacing="1">WORLDWIDE</text></g></svg>`;
const passportCover = (w) => `<div style="position:relative;width:${w}px;height:${w / 0.72}px;border-radius:6px 12px 12px 6px;background:linear-gradient(160deg,#0b1630,#1d3a8a);color:#d9c47e;display:flex;flex-direction:column;align-items:center;text-align:center;padding:${w * 0.1}px ${w * 0.08}px;box-shadow:inset 5px 0 10px rgba(0,0,0,.45),0 14px 30px rgba(11,22,48,.35);transform:rotate(-6deg)">
  <span style="position:absolute;inset:6px;border:1.2px solid rgba(217,196,126,.45);border-radius:inherit"></span>
  <span style="font-size:${w * 0.05}px;letter-spacing:.2em;font-weight:700">INNOVATION TECH COMMUNITY</span>
  <img src="${url("art/logo.png")}" style="width:${w * 0.36}px;height:${w * 0.36}px;margin:${w * 0.1}px 0 ${w * 0.08}px;filter:drop-shadow(0 0 6px rgba(217,196,126,.4))">
  <span style="font-size:${w * 0.1}px;letter-spacing:.16em;font-weight:800;line-height:1.25">LEARNING<br>PASSPORT</span>
  <span style="margin-top:auto;font-size:${w * 0.045}px;letter-spacing:.26em;opacity:.8">LEARN · BUILD · GROW</span></div>`;
const statIcon = {
  yt: `<svg viewBox="0 0 24 24" width="44" height="44"><rect x="1.5" y="4.5" width="21" height="15" rx="4.5" fill="#ef4444"/><path d="M10 9v6l5.2-3z" fill="#fff"/></svg>`,
  li: `<svg viewBox="0 0 24 24" width="44" height="44"><rect x="1.5" y="1.5" width="21" height="21" rx="4" fill="#0a66c2"/><path d="M6.3 9.6h2.6v8H6.3zM7.6 5.6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3M10.7 9.6h2.5v1.1c.4-.7 1.3-1.3 2.6-1.3 2.7 0 3.2 1.7 3.2 4v4.2h-2.6v-3.7c0-.9 0-2-1.3-2s-1.5 1-1.5 2v3.7h-2.6z" fill="#fff"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#7c3aed" stroke-width="2.2" stroke-linecap="round"><rect x="8.5" y="2.5" width="7" height="12" rx="3.5" fill="#ede9fe"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5M8.5 21.5h7"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#c026d3" stroke-width="2"><circle cx="12" cy="12" r="9.5" fill="#fae8ff"/><path d="M2.5 12h19M12 2.5c3 3.2 3 15.8 0 19M12 2.5c-3 3.2-3 15.8 0 19"/></svg>`,
};
const thankYouLetter = () => {
  const grad = "linear-gradient(90deg,#1d4ed8,#7c3aed 50%,#c026d3)";
  const stat = (ic, v, l) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 8px">${statIcon[ic]}
    <div style="font-size:30px;font-weight:800;margin-top:6px;background:${grad};-webkit-background-clip:text;color:transparent;line-height:1.1">${v}</div>
    <div style="font-size:14px;font-weight:700;color:#1e2a55;line-height:1.3;margin-top:3px">${l}</div></div>`;
  const sep = `<div style="width:1.5px;align-self:stretch;background:linear-gradient(180deg,transparent,#c7d2fe,transparent)"></div>`;
  return `<div class="canvas" style="width:1080px;height:1350px;align-items:stretch;padding:0 56px">
  <img class="stage" src="${url("art/stage.png")}" style="height:420px;object-fit:cover;opacity:.16">
  <div style="position:absolute;left:0;right:0;bottom:0;height:16px;background:linear-gradient(90deg,#1d4ed8,#7c3aed,#c026d3,#ec4899)"></div>
  <div style="position:relative;display:flex;justify-content:space-between;align-items:center;margin-top:40px">
    <div class="brand" style="font-size:96px;gap:18px"><img src="${url("art/logo.png")}"><div style="border-left:2px solid #1e2a55;padding-left:18px"><b style="font-size:.31em">INNOVATION</b><b style="font-size:.25em;font-weight:700">TECH COMMUNITY</b></div></div>
    <div class="ms" style="font-size:30px"><i><span></span><span></span><span></span><span></span></i>Microsoft</div></div>
  <div style="position:relative;display:flex;align-items:center;margin-top:6px">
    <img src="${url("art/wordmark.png")}" style="width:330px;flex:none;margin-left:-10px">
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center">
      <div style="font-family:'Snell Roundhand','Segoe Script',cursive;font-size:96px;font-weight:700;line-height:1.05;background:linear-gradient(90deg,#c026d3,#7c3aed);-webkit-background-clip:text;color:transparent;padding:0 10px">Thank You!</div>
      <div style="display:flex;align-items:center;gap:14px;font-size:19px;font-weight:800;letter-spacing:.24em;color:#1e2a55;margin-top:2px"><span style="width:70px;height:2px;background:#1e2a55"></span>FOR MAKING<span style="width:70px;height:2px;background:#1e2a55"></span></div>
      <div style="font-size:64px;font-weight:800;line-height:1.02;letter-spacing:-.01em;margin-top:6px;background:${grad};-webkit-background-clip:text;color:transparent">AGENT UNIVERSE<br>2026</div>
      <div style="font-size:14.5px;font-weight:700;color:#1e2a55;margin-top:10px">— Build · Learn · Connect · Innovate: a global virtual day of Agentic AI —</div>
    </div></div>
  <div style="position:relative;font-size:18.5px;font-weight:500;line-height:1.5;color:#1e2a55;margin-top:24px">
    <p style="font-weight:800;margin-bottom:10px">Dear Attendees, Speakers, Volunteers &amp; Well-wishers,</p>
    <p style="margin-bottom:9px">We are thrilled to share that <b style="font-weight:800;color:#c026d3">Agent Universe 2026</b> was a tremendous success! Your overwhelming response, energy and active participation in the live chat made this day truly special.</p>
    <p style="margin-bottom:9px">With <b style="font-weight:800">1,000+ viewers live on YouTube</b> and <b style="font-weight:800">500+ attendees on LinkedIn Live</b>, joining from across India and around the world, Agent Universe brought together a vibrant community of developers, architects, makers and technology leaders.</p>
    <p style="margin-bottom:9px">Across <b style="font-weight:800">${DELIVERED.length} sessions and live demos</b>, we went from idea to agent: Microsoft Foundry, Foundry IQ, Copilot Studio, MCP, Azure Logic Apps, Microsoft Agent Framework, multi-agent governance and AI security.</p>
    <p style="margin-bottom:9px">A heartfelt thank you to our speakers, <b style="font-weight:700">${DELIVERED.map((s) => esc(s.name)).join(", ").replace(/, ([^,]*)$/, " and $1")}</b>, and to our hosts and volunteers. Your knowledge and dedication were the driving force behind this day.</p>
    <p style="font-weight:800;color:#c026d3">Here's to the agents we built, the knowledge we shared, and the future we are building together!</p>
  </div>
  <div class="card" style="position:relative;display:flex;align-items:center;margin-top:20px;padding:18px 10px;border-radius:24px">
    ${stat("yt", "1K+", "Watched live<br>on YouTube")}${sep}${stat("li", "500+", "Attendees on<br>LinkedIn Live")}${sep}${stat("mic", String(DELIVERED.length), "Expert speakers<br>&amp; sessions")}${sep}${stat("globe", "Global", "A day of<br>Agentic AI")}
  </div>
  <div style="position:relative;display:flex;align-items:flex-end;justify-content:space-between;margin-top:20px">
    <div>
      <div style="font-size:16px;font-weight:700;color:#1e2a55">With Regards,</div>
      <div style="font-family:'Snell Roundhand','Segoe Script',cursive;font-size:38px;font-weight:700;color:#1e2a55;line-height:1.15">Innovation Tech Community Team</div>
      <div style="font-size:15px;font-weight:700;color:#4b5875;margin-top:4px">${TEAM.join("  ·  ")}</div>
      <div style="font-size:13px;font-weight:800;letter-spacing:.28em;color:#1e2a55;margin-top:10px">BUILD · LEARN · CONNECT · INNOVATE</div>
    </div>
    <div style="display:flex;align-items:center;gap:6px;margin-right:6px">
      ${passportCover(132)}
      <div style="transform:rotate(-8deg);margin-left:-14px">${stampSvg(162)}</div>
    </div>
  </div>
  <div style="position:relative;display:flex;justify-content:flex-end;margin-top:8px">
    <div style="font-size:13.5px;font-weight:800;color:#4338ca;text-align:right;line-height:1.35">Registered? Claim your Agent Universe 2026 stamp<br>in your Learning Passport · innovationtechcommunity.com</div></div>
</div>`;
};

// YouTube thumbnail for the full recording (1280 × 720), in the poster theme.
const ytThumb = () => {
  const rows = [DELIVERED.slice(0, 4), DELIVERED.slice(4, 7), DELIVERED.slice(7)];
  const face = 138;
  return `<div class="canvas" style="width:1280px;height:720px;align-items:flex-start">
  <img class="stage" src="${url("art/stage.png")}" style="height:240px;object-fit:cover;opacity:.6">
  <div style="position:absolute;inset:0;background:radial-gradient(45% 65% at 78% 45%,rgba(168,85,247,.26),transparent 70%)"></div>
  <div style="position:absolute;left:44px;top:34px"><div class="brand" style="font-size:66px;gap:12px"><img src="${url("art/logo.png")}"><div><b>INNOVATION</b><b>TECH COMMUNITY</b></div></div></div>
  <div class="ms" style="position:absolute;right:44px;top:46px;font-size:30px"><i><span></span><span></span><span></span><span></span></i>Microsoft</div>
  <div style="position:absolute;left:44px;top:128px;width:600px">
    <img src="${url("art/wordmark.png")}" style="width:560px;margin-left:-16px">
    <div style="display:flex;align-items:center;gap:16px;margin-top:10px">
      <span style="display:inline-flex;align-items:center;gap:10px;background:#dc2626;color:#fff;font-size:34px;font-weight:800;letter-spacing:.05em;padding:11px 26px 11px 18px;border-radius:16px;box-shadow:0 10px 26px rgba(220,38,38,.35)"><svg viewBox="0 0 24 24" width="34" height="34"><path d="M7 4.5v15l12.5-7.5z" fill="#fff"/></svg>FULL EVENT</span>
      <span style="font-size:44px;font-weight:800;background:linear-gradient(90deg,#1d4ed8,#7c3aed 55%,#d946ef);-webkit-background-clip:text;color:transparent">2026</span></div>
    <div style="font-size:50px;font-weight:800;line-height:1.06;margin-top:18px;color:#0b1630">${DELIVERED.length} Sessions on<br><span style="background:linear-gradient(90deg,#1d4ed8,#7c3aed 55%,#d946ef);-webkit-background-clip:text;color:transparent">AI Agents</span></div>
    <div class="info" style="display:inline-flex;font-size:22px;height:58px;margin-top:22px"><div>${icon.calendar}14 NOVEMBER 2026</div><div>${icon.video}VIRTUAL EVENT</div></div>
  </div>
  <div style="position:absolute;right:36px;top:112px;width:640px;display:flex;flex-direction:column;align-items:center;gap:6px">
    ${rows.map((r) => `<div style="display:flex;gap:16px">${r.map((s) => `<div class="ring" style="width:${face}px;height:${face}px;padding:6px;box-shadow:0 12px 28px rgba(49,46,129,.22)"><img src="${url(s.photo)}" style="border-width:5px"></div>`).join("")}</div>`).join("")}
  </div>
  <div style="position:absolute;right:62px;bottom:30px;width:590px;text-align:center;font-size:25px;font-weight:800;color:#fff;background:#0b1630;border-radius:999px;padding:13px 0;box-shadow:0 10px 26px rgba(11,22,48,.3)">${DELIVERED.length} expert speakers · <span style="background:linear-gradient(90deg,#93c5fd,#f0abfc);-webkit-background-clip:text;color:transparent">Talks &amp; live demos</span></div>
</div>`;
};

const jobs = [];
for (const s of sessions) {
  jobs.push([`tools/.cache/preview/portrait/${slug(s)}.png`, 1080, 1350, portrait(s)]);
  jobs.push([`tools/.cache/preview/story/${slug(s)}.png`, 1080, 1920, story(s)]);
  jobs.push([`tools/.cache/preview/landscape/${slug(s)}.png`, 1600, 900, landscape(s)]);
}
for (const [size, render] of [["portrait", portrait], ["story", story], ["landscape", landscape]])
  jobs.push([`templates/agent-universe-2026-banner-${size}.png`, ...(size === "landscape" ? [1600, 900] : size === "story" ? [1080, 1920] : [1080, 1350]), render(null)]);
jobs.push(["posters/agent-universe-poster-portrait.png", 1080, 1350, eventPoster(1080, 1350)]);
jobs.push(["posters/agent-universe-poster-story.png", 1080, 1920, eventPoster(1080, 1920)]);
jobs.push(["posters/agent-universe-lineup-portrait.png", 1080, 1350, lineup(1080, 1350, 4)]);
jobs.push(["posters/agent-universe-lineup-story.png", 1080, 1920, lineup(1080, 1920, 3)]);
jobs.push(["posters/agent-universe-lineup-landscape.png", 1600, 900, lineup(1600, 900, 6)]);
jobs.push(["posters/agent-universe-agenda-story.png", 1080, 1920, agenda(1080, 1920)]);
jobs.push(["posters/agent-universe-agenda-portrait.png", 1080, 1350, agendaPost()]);
jobs.push(["posters/agent-universe-thank-you-portrait.png", 1080, 1350, thankYou(1080, 1350)]);
jobs.push(["posters/agent-universe-thank-you-story.png", 1080, 1920, thankYou(1080, 1920)]);
jobs.push(["posters/agent-universe-thank-you-letter.png", 1080, 1350, thankYouLetter()]);
jobs.push(["posters/agent-universe-youtube-thumbnail.png", 1280, 720, ytThumb()]);

const only = process.argv[2];
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const [file, width, height, body] of jobs) {
  if (only && !file.includes(only)) continue;
  await page.setViewportSize({ width, height });
  writeFileSync(join(ROOT, "tools", ".page.html"), `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`);
  await page.goto(url("tools/.page.html"), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  mkdirSync(join(ROOT, dirname(file)), { recursive: true });
  writeFileSync(join(ROOT, file), await page.screenshot({ clip: { x: 0, y: 0, width, height } }));
  console.log(file);
}
await browser.close();
