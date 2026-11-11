"""Writes README.md, schedule.csv, the .ics calendar and run-of-show.md from .cache/data.json."""
import json, re, datetime, os
T = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(T)
d = json.load(open(os.path.join(T, ".cache", "data.json")))
IST = datetime.timezone(datetime.timedelta(hours=5, minutes=30))
t = lambda iso: datetime.datetime.fromisoformat(iso.replace("Z", "+00:00"))
fmt = lambda dt: dt.astimezone(IST).strftime("%-I:%M %p")
NAMES = {"PRATHAP REDDY": "Prathap Reddy", "vinit Metange": "Vinit Metange", "lalit rawat": "Lalit Rawat"}
nice = lambda n: NAMES.get(n, n)
slug = lambda s: re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
SITE = "https://innovationtechcommunity.com"; EVENT = f"{SITE}/agent-universe"
YT = "https://www.youtube.com/live/dGrWyDnP0PE"
LI = "https://www.linkedin.com/events/7520555249288470529/"
STUDIO = "https://streamyard.com/ctr2gy26hi"
HOSTS = "Prathap Reddy & Divya Akula"
SPEAKERS = __import__("json").loads(os.popen(f"node -e \"console.log(JSON.stringify(require('{T}/speakers.js')))\"").read())
host_of = {s["people"][0]["name"].split()[0].lower(): s["host"] for s in SPEAKERS}
start, end = t(d["event"]["starts_at"]), t(d["event"]["ends_at"])
rows = []
for i, s in enumerate(d["sessions"], 1):
    a = t(s["start"]); name = nice(s["name"])
    rows.append(dict(i=i, start=a, end=a + datetime.timedelta(minutes=s["minutes"]), name=name, s=s, file=f"{i:02d}-{slug(name)}.png", host=host_of[name.split()[0].lower()]))
kind = lambda s: "Live demo" if s["format"] == "Demo" else "Talk"
role = lambda s: " · ".join(x for x in [s["job_title"], s["company"]] if x)
sched = "\n".join(f"| {fmt(r['start'])} – {fmt(r['end'])} | {r['name']} | {r['s']['title']} | {kind(r['s'])} · {r['s']['level']} |" for r in rows)
speakers = "\n".join(f"| {r['name']} | {role(r['s'])} | {fmt(r['start'])} |" for r in rows)
gallery = "\n".join(f"| ![{r['name']}](banners/portrait/{r['file']}) | **{r['name']}**<br>{fmt(r['start'])} IST<br>{r['s']['title']}<br>[Post](banners/portrait/{r['file']}) · [Story](banners/story/{r['file']}) · [Wide](banners/landscape/{r['file']}) |" for r in rows)

open(os.path.join(R, "README.md"), "w").write(f"""# Agent Universe 2026

<img src="posters/agent-universe-lineup-landscape.png" alt="Agent Universe 2026 speaker lineup" width="720">

**A free, global, virtual event on Agentic AI by [Innovation Tech Community]({SITE}).**
Build · Learn · Connect · Innovate: one day of practical sessions and live demos from builders around the world.

| | |
|---|---|
| 📅 **Date** | Saturday, 14 November 2026 |
| ⏰ **Time** | {fmt(start)} – {fmt(end)} IST (UTC+5:30) |
| 🎤 **Lineup** | {len(rows)} sessions · {len(rows)} speakers |
| 🎙️ **Hosts** | {HOSTS} |
| 💻 **Where** | Virtual · live on YouTube and LinkedIn |
| 🎟️ **Register (free)** | {EVENT} |
| ▶️ **YouTube live** | {YT} |
| 💼 **LinkedIn live** | {LI} |
| 🛂 **Passport stamp** | Registered attendees can claim the Agent Universe 2026 stamp in their ITC Learning Passport |

## For speakers: how to join

| | |
|---|---|
| 🎙️ **StreamYard studio (speakers only)** | **{STUDIO}** |
| ⏰ **When to join** | 15 minutes before your slot (see the schedule below). The first two speakers: 8:30 AM IST |
| 🖥️ **Your slides** | Use the [speaker template](slides/agent-universe-2026-speaker-template.pptx) (16:9, fonts of 18pt or more) |
| 🖼️ **Your banner** | Download it below, or from your speaker dashboard on the website in three sizes |

Use the StreamYard link only to join as a speaker; please don't share it. Attendees watch on YouTube or LinkedIn.

## Schedule

All times IST. Every slot is **35 minutes: a 30-minute session + 5 minutes of Q&A**.

| Time (IST) | Speaker | Session | Format |
|---|---|---|---|
{sched}

Also available as [`schedule.csv`](schedule.csv) and a calendar file, [`agent-universe-2026.ics`](agent-universe-2026.ics).

## Speakers

| Speaker | Role | Slot |
|---|---|---|
{speakers}

## Speaker banners

Every banner comes in three sizes: **Post** (1080 × 1350, LinkedIn and Instagram), **Story** (1080 × 1920, Instagram and WhatsApp status) and **Wide** (1600 × 900, LinkedIn, X and YouTube).
**Sharing? Tag Innovation Tech Community and use #AgentUniverse2026**, so we can reshare your post.
The website generates them, so the live version is always at `{SITE}/banner/<session-id>.png?size=portrait|story|landscape`.

| Banner | Session |
|---|---|
{gallery}

## Posters

| File | Size |
|---|---|
| [`posters/agent-universe-poster-portrait.png`](posters/agent-universe-poster-portrait.png) | Event poster · 1080 × 1350 |
| [`posters/agent-universe-poster-story.png`](posters/agent-universe-poster-story.png) | Event poster · 1080 × 1920 |
| [`posters/agent-universe-lineup-portrait.png`](posters/agent-universe-lineup-portrait.png) | Speaker lineup · 1080 × 1350 |
| [`posters/agent-universe-lineup-story.png`](posters/agent-universe-lineup-story.png) | Speaker lineup · 1080 × 1920 |
| [`posters/agent-universe-lineup-landscape.png`](posters/agent-universe-lineup-landscape.png) | Speaker lineup · 1600 × 900 |
| [`posters/agent-universe-agenda-story.png`](posters/agent-universe-agenda-story.png) | Agenda · 1080 × 1920 |

## Slides

| File | What it is |
|---|---|
| [`slides/agent-universe-2026-speaker-template.pptx`](slides/agent-universe-2026-speaker-template.pptx) | Branded slide template for speakers: title, about me, agenda, section divider, text and picture, code or demo, key takeaways and thank-you layouts |
| [`slides/agent-universe-2026-host-deck.pptx`](slides/agent-universe-2026-host-deck.pptx) | Host deck for {HOSTS}: welcome, your hosts, housekeeping, about ITC, the day at a glance, agenda, one intro slide per session (a ~2-minute intro script and the presenting host in the speaker notes) and the closing slide |

To rebuild the images and decks after a change, see [`tools/README.md`](tools/README.md).

## Run of show

See [`run-of-show.md`](run-of-show.md) for the hosts' checklist and who introduces each slot.

## Registrations

Registrations are managed on the website (Admin › Events & speakers › Agent Universe 2026 › Registrations, with CSV export).
**Attendee details are personal data and are never stored in this repository.**

---

Innovation Tech Community · Learn together. Build together. Grow together. · #AgentUniverse2026
""")

