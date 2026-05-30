// Persists the player's personal best score and job title across sessions.
// Falls back to in-memory storage when localStorage is unavailable (private mode, etc.).

const STORAGE_KEY = 'chiefJumper_personalBest';

let memoryFallback = null;

function readRaw() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch (_) {
        // Storage unavailable or corrupt; return null so caller uses fallback
    }
    return null;
}

function writeRaw(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (_) {
        return false;
    }
}

// Returns { score, title } or null if no best exists yet.
export function loadPersonalBest() {
    const stored = readRaw();
    if (stored) return stored;
    return memoryFallback;
}

// Saves score + title. Returns true if it was a new personal best.
export function saveIfPersonalBest(score, title) {
    const current = loadPersonalBest();
    if (current && current.score >= score) return false;

    const record = { score, title };
    const saved = writeRaw(record);
    if (!saved) {
        // localStorage unavailable; keep in memory for this session
        memoryFallback = record;
    }
    return true;
}
