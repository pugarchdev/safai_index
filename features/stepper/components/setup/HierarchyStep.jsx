"use client";
import React, { useState } from 'react';
import LiveFlowchart from '@/features/stepper/components/ui/LiveFlowchart';

const nodeTypes = {
  building: { label: 'Building / Block', icon: '🏢', color: 'text-[#1F4E79] bg-[#e8f0f9] border-[#bfdbfe]' },
  floor: { label: 'Floor', icon: '📋', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  zone: { label: 'Zone', icon: '📍', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ward: { label: 'Ward', icon: '🏥', color: 'text-red-600 bg-red-50 border-red-200' }
};

const prebuiltTemplates = [
  { id: 'office', icon: '🏢', label: 'Corporate Office' },
  { id: 'hospital', icon: '🏥', label: 'Hospital' },
  { id: 'mall', icon: '🛍️', label: 'Shopping Mall' },
  { id: 'airport', icon: '✈️', label: 'Airport' },
  { id: 'metro', icon: '🚇', label: 'Metro Station' }
];

export default function HierarchyStep({ 
  onNext, 
  initialNodes = [] 
}) {
  const defaultRoot = { id: 1, name: 'Main Facility', type: 'building', parent: null };
  const [nodes, setNodes] = useState(initialNodes.length > 0 ? initialNodes : [defaultRoot]);
  const [activeTemplate, setActiveTemplate] = useState('office');
  const [showBanner, setShowBanner] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'building',
    parent: 'root'
  });

  // --- Handlers ---
  const handleAddNode = () => {
    if (!formData.name) return alert('Please enter a name for this location.');

    const newNode = {
      id: Date.now(),
      name: formData.name,
      type: formData.type,
      parent: formData.parent === 'root' ? null : parseInt(formData.parent)
    };

    setNodes([...nodes, newNode]);
    setFormData({ ...formData, name: '' });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the entire hierarchy?")) {
      setNodes([defaultRoot]);
      setFormData({ name: '', type: 'building', parent: 'root' });
    }
  };

