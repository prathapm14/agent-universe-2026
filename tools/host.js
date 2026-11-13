// Builds slides/agent-universe-2026-host-deck.pptx: welcome, hosts, agenda and one intro slide per session (intro script and host in the speaker notes).
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const { THEME, applyTheme } = require("./theme");
const SPEAKERS = require("./speakers");
const CACHE = path.join(__dirname, ".cache");
const data = JSON.parse(fs.readFileSync(path.join(CACHE, "data.json"), "utf8"));
const IMG = (f) => path.join(CACHE, "img", f), A = (f) => path.join(CACHE, "assets", f);
const time = (d) => new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(d)).toUpperCase();
const span = (s) => `${time(s.start)} – ${time(new Date(new Date(s.start).getTime() + s.minutes * 60000))}`;

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "Agent Universe 2026 · Host deck"; pres.author = "Innovation Tech Community"; pres.company = "Innovation Tech Community";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const footer = [
    { text: { text: "Agent Universe 2026  ·  #AgentUniverse2026", options: { x: 0.6, y: 6.95, w: 7, h: 0.35, fontSize: 10, color: C.accent5, margin: 0 } } },
    { image: { path: A("itc-logo.png"), x: 12.25, y: 6.82, w: 0.48, h: 0.48 } },
  ];
  const num = { x: 11.55, y: 6.95, w: 0.5, h: 0.35, fontSize: 10, color: C.accent5 };
  pres.defineSlideMaster({ title: "Dark title", background: { path: IMG("bg-dark.png") }, objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 2.0, w: 6.9, h: 1.9, fontSize: 44, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 4.1, w: 6.9, h: 1.5, fontSize: 18, color: C.background2, valign: "top", align: "left", margin: 0 }, text: "" } },
  ] });
  pres.defineSlideMaster({ title: "Content", background: { path: IMG("bg-light.png") }, slideNumber: num, objects: [
    ...footer, { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.45, w: 11, h: 0.85, fontSize: 32, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
  ] });
  pres.defineSlideMaster({ title: "Speaker intro", background: { path: IMG("bg-light.png") }, slideNumber: num, objects: [...footer] });

  const sessions = data.sessions;
  if (sessions.length !== SPEAKERS.length) throw new Error(`speakers.js has ${SPEAKERS.length} entries but there are ${sessions.length} sessions`);
  // Intros follow the schedule order, matched by the first speaker's first name.
  const key = (name) => name.trim().split(/\s+/)[0].toLowerCase();
  const ordered = sessions.map((session) => {
    const intro = SPEAKERS.find((x) => key(x.people[0].name) === key(session.speakers[0].name));
    if (!intro) throw new Error(`No intro in speakers.js for ${session.speakers[0].name}`);
    return intro;
  });
  const people = SPEAKERS.reduce((n, x) => n + x.people.length, 0);
  const mvps = SPEAKERS.flatMap((x) => x.people).filter((p) => p.chips.some((c) => c.includes("MVP"))).length;
  const dayStart = time(data.event.starts_at), dayEnd = time(data.event.ends_at);

  pres.addSection({ title: "Opening" });
  let s = pres.addSlide({ masterName: "Dark title", sectionTitle: "Opening" });
  s.addText("WELCOME TO", { x: 0.7, y: 1.45, w: 6, h: 0.4, fontSize: 16, bold: true, color: C.background2, charSpacing: 6, margin: 0, isTextBox: true, objectName: "Kicker" });
  s.addText("Agent Universe 2026", { placeholder: "title" });
  s.addText([{ text: `Saturday, 14 November 2026  ·  ${dayStart} – ${dayEnd} IST`, options: { breakLine: true } }, { text: "Hosted by Prathap Reddy & Divya Akula  ·  Live on YouTube & LinkedIn" }], { placeholder: "body" });
  s.addImage({ path: A("poster.png"), x: 7.95, y: 1.85, w: 4.8, h: 2.7, objectName: "Event poster" });
  s.addNotes(`[Prathap & Divya] Welcome everyone to Agent Universe 2026! Introduce yourselves as today's hosts, thank everyone for joining live on YouTube and LinkedIn, and set the tone: a full day of practical sessions from ${people} speakers, ${mvps} of them Microsoft MVPs.`);

  s = pres.addSlide({ masterName: "Content", sectionTitle: "Opening" });
  s.addText("About Innovation Tech Community", { placeholder: "title" });
  s.addText("Learn together. Build together. Grow together.", { x: 0.6, y: 1.5, w: 7.6, h: 0.6, fontSize: 22, italic: true, color: C.accent2, margin: 0, isTextBox: true });
  s.addText([
    { text: "An open, independent community for technology enthusiasts, started in Bengaluru", options: { bullet: true, breakLine: true } },
    { text: "Meetups, workshops and summits, online and in person", options: { bullet: true, breakLine: true } },
    { text: "A stage for first-time and experienced speakers alike", options: { bullet: true, breakLine: true } },
    { text: "Your own learning passport with badges and stamps", options: { bullet: true } }],
    { x: 0.6, y: 2.3, w: 7.4, h: 2.2, fontSize: 18, color: C.text1, paraSpaceAfter: 8, valign: "top", margin: 0, isTextBox: true });
  s.addText("FOUNDED BY", { x: 0.6, y: 4.75, w: 4, h: 0.35, fontSize: 12, bold: true, color: C.accent5, charSpacing: 4, margin: 0, isTextBox: true });
  ["Prathap Reddy", "Divya Akula", "Sujith Sukumaran", "Lingaraj Benni"].forEach((name, i) => {
    const x = 0.6 + i * 1.9;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.2, w: 1.75, h: 0.6, rectRadius: 0.3, fill: { color: C.background2 }, line: { type: "none" }, objectName: `Founder ${i + 1}` });
    s.addText(name, { x, y: 5.2, w: 1.75, h: 0.6, fontSize: 13, bold: true, color: C.text2, align: "center", valign: "middle", margin: 0, isTextBox: true });
  });
  s.addImage({ path: A("cat-wave.png"), x: 8.9, y: 1.4, w: 3.8, h: 3.8, objectName: "ITC Cat mascot" });
  s.addText("Say hi to ITC Cat, our mascot! 🐾", { x: 8.6, y: 5.35, w: 4.4, h: 0.5, fontSize: 14, color: C.accent5, align: "center", margin: 0, isTextBox: true });
  s.addNotes(`[Prathap · about 2 minutes] Before we meet our speakers, a few words about who we are.

Innovation Tech Community, or ITC, is an open and independent community for technology enthusiasts that started in Bengaluru. Our motto is simple: learn together, build together, grow together.

We run meetups, hands-on workshops and summits, both online and in person, and we give a stage to first-time speakers as well as experienced experts. Agent Universe 2026 is our global, virtual day on Agentic AI.

ITC was founded by Prathap Reddy, Divya Akula, Sujith Sukumaran and Lingaraj Benni, and it runs on the energy of our volunteers, speakers and members.

Every member gets a Learning Passport on innovationtechcommunity.com, where you collect a stamp for every ITC event you join. If you registered for today, your Agent Universe 2026 stamp is waiting for you; we'll show you how to claim it at the end.

And meet ITC Cat, our mascot! Follow us and join the community at innovationtechcommunity.com.`);
  s = pres.addSlide({ masterName: "Content", sectionTitle: "Opening" });
  s.addText("Your hosts today", { placeholder: "title" });
  [["prathap-reddy", "Prathap Reddy", "Founder, Innovation Tech Community", "Microsoft AI MVP · AI Engineer, Sulava Mea"],
   ["divya-akula", "Divya Akula", "Co-founder, Innovation Tech Community", "Microsoft MVP (Copilot Studio) · Responsible AI Architect"]].forEach(([photo, name, role, line], i) => {
    const x = 0.9 + i * 6.1;
    s.addImage({ path: IMG(`ph-${photo}.png`), x, y: 1.7, w: 2.6, h: 2.6, objectName: `${name} photo` });
    s.addText(name, { x: x + 2.85, y: 2.1, w: 3.1, h: 0.6, fontSize: 26, bold: true, color: C.text1, fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
    s.addText(role, { x: x + 2.85, y: 2.75, w: 3.1, h: 0.7, fontSize: 15, bold: true, color: C.accent2, valign: "top", margin: 0, isTextBox: true });
    s.addText(line, { x: x + 2.85, y: 3.45, w: 3.1, h: 0.8, fontSize: 14, color: C.accent5, valign: "top", margin: 0, isTextBox: true });
  });
  s.addText("We take turns introducing every speaker, read your questions from the chat and keep the day on time.", { x: 0.9, y: 5.0, w: 11.5, h: 0.6, fontSize: 18, color: C.text1, align: "center", margin: 0, isTextBox: true });
  s.addNotes("[Prathap & Divya] Say a quick hello each, and explain how the day works: 35-minute sessions (30 minutes plus 5 minutes of Q&A), questions in the chat, and you'll take turns introducing the speakers.");

  s = pres.addSlide({ masterName: "Content", sectionTitle: "Opening" });
  s.addText("Before we begin", { placeholder: "title" });
  [["chat", "Ask in the chat", "Drop your questions any time. Speakers take questions at the end of each session."],
   ["hashtag", "Share the day", "Post your takeaways with #AgentUniverse2026 and tag Innovation Tech Community."],
   ["passport", "Claim your stamp", "Registered? Sign in at innovationtechcommunity.com and claim your passport stamp."],
   ["play", "Watch it again", "Every session stays on our YouTube channel, so you can catch up later."]].forEach(([icon, head, copy], i) => {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.75, w: 2.85, h: 4.2, rectRadius: 0.15, fill: { color: C.background1 }, line: { color: C.background2, width: 1 },
      shadow: { type: "outer", color: "1E2A78", opacity: 0.12, blur: 12, offset: 3, angle: 90 }, objectName: `Tip card ${i + 1}` });
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: 2.1, w: 0.9, h: 0.9, fill: { color: [C.accent1, C.accent2, C.accent3, C.accent4][i] }, line: { type: "none" }, objectName: `Tip icon circle ${i + 1}` });
    s.addImage({ path: IMG(`ic-${icon}-w.png`), x: x + 0.52, y: 2.32, w: 0.46, h: 0.46, objectName: `Tip icon ${i + 1}` });
    s.addText(head, { x: x + 0.3, y: 3.25, w: 2.3, h: 0.5, fontSize: 20, bold: true, color: C.text1, fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
    s.addText(copy, { x: x + 0.3, y: 3.85, w: 2.3, h: 1.8, fontSize: 15, color: C.accent5, valign: "top", margin: 0, isTextBox: true });
  });
  s.addNotes("Quick housekeeping: questions in the chat, share with #AgentUniverse2026, registered attendees can claim their passport stamp, and every session will be on YouTube afterwards.");

  s = pres.addSlide({ masterName: "Content", sectionTitle: "Opening" });
  s.addText("Today at a glance", { placeholder: "title" });
  [[String(sessions.length), "sessions", C.accent1], [String(people), "speakers", C.accent2], [String(mvps), "Microsoft MVPs", C.accent3], ["1", "day of Agentic AI", C.accent4]].forEach(([value, label, color], i) => {
    const x = 0.6 + i * 3.08;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.0, w: 2.85, h: 3.2, rectRadius: 0.15, fill: { color: C.background2 }, line: { type: "none" }, objectName: `Stat ${i + 1}` });
    s.addText(value, { x, y: 2.45, w: 2.85, h: 1.4, fontSize: 72, bold: true, color, align: "center", fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
    s.addText(label, { x, y: 3.95, w: 2.85, h: 0.6, fontSize: 18, color: C.text1, align: "center", margin: 0, isTextBox: true });
  });
  s.addText("Talks and live demos across Microsoft Foundry, Foundry IQ, Copilot Studio, Agent Framework, MCP, RAG evaluation, agent security and multi-agent systems.", { x: 0.6, y: 5.6, w: 12.1, h: 0.6, fontSize: 16, color: C.accent5, margin: 0, isTextBox: true });

  s = pres.addSlide({ masterName: "Content", sectionTitle: "Opening" });
  s.addText("Agenda  ·  All times IST", { placeholder: "title" });
  const head = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 } } });
  const rows = [[head("Time"), head("Speaker"), head("Session")], ...sessions.map((x, i) => [span(x), ordered[i].people.map((p) => p.name).join(" & "), x.title]
    .map((t) => ({ text: t, options: { fill: { color: i % 2 ? C.background1 : C.background2 } } })))];
  s.addTable(rows, { x: 0.6, y: 1.4, w: 12.1, colW: [2.1, 3.3, 6.7], rowH: 0.36, fontSize: 11, color: C.text1, fontFace: THEME.bodyFontFace, valign: "middle", border: { type: "solid", pt: 0.5, color: "E4E0F7" }, margin: [0.02, 0.1, 0.02, 0.1] });
  s.addNotes("Walk through the day quickly. Every session is 35 minutes: 30 minutes plus 5 minutes of Q&A. Encourage people to stay for the whole day and to add the stream to their calendar.");

  pres.addSection({ title: "Speakers" });
  sessions.forEach((session, i) => {
    const intro = ordered[i];
    s = pres.addSlide({ masterName: "Speaker intro", sectionTitle: "Speakers" });
    const pair = intro.people.length > 1;
    if (pair) {
      s.addImage({ path: IMG(`ph-${intro.people[0].photo}.png`), x: 0.55, y: 1.0, w: 2.75, h: 2.75, objectName: `${intro.people[0].name} photo` });
      s.addImage({ path: IMG(`ph-${intro.people[1].photo}.png`), x: 1.95, y: 3.55, w: 2.75, h: 2.75, objectName: `${intro.people[1].name} photo` });
    } else s.addImage({ path: IMG(`ph-${intro.people[0].photo}.png`), x: 0.7, y: 1.35, w: 3.9, h: 3.9, objectName: `${intro.people[0].name} photo` });
    const X = 5.25, W = 7.5;
    s.addText(`UP NEXT  ·  ${span(session)} IST`, { x: X, y: 0.55, w: W, h: 0.4, fontSize: 14, bold: true, color: C.accent2, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText(intro.people.map((p) => p.name).join(" & "), { x: X, y: 0.98, w: W, h: 0.8, fontSize: pair ? 30 : 38, bold: true, color: C.text1, fontFace: THEME.headFontFace, valign: "middle", margin: 0, isTextBox: true, fit: "shrink" });
    s.addText(intro.people.map((p) => p.line).join("\n"), { x: X, y: 1.82, w: W, h: pair ? 0.7 : 0.4, fontSize: 15, color: C.accent5, valign: "top", margin: 0, isTextBox: true });
    let cx = X; const chipY = pair ? 2.62 : 2.35;
    [...new Set(intro.people.flatMap((p) => p.chips))].forEach((chip) => {
      const w = 0.35 + chip.length * 0.105;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx, y: chipY, w, h: 0.38, rectRadius: 0.19, fill: { color: C.accent2 }, line: { type: "none" }, objectName: `Chip ${chip}` });
      s.addText(chip, { x: cx, y: chipY, w, h: 0.38, fontSize: 12, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true });
      cx += w + 0.15;
    });
    const cardY = chipY + 0.62;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: X, y: cardY, w: W, h: 1.85, rectRadius: 0.12, fill: { color: C.background2 }, line: { type: "none" }, objectName: "Session card" });
    s.addImage({ path: IMG("ic-mic-v.png"), x: X + 0.25, y: cardY + 0.25, w: 0.32, h: 0.32, objectName: "Session icon" });
    s.addText("SESSION", { x: X + 0.7, y: cardY + 0.22, w: 3, h: 0.38, fontSize: 12, bold: true, color: C.accent2, charSpacing: 3, valign: "middle", margin: 0, isTextBox: true });
    s.addText(session.title, { x: X + 0.25, y: cardY + 0.62, w: W - 0.5, h: 0.75, fontSize: 18, bold: true, color: C.text2, valign: "top", margin: 0, isTextBox: true, fit: "shrink" });
    s.addText(`${session.format === "Demo" ? "Live demo" : "Talk"}  ·  ${session.level}  ·  ${session.minutes} minutes`, { x: X + 0.25, y: cardY + 1.42, w: W - 0.5, h: 0.3, fontSize: 13, color: C.accent5, margin: 0, isTextBox: true });
    const hy = cardY + 2.1;
    s.addText(intro.highlights.slice(0, pair ? 4 : 3).map((t, k, all) => ({ text: t, options: { bullet: true, breakLine: k < all.length - 1 } })),
      { x: X, y: hy, w: W, h: 6.7 - hy, fontSize: 14, color: C.text1, paraSpaceAfter: 6, valign: "top", margin: 0, isTextBox: true, fit: "shrink" });
    const clean = (t) => (t || "").replace(/\r/g, "").trim();
    const reminder = [3, 6, 9].includes(i) ? `\n\n[Quick reminder before the intro] Registered for Agent Universe 2026? Sign in at innovationtechcommunity.com with the same email you registered with, open your Passport and claim your Agent Universe 2026 stamp.` : "";
    s.addNotes(`[About 2 minutes · Host: ${intro.host}]${reminder}\n\nINTRO SCRIPT\n${intro.script}\n\n────────\nFULL BIO (${intro.people.map((p) => p.name).join(" & ")})\n${clean(session.bio)}\n\n────────\nSESSION: ${session.title}\n${clean(session.summary)}\n\n${clean(session.abstract)}\n\n────────\nAFTER THE SESSION: thank the speaker, read 1-2 questions from the chat, and hand over to the next host.`);
  });

  pres.addSection({ title: "Closing" });
  s = pres.addSlide({ masterName: "Content", sectionTitle: "Closing" });
  s.addText("Claim your Agent Universe 2026 stamp", { placeholder: "title" });
  s.addText("Every registered attendee gets the Agent Universe 2026 stamp in their ITC Learning Passport.", { x: 0.6, y: 1.45, w: 12.1, h: 0.5, fontSize: 18, color: C.accent5, margin: 0, isTextBox: true });
  [["globe", "Sign in", "Go to innovationtechcommunity.com and sign in with Google or GitHub, using the same email you registered with."],
   ["passport", "Open your Passport", "Click Passport on the website and tap the cover to open your Learning Passport."],
   ["bulb", "Claim your stamp", "You'll see \"You're registered! Claim your attendee stamp.\" Click Claim, and the stamp is yours."]].forEach(([icon, head, copy], i) => {
    const x = 0.6 + i * 4.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.2, w: 3.85, h: 3.5, rectRadius: 0.15, fill: { color: C.background2 }, line: { type: "none" }, objectName: `Claim step ${i + 1}` });
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: 2.5, w: 0.95, h: 0.95, fill: { color: [C.accent1, C.accent2, C.accent3][i] }, line: { type: "none" }, objectName: `Claim icon circle ${i + 1}` });
    s.addImage({ path: IMG(`ic-${icon}-w.png`), x: x + 0.59, y: 2.74, w: 0.47, h: 0.47, objectName: `Claim icon ${i + 1}` });
    s.addText(`${i + 1}. ${head}`, { x: x + 0.35, y: 3.65, w: 3.2, h: 0.55, fontSize: 22, bold: true, color: C.text1, fontFace: THEME.headFontFace, margin: 0, isTextBox: true });
    s.addText(copy, { x: x + 0.35, y: 4.25, w: 3.2, h: 1.35, fontSize: 15, color: C.text1, valign: "top", margin: 0, isTextBox: true });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 5.95, w: 12.1, h: 0.7, rectRadius: 0.12, fill: { color: C.text2 }, line: { type: "none" }, objectName: "Claim banner" });
  s.addText("innovationtechcommunity.com  ·  Passport  ·  Claim  ·  Speakers get their speaker stamp automatically", { x: 0.6, y: 5.95, w: 12.1, h: 0.7, fontSize: 17, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true });
  s.addNotes(`[Divya · about 1 minute] Before we close: everyone who registered for Agent Universe 2026 can claim the Agent Universe 2026 stamp in their ITC Learning Passport.

Step 1: go to innovationtechcommunity.com and sign in with Google or GitHub. Use the same email address you registered with; that is how the site knows you registered.
Step 2: click Passport on the website and tap the cover to open it.
Step 3: you'll see "You're registered! Claim your attendee stamp." Click Claim.

Speakers: your speaker stamp is added automatically. Please claim your stamp today and share your passport on LinkedIn with #AgentUniverse2026!`);
  s = pres.addSlide({ masterName: "Dark title", sectionTitle: "Closing" });
  s.addText("Thank you!", { placeholder: "title" });
  s.addText([{ text: "Claim your passport stamp at innovationtechcommunity.com", options: { breakLine: true } }, { text: "Recordings: youtube.com/@innovationtechcommunity", options: { breakLine: true } },
    { text: "Hosted by Prathap Reddy & Divya Akula · innovationtechcommunity.com" }], { placeholder: "body" });
  s.addImage({ path: A("cat-smile.png"), x: 8.6, y: 1.5, w: 3.9, h: 3.9, objectName: "ITC Cat thumbs up" });
  s.addNotes("[Prathap & Divya] Thank every speaker by name, the audience and the volunteers. Remind every registrant once more to claim the Agent Universe 2026 stamp in their Learning Passport (sign in with the registration email → Passport → Claim), that recordings are on YouTube, and invite everyone to join the community at innovationtechcommunity.com for the next event.");

  const out = path.join(__dirname, "..", "slides", "agent-universe-2026-host-deck.pptx");
  await pres.writeFile({ fileName: out });
  await applyTheme(out);
  console.log(`wrote ${path.relative(path.join(__dirname, ".."), out)}: ${sessions.length} sessions, ${people} speakers, ${mvps} MVPs, ${dayStart}–${dayEnd}`);
})();
