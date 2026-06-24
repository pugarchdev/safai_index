"use client";
import React, { useState } from 'react';

// --- 1. CONFIGURATION & STYLING ---
const typeConfig = {
  building: { color: 'bg-[#1F4E79]', border: 'border-[#1F4E79]', icon: '🏢' },
  ward: { color: 'bg-[#dc2626]', border: 'border-[#dc2626]', icon: '🏥' },
  floor: { color: 'bg-[#ea580c]', border: 'border-[#ea580c]', icon: '📋' },
  zone: { color: 'bg-[#9333ea]', border: 'border-[#9333ea]', icon: '📍' },
};

// --- 2. INDIVIDUAL NODE COMPONENT ---
const HierarchyNode = ({ name, type }) => {
  const config = typeConfig[type?.toLowerCase()] || typeConfig.building;

  return (
    <div className="bg-white rounded-[14px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] border border-slate-200 w-[170px] flex flex-col items-center p-4 relative overflow-hidden group hover:border-slate-300 transition-all cursor-pointer">
      {/* Thick Top Color Band */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${config.color}`} />
      
      {/* Icon Circle */}
      <div className={`w-9 h-9 rounded-full ${config.color} text-white flex items-center justify-center text-lg mt-1 mb-2 shadow-sm`}>
        {config.icon}
      </div>
      
      {/* Text Content */}
      <p className="font-bold text-[13px] text-slate-900 text-center w-full truncate px-1" title={name}>
        {name}
      </p>
      <p className="text-[11px] font-medium text-slate-500 capitalize mt-0.5">
        {type}
      </p>
    </div>
  );
};

// --- 3. RECURSIVE TREE RENDERER (Draws the lines!) ---
const TreeNode = ({ node }) => {
  const hasChildren = node.children && node.children.length > 0;
  const multipleChildren = hasChildren && node.children.length > 1;

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div className="relative z-10">
        <HierarchyNode name={node.name} type={node.type} />
      </div>

      {/* Children Branches */}
      {hasChildren && (
        <div className="relative flex justify-center pt-8 mt-[-1px]">
          {/* Vertical stem dropping down from parent */}
          <div className="absolute top-0 left-1/2 w-px h-8 bg-slate-300 -translate-x-1/2" />

          {node.children.map((child, index) => {
            const isFirst = index === 0;
            const isLast = index === node.children.length - 1;

            return (
              <div key={child.id} className="relative flex flex-col items-center px-4">
                {/* Horizontal connection lines */}
                {multipleChildren && (
                  <div 
                    className={`absolute top-0 h-px bg-slate-300
                      ${isFirst ? 'left-1/2 right-0' : isLast ? 'left-0 right-1/2' : 'left-0 right-0'}
                    `} 
                  />
                )}
                {/* Vertical line dropping down to child */}
                <div className="absolute top-0 left-1/2 w-px h-8 bg-slate-300 -translate-x-1/2" />
                
                <div className="pt-8">
                  <TreeNode node={child} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- 4. MAIN EXPORT COMPONENT ---
export default function LiveFlowchart({ treeData = [], title = "Architecture Map" }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Pan & Zoom State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Pan & Zoom Handlers
  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = scale + (e.deltaY > 0 ? -0.1 : 0.1);
    setScale(Math.min(Math.max(0.4, newScale), 2));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const zoomIn = () => setScale(s => Math.min(s + 0.2, 2));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.4));
  const resetZoom = () => { setScale(1); setPosition({ x: 0, y: 0 }); };

  // Reusable Map Canvas Engine
  const MapCanvas = ({ showInlineControls }) => (
    <div 
      className={`flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing bg-[#f8fafc]`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Moving Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-60" 
        style={{
          backgroundImage: `linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)`,
          backgroundSize: `${40 * scale}px ${40 * scale}px`,
          backgroundPosition: `${position.x}px ${position.y}px`
        }} 
      />

      {/* Floating Inline Controls (Only show on normal view) */}
      {showInlineControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button onClick={zoomIn} className="w-8 h-8 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600 font-bold hover:bg-slate-50 flex items-center justify-center">+</button>
          <button onClick={zoomOut} className="w-8 h-8 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600 font-bold hover:bg-slate-50 flex items-center justify-center">-</button>
          <button onClick={resetZoom} className="w-8 h-8 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-600 font-bold hover:bg-slate-50 flex items-center justify-center">⊙</button>
        </div>
      )}

      {/* Center Prompt */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-400 z-10 shadow-sm">
        Drag to pan • Scroll to zoom
      </div>

      {/* The Tree Container */}
      <div 
        className="absolute top-1/2 left-1/2 origin-center"
        style={{ 
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <div className="flex gap-12 justify-center">
          {treeData.map(root => <TreeNode key={root.id} node={root} />)}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── STANDARD INLINE VIEW ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[600px] overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-white z-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-black text-sm text-slate-700 uppercase tracking-widest">{title}</h3>
              <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-emerald-200">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> LIVE
              </span>
            </div>
            
            {/* Legend */}
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">🏢 Building</span>
              <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100">📋 Floor</span>
              <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">📍 Zone</span>
              <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">🏥 Ward</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
              <input type="text" placeholder="Search" className="pl-8 pr-3 py-2 text-xs border-[1.5px] border-slate-200 rounded-lg outline-none focus:border-[#1F4E79] w-48 font-medium" />
            </div>
            <button 
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-2 px-4 py-2 border-[1.5px] border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-[#1F4E79] hover:text-[#1F4E79] transition-colors bg-white shadow-sm"
            >
              ⛶ View Full
            </button>
          </div>
        </div>

        {/* Canvas Engine */}
        <MapCanvas showInlineControls={true} />
      </div>


      {/* ── FULLSCREEN MODAL VIEW ── */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm p-4 sm:p-8 flex justify-center items-center animate-in fade-in duration-200">
          <div className="bg-white w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            
            {/* Fullscreen Header */}
            <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 z-10 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-slate-900">Architecture Map</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Drag to pan • Scroll to zoom • Use controls to fit</p>
              </div>
              
              {/* Horizontal Controls */}
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
                <button onClick={zoomIn} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded text-slate-600 font-bold transition-colors">+</button>
                <div className="w-px h-4 bg-slate-300 mx-1" />
                <button onClick={zoomOut} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded text-slate-600 font-bold transition-colors">-</button>
                <div className="w-px h-4 bg-slate-300 mx-1" />
                <button onClick={resetZoom} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded text-slate-600 font-bold transition-colors">⊙</button>
                <div className="w-px h-4 bg-slate-300 mx-1" />
                <button onClick={() => setIsFullscreen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 rounded font-bold transition-colors">✕</button>
              </div>
            </div>

            {/* Canvas Engine */}
            <MapCanvas showInlineControls={false} />
            
          </div>
        </div>
      )}
    </>
  );
}