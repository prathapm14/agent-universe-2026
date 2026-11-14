// Builds slides/agent-universe-2026-closing.pptx: the hosts' closing slides (thank-you, recap, passport stamp, stay connected) with a closing script in the notes.
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const { THEME, applyTheme } = require("./theme");
const SPEAKERS = require("./speakers");
const CACHE = path.join(__dirname, ".cache");
const data = JSON.parse(fs.readFileSync(path.join(CACHE, "data.json"), "utf8"));
const IMG = (f) => path.join(CACHE, "img", f), A = (f) => path.join(CACHE, "assets", f);
const NAVY = "14154A", INK = "1E2A78", BLUE = "2563EB", VIOLET = "7C3AED", MAGENTA = "C026D3", SKY = "0EA5E9", SLATE = "5B6385", AMBER = "F59E0B", LAV = "F4F2FF", LAV2 = "C7C9FF", PINK = "F0ABFC", WHITE = "FFFFFF";
const CYCLE = [BLUE, VIOLET, MAGENTA, SKY, AMBER, "10B981"];
const YT = "youtube.com/live/dGrWyDnP0PE", SITE = "innovationtechcommunity.com";
const TEAM = ["Prathap Reddy", "Divya Akula", "Sujith Sukumaran", "Lingaraj Benni"];
const POSTER = (f) => path.join(__dirname, "..", "posters", f);

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "Agent Universe 2026 · Closing"; pres.author = "Innovation Tech Community"; pres.company = "Innovation Tech Community";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const H = THEME.headFontFace, B = THEME.bodyFontFace;
  const key = (n) => n.trim().split(/\s+/)[0].toLowerCase();
  // Vinit Metange could not join on the day, so the close thanks the 10 sessions that ran.
  const delivered = data.sessions.filter((x) => !/vinit/i.test(x.speakers[0].name));
  const speakers = delivered.map((s) => SPEAKERS.find((x) => key(x.people[0].name) === key(s.speakers[0].name)).people[0]);
  const mvps = speakers.filter((p) => p.chips.some((c) => c.includes("MVP"))).length;
  let n = 0;
  const T = (s, text, o) => s.addText(text, { fontFace: B, margin: 0, isTextBox: true, ...o });
  const icon = (s, name, x, y, d, color) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: "none" } });
    s.addImage({ path: IMG(`ic-${name}-w.png`), x: x + d * 0.26, y: y + d * 0.26, w: d * 0.48, h: d * 0.48 });
  };
  const dark = (notes) => {
    n++; const s = pres.addSlide(); s.background = { path: IMG("bg-dark.png") };
    s.addImage({ path: A("itc-logo.png"), x: 0.7, y: 0.45, w: 0.6, h: 0.6 });
    T(s, "AGENT UNIVERSE 2026  ·  #AgentUniverse2026", { x: 1.45, y: 0.55, w: 7, h: 0.4, fontSize: 12, bold: true, color: LAV2, charSpacing: 4 });
    s.addNotes(notes); return s;
  };
  const light = (title, kick, notes) => {
    n++; const s = pres.addSlide(); s.background = { path: IMG("bg-light.png") };
    T(s, kick.toUpperCase(), { x: 0.6, y: 0.3, w: 9, h: 0.35, fontSize: 12, bold: true, color: VIOLET, charSpacing: 4 });
    T(s, title, { x: 0.6, y: 0.62, w: 11.6, h: 0.8, fontSize: 32, bold: true, color: INK, fontFace: H, valign: "middle" });
    T(s, "Agent Universe 2026  ·  #AgentUniverse2026", { x: 0.6, y: 6.98, w: 8, h: 0.3, fontSize: 10, color: SLATE });
    T(s, String(n), { x: 11.5, y: 6.98, w: 0.5, h: 0.3, fontSize: 10, color: SLATE, align: "right" });
    s.addImage({ path: A("itc-logo.png"), x: 12.25, y: 6.82, w: 0.48, h: 0.48 });
    s.addNotes(notes); return s;
  };

  // 1. That's a wrap
  let s = dark(`[Prathap & Divya · start of the close, about 3:25 PM] What a day! That brings us to the end of Agent Universe 2026. More than 1,000 of you watched live on YouTube and 500+ joined us on LinkedIn Live, from India and around the world. Thank you! Before you go, we have a few thank-yous and a couple of quick things for you.`);
  T(s, "THAT'S A WRAP!", { x: 0.7, y: 1.5, w: 7, h: 0.45, fontSize: 18, bold: true, color: PINK, charSpacing: 6 });
  T(s, "Thank you for joining Agent Universe 2026", { x: 0.7, y: 2.0, w: 7.6, h: 2.0, fontSize: 46, bold: true, color: WHITE, fontFace: H, valign: "top" });
  T(s, [{ text: `1K+ live on YouTube  ·  500+ on LinkedIn Live  ·  ${delivered.length} sessions`, options: { breakLine: true } }, { text: "Hosted by Prathap Reddy & Divya Akula" }], { x: 0.7, y: 4.35, w: 7.6, h: 1.0, fontSize: 19, color: LAV2, valign: "top" });
  s.addImage({ path: A("cat-wave.png"), x: 8.7, y: 1.5, w: 3.9, h: 3.9 });
  T(s, `Innovation Tech Community  ·  ${SITE}`, { x: 0.7, y: 6.85, w: 8, h: 0.35, fontSize: 12, color: LAV2 });

  // 2. Speakers
  s = light("A huge thank you to our speakers", "Thank you", `[Divya] The real stars of today: our ${speakers.length} speakers. Thank you for your time, your expertise and your live demos, and for sharing so generously with the community. Read the names out: ${speakers.map((p) => p.name).join(", ")}.`);
  speakers.forEach((p, i) => {
    const half = Math.ceil(speakers.length / 2), row = i < half ? 0 : 1, col = row ? i - half : i, perRow = row ? speakers.length - half : half;
    const w = 2.3, x0 = (13.333 - perRow * w) / 2, x = x0 + col * w, y = 1.75 + row * 2.55;
    s.addImage({ path: IMG(`ph-${p.photo}.png`), x: x + 0.4, y, w: 1.5, h: 1.5 });
    T(s, p.name, { x, y: y + 1.58, w, h: 0.4, fontSize: 14, bold: true, color: INK, align: "center" });
    T(s, p.chips[0], { x, y: y + 1.96, w, h: 0.32, fontSize: 11, color: VIOLET, align: "center" });
  });

  // 3. Recap
  s = light("Today at Agent Universe 2026", "Recap", `[Prathap] A quick look back at the day. We went from idea to agent with Microsoft Foundry and Copilot Studio, through Foundry IQ, secure harnesses and governed multi-agent systems, MCP and business capabilities, ERP workflows with Logic Apps, proactive AI teammates, Agent Framework and enterprise-grade trust. And the numbers: more than 1,000 of you watched live on YouTube and 500+ on LinkedIn Live. If you missed any session, the full recording is on YouTube.`);
  [["1K+", "watched live on YouTube", "DC2626"], ["500+", "attendees on LinkedIn Live", "0A66C2"], [String(delivered.length), "expert speakers & sessions", VIOLET], [String(mvps), "Microsoft MVPs", MAGENTA]].forEach(([v, l, c], i) => {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.75, w: 2.85, h: 2.2, rectRadius: 0.15, fill: { color: LAV }, line: { type: "none" } });
    T(s, v, { x, y: 1.95, w: 2.85, h: 1.2, fontSize: 64, bold: true, color: c, align: "center", fontFace: H });
    T(s, l, { x: x + 0.15, y: 3.2, w: 2.55, h: 0.6, fontSize: 17, color: INK, align: "center" });
  });
  T(s, "WHAT WE COVERED", { x: 0.6, y: 4.3, w: 6, h: 0.35, fontSize: 12, bold: true, color: SLATE, charSpacing: 4 });
  let cx = 0.6, cy = 4.75;
  ["Microsoft Foundry", "Foundry IQ", "Copilot Studio", "Multi-agent systems", "Agent governance", "MCP", "Azure Logic Apps", "Agent Framework", "AI security & trust", "Enterprise AI agents"].forEach((t, i) => {
    const w = 0.5 + t.length * 0.12;
    if (cx + w > 12.75) { cx = 0.6; cy += 0.7; }
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: cy, w, h: 0.5, rectRadius: 0.25, fill: { color: CYCLE[i % CYCLE.length] }, line: { type: "none" } });
    T(s, t, { x: cx, y: cy, w, h: 0.5, fontSize: 14, bold: true, color: WHITE, align: "center", valign: "middle" });
    cx += w + 0.18;
  });

  // 4. Thank-you letter
  const LETTER = ["We are thrilled to share that Agent Universe 2026 was a tremendous success! Your overwhelming response, energy and active participation in the live chat made this day truly special.", "With 1,000+ viewers live on YouTube and 500+ attendees on LinkedIn Live, joining from across India and around the world, Agent Universe brought together a vibrant community of developers, architects, makers and technology leaders.", "Across 10 sessions and live demos, we went from idea to agent: Microsoft Foundry, Foundry IQ, Copilot Studio, MCP, Azure Logic Apps, Microsoft Agent Framework, multi-agent governance and AI security.", "A heartfelt thank you to our speakers, hosts and volunteers. Your knowledge and dedication were the driving force behind this day.", "Here's to the agents we built, the knowledge we shared, and the future we are building together!"];
  s = light("A thank-you letter to our community", "With gratitude", `[Prathap · read the letter, about 1.5 minutes]\n\nDear Attendees, Speakers, Volunteers & Well-wishers,\n\n${LETTER.join("\n\n")}\n\nOur speakers today: ${speakers.map((p) => p.name).join(", ")}.\n\nWith regards,\nInnovation Tech Community Team: ${TEAM.join(", ")}.`);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.6, w: 7.9, h: 5.15, rectRadius: 0.15, fill: { color: WHITE }, line: { color: "E4E0FB", width: 1 } });
  T(s, [{ text: "Dear Attendees, Speakers, Volunteers & Well-wishers,", options: { bold: true, color: INK, breakLine: true, paraSpaceAfter: 8 } },
    ...LETTER.map((t, i, a) => ({ text: t, options: { color: i === a.length - 1 ? MAGENTA : INK, bold: i === a.length - 1, breakLine: true, paraSpaceAfter: 7 } })),
    { text: "With regards, Innovation Tech Community Team", options: { bold: true, color: VIOLET, breakLine: true } },
    { text: TEAM.join("  ·  "), options: { color: SLATE } }], { x: 0.9, y: 1.8, w: 7.3, h: 4.8, fontSize: 13.5, valign: "top" });
  s.addImage({ path: POSTER("agent-universe-thank-you-letter.png"), x: 8.85, y: 1.6, w: 4.12, h: 5.15 });

  // 5. Thank-you posters
  s = light("Share the love: our thank-you posters", "Spread the word", `[Divya] We've made thank-you posters for today. Please download them from our GitHub repo, share them on LinkedIn, Instagram and WhatsApp, and tag Innovation Tech Community with #AgentUniverse2026. Speakers, please share them too!`);
  [["agent-universe-thank-you-portrait.png", "Thank-you poster"], ["agent-universe-thank-you-letter.png", "Thank-you letter"]].forEach(([f, l], i) => {
    const x = 1.2 + i * 3.6;
    s.addImage({ path: POSTER(f), x, y: 1.6, w: 3.2, h: 4.0 });
    T(s, l, { x, y: 5.7, w: 3.2, h: 0.4, fontSize: 15, bold: true, color: INK, align: "center" });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.6, y: 1.6, w: 4.1, h: 4.5, rectRadius: 0.15, fill: { color: NAVY }, line: { type: "none" } });
  T(s, [{ text: "Download & share", options: { bold: true, fontSize: 24, color: WHITE, breakLine: true, paraSpaceAfter: 10 } },
    { text: "github.com/prathapm14/agent-universe-2026", options: { fontSize: 15, color: PINK, bold: true, breakLine: true, paraSpaceAfter: 14 } },
    { text: "Tag Innovation Tech Community", options: { fontSize: 16, color: LAV2, breakLine: true } },
    { text: "#AgentUniverse2026", options: { fontSize: 16, color: LAV2, bold: true } }], { x: 8.9, y: 1.9, w: 3.6, h: 4.0, valign: "top" });

  // 6. Passport stamp
  s = light("Claim your Agent Universe 2026 stamp", "Learning Passport", `[Divya · about 1 minute] One important thing before you go! Everyone who registered for Agent Universe 2026 can claim the Agent Universe 2026 stamp in their ITC Learning Passport.

Step 1: go to ${SITE} and sign in with Google or GitHub, using the same email you registered with.
Step 2: click Passport on the website and tap the cover to open it.
Step 3: you'll see "You're registered! Claim your attendee stamp." Click Claim.

Speakers, your speaker stamp is added automatically. Please claim it today, and share your passport on LinkedIn with #AgentUniverse2026!`);
  T(s, "Every registered attendee gets the Agent Universe 2026 stamp in their ITC Learning Passport. Claim it today!", { x: 0.6, y: 1.5, w: 12.1, h: 0.5, fontSize: 18, color: SLATE });
  [["globe", "Sign in", `Go to ${SITE} and sign in with Google or GitHub, using the same email you registered with.`],
   ["passport", "Open your Passport", "Click Passport on the website and tap the cover to open your Learning Passport."],
   ["bulb", "Claim your stamp", "You'll see \"You're registered! Claim your attendee stamp.\" Click Claim, and the stamp is yours."]].forEach(([ic, h, t], i) => {
    const x = 0.6 + i * 4.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.2, w: 3.85, h: 3.5, rectRadius: 0.15, fill: { color: LAV }, line: { type: "none" } });
    icon(s, ic, x + 0.35, 2.5, 0.95, [BLUE, VIOLET, MAGENTA][i]);
    T(s, `${i + 1}. ${h}`, { x: x + 0.35, y: 3.65, w: 3.2, h: 0.55, fontSize: 22, bold: true, color: INK, fontFace: H });
    T(s, t, { x: x + 0.35, y: 4.25, w: 3.2, h: 1.35, fontSize: 15, color: INK, valign: "top" });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 5.95, w: 12.1, h: 0.7, rectRadius: 0.12, fill: { color: NAVY }, line: { type: "none" } });
  T(s, `${SITE}  →  Passport  →  Claim  ·  Speakers get their speaker stamp automatically`, { x: 0.6, y: 5.95, w: 12.1, h: 0.7, fontSize: 17, bold: true, color: WHITE, align: "center", valign: "middle" });

  // 7. Stay connected
  s = light("Stay connected", "Keep learning with us", `[Prathap] The learning doesn't stop here. Watch the recordings, share your favourite takeaways with #AgentUniverse2026 and tag Innovation Tech Community so we can reshare them, and join the community at ${SITE} for our next events.`);
  [["play", "Watch the recordings", `Every session is on YouTube:\n${YT}`], ["hashtag", "Share your takeaways", "Post with #AgentUniverse2026 and tag Innovation Tech Community"],
   ["chat", "Join the community", `Become a member at ${SITE} for meetups, workshops and summits`], ["mic", "Speak at ITC", "Have a story to share? Submit a talk for our next event"]].forEach(([ic, h, t], i) => {
    const x = 0.6 + (i % 2) * 6.1, y = 1.75 + Math.floor(i / 2) * 2.3;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.85, h: 2.05, rectRadius: 0.15, fill: { color: LAV }, line: { type: "none" } });
    icon(s, ic, x + 0.35, y + 0.5, 1.0, CYCLE[i]);
    T(s, [{ text: h, options: { bold: true, fontSize: 22, color: INK, breakLine: true } }, { text: t, options: { fontSize: 15, color: SLATE } }], { x: x + 1.65, y: y + 0.2, w: 4.0, h: 1.65, valign: "middle" });
  });

  // 8. Thank you / see you
  s = dark(`[Prathap & Divya] Thank you once more to all our speakers, to our volunteers, to our team Sujith and Lingaraj and to every one of you who joined today. Don't forget to claim your Agent Universe 2026 stamp. We'll see you at the next Innovation Tech Community event. Until then: learn together, build together, grow together. Bye for now!`);
  T(s, "See you at the next event!", { x: 0.7, y: 1.6, w: 7.8, h: 1.9, fontSize: 50, bold: true, color: WHITE, fontFace: H, valign: "bottom" });
  T(s, "Learn together. Build together. Grow together.", { x: 0.7, y: 3.65, w: 7.8, h: 0.55, fontSize: 22, italic: true, color: PINK });
  [["passport", "Claim your Agent Universe 2026 stamp"], ["play", `Recordings: ${YT}`], ["globe", SITE]].forEach(([ic, t], i) => {
    const y = 4.5 + i * 0.62; icon(s, ic, 0.7, y, 0.46, CYCLE[i]);
    T(s, t, { x: 1.35, y, w: 7.2, h: 0.46, fontSize: 17, color: WHITE, valign: "middle" });
  });
  [["prathap-reddy", "Prathap Reddy"], ["divya-akula", "Divya Akula"]].forEach(([ph, name], i) => {
    const x = 8.75 + i * 2.1;
    s.addImage({ path: IMG(`ph-${ph}.png`), x, y: 1.7, w: 1.9, h: 1.9 });
    T(s, name, { x: x - 0.1, y: 3.68, w: 2.1, h: 0.4, fontSize: 15, bold: true, color: WHITE, align: "center" });
  });
  T(s, "YOUR HOSTS", { x: 8.75, y: 1.2, w: 4, h: 0.35, fontSize: 12, bold: true, color: LAV2, charSpacing: 4, align: "center" });
  s.addImage({ path: A("cat-smile.png"), x: 10.4, y: 4.45, w: 2.3, h: 2.3 });
  T(s, [{ text: "Sincerely, Innovation Tech Community Team", options: { bold: true, color: WHITE, breakLine: true } }, { text: TEAM.join("  ·  "), options: { color: LAV2 } }], { x: 0.7, y: 6.45, w: 9.5, h: 0.75, fontSize: 14, valign: "top" });

  const out = path.join(__dirname, "..", "slides", "agent-universe-2026-closing.pptx");
  await pres.writeFile({ fileName: out });
  await applyTheme(out);
  console.log("wrote", out, n, "slides");
})();
