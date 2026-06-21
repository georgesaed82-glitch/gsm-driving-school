# Deploying GSM Driving School (with your GoDaddy domain)

This project is a real, buildable website (React + a small serverless backend
for the AI chat). You'll host the actual app for free on Vercel, then point
your GoDaddy domain at it. Your domain stays registered with GoDaddy the
whole time — you're not moving it anywhere.

Total time: about 20–30 minutes, plus up to 48 hours for DNS to fully update
worldwide (usually much faster, often under an hour).

---

## Part 1 — Get an Anthropic API key

The AI chat feature calls Claude's API. You need your own API key (separate
from this chat) so the live site can make real requests.

1. Go to https://console.anthropic.com
2. Sign up / log in, add billing (the chat feature will use a small amount
   of API credit per conversation — a few pence per chat session typically)
3. Go to **API Keys** → **Create Key** → copy it somewhere safe. You won't
   be able to see it again after this.

Keep this key handy for Part 3. Never put it directly in any code file or
commit it anywhere public — that's the whole point of the serverless
function we've already built into this project.

---

## Part 2 — Put the project on GitHub

Vercel deploys directly from a GitHub repository, which is the easiest way
to manage this long-term (you can push updates later and it redeploys
automatically).

1. Create a free account at https://github.com if you don't have one
2. Create a new repository (e.g. `gsm-driving-school`), keep it Private if
   you'd rather your code wasn't public
3. Upload all the files in this project folder to that repository
   (GitHub's web interface has an "upload files" button — drag the whole
   folder in, or use GitHub Desktop if you prefer a visual tool)

Make sure the folder structure looks like this once uploaded:

```
gsm-driving-school/
├── api/
│   └── chat.js
├── src/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## Part 3 — Deploy to Vercel

1. Go to https://vercel.com and sign up using your GitHub account (this
   links them automatically)
2. Click **Add New** → **Project**
3. Select your `gsm-driving-school` repository → **Import**
4. Vercel will auto-detect this as a Vite project. Leave the build settings
   as default.
5. Before clicking Deploy, expand **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (paste the key from Part 1)
6. Click **Deploy**

After a minute or two, Vercel gives you a live URL like
`gsm-driving-school.vercel.app`. Open it and test the site, including the
AI chat — this confirms everything works before you touch your domain.

---

## Part 4 — Point your GoDaddy domain at Vercel

Now connect your real domain (e.g. `gsmdrivingschool.com`) to this Vercel
deployment.

### In Vercel:
1. Open your project → **Settings** → **Domains**
2. Type your domain (e.g. `gsmdrivingschool.com`) → **Add**
3. Vercel will show you DNS records to set — usually:
   - An **A record** pointing `@` to an IP address (e.g. `76.76.21.21`)
   - A **CNAME record** pointing `www` to `cname.vercel-dns.com`
   (Vercel shows you the exact current values on this screen — use those,
   not the example values here, since they can change.)

### In GoDaddy:
1. Log into https://dashboard.godaddy.com
2. Go to **My Products** → find your domain → **DNS** → **Manage DNS**
3. You'll see existing records (possibly ones from Website Builder, which
   you can remove once you're moving away from it)
4. Add the records Vercel gave you:
   - Type `A`, Name `@`, Value `<the IP Vercel showed you>`
   - Type `CNAME`, Name `www`, Value `cname.vercel-dns.com`
5. Save changes

### Wait for DNS to propagate
This can take anywhere from a few minutes to 48 hours. You can check
progress at https://dnschecker.org by entering your domain. Once it's
showing the new records globally, Vercel will automatically issue a free
SSL certificate (the padlock/https) for your domain — no extra steps
needed.

---

## Part 5 — Turn off GoDaddy Website Builder (optional but recommended)

Once your domain points to Vercel, the old Website Builder site is no
longer reachable at your domain anyway. If you were paying for the
Website Builder plan specifically, you can cancel it from GoDaddy's
dashboard to stop that charge — your domain registration itself is a
separate, much cheaper line item and you keep that regardless.

---

## Updating the site later

Any time you want to change something:
1. Edit the files in your GitHub repository (or have Claude make the
   edit and re-upload the changed file)
2. Vercel automatically redeploys within about a minute of the change
   landing on GitHub

No re-uploading to GoDaddy, no FTP, no manual rebuild step.

---

## Adding your own teaching videos

The site supports real self-hosted video on the "Lesson Videos" page and
on each topic's detail page in the portal.

1. Create a folder called `public/videos/` in this project (create the
   `public` folder if it doesn't exist yet)
2. Add your `.mp4` files there, e.g. `public/videos/alertness.mp4`
   - Keep file sizes reasonable for a free hosting tier — aim for under
     ~100MB per video if possible (compress with HandBrake, a free tool,
     if your phone/camera files are large)
3. Open `src/App.jsx` and find the `VIDEOS` object near the top:
   ```js
   const VIDEOS = {
     "Alertness": "/videos/alertness.mp4",
     "Hazard awareness": "/videos/hazard-awareness.mp4",
   };
   ```
4. Add one line per topic, matching the exact topic name from the 14 DVSA
   topics list, pointing to your file path
5. Push the change to GitHub — Vercel redeploys automatically and the
   video appears on the site

Topics without an entry in `VIDEOS` automatically show a "coming soon"
placeholder instead of breaking.

### A note on hazard perception clips specifically

The real DVSA hazard perception clips used in the official theory test
are licensed government test material — they can't legally be uploaded to
a third-party website like this one, regardless of how they're framed or
used. The hazard perception page on this site is an original, simple demo
built to practise the underlying timing skill, and it links out to GOV.UK's
own free official practice clips for the real thing. If you want a deeper
practice tool, the right move is building more original scenarios like the
one already here, not sourcing the actual DVSA clips.

---

## Costs, roughly

- **Vercel**: free tier comfortably covers a small business site like this
  for app code; if you add many large videos and get heavy traffic, you
  may eventually want a dedicated video host (e.g. Cloudflare R2, Bunny.net)
  behind the scenes — not a concern for a typical small driving school site
- **Anthropic API**: pay-as-you-go, typically a few pence per chat
  conversation; you can set a spending cap in the Anthropic console
- **GoDaddy**: just your existing domain renewal — no hosting fee needed
  anymore once you cancel Website Builder
