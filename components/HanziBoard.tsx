import React, { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';

interface HanziBoardProps {
  character: string;
  onLoad?: (writer: HanziWriter) => void;
}

export const HanziBoard: React.FC<HanziBoardProps> = ({ character, onLoad }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!divRef.current || !character) return;

    setIsLoading(true);
    divRef.current.innerHTML = ''; // Clean up previous instance

    try {
      const writer = HanziWriter.create(divRef.current, character, {
        width: 300,
        height: 300,
        padding: 20,
        showOutline: true,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        radicalColor: '#10b981', // emerald-500
        strokeColor: '#334155',   // slate-700
      });
      
      writerRef.current = writer;
      
      // Hook into the writer's loading promise to detect when char data is ready
      // HanziWriter doesn't expose a clean Promise on create, but we can try a dummy animate to trigger load
      writer.animateCharacter({
        onComplete: () => {
           // Initial animation done
        }
      });
      
      if (onLoad) {
        onLoad(writer);
      }
      setIsLoading(false);

    } catch (e) {
      console.error("Failed to load HanziWriter", e);
      setIsLoading(false);
    }

    return () => {
      // Cleanup if necessary, though HanziWriter doesn't have a destroy method, 
      // clearing innerHTML does the trick for the DOM.
    };
  }, [character, onLoad]);

  return (
    <div className="relative group">
      {/* Rice Grid (Tian Zi Ge) Background */}
      <div className="absolute inset-0 z-0 pointer-events-none border-2 border-slate-200 rounded-lg overflow-hidden bg-white">
        {/* Vertical Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px border-r border-dashed border-slate-300 transform -translate-x-1/2"></div>
        {/* Horizontal Center Line */}
        <div className="absolute top-1/2 left-0 right-0 h-px border-b border-dashed border-slate-300 transform -translate-y-1/2"></div>
        {/* Diagonal 1 */}
        <div className="absolute top-0 left-0 w-[141%] h-px border-b border-dashed border-slate-200 origin-top-left rotate-45"></div>
        {/* Diagonal 2 */}
        <div className="absolute top-0 right-0 w-[141%] h-px border-b border-dashed border-slate-200 origin-top-right -rotate-45"></div>
      </div>

      {/* Canvas Container */}
      <div 
        ref={divRef} 
        className="relative z-10 w-[300px] h-[300px] mx-auto cursor-pointer"
        onClick={() => writerRef.current?.animateCharacter()}
      ></div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="absolute top-2 left-2 z-20">
        <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2 py-1 rounded">预览模式</span>
      </div>
    </div>
  );
};