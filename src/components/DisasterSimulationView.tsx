import React, { useState } from 'react';
import {
  Flame,
  ShieldAlert,
  WifiOff,
  Radio,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DisasterSimulationViewProps {
  isDisasterActive: boolean;
  onToggleDisaster: () => void;
  isInternetOnline: boolean;
  onToggleInternet: () => void;
  onRunFullSIHDemo: () => void;
  currentDemoStep: number;
  onStepDemoNext: () => void;
  onResetSimulation: () => void;
}

const DEMO_STAGES = [
  {
    step: 1,
    title: '1. Citizen Captures Pothole Photo',
    desc: 'Citizen encounters severe asphalt depression on Outer Ring Road.',
    targetTab: 'REPORT_ISSUE',
  },
  {
    step: 2,
    title: '2. Gemini 3.7 Flash Multimodal Classification',
    desc: 'AI detects Pothole hazard with 96% confidence and High severity rating.',
    targetTab: 'REPORT_ISSUE',
  },
  {
    step: 3,
    title: '3. Dynamic Priority Engine Scoring',
    desc: 'Priority calculated as P1 (91/100) due to hospital corridor proximity (+12 pts).',
    targetTab: 'REPORT_ISSUE',
  },
  {
    step: 4,
    title: '4. Smart Department Routing',
    desc: 'Ticket automatically routed to Roads & Highways Department without human triage delay.',
    targetTab: 'MUNICIPAL_DASHBOARD',
  },
  {
    step: 5,
    title: '5. Duplicate Incident Merging',
    desc: 'System groups 3 nearby citizen complaints into single tracked incident CIV-101.',
    targetTab: 'MUNICIPAL_DASHBOARD',
  },
  {
    step: 6,
    title: '6. Trigger Flash Flood Disaster',
    desc: 'Category-3 flood hits Sector 4 Riverside Basin. App instantly transitions to Disaster Mode.',
    targetTab: 'MAP',
  },
  {
    step: 7,
    title: '7. Cellular Network Blackout',
    desc: 'Power & telecom towers fail. Internet toggled to OFFLINE.',
    targetTab: 'SOS',
  },
  {
    step: 8,
    title: '8. Offline Emergency SOS Broadcast',
    desc: 'Trapped citizen transmits 1-touch SOS beacon without cellular data or Wi-Fi.',
    targetTab: 'SOS',
  },
  {
    step: 9,
    title: '9. Store-and-Forward Mesh Relaying',
    desc: 'SOS packet hops Device A &rarr; Shopkeeper B &rarr; Drone C &rarr; Satellite Gateway.',
    targetTab: 'MESH_NETWORK',
  },
  {
    step: 10,
    title: '10. Gateway Receives Packet & Syncs GIS',
    desc: 'SOS distress beacon plots on Incident Commander tactical map with live GPS coordinates.',
    targetTab: 'MAP',
  },
  {
    step: 11,
    title: '11. Missing Persons Reunification Desk',
    desc: 'Responders cross-reference family registry with relief camp intake logs.',
    targetTab: 'MISSING_PERSONS',
  },
  {
    step: 12,
    title: '12. AI Incident Commander Situation Briefing',
    desc: 'Gemini 3.7 generates executive briefing, threat vectors, and recommended rescue vectors.',
    targetTab: 'CONTROL_CENTRE',
  },
  {
    step: 13,
    title: '13. Rescue Team SDRF Boat Dispatch',
    desc: 'Incident commander dispatches SDRF Boat Unit Alpha to evacuate 4 trapped citizens.',
    targetTab: 'CONTROL_CENTRE',
  },
  {
    step: 14,
    title: '14. Unified Peacetime + Wartime Platform Complete',
    desc: 'Full cycle demonstrating zero-dependency resilience from civic complaints to disaster rescue.',
    targetTab: 'MAP',
  },
];

export const DisasterSimulationView: React.FC<DisasterSimulationViewProps> = ({
  isDisasterActive,
  onToggleDisaster,
  isInternetOnline,
  onToggleInternet,
  onRunFullSIHDemo,
  currentDemoStep,
  onStepDemoNext,
  onResetSimulation,
}) => {
  const [floodLevelMeters, setFloodLevelMeters] = useState(2.2);

  const triggerConfettiCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH Interactive Demo &amp; Scenario Simulator</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Disaster Scenario Lab &amp; Automated Demo Guide
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test extreme condition scenarios: toggle flood inundation, trigger telecom blackout, and run the 14-step Smart India Hackathon walkthrough.
          </p>
        </div>

        <button
          onClick={() => {
            triggerConfettiCelebration();
            onRunFullSIHDemo();
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-500/25 transition hover:scale-105"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>START AUTOMATED 14-STEP SIH DEMO</span>
        </button>
      </div>

      {/* Scenario Lab Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Disaster Mode Toggle Card */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-300 ${
            isDisasterActive
              ? 'bg-red-950/40 border-red-500 shadow-2xl shadow-red-500/20'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2.5 rounded-xl ${
                  isDisasterActive ? 'bg-red-500 text-white animate-bounce' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Disaster Mode Protocol</h3>
                <div className="text-xs text-slate-400">
                  {isDisasterActive ? 'Active: Category-3 Flash Flood' : 'Normal Peacetime Municipal Mode'}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleDisaster}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
                isDisasterActive
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {isDisasterActive ? 'Deactivate Emergency' : 'Trigger Flood Emergency'}
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            When triggered, CivicVision activates the red emergency banner, plots flood inundation polygons on the GIS map, prioritizes life-safety SOS distress queues, and enables rescue team dispatch.
          </p>

          {/* Water level gauge */}
          {isDisasterActive && (
            <div className="p-3 rounded-xl bg-slate-950 border border-red-800/80 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Simulated Inundation Level:</span>
                <span className="font-mono font-bold text-red-400">{floodLevelMeters} meters</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={4.5}
                step={0.1}
                value={floodLevelMeters}
                onChange={(e) => setFloodLevelMeters(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          )}
        </div>

        {/* Connectivity Blackout Toggle Card */}
        <div
          className={`p-5 rounded-2xl border transition-all duration-300 ${
            !isInternetOnline
              ? 'bg-amber-950/40 border-amber-500 shadow-2xl shadow-amber-500/20'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2.5 rounded-xl ${
                  !isInternetOnline ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
                }`}
              >
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Telecom &amp; Grid Connectivity</h3>
                <div className="text-xs text-slate-400">
                  {isInternetOnline ? 'Online (5G / Fiber Grid)' : 'Blackout (Offline Mesh DTN Active)'}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleInternet}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
                !isInternetOnline
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {isInternetOnline ? 'Simulate Blackout' : 'Restore Grid'}
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Simulates loss of cellular base stations. In offline mode, all emergency alerts are converted into cryptographic Store-and-Forward packets that hop across peer-to-peer mesh nodes.
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 flex items-center justify-between">
            <span>DTN Packet Protocol:</span>
            <span className="text-emerald-400 font-bold">
              {isInternetOnline ? 'DIRECT_IP_V6' : 'BLE_WIFI_LORA_MESH'}
            </span>
          </div>
        </div>
      </div>

      {/* 14-Step SIH Hackathon Interactive Demonstration Stepper */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Smart India Hackathon 14-Step Full Lifecycle Walkthrough</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Current Stage: Step {currentDemoStep} of 14
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetSimulation}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onStepDemoNext}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition"
            >
              <span>Next Step ({currentDemoStep < 14 ? currentDemoStep + 1 : 14})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stepper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_STAGES.map((stage) => {
            const isCurrent = stage.step === currentDemoStep;
            const isCompleted = stage.step < currentDemoStep;

            return (
              <div
                key={stage.step}
                className={`p-3 rounded-xl border text-xs transition ${
                  isCurrent
                    ? 'bg-blue-900/40 border-cyan-400 ring-2 ring-cyan-500/50 shadow-lg'
                    : isCompleted
                    ? 'bg-slate-950/80 border-emerald-800/80 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-[11px] truncate">{stage.title}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  ) : null}
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2">{stage.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
