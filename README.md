# Emotionally Whole — Reflections

A warm, book-themed reviews website for **_Emotionally Whole: From the Mirror to the Door_** by Winston Chew — a place for readers of the book and attendees of the *Emotionally Whole* seminar to leave a reflection, and for the author to moderate them.

No framework, no build step, no server bill. A single static page talks to a Google Sheet through a tiny Google Apps Script, so it runs free on Netlify and stores every reflection in a spreadsheet you already know how to use.

---

## Features

- **Public reflections wall** — anyone can post a name and a comment; the date is stamped automatically.
- **Date · Name · Reflection columns** — a clean table on desktop that folds into readable cards on mobile.
- **Live posting** — reflections appear immediately, no approval queue.
- **Two ways to moderate** — an in-page Admin panel (Edit / Hide / Show / Delete on every reflection) *and* direct editing in the Google Sheet itself.
- **Hide without losing** — hidden reflections vanish for visitors but stay visible (and restorable) for the admin.
- **Safe by construction** — user text is rendered with `textContent`, so comments can't inject markup or scripts.
- **Distinctive design** — the *mirror → door* motif: a deep teal-slate "mirror" ink, a honeyed "doorway" accent, and a literary Fraunces / Newsreader type pairing.

---

## How it works

```
Visitor ── posts / reads ──▶  index.html  (static page on Netlify)
                                   │
                                   │  JSONP request (no CORS setup needed)
                                   ▼
                        Google Apps Script Web App  (Code.gs)
                                   │
                                   ▼
                          Google Sheet  ── "Reviews" tab
                        id · timestamp · name · comment · hidden
```

The page uses **JSONP** (a `<script>` tag request) instead of `fetch`, which sidesteps cross-origin restrictions entirely — that's what lets a page on Netlify talk to a script on Google with zero backend configuration. The Apps Script reads and writes rows in the `Reviews` tab and returns JSON.

---

## Project structure

| File | What it is |
|------|------------|
| `index.html` | The whole front end — markup, styles, and logic in one file. |
| `Code.gs` | The Google Apps Script backend (list / create / edit / hide / delete). |
| `SETUP.md` | Step-by-step deployment guide. |
| `README.md` | This file. |

---

## Quick start

You can open `index.html` locally to try everything in **Preview mode** first — reflections are kept on-screen only, so posting, editing, hiding, and deleting all work without any backend (use any text as the admin passcode).

To go live (about 10 minutes, all free), see **[SETUP.md](SETUP.md)**. In short:

1. **Backend** — create a Google Sheet, open **Extensions → Apps Script**, paste in `Code.gs`, set your own `ADMIN_KEY`, and deploy it as a **Web app** (*Execute as: Me*, *Who has access: Anyone*). Copy the `/exec` URL.
2. **Frontend** — paste that URL into `CONFIG.endpoint` at the top of `index.html`, then deploy `index.html` to Netlify.

The `Reviews` tab is created automatically on the first submission.

---

## Configuration

In `index.html`:

```js
const CONFIG = {
  endpoint: "https://script.google.com/macros/s/XXXX/exec",  // your Apps Script URL
  maxComment: 1500                                            // character limit per reflection
};
```

In `Code.gs`:

```js
const ADMIN_KEY   = 'change-this-to-a-long-secret';  // your admin passcode
const MAX_COMMENT = 1500;                            // keep in sync with the page
const MAX_NAME    = 80;
```

---

## Moderating

**From the page** — click **Admin** in the footer, enter your passcode, and Edit / Hide / Show / Delete controls appear on every reflection.

**From the sheet** — edit a comment cell, set **hidden** to `TRUE` to hide a row from visitors, or delete the row to remove it. Changes show on the next page load.

> **Note on the passcode:** it lives only in `Code.gs`, never in the public page. When you moderate *from the page*, the passcode travels with the request — fine for a friendly review wall. If you'd rather never expose it, just moderate in the sheet and skip the page's Admin panel.

---

## Customizing

- **Rename the "Reflection" column** to "Comment" — search `index.html` for `Reflection`.
- **Change the palette** — the colors are CSS custom properties in `:root` (`--paper`, `--ink`, `--door`, `--mirror`, …).
- **Change the type** — swap the Google Fonts `<link>` and the `font-family` rules.
- **Adjust the length limit** — update `maxComment` / `MAX_COMMENT` in both files.

---

## Tech

Vanilla HTML, CSS, and JavaScript · Google Apps Script · Google Sheets · JSONP · Netlify · [Fraunces](https://fonts.google.com/specimen/Fraunces) & [Newsreader](https://fonts.google.com/specimen/Newsreader).

---

## Updating the backend later

If you change `Code.gs`, redeploy via **Deploy → Manage deployments → Edit → Version: New version** so your existing `/exec` URL keeps working.

---

## License

© Winston Chew. All rights reserved.
_(Add a `LICENSE` file if you'd like to release it under an open-source license such as MIT.)_
