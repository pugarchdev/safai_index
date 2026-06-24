"use client";
import React, { useState, useEffect } from 'react';

export default function AppPreviewStep({ 
  onNext, 
  onBack,
  summary = { zones: 5, staff: 9, washrooms: 12, cleaners: 6 } 
}) {
  // --- Simulated App State ---
  const [appScreen, setAppScreen] = useState('HOME'); // HOME, SELECT, PHOTOS_BEFORE, PHOTOS_AFTER, TASK_DETAILS
  const [homeTab, setHomeTab] = useState('ongoing'); 
  const [hasOngoing, setHasOngoing] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  
  // Overlays
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScorePopupOpen, setIsScorePopupOpen] = useState(false);
  
  // Current Task State
  const [currentScore, setCurrentScore] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState({ indian1: false, urinal1: false, urinal2: false, shower1: false });
  const [activePhotoBox, setActivePhotoBox] = useState(null);

  // Clock for the status bar
  const [time, setTime] = useState('09:41');
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
    };
    updateTime(); 
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Actions ---
  const handleStartTask = () => setAppScreen('SELECT');

  const handleSelectWashroom = () => {
    setAppScreen('PHOTOS_BEFORE');
    setCapturedPhotos({ indian1: false, urinal1: false, urinal2: false, shower1: false });
  };

  const openCamera = (boxId) => {
    setActivePhotoBox(boxId);
    setIsCameraOpen(true);
  };

  const takePhoto = () => {
    setCapturedPhotos(prev => ({ ...prev, [activePhotoBox]: true }));
    setIsCameraOpen(false);
  };

  const handleSubmitPhotos = () => {
    if (appScreen === 'PHOTOS_BEFORE') {
      setHasOngoing(true);
      setAppScreen('HOME');
      setHomeTab('ongoing');
    } else {
      setHasOngoing(false);
      const score = (8.0 + Math.random() * 1.9).toFixed(1);
      setCurrentScore(score);
      setIsScorePopupOpen(true);
      
      const newTask = {
        id: Math.floor(1000 + Math.random() * 9000),
        title: 'Khamla Washroom 1',
        score: score,
        time: '36 min',
        date: '16 Jun, 13:40'
      };
      
      setCompletedTasks([newTask, ...completedTasks]);
      
      setTimeout(() => {
        setIsScorePopupOpen(false);
        setAppScreen('HOME');
        setHomeTab('completed');
      }, 3000);
    }
  };

  const handleResumeTask = () => {
    setAppScreen('PHOTOS_AFTER');
    setCapturedPhotos({ indian1: false, urinal1: false, urinal2: false, shower1: false });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* ── HEADER ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div>
          <h1 className="text-xl font-black text-slate-900">Mobile App Preview</h1>
          <p className="text-sm mt-1 text-slate-500">Fully interactive. Tap tasks, capture photos, submit reports, scan QR — just like the real app.</p>
        </div>
        <button onClick={onNext} className="bg-[#22c55e] text-white px-6 py-3 rounded-lg font-bold text-sm shadow-sm hover:bg-[#16a34a] transition-colors flex items-center gap-2">
          🚀 Go Live
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
        
        {/* ── LEFT: PHONE SIMULATOR ── */}
        <div className="relative w-[310px] h-[630px] shrink-0 bg-slate-50 rounded-[36px] border-[6px] border-[#0B132B] shadow-[0_0_0_1px_#334155,0_32px_80px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col">
          
          {/* Hardware Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[22px] bg-[#0B132B] rounded-b-[14px] z-[60] flex items-center justify-center gap-1.5">
            <div className="w-[36px] h-1 bg-slate-800 rounded-full" />
            <div className="w-[9px] h-[9px] bg-slate-800 rounded-full border-[1.5px] border-slate-700" />
          </div>

          {/* Status Bar */}
          <div className="bg-[#0B132B] pt-[25px] pb-[5px] px-3 flex justify-between text-[9px] font-bold text-slate-50 relative z-[55] shrink-0">
            <span>{time}</span>
            <div className="flex items-center gap-[3px] tracking-tighter">
              <span>📶</span><span>🔋</span>
            </div>
          </div>

          {/* APP VIEWPORT */}
          <div className="relative flex-1 w-full flex flex-col overflow-hidden bg-slate-50">
            
            {/* ── OVERLAYS ── */}
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
              <div className="absolute inset-0 z-[70] flex">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                <div className="relative w-[220px] bg-slate-50 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto">
                  <button onClick={() => setIsSidebarOpen(false)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-lg z-10">✕</button>
                  
                  <div className="pt-9 pb-3 px-4 bg-white border-b border-slate-100">
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-pink-50 flex items-center justify-center text-[10px]">🌐</div>
                        <span className="font-bold text-xs text-slate-700">Language</span>
                      </div>
                      <select className="bg-slate-900 text-white text-[10px] font-bold py-1 px-1.5 rounded-md outline-none cursor-pointer">
                        <option>English</option><option>Hindi</option><option>Marathi</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-b border-slate-100 flex flex-col items-center">
                    <div className="w-[54px] h-[54px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center text-lg font-black border-[3px] border-white shadow-[0_4px_10px_rgba(59,130,246,0.25)] mb-2.5">KC</div>
                    <p className="font-bold text-sm text-slate-800">kartik Cleaner</p>
                    <div className="flex items-center gap-1 mt-1.5 bg-cyan-50 text-cyan-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      🛡️ Verified Personnel
                    </div>
                  </div>

                  <div className="p-4 flex-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assigned Toilets</p>
                    <div className="bg-white rounded-lg p-2.5 shadow-sm border border-slate-100 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-[10px]">📍</div>
                      <span className="font-bold text-xs text-slate-700">Ground Floor WC</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Camera Overlay */}
            {isCameraOpen && (
              <div className="absolute inset-0 z-[80] bg-black flex flex-col animate-in fade-in duration-200">
                <div className="flex justify-between items-center p-3 text-white bg-gradient-to-b from-black/50 to-transparent">
                  <button onClick={() => setIsCameraOpen(false)} className="text-lg">✕</button>
                  <span className="font-bold text-xs">Capture Photo</span>
                  <span className="text-amber-400 text-sm">⚡</span>
                </div>
                <div className="flex-1 relative flex items-center justify-center bg-zinc-900 overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-3xl text-slate-600 mb-2">📷</span>
                    <p className="text-white font-bold text-xs mb-1">Camera initializing...</p>
                    <p className="text-slate-400 text-[9px]">Simulated photo will be used if unavailable.</p>
                  </div>
                  {/* Viewfinder Corners */}
                  <div className="absolute inset-5 border-2 border-white/20 rounded-[18px] pointer-events-none z-20 flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <div className="w-4 h-4 border-t-2 border-l-2 border-white" />
                      <div className="w-4 h-4 border-t-2 border-r-2 border-white" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-4 h-4 border-b-2 border-l-2 border-white" />
                      <div className="w-4 h-4 border-b-2 border-r-2 border-white" />
                    </div>
                  </div>
                </div>
                <div className="h-[100px] bg-black flex flex-col items-center justify-center gap-1.5">
                  <p className="text-white/50 text-[8px] font-bold uppercase tracking-widest">Align inside frame</p>
                  <button onClick={takePhoto} className="w-[50px] h-[50px] rounded-full border-[3px] border-white bg-white/15 flex items-center justify-center">
                    <div className="w-[38px] h-[38px] rounded-full bg-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Score Popup Overlay */}
            {isScorePopupOpen && (
              <div className="absolute inset-0 z-[110] bg-slate-900/80 flex items-center justify-center animate-in fade-in duration-200">
                <div className="bg-white rounded-[22px] p-6 pb-8 w-[82%] text-center shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                  <button onClick={() => setIsScorePopupOpen(false)} className="absolute top-2.5 right-2.5 bg-slate-100 w-6 h-6 rounded-full text-slate-500 text-xs flex items-center justify-center">✕</button>
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-500 mx-auto flex items-center justify-center text-white text-2xl mb-3 shadow-[0_4px_14px_rgba(34,197,94,0.3)]">✓</div>
                  <p className="font-extrabold text-[17px] text-slate-800 mb-1">Task Complete!</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Inspection Score</p>
                  <div className="text-[48px] font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-cyan-400 leading-none mb-3">{currentScore}</div>
                  {/* Shrinking progress bar */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-[shrink_3s_linear_forwards]" style={{ width: '100%' }}>
                    <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
                  </div>
                </div>
              </div>
            )}

            {/* ── SCREENS ── */}
            
            {/* SCREEN: HOME */}
            {appScreen === 'HOME' && (
              <div className="flex flex-col h-full overflow-y-auto">
                {/* Navbar */}
                <div className="flex justify-between items-center px-3 py-2.5 bg-white border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                  <button onClick={() => setIsSidebarOpen(true)} className="text-slate-700 text-sm font-bold">☰</button>
                  <div className="font-black text-sm text-slate-900">Safai<span className="text-[#1DA1F2]">AI</span></div>
                  <button className="text-[#1DA1F2] text-xs">↻</button>
                </div>
                
                {/* Profile */}
                <div className="flex items-center px-3 py-3 bg-white">
                  <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center text-base font-black shadow-[0_4px_10px_rgba(59,130,246,0.25)] border-[3px] border-white shrink-0">KC</div>
                  <div className="ml-2.5">
                    <p className="text-slate-500 text-[10px] font-medium">Hello, Welcome Back</p>
                    <p className="text-slate-800 text-[15px] font-extrabold leading-tight">kartik Cleaner</p>
                    <div className="inline-flex mt-1 items-center gap-1 bg-cyan-50 text-cyan-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-cyan-100">
                      🛡️ Verified Personnel
                    </div>
                  </div>
                </div>

                {/* KPI Tabs */}
                <div className="flex gap-2 px-3 mb-3 bg-white pb-3">
                  <div onClick={() => setHomeTab('ongoing')} className={`flex-1 rounded-xl p-2.5 flex items-center gap-2 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-[2px] transition-colors ${homeTab === 'ongoing' ? 'border-blue-500 bg-white' : 'border-transparent bg-white'}`}>
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-[9px] shrink-0">▶</div>
                    <div>
                      <p className="text-[18px] font-black text-slate-800 leading-none">{hasOngoing ? '1' : '0'}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.05em] mt-0.5">Ongoing</p>
                    </div>
                  </div>
                  <div onClick={() => setHomeTab('completed')} className={`flex-1 rounded-xl p-2.5 flex items-center gap-2 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-[2px] transition-colors ${homeTab === 'completed' ? 'border-green-500 bg-white' : 'border-transparent bg-white'}`}>
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-[11px] shrink-0">✓</div>
                    <div>
                      <p className="text-[18px] font-black text-slate-800 leading-none">{completedTasks.length}</p>
                      <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.05em] mt-0.5">Completed</p>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 px-3 pb-16 flex flex-col">
                  {homeTab === 'ongoing' && !hasOngoing && (
                    <>
                      <button onClick={handleStartTask} className="w-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white py-3.5 rounded-full font-bold text-[13px] shadow-[0_6px_18px_rgba(33,82,255,0.28)] flex items-center justify-center gap-2 mb-6">
                        <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px]">+</div>
                        Start New Cleaning Task
                      </button>
                      <div className="flex-1 flex flex-col items-center justify-center opacity-90 py-8">
                        <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-2 text-lg">🍃</div>
                        <p className="font-bold text-[14px] text-slate-800">All Caught Up!</p>
                        <p className="text-[11px] text-slate-500 mt-1">No active tasks.</p>
                      </div>
                    </>
                  )}

                  {homeTab === 'ongoing' && hasOngoing && (
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[8px] font-bold text-cyan-500 uppercase tracking-[0.1em]">IN-PROGRESS</span>
                        <span className="bg-cyan-400 text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold">1</span>
                      </div>
                      <div onClick={handleResumeTask} className="bg-white rounded-[14px] p-3.5 shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-slate-100 cursor-pointer relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400" />
                        <div className="pl-2">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-bold text-[14px] text-slate-800">Khamla Washroom 1</p>
                            <span className="bg-amber-100 text-amber-600 text-[8px] font-bold px-1.5 py-0.5 rounded border border-amber-200">Ongoing</span>
                          </div>
                          <span className="inline-block bg-blue-50 text-blue-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full mb-1.5">Local Draft</span>
                          <p className="text-[9px] text-slate-500">Started just now</p>
                          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] font-bold text-cyan-500 flex justify-between items-center">
                            Resume to Submit <span>→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {homeTab === 'completed' && (
                    <div className="space-y-3">
                      {completedTasks.length === 0 ? (
                        <div className="text-center py-10 opacity-60">
                          <span className="text-3xl block mb-2 text-slate-400">📥</span>
                          <p className="text-[11px] text-slate-500">No completed tasks yet.</p>
                        </div>
                      ) : (
                        completedTasks.map((task, i) => (
                          <div key={i} onClick={() => setAppScreen('TASK_DETAILS')} className="bg-white rounded-[14px] shadow-sm border border-slate-100 p-3 cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-bold text-[13px] text-slate-800">{task.title}</p>
                                <p className="text-[9px] text-slate-400 font-bold mt-0.5">ID: #{task.id}</p>
                              </div>
                              <div className="bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md">⭐ {task.score}</div>
                            </div>
                            <div className="text-[9px] font-bold text-slate-500 border-t border-slate-100 pt-2 flex gap-3">
                              <span>📅 {task.date}</span>
                              <span className="text-green-500">✓ {task.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SCREEN: SELECT WASHROOM */}
            {appScreen === 'SELECT' && (
              <div className="flex flex-col h-full bg-slate-50">
                <div className="bg-[#0B132B] text-white p-3 flex items-center justify-between sticky top-0 z-10">
                  <button onClick={() => setAppScreen('HOME')} className="text-sm font-bold">←</button>
                  <span className="text-[13px] font-semibold">Start New Task</span>
                  <span className="text-[13px]">🎯</span>
                </div>
                <div className="p-3.5 flex-1 flex flex-col pb-20">
                  <p className="font-bold text-[17px] text-slate-800 mb-3.5">Select Washroom</p>
                  
                  <div className="bg-white border-2 border-blue-400 rounded-xl p-3 flex items-center shadow-[0_4px_12px_rgba(96,165,250,0.15)] mb-3.5 relative overflow-hidden cursor-pointer">
                    <div className="absolute right-0 top-0 bottom-0 bg-blue-50 px-2.5 flex items-center border-l border-blue-200 text-blue-500 text-xs">✓</div>
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2.5 text-blue-500 text-xs">📍</div>
                    <span className="font-bold text-[14px] text-slate-800">Khamla Washroom 1</span>
                  </div>

                  <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200 overflow-hidden relative min-h-[160px]">
                    <div className="absolute inset-0 bg-[#e5e3df] opacity-50" />
                    {/* SVG Grid Map Pattern */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs><pattern id="pgrid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M 36 0 L 0 0 0 36" fill="none" stroke="#cbd5e1" strokeWidth="1"/></pattern></defs>
                      <rect width="100%" height="100%" fill="url(#pgrid)"/>
                      <path d="M 0 80 Q 80 80 120 30 T 260 60" fill="none" stroke="#fff" strokeWidth="6"/>
                      <path d="M 0 80 Q 80 80 120 30 T 260 60" fill="none" stroke="#fadb5f" strokeWidth="2"/>
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div className="bg-white/95 text-slate-700 text-[8px] font-bold px-2 py-1.5 rounded-md shadow-sm text-center mb-1.5 border border-slate-200 leading-[1.4]">
                        Facility Block A<br/>Ground Floor
                      </div>
                      <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-slate-500 border-2 border-white shadow-sm relative z-10" />
                        <div className="absolute inset-0 rounded-full bg-slate-500 opacity-40 animate-ping" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sticky bottom-0 p-2.5 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
                  <button onClick={handleSelectWashroom} className="w-full bg-gradient-to-br from-sky-300 to-sky-500 text-white py-[13px] rounded-xl font-bold text-[14px] shadow-[0_6px_18px_rgba(56,189,248,0.22)] flex items-center justify-center gap-1.5">
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN: PHOTOS (Before & After) */}
            {(appScreen === 'PHOTOS_BEFORE' || appScreen === 'PHOTOS_AFTER') && (
              <div className="flex flex-col h-full bg-slate-50">
                <div className="bg-[#0B132B] text-white p-3 flex items-center justify-between sticky top-0 z-10">
                  <button onClick={() => setAppScreen(appScreen === 'PHOTOS_BEFORE' ? 'SELECT' : 'HOME')} className="text-sm font-bold">←</button>
                  <span className="text-[13px] font-semibold">{appScreen === 'PHOTOS_BEFORE' ? 'Start New Task' : 'Complete Task'}</span>
                  <span className="text-[13px]">🎯</span>
                </div>
                <div className="h-[3px] bg-slate-200 w-full">
                  <div className={`h-full bg-cyan-500 transition-all duration-500 ${appScreen === 'PHOTOS_BEFORE' ? 'w-1/2' : 'w-full'}`} />
                </div>
                
                <div className="flex-1 p-3.5 overflow-y-auto pb-20">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-3.5 flex gap-2">
                    <span className="text-blue-500 text-[11px] mt-px">ℹ️</span>
                    <p className="text-[11px] font-bold text-slate-700 leading-snug">
                      Capture {appScreen === 'PHOTOS_BEFORE' ? 'Before' : 'After'} Cleaning photos to {appScreen === 'PHOTOS_BEFORE' ? 'start' : 'submit'}.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* Indian WC */}
                    <div className="bg-white border border-slate-200 rounded-[14px] p-3.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                      <p className="text-[12px] font-bold text-slate-800 mb-2.5 flex items-center gap-1.5"><span className="text-[10px] text-slate-400">🚽</span> Men – Indian WC</p>
                      <div 
                        onClick={() => openCamera('indian1')}
                        className={`w-[70px] h-[70px] rounded-xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all
                          ${capturedPhotos.indian1 ? 'border-2 border-cyan-400 bg-cyan-50' : 'border-2 border-dashed border-slate-300'}
                        `}
                      >
                        {capturedPhotos.indian1 ? <span className="text-2xl z-10">📸</span> : <span className="text-cyan-500 text-[16px] mb-1 z-10">📷</span>}
                        {!capturedPhotos.indian1 && <span className="text-[6px] font-bold text-slate-500 uppercase z-10">Indian 1</span>}
                      </div>
                    </div>

                    {/* Urinals */}
                    <div className="bg-white border border-slate-200 rounded-[14px] p-3.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                      <p className="text-[12px] font-bold text-slate-800 mb-2.5 flex items-center gap-1.5"><span className="text-[10px] text-slate-400">🚹</span> Men – Urinals</p>
                      <div className="flex gap-2">
                        <div onClick={() => openCamera('urinal1')} className={`w-[70px] h-[70px] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 ${capturedPhotos.urinal1 ? 'border-cyan-400 bg-cyan-50' : 'border-dashed border-slate-300'}`}>
                          {capturedPhotos.urinal1 ? <span className="text-2xl">📸</span> : <span className="text-cyan-500 text-[16px] mb-1">📷</span>}
                          {!capturedPhotos.urinal1 && <span className="text-[6px] font-bold text-slate-500 uppercase">Urinal 1</span>}
                        </div>
                        <div onClick={() => openCamera('urinal2')} className={`w-[70px] h-[70px] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 ${capturedPhotos.urinal2 ? 'border-cyan-400 bg-cyan-50' : 'border-dashed border-slate-300'}`}>
                          {capturedPhotos.urinal2 ? <span className="text-2xl">📸</span> : <span className="text-cyan-500 text-[16px] mb-1">📷</span>}
                          {!capturedPhotos.urinal2 && <span className="text-[6px] font-bold text-slate-500 uppercase">Urinal 2</span>}
                        </div>
                      </div>
                    </div>

                    {/* Basin */}
                    <div className="bg-white border border-slate-200 rounded-[14px] p-3.5 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                      <p className="text-[12px] font-bold text-slate-800 mb-2.5 flex items-center gap-1.5"><span className="text-[10px] text-slate-400">🚰</span> Men – Basin</p>
                      <div className="flex gap-2">
                        <div onClick={() => openCamera('shower1')} className={`w-[70px] h-[70px] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 ${capturedPhotos.shower1 ? 'border-cyan-400 bg-cyan-50' : 'border-dashed border-slate-300'}`}>
                          {capturedPhotos.shower1 ? <span className="text-2xl">📸</span> : <span className="text-cyan-500 text-[16px] mb-1">📷</span>}
                          {!capturedPhotos.shower1 && <span className="text-[6px] font-bold text-slate-500 uppercase">Basin 1</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 p-2.5 bg-white border-t border-slate-100 flex items-center justify-between shadow-[0_-3px_10px_rgba(0,0,0,0.03)]">
                  <button onClick={() => setAppScreen('HOME')} className="text-slate-500 font-bold text-[12px] px-2.5">Cancel</button>
                  <button onClick={handleSubmitPhotos} className="flex-1 ml-2 bg-gradient-to-br from-cyan-400 to-blue-600 text-white py-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-1.5">
                    Submit & Continue ✓
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN: TASK DETAILS */}
            {appScreen === 'TASK_DETAILS' && (
              <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
                <div className="bg-white p-2.5 flex items-center gap-2 sticky top-0 z-10 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-b border-slate-100">
                  <button onClick={() => { setAppScreen('HOME'); setHomeTab('completed'); }} className="text-slate-700 text-sm px-1 font-bold">←</button>
                  <span className="font-bold text-[14px] text-slate-800">Task Details</span>
                </div>
                <div className="p-3.5 pb-12">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-extrabold text-[18px] text-slate-900 leading-[1.2] max-w-[160px]">Khamla Washroom 1</p>
                    <div className="flex flex-col items-end gap-1">
                      <span className="bg-green-100 text-green-600 text-[8px] font-bold px-2 py-0.5 rounded border border-green-200">Completed</span>
                      <span className="font-extrabold text-[15px] text-amber-600">Score: 9.2</span>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-2.5 py-1 mb-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                    <span className="text-blue-400 text-[9px]">🏢</span>
                    <span className="text-[10px] font-bold text-slate-500">ID: #1234</span>
                  </div>
                  
                  <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-slate-100 p-3 flex mb-3.5">
                    <div className="flex-1 pr-3 border-r border-slate-100">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Started</p>
                      <p className="font-bold text-[12px] text-slate-800">16 Jun, 13:40</p>
                    </div>
                    <div className="flex-1 pl-3">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Taken</p>
                      <p className="font-bold text-[12px] text-slate-800">36 min</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-slate-100 p-3">
                    <p className="font-bold text-[12px] text-slate-800 mb-3">Evidence Gallery</p>
                    <div className="grid grid-cols-2 gap-2 opacity-50">
                      <div className="h-20 bg-slate-100 rounded-lg flex items-center justify-center text-xl border border-slate-200">📸</div>
                      <div className="h-20 bg-slate-100 rounded-lg flex items-center justify-center text-xl border border-slate-200">📸</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── RIGHT: DESKTOP SUMMARY PANELS ── */}
        <div className="flex-1 w-full max-w-2xl space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Platform Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <p className="text-xl font-black text-[#1F4E79]">{summary.zones || '5'}</p>
                <p className="text-[11px] font-bold text-slate-500 mt-1">Zones</p>
              </div>
              <div className="text-center p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <p className="text-xl font-black text-[#22c55e]">{summary.staff || '9'}</p>
                <p className="text-[11px] font-bold text-slate-500 mt-1">Staff</p>
              </div>
              <div className="text-center p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <p className="text-xl font-black text-[#f59e0b]">{summary.washrooms || '12'}</p>
                <p className="text-[11px] font-bold text-slate-500 mt-1">Washrooms</p>
              </div>
              <div className="text-center p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <p className="text-xl font-black text-rose-500">{summary.cleaners || '6'}</p>
                <p className="text-[11px] font-bold text-slate-500 mt-1">Cleaners</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Readiness Checks</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="text-[#22c55e]">✓</div><span className="text-slate-700">Location hierarchy configured</span>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-60">
                <div className="text-slate-400">✕</div><span className="text-slate-400 line-through">Staff to be registered</span>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-60">
                <div className="text-slate-400">✕</div><span className="text-slate-400 line-through">Washrooms to be configured</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="text-[#22c55e]">✓</div><span className="text-slate-700 font-bold">Mobile app ready</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-3">How to Use the App Preview</h3>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-start gap-2"><span className="text-[#1F4E79] mt-0.5">👆</span><span>Tap <strong className="text-slate-700">Start New Cleaning Task</strong> to begin a new cleaning workflow.</span></div>
              <div className="flex items-start gap-2"><span className="text-[#1F4E79] mt-0.5">📷</span><span>Tap any <strong className="text-slate-700">camera box</strong> to capture Before/After photos — uses live camera or simulates.</span></div>
              <div className="flex items-start gap-2"><span className="text-[#22c55e] mt-0.5">✓</span><span>Submit photos to get an <strong className="text-slate-700">AI inspection score</strong> and view evidence in Completed.</span></div>
              <div className="flex items-start gap-2"><span className="text-[#1F4E79] mt-0.5">☰</span><span>Tap the <strong className="text-slate-700">☰ menu</strong> to open the sidebar with language settings and user profile.</span></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button className="bg-[#22c55e] text-white py-3 rounded-lg font-bold text-sm shadow-sm hover:bg-[#16a34a] transition-colors flex justify-center items-center gap-2">
              🚀 Go Live — View Dashboard
            </button>
            <button className="bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
              📥 Download Setup Report
            </button>
            <button className="bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
              ↗ Invite Team Members
            </button>
          </div>

        </div>
      </div>

      {/* ── BOTTOM GLOBAL NAV ── */}
      <div className="flex justify-between mt-8 pt-5 border-t border-slate-200">
        <button onClick={onBack} className="inline-flex items-center gap-2 font-bold text-sm rounded-lg border border-slate-200 bg-white text-slate-700 px-6 py-2.5 hover:bg-slate-50 transition-colors shadow-sm">
          ← Back
        </button>
        <button onClick={onNext} className="inline-flex items-center gap-2 font-bold text-sm rounded-lg bg-[#22c55e] text-white px-8 py-3 hover:bg-[#16a34a] transition-colors shadow-sm">
          🚀 Continue to Dashboard ➔
        </button>
      </div>

    </div>
  );
}