with open(os.path.join(R, "schedule.csv"), "w") as f:
    q = lambda v: '"' + str(v).replace('"', '""') + '"'
    f.write("start_ist,end_ist,speaker,session,format,level,minutes,host\n")
    for r in rows: f.write(",".join([fmt(r["start"]), fmt(r["end"]), q(r["name"]), q(r["s"]["title"]), kind(r["s"]), r["s"]["level"], str(r["s"]["minutes"]), q(r["host"])]) + "\n")

esc = lambda v: v.replace("\\", "\\\\").replace(";", r"\;").replace(",", "\\,").replace("\n", "\\n")
utc = lambda dt: dt.astimezone(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
stamp = utc(datetime.datetime.now(datetime.timezone.utc))
ev = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Innovation Tech Community//Agent Universe 2026//EN", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT", "UID:agent-universe-2026@innovationtechcommunity.com", f"DTSTAMP:{stamp}", f"DTSTART:{utc(start)}", f"DTEND:{utc(end)}", "SUMMARY:Agent Universe 2026",
      f"DESCRIPTION:{esc('Free virtual event on Agentic AI by Innovation Tech Community. YouTube live: ' + YT + ' · LinkedIn live: ' + LI + ' · ' + EVENT)}", f"LOCATION:{esc('Online · ' + YT)}", f"URL:{EVENT}", "END:VEVENT"]
for r in rows:
    ev += ["BEGIN:VEVENT", f"UID:au-session-{r['s']['id']}@innovationtechcommunity.com", f"DTSTAMP:{stamp}", f"DTSTART:{utc(r['start'])}", f"DTEND:{utc(r['end'])}",
           f"SUMMARY:{esc(r['s']['title'] + ' — ' + r['name'])}", f"DESCRIPTION:{esc('Agent Universe 2026 · ' + EVENT)}", f"LOCATION:{esc(YT)}", "END:VEVENT"]
ev.append("END:VCALENDAR")
open(os.path.join(R, "agent-universe-2026.ics"), "w").write("\r\n".join(ev) + "\r\n")

ros = ["# Run of show · Agent Universe 2026", "", f"Saturday, 14 November 2026 · {fmt(start)} – {fmt(end)} IST. Hosts: **{HOSTS}**. Each 35-minute slot: **30-minute session + 5 minutes of Q&A** from the chat; a host introduces each speaker (about 1–2 minutes) at the start of the slot.", "",
       "## Before the day", "",
       f"- [ ] Send every speaker the StreamYard link ({STUDIO}) and their slot time", "- [ ] Tech check with each speaker: camera, mic, screen share, slide font size",
       "- [ ] Ask speakers for a recorded backup of any live demo", "- [ ] Schedule the stream in StreamYard for YouTube and LinkedIn",
       "- [ ] Load the host deck and check every speaker's name pronunciation", "- [ ] Decide who reads the chat questions while the other host is on stage", "",
       "## On the day", "", "- [ ] 8:30 AM: both hosts and the first two speakers join the StreamYard backstage", "- [ ] 8:55 AM: go live with the countdown / poster",
       "- [ ] 9:00 AM: Prathap's session opens the day, so Divya introduces it; keep the welcome short (host deck slides 1–6)", "",
       "| Time (IST) | Speaker | Intro by | Host notes |", "|---|---|---|---|", f"| {fmt(start)} | {HOSTS} | Both | Welcome, your hosts, housekeeping, about ITC, agenda (host deck slides 1–6) |"]
ros += [f"| {fmt(r['start'])} – {fmt(r['end'])} | {r['name']} | {r['host']} | Intro slide {r['i'] + 6} · \"{r['s']['title']}\" |" for r in rows]
ros += [f"| {fmt(end)} | {HOSTS} | Both | Close: thank speakers and volunteers, passport stamp, YouTube recordings |", "",
        "## Notes", "", "- Speaker intro scripts are in the speaker notes of the host deck (about 2 minutes each), with the presenting host at the top.",
        "- Prathap and Divya each introduce the other's session."]
open(os.path.join(R, "run-of-show.md"), "w").write("\n".join(ros) + "\n")
print(f"docs: {len(rows)} sessions, {fmt(start)}–{fmt(end)}")
