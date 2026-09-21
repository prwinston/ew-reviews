# Emotionally Whole — Reviews site setup

Three files:

- **index.html** — the review page (deploy to Netlify).
- **Code.gs** — the Google Apps Script that stores reviews in a Google Sheet.
- **SETUP.md** — this guide.

You can open `index.html` right now to see it in **Preview mode** (reflections
are saved on-screen only, so you can try posting, editing, hiding and deleting).
To make it a real shared wall, do the two parts below.

---

## Part 1 — The free backend (Google Sheet)

1. Create a new **Google Sheet** (name it anything, e.g. *EW Reviews*).
2. In the sheet: **Extensions → Apps Script**.
3. Delete the placeholder code, paste in everything from **Code.gs**.
4. Change this line to your own secret passcode (this is your admin login):
   ```
   const ADMIN_KEY = 'change-this-to-a-long-secret';
   ```
5. Click **Deploy → New deployment**. Choose type **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Authorise when prompted. Copy the **Web app URL** (it ends in `/exec`).

The `Reviews` tab (Date · Name · Comment · Hidden) is created automatically the
first time a review comes in.

## Part 2 — The page (Netlify)

1. Open **index.html** and paste your Web app URL into the config near the top:
   ```
   const CONFIG = {
     endpoint: "https://script.google.com/macros/s/XXXX/exec",  // <- your /exec URL
     maxComment: 1500
   };
   ```
2. Deploy `index.html` to Netlify (drag-and-drop the file onto your Netlify
   dashboard, or add it to your site's repo).

Done. Visitors can post reflections; you moderate from the page or the sheet.

---

## Moderating

**On the page:** click **Admin** in the footer, enter your passcode, and Edit /
Hide / Show / Delete buttons appear on every reflection. Hidden ones stay
visible to you (dimmed, marked *hidden*) but disappear for visitors.

**In the sheet (just as good):** edit a comment cell, set **hidden** to `TRUE`
to hide a row, or delete the row to remove it. Changes show on the site on the
next load.

## Good to know

- **Columns** are Date, Name, and Reflection (the comment). Rename "Reflection"
  to "Comment" in `index.html` if you prefer — search for the word `Reflection`.
- The admin passcode lives only in **Code.gs**, never in the public page. When
  you moderate from the page, the passcode travels in the request — fine for a
  friendly review wall, but if you'd rather never expose it, just moderate in
  the sheet and skip the page's Admin panel.
- Reflections are capped at 1,500 characters. Change `MAX_COMMENT` in both files
  to adjust.
- To update `Code.gs` later, use **Deploy → Manage deployments → Edit → Version:
  New version** so your existing `/exec` URL keeps working.
