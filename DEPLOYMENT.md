# 🚀 AALC Affinity Bingo - Deployment Guide

## Quick Deploy (5 Minutes)

### Step 1: Push Code to GitHub

```bash
cd /workspaces/AALC-Year-End
git add .
git commit -m "Add AALC Affinity Bingo application - ready for deployment"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to repo: https://github.com/tolu-jnj/AALC-Year-End
2. Click **Settings** (tab at top)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source:** Select `Deploy from a branch`
   - **Branch:** Select `main` and `/root`
   - Click **Save**

GitHub will build and deploy automatically. **Takes 1–2 minutes.**

### Step 3: Verify Deployment

- Open: https://tolu-jnj.github.io/AALC-Year-End/
- Should load in < 3 seconds
- Check Network tab (DevTools) for ~200 response codes

### Step 4: Generate QR Codes

Use any QR generator:
- **Main URL:** https://tolu-jnj.github.io/AALC-Year-End/
- **Host Mode:** https://tolu-jnj.github.io/AALC-Year-End/?host=true

Print both QR codes for event flyers.

---

## 🧪 Pre-Event Testing (1 Hour)

### Test Checklist

- [ ] **Load Time:** Open on 4G → should be < 3s
- [ ] **Mobile:** Works on iPhone and Android
- [ ] **Marking:** Tap cell → modal opens → can mark
- [ ] **BINGO:** Mark 5 in a row → confetti triggers
- [ ] **Pulse:** Click "View Summary" → "Start Belonging Pulse" → submit form
- [ ] **Host Mode:** Open with `?host=true` → timer visible → can start/pause
- [ ] **Offline:** Disable WiFi → app still works

### Performance Check

Open DevTools (F12) → **Lighthouse** tab:
- Run performance audit on **Mobile**
- Target: Performance score > 90

### Accessibility Check

- [ ] **Keyboard:** Tab through all elements
- [ ] **Screen Reader:** Turn on VoiceOver (Mac) or NVDA (Windows)
  - Should announce grid, cells, buttons

---

## 📋 Event Day Setup

### Before Event Starts (30 min before)

1. **Verify WiFi/4G:**
   - Test download speed (≥ 5 Mbps preferred)
   - Confirm coverage in venue

2. **Prepare Facilitator:**
   - Open host mode: `?host=true`
   - Test timer start/pause
   - Review announcements

3. **Print Materials:**
   - Main QR (attendees)
   - Host QR (backup link)
   - Help posters with URL fallback

4. **Test Device Diversity:**
   - Have someone test on their phone
   - Verify QR scans

### During Event

1. **Attendees Arrive:**
   - Scan QR or type URL
   - Should see loading screen → bingo card

2. **Facilitator Role:**
   - Start timer for each 10-min round
   - Show announcements at 0, 10, 20, 30 min
   - Call "Final 5 minutes!" near end

3. **Final 5 Minutes:**
   - Announce pulse survey
   - Direct to "View Summary" → "Start Belonging Pulse"

4. **Wrap-Up:**
   - Thank attendees
   - Collect feedback

---

## 🔧 Troubleshooting During Event

### App Won't Load

**Quick Fix:**
1. Hard refresh (Ctrl+F5 or Cmd+Shift+R)
2. Check WiFi connection
3. Clear browser cache (Settings)
4. Try different browser

**Fallback:** Share text URL (if QR fails)

### QR Scan Issues

**Fix:**
- Use different QR scanner app
- Test on different phone
- Print with higher quality/contrast

**Fallback:** Share text URL in SMS/email

### Data Disappeared

**Cause:** Browser cache cleared or incognito mode
**Fix:** Refresh page; data will regenerate if still in localStorage

### Host Timer Not Showing

**Check:**
- URL has `?host=true` exactly
- Hard refresh (Ctrl+F5)
- Try different browser

---

## 📊 Post-Event Data Collection

### Manual Metrics Collection

**Option 1: Each attendee exports summary**
1. Click "View Summary"
2. Click "Export Summary (QR)"
3. Facilitator scans QR from phone
4. Aggregates counts in spreadsheet

**Option 2: Pulse data extraction**
1. Ask attendees who allow: share browser storage
2. Or manually collect pulse responses
3. Note: No backend yet; manual aggregation only

### Suggested Metrics to Capture

```
Event Date: _______________
Total Attendees: __________

Engagement:
- Attendees who loaded app: ____
- Avg squares marked: ____
- % achieving ≥1 BINGO: ____

Belonging Pulse:
- Response rate: ____% 
- Avg belonging score (1-5): ____
- % reporting new connection: ____%

Issues:
- WiFi outages: Yes / No
- QR scan failures: ______
- Browser crashes: ______
```

---

## 🌐 Custom Domain (Optional)

If you want a shorter URL:

1. **Buy domain** (e.g., `aalcbingo.com`)
2. **Go to repo Settings** → **Pages**
3. Under "Custom domain," enter domain name
4. **Configure DNS records** (depends on registrar):
   - Point to GitHub Pages IP: `185.199.108.153`
   - Or use CNAME: `tolu-jnj.github.io`
5. Wait for DNS propagation (up to 24 hours)

GitHub will auto-enable HTTPS.

---

## 🔄 Version Updates

To release a new version after the event:

1. **Edit files** (e.g., update prompts)
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update prompts for next event"
   git push origin main
   ```
3. **GitHub Pages auto-deploys** (1–2 min)
4. **Update cache in Service Worker** if needed:
   ```javascript
   // In sw.js
   const CACHE_NAME = 'aalc-bingo-v1-1'; // Increment version
   ```

---

## 📱 Install Instructions for Users

### iOS (Add to Home Screen)

1. Open Safari
2. Navigate to URL or scan QR
3. Tap **Share** button (bottom)
4. Scroll down, tap **Add to Home Screen**
5. Tap **Add**

App now appears on home screen like a native app.

### Android (Install App)

1. Open Chrome
2. Navigate to URL or scan QR
3. Tap **Menu** (⋮) → **Install app**
4. Tap **Install**

App now appears in app drawer like a native app.

---

## 🛡️ Security Checklist

- ✅ No passwords required (simpler UX)
- ✅ No user authentication (no data tied to identity)
- ✅ No API keys exposed in code
- ✅ No analytics trackers by default
- ✅ HTTPS enabled (GitHub Pages default)
- ✅ No third-party CDN dependencies

---

## 📞 Support Contacts

- **GitHub Issues:** Report bugs or request features
- **Event Organizer:** Tolulope Shekoni (Staff Engineer, Business Excellence)
- **Technical Issues:** See TESTING.md for detailed troubleshooting

---

## ✅ Final Checklist Before Event

- [ ] Code deployed to GitHub Pages
- [ ] App loads successfully at https://tolu-jnj.github.io/AALC-Year-End/
- [ ] Host mode accessible at `?host=true`
- [ ] QR codes printed and tested
- [ ] Fallback text URL available
- [ ] Facilitators trained on host mode
- [ ] Accessibility features verified
- [ ] Performance acceptable on 4G
- [ ] Offline functionality tested
- [ ] WiFi/network connectivity confirmed
- [ ] Event timeline confirmed with facilitators
- [ ] Pulse survey questions finalized
- [ ] Backup devices/chargers available

---

## 🎉 You're Ready!

Your AALC Affinity Bingo app is deployed and ready for your event. 

**Good luck fostering connection and belonging!** 🎲✨

---

**Questions?** See README-NEW.md, TESTING.md, or IMPLEMENTATION.md for detailed guidance.
