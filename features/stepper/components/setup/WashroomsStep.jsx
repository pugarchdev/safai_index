"use client";
import React, { useState } from 'react';
import LiveFlowchart from '@/features/stepper/components/ui/LiveFlowchart';

const washroomTypes = {
  male: { label: 'Male', icon: '🚹', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  female: { label: 'Female', icon: '🚺', color: 'text-pink-600 bg-pink-50 border-pink-200' },
  unisex: { label: 'Unisex', icon: '🚻', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  disabled: { label: 'Accessible', icon: '♿', color: 'text-orange-600 bg-orange-50 border-orange-200' }
};

const quickTemplates = [
  { id: 'standard', name: 'Standard WC', desc: 'WC×2 · Basin×2 · Urinal×1 · Mirror×1', icon: '🚻', fixtures: { wc: 2, bas: 2, uri: 1, ind: 0, sho: 0, plb: 1 } },
  { id: 'high', name: 'High Traffic', desc: 'WC×6 · Basin×4 · Urinal×4 · Mirror×3', icon: '🔥', fixtures: { wc: 6, bas: 4, uri: 4, ind: 0, sho: 0, plb: 3 } },
  { id: 'exec', name: 'Executive', desc: 'WC×3 · Basin×3 · Mirror×4 · Hand Dryer×2', icon: '💼', fixtures: { wc: 3, bas: 3, uri: 0, ind: 2, sho: 0, plb: 4 } },
  { id: 'access', name: 'Accessible', desc: 'WC×1 · Basin×1 · Mirror×1 · Grab Rails', icon: '♿', fixtures: { wc: 1, bas: 1, uri: 0, ind: 0, sho: 0, plb: 1 }, overrideType: 'disabled' }
];

export default function WashroomsStep({ 
  onNext, 
  onBack, 
  nodes = [], 
  initialWashrooms = [] 
}) {
  const [washrooms, setWashrooms] = useState(initialWashrooms);
  const [activeTab, setActiveTab] = useState('manual');
  const [showBanner, setShowBanner] = useState(true);
  
  // --- Form State (Manual Tab) ---
  const [formData, setFormData] = useState({
    name: '',
    zone: '',
    cleaner: '',
    type: 'male',
    fixtures: {
      men: { wc: 2, ind: 0, uri: 3, bas: 2, sho: 0, plb: 1 },
      women: { wc: 4, ind: 1, uri: 0, bas: 3, sho: 0, plb: 1 },
      handicap: { wc: 1, ind: 0, uri: 0, bas: 1, sho: 0, plb: 1 }
    }
  });

  // --- Auto-Configure State ---
  const [autoConfig, setAutoConfig] = useState({
    male: true,
    female: true,
    accessible: false
  });

  // --- Quick Templates State ---
  const [showTemplateSuccess, setShowTemplateSuccess] = useState(false);

  // --- Handlers ---
  const handleFixtureChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      fixtures: {
        ...prev.fixtures,
        [category]: {
          ...prev.fixtures[category],
          [field]: parseInt(value) || 0
        }
      }
    }));
  };

  const handleAddManual = () => {
    if (!formData.name || !formData.zone) return alert('Name and Location are required');
    
    const mainWC = formData.fixtures.men.wc + formData.fixtures.women.wc + formData.fixtures.handicap.wc;
    const mainBasin = formData.fixtures.men.bas + formData.fixtures.women.bas + formData.fixtures.handicap.bas;

    const newWashroom = {
      id: Date.now(),
      ...formData,
      wc: mainWC || 1,
      basin: mainBasin || 1,
      rawFixtures: formData.fixtures
    };

    setWashrooms([...washrooms, newWashroom]);
    setFormData(prev => ({ ...prev, name: '' })); 
  };

  const handleDelete = (id) => {
    setWashrooms(washrooms.filter(w => w.id !== id));
  };

  const handleApplyQuickTemplate = (template) => {
    // Apply template fixtures to the currently active type (or override if specified)
    const targetCategory = template.overrideType === 'disabled' ? 'handicap' : (formData.type === 'female' ? 'women' : 'men');
    
    setFormData(prev => ({
      ...prev,
      type: template.overrideType || prev.type,
      fixtures: {
        ...prev.fixtures,
        [targetCategory]: { ...template.fixtures }
      }
    }));

    setShowTemplateSuccess(true);
    setTimeout(() => setShowTemplateSuccess(false), 4000);
  };

  const handleGenerateAll = () => {
    const targetNodes = nodes.filter(n => n.type !== 'building'); // Generate for floors, zones, wards
    if (targetNodes.length === 0) return alert('No valid locations found to attach washrooms.');

    let generated = [];
    targetNodes.forEach(node => {
      if (autoConfig.male) {
        generated.push({ id: Date.now() + Math.random(), name: `${node.name} Male WC`, zone: node.id, type: 'male', wc: 3, basin: 3 });
      }
      if (autoConfig.female) {
        generated.push({ id: Date.now() + Math.random(), name: `${node.name} Female WC`, zone: node.id, type: 'female', wc: 3, basin: 3 });
      }
      if (autoConfig.accessible) {
        generated.push({ id: Date.now() + Math.random(), name: `${node.name} Accessible WC`, zone: node.id, type: 'disabled', wc: 1, basin: 1 });
      }
    });

    setWashrooms([...washrooms, ...generated]);
    setActiveTab('manual');
  };

  // --- Dynamic Preview Generator for Auto-Config ---
  const generatePreviewList = () => {
    const targetNodes = nodes.filter(n => n.type !== 'building');
    let previewItems = [];
    
    targetNodes.forEach(node => {
      if (autoConfig.male) previewItems.push({ label: `${node.name} — 🚹 Male WC` });
      if (autoConfig.female) previewItems.push({ label: `${node.name} — 🚺 Female WC` });
      if (autoConfig.accessible) previewItems.push({ label: `${node.name} — ♿ Accessible WC` });
    });

    return previewItems;
  };

  // --- Flowchart Builder ---
  const buildTreeData = () => {
    const nodeMap = {};
    nodes.forEach(n => nodeMap[n.id] = { ...n, children: [] });
    
    const rootNodes = [];
    nodes.forEach(n => {
      if (n.parent && nodeMap[n.parent]) {
        nodeMap[n.parent].children.push(nodeMap[n.id]);
      } else {
        rootNodes.push(nodeMap[n.id]);
      }
    });

    washrooms.forEach(w => {
      if (w.zone && nodeMap[w.zone]) {
        nodeMap[w.zone].children.push({
          id: `w_${w.id}`,
          name: w.name,
          type: 'washroom',
          meta: `WC: ${w.wc} | Basin: ${w.basin}`
        });
      }
    });

    return rootNodes;
  };

  const FixtureInput = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between border border-slate-200 rounded-md px-2 py-1.5 bg-white">
      <span className="text-[9px] font-black text-slate-500">{label}</span>
      <input type="number" min="0" value={value} onChange={onChange} className="w-8 text-center text-xs font-bold text-slate-800 outline-none p-0 border-none bg-transparent" />
    </div>
  );

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* ── HEADER & TIPS ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-black text-slate-900">Washroom Configuration</h1>
          <p className="text-xs mt-1 text-slate-500 font-medium">Register washrooms, configure fixtures, set photo evidence, and upload reference images.</p>
        </div>
        <div className="bg-[#f8fafc] text-[#1F4E79] px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-200 shadow-sm">
          <span className="text-slate-400">⚖️</span> Fixture counts auto-generate the mobile <strong>cleaning checklist</strong>.
        </div>
      </div>

      {showBanner && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-medium flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 bg-white rounded-sm px-1 shadow-sm text-[10px]">ℹ</span>
            <p>We recommend <strong>~10-16 washrooms</strong> for <strong>Manufacturing Plant</strong>. The bulk generator is already pre-set to your facility type — just click <em>Generate!</em></p>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-emerald-600 hover:opacity-70 text-base leading-none">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ── LEFT: CONFIGURATION PANEL ── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Top Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'manual', icon: '✏️', label: 'Manual' },
              { id: 'auto', icon: '🤖', label: 'Auto-Configure' },
              { id: 'quick', icon: '⚡', label: 'Quick Templates' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-2 px-1 rounded-lg text-[11px] font-bold border-[1.5px] transition-colors flex items-center justify-center gap-1.5 shadow-sm
                  ${activeTab === t.id ? 'bg-[#1F4E79] border-[#1F4E79] text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-[#1F4E79]'}`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: MANUAL */}
          {activeTab === 'manual' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="font-bold text-xs text-slate-800 border-b border-slate-100 pb-2">Basic Details</h3>
                
                <div>
                  <label className="block text-[9px] font-bold mb-1.5 uppercase tracking-wider text-slate-500">Washroom Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-[1.5px] border-slate-200 rounded-md px-3 py-2 text-xs outline-none focus:border-[#1F4E79]" placeholder="e.g. Ground Floor Male WC" />
                </div>

                <div>
                  <label className="block text-[9px] font-bold mb-1.5 uppercase tracking-wider text-slate-500">Location / Zone *</label>
                  <select value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} className="w-full border-[1.5px] border-slate-200 rounded-md px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#1F4E79] bg-white">
                    <option value="">— None / Select —</option>
                    {nodes.filter(n => n.type !== 'building').map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold mb-1.5 uppercase tracking-wider text-slate-500">Washroom Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border-[1.5px] border-slate-200 rounded-md px-3 py-2 text-xs font-bold text-[#1F4E79] outline-none focus:border-[#1F4E79] bg-[#f8fafc]">
                    <option value="male">🚹 Male</option>
                    <option value="female">🚺 Female</option>
                    <option value="unisex">🚻 Unisex</option>
                    <option value="disabled">♿ Accessible</option>
                  </select>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <span className="text-slate-400">🎛️</span>
                  <h3 className="font-bold text-xs text-slate-800">Usage Categories</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-blue-200 bg-blue-50/30 rounded-lg p-3">
                      <h4 className="text-[10px] font-bold text-blue-600 mb-3">🚹 MEN</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['wc', 'ind', 'uri', 'bas', 'sho', 'plb'].map(f => (
                          <FixtureInput key={`m-${f}`} label={f.toUpperCase()} value={formData.fixtures.men[f]} onChange={e => handleFixtureChange('men', f, e.target.value)} />
                        ))}
                      </div>
                    </div>
                    <div className="border border-pink-200 bg-pink-50/30 rounded-lg p-3">
                      <h4 className="text-[10px] font-bold text-pink-500 mb-3">🚺 WOMEN</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['wc', 'ind', 'uri', 'bas', 'sho', 'plb'].map(f => (
                          <FixtureInput key={`w-${f}`} label={f.toUpperCase()} value={formData.fixtures.women[f]} onChange={e => handleFixtureChange('women', f, e.target.value)} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border border-amber-200 bg-amber-50/30 rounded-lg p-3">
                    <h4 className="text-[10px] font-bold text-amber-500 mb-3">♿ HANDICAP</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {['wc', 'ind', 'uri', 'bas', 'sho', 'plb'].map(f => (
                        <FixtureInput key={`h-${f}`} label={f.toUpperCase()} value={formData.fixtures.handicap[f]} onChange={e => handleFixtureChange('handicap', f, e.target.value)} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handleAddManual} className="w-full bg-[#1F4E79] text-white py-3 rounded-lg font-bold text-xs hover:bg-[#163a5a] transition-colors shadow-sm">
                + Add Washroom
              </button>
            </div>
          )}

          {/* TAB 2: AUTO-CONFIGURE */}
          {activeTab === 'auto' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#1F4E79] text-lg">🤖</span>
                <h3 className="font-bold text-sm text-slate-900">Auto-Configure Washrooms</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Automatically generate a standard Male + Female + Accessible washroom set for every location node in your hierarchy.
              </p>
              
              <div className="bg-[#f8fafc] border border-slate-200 rounded-lg p-4 mt-2">
                <p className="text-[11px] font-bold text-slate-800 mb-3">Will be created:</p>
                <div className="space-y-1.5">
                  {generatePreviewList().slice(0, 8).map((item, idx) => (
                    <div key={idx} className="text-xs font-medium text-slate-600 flex items-center gap-2">
                      <span className="text-slate-400 text-[10px]">🏢</span> {item.label}
                    </div>
                  ))}
                  {generatePreviewList().length > 8 && (
                    <p className="text-xs font-bold text-slate-400 italic pt-1">
                      +{generatePreviewList().length - 8} more...
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={autoConfig.male} onChange={e => setAutoConfig({...autoConfig, male: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-[#1F4E79] focus:ring-[#1F4E79]" />
                  <span className="text-xs font-medium text-slate-700">🚹 Male WC (WC×3, Basin×3, Urinal×3)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={autoConfig.female} onChange={e => setAutoConfig({...autoConfig, female: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-[#1F4E79] focus:ring-[#1F4E79]" />
                  <span className="text-xs font-medium text-slate-700">🚺 Female WC (WC×3, Basin×3)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={autoConfig.accessible} onChange={e => setAutoConfig({...autoConfig, accessible: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-[#1F4E79] focus:ring-[#1F4E79]" />
                  <span className="text-xs font-medium text-slate-700">♿ Accessible WC (WC×1, Basin×1)</span>
                </label>
              </div>

              <button 
                onClick={handleGenerateAll}
                className="w-full bg-[#1F4E79] text-white mt-4 py-3 rounded-lg font-bold text-xs hover:bg-[#163a5a] transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>🤖</span> Generate All Washrooms
              </button>
            </div>
          )}

          {/* TAB 3: QUICK TEMPLATES */}
          {activeTab === 'quick' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-500 text-lg">⚡</span>
                <h3 className="font-bold text-sm text-slate-900">Quick Washroom Templates</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Pick a template to instantly configure a washroom with preset fixture counts.
              </p>

              <div className="space-y-3">
                {quickTemplates.map(template => (
                  <div 
                    key={template.id}
                    onClick={() => handleApplyQuickTemplate(template)}
                    className="border border-slate-200 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:border-[#1F4E79] hover:bg-[#f8fafc] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-lg shadow-sm border border-slate-200">
                        {template.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{template.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{template.desc}</p>
                      </div>
                    </div>
                    <span className="text-slate-300 group-hover:text-[#1F4E79] transition-colors">➔</span>
                  </div>
                ))}
              </div>

              {showTemplateSuccess && (
                <div className="mt-4 bg-[#f0fdf4] border border-[#bbf7d0] text-emerald-700 px-4 py-3 rounded-lg text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
                  ✓ Template applied — adjust details in Manual tab and click Add Washroom.
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── RIGHT: WASHROOMS LIST DIRECTORY ── */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col flex-1 min-h-[600px]">
            
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
              <h3 className="font-bold text-xs text-slate-900">Configured Washrooms</h3>
              <span className="bg-[#e8f0f9] text-[#1F4E79] border border-[#bfdbfe] px-3 py-1 rounded-full text-[10px] font-bold">
                {washrooms.length} washrooms
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2.5">
              {washrooms.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <span className="text-4xl block mb-3 opacity-50">🚻</span>
                  <p className="text-xs font-semibold text-slate-400">No washrooms configured yet</p>
                </div>
              ) : (
                washrooms.map((w) => {
                  const t = washroomTypes[w.type] || washroomTypes.male;
                  return (
                    <div key={w.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white hover:border-[#1F4E79] transition-colors animate-in slide-in-from-bottom-2">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center text-xl shrink-0 border ${t.color}`}>
                        {t.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">{w.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{t.label} • {w.wc} WC, {w.basin} Basins</p>
                      </div>
                      <button onClick={() => handleDelete(w.id)} className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ── BOTTOM NAVIGATION ── */}
      <div className="flex justify-between mt-6 pt-4 border-t border-slate-200">
        <button onClick={onBack} className="inline-flex items-center gap-2 font-bold text-xs rounded-lg border border-slate-200 bg-white text-slate-700 px-6 py-2.5 hover:bg-slate-50 transition-colors shadow-sm">
          ← Back
        </button>
        <button onClick={() => onNext(washrooms)} className="inline-flex items-center gap-2 font-bold text-xs rounded-lg bg-[#1F4E79] text-white px-8 py-2.5 hover:bg-[#163a5a] transition-colors shadow-sm">
          Continue to Users ➔
        </button>
      </div>

    </div>
  );
}