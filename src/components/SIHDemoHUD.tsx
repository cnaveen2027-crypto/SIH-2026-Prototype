import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  X,
  ArrowRight,
  ShieldAlert,
  Radio,
  FileText,
  Activity,
  LifeBuoy,
  Cpu,
  Layers,
} from 'lucide-react';
import { AppView } from '../types';
import confetti from 'canvas-confetti';

export interface DemoStepInfo {
  step: number;
  title: string;
  shortDesc: string;
  technicalHighlight: string;
  targetView: AppView;
  isDisaster: boolean;
  isOnline: boolean;
  actionName: string;
}

export const SIH_DEMO_STEPS: DemoStepInfo[] = [
  {
    step: 1,
    title: 'Citizen Captures Pothole Photo',
    shortDesc: 'Citizen encounters severe asphalt depression on Outer Ring Road corridor.',
    technicalHighlight: 'Geo-tagged mobile camera feed & EXIF metadata extraction.',
    targetView: 'REPORT_ISSUE',
    isDisaster: false,
    isOnline: true,
    actionName: 'Load Pothole Evidence',
  },
  {
    step: 2,
    title: 'Gemini 3.7 Flash Multimodal Classification',
    shortDesc: 'Vision model detects Pothole hazard with 96% confidence and High severity.',
    technicalHighlight: 'Zero-latency multimodal prompt & safety hazard bounding analysis.',
    targetView: 'REPORT_ISSUE',
    isDisaster: false,
    isOnline: true,
    actionName: 'Run AI Classification',
  },
  {
    step: 3,
    title: 'Dynamic Priority Engine Scoring',
    shortDesc: 'Calculates dynamic score of 91/100 (P1) due to Hospital corridor proximity (+12 pts).',
    technicalHighlight: 'Weighted dynamic risk scoring: Severity + Proximity + Traffic Arteries.',
    targetView: 'REPORT_ISSUE',
    isDisaster: false,
    isOnline: true,
    actionName: 'Inspect Priority Score',
  },
  {
    step: 4,
    title: 'Smart Municipal Department Routing',
    shortDesc: 'Auto-dispatches ticket directly to Roads & Highways Department desk.',
    technicalHighlight: 'Eliminates 3-5 day human triage delays with automated classification.',
    targetView: 'MUNICIPAL_DASHBOARD',
    isDisaster: false,
    isOnline: true,
    actionName: 'View Department Queue',
  },
  {
    step: 5,
    title: 'Duplicate Incident Geo-Clustering',
    shortDesc: 'Clusters 3 nearby citizen complaints into single tracked incident CIV-101.',
    technicalHighlight: 'Spatial radius clustering (350m buffer) prevents duplicate crew dispatches.',
    targetView: 'MUNICIPAL_DASHBOARD',
    isDisaster: false,
    isOnline: true,
    actionName: 'View Merged Cluster',
  },
  {
    step: 6,
    title: 'Flash Flood Disaster Triggered',
    shortDesc: 'Category-3 flood hits Sector 4 Basin. App switches into Emergency Tactical Mode.',
    technicalHighlight: 'Zero-dependency instant UI transition to emergency response mode.',
    targetView: 'MAP',
    isDisaster: true,
    isOnline: true,
    actionName: 'Engage Disaster GIS',
  },
  {
    step: 7,
    title: 'Cellular Grid Blackout Simulation',
    shortDesc: 'Power & telecom towers fail across Riverside. Internet toggled to OFFLINE.',
    technicalHighlight: 'Autonomous fallback to delay-tolerant radio protocols.',
    targetView: 'SOS',
    isDisaster: true,
    isOnline: false,
    actionName: 'Simulate Blackout',
  },
  {
    step: 8,
    title: 'Offline Emergency SOS Beacon Broadcast',
    shortDesc: 'Trapped citizen transmits 1-touch distress beacon with GPS and medical needs.',
    technicalHighlight: 'Binary payload packaging without cellular connectivity or Wi-Fi.',
    targetView: 'SOS',
    isDisaster: true,
    isOnline: false,
    actionName: 'Transmit Distress Beacon',
  },
  {
    step: 9,
    title: 'Delay-Tolerant Store-and-Forward Mesh Relaying',
    shortDesc: 'SOS packet hops Device A → Shopkeeper B → Drone C → Satellite Gateway.',
    technicalHighlight: 'Hop-by-hop queueing with TTL decrements and multi-path packet flooding.',
    targetView: 'MESH_NETWORK',
    isDisaster: true,
    isOnline: false,
    actionName: 'Simulate Mesh Hops',
  },
  {
    step: 10,
    title: 'Gateway Ingestion & GIS Synchronization',
    shortDesc: 'Distress packet arrives at Gateway Mast and renders on Incident Tactical Map.',
    technicalHighlight: 'Offline packet unwrapping & real-time GIS map synchronization.',
    targetView: 'MAP',
    isDisaster: true,
    isOnline: false,
    actionName: 'Plot Live SOS on Map',
  },
  {
    step: 11,
    title: 'Missing Persons Reunification Desk',
    shortDesc: 'Responders match separated family inquiries with shelter intake registries.',
    technicalHighlight: 'Biometric & demographic matching index across evacuation camps.',
    targetView: 'MISSING_PERSONS',
    isDisaster: true,
    isOnline: false,
    actionName: 'Inspect Reunification Registry',
  },
  {
    step: 12,
    title: 'AI Incident Commander Situation Briefing',
    shortDesc: 'Gemini 3.7 generates situational summary, threat vectors, and boat routes.',
    technicalHighlight: 'Real-time multi-source synthesis across floods, SOS beacons, and medical priority.',
    targetView: 'CONTROL_CENTRE',
    isDisaster: true,
    isOnline: false,
    actionName: 'Generate AI Briefing',
  },
  {
    step: 13,
    title: 'SDRF Inflatable Boat Dispatch',
    shortDesc: 'Incident Commander deploys Bravo-2 Rescue Boat to evacuate 4 trapped citizens.',
    technicalHighlight: 'Optimal watercraft routing around submerged power cables and bridge debris.',
    targetView: 'CONTROL_CENTRE',
    isDisaster: true,
    isOnline: false,
    actionName: 'Dispatch Rescue Boat',
  },
  {
    step: 14,
    title: 'Rescue Completed & Peacetime Restoration',
    shortDesc: 'All citizens evacuated to Safe High Ground Camp. Full lifecycle complete!',
    technicalHighlight: 'End-to-end demonstration from municipal pothole to disaster life-saving.',
    targetView: 'SIMULATION',
    isDisaster: false,
    isOnline: true,
    actionName: 'Finish SIH Demo',
  },
];