const handleApplyTemplate = (templateId) => {
    setActiveTemplate(templateId);
    let generated = [];
    const baseId = Date.now();

    if (templateId === 'office') {
      const bldgId = baseId;
      generated.push({ id: bldgId, name: 'Corporate Office', type: 'building', parent: null });
      generated.push({ id: baseId + 1, name: 'Ground Floor', type: 'floor', parent: bldgId });
      generated.push({ id: baseId + 2, name: 'Floor 1', type: 'floor', parent: bldgId });
      generated.push({ id: baseId + 3, name: 'Floor 2', type: 'floor', parent: bldgId });
      
    } else if (templateId === 'hospital') {
      const bldgId = baseId;
      generated.push({ id: bldgId, name: 'Hospital Main Building', type: 'building', parent: null });
      generated.push({ id: baseId + 1, name: 'Block A — OPD', type: 'ward', parent: bldgId });
      generated.push({ id: baseId + 2, name: 'Block B — IPD', type: 'ward', parent: bldgId });
      generated.push({ id: baseId + 3, name: 'Block C — Emergency', type: 'ward', parent: bldgId });
      generated.push({ id: baseId + 4, name: 'Administration Block', type: 'building', parent: null });
      
    } else if (templateId === 'mall') {
      // Matches your Shopping Mall screenshot
      const bldgId = baseId;
      const groundId = baseId + 1; // Save this ID so we can attach the Food Court to it
      
      generated.push({ id: bldgId, name: 'Mall Building', type: 'building', parent: null });
      generated.push({ id: groundId, name: 'Ground Floor', type: 'floor', parent: bldgId });
      generated.push({ id: baseId + 2, name: 'First Floor', type: 'floor', parent: bldgId });
      generated.push({ id: baseId + 3, name: 'Second Floor', type: 'floor', parent: bldgId });
      
      // Attach Food Court specifically to the Ground Floor
      generated.push({ id: baseId + 4, name: 'Food Court', type: 'zone', parent: groundId });

    } else if (templateId === 'airport') {
      // Matches your Airport screenshot
      const t1Id = baseId;
      const t2Id = baseId + 10; // offset ID to avoid overlaps
      
      generated.push({ id: t1Id, name: 'Terminal 1', type: 'building', parent: null });
      generated.push({ id: baseId + 1, name: 'Departures Hall', type: 'zone', parent: t1Id });
      generated.push({ id: baseId + 2, name: 'Arrivals Hall', type: 'zone', parent: t1Id });
      
      generated.push({ id: t2Id, name: 'Terminal 2', type: 'building', parent: null });
      generated.push({ id: baseId + 11, name: 'International Zone', type: 'zone', parent: t2Id });
      
    } else if (templateId === 'metro') {
      const stnId = baseId;
      generated.push({ id: stnId, name: 'Central Station', type: 'building', parent: null });
      generated.push({ id: baseId + 1, name: 'Concourse Level', type: 'floor', parent: stnId });
      generated.push({ id: baseId + 2, name: 'Platform 1 & 2', type: 'zone', parent: baseId + 1 });
      
    } else {
      // Generic fallback for any other future templates
      generated.push({ id: baseId, name: `${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Main`, type: 'building', parent: null });
    }

    setNodes(generated);
    setFormData({ ...formData, parent: generated[0].id.toString() });
  };

  // --- Derived Data ---
  const parentOptions = nodes.map(n => ({ id: n.id, name: n.name, type: n.type }));
  
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

    return rootNodes;
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Header & Tip */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-black text-slate-900">Location Hierarchy</h1>
          <p className="text-sm mt-1 text-slate-500">Build the structural map of your facility. Washrooms attach to zones.</p>
        </div>
        <div className="bg-[#e8f0f9] text-[#1F4E79] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border border-[#bfdbfe]">
          💡 Tip: Floors can be duplicated to save setup time.
        </div>
      </div>

      {/* Blue Auto-Map Banner */}
      {showBanner && (
        <div className="bg-[#e8f0f9] border border-[#bfdbfe] text-[#1F4E79] px-4 py-3 rounded-lg text-sm flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <span>🏢</span>
            <p><strong>Corporate Office</strong> — {nodes.length} location(s) auto-mapped from your profile! Customise or add more below.</p>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-[#1F4E79] hover:opacity-70 text-lg leading-none">✕</button>
        </div>
      )}

      {/* Pre-Built Templates Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Pre-built Templates</p>
        <div className="flex flex-wrap gap-3">
          {prebuiltTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => handleApplyTemplate(template.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border-[1.5px] transition-colors
                ${activeTemplate === template.id 
                  ? 'border-[#1F4E79] text-[#1F4E79] bg-[#e8f0f9]' 
                  : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                }`}
            >
              <span className="text-sm">{template.icon}</span> {template.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ── LEFT: SETUP PANEL ── */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Hierarchy Builder</h3>
            
            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-slate-500">Node Name *</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full border-[1.5px] border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1F4E79]" 
                placeholder="e.g. Block A, Floor 1" 
                onKeyDown={e => e.key === 'Enter' && handleAddNode()}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-slate-500">Node Type</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})} 
                className="w-full border-[1.5px] border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1F4E79] bg-white"
              >
                {Object.entries(nodeTypes).map(([key, data]) => (
                  <option key={key} value={key}>{data.icon} {data.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider text-slate-500">Parent (Optional)</label>
              <select 
                value={formData.parent} 
                onChange={e => setFormData({...formData, parent: e.target.value})} 
                className="w-full border-[1.5px] border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1F4E79] bg-white"
              >
                <option value="root">— Root Level —</option>
                {parentOptions.map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleAddNode} 
                className="flex-1 bg-[#1F4E79] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#163a5a] transition-colors shadow-sm"
              >
                + Add Node
              </button>
              <button className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-sm">
                📋 Dup.
              </button>
            </div>
          </div>

          <button 
            onClick={handleReset}
            className="w-full bg-white border border-red-200 text-red-500 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-50 transition-colors"
          >
            ↻ Reset Hierarchy
          </button>
          
        </div>

        {/* ── RIGHT: LIVE ARCHITECTURE MAP (FLOWCHART) ── */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col flex-1 min-h-[550px] overflow-hidden relative">
            
        

            {/* Flowchart Component Container */}
            <div className="flex-1 bg-slate-50/50">
               <LiveFlowchart 
                 treeData={buildTreeData()} 
                 // Assuming your LiveFlowchart has ways to disable its own default headers since we built a custom one above.
               />
            </div>

            <div className="absolute bottom-4 left-4">
              <span className="bg-white border border-slate-200 text-slate-400 px-2 py-1 rounded text-[10px] font-medium shadow-sm">
                Drag to pan • Scroll to zoom
              </span>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex justify-end mt-8 pt-4 border-t border-slate-200">
        <button 
          onClick={() => onNext(nodes)} 
          className="inline-flex items-center gap-2 font-bold text-sm rounded-lg bg-[#1F4E79] text-white px-8 py-3 hover:bg-[#163a5a] transition-colors shadow-sm"
        >
          Continue to Washrooms ➔
        </button>
      </div>

    </div>
  );
}