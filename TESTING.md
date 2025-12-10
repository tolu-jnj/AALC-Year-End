# AALC Affinity Bingo - Testing & QA Guide

## Pre-Event Testing Checklist

### Device Testing Matrix

Test on at least these device configurations:

| Device | iOS Version | Browser | Tested | Notes |
|--------|-------------|---------|--------|-------|
| iPhone SE | 15+ | Safari | [ ] | 375px width |
| iPhone 12/13 | 15+ | Safari | [ ] | 390px width |
| iPhone 14 Pro | 16+ | Safari | [ ] | 393px width |
| iPad (7th gen) | 15+ | Safari | [ ] | 810px width |
| Samsung S21 | 12+ | Chrome | [ ] | 360px width |
| Samsung S22 | 12+ | Chrome | [ ] | 360px width |
| Pixel 6 | 12+ | Chrome | [ ] | 412px width |
| Chrome Desktop | Latest | Chrome | [ ] | 1920x1080 |
| Safari Desktop | Latest | Safari | [ ] | macOS |
| Firefox Mobile | Latest | Firefox | [ ] | Android |

---

## Functional Testing

### 🎮 Card Generation & Gameplay

- [ ] **Card Loads**: Grid displays 5×5 cells in < 3 seconds
- [ ] **Center Free Space**: Cell at (row 2, col 2) is marked, says "FREE SPACE — Proud Member of AALC"
- [ ] **Prompts Display**: All 24 prompts visible and spelled correctly
- [ ] **No Duplicates**: Refresh page → new card generated (different prompts)
- [ ] **Seeded Cards**: Same seed (`?s=12345`) generates same card across devices

### ✔️ Marking & Unmaking

- [ ] **First Tap Marks**: Tap unmarked cell → opens name input modal
- [ ] **Modal Displays**: Shows prompt text, input field, buttons
- [ ] **Name Optional**: Can mark without entering name
- [ ] **Name Saves**: Enter name → marked, name appears below prompt
- [ ] **Unmark Works**: Tap marked cell → unmarked, name cleared
- [ ] **Double-Tap Unmark**: If in UX design, verify works

### 🏆 BINGO Detection

- [ ] **Horizontal BINGO**: Mark 5 in a row → detection triggers
- [ ] **Vertical BINGO**: Mark 5 in a column → detection triggers
- [ ] **Diagonal BINGO (↘)**: Mark top-left to bottom-right diagonal → detection
- [ ] **Diagonal BINGO (↙)**: Mark top-right to bottom-left diagonal → detection
- [ ] **Multiple BINGOs**: Achieve 2+ BINGOs → stats count correctly
- [ ] **Confetti Animation**: First BINGO triggers confetti (or gentle animation)

### 📊 Progress Tracking

- [ ] **Progress Bar**: Updates as squares marked (0–24)
- [ ] **Progress Text**: Shows "Marked X/24" and updates in real-time
- [ ] **Summary View**: Button shows count of marked, bingos, names

### 💬 Belonging Pulse

- [ ] **Form Displays**: 3 questions load correctly
- [ ] **Q1 (Likert)**: 5-point scale radio buttons work
- [ ] **Q2 (Yes/No)**: Yes/No buttons toggle correctly
- [ ] **Q3 (Text)**: Text area accepts input; character counter updates
- [ ] **Submit Button**: Submits without validation errors if at least Q1 answered
- [ ] **Thank You**: Shows confirmation; "New Card" button visible
- [ ] **Data Saved**: Close app, reopen → pulse responses still there

### 🔧 Host Mode

**Access:** `?host=true` appended to URL

- [ ] **Host Panel Appears**: Right sidebar visible on page load
- [ ] **Timer Displays**: Shows "00:10" for 10-minute round
- [ ] **Start Timer**: Countdown begins; timer updates each second
- [ ] **Pause Timer**: Pauses countdown; can resume
- [ ] **Reset Timer**: Resets to 10:00; resets selected round
- [ ] **Round Selection**: Change round (1/2/3) → updates display
- [ ] **Announcements**: Each announcement button shows overlay with text
- [ ] **Announcement Dismiss**: "Got it" button closes overlay

---

## 🎨 Accessibility Testing

### Keyboard Navigation

