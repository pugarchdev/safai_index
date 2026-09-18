"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CheckCircle, ArrowRight, ShieldCheck, Server, Clock, RefreshCw } from "lucide-react";

export default function DemoPage() {
  const [clientTime, setClientTime] = useState("");
  const [pingCount, setPingCount] = useState(1);

  useEffect(() => {
    setClientTime(new Date().toLocaleString());
  }, []);

  const handlePing = () => {
    setPingCount((prev) => prev + 1);
    setClientTime(new Date().toLocaleString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">SaafAI Production Demo</h1>
            <p className="text-sm text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live & Deployed Successfully
            </p>
          </div>
        </div>

        <div className="space-y-4 bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 mb-6 text-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" /> Platform Status
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              Operational
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-slate-400 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" /> Target Service
            </span>
            <span className="font-mono text-slate-200">safai-ai-frontend (Cloud Run)</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Last Checked
            </span>
            <span className="font-mono text-xs text-slate-300">{clientTime || "Loading..."}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Interaction Ping</span>
            <span className="font-mono text-xs text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
              {pingCount} requests
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePing}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium text-sm transition-all duration-150 border border-slate-600 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Ping
          </button>

          <Link
            href="/login"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-150 shadow-lg shadow-indigo-600/30"
          >
            Go to Portal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-6">
        Route: <code className="text-slate-400">/demo</code> &bull; Public verification page
      </p>
    </div>
  );
}
