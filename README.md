# ForeSecure

Monitor · Assess · Protect — a crisis alerting and workforce risk-monitoring landing page.

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

## Push to your own GitHub

From inside this folder:

```bash
git init
git add .
git commit -m "Initial commit: ForeSecure landing page"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

(Create the empty repo on GitHub first — no README/license, so it doesn't conflict — then copy the URL GitHub gives you into the `remote add` command above.)

## Share it live (so people don't need to run any code)

Easiest options, both free and connect straight to your GitHub repo:

**Vercel**
1. Go to vercel.com → New Project → import your GitHub repo
2. Framework preset: Vite (auto-detected)
3. Deploy — you'll get a live `https://your-project.vercel.app` link to share

**Netlify**
1. Go to netlify.com → Add new site → Import an existing project → your GitHub repo
2. Build command: `npm run build`, publish directory: `dist`
3. Deploy — you'll get a live `https://your-project.netlify.app` link

Either way, every time you push to `main`, the live link updates automatically.

## Project structure

```
foresecure-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx      ← the ForeSecure page itself
```
