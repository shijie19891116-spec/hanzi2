import React, { useState, useCallback } from 'react';
import HanziWriter from 'hanzi-writer';
import { fetchCharacterDetails } from './services/geminiService';
import { CharacterData } from './types';
import { HanziBoard } from './components/HanziBoard';
import { InfoCard } from './components/InfoCard';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [currentChar, setCurrentChar] = useState<string>('猫'); // Default character
  const [charData, setCharData] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [writerInstance, setWriterInstance] = useState<HanziWriter | null>(null);

  // Initialize data on first load
  React.useEffect(() => {
    handleSearch('猫');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (charToSearch: string) => {
    if (!charToSearch) return;
    const char = charToSearch.charAt(0); // Take first char only
    
    setLoading(true);
    setCurrentChar(char);
    
    try {
      const data = await fetchCharacterDetails(char);
      setCharData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onGenerateClick = () => {
    if (inputText.trim()) {
      handleSearch(inputText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onGenerateClick();
    }
  };

  const handleWriterLoad = useCallback((writer: HanziWriter) => {
    setWriterInstance(writer);
    writer.animateCharacter();
  }, []);

  const animateWriter = () => {
    writerInstance?.animateCharacter();
  };

  const startQuiz = () => {
    writerInstance?.quiz();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#f8fafc] text-slate-800 pb-10">
      
      {/* Header */}
      <header className="w-full text-center pt-12 pb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-3 tracking-tight flex items-center justify-center gap-3">
          <span className="text-4xl">✍️</span>
          <span>shijie汉字笔画学习器</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">Interactive Stroke Order Practice Board</p>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl px-4 flex flex-col gap-8">
        
        {/* Input Section */}
        <div className="w-full max-w-xl mx-auto flex gap-3 shadow-lg p-2 bg-white rounded-xl border border-slate-200">
          <input
            type="text"
            className="flex-1 px-4 py-3 text-xl rounded-lg border-2 border-transparent focus:border-emerald-500 focus:bg-emerald-50/30 outline-none transition-all placeholder-slate-400"
            placeholder="输入汉字 (Enter a character)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            maxLength={1}
          />
          <button
            onClick={onGenerateClick}
            disabled={loading}
            className={`px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-md flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )}
            <span>生成笔画</span>
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-4">
          
          {/* Left Column: Hanzi Writer */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 transform hover:scale-[1.01] transition-transform duration-300">
              <HanziBoard character={currentChar} onLoad={handleWriterLoad} />
              
              <div className="text-center mt-6 text-slate-400 text-sm font-medium">
                准备就绪！选择模式开始。
              </div>
            </div>

            <div className="flex gap-4 w-full justify-center max-w-[350px]">
              <button
                onClick={animateWriter}
                className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                演示笔画
              </button>
              <button
                onClick={startQuiz}
                className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-full shadow-lg shadow-slate-800/20 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                开始描红
              </button>
            </div>
          </div>

          {/* Right Column: Info Card */}
          <div className="h-full">
            <InfoCard data={charData} loading={loading} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-16 text-slate-400 text-sm font-medium">
        © 2025 由 shijie 制作
      </footer>
    </div>
  );
};

export default App;