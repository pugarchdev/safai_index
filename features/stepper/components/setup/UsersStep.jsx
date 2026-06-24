"use client";
import React, { useState } from 'react';
import LiveFlowchart from '@/features/stepper/components/ui/LiveFlowchart';

export default function UsersStep({
  onNext,
  onBack,
  initialUsers = [],
  nodes = [],
  washrooms = []
}) {
  const [users, setUsers] = useState(initialUsers);
  const [activeTab, setActiveTab] = useState('manual');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Invite Link State
  const [isCopied, setIsCopied] = useState(false);
  const inviteLink = "https://daily-dash-alpha.vercel.app/login";

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'cleaner',
    zone: '',
    wash: ''
  });

  // --- Handlers ---
  const handleCreate = () => {
    if (!formData.name || !formData.phone) {
      return alert("Name and Phone number are required.");
    }
    const newUser = { id: Date.now(), ...formData };
    setUsers([newUser, ...users]); // Add to top of list
    setFormData({ ...formData, name: '', phone: '' });
  };

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // Copy to Clipboard Handler
  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Auto-Fill Simulator
  const handleAutoFill = () => {
    const fakeNames = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Sneha Gupta"];
    const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const randomPhone = `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    
    setUsers([{ id: Date.now(), name: randomName, phone: randomPhone, role: 'cleaner', zone: '', wash: '' }, ...users]);
  };

  const handleAddFullTeam = () => {
    const team = [
      { id: Date.now() + 1, name: 'Vikram Singh', phone: '+91 9876543210', role: 'manager', zone: '', wash: '' },
      { id: Date.now() + 2, name: 'Anjali Desai', phone: '+91 9876543211', role: 'supervisor', zone: '', wash: '' },
      { id: Date.now() + 3, name: 'Suresh Kumar', phone: '+91 9876543212', role: 'cleaner', zone: '', wash: '' },
      { id: Date.now() + 4, name: 'Meena Devi', phone: '+91 9876543213', role: 'cleaner', zone: '', wash: '' }
    ];
    setUsers([...team, ...users]);
  };

  // Quick Add Simulator
  const handleQuickAdd = (role) => {
    const id = Date.now();
    setUsers([{ id, name: `New ${role.charAt(0).toUpperCase() + role.slice(1)} ${id.toString().slice(-3)}`, phone: 'Pending Setup', role, zone: '', wash: '' }, ...users]);
  };

  // Helper for role displays
  const roleDisplay = {
    cleaner: { label: 'Cleaner', icon: '🧹', color: 'text-blue-600 bg-blue-50 border-blue-200', bar: '#1F4E79' },
    supervisor: { label: 'Supervisor', icon: '👁️', color: 'text-amber-600 bg-amber-50 border-amber-200', bar: '#F59E0B' },
    manager: { label: 'Manager', icon: '🏢', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', bar: '#2E7D32' },
    admin: { label: 'Admin', icon: '⚙️', color: 'text-slate-600 bg-slate-100 border-slate-200', bar: '#64748b' }
  };

  // Role Distribution Calculations
  const totalUsers = users.length || 1;
  const counts = {
    cleaner: users.filter(u => u.role === 'cleaner').length,
    supervisor: users.filter(u => u.role === 'supervisor').length,
    manager: users.filter(u => u.role === 'manager').length,
    admin: users.filter(u => u.role === 'admin').length
  };

  // Filtering Logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone.includes(searchQuery);
    const matchesRole = roleFilter === '' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Flowchart Builder
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

      {/* ── HEADER & TIPS ── */}
      <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-black text-slate-900">Users & Assignments</h1>
          <p className="text-sm mt-1 text-slate-500">Register your workforce and assign them to locations in one step.</p>
        </div>
        <div className="bg-[#f8fafc] text-[#1F4E79] px-4 py-2 rounded-lg text-xs flex items-center gap-2 border border-slate-200 shadow-sm">
          <span className="text-blue-500 text-sm flex-shrink-0">📱</span> 
          <span><strong>Cleaners</strong> log in with phone number only — no email required.</span>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* LEFT: SETUP PANEL */}
        <div className="lg:col-span-4 space-y-4">

          {/* Top Navigation Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'manual', icon: '✏️', label: 'Manual' },
              { id: 'autofill', icon: '🤖', label: 'Auto-Fill' },
              { id: 'quickadd', icon: '⚡', label: 'Quick Add' },
              { id: 'invite', icon: '🔗', label: 'Invite' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 py-2 px-1 rounded-lg text-[10px] font-bold border-[1.5px] transition-colors flex flex-col items-center justify-center gap-1 shadow-sm
                  ${activeTab === t.id
                    ? 'bg-[#1F4E79] border-[#1F4E79] text-white'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-[#1F4E79]'
                  }`}
              >
                <span className="text-sm mb-0.5">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: MANUAL */}
          {activeTab === 'manual' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in">
              <h3 className="font-bold text-sm border-b border-slate-100 pb-3 text-slate-900 flex items-center gap-2">
                👤 Add New User
              </h3>

              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-slate-500">Full Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border-[1.5px] border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1F4E79]" placeholder="Legal name" />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-slate-500">Phone Number *</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border-[1.5px] border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1F4E79]" placeholder="Mobile (used to login)" />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider text-slate-500">Role *</label>
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full border-[1.5px] border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1F4E79] bg-white font-medium">
                  <option value="cleaner">🧹 Cleaner</option>
                  <option value="supervisor">👁️ Supervisor</option>
                  <option value="manager">🏢 Facility Manager</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
              </div>

              <div className="pt-1 border-t border-slate-100 space-y-2 mt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pt-2">Direct Assignment</p>
                <div>
                  <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider text-slate-500">Assign to Zone</label>
                  <select value={formData.zone} onChange={e => setFormData({ ...formData, zone: e.target.value })} className="w-full border-[1.5px] border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1F4E79] bg-white font-medium">
                    <option value="">— None / Select —</option>
                    {nodes.filter(n => n.type === 'zone' || n.type === 'floor').map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider text-slate-500">Assign to Washroom</label>
                  <select value={formData.wash} onChange={e => setFormData({ ...formData, wash: e.target.value })} className="w-full border-[1.5px] border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1F4E79] bg-white font-medium">
                    <option value="">— None —</option>
                    {washrooms.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
              </div>

              <button onClick={handleCreate} className="w-full bg-[#1F4E79] text-white py-3 rounded-lg font-bold text-xs hover:bg-[#163a5a] transition-colors shadow-sm mt-2 flex items-center justify-center gap-2">
                👤 Create & Assign
              </button>
            </div>
          )}

          {/* TAB 2: AUTO-FILL */}
          {activeTab === 'autofill' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#1F4E79] text-base">🤖</span>
                <h3 className="font-bold text-sm text-slate-900">AI Auto-Fill</h3>
              </div>
              <p className="text-xs text-slate-500">Watch AI automatically type and add a realistic team member. You can edit any field before saving.</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="mb-2"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Name</p><p className="text-sm font-semibold text-slate-900">—<span className="w-1 h-3.5 bg-[#1F4E79] inline-block ml-1 animate-pulse" /></p></div>
                <div className="mb-2"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Phone</p><p className="text-sm font-semibold text-slate-900">—</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Role</p><p className="text-sm font-semibold text-slate-900">—</p></div>
              </div>
              
              <div className="flex gap-2">
                <button onClick={handleAutoFill} className="flex-1 bg-[#1F4E79] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#163a5a] transition-colors shadow-sm flex justify-center items-center gap-1.5">
                  🤖 Auto-Fill & Add
                </button>
                <button onClick={handleAddFullTeam} className="bg-white border border-slate-200 text-slate-700 py-2.5 px-3 rounded-lg font-bold text-xs hover:bg-slate-50 transition-colors shadow-sm flex justify-center items-center gap-1.5" title="Add full demo team at once">
                  👥 Add Full Team
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Each click adds one staff member from a realistic dataset. You can still edit the manual form tab at any time.</p>
            </div>
          )}

          {/* TAB 3: QUICK ADD */}
          {activeTab === 'quickadd' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm animate-in fade-in">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-500 text-base">⚡</span>
                <h3 className="font-bold text-sm text-slate-900">Quick Role Add</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">Click a role card to instantly generate and add a staff member with a randomised name and phone number.</p>
              
              <div className="grid grid-cols-2 gap-2">
                <div onClick={() => handleQuickAdd('cleaner')} className="border border-slate-200 rounded-xl p-3 text-center cursor-pointer hover:border-[#1F4E79] hover:bg-[#f8fafc] transition-all group">
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🧹</div>
                  <p className="text-xs font-bold text-slate-900">Cleaner</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Field staff</p>
                </div>
                <div onClick={() => handleQuickAdd('supervisor')} className="border border-slate-200 rounded-xl p-3 text-center cursor-pointer hover:border-[#1F4E79] hover:bg-[#f8fafc] transition-all group">
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">👁️</div>
                  <p className="text-xs font-bold text-slate-900">Supervisor</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Team lead</p>
                </div>
                <div onClick={() => handleQuickAdd('manager')} className="border border-slate-200 rounded-xl p-3 text-center cursor-pointer hover:border-[#1F4E79] hover:bg-[#f8fafc] transition-all group">
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🏢</div>
                  <p className="text-xs font-bold text-slate-900">FM</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Facility Mgr</p>
                </div>
                <div onClick={() => handleQuickAdd('admin')} className="border border-slate-200 rounded-xl p-3 text-center cursor-pointer hover:border-[#1F4E79] hover:bg-[#f8fafc] transition-all group">
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">⚙️</div>
                  <p className="text-xs font-bold text-slate-900">Admin</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Platform admin</p>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <p className="font-semibold text-slate-600 mb-1">Last added:</p>
                <p className="text-slate-500">{users.length > 0 ? `${users[0].name} (${roleDisplay[users[0].role]?.label})` : 'None yet — click a card above'}</p>
              </div>
            </div>
          )}

          {/* TAB 4: INVITE */}
          {activeTab === 'invite' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#2E7D32] text-base">🔗</span>
                <h3 className="font-bold text-sm text-slate-900">Invite Link</h3>
              </div>
              <p className="text-xs text-slate-500">Share this link with your team. They fill their own details and join your workspace automatically.</p>
              
              <div>
                <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider text-slate-500">Your Invite Link</label>
                <div className="flex gap-2">
                  <input readOnly value={inviteLink} className="flex-1 border-[1.5px] border-slate-200 bg-slate-50 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 outline-none select-all" />
                  <button 
                    onClick={handleCopyInvite}
                    className={`text-white w-10 flex items-center justify-center rounded-lg transition-colors flex-shrink-0 shadow-sm
                      ${isCopied ? 'bg-[#2E7D32] hover:bg-[#1b5e20]' : 'bg-[#1F4E79] hover:bg-[#163a5a]'}
                    `}
                    title="Copy to clipboard"
                  >
                    {isCopied ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl p-3 text-center bg-[#e8f0f9] border border-[#bfdbfe]">
                  <p className="text-xl font-black text-[#1F4E79]">0</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">Links Opened</p>
                </div>
                <div className="rounded-xl p-3 text-center bg-[#d1fae5] border border-[#bbf7d0]">
                  <p className="text-xl font-black text-[#2E7D32]">0</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">Joined</p>
                </div>
              </div>

              <button className="w-full bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                <span className="text-[#1F4E79]">▶</span> Simulate Responses
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: CONFIGURED USERS LIST */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col flex-1 min-h-[560px]">

            {/* Header & Search */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">User Directory</h3>
                <span className="bg-[#e8f0f9] text-[#1F4E79] border border-[#bfdbfe] px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {users.length} users
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 border-[1.5px] border-slate-200 rounded-lg pr-3 py-1.5 text-xs outline-none focus:border-[#1F4E79] w-[130px]" 
                  />
                </div>
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="border-[1.5px] border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#1F4E79] bg-white w-[110px]"
                >
                  <option value="">All Roles</option>
                  <option value="cleaner">Cleaners</option>
                  <option value="supervisor">Supervisors</option>
                  <option value="manager">Managers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            {/* Role Distribution Bar */}
            {users.length > 0 && (
              <div className="mb-3 animate-in fade-in">
                <div className="flex h-2 rounded-full overflow-hidden gap-0.5 bg-slate-100">
                  <div style={{ width: `${(counts.cleaner / totalUsers) * 100}%`, backgroundColor: roleDisplay.cleaner.bar, transition: 'width 0.4s' }} />
                  <div style={{ width: `${(counts.supervisor / totalUsers) * 100}%`, backgroundColor: roleDisplay.supervisor.bar, transition: 'width 0.4s' }} />
                  <div style={{ width: `${(counts.manager / totalUsers) * 100}%`, backgroundColor: roleDisplay.manager.bar, transition: 'width 0.4s' }} />
                  <div style={{ width: `${(counts.admin / totalUsers) * 100}%`, backgroundColor: roleDisplay.admin.bar, transition: 'width 0.4s' }} />
                </div>
                <div className="flex gap-3 mt-1.5 text-[10px] flex-wrap">
                  <span className="text-slate-500">🧹 <strong className="text-slate-700">{counts.cleaner}</strong> Cleaners</span>
                  <span className="text-slate-500">👁️ <strong className="text-slate-700">{counts.supervisor}</strong> Sup.</span>
                  <span className="text-slate-500">🏢 <strong className="text-slate-700">{counts.manager}</strong> Mgrs</span>
                </div>
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[480px]">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-sm text-slate-400">
                  <span className="text-3xl block mb-3 opacity-30">👥</span>
                  {users.length === 0 ? 'No users added yet' : 'No users match filter'}
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const roleData = roleDisplay[u.role] || roleDisplay.cleaner;

                  return (
                    <div key={u.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-white hover:border-[#1F4E79] transition-colors animate-in slide-in-from-bottom-2">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-base shrink-0">👤</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{u.phone}</p>
                      </div>
                      <div className="shrink-0 text-center px-4">
                        <span className={`text-[9px] font-bold px-2 py-1 rounded border ${roleData.color}`}>
                          {roleData.icon} {roleData.label}
                        </span>
                      </div>
                      <button onClick={() => handleDelete(u.id)} className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
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

      {/* ── BOTTOM MAP ── */}
      <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <LiveFlowchart 
          title="FULL FACILITY MAP" 
          countLabel={`${users.length} staff`}
          treeData={buildTreeData()} 
        />
      </div>

      {/* ── BOTTOM NAV: NEXT / BACK ── */}
      <div className="flex justify-between mt-6 pt-4 border-t border-slate-200">
        <button onClick={onBack} className="inline-flex items-center gap-2 font-bold text-xs rounded-lg border border-slate-200 bg-white text-slate-700 px-6 py-2.5 hover:bg-slate-50 transition-colors shadow-sm">
          ← Back
        </button>
        <button onClick={() => onNext(users)} className="inline-flex items-center gap-2 font-bold text-sm rounded-lg bg-[#1F4E79] text-white px-8 py-3 hover:bg-[#163a5a] transition-colors shadow-sm">
          Continue to App Preview ➔
        </button>
      </div>

    </div>
  );
}