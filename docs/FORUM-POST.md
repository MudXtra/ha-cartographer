# HA Cartographer — Forum post (testers wanted)

The text posted to the Home Assistant community forum, **Share your Projects!** category. The forum takes Markdown; the block below is pasted as is.

- **Title:** HA Cartographer — a Life360-style family map, location history and driving reports inside Home Assistant (testers wanted)
- **Tags:** `addon`, `life360`, `device-tracker`, `map`
- **Screenshots:** loaded from this repo's `main` branch.

```markdown
# HA Cartographer — a Life360-style family map inside Home Assistant (testers wanted)

Hi all! I've been building **HA Cartographer**, a Home Assistant add-on that gives you a Life360-style family map, location history and weekly driving reports, all inside Home Assistant and all stored on your own box. It's at **0.3.3 (experimental)** and I'm looking for a handful of testers before calling it stable.

![Family map](https://raw.githubusercontent.com/MudXtra/ha-cartographer/main/assets/screenshots/forum-map.png)

## What it does

- **Live family map**: photos or initials as pins, "Here for 3 hrs", bubbles at the edge for people off-screen, Night / Day / Streets / Satellite styles.
- **Location History**: per person (and per tracker) a day timeline of every stop and drive, the trail on the map, a 7-day view, print to PDF.
- **Driving report**: speeding, phone use, top speed, drives and miles per driver; last month / 3 / 6 / 12 months or a custom range; print to PDF.
- **Your zones**: places are your Home Assistant zones, and **+ Add place** creates new ones.
- **Who's on the map**: every person and GPS tracker from Home Assistant and Life360; drag each into People, Trackers or Not tracked, rename it, recolour it, change its icon.
- **Private**: no cloud and no account. Positions stay in the add-on's own database (100–400 days, your choice).

![History](https://raw.githubusercontent.com/MudXtra/ha-cartographer/main/assets/screenshots/forum-history-day.png) ![Driving report](https://raw.githubusercontent.com/MudXtra/ha-cartographer/main/assets/screenshots/forum-driving.png) ![Who's on the map](https://raw.githubusercontent.com/MudXtra/ha-cartographer/main/assets/screenshots/forum-settings-roster.png)

## Requirements

- Home Assistant **OS or Supervised** (add-ons).
- An **amd64** machine (Intel/AMD). No ARM / Raspberry Pi build yet.
- People tracked by the **companion app** and/or the **Life360 integration**. Other GPS `device_tracker`s (cars, tags) work as Trackers.

## Install

1. **Settings → Apps (Add-ons) → Add-on store → ⋮ → Repositories**, add `https://github.com/MudXtra/ha-cartographer`.
2. Install **HA Cartographer**.
3. Optional: **Configuration → Demo mode** on, to look around with a fictional family first.
4. **Start**, switch on **Show in sidebar**, and open **The Realm** from the sidebar.
5. In the app: **Settings → Who's on the map** to sort people and trackers.

## What I'd love testers to check

- Does everyone you expect show up on first start (people, Life360 members, car trackers)?
- Is **History** right for a normal day: the stops, the drives and the place names?
- Do the **Driving** numbers look sane compared with Life360 (if you use it)?
- Phone vs desktop: anything cut off, hard to tap or confusing?
- Anything in your Home Assistant logs from the add-on?

Please report through **Settings → About → Report an issue** in the app (it opens GitHub issues) or reply here. Screenshots help a lot.

Repo, docs and changelog: https://github.com/MudXtra/ha-cartographer

*Not affiliated with Life360, Nabu Casa or the Open Home Foundation. Screenshots use the built-in demo family.*
```
