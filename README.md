# TaaS robotics — site

A clean, single-page landing site with:
- Full-screen HD video background (rotates through multiple clips)
- Typewriter/backspace effect for domains
- Minimal content and elegant translucent cards

## Run locally

1) Install dependencies

```bash
npm install
```

2) Start the dev server

```bash
npm run dev
```

Open the local URL printed in your terminal.

## Add your background videos

1) Drop clips into `public/videos/` (MP4/WebM/MOV)
2) Generate the manifest:

```bash
npm run videos:scan
```

3) Restart the dev server if it was running.

The hero will rotate through the clips automatically.

## Edit words / team / email

Update `src/config.ts`.

## Build

```bash
npm run build
npm run preview
```
