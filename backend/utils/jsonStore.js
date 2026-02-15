const fs = require('fs');
const path = require('path');

// Helper to ensure file exists
const ensureFile = (filePath, defaultContent = []) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2), 'utf8');
    }
};

const readJson = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            // Return empty array if file doesn't exist yet (for new logs)
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return [];
    }
};

const writeJson = (filePath, data) => {
    try {
        // Atomic write approach not strictly needed for this scale, 
        // but syncing helps avoid partial writes in simple cases.
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error(`Error writing ${filePath}:`, err);
        return false;
    }
};

module.exports = { readJson, writeJson, ensureFile };
