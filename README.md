# Emotionally Whole — Reviews (reviews.emotionallywhole.com)

A standalone, **backend-free** reviews page. It simply displays the reviews you
publish — you control the list entirely by editing one file. No form, no Google
Sheet, no server.

## Files

- `index.html` — the reviews page. Shows the reviews from `reviews.json`, with an
  automatic average-star summary.
- `reviews.json` — the reviews that appear on the page. This is the only file you
  edit to add, change, or remove a review (your "admin only" — only you can change it).

## Publishing / editing reviews

`reviews.json` is a simple list. Each review is one block:

```json
[
  {
    "name": "Grace T., Penang",
    "rating": 5,
    "date": "2026-09-18",
    "text": "The chapter on Nehemiah put words to something I'd carried for years."
  },
  {
    "name": "Rev. Daniel L.",
    "rating": 5,
    "date": "2026-09-20",
    "text": "Honest, scriptural, and quietly practical. I've recommended it to my elders."
  }
]
```

- `rating` is 1–5. `date` is `YYYY-MM-DD`. Keep commas between blocks; none after the last.
- **Add** a review: paste a new block. **Edit**: change its text. **Remove**: delete its block.
- The page recomputes the average and star summary automatically, newest first.

However you gather reviews (email, in person, from a bookstore), you type the good
ones into `reviews.json`, commit, and push.

## Deploy the page (Cloudflare Pages)

1. Push this folder to its own GitHub repo.
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**, pick the repo.
   Framework preset **None**, build command blank, output directory **`/`**.
3. **Custom domains → Set up a custom domain →** `reviews.emotionallywhole.com`
   (the record is created for you since the zone is on your account).

To publish new reviews later, edit `reviews.json`, commit, and push — Cloudflare
Pages redeploys automatically.

## Notes

- If `reviews.json` is empty or missing, the page shows "No reviews yet."
- Because nothing appears unless you put it in `reviews.json`, there's no spam or
  moderation to manage.
