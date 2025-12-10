# 🎲 AALC Affinity Bingo

**A mobile-first, client-side web app for inclusive team connection events.**

Hosted on GitHub Pages | Works offline | No backend required | Privacy-first

---

## 📖 Overview

AALC Affinity Bingo is a lightweight web application designed to foster inclusion and belonging through structured social interaction. Attendees scan a QR code to access their unique bingo card, mark squares by meeting peers, and optionally submit a brief "belonging pulse" at the end.

**Key Features:**
- ✨ Mobile-optimized, responsive design
- 🔒 Client-side only—no server, no data storage beyond your device
- ♿ Full WCAG 2.1 AA accessibility support
- 📱 Progressive Web App (PWA)—works offline
- 🎯 Seeded randomization to reduce duplicate cards
- 🕐 Host mode with timer, announcements, and facilitator controls
- 📊 Lightweight metrics (local device only)
- 🚀 < 1MB total payload; < 3s first meaningful interaction

---

## 🚀 Quick Start

### Option 1: Deploy to GitHub Pages (Recommended)

1. **Fork or clone this repository:**
   ```bash
   git clone https://github.com/tolu-jnj/AALC-Year-End.git
   cd AALC-Year-End
   ```

2. **Enable GitHub Pages:**
   - Go to **Settings** → **Pages**
   - Set **Source** to `main` branch
   - Deploy from the repo root (or `/docs` folder if you prefer to organize)

3. **Share the QR or link:**
   ```
   https://tolu-jnj.github.io/AALC-Year-End/
   ```

4. **(Optional) For Host Mode:**
   ```
   https://tolu-jnj.github.io/AALC-Year-End/?host=true
   ```

### Option 2: Local Testing

1. **Clone the repo:**
   ```bash
   git clone https://github.com/tolu-jnj/AALC-Year-End.git
   cd AALC-Year-End
   ```

2. **Start a local server:**
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Or using Node.js/npm
   npx http-server

   # Or using Ruby
   ruby -run -ehttpd . -p8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

---

## 📱 Usage

### For Attendees

1. **Access the app** via QR code or link
2. **Set accessibility preferences** (high contrast, large text, etc.)
3. **Tap squares** to mark them as you meet colleagues who match each prompt
4. **(Optional) Add names** to remember who you met
5. **Achieve BINGO** by completing rows, columns, or diagonals
6. **Submit your Belonging Pulse** (2–3 questions at the end)
7. **View summary** of your stats (numbers only; no names exported)

### For Facilitators (Host Mode)

1. **Activate Host Mode:**
   ```
   ?host=true
   ```

2. **Use the control panel** to:
   - Start/pause/reset the round timer (default: 10 min/round)
   - Show announcements (rotate tables, share wins, etc.)
   - View the current round

3. **(Optional) Generate table summaries:**
   - Each attendee's card can export a count-only QR
   - Scan with a QR reader to aggregate metrics

---

## 🏗️ Project Structure

```
AALC-Year-End/
├── index.html           # Main HTML (all screens, modals)
├── styles.css           # Complete responsive stylesheet
├── app.js               # Main application logic (state, events, storage)
├── prompts.js           # Bingo card prompts (24 items)
├── sw.js                # Service Worker (PWA, offline cache)
├── manifest.json        # PWA manifest
├── README.md            # This file
└── docs/                # (Optional) GitHub Pages build output
```

---

## 🎮 Game Mechanics

### Card Generation

- **5×5 grid** with center "FREE SPACE" (always marked)
- **24 unique prompts** from `prompts.js`
- **Seeded randomization**: Pass `?s=<seed>` to generate a specific card
- **Duplicate reduction**: Use table-based seeds for pre-event seeding

Example:
```
?s=12345        # Specific seed for Table 1
?table=T1&s=abc # Table-based organization
```

### Bingo Detection

Victory conditions:
- Any **complete row** (horizontal)
- Any **complete column** (vertical)
- Any **diagonal** (either direction)
- Multiple BINGOs are counted

Free space automatically counted as marked.

### Metrics Collected

**Local (device-only):**
- Squares marked (0–24)
- Bingos achieved (0–4 typical)
- Names captured (optional)
- First BINGO timestamp
- Belonging Pulse responses

**Export (no PII):**
- Card ID (seeded hash)
- Count of squares/bingos/names (no actual names)
- QR code for facilitator scanning

---

## ♿ Accessibility (WCAG 2.1 AA)

### Built-In Features

✅ **Keyboard Navigation**
- `Tab` to cycle through grid cells
- `Enter` to open a cell's detail modal
- `Esc` to close modals

✅ **Screen Reader Support**
- Semantic HTML (`<button>`, `role="grid"`, etc.)
- ARIA labels for all interactive elements
- Status announcements (marked squares, progress)

