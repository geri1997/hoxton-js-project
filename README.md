Proud to share: We finished a fun little web project built during the Hoxton code cohort 🎉

Project: Geri and Rinor's Quiz App (gerinionnaire)
A small, browser-first JavaScript app that demonstrates DOM manipulation, simple client-server interaction, and sound effects — all in plain JS. We built this to practice core front-end skills and to ship something playable fast, and although it deemed quite challenging considering the intervals and having to only use vanilla JS, it was quite a lot of fun too.

What we learned

- Solidified vanilla JS event handling and DOM updates.
- Implemented a tiny server setup with `json-server` for local data during development.
- Added lightweight UX touches like sound feedback and basic styling.

Highlights

- Runs locally with a single command.
- Minimal dependencies (just `json-server`).
- Great starting point if you want to explore vanilla JS, simple mock APIs, or extend into React later.

How to run (macOS / zsh)

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npm start
```

This runs `node server.js` per the project's `package.json` which serves the app; if you want to run only the mock API, you can also run `json-server --watch db/db.json --port 3000` (if installed globally).

Try it

- Open index.js with Live Server in your browser after server started successfully.
- Play through the quiz and listen for audio cues in the `sounds/` folder.

Call to action
If this looks useful, please star or fork the repo on GitHub, or reach out — I'd love feedback on the UX or ideas for features to add next (timed quizzes, persistent scores, mobile polish). #javascript #webdev

Repo: https://github.com/geri1997/hoxton-js-project
