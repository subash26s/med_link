import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceInput = ({ onTranscriptChange, lang = 'en-US' }) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const [error, setError] = useState(null);
    const transcriptRef = useRef('');

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError('Browser does not support speech recognition.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onresult = (event) => {
            let finalChunk = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalChunk += event.results[i][0].transcript;
                }
            }

            if (finalChunk) {
                const newText = (transcriptRef.current + ' ' + finalChunk).trim();
                transcriptRef.current = newText;
                onTranscriptChange(newText);
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [onTranscriptChange, lang]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                // Reset transcript on new session? Maybe. 
                // For Kiosk we might want to append. Let's keep appending.
                // If clear needed, parent should handle it? 
                // But here I use a Ref. 
                // Let's reset Ref if parent text is empty? excessive complexity.
                // Just append for now.
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Failed to start recognition", e);
            }
        }
    };

    if (error) return <div className="text-red-500 text-sm">{error}</div>;

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                type="button"
                onClick={toggleListening}
                className={`p-8 rounded-full transition-all duration-300 transform active:scale-95 shadow-2xl ${isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-8 ring-red-200'
                    : 'bg-blue-600 hover:bg-blue-700 ring-8 ring-blue-100'
                    } text-white flex items-center justify-center`}
                title={isListening ? "Stop Recording" : "Start Recording"}
            >
                {isListening ? <MicOff size={48} /> : <Mic size={48} />}
            </button>
            <span className={`text-lg font-bold transition-colors animate-pulse ${isListening ? 'text-red-600' : 'text-slate-400'}`}>
                {isListening ? "Listening... Speak clearly" : "Tap to Speak"}
            </span>
        </div>
    );
};

export default VoiceInput;
