/**
 * AALC Affinity Bingo - Main Application Logic
 * All client-side, no backend dependencies
 */

// ============================================================================
// UTILITIES & HELPERS
// ============================================================================

/**
 * Seeded Random Number Generator (mulberry32)
 * Provides deterministic random numbers based on a seed
 */
function seededRandom(seed) {
    return function() {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Fisher-Yates Shuffle with seed
 */
function shuffleWithSeed(array, seed) {
    const rng = seededRandom(seed);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Generate a seed from URL or create a random one
 */
function generateCardSeed() {
    const urlParams = new URLSearchParams(window.location.search);
    const seedParam = urlParams.get('s');
    if (seedParam) return parseInt(seedParam, 10);
    return Math.floor(Math.random() * 2147483647);
}

/**
 * Generate unique card ID based on seed
 */
function generateCardId(seed) {
    return 'aalc_' + seed.toString(36);
}

/**
 * Detect BINGO patterns (rows, columns, diagonals)
 */
function detectBingos(grid) {
    const marked = grid.map(cell => cell.marked);
    const bingos = [];

    // Check rows
    for (let r = 0; r < 5; r++) {
        const row = marked.slice(r * 5, r * 5 + 5);
        if (row.every(m => m)) {
            bingos.push({
                type: 'row',
                index: r,
                cells: row.map((_, i) => r * 5 + i)
            });
        }
    }

    // Check columns
    for (let c = 0; c < 5; c++) {
        const col = [0, 1, 2, 3, 4].map(r => marked[r * 5 + c]);
        if (col.every(m => m)) {
            bingos.push({
                type: 'column',
                index: c,
                cells: col.map((_, i) => i * 5 + c)
            });
        }
    }

    // Check diagonal (top-left to bottom-right)
    const diag1 = [0, 6, 12, 18, 24].map(i => marked[i]);
    if (diag1.every(m => m)) {
        bingos.push({
            type: 'diagonal',
            index: 1,
            cells: [0, 6, 12, 18, 24]
        });
    }

    // Check diagonal (top-right to bottom-left)
    const diag2 = [4, 8, 12, 16, 20].map(i => marked[i]);
    if (diag2.every(m => m)) {
        bingos.push({
            type: 'diagonal',
            index: 2,
            cells: [4, 8, 12, 16, 20]
        });
    }

    return bingos;
}

/**
 * Format time MM:SS
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Simple confetti animation
 */
function triggerConfetti() {
    if (document.body.classList.contains('reduce-motion')) return;

    const canvas = document.getElementById('confettiCanvas');
    canvas.classList.remove('hidden');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -20,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 4 + 2,
            life: 1,
            color: ['#c41e3a', '#d4af37', '#2d5016', '#666'][Math.floor(Math.random() * 4)]
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of particles) {
            p.y += p.vy;
            p.vx *= 0.99;
            p.life -= 0.01;
            if (p.life > 0) {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fillRect(p.x, p.y, 4, 4);
            }
        }
        ctx.globalAlpha = 1;
        if (particles.some(p => p.life > 0)) {
            requestAnimationFrame(animate);
        } else {
            canvas.classList.add('hidden');
        }
    }
    animate();
}

// ============================================================================
// APPLICATION STATE & STORAGE
// ============================================================================

class BingoApp {
    constructor() {
        this.currentScreen = 'loading';
        this.seed = generateCardSeed();
        this.cardId = generateCardId(this.seed);
        this.grid = [];
        this.stats = {
            squares_marked: 0,
            bingos: 0,
            first_bingo_ts: null
        };
        this.pulse = {
            belonging_score: null,
            new_connection: null,
            inclusion_comment: ''
        };
        this.hostMode = false;
        this.timer = {
            running: false,
            remaining: 600, // 10 minutes
            round: 1
        };
        this.currentCell = null;

        this.initializeApp();
    }

    initializeApp() {
        this.loadFromStorage();
        this.checkHostMode();
        this.setupEventListeners();
        this.showScreen('a11y');
    }

    loadFromStorage() {
        const stored = localStorage.getItem('aalc_bingo_v1');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.grid = data.grid || [];
                this.stats = data.stats || this.stats;
                this.pulse = data.pulse || this.pulse;
            } catch (e) {
                console.error('Failed to load stored data:', e);
            }
        }

        if (this.grid.length === 0) {
            this.generateCard();
        }
    }

    generateCard() {
        const shuffled = shuffleWithSeed([...PROMPTS], this.seed);
        this.grid = [];

        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (r === 2 && c === 2) {
                    // Center FREE SPACE
                    this.grid.push({
                        id: 'free',
                        text: FREE_SPACE_TEXT,
                        marked: true,
                        name: ''
                    });
                } else {
                    const prompt = shuffled.pop();
                    this.grid.push({
                        id: prompt.id,
                        text: prompt.text,
                        marked: false,
                        name: ''
                    });
                }
            }
        }

        this.saveToStorage();
    }

    saveToStorage() {
        const data = {
            card_id: this.cardId,
            grid: this.grid,
            stats: this.stats,
            pulse: this.pulse,
            version: '1.0.0'
        };
        localStorage.setItem('aalc_bingo_v1', JSON.stringify(data));
    }

    checkHostMode() {
        const urlParams = new URLSearchParams(window.location.search);
        this.hostMode = urlParams.get('host') === 'true';
    }

    markCell(index, name = '') {
        if (index === 12) return; // FREE SPACE cannot be unmarked
        const cell = this.grid[index];
        cell.marked = true;
        cell.name = name;

        this.updateStats();
        this.saveToStorage();
        this.renderGrid();
        this.updateProgress();

        const bingos = detectBingos(this.grid);
        if (bingos.length > 0 && this.stats.first_bingo_ts === null) {
            this.stats.first_bingo_ts = Date.now();
            triggerConfetti();
        }

        this.saveToStorage();
    }

    unmarkCell(index) {
        if (index === 12) return; // FREE SPACE cannot be unmarked
        const cell = this.grid[index];
        cell.marked = false;
        cell.name = '';

        this.updateStats();
        this.saveToStorage();
        this.renderGrid();
        this.updateProgress();
    }

    updateStats() {
        this.stats.squares_marked = this.grid.filter(c => c.marked).length;
        const bingos = detectBingos(this.grid);
        this.stats.bingos = bingos.length;
    }

    resetCard() {
        if (confirm('This will clear all your progress. Continue?')) {
            localStorage.removeItem('aalc_bingo_v1');
            this.grid = [];
            this.stats = {
                squares_marked: 0,
                bingos: 0,
                first_bingo_ts: null
            };
            this.pulse = {
                belonging_score: null,
                new_connection: null,
                inclusion_comment: ''
            };
            this.generateCard();
            this.renderGrid();
            this.updateProgress();
            this.showScreen('bingo');
        }
    }

    clearAllData() {
        if (confirm('This will permanently delete all data. Continue?')) {
            localStorage.clear();
            location.reload();
        }
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const screen = document.getElementById(screenName + 'Screen');
        if (screen) {
            screen.classList.remove('hidden');
            this.currentScreen = screenName;
        }
    }

    renderGrid() {
        const grid = document.getElementById('bingoGrid');
        grid.innerHTML = '';

        this.grid.forEach((cell, index) => {
            const cellEl = document.createElement('button');
            cellEl.className = 'bingo-cell';
            cellEl.setAttribute('role', 'gridcell');
            cellEl.setAttribute('aria-label', `${cell.text}${cell.marked ? ', marked' : ''}`);
            cellEl.setAttribute('data-index', index);

            if (cell.marked) {
                cellEl.classList.add('marked');
                if (cell.id === 'free') {
                    cellEl.classList.add('free-space');
                }
            }

            if (cell.id === 'free') {
                cellEl.classList.add('free-space');
            }

            let content = cell.text;
            if (cell.marked && cell.name) {
                content += `<div class="cell-name">${cell.name}</div>`;
            }
            if (cell.marked && cell.id !== 'free') {
                content += '<div class="cell-checkmark">✓</div>';
            }

            cellEl.innerHTML = content;

            cellEl.addEventListener('click', () => this.handleCellClick(index));
            cellEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCellClick(index);
                }
            });

            grid.appendChild(cellEl);
        });
    }

    handleCellClick(index) {
        const cell = this.grid[index];
        if (cell.id === 'free') return;

        if (cell.marked) {
            // Double tap or click to unmark
            this.unmarkCell(index);
        } else {
            // Open modal to get name
            this.openCellModal(index);
        }
    }

    openCellModal(index) {
        this.currentCell = index;
        const cell = this.grid[index];
        document.getElementById('cellPrompt').textContent = cell.text;
        document.getElementById('cellNameInput').value = '';
        document.getElementById('cellModal').classList.remove('hidden');
        document.getElementById('cellNameInput').focus();
    }

    closeCellModal() {
        document.getElementById('cellModal').classList.add('hidden');
        this.currentCell = null;
    }

    confirmCellMark() {
        if (this.currentCell === null) return;
        const name = document.getElementById('cellNameInput').value.trim();
        this.markCell(this.currentCell, name);
        this.closeCellModal();
    }

    updateProgress() {
        const progressText = document.getElementById('progressText');
        progressText.textContent = `Marked ${this.stats.squares_marked}/24`;

        const progressFill = document.getElementById('progressFill');
        const percentage = (this.stats.squares_marked / 24) * 100;
        progressFill.style.width = percentage + '%';
    }

    updateSummary() {
        document.getElementById('statMarked').textContent = this.stats.squares_marked;
        document.getElementById('statBingos').textContent = this.stats.bingos;
        const namesCount = this.grid.filter(c => c.marked && c.name).length;
        document.getElementById('statNames').textContent = namesCount;
    }

    startPulse() {
        document.getElementById('pulseForm').style.display = 'block';
        document.getElementById('pulseThankYou').classList.add('hidden');
        this.showScreen('pulse');
    }

    submitPulse() {
        const formData = new FormData(document.getElementById('pulseForm'));
        this.pulse.belonging_score = parseInt(formData.get('q1_belonging')) || null;
        this.pulse.new_connection = formData.get('q2_connection') === 'true';
        this.pulse.inclusion_comment = formData.get('q3_inclusion_comment') || '';

        this.saveToStorage();

        // Show thank you
        document.getElementById('pulseForm').style.display = 'none';
        document.getElementById('pulseThankYou').classList.remove('hidden');
    }

    startNewCard() {
        this.resetCard();
    }

    // ========================================================================
    // HOST MODE FEATURES
    // ========================================================================

    initHostMode() {
        if (!this.hostMode) return;

        const hostPanel = document.getElementById('hostPanel');
        hostPanel.classList.remove('hidden');

        document.getElementById('startTimerBtn').addEventListener('click', () => this.startTimer());
        document.getElementById('pauseTimerBtn').addEventListener('click', () => this.pauseTimer());
        document.getElementById('resetTimerBtn').addEventListener('click', () => this.resetTimer());
        document.getElementById('roundSelect').addEventListener('change', (e) => {
            this.timer.round = parseInt(e.target.value);
            this.resetTimer();
        });

        document.getElementById('closeHostBtn').addEventListener('click', () => {
            hostPanel.classList.add('hidden');
        });

        // Announcements
        const announcements = [
            'Take 60 seconds to share your recent win!',
            'Rotate to the next table. Good luck!',
            'Final 5 minutes! Get one more bingo before time\'s up!'
        ];

        document.getElementById('announcement1Btn').addEventListener('click', () => {
            this.showAnnouncement(announcements[0]);
        });
        document.getElementById('announcement2Btn').addEventListener('click', () => {
            this.showAnnouncement(announcements[1]);
        });
        document.getElementById('announcement3Btn').addEventListener('click', () => {
            this.showAnnouncement(announcements[2]);
        });
    }

    startTimer() {
        if (this.timer.running) return;
        this.timer.running = true;

        document.getElementById('startTimerBtn').classList.add('hidden');
        document.getElementById('pauseTimerBtn').classList.remove('hidden');

        const timerDisplay = document.getElementById('timerDisplay');
        timerDisplay.classList.remove('hidden');

        const tick = () => {
            if (!this.timer.running) return;

            timerDisplay.textContent = formatTime(this.timer.remaining);

            if (this.timer.remaining <= 0) {
                this.pauseTimer();
                this.showAnnouncement('Time\'s up!');
                return;
            }

            this.timer.remaining--;
            setTimeout(tick, 1000);
        };

        tick();
    }

    pauseTimer() {
        this.timer.running = false;
        document.getElementById('startTimerBtn').classList.remove('hidden');
        document.getElementById('pauseTimerBtn').classList.add('hidden');
    }

    resetTimer() {
        this.timer.running = false;
        this.timer.remaining = 600; // 10 minutes
        document.getElementById('timerDisplay').textContent = formatTime(this.timer.remaining);
        document.getElementById('startTimerBtn').classList.remove('hidden');
        document.getElementById('pauseTimerBtn').classList.add('hidden');
    }

    showAnnouncement(message) {
        document.getElementById('announcementText').textContent = message;
        document.getElementById('announcementOverlay').classList.remove('hidden');
        document.getElementById('announcementCloseBtn').focus();
    }

    closeAnnouncement() {
        document.getElementById('announcementOverlay').classList.add('hidden');
    }

    // ========================================================================
    // ACCESSIBILITY & SETTINGS
    // ========================================================================

    setupAccessibility() {
        const highContrast = localStorage.getItem('aalc_highContrast') === 'true';
        const largeFont = localStorage.getItem('aalc_largeFont') === 'true';
        const reduceMotion = localStorage.getItem('aalc_reduceMotion') === 'true';

        if (highContrast) document.body.classList.add('high-contrast');
        if (largeFont) document.body.classList.add('large-font');
        if (reduceMotion) document.body.classList.add('reduce-motion');

        // A11y setup screen
        document.getElementById('highContrastToggle').checked = highContrast;
        document.getElementById('largeFontToggle').checked = largeFont;
        document.getElementById('reduceMotionToggle').checked = reduceMotion;

        document.getElementById('continueA11yBtn').addEventListener('click', () => {
            this.saveAccessibilityPreferences();
        });
    }

    saveAccessibilityPreferences() {
        const highContrast = document.getElementById('highContrastToggle').checked;
        const largeFont = document.getElementById('largeFontToggle').checked;
        const reduceMotion = document.getElementById('reduceMotionToggle').checked;

        localStorage.setItem('aalc_highContrast', highContrast);
        localStorage.setItem('aalc_largeFont', largeFont);
        localStorage.setItem('aalc_reduceMotion', reduceMotion);

        document.body.classList.toggle('high-contrast', highContrast);
        document.body.classList.toggle('large-font', largeFont);
        document.body.classList.toggle('reduce-motion', reduceMotion);

        this.showScreen('bingo');
    }

    setupSettingsModal() {
        const highContrast = localStorage.getItem('aalc_highContrast') === 'true';
        const largeFont = localStorage.getItem('aalc_largeFont') === 'true';
        const reduceMotion = localStorage.getItem('aalc_reduceMotion') === 'true';

        document.getElementById('settingsHighContrast').checked = highContrast;
        document.getElementById('settingsLargeFont').checked = largeFont;
        document.getElementById('settingsReduceMotion').checked = reduceMotion;

        document.getElementById('settingsHighContrast').addEventListener('change', (e) => {
            localStorage.setItem('aalc_highContrast', e.target.checked);
            document.body.classList.toggle('high-contrast', e.target.checked);
        });

        document.getElementById('settingsLargeFont').addEventListener('change', (e) => {
            localStorage.setItem('aalc_largeFont', e.target.checked);
            document.body.classList.toggle('large-font', e.target.checked);
        });

        document.getElementById('settingsReduceMotion').addEventListener('change', (e) => {
            localStorage.setItem('aalc_reduceMotion', e.target.checked);
            document.body.classList.toggle('reduce-motion', e.target.checked);
        });
    }

    // ========================================================================
    // EVENT LISTENERS SETUP
    // ========================================================================

    setupEventListeners() {
        // Accessibility
        this.setupAccessibility();
        this.setupSettingsModal();

        // Main buttons
        document.getElementById('helpBtn').addEventListener('click', () => {
            document.getElementById('helpModal').classList.remove('hidden');
        });

        document.getElementById('summaryBtn').addEventListener('click', () => {
            this.updateSummary();
            this.showScreen('summary');
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.remove('hidden');
        });

        // Cell modal
        document.getElementById('cellModal').querySelector('.modal-close').addEventListener('click', () => {
            this.closeCellModal();
        });

        document.getElementById('cellCancelBtn').addEventListener('click', () => {
            this.closeCellModal();
        });

        document.getElementById('cellConfirmBtn').addEventListener('click', () => {
            this.confirmCellMark();
        });

        document.getElementById('cellNameInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.confirmCellMark();
            }
        });

        // Summary screen
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showScreen('bingo');
        });

        document.getElementById('pulseBtn').addEventListener('click', () => {
            this.startPulse();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetCard();
        });

        // Pulse screen
        document.getElementById('pulsBackBtn').addEventListener('click', () => {
            this.showScreen('summary');
        });

        document.getElementById('pulseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitPulse();
        });

        document.getElementById('newCardBtn').addEventListener('click', () => {
            this.startNewCard();
        });

        // Character counter for pulse
        document.getElementById('q3_comment').addEventListener('input', (e) => {
            document.getElementById('charCount').textContent = e.target.value.length;
        });

        // Help modal
        document.getElementById('helpModal').querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('helpModal').classList.add('hidden');
        });

        document.getElementById('helpCloseBtn').addEventListener('click', () => {
            document.getElementById('helpModal').classList.add('hidden');
        });

        // Settings modal
        document.getElementById('settingsModal').querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.add('hidden');
        });

        document.getElementById('settingsCloseBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.add('hidden');
        });

        document.getElementById('clearDataBtn').addEventListener('click', () => {
            this.clearAllData();
        });

        document.getElementById('enableHostBtn').addEventListener('click', () => {
            window.location.href = '?host=true';
        });

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.showExportQR();
        });

        // Announcements
        document.getElementById('announcementCloseBtn').addEventListener('click', () => {
            this.closeAnnouncement();
        });

        // Host Mode
        this.initHostMode();
    }

    showExportQR() {
        const data = {
            card_id: this.cardId,
            squares_marked: this.stats.squares_marked,
            bingos: this.stats.bingos,
            names_captured: this.grid.filter(c => c.marked && c.name).length
        };

        const dataStr = JSON.stringify(data);
        const dataB64 = btoa(dataStr);

        // Simple QR generation using QR API or library
        // For now, just show a base64-encoded string
        const qrContainer = document.getElementById('qrContainer');
        qrContainer.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
                <p><strong>Table Summary (No names)</strong></p>
                <code>${dataB64}</code>
            </div>
        `;

        document.getElementById('exportModal').classList.remove('hidden');

        document.getElementById('copyQrBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(dataB64);
            alert('Copied to clipboard!');
        });
    }
}

// ============================================================================
// INITIALIZE APP ON PAGE LOAD
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    const app = new BingoApp();

    // Simulate loading time, then show accessibility screen
    setTimeout(() => {
        app.renderGrid();
        app.updateProgress();
    }, 1500);
});

// Close modals when clicking overlay
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// Export modal close buttons
document.getElementById('exportCloseBtn')?.addEventListener('click', () => {
    document.getElementById('exportModal').classList.add('hidden');
});

document.getElementById('exportModal')?.querySelector('.modal-close')?.addEventListener('click', () => {
    document.getElementById('exportModal').classList.add('hidden');
});