- [ ] **Tab**: Cycles through all interactive elements (cells, buttons, inputs)
- [ ] **Shift+Tab**: Reverse cycle works
- [ ] **Enter**: Activates focused button/cell
- [ ] **Space**: Toggles focused checkbox/radio
- [ ] **Esc**: Closes modal (if applicable)
- [ ] **Arrow Keys**: Navigate radio buttons within pulse form
- [ ] **No Keyboard Trap**: Can tab out of all elements (no focus lost)

### Screen Reader (VoiceOver, NVDA, JAWS)

Test with **one** of:
- **macOS/iOS**: VoiceOver (Cmd+F5)
- **Windows/Android**: NVDA (free) or JAWS
- **Online**: WAVE accessibility checker

- [ ] **App Title**: Announces "AALC Affinity Bingo"
- [ ] **Grid Announced**: "Bingo card grid" with role
- [ ] **Cell Labels**: Each cell announces prompt text + marked status
- [ ] **Button Labels**: All buttons have descriptive aria-labels
- [ ] **Form Labels**: Q1, Q2, Q3 labels associated with inputs
- [ ] **Live Regions**: Progress updates announced (aria-live)
- [ ] **Status Changes**: "Marked" state changes announced
- [ ] **Modals Announced**: Modal opens → focus moves; announced as modal

### Visual Accessibility

#### High Contrast Mode

- [ ] **Toggle Works**: "High Contrast" checkbox in settings
- [ ] **Colors Update**: Background, text, borders change to high-contrast palette
- [ ] **Readability**: All text readable on high-contrast background
- [ ] **Focus Visible**: Focus outline clearly visible (3px border)
- [ ] **Icons Visible**: Check marks, icons render with high contrast

#### Large Text Mode

- [ ] **Toggle Works**: "Large Text" checkbox in settings
- [ ] **Font Scales**: All text increases by ~25–50%
- [ ] **Layout Adjusts**: Grid cells resize; layout doesn't break
- [ ] **No Overflow**: No horizontal scroll on phone (375px)
- [ ] **Buttons Larger**: Touch targets remain ≥ 44px

#### Reduce Motion Mode

- [ ] **Toggle Works**: "Reduce Motion" checkbox in settings
- [ ] **Animations Disabled**: Confetti, loading spinner stop
- [ ] **Transitions Removed**: Fade/slide animations become instant
- [ ] **Functionality Same**: All features still work without motion

### Color & Contrast

- [ ] **Text Contrast**: WCAG AA (4.5:1) minimum for all text
- [ ] **Button Contrast**: Primary buttons pass contrast test
- [ ] **Color Alone**: Marked cells use shape (✓) + color
- [ ] **Focus Indicator**: Focus outline distinct (not color-only)

---

## 📱 Responsiveness Testing

### Portrait Orientation (Primary)

#### iPhone SE (375px)
- [ ] Grid fits without horizontal scroll
- [ ] Cells are square and equal size
- [ ] Header doesn't wrap awkwardly
- [ ] Buttons stack/resize appropriately
- [ ] Modal fits on screen (height < viewport)

#### iPhone 12 (390px)
- [ ] Retest all above with 390px width

#### iPad (810px)
- [ ] Grid centered with max-width
- [ ] Larger text readable
- [ ] Landscape mode works (1180px+)
- [ ] Host panel visible without covering main content

### Landscape Orientation

#### iPhone SE Landscape (667px)
- [ ] Grid resizes appropriately
- [ ] Header adjusted for landscape
- [ ] Modals still fit on screen
- [ ] No essential elements hidden

#### Tablet Landscape (1180px+)
- [ ] Host panel visible alongside grid
- [ ] Layout maximizes available space

---

## 🔒 Privacy & Data Testing

### LocalStorage

- [ ] **Data Saved**: Mark cells → refresh → data persists
- [ ] **Version Check**: localStorage has version field
- [ ] **Export Format**: Export QR contains only counts (no PII)

### Reset & Clear

- [ ] **Reset Card**: Clears grid but keeps pulse data
- [ ] **Clear All Data**: Removes all localStorage; app fresh on reload
- [ ] **Confirm Dialog**: Shows confirmation before destructive actions

### Data Not Sent

