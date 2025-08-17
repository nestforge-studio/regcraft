# RegCraft — Visual Regex Builder

RegCraft helps you build regular expressions without writing them by hand. Drag blocks, pick a ready-made recipe, or type a free‑text pattern, then test against your text with instant highlighting. Copy language snippets for JavaScript, Python, PHP, Java, or C# once you’re happy.

👉 Try it online: [RegCraft – Visual Regex Builder](https://nestforge-studio.github.io/regcraft/)


Live layout:
- Desktop/laptop: Left side shows tabs (Blocks, Recipes, Free Text). Right side shows the Builder. Bottom shows Test Input and results.
- Mobile/tablets: The Builder appears below the tabbed panel for a vertical, scroll-friendly flow.

## Quick start (no account needed)
1) Choose how you want to start on the left:
- Blocks: Click a block to add it; drag to reorder; use +, *, ?, {n}, {m,n} after a block to repeat it.
- Recipes: Click a preset (URL, email, UUID, date, etc.) to load a sensible pattern.
- Free Text: Type your own regex (no surrounding /slashes/). The header switches control flags.

2) Arrange in the Builder (right):
- Drag chips to reorder, click × to remove.
- Some chips colorize and correspond to highlight colors in results.

3) Test Input (bottom):
- Paste example text. Matches appear listed and highlighted inline.

4) Copy for your language:
- Pick a language from the dropdown (JS, Python, PHP, Java, C#).
- Click “Copy snippet” or “Copy regex only”.

Flags in the header:
- /i case-insensitive, /m multi-line anchors, /g global (shows all matches).

Tips:
- Use ^ and $ if you want to match the whole string.
- Literals are automatically escaped (e.g., dot becomes \.).
- Many recipes are intentionally simplified to be practical in real data.

## What’s included (recipes)
Email, URL (basic), IPv4 (simplified), Hex color (#RGB or #RRGGBB), UK postcode (simplified), UK NINO (spaced or compact), US SSN, US phone (simple), Credit card (brand patterns available), Slug, MAC address, SemVer, ISO 8601 datetime, Date (YYYY‑MM‑DD), and more.

## Privacy & security
- RegCraft runs entirely in your browser. Your text and patterns are not sent to a server.
- A strict Content Security Policy is set to reduce third‑party access.

## Support
- Questions or licencing enquiries: nestforge.studio@gmail.com

## License
© 2025 Nestforge Studio. All rights reserved. This software is proprietary; no use is permitted without prior written permission. See LICENSE.txt for details.

## For maintainers (optional)
- Local run: npm install; npm start
- Build: npm run build
- Tests: npm test (Jest, jsdom). CI runs tests and builds on every push/PR.
