// Builds slides/prathap-reddy-from-idea-to-agent.pptx: Prathap's 20-slide session deck in the Agent Universe theme.
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const fa = require("react-icons/fa");
const { THEME, applyTheme } = require("./theme");
const CACHE = path.join(__dirname, ".cache");
const IMG = (f) => path.join(CACHE, "img", f), A = (f) => path.join(CACHE, "assets", f);
const NAVY = "14154A", INK = "1E2A78", BLUE = "2563EB", VIOLET = "7C3AED", MAGENTA = "C026D3", SKY = "0EA5E9", SLATE = "5B6385", AMBER = "F59E0B", LAV = "F4F2FF", LAV2 = "C7C9FF", WHITE = "FFFFFF";
const CYCLE = [BLUE, VIOLET, MAGENTA, SKY, AMBER, "10B981"];
const H = THEME.headFontFace, B = THEME.bodyFontFace;

const ICONS = { robot: fa.FaRobot, brain: fa.FaBrain, list: fa.FaClipboardList, book: fa.FaBook, tools: fa.FaTools, sitemap: fa.FaSitemap, history: fa.FaHistory,
  comments: fa.FaComments, users: fa.FaUsers, cloud: fa.FaCloud, database: fa.FaDatabase, plug: fa.FaPlug, shield: fa.FaShieldAlt, chart: fa.FaChartLine,
  eye: fa.FaEye, lock: fa.FaLock, coins: fa.FaCoins, check: fa.FaCheckCircle, bulb: fa.FaLightbulb, rocket: fa.FaRocket, layers: fa.FaLayerGroup,
  search: fa.FaSearch, cogs: fa.FaCogs, play: fa.FaPlay, user: fa.FaUserTie, ticket: fa.FaTicketAlt, bolt: fa.FaBolt, code: fa.FaCode, globe: fa.FaGlobe, passport: fa.FaPassport, file: fa.FaFileAlt, sharepoint: fa.FaFolderOpen };