- [ ] **Network Monitor**: Open DevTools → Network tab
- [ ] **No API Calls**: After load, no POST/GET to external servers
- [ ] **Offline Check**: Enable Airplane Mode → app still works

---

## ⚡ Performance Testing

### Load Time (Chrome DevTools)

**Target: < 3s First Meaningful Paint on 4G**

1. Open Chrome DevTools (F12)
2. Go to **Performance** tab
3. Set throttle to **4G Slow** or **Fast 4G**
4. Hard reload (Cmd+Shift+R)
5. Record and measure:
   - **FCP** (First Contentful Paint): < 1.5s
   - **LCP** (Largest Contentful Paint): < 2.5s
   - **TTI** (Time to Interactive): < 5s

**Lighthouse Score**

1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Run on **Mobile** device class
4. Score targets:
   - **Performance**: > 90
   - **Accessibility**: > 95
   - **Best Practices**: > 90
   - **SEO**: > 90

### Network & Bundle Size

- [ ] **Total Size**: < 1MB (HTML + CSS + JS)
- [ ] **Requests**: < 10 total network requests
- [ ] **First Byte**: < 600ms (Time to First Byte)

### Caching (Service Worker)

- [ ] **First Load**: Network requests; slower
- [ ] **Second Load**: Instant (all cached)
- [ ] **Offline**: Disable WiFi → app still works
- [ ] **Cache Updates**: Modify CSS → refresh → new version cached

---

## 🌐 Cross-Browser Compatibility

### Desktop Browsers

- [ ] **Chrome** (Windows/Mac): Latest version
- [ ] **Safari** (Mac): 15+
- [ ] **Firefox** (Windows/Mac): Latest version
- [ ] **Edge** (Windows): Latest version

### Mobile Browsers

- [ ] **Safari** (iOS): 15+
- [ ] **Chrome** (Android): 90+
- [ ] **Firefox** (Android): Latest
- [ ] **Samsung Internet** (Samsung devices): Latest

### Known Quirks to Check

- [ ] **iOS Safari autocorrect**: Text input has autocorrect off
- [ ] **Android keyboard**: Dismiss keyboard after input
- [ ] **Safe areas**: Notches/punch holes don't hide content
- [ ] **Viewport units**: `vh` units work on mobile (bottom nav doesn't cut off)

---

## 🧪 Edge Cases & Error Handling

- [ ] **Empty Grid**: No cells display if prompts missing (shouldn't happen)
- [ ] **Exceed 24 Prompts**: Only first 24 used
- [ ] **Missing Names**: Works without names entered
- [ ] **Very Long Names**: Truncates/wraps appropriately
- [ ] **Rapid Clicks**: Double-clicking doesn't break state
- [ ] **Network Reconnection**: App continues if network drops mid-session
- [ ] **Storage Full**: Handle if localStorage nearly full
- [ ] **Browser Back Button**: Prevents weird states; reloads safely

---

## 📋 Sign-Off Checklist

Before declaring app ready for event:

- [ ] All device types tested
- [ ] All functions tested
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] Privacy confirmed
- [ ] No critical bugs
- [ ] Host mode functional
- [ ] QR code generation verified
- [ ] README updated with event details
- [ ] Facilitators trained on host mode

---

## 🐛 Bug Report Template

If you find an issue:

```markdown
**Title:** [Brief description]

**Device:** iPhone 12 / Android / Desktop
**Browser:** Safari / Chrome / Firefox
**OS Version:** iOS 15.4 / Android 12

**Steps to Reproduce:**
1. Navigate to...
2. Tap...
3. Expected: ...
4. Actual: ...

**Screenshots/Video:** [If possible]

**Severity:** Critical / High / Medium / Low
```

---

## ✅ Final Quality Gate

- ✅ **Functionality**: All features work as designed
- ✅ **Accessibility**: WCAG 2.1 AA compliant
- ✅ **Performance**: Meets all targets
- ✅ **Privacy**: No data leaves device
- ✅ **Responsiveness**: Works on all devices
- ✅ **Browser Support**: Covers 95%+ of market
- ✅ **Documentation**: Complete and clear
- ✅ **Training**: Facilitators ready

---

**Happy testing! 🚀**
