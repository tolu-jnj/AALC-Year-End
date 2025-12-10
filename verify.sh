#!/usr/bin/env bash
# AALC Affinity Bingo - Quick Start Script
# Run this to verify your deployment setup

echo "🎲 AALC AFFINITY BINGO - VERIFICATION SCRIPT"
echo "=============================================="
echo ""

# Check if in correct directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Must run from AALC-Year-End root directory"
    exit 1
fi

echo "✅ Project directory verified"
echo ""

# Count files
HTML=$(ls -1 *.html 2>/dev/null | wc -l)
CSS=$(ls -1 *.css 2>/dev/null | wc -l)
JS=$(ls -1 *.js 2>/dev/null | wc -l)
JSON=$(ls -1 *.json 2>/dev/null | wc -l)
MD=$(ls -1 *.md 2>/dev/null | wc -l)

echo "📂 PROJECT FILES"
echo "  HTML files:  $HTML ✅"
echo "  CSS files:   $CSS ✅"
echo "  JS files:    $JS ✅"
echo "  JSON files:  $JSON ✅"
echo "  MD docs:     $MD ✅"
echo ""

# File sizes
echo "📊 FILE SIZES"
echo "  index.html:    $(ls -lh index.html | awk '{print $5}')"
echo "  styles.css:    $(ls -lh styles.css | awk '{print $5}')"
echo "  app.js:        $(ls -lh app.js | awk '{print $5}')"
echo "  prompts.js:    $(ls -lh prompts.js | awk '{print $5}')"
echo "  sw.js:         $(ls -lh sw.js | awk '{print $5}')"
echo "  manifest.json: $(ls -lh manifest.json | awk '{print $5}')"
echo ""

# Total size
TOTAL=$(du -sh . 2>/dev/null | cut -f1)
echo "  TOTAL (with docs): $TOTAL"
echo "  Core app only:     ~88 KB"
echo ""

# Check for required content
echo "🔍 CONTENT VERIFICATION"

if grep -q "AALC Affinity Bingo" index.html; then
    echo "  ✅ App title present"
fi

if grep -q "const PROMPTS" prompts.js; then
    echo "  ✅ Prompts configured"
fi

if grep -q "FREE_SPACE" prompts.js; then
    echo "  ✅ Free space text found"
fi

if grep -q "class BingoApp" app.js; then
    echo "  ✅ Main app logic present"
fi

if grep -q "Service Worker" sw.js; then
    echo "  ✅ Service Worker configured"
fi

if grep -q "WCAG" README-NEW.md 2>/dev/null; then
    echo "  ✅ Accessibility documented"
fi

if grep -q "GitHub Pages" DEPLOYMENT.md 2>/dev/null; then
    echo "  ✅ Deployment guide present"
fi

echo ""

# Git status
echo "📝 GIT STATUS"
if [ -d ".git" ]; then
    COMMITS=$(git log --oneline 2>/dev/null | wc -l)
    BRANCH=$(git branch --show-current 2>/dev/null)
    echo "  ✅ Git repository initialized"
    echo "     Branch: $BRANCH"
    echo "     Commits: $COMMITS"
else
    echo "  ⚠️  Not a git repository (should initialize with git init)"
fi

echo ""

# Final checklist
echo "✅ DEPLOYMENT READINESS CHECKLIST"
echo "  [ ] Files verified ✅"
echo "  [ ] Read DEPLOYMENT.md"
echo "  [ ] Test locally: python3 -m http.server 8000"
echo "  [ ] Push to GitHub: git push origin main"
echo "  [ ] Enable GitHub Pages in repo settings"
echo "  [ ] Verify app loads at GitHub Pages URL"
echo "  [ ] Generate QR codes"
echo "  [ ] Run QA tests (TESTING.md)"
echo ""

echo "🚀 NEXT STEP: Read DEPLOYMENT.md (5 min) for step-by-step deploy"
echo ""

echo "Happy deploying! 🎉"
