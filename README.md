# JP Taidesoitinpaja

> 🚧 **Work in progress.** This is an active build — content model and core pages are in place, most frontend views are still to come.

A website for a traditional handmade instrument workshop (*taidesoitinpaja*, Finnish for "art instrument workshop") — an online catalog of instruments for sale, workshop/event listings, and repair services, backed by a headless CMS so the workshop owner can manage content without touching code.

## Tech stack

**Frontend:** `Astro 7` · `TypeScript` — server-rendered, content-driven pages with island-based interactivity where needed.

**CMS:** [`Sanity`](https://www.sanity.io/) — a custom Sanity Studio (`/studio`) defines the content schemas and gives the workshop owner a dedicated editing interface, fully decoupled from the frontend.

**Fonts:** Fraunces (display), Source Sans 3 (body), JetBrains Mono — self-hosted via `@fontsource`.

## Content model

The Sanity schemas (`studio/schemaTypes/`) model the actual domain of a working instrument workshop:

- **`instrument`** — individual instruments for sale: photos, videos, specifications (as free-form label/value rows), price, availability (`in-stock` / `sold` / `made-to-order`).
- **`instrumentCategory`** — the shared story per instrument family (e.g. what a *Jouhikko* is), referenced by each individual instrument so that shared context isn't duplicated per item.
- **`workshopEvent`** — workshops, events and festivals, with date/location/capacity/sign-up link, and graceful handling of "date TBD" / "location TBD" while details are still being confirmed.
- **`repairService`** — the repair & maintenance services offered, each with an icon and description.
- **`homePage`** — a singleton document managing the two homepage photo carousels ("Previous Works" and "Work in Progress").

## Project structure

```
jp_taidesoitinpaja/
├── src/
│   ├── pages/            # Astro routes
│   ├── components/         # InstrumentCard, GalleryFilmstrip, WorkshopModal, CarvedDivider...
│   ├── layouts/              # Shared page layouts
│   ├── lib/sanity.ts           # Sanity client
│   └── styles/                  # Global styles
├── studio/                       # Standalone Sanity Studio (content editing UI)
│   └── schemaTypes/                # instrument, instrumentCategory, workshopEvent, repairService, homePage
├── import-scripts/                   # One-off scripts to migrate content from the previous site
└── public/video/                       # Static video assets
```

## Getting started

Requires **Node 22.12+**.

**Frontend (Astro):**
```bash
npm install
npm run dev        # http://localhost:4321
```

**Content Studio (Sanity):**
```bash
cd studio
npm install
npm run dev         # local Sanity Studio for content editing
```

## Status / roadmap

Currently in place: content schemas, Sanity Studio, content-import tooling from the previous site, and the initial homepage build. Still to come: instrument catalog and detail pages, workshop/events listing, repair services page — built out from the content model above as the design comes together.

---

*Client project — currently in active development.*
