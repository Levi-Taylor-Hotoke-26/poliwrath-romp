# Poliwrath Romp!

Poliwrath Romp is a small browser game where you try to find a hidden Poliwrath on a 3x3 ocean grid before it escapes.

## Gameplay

- Click **Start Game** to begin a round.
- A Poliwrath is hidden in one of the nine tiles.
- Click tiles to search for it.
- You get **5 wrong attempts** per round.
- If you find it, you win (with confetti and sound effects).
- There is a **1 in 10 chance** the Poliwrath is shiny.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript (ES modules)
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) via CDN
- Web Audio API and HTML Audio

## Run Locally

This project is static and can be run directly in a browser:

1. Clone the repository.
2. Open `/home/runner/work/poliwrath-romp/poliwrath-romp/index.html` in your browser.

For best compatibility with module loading, serve the directory with a local static server (for example, using your editor's live server extension) and open `index.html`.

## Project Structure

```text
poliwrath-romp/
├── index.html      # Game layout and UI
├── main.css        # Styling
├── main.js         # Game logic, audio, and confetti behavior
├── images/
│   └── pokemon-ocean.png
└── mykelu-crowd-cheering-383111.mp3
```

## Features

- Random hidden target placement each round
- Shiny encounter chance
- Move counter with loss condition
- Win/loss messages
- Sound effects for misses, win, loss, and shiny catches
