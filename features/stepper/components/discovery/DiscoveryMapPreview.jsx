"use client";
import React, { useEffect, useState } from 'react';

export default function DiscoveryMapPreview({ answers = {} }) {
  const [pulse, setPulse] = useState(false);

  // Trigger a brief pulse animation whenever answers change
  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(timer);
  }, [answers]);

  // --- Derived Data for Visualization ---
  
  // 1. Determine Floor Count for the visual stack
  let visualFloors = 1; // Default
  if (answers.floors === '1-3 Floors') visualFloors = 3;
  if (answers.floors === '4-9 Floors') visualFloors = 6;
  if (answers.floors === '10+ Floors (High Rise)') visualFloors = 9;
  if (answers.floors === 'Multi-Building Campus') visualFloors = 4;

  // 2. Determine primary icon based on facility type
  const facilityIcons = {
    'Office / Corporate': '🏢',
    'Hospital / Healthcare': '🏥',
    'Mall / Retail': '🏬',
    'School / University': '🏫',
    'Warehouse / Logistics': '🏭',
    'Residential Complex': '🏘️'
  };
  const currentIcon = facilityIcons[answers.facilityType] || '📍';

  // 3. Estimate Setup Complexity / Stats
  let estimatedZones = 0;
  if (visualFloors === 3) estimatedZones = 12;
  if (visualFloors === 6) estimatedZones = 30;
  if (visualFloors === 9) estimatedZones = 50;
  if (visualFloors === 4) estimatedZones = 40; // Campus

  return (
    <div className="sticky top-24 w-full bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col h-[600px] transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <span className="text-[#1F4E79] text-base">🗺️</span>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Live Blueprint</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 bg-[#d1fae5] text-[#065f46] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-[#a7f3d0] transition-opacity ${pulse ? 'opacity-100' : 'opacity-70'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
          UPDATING
        </span>
      </div>

      {/* Main Visualization Canvas */}
      <div 
        className="flex-1 relative bg-slate-50 overflow-hidden flex items-end justify-center pb-8"
        style={{
          backgroundImage: 'linear-gradient(rgba(203,213,225,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(203,213,225,0.3) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Dynamic Building Render */}
        <div className={`relative flex flex-col items-center justify-end w-full max-w-[200px] transition-all duration-500 ${pulse ? 'scale-[1.02]' : 'scale-100'}`}>
          
          {/* Main Facility Label */}
          <div className="absolute -top-12 bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-center animate-in fade-in slide-in-from-bottom-2 z-10">
            <span className="text-xl block mb-0.5">{currentIcon}</span>
            <p className="text-[10px] font-bold text-slate-700 whitespace-nowrap">
              {answers.facilityType || 'Facility Model'}
            </p>
          </div>

          {/* Render Floors based on selection */}
          {answers.floors === 'Multi-Building Campus' ? (
            // Campus Layout (Multiple small buildings)
            <div className="flex items-end gap-4 w-full justify-center">
              <div className="w-16 h-32 bg-gradient-to-t from-[#1F4E79] to-blue-400 rounded-t-sm shadow-lg border-x border-t border-[#163a5a] opacity-80" />
              <div className="w-20 h-48 bg-gradient-to-t from-[#1F4E79] to-blue-500 rounded-t-md shadow-xl border-x border-t border-[#163a5a] z-10 relative">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:10px_10px]" />
              </div>
              <div className="w-14 h-24 bg-gradient-to-t from-[#1F4E79] to-blue-300 rounded-t-sm shadow-md border-x border-t border-[#163a5a] opacity-80" />
            </div>
          ) : (
            // Single Skyscraper/Building Layout
            <div className="w-full relative shadow-2xl flex flex-col-reverse items-center">
              {Array.from({ length: visualFloors }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-32 h-8 bg-white border-b border-x border-slate-300 first:border-b-4 first:border-b-slate-800 last:rounded-t-md last:border-t relative overflow-hidden flex items-center justify-evenly px-2"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Windows */}
                  <div className={`w-3 h-4 rounded-sm ${answers.facilityType ? 'bg-blue-100' : 'bg-slate-100'}`} />
                  <div className={`w-3 h-4 rounded-sm ${answers.facilityType ? 'bg-blue-100' : 'bg-slate-100'}`} />
                  <div className={`w-3 h-4 rounded-sm ${answers.facilityType ? 'bg-blue-100' : 'bg-slate-100'}`} />
                  <div className={`w-3 h-4 rounded-sm ${answers.facilityType ? 'bg-blue-100' : 'bg-slate-100'}`} />
                </div>
              ))}
            </div>
          )}

          {/* Ground Line */}
          <div className="absolute -bottom-1 w-[300px] h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Floating Scope Indicators */}
        {answers.scope && (
          <div className="absolute left-4 bottom-4 flex flex-col gap-2 animate-in fade-in slide-in-from-left-4">
            <div className="bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
              <span className="text-blue-500 text-xs">🚻</span>
              <span className="text-[9px] font-bold text-slate-700">{answers.scope}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats / Estimate Panel (Bottom) */}
      <div className="bg-white border-t border-slate-100 p-5 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">Estimated Deployment</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Expected Nodes</p>
            <p className="text-xl font-black text-[#1F4E79] mt-0.5">
              {estimatedZones > 0 ? `${estimatedZones}+` : '--'}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Setup Method</p>
            <p className="text-sm font-bold text-[#2E7D32] mt-1.5 flex items-center gap-1">
              <span>⚡</span> {answers.facilityType ? 'AI Template' : 'Pending'}
            </p>
          </div>
        </div>

        {/* Dynamic Helper Text */}
        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed">
          {!answers.facilityType && "Answer the questions on the left to generate your facility blueprint."}
          {answers.facilityType && answers.floors && "Your selections will automatically configure the correct hierarchy templates in the next step."}
        </p>
      </div>

    </div>
  );
}