async function icons() {
  for (const [name, Icon] of Object.entries(ICONS)) {
    const f = IMG(`pr-${name}.png`);
    if (!fs.existsSync(f)) await sharp(Buffer.from(renderToStaticMarkup(React.createElement(Icon, { size: 256, color: "#FFFFFF" })))).resize(256, 256).png().toFile(f);
  }
  const bar = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="24"><defs><linearGradient id="g"><stop offset="0" stop-color="#2563EB"/><stop offset=".5" stop-color="#7C3AED"/><stop offset="1" stop-color="#C026D3"/></linearGradient></defs><rect width="1200" height="24" rx="12" fill="url(#g)"/></svg>`;
  await sharp(Buffer.from(bar)).png().toFile(IMG("pr-bar.png"));
}

(async () => {
  await icons();
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title = "From Idea to Agent · Prathap Reddy · Agent Universe 2026"; pres.author = "Prathap Reddy"; pres.company = "Innovation Tech Community";
  pres.theme = { headFontFace: H, bodyFontFace: B };
  let n = 0;
  const T = (s, text, o) => s.addText(text, { fontFace: B, margin: 0, isTextBox: true, ...o });
  const icon = (s, name, x, y, d, color) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { type: "none" } });
    s.addImage({ path: IMG(`pr-${name}.png`), x: x + d * 0.25, y: y + d * 0.25, w: d * 0.5, h: d * 0.5 });
  };
  const card = (s, x, y, w, h, fill = LAV) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { type: "none" } });
  const dark = (notes) => {
    n++; const s = pres.addSlide(); s.background = { path: IMG("bg-dark.png") };
    s.addImage({ path: A("itc-logo.png"), x: 0.7, y: 0.45, w: 0.6, h: 0.6 });
    T(s, "AGENT UNIVERSE 2026  ·  #AgentUniverse2026", { x: 1.45, y: 0.55, w: 7, h: 0.4, fontSize: 12, bold: true, color: LAV2, charSpacing: 4 });
    if (notes) s.addNotes(notes); return s;
  };
  const light = (title, notes, kick) => {
    n++; const s = pres.addSlide(); s.background = { path: IMG("bg-light.png") };
    if (kick) T(s, kick.toUpperCase(), { x: 0.6, y: 0.3, w: 9, h: 0.35, fontSize: 12, bold: true, color: VIOLET, charSpacing: 4 });
    T(s, title, { x: 0.6, y: 0.62, w: 11.6, h: 0.8, fontSize: 32, bold: true, color: INK, fontFace: H, valign: "middle" });
    s.addImage({ path: IMG("pr-bar.png"), x: 0.6, y: 1.45, w: 1.6, h: 0.08 });
    T(s, "From Idea to Agent  ·  Prathap Reddy  ·  Agent Universe 2026", { x: 0.6, y: 6.98, w: 8, h: 0.3, fontSize: 10, color: SLATE });
    T(s, String(n), { x: 11.5, y: 6.98, w: 0.5, h: 0.3, fontSize: 10, color: SLATE, align: "right" });
    s.addImage({ path: A("itc-logo.png"), x: 12.25, y: 6.82, w: 0.48, h: 0.48 });
    if (notes) s.addNotes(notes); return s;
  };
  const section = (num, title, sub, notes) => {
    const s = dark(notes);
    T(s, num, { x: 0.7, y: 1.7, w: 4, h: 1.4, fontSize: 80, bold: true, color: LAV2, fontFace: H, valign: "bottom" });
    T(s, title, { x: 0.7, y: 3.2, w: 11, h: 1.2, fontSize: 46, bold: true, color: WHITE, fontFace: H });
    s.addImage({ path: IMG("pr-bar.png"), x: 0.7, y: 4.5, w: 2.2, h: 0.1 });
    T(s, sub, { x: 0.7, y: 4.8, w: 10, h: 0.8, fontSize: 22, color: LAV2 });
    return s;
  };

  // 1. Title
  let s = dark("Keep this on screen while Divya introduces me. Open: \"Good morning everyone, and welcome to Agent Universe 2026! Let's start the day by going from an idea to a working enterprise agent.\"");
  T(s, "9:00 AM IST  ·  SATURDAY, 14 NOVEMBER 2026", { x: 0.7, y: 1.35, w: 8, h: 0.4, fontSize: 14, bold: true, color: "F0ABFC", charSpacing: 3 });
  T(s, "From Idea to Agent", { x: 0.7, y: 1.85, w: 8, h: 1.2, fontSize: 54, bold: true, color: WHITE, fontFace: H });
  T(s, "Building Enterprise AI Agents with Microsoft Foundry and Copilot Studio", { x: 0.7, y: 3.05, w: 7.6, h: 1.1, fontSize: 24, color: LAV2 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 4.35, w: 3.3, h: 0.45, rectRadius: 0.22, fill: { color: MAGENTA }, line: { type: "none" } });
  T(s, "LIVE DEMO  ·  INTERMEDIATE", { x: 0.7, y: 4.35, w: 3.3, h: 0.45, fontSize: 13, bold: true, color: WHITE, align: "center", valign: "middle", charSpacing: 2 });
  T(s, [{ text: "Prathap Reddy", options: { bold: true, fontSize: 26, color: WHITE, breakLine: true } }, { text: "Microsoft AI MVP  ·  AI Engineer, Sulava Mea", options: { fontSize: 17, color: LAV2, breakLine: true } },
    { text: "Founder, Innovation Tech Community", options: { fontSize: 17, color: LAV2 } }], { x: 0.7, y: 5.1, w: 7.5, h: 1.4, valign: "top" });
  s.addImage({ path: IMG("ph-prathap-reddy.png"), x: 8.75, y: 1.55, w: 3.9, h: 3.9 });
  T(s, "Hosted by Prathap Reddy & Divya Akula  ·  innovationtechcommunity.com", { x: 7.2, y: 6.9, w: 5.6, h: 0.35, fontSize: 11, color: LAV2, align: "right" });

  // 2. About me
  s = light("About me", "Keep this to 30 seconds; Divya has already introduced me.", "Your speaker");
  s.addImage({ path: IMG("ph-prathap-reddy.png"), x: 0.7, y: 1.9, w: 3.6, h: 3.6 });
  T(s, "Prathap Reddy", { x: 0.7, y: 5.65, w: 3.6, h: 0.5, fontSize: 22, bold: true, color: INK, align: "center", fontFace: H });
  T(s, "Microsoft AI MVP", { x: 0.7, y: 6.15, w: 3.6, h: 0.4, fontSize: 15, color: VIOLET, bold: true, align: "center" });
  [["user", "AI Engineer & Agentic AI Consultant at Sulava Mea"], ["brain", "Builds with Microsoft Foundry, Azure OpenAI, Copilot Studio and Microsoft 365 Copilot"],
   ["sitemap", "Focus: multi-agent systems, RAG, enterprise knowledge and intelligent automation"], ["shield", "Passionate about secure, responsible, production-ready AI"],
   ["users", "Founder of Innovation Tech Community: learn together, build together, grow together"]].forEach(([ic, t], i) => {
    const y = 1.9 + i * 0.95; icon(s, ic, 5.0, y, 0.7, CYCLE[i]);
    T(s, t, { x: 5.95, y, w: 6.8, h: 0.7, fontSize: 19, color: INK, valign: "middle" });
  });

  // 3. Agenda
  s = light("What we'll cover", "Six stops in 30 minutes, with the demo at the heart of it. Questions at the end, from the chat.", "Agenda");
  ["Why AI agents, now", "Copilot Studio and Microsoft Foundry", "Better together: the architecture", "From use case to agent: six steps", "Live demo", "Production checklist and takeaways"].forEach((t, i) => {
    const x = 0.7 + (i % 2) * 6.1, y = 1.95 + Math.floor(i / 2) * 1.55;
    card(s, x, y, 5.8, 1.25, WHITE);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 5.8, h: 1.25, rectRadius: 0.12, fill: { type: "none" }, line: { color: "E4E0FB", width: 1 } });
    s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: y + 0.2, w: 0.85, h: 0.85, fill: { color: CYCLE[i] }, line: { type: "none" } });
    T(s, String(i + 1).padStart(2, "0"), { x: x + 0.25, y: y + 0.2, w: 0.85, h: 0.85, fontSize: 22, bold: true, color: WHITE, align: "center", valign: "middle" });
    T(s, t, { x: x + 1.35, y, w: 4.3, h: 1.25, fontSize: 21, bold: true, color: INK, valign: "middle" });
  });

  // 4. Section
  section("01", "Why AI agents, now", "From answering questions to getting work done", "AI is moving from chat to action. Let's see what that means for enterprises.");

  // 5. Chatbot to agent
  s = light("From chatbots to agents", "Walk left to right. The key shift: agents work toward a goal; they reason, use tools and take actions, with people staying in control.", "The shift");
  [["comments", "Chatbot", "Scripted answers", "Follows fixed paths and decision trees. Breaks when users go off-script."],
   ["bulb", "Copilot", "Helps a person", "Answers, summarises and drafts with generative AI, while the person drives every step."],
   ["robot", "AI agent", "Works toward a goal", "Reasons, plans, uses tools and takes actions across systems, with a human in the loop."]].forEach(([ic, h, k, t], i) => {
    const x = 0.7 + i * 4.15;
    card(s, x, 1.95, 3.7, 3.9, i === 2 ? NAVY : LAV);
    icon(s, ic, x + 0.35, 2.25, 0.95, [SKY, VIOLET, MAGENTA][i]);
    T(s, h, { x: x + 0.35, y: 3.35, w: 3.1, h: 0.55, fontSize: 26, bold: true, color: i === 2 ? WHITE : INK, fontFace: H });
    T(s, k, { x: x + 0.35, y: 3.9, w: 3.1, h: 0.4, fontSize: 17, bold: true, color: i === 2 ? "F0ABFC" : VIOLET });
    T(s, t, { x: x + 0.35, y: 4.35, w: 3.1, h: 1.4, fontSize: 16, color: i === 2 ? LAV2 : INK, valign: "top" });
    if (i < 2) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + 3.75, y: 3.65, w: 0.35, h: 0.45, fill: { color: VIOLET }, line: { type: "none" } });
  });
  T(s, [{ text: "Agent  =  ", options: { bold: true, color: VIOLET } }, { text: "model + instructions + knowledge + tools, working toward a goal", options: { color: INK } }], { x: 0.7, y: 6.1, w: 12, h: 0.55, fontSize: 20, align: "center" });

  // 6. Anatomy
  s = light("The anatomy of an AI agent", "Every agent, in any platform, has these six building blocks. We'll see where each one lives in Copilot Studio and Foundry.", "Building blocks");
  [["brain", "Model", "Understands, reasons and generates language"], ["list", "Instructions", "Role, goal, tone and guardrails"], ["book", "Knowledge", "Grounded in your enterprise data"],
   ["tools", "Tools & actions", "Calls APIs, connectors and workflows"], ["sitemap", "Orchestration", "Plans the steps and picks the right tool"], ["history", "Memory & context", "Keeps track of the conversation and the user"]].forEach(([ic, h, t], i) => {
    const x = 0.7 + (i % 3) * 4.1, y = 1.9 + Math.floor(i / 3) * 2.45;
    card(s, x, y, 3.8, 2.2);
    icon(s, ic, x + 0.3, y + 0.3, 0.85, CYCLE[i]);
    T(s, h, { x: x + 1.35, y: y + 0.3, w: 2.3, h: 0.85, fontSize: 22, bold: true, color: INK, valign: "middle", fontFace: H });
    T(s, t, { x: x + 0.3, y: y + 1.3, w: 3.3, h: 0.75, fontSize: 17, color: INK, valign: "top" });
  });

  // 7. Copilot Studio
  const platform = (title, kick, tag, items, color, notes) => {
    const s = light(title, notes, kick);
    card(s, 0.7, 1.9, 4.2, 4.7, NAVY);
    icon(s, kick === "Low-code" ? "comments" : "layers", 1.05, 2.25, 1.1, color);
    T(s, title, { x: 1.05, y: 3.55, w: 3.6, h: 0.9, fontSize: 28, bold: true, color: WHITE, fontFace: H });
    T(s, tag, { x: 1.05, y: 4.5, w: 3.6, h: 1.9, fontSize: 18, color: LAV2, valign: "top" });
    items.forEach(([ic, h, t], i) => {
      const x = 5.2 + (i % 2) * 3.8, y = 1.9 + Math.floor(i / 2) * 1.6;
      icon(s, ic, x, y + 0.1, 0.7, CYCLE[i]);
      T(s, [{ text: h, options: { bold: true, fontSize: 18, color: INK, breakLine: true } }, { text: t, options: { fontSize: 15, color: SLATE } }], { x: x + 0.85, y, w: 2.85, h: 1.4, valign: "top" });
    });
    return s;
  };
  platform("Microsoft Copilot Studio", "Low-code", "Build, test and publish agents in natural language: built for makers, and extensible for pro developers.", [
    ["comments", "Natural-language authoring", "Describe the agent; refine topics and instructions"], ["book", "Knowledge", "SharePoint, Dataverse, websites and files"],
    ["plug", "Connectors & agent flows", "Power Platform connectors, flows and MCP tools"], ["sitemap", "Generative orchestration", "Picks topics, knowledge, tools and agents"],
    ["globe", "Publish anywhere", "Teams, Microsoft 365 Copilot, websites and more"], ["shield", "Governed", "Power Platform admin center, DLP and environments"]], SKY,
    "Copilot Studio is the fastest way to put an agent in front of users, especially inside Microsoft 365 and Teams.");

  // 8. Foundry
  platform("Microsoft Foundry", "Pro-code", "Build, run and govern AI apps and agents with full control over models, tools and quality.", [
    ["layers", "Model catalog", "OpenAI and many other models to choose from"], ["robot", "Foundry Agent Service", "Hosted agents with instructions, tools and threads"],
    ["search", "Knowledge & search", "Azure AI Search, files and enterprise data"], ["code", "Tools", "Function calling, OpenAPI, code interpreter and MCP"],
    ["chart", "Evaluate & observe", "Evaluations, tracing and monitoring"], ["lock", "Safe & secure", "Content safety, Entra ID and enterprise networking"]], MAGENTA,
    "Foundry is where developers go deep: model choice, custom reasoning, tools in code, evaluations and observability.");

  // 9. Which to use
  s = light("Which one should I use?", "This is not either/or. Most enterprise solutions end up using both, each where it is strongest.", "Compare");
  const rows = [["", "Copilot Studio", "Microsoft Foundry"], ["Who builds", "Makers, business teams and developers", "Pro developers and AI engineers"],
    ["Superpower", "Conversation, channels and fast delivery", "Model choice, custom reasoning and code-first control"],
    ["Data & actions", "Connectors, agent flows, Dataverse", "APIs, Azure services and custom tools"],
    ["Best for", "Employee and customer agents in Microsoft 365", "Complex, specialised and high-scale agents"]];
  s.addTable(rows.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: i === 0 || j === 0, color: i === 0 ? WHITE : j === 0 ? VIOLET : INK, fill: { color: i === 0 ? (j === 1 ? SKY : j === 2 ? MAGENTA : NAVY) : i % 2 ? WHITE : LAV }, fontSize: i === 0 ? 20 : 17, valign: "middle", margin: [4, 10, 4, 10] } }))),
    { x: 0.7, y: 1.9, w: 11.9, colW: [2.5, 4.7, 4.7], rowH: [0.6, 0.85, 0.85, 0.85, 0.85], border: { type: "solid", color: "E4E0FB", pt: 1 }, fontFace: B });
  card(s, 0.7, 6.0, 11.9, 0.65, NAVY);
  T(s, [{ text: "Better together:  ", options: { bold: true, color: "F0ABFC" } }, { text: "Copilot Studio is the front door, and Foundry is the specialist engine room.", options: { color: WHITE } }], { x: 0.9, y: 6.0, w: 11.5, h: 0.65, fontSize: 18, valign: "middle", align: "center" });

  // 10. Architecture
  s = light("Better together: reference architecture", "Users meet the agent where they already work. Copilot Studio handles the conversation and routing; Foundry handles specialist reasoning; both reach enterprise systems securely.", "Architecture");
  const cols = [["users", "Channels", SKY, ["Microsoft Teams", "Microsoft 365 Copilot", "Website & apps"]],
    ["comments", "Copilot Studio", BLUE, ["Conversation & topics", "Generative orchestration", "Connectors & agent flows"]],
    ["robot", "Microsoft Foundry", VIOLET, ["Specialist agents", "Models & reasoning", "Tools & evaluations"]],
    ["database", "Enterprise systems", MAGENTA, ["SharePoint & Dataverse", "SQL, APIs & ERP", "IT and HR systems"]]];
  cols.forEach(([ic, h, c, items], i) => {
    const x = 0.7 + i * 3.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 2.7, h: 3.75, rectRadius: 0.12, fill: { color: WHITE }, line: { color: c, width: 2 } });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 2.7, h: 0.75, rectRadius: 0.12, fill: { color: c }, line: { type: "none" } });
    s.addImage({ path: IMG(`pr-${ic}.png`), x: x + 0.2, y: 2.0, w: 0.45, h: 0.45 });
    T(s, h, { x: x + 0.75, y: 1.85, w: 1.9, h: 0.75, fontSize: 16, bold: true, color: WHITE, valign: "middle" });
    items.forEach((t, k) => { card(s, x + 0.2, 2.85 + k * 0.9, 2.3, 0.72); T(s, t, { x: x + 0.25, y: 2.85 + k * 0.9, w: 2.2, h: 0.72, fontSize: 14, color: INK, align: "center", valign: "middle" }); });
    if (i < 3) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + 2.73, y: 3.5, w: 0.34, h: 0.45, fill: { color: VIOLET }, line: { type: "none" } });
  });
  card(s, 0.7, 5.85, 12.0, 0.8, NAVY);
  s.addImage({ path: IMG("pr-shield.png"), x: 0.95, y: 6.02, w: 0.45, h: 0.45 });
  T(s, [{ text: "Security & governance across every layer:  ", options: { bold: true, color: "F0ABFC" } }, { text: "Microsoft Entra ID · Microsoft Purview · content safety · monitoring", options: { color: WHITE } }], { x: 1.6, y: 5.85, w: 11, h: 0.8, fontSize: 17, valign: "middle" });

  // 11. Section
  section("02", "From idea to agent", "A real scenario, six practical steps", "Now let's make it concrete with one scenario we'll build in the demo.");

  // 12. Scenario
  s = light("Scenario: the Employee Support Agent", "A scenario every organisation recognises. It needs knowledge (policies), actions (tickets) and judgement (when to hand over to a person).", "Use case");
  [["user", "The problem", MAGENTA, ["Employees wait for HR and IT answers", "The same questions arrive again and again", "Tickets are slow to create and track"]],
   ["robot", "The agent", VIOLET, ["Answers policy questions from SharePoint", "Creates and checks IT tickets", "Hands over to a person when needed"]],
   ["rocket", "The outcome", BLUE, ["Answers in seconds, in Teams", "Support teams focus on complex work", "Available around the clock"]]].forEach(([ic, h, c, items], i) => {
    const x = 0.7 + i * 4.1;
    card(s, x, 1.9, 3.8, 4.7);
    icon(s, ic, x + 0.3, 2.2, 0.9, c);
    T(s, h, { x: x + 1.35, y: 2.2, w: 2.3, h: 0.9, fontSize: 24, bold: true, color: INK, valign: "middle", fontFace: H });
    T(s, items.map((t, k) => ({ text: t, options: { bullet: { code: "25CF" }, breakLine: k < items.length - 1, paraSpaceAfter: 12 } })), { x: x + 0.3, y: 3.4, w: 3.3, h: 3.0, fontSize: 18, color: INK, valign: "top" });
  });

  // 13. Six steps
  s = light("Six steps from use case to agent", "This is the repeatable recipe. Every step maps to a feature in Copilot Studio or Foundry.", "The journey");
  s.addShape(pres.shapes.LINE, { x: 1.4, y: 2.75, w: 10.6, h: 0, line: { color: LAV2, width: 3 } });
  [["bulb", "Define", "Pick one clear use case, the users and success measures"], ["book", "Ground", "Connect trusted knowledge sources"], ["bolt", "Act", "Add tools, connectors and flows"],
   ["sitemap", "Orchestrate", "Let the agent plan and route to the right skill"], ["check", "Evaluate", "Test with real questions; measure quality"], ["rocket", "Publish", "Ship to Teams and Microsoft 365 Copilot; monitor"]].forEach(([ic, h, t], i) => {
    const x = 0.75 + i * 2.05;
    icon(s, ic, x + 0.35, 2.05, 1.3, CYCLE[i]);
    T(s, `${i + 1}. ${h}`, { x, y: 3.55, w: 2.0, h: 0.5, fontSize: 20, bold: true, color: INK, align: "center", fontFace: H });
    T(s, t, { x: x + 0.05, y: 4.1, w: 1.9, h: 1.6, fontSize: 15, color: SLATE, align: "center", valign: "top" });
  });
  card(s, 0.7, 5.95, 11.9, 0.7, NAVY);
  T(s, "Start small, ship one valuable scenario, then grow.", { x: 0.7, y: 5.95, w: 11.9, h: 0.7, fontSize: 19, bold: true, color: WHITE, align: "center", valign: "middle" });

  // 14. Grounding
  s = light("Step 2 · Ground the agent in your knowledge", "Grounding is what turns a generic model into your company's agent. Answers should come from your trusted sources, with citations.", "Grounding");
  [["sharepoint", "SharePoint & OneDrive", "Policies, handbooks, how-to guides"], ["database", "Dataverse & business data", "Structured records and tables"], ["globe", "Public websites", "Product docs and public pages"],
   ["file", "Uploaded files", "PDFs, Word and slide decks"], ["search", "Azure AI Search (Foundry)", "Your own indexes at enterprise scale"]].forEach(([ic, h, t], i) => {
    const y = 1.85 + i * 0.95; icon(s, ic, 0.7, y, 0.75, CYCLE[i]);
    T(s, [{ text: h, options: { bold: true, fontSize: 19, color: INK, breakLine: true } }, { text: t, options: { fontSize: 15, color: SLATE } }], { x: 1.65, y, w: 5.2, h: 0.8, valign: "middle" });
  });
  card(s, 7.2, 1.85, 5.4, 4.8, NAVY);
  T(s, "Grounding tips", { x: 7.55, y: 2.1, w: 4.8, h: 0.6, fontSize: 24, bold: true, color: WHITE, fontFace: H });
  T(s, ["Curate: fewer, trusted, current sources", "Respect permissions: users only see what they can access", "Ask for citations in every answer", "Write clear descriptions for each source", "Test with the questions real users ask"].map((t, k, a) =>
    ({ text: t, options: { bullet: { code: "2714" }, breakLine: k < a.length - 1, paraSpaceAfter: 12 } })), { x: 7.55, y: 2.8, w: 4.8, h: 3.7, fontSize: 18, color: LAV2, valign: "top" });

  // 15. Actions
  s = light("Step 3 · Give the agent hands: tools & actions", "Knowledge lets the agent answer; tools let it act. Keep a person in control for anything that changes data.", "Actions");
  [["Copilot Studio", SKY, [["plug", "Power Platform connectors"], ["bolt", "Agent flows"], ["code", "Custom REST / OpenAPI actions"], ["cogs", "MCP servers"]]],
   ["Microsoft Foundry", MAGENTA, [["code", "Function calling"], ["globe", "OpenAPI tools"], ["cogs", "Code interpreter"], ["search", "Azure AI Search & MCP"]]]].forEach(([h, c, items], i) => {
    const x = 0.7 + i * 6.05;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 5.85, h: 3.85, rectRadius: 0.12, fill: { color: WHITE }, line: { color: c, width: 2 } });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.85, w: 5.85, h: 0.7, rectRadius: 0.12, fill: { color: c }, line: { type: "none" } });
    T(s, h, { x: x + 0.3, y: 1.85, w: 5.3, h: 0.7, fontSize: 21, bold: true, color: WHITE, valign: "middle" });
    items.forEach(([ic, t], k) => { const y = 2.8 + k * 0.72; icon(s, ic, x + 0.35, y, 0.55, c); T(s, t, { x: x + 1.1, y, w: 4.5, h: 0.55, fontSize: 18, color: INK, valign: "middle" }); });
  });
  card(s, 0.7, 5.95, 11.9, 0.7, NAVY);
  T(s, [{ text: "Example:  ", options: { bold: true, color: "F0ABFC" } }, { text: "\"My laptop won't start\" → agent flow creates the IT ticket → the agent replies with the ticket number", options: { color: WHITE } }], { x: 0.9, y: 5.95, w: 11.5, h: 0.7, fontSize: 17, valign: "middle", align: "center" });

  // 16. Orchestration
  s = light("Step 4 · Orchestrate: one agent, many skills", "Generative orchestration reads the user's intent and the descriptions of topics, knowledge, tools and connected agents, then decides what to call. Good descriptions are your new prompt engineering.", "Orchestration");
  card(s, 0.7, 3.1, 2.2, 1.5, LAV); icon(s, "user", 1.45, 3.2, 0.7, SKY); T(s, "Employee in Teams", { x: 0.7, y: 3.95, w: 2.2, h: 0.55, fontSize: 15, bold: true, color: INK, align: "center" });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 3.0, y: 3.62, w: 0.55, h: 0.45, fill: { color: VIOLET }, line: { type: "none" } });
  card(s, 3.65, 2.6, 3.0, 2.5, NAVY); icon(s, "sitemap", 4.7, 2.8, 0.9, BLUE);
  T(s, [{ text: "Copilot Studio", options: { bold: true, fontSize: 18, color: WHITE, breakLine: true } }, { text: "orchestrator agent", options: { fontSize: 15, color: LAV2 } }], { x: 3.65, y: 3.8, w: 3.0, h: 1.0, align: "center", valign: "top" });
  [["book", "Knowledge", "HR & IT policies", SKY], ["bolt", "Agent flow", "Create IT ticket", AMBER], ["robot", "Foundry agent", "Deep analysis & reasoning", MAGENTA]].forEach(([ic, h, t, c], i) => {
    const y = 1.85 + i * 1.6;
    if (i === 0) {
      s.addShape(pres.shapes.LINE, { x: 6.65, y: 3.85, w: 0.6, h: 0, line: { color: VIOLET, width: 2.5 } });
      s.addShape(pres.shapes.LINE, { x: 7.25, y: 2.475, w: 0, h: 3.2, line: { color: VIOLET, width: 2.5 } });
    }
    s.addShape(pres.shapes.LINE, { x: 7.25, y: y + 0.625, w: 0.62, h: 0, line: { color: VIOLET, width: 2.5, endArrowType: "triangle" } });
    card(s, 7.9, y, 4.7, 1.25, LAV); icon(s, ic, 8.1, y + 0.22, 0.8, c);
    T(s, [{ text: h, options: { bold: true, fontSize: 19, color: INK, breakLine: true } }, { text: t, options: { fontSize: 15, color: SLATE } }], { x: 9.1, y, w: 3.4, h: 1.25, valign: "middle" });
  });
  T(s, "Tip: write a clear name and description for every topic, tool and agent; the orchestrator relies on them.", { x: 0.7, y: 6.15, w: 11.9, h: 0.5, fontSize: 17, italic: true, color: VIOLET, align: "center" });

  // 17. Live demo
  s = dark("Switch to the demo now. Zoom the browser to 150%. Keep the recorded backup ready in case the network misbehaves.");
  T(s, "LET'S BUILD IT", { x: 0.7, y: 1.35, w: 6, h: 0.4, fontSize: 14, bold: true, color: "F0ABFC", charSpacing: 4 });
  T(s, "Live demo", { x: 0.7, y: 1.75, w: 7, h: 1.1, fontSize: 54, bold: true, color: WHITE, fontFace: H });
  ["Foundry: the IT Troubleshooting specialist agent (model, instructions, knowledge)", "Copilot Studio: the Employee Support Agent, grounded in HR & IT policies",
   "Connect the Foundry agent as a specialist the orchestrator can call", "Action: \"Create IT ticket\" through an agent flow and the Ticket API",
   "Test in Microsoft Teams: a policy question, a troubleshoot, a ticket"].forEach((t, i) => {
    const y = 3.05 + i * 0.75;
    s.addShape(pres.shapes.OVAL, { x: 0.7, y, w: 0.55, h: 0.55, fill: { color: CYCLE[i] }, line: { type: "none" } });
    T(s, String(i + 1), { x: 0.7, y, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: WHITE, align: "center", valign: "middle" });
    T(s, t, { x: 1.45, y, w: 7.2, h: 0.55, fontSize: 18, color: WHITE, valign: "middle" });
  });
  s.addImage({ path: A("cat-smile.png"), x: 9.0, y: 1.9, w: 3.6, h: 3.6 });

  // 18. Production checklist
  s = light("From experiment to production", "A demo is not a product. These six areas are what make an agent trustworthy at enterprise scale.", "Production checklist");
  [["lock", "Identity & access", "Microsoft Entra ID, least privilege and user-level permissions"], ["shield", "Responsible AI", "Content safety, guardrails and a human in the loop"],
   ["check", "Evaluate", "Test sets, groundedness and answer quality, before and after release"], ["eye", "Observe", "Tracing, analytics and user feedback"],
   ["cogs", "Govern", "Environments, data loss prevention and ALM pipelines"], ["coins", "Cost", "Right-sized models, token usage and monitoring"]].forEach(([ic, h, t], i) => {
    const x = 0.7 + (i % 3) * 4.1, y = 1.9 + Math.floor(i / 3) * 2.45;
    card(s, x, y, 3.8, 2.2);
    icon(s, ic, x + 0.3, y + 0.3, 0.85, CYCLE[i]);
    T(s, h, { x: x + 1.35, y: y + 0.3, w: 2.3, h: 0.85, fontSize: 21, bold: true, color: INK, valign: "middle", fontFace: H });
    T(s, t, { x: x + 0.3, y: y + 1.3, w: 3.3, h: 0.8, fontSize: 16, color: INK, valign: "top" });
  });

  // 19. Takeaways
  s = light("Key takeaways", "Close the content here, then move to the thank-you slide for questions.", "Remember");
  [["bulb", "Start with the use case", "One clear problem, real users and a measurable outcome beat a big platform plan."],
   ["layers", "Use both platforms", "Copilot Studio as the front door; Foundry for specialist reasoning and control."],
   ["rocket", "Ground, evaluate, govern", "Trusted knowledge, real testing and governance turn a demo into production."]].forEach(([ic, h, t], i) => {
    const x = 0.7 + i * 4.1;
    card(s, x, 1.9, 3.8, 4.7);
    icon(s, ic, x + 0.35, 2.25, 1.05, [BLUE, VIOLET, MAGENTA][i]);
    T(s, h, { x: x + 0.35, y: 3.55, w: 3.2, h: 0.95, fontSize: 24, bold: true, color: INK, fontFace: H, valign: "top" });
    T(s, t, { x: x + 0.35, y: 4.55, w: 3.2, h: 1.9, fontSize: 18, color: INK, valign: "top" });
  });

  // 20. Thank you
  s = dark("Thank everyone, take questions from the chat, then hand over to Divya for the next session (Janarthanan at 9:35 AM).");
  T(s, "Thank you!", { x: 0.7, y: 1.4, w: 7.8, h: 1.2, fontSize: 58, bold: true, color: WHITE, fontFace: H });
  T(s, "Questions? Let's connect.", { x: 0.7, y: 2.6, w: 7.8, h: 0.6, fontSize: 26, color: "F0ABFC", bold: true });
  T(s, [{ text: "Prathap Reddy", options: { bold: true, fontSize: 22, color: WHITE, breakLine: true } }, { text: "Microsoft AI MVP  ·  AI Engineer, Sulava Mea", options: { fontSize: 17, color: LAV2, breakLine: true } },
    { text: "Founder, Innovation Tech Community", options: { fontSize: 17, color: LAV2 } }], { x: 0.7, y: 3.45, w: 7.8, h: 1.2, valign: "top" });
  [["globe", "innovationtechcommunity.com"], ["passport", "Claim your Agent Universe 2026 stamp in your ITC Learning Passport"], ["comments", "#AgentUniverse2026"]].forEach(([ic, t], i) => {
    const y = 4.85 + i * 0.6; icon(s, ic, 0.7, y, 0.45, CYCLE[i]);
    T(s, t, { x: 1.3, y, w: 7.2, h: 0.45, fontSize: 16, color: WHITE, valign: "middle" });
  });
  s.addImage({ path: IMG("ph-prathap-reddy.png"), x: 9.0, y: 1.4, w: 3.4, h: 3.4 });
  s.addImage({ path: A("cat-wave.png"), x: 10.95, y: 4.95, w: 1.85, h: 1.85 });

  const out = path.join(__dirname, "..", "slides", "prathap-reddy-from-idea-to-agent.pptx");
  await pres.writeFile({ fileName: out });
  await applyTheme(out);
  console.log("wrote", out, n, "slides");
})();
