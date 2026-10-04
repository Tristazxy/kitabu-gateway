# Background media

Real-nature clips served from here (committed; not rebuilt by Vite). For each scene in `src/nature.js`:

- `<scene>.jpg` and `<scene>-wide.jpg` — still frame (portrait / landscape), shown first and used alone offline, in data-saver mode or with reduced motion.
- `<scene>.mp4` and `<scene>-wide.mp4` — the clip (up to 12 s, H.264 1080p at ≤4.5 Mbit/s, 30 fps, muted, each played once from the start). All clips play in turn; during the last seconds of one the next fades in slowly on top of it.

Scenes: mountains, grove, canopy, cherries, stream, flowers, dunes, snow — all from Pexels (free licence), credited in the app and in the main README.
If no media exists the app draws its own illustrated scene.
