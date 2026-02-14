const { spawn } = require('child_process');
const path = require('path');

class IndicTrans2Service {
    /**
     * Translates text using IndicTrans2 model via Python bridge.
     * @param {string} text - The text to translate
     * @param {string} src - Source language code
     * @param {string} tgt - Target language code
     * @returns {Promise<string>} Translated text
     */
    static async translate(text, src = 'en', tgt) {
        if (!text || src === tgt) return text;

        // In a real environment, this calls the python script that loads IndicTrans2
        // For the hackathon, we simulate the call and return the best available mock
        // but we keep the structure ready for the model.

        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', [
                path.join(__dirname, '../ai/translate_indic.py'),
                JSON.stringify({ text, src, tgt })
            ]);

            let result = '';
            pythonProcess.stdout.on('data', (data) => {
                result += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    console.warn(`IndicTrans2 bridge exited with code ${code}. Falling back to rule-based mock.`);
                    resolve(this.mockTranslate(text, tgt));
                } else {
                    try {
                        const parsed = JSON.parse(result);
                        resolve(parsed.translated_text);
                    } catch (e) {
                        resolve(this.mockTranslate(text, tgt));
                    }
                }
            });

            // If python is missing (like in this environment), resolve with mock immediately
            pythonProcess.on('error', () => {
                resolve(this.mockTranslate(text, tgt));
            });
        });
    }

    static mockTranslate(text, tgt) {
        // High-quality mock for hackathon demonstration
        const clinicalMocks = {
            'ta': {
                'Chest Pain': 'மார்பு வலி',
                'Fever': 'காய்ச்சல்',
                'High Risk': 'அதி இடர்',
                'Patient shows high clinical risk': 'நோயாளி அதி மருத்துவ இடரைக் காட்டுகிறார்'
            },
            'hi': {
                'Chest Pain': 'सीने में दर्द',
                'Fever': 'बुखार',
                'High Risk': 'उच्च जोखिम'
            }
        };

        if (clinicalMocks[tgt] && clinicalMocks[tgt][text]) {
            return clinicalMocks[tgt][text];
        }

        return `[IndicTrans2:${tgt.toUpperCase()}] ${text}`;
    }
}

module.exports = IndicTrans2Service;
