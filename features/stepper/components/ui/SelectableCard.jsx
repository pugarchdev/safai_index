"use client";
import React from 'react';

export default function SelectableCard({
  title,
  subtitle,
  icon,
  isSelected = false,
  onClick,
  variant = "horizontal" // 'horizontal' | 'vertical'
}) {
  // Base styles shared between both variants
  const baseCardStyles = `
    cursor-pointer select-none transition-all duration-200 ease-out border-[1.5px]
    ${variant === 'vertical' ? 'rounded-xl p-3 flex flex-col items-center gap-1.5 text-center' : 'rounded-xl p-3.5 flex items-center gap-3'}
  `;

  // Dynamic styles based on selection state
  const stateStyles = isSelected
    ? "border-[#1F4E79] bg-[#e8f0f9] shadow-[0_0_0_3px_rgba(31,78,121,0.12)] scale-[1.02]"
    : "border-slate-200 bg-white hover:border-[#1F4E79] hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-sm";

  return (
    <div 
     onClick={onClick}
      className={`${baseCardStyles} ${stateStyles}`}
      role="button"
      aria-pressed={isSelected}
    >
      {/* ── VERTICAL LAYOUT (Used for Facility Grid) ── */}
      {variant === 'vertical' && (
        <>
          <span className="text-2xl leading-none block mb-1">{icon}</span>
          <span className={`text-[11px] font-bold leading-snug transition-colors ${isSelected ? 'text-[#1F4E79]' : 'text-slate-700'}`}>
            {title}
          </span>
        </>
      )}

      {/* ── HORIZONTAL LAYOUT (Used for Options Lists) ── */}
      {variant === 'horizontal' && (
        <>
          {icon && (
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#e8f0f9] text-xl">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-slate-900 truncate">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs mt-0.5 text-slate-500 leading-snug">
                {subtitle}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}