✅ **Visual Accessibility**
- High contrast mode toggle
- Large text option (1.25–1.5x zoom)
- Reduce motion toggle
- Color + shape/icon for all state changes

✅ **Mobile/Touch**
- Large touch targets (44px minimum)
- Responsive grid layout
- Two-tap interaction (mark + unmark)

### Enable Accessibility Features

Users can toggle in **Settings** or on first load via the A11y prompt.

---

## 🔒 Privacy & Data

### What Is Stored?

- **Local storage only**: All data stays on the user's device
- **No backends**: No server calls (except GitHub Pages hosting)
- **No PII by default**: Names are optional and device-local
- **No cookies/tracking**: Unless explicitly added to manifest

### Data Storage (localStorage)

```json
{
  "aalc_bingo_v1": {
    "card_id": "aalc_12345",
    "grid": [
      { "id": "p01", "text": "...", "marked": true, "name": "Alice" },
      ...
    ],
    "stats": {
      "squares_marked": 8,
      "bingos": 0,
      "first_bingo_ts": null
    },
    "pulse": {
      "belonging_score": null,
      "new_connection": false,
      "inclusion_comment": ""
    },
    "version": "1.0.0"
  }
}
```

### User Controls

- **Reset Card**: Clear all progress; new card generated
- **Clear All Data**: Permanent deletion of local storage
- **Export Summary**: Generate count-only QR (no names)
- **Privacy notice**: Clearly displayed throughout app

---

## 📊 Metrics & Success Criteria

### Attendee-Level Metrics

- **Time-to-first-interaction (TTFI):** < 3s on 4G
- **Completion rate:** % who submit pulse
- **Engagement:** Mean squares marked, % with ≥1 BINGO
- **Belonging score:** Mean pulse response (1–5)
- **Networking:** % who made new connections

### Event-Level Metrics (Optional)

Facilitators can optionally scan table summary QRs to aggregate:
- Average squares per table
- % achieving ≥1 BINGO per table
- Pulse themes (via comment text analysis)

### Business Alignment

**Belonging:** Pulse score ≥ 4/5 = strong sense of belonging

**Networking:** ≥ 70% report ≥ 1 new connection intent

**Engagement:** Median squares ≥ 12 / 24 = 50% coverage

**Learning:** Prompts representing key initiatives (Lean, Credo, EBRG, etc.) touched by ≥ 50% of attendees

---

## 🛠️ Customization

### Add/Edit Prompts

Edit `prompts.js`:
```javascript
const PROMPTS = [
    { id: 'p01', text: 'Your custom prompt here' },
    // ... 24 items total
];
```

### Customize Colors

Edit `styles.css` CSS variables:
```css
:root {
    --primary-red: #c41e3a;
    --primary-dark: #8b1429;
    --accent-gold: #d4af37;
    --accent-green: #2d5016;
    /* ... */
}
```

### Change Event Title

Search for `AALC Bingo` in `index.html` and update as needed.

### Enable/Disable Host Mode

By default, `?host=true` activates host panel. To disable:
- Remove host mode UI from HTML, or
- Add password protection (modify `checkHostMode()`)

---

## 📦 PWA & Offline Support

### Service Worker

- Pre-caches all assets on first visit
- Falls back to cache on network errors
- Updates cache on subsequent visits
- Works fully offline after initial load

### Install as App

Users can:
- **iOS:** Share → Add to Home Screen
- **Android:** Menu → Install App / Add to Home Screen
- **Desktop:** Chrome menu → Install

### Features Available Offline

✅ Full gameplay (no network required)
✅ Pulse submission (stored locally)
✅ Summary view & export
✅ Accessibility settings

---

## 🚀 Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| First Meaningful Paint | < 3s (4G) | ✅ |
| Total Page Size | < 1MB | ✅ |
| Network Requests | < 10 | ✅ |
| Time to Interactive (TTI) | < 5s | ✅ |
| Lighthouse Score | > 90 | ✅ |

### Optimization Strategies

- Single HTML file with embedded SVG icons
- CSS variables for efficient theming
- Vanilla JS (no heavy frameworks)
- Service worker pre-caching
- Minimal external dependencies
- System fonts (no custom typefaces)

---

## 🧪 Testing Checklist

### Functionality
- [ ] Card generates with 25 cells (24 prompts + 1 FREE)
- [ ] Tap marks/unmarks cells correctly
- [ ] BINGO detection works for all patterns
- [ ] Pulse form submits and shows thank you
- [ ] Reset clears all data
- [ ] Host timer counts down
- [ ] Announcements display

### Accessibility
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Screen reader announces cells and state
- [ ] High contrast mode toggles
- [ ] Large text option applies
- [ ] Reduce motion option stops animations
- [ ] Touch targets are ≥ 44px

### Responsiveness
- [ ] Works on iPhone SE (375px)
- [ ] Works on iPhone Pro Max (428px)
- [ ] Works on mid-range Android (360px)
- [ ] Works on iPad (768px+)
- [ ] Landscape & portrait orientations
- [ ] Grid scales appropriately

### Performance
- [ ] Load time < 3s on 4G (throttled)
- [ ] Repeat visits instant via cache
- [ ] Works offline after initial load
- [ ] Confetti animation smooth
- [ ] No jank during interactions

### Cross-Browser
- [ ] iOS Safari 15+
- [ ] Android Chrome 90+
- [ ] Firefox Android
- [ ] Desktop Chrome/Edge/Safari

---

## 🚢 Deployment

### GitHub Pages (Primary)

1. Push to `main` branch
2. GitHub Pages auto-deploys from root
3. Access at `https://<username>.github.io/AALC-Year-End/`

### Alternative: Vercel / Netlify

1. Connect repo to Vercel/Netlify
2. Deploy on push (auto)
3. Custom domain optional

### Docker (Local Testing)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install -g http-server
CMD ["http-server", "-p", "8000"]
```

```bash
docker build -t aalc-bingo .
docker run -p 8000:8000 aalc-bingo
```

---

## 📋 Event Playbook

### Before Event (T-7 to T-1)

- [ ] Finalize prompt list (customize if needed)
- [ ] Test on 3–5 device types
- [ ] Print QR codes for main URL and host URL
- [ ] Prepare table seeding strategy (optional)
- [ ] Brief facilitators on host mode
- [ ] Accessibility pre-flight check

### During Event

- [ ] Host opens app with `?host=true`
- [ ] Attendees scan QR or type URL
- [ ] Facilitator starts timer for round 1
- [ ] Announces prompts/rotation as needed
- [ ] Shows announcements at key moments
- [ ] Collects pulse responses in final 5 min

### After Event

- [ ] Request qualitative feedback from facilitators
- [ ] Optionally scan table summary QRs
- [ ] Aggregate pulse responses (manual count)
- [ ] Document PDCA learnings
- [ ] Plan v2 enhancements

---

## 🗺️ Roadmap

### V1 (Current)
✅ Static site on GitHub Pages
✅ PWA with offline support
✅ Randomized cards with seeding
✅ Host timer & announcements
✅ Local pulse & summary
✅ Accessibility (WCAG 2.1 AA)
✅ Privacy-first design

### V2 (Future)
- Real-time aggregation (serverless backend)
- Admin dashboard for event analytics
- Multi-language support
- Lighter analytics integration
- Accessibility audit & certification

### V3+ (Vision)
- Leaderboards (privacy-conscious)
- Custom prompt builder UI
- Integration with HR platforms
- Mobile app (React Native/Flutter)

---

## 🐛 Troubleshooting

### App won't load
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Clear browser cache & reload
- Try a different browser

### QR won't scan
- Use high-quality printer
- Ensure sufficient contrast
- Try the text fallback URL
- Test QR reader app on phone

### Accessibility not working
- Refresh page after toggling settings
- Check localStorage for saved preferences
- Verify screen reader is active (macOS: Cmd+F5)
- Test with keyboard (Tab, Arrow keys, Enter)

### Data disappeared
- Check if localStorage was cleared
- Verify browser allows storage
- Try "incognito" mode
- Check device storage limits

### Performance issues
- Close unused tabs/apps
- Clear browser cache
- Check network speed (WiFi vs. cellular)
- Disable browser extensions

---

## 📞 Support & Feedback

- **GitHub Issues:** Report bugs or request features
- **Email:** [owner email if applicable]
- **Event Feedback:** Collect from facilitators post-event

---

## 📄 License

This project is provided as-is for internal use by Albatross Entertainment / AALC.

---

## 🙏 Credits

**Owner:** Tolulope Shekoni, Staff Engineer, Business Excellence
**Designed for:** AALC Year-End Event, Edison, NJ
**Built with:** Vanilla HTML/CSS/JavaScript, GitHub Pages, PWA standards

---

## 📈 Success Metrics (Event-Specific)

At the end of your event, measure:

1. **Attendance & Load Success**
   - % of attendees who successfully loaded app
   - Time-to-first-interaction distribution

2. **Engagement**
   - Mean squares marked per attendee
   - % achieving ≥1 BINGO
   - Max bingos achieved

3. **Belonging Pulse Results**
   - Mean belonging score (1–5)
   - % reporting new connection
   - Common themes in inclusion comments

4. **Accessibility**
   - % who used high contrast or large text
   - Any reported usability issues
   - Keyboard-only user feedback

5. **Business Impact**
   - Belonging score trend vs. baseline
   - Networking intent (new connections)
   - Cross-functional participation

---

**Happy connecting! 🎉**

For questions or customization, refer to the PRD or reach out to the event organizer.
