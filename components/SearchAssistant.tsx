
import React, { useState, useRef } from 'react';
import { getSmartMatches } from '../services/geminiService';
import { Vendor } from '../types';

interface SearchAssistantProps {
  vendors: Vendor[];
  onMatchesFound: (message: string, ids: string[]) => void;
}

const SearchAssistant: React.FC<SearchAssistantProps> = ({ vendors, onMatchesFound }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [guideTip, setGuideTip] = useState('Type your event needs or tap the mic to speak.');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (textToSearch: string) => {
    if (!textToSearch.trim()) return;

    setLoading(true);
    setGuideTip('Finding the perfect connection for you...');
    try {
      const result = await getSmartMatches(textToSearch, vendors);
      onMatchesFound(result.message, result.recommendedIds);
      setInput('');
      setGuideTip('I found some experts for you. Take a look below.');
    } catch (error) {
      console.error(error);
      setGuideTip('Connection hiccup. Let me try again.');
    } finally {
      setLoading(false);
      setIsListening(false);
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      setGuideTip('Listening paused.');
      return;
    }
    
    setIsListening(true);
    setGuideTip('Listening to your event needs...');
    
    // Simulating browser speech recognition start
    setTimeout(() => {
      if (isListening) {
         const voiceInput = "Find me a high-energy DJ in Lagos";
         setInput(voiceInput);
         setGuideTip(`" ${voiceInput} " - Processing connection...`);
         setTimeout(() => handleSearch(voiceInput), 1000);
      }
    }, 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6 h-6">
        <p className="text-[12px] font-bold text-[#86868b] uppercase tracking-widest transition-all duration-500">
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
        className="relative flex items-center bg-white rounded-full border border-black/[0.1] shadow-sm transition-all hover:border-black/[0.2] p-2 focus-within:ring-8 focus-within:ring-black/[0.02]"
      >
        <div className="pl-6 text-[#86868b]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Who do you need for your event?"
          className="flex-grow bg-transparent border-none outline-none text-black px-4 py-4 placeholder:text-[#86868b] text-lg font-bold"
          disabled={loading}
        />
        
        <button
          type="button"
          onClick={toggleVoice}
          className={`p-4 rounded-full transition-all flex items-center justify-center mr-1 ${isListening ? 'bg-black text-white shadow-lg' : 'text-[#86868b] hover:text-black hover:bg-[#f5f5f7]'}`}
          title="Voice Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-apple px-8 py-4 disabled:opacity-20 text-[13px] uppercase tracking-widest font-extrabold"
        >
          {loading ? "..." : "Go"}
        </button>
      </form>
      
      <div className="mt-8 flex flex-wrap gap-x-10 gap-y-2 text-[10px] font-bold text-[#86868b] justify-center uppercase tracking-[0.3em] opacity-40">
        <span>Instant Access</span>
        <span>Verified Experts</span>
        <span>Nigeria Wide</span>
      </div>
    </div>
  );
};

export default SearchAssistant;
