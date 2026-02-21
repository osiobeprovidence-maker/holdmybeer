
import React, { useState, useRef, useEffect } from 'react';
import { getSmartMatches } from '../services/geminiService';
import { Vendor } from '../types';

interface SearchAssistantProps {
  vendors: Vendor[];
  onMatchesFound: (message: string, ids: string[]) => void;
  isLoggedIn?: boolean;
}

const SearchAssistant: React.FC<SearchAssistantProps> = ({ vendors, onMatchesFound, isLoggedIn }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [guideTip, setGuideTip] = useState('');
  const [fullGuideText, setFullGuideText] = useState('Start your search.');
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Typing effect for guide text
  useEffect(() => {
    let i = 0;
    setGuideTip('');
    const interval = setInterval(() => {
      if (i < fullGuideText.length) {
        setGuideTip(prev => prev + fullGuideText.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [fullGuideText]);

  const handleSearch = async (textToSearch: string) => {
    if (!textToSearch.trim()) return;

    setLoading(true);
    setFullGuideText('Finding the perfect connection for you...');
    try {
      const result = await getSmartMatches(textToSearch, vendors);
      onMatchesFound(result.message, result.recommendedIds);
      setInput('');
      setFullGuideText('I found some experts for you. Take a look below.');
    } catch (error) {
      console.error(error);
      setFullGuideText('Connection hiccup. Let me try again.');
    } finally {
      setLoading(false);
      setIsListening(false);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        if (recognitionRef.current.lastTimeout) {
          clearTimeout(recognitionRef.current.lastTimeout);
        }
      }
      setIsListening(false);
      setFullGuideText('Listening paused.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setFullGuideText('Speech recognition not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-NG';

      recognition.onstart = () => {
        setIsListening(true);
        setFullGuideText('Oya, talk to me. I dey listen...');
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Use a more robust accumulation logic for Nigerian speech patterns
        if (finalTranscript || interimTranscript) {
          const currentText = finalTranscript || interimTranscript;
          setInput(prev => {
            // If the new transcript is significantly different or longer, update it
            // This helps with the "Nigeria style" where words might be clipped or repeated
            return currentText;
          });

          if (finalTranscript) {
            setFullGuideText(`" ${finalTranscript} " - I'm listening...`);
            
            // Clear previous timeout to allow for natural pauses in Nigerian storytelling/explaining
            if (recognitionRef.current.lastTimeout) {
              clearTimeout(recognitionRef.current.lastTimeout);
            }
            
            // Wait slightly longer (2.5s) before auto-searching to capture full context
            const timeoutId = setTimeout(() => {
              handleSearch(finalTranscript);
            }, 2500);
            recognitionRef.current.lastTimeout = timeoutId;
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setFullGuideText('Microphone access denied.');
        } else {
          setFullGuideText('Try speaking again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Speech recognition failed to start:', err);
      setFullGuideText('Could not start microphone.');
      setIsListening(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-8 h-8">
        <p className="text-[12px] md:text-[14px] font-bold text-[#86868b] uppercase tracking-[0.2em] transition-all duration-500 min-h-[1.5em] typing-cursor">
          {isListening ? (
             <span className="flex items-center justify-center gap-3 text-black">
               <span className="voice-wave">
                 <span className="voice-bar !bg-black"></span>
                 <span className="voice-bar !bg-black"></span>
                 <span className="voice-bar !bg-black"></span>
                 <span className="voice-bar !bg-black"></span>
               </span>
               {guideTip}
             </span>
          ) : guideTip}
        </p>
      </div>

      <form 
        onSubmit={(e) => { e.preventDefault(); handleSearch(input); }} 
        className="relative flex items-center bg-white rounded-[32px] border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:border-black/[0.15] p-2 md:p-3 focus-within:ring-4 focus-within:ring-black/[0.02] w-full overflow-hidden"
      >
        <div className="hidden md:block pl-6 text-black/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Expert Retrieval Agent…"
          className="flex-1 bg-transparent border-none outline-none text-black px-4 md:px-6 py-4 md:py-5 placeholder:text-black/20 text-base md:text-xl font-medium min-w-0"
          disabled={loading}
        />
        
        <div className="flex items-center gap-2 pr-2">
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-3 md:p-4 rounded-2xl transition-all flex items-center justify-center gap-2 ${isListening ? 'bg-black text-white shadow-lg scale-110 px-5' : 'text-[#86868b] hover:text-black hover:bg-[#f5f5f7]'}`}
            title={isListening ? "Stop Listening" : "Voice Search"}
          >
            {isListening && <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Stop</span>}
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isListening ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              )}
            </svg>
          </button>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-black text-white p-3 md:p-4 rounded-2xl disabled:opacity-10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </form>
      
      {!isLoggedIn && (
        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-3 text-[10px] font-bold text-[#86868b] justify-center uppercase tracking-[0.4em] opacity-30">
        </div>
      )}
    </div>
  );
};

export default SearchAssistant;
