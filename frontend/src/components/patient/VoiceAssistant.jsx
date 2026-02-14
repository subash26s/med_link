import React, { useState } from 'react';
import { Mic, MicOff, Play, Square, Save } from 'lucide-react';

const VoiceAssistant = ({ onTranscript, lang = 'en-US' }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = lang;
        recognition.interimResults = true;
        recognition.start();

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
        };
        recognition.onend = () => {
            setIsListening(false);
            if (transcript) onTranscript(transcript);
        };
    };

    return (
        <div className="flex flex-col items-center gap-6 p-8 bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-200">
            <button
                type="button"
                onClick={startListening}
                className={`p-10 rounded-full transition-all duration-300 shadow-2xl ${isListening ? 'bg-red-500 animate-pulse ring-8 ring-red-100' : 'bg-blue-600 ring-8 ring-blue-100'
                    } text-white`}
            >
                {isListening ? <MicOff size={60} /> : <Mic size={60} />}
            </button>

            <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {isListening ? "Listening..." : "Tap to Speak"}
                </h3>
                <p className="text-slate-500 italic">
                    {transcript || "Please describe how you are feeling."}
                </p>
            </div>

            {transcript && !isListening && (
                <button
                    onClick={() => onTranscript(transcript)}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
                >
                    <Save size={20} /> Use this text
                </button>
            )}
        </div>
    );
};

export default VoiceAssistant;
