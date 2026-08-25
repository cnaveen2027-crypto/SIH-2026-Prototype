import React from 'react';
import {
  Activity,
  ShieldAlert,
  Radio,
  Eye,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  BarChart2,
  Users,
  MapPin,
  Flame,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
  onStartDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch, onStartDemo }) => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-slate-800/80">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart India Hackathon &bull; Open Innovation Prototype</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
              Civic<span className="text-cyan-400">Vision</span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-slate-300 mb-4">
              AI-Powered Urban Infrastructure &amp; Disaster Response Intelligence
            </p>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              &ldquo;From Civic Problems to Emergency Response — One Intelligent Platform.&rdquo;
              Bridging citizen municipal reporting during normal times and life-saving offline mesh communication during catastrophic disasters.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onLaunch}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Launch CivicVision Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onStartDemo}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-sm border border-amber-500/30 hover:border-amber-500/60 transition shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Run Interactive SIH Demo</span>
              </button>
            </div>
          </div>

          {/* Quick Dual-Mode Visual Hero Card */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Mode 1: Urban Infrastructure */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-blue-500/20 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white">Mode 1: Peacetime Civic Intelligence</h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 border border-blue-700/50">
                  Daily Operations
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Citizens photograph road craters, broken streetlights, or drainage failures. Multimodal Gemini 3.7 Flash extracts severity, estimates repair hours, auto-detects duplicate reports, and routes tickets directly to municipal departments.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">AI Vision Confidence</div>
                  <div className="font-bold text-cyan-400 text-sm">94% – 99%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Duplicate Merging</div>
                  <div className="font-bold text-emerald-400 text-sm">Geo-Cluster 350m</div>
                </div>
              </div>
            </div>

            {/* Mode 2: Disaster Response */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-red-500/30 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white">Mode 2: Emergency Disaster Protocol</h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-700/50 animate-pulse">
                  Emergency Mode
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                When floods or cyclones take down cellular broadband, CivicVision switches into an offline store-and-forward mesh simulator. SOS packets hop peer-to-peer across phones, radios, and drone repeaters to reach command gateways.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Mesh Network Relaying</div>
                  <div className="font-bold text-amber-400 text-sm">Device &rarr; Device &rarr; Gateway</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Situational Awareness</div>
                  <div className="font-bold text-rose-400 text-sm">Unified GIS Map</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & The Solution */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
              <AlertTriangle className="w-4 h-4" />
              <span>Current Municipal &amp; Disaster Challenges</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Why Existing Civic Platforms Fail During Crises
            </h2>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                <p><strong className="text-slate-200">Siloed Municipal Portals:</strong> Citizens report issues into fragmented departmental silos that lack automated visual verification and cross-agency coordination.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                <p><strong className="text-slate-200">Duplicate Report Overload:</strong> 50 citizens reporting the same flooded underpass create 50 separate tickets, overwhelming emergency dispatchers.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                <p><strong className="text-slate-200">Total Telecom Blackout:</strong> Standard apps are useless the moment cellular towers flood or lose power, leaving trapped citizens without an SOS channel.</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 shadow-2xl">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Zap className="w-4 h-4" />
              <span>The CivicVision Solution</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              A Unified, Dual-Mode AI &amp; Resilient Mesh Engine
            </h3>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Instant Multimodal Vision:</strong> Gemini 3.7 Flash analyzes photos to automatically identify hazard type, severity level, and assigned engineering department.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Smart Duplicate Merging:</strong> Geospatial proximity clustering merges repetitive citizen reports into unified incident tickets (e.g. CIV-101 / INC-204).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Offline Store-and-Forward Mesh:</strong> Software-modeled peer-to-peer relaying routes SOS messages through nearby devices even without internet.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span><strong>Unified Situational Awareness:</strong> Instant dashboard overlay combining infrastructure damage, live SOS signals, missing persons, and rescue teams.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">How CivicVision Operates</h2>
          <p className="text-sm text-slate-400">Four seamless stages connecting citizens, AI classification engines, mesh networks, and command centres.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative">
            <div className="text-3xl font-black text-slate-800 mb-2">01</div>
            <h4 className="font-bold text-white text-sm mb-2">Citizen Report / SOS</h4>
            <p className="text-xs text-slate-400">Citizen captures a photo of road damage or taps the 1-touch Emergency SOS button with GPS coordinates.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative">
            <div className="text-3xl font-black text-slate-800 mb-2">02</div>
            <h4 className="font-bold text-white text-sm mb-2">Multimodal AI Vision</h4>
            <p className="text-xs text-slate-400">Gemini 3.7 Flash classifies issue type, confidence (94%+), hazard severity, and computes a 0-100 priority score.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative">
            <div className="text-3xl font-black text-slate-800 mb-2">03</div>
            <h4 className="font-bold text-white text-sm mb-2">Offline Mesh Relay</h4>
            <p className="text-xs text-slate-400">If internet is down, packets store-and-forward across phone nodes and drone repeaters to reach the nearest gateway.</p>
          </div>
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 relative">
            <div className="text-3xl font-black text-slate-800 mb-2">04</div>
            <h4 className="font-bold text-white text-sm mb-2">Unified Command</h4>
            <p className="text-xs text-slate-400">Control Centre sees live disaster heatmap, dispatches rescue teams, and receives AI situation summary briefings.</p>
          </div>
        </div>
      </section>

      {/* AI Capabilities & Smart Routing */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4" />
            <span>AI Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Six Core AI Capabilities</h2>
          <p className="text-sm text-slate-400">Engineered with Google Gemini 3.7 Flash for zero-latency, high-precision municipal decision support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Eye className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm mb-2">1. Image Classification</h4>
            <p className="text-xs text-slate-400">Identifies potholes, burst mains, broken streetlights, fallen trees, and cracked bridges with high accuracy.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Flame className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm mb-2">2. Severity Estimation</h4>
            <p className="text-xs text-slate-400">Classifies damage into Critical, High, Medium, or Low with specific civil safety hazard warnings.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm mb-2">3. Smart Routing</h4>
            <p className="text-xs text-slate-400">Auto-routes complaints to 8 specific municipal departments (Roads, Water, Power, Sanitation, Traffic, Disaster).</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm mb-2">4. Duplicate Detection</h4>
            <p className="text-xs text-slate-400">Geospatially groups multiple citizen complaints on the same hazard into one single tracked master incident.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm mb-2">5. Dynamic Priority Engine</h4>
            <p className="text-xs text-slate-400">Calculates a transparent 0-100 score considering proximity to hospitals, schools, aging time, and disaster multipliers.</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm mb-2">6. Disaster Situation Briefing</h4>
            <p className="text-xs text-slate-400">Generates instant executive incident commander briefings, threat vectors, and recommended rescue dispatches.</p>
          </div>
        </div>
      </section>

      {/* Emergency Mesh Network Disclaimer & Architecture */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        <div className="p-8 rounded-2xl bg-slate-900 border border-cyan-500/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Radio className="w-4 h-4" />
                <span>Simulated Store-and-Forward Mesh Architecture</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Offline Disaster Communication Engine
              </h3>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-600 text-xs font-mono">
              BLE &bull; Wi-Fi Direct &bull; LoRa Model
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            During power outages or telecom floods, browsers cannot directly broadcast raw sub-GHz RF without peripheral drivers. CivicVision demonstrates the future of disaster communications through a realistic software simulation: emergency SOS packets are assigned a TTL and Hop Counter, stored in local node queues, and relayed across nearby simulated devices until reaching an elevated drone repeater or satellite gateway.
          </p>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-cyan-300 flex flex-wrap items-center justify-between gap-3">
            <span>Device A (Trapped Citizen)</span>
            <span className="text-slate-500">&rarr;</span>
            <span>Device B (Relay Node)</span>
            <span className="text-slate-500">&rarr;</span>
            <span>Device C (Shopkeeper Node)</span>
            <span className="text-slate-500">&rarr;</span>
            <span>Drone Repeater (120m)</span>
            <span className="text-slate-500">&rarr;</span>
            <span className="text-amber-300 font-bold">Gateway Mast</span>
            <span className="text-slate-500">&rarr;</span>
            <span className="text-emerald-400 font-bold">Emergency Control Centre</span>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Ready to experience CivicVision?
        </h2>
        <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto">
          Explore both peacetime civic reporting and live flood disaster simulation with unified situational awareness.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onLaunch}
            className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition"
          >
            Launch Platform Dashboard
          </button>
          <button
            onClick={onStartDemo}
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition"
          >
            Start 14-Step SIH Demo
          </button>
        </div>
      </section>
    </div>
  );
};