interface SIHDemoHUDProps {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
  onCloseDemo: () => void;
  onNavigate: (view: AppView) => void;
  setDisasterMode: (active: boolean) => void;
  setInternetOnline: (online: boolean) => void;
}

export const SIHDemoHUD: React.FC<SIHDemoHUDProps> = ({
  currentStep,
  onSelectStep,
  onCloseDemo,
  onNavigate,
  setDisasterMode,
  setInternetOnline,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentStepData = SIH_DEMO_STEPS.find((s) => s.step === currentStep) || SIH_DEMO_STEPS[0];

  // Auto-play timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentStep < 14) {
          handleGoToStep(currentStep + 1);
        } else {
          setIsPlaying(false);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep]);

  const handleGoToStep = (stepNum: number) => {
    const target = SIH_DEMO_STEPS.find((s) => s.step === stepNum);
    if (!target) return;

    onSelectStep(stepNum);
    onNavigate(target.targetView);
    setDisasterMode(target.isDisaster);
    setInternetOnline(target.isOnline);

    if (stepNum === 14) {
      confetti({
        particleCount: 80,
        spread: 60,
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      handleGoToStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 14) {
      handleGoToStep(currentStep + 1);
    } else {
      handleGoToStep(1);
    }
  };

  return (
    <aside aria-label="Interactive demo controller" className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/40 shadow-2xl px-4 py-2.5 transition-all text-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Step Info */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md">
            {currentStep}/14
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                SIH 2026 Interactive Walkthrough
              </span>
              <h3 className="font-bold text-xs sm:text-sm text-white">{currentStepData.title}</h3>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1 sm:line-clamp-none">
              {currentStepData.shortDesc}{' '}
              <span className="text-cyan-400 font-mono hidden lg:inline">
                [{currentStepData.technicalHighlight}]
              </span>
            </p>
          </div>
        </div>

        {/* Center: Step indicators pills */}
        <div className="hidden xl:flex items-center gap-1">
          {SIH_DEMO_STEPS.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => handleGoToStep(s.step)}
              title={`${s.step}. ${s.title}`}
              className={`w-5 h-5 rounded text-[10px] font-mono font-bold transition flex items-center justify-center ${
                s.step === currentStep
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                  : s.step < currentStep
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s.step}
            </button>
          ))}
        </div>

        {/* Right: Controls & Navigation */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Auto Play toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto Play</span>
              </>
            )}
          </button>

          {/* Prev Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold shadow-md transition"
          >
            <span>{currentStep === 14 ? 'Restart ↺' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Close Banner */}
          <button
            type="button"
            onClick={onCloseDemo}
            title="Close Demo Bar"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
