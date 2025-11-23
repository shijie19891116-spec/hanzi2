import React from 'react';
import { CharacterData } from '../types';

interface InfoCardProps {
  data: CharacterData | null;
  loading: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({ data, loading }) => {
  const speak = (text: string, lang: string = 'zh-CN') => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="w-full h-[300px] bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">正在让 AI 思考中...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-[300px] bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center justify-center">
        <p className="text-slate-400">请输入汉字开始学习</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full min-h-[300px]">
      {/* Header */}
      <div className="bg-emerald-50/50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-bold text-emerald-800">汉字详情</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col space-y-6">
        {/* Pinyin Section */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <span className="text-slate-500 text-sm font-medium">拼音</span>
          <div className="flex items-center space-x-3">
             <button 
              onClick={() => speak(data.char)}
              className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600 transition-colors"
              aria-label="Play Pinyin Audio"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
            <span className="serif text-4xl font-bold text-slate-800">{data.pinyin}</span>
          </div>
        </div>

        {/* Definition Section */}
        <div className="space-y-1">
           <span className="text-slate-500 text-sm font-medium">释义</span>
           <p className="text-slate-700 text-lg leading-relaxed font-medium">{data.definition}</p>
        </div>

        {/* Example Box */}
        <div className="mt-auto bg-amber-50 rounded-lg p-4 border border-amber-100 relative group">
          <div className="flex items-center mb-2 space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-amber-700 text-xs font-bold uppercase tracking-wider">例句</span>
          </div>
          
          <button 
              onClick={() => speak(data.example)}
              className="absolute top-4 right-4 text-amber-400 hover:text-amber-600 transition-colors"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
          </button>

          <p className="text-slate-800 text-lg font-medium mb-1 pr-8">"{data.example}"</p>
          <p className="text-slate-500 text-sm font-light italic">{data.exampleTranslation}</p>
        </div>
      </div>
    </div>
  );
};