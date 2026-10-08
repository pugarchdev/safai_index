"use client";
import React, { useState } from 'react';

export default function SmartBanner({ 
  icon = "🏢", 
  title, 
  message, 
  variant = "primary" 
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Define color variations based on the vanilla JS injections
  const variants = {
    primary: {
      wrapper: "bg-gradient-to-br from-[#e8f0f9] to-[#dbeafe] border-[#1F4E79]",
      dot: "bg-[#1F4E79]",
    },
    success: {
      wrapper: "bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border-[#166534]",
      dot: "bg-[#166534]",
    }
  };

  const activeStyle = variants[variant] || variants.primary;

  return (
    <div 
      className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border-[1.5px] mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${activeStyle.wrapper}`}
    >
      {/* Blinking Indicator Dot */}
      <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 animate-pulse ${activeStyle.dot}`} />
      
      {/* Banner Content */}
      <div className="flex-1 text-[0.8rem] leading-relaxed text-slate-700">
        <span className="mr-1.5 text-base leading-none">{icon}</span>
        {title && <strong className="font-bold text-slate-900">{title}</strong>}
        {title && message && <span className="mx-1">—</span>}
        <span dangerouslySetInnerHTML={{ __html: message }} />
      </div>

      {/* Dismiss Button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="shrink-0 text-slate-400 hover:text-slate-700 hover:bg-black/5 rounded p-1 transition-colors leading-none"
        aria-label="Dismiss banner"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}