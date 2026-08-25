import React, { useState } from 'react';
import {
  EmergencyAlert,
  InfrastructureReport,
  MissingPerson,
  RescueTeam,
  MeshNode,
  DisasterZone,
} from '../types';
import {
  ShieldAlert,
  Users,
  AlertTriangle,
  Radio,
  Sparkles,
  RefreshCw,
  Clock,
  MapPin,
  CheckCircle2,
  LifeBuoy,
  Send,
  BarChart2,
  Activity,
  Layers,
} from 'lucide-react';
import { AIService } from '../services/aiService';

interface DisasterControlCentreViewProps {
  alerts: EmergencyAlert[];
  reports: InfrastructureReport[];
  missingPersons: MissingPerson[];
  rescueTeams: RescueTeam[];
  meshNodes: MeshNode[];
  disasterZones: DisasterZone[];
  onDispatchTeam: (teamId: string, alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
}

export const DisasterControlCentreView: React.FC<DisasterControlCentreViewProps> = ({
  alerts,
  reports,
  missingPersons,
  rescueTeams,
  meshNodes,
  disasterZones,
  onDispatchTeam,
  onResolveAlert,
}) => {
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [aiBriefing, setAiBriefing] = useState<{
    executiveSummary: string;
    criticalThreats: string[];
    recommendedActions: string[];
    estimatedEvacuationHours: number;
  } | null>({
    executiveSummary:
      'Catastrophic Category-3 flash flooding in Sector 4 Riverside Basin has trapped approximately 14 citizens across 4 residential clusters. Cellular infrastructure in Sector 4 is 100% offline; store-and-forward mesh nodes are actively routing SOS telemetry. Immediate priority is waterborne inflatable boat evacuation at 4th Cross Lowland Basement before anticipated 20:00 reservoir gate discharge.',
    criticalThreats: [
      'Overwash breaching Outer Ring Road culverts risking electrical pole collapse.',
      'Diabetic insulin emergency at Riverside Enclave Flat 2B.',
      'Cellular tower blackouts requiring drone repeater flight patrol maintainers.',
    ],
    recommendedActions: [
      'Dispatch SDRF Boat Unit Alpha to Sector 4 Lowland Basin.',
      'Deploy Tethered Drone Repeater Echo to expand BLE/Wi-Fi mesh coverage over Tech Park.',
      'Stage NDRF Medical Mobile Unit at St. Martha Hospital bypass checkpoint.',
    ],
    estimatedEvacuationHours: 3.5,
  });

  const totalTrapped = alerts.reduce((acc, curr) => acc + curr.peopleCount, 0);
  const pendingAlerts = alerts.filter((a) => a.rescueStatus === 'PENDING' || a.rescueStatus === 'DISPATCHED');
  const availableTeams = rescueTeams.filter((t) => t.status === 'AVAILABLE');

  // Trigger real-time Gemini AI Incident Briefing
  const generateNewBriefing = async () => {
    setIsGeneratingBriefing(true);
    try {
      const summary = await AIService.generateDisasterSummary({
        alerts,
        reports,
        missingCount: missingPersons.length,
        trappedCount: totalTrapped,
      });
      setAiBriefing(summary);
    } catch (err) {
      console.error('Failed to generate briefing:', err);
    } finally {
      setIsGeneratingBriefing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-mono mb-2 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Joint Disaster Response Coordination Desk &bull; LIVE</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Disaster Incident Commander Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Unified tactical situational awareness combining satellite telemetry, AI threat forecasting, and field unit dispatch.
          </p>
        </div>

        <button
          onClick={generateNewBriefing}
          disabled={isGeneratingBriefing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition disabled:opacity-50"
        >
          {isGeneratingBriefing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Gemini 3.7 Synthesizing Briefing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate AI Incident Briefing</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-red-500/40 shadow-xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Active SOS Alerts</div>
          <div className="text-2xl font-extrabold text-red-400 mt-1">{pendingAlerts.length}</div>
          <div className="text-[10px] text-red-300 font-mono mt-0.5 animate-pulse">Urgent Response</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/40 shadow-xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Trapped Citizens</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{totalTrapped}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">In flood basin</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Missing Persons</div>
          <div className="text-2xl font-extrabold text-white mt-1">{missingPersons.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Reported missing</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 shadow-xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Rescue Units</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{rescueTeams.length}</div>
          <div className="text-[10px] text-emerald-300 font-mono mt-0.5">
            {availableTeams.length} Ready for dispatch
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Mesh Relays</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{meshNodes.length}</div>
          <div className="text-[10px] text-cyan-300 font-mono mt-0.5">100% DTN Online</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Infra Hazards</div>
          <div className="text-2xl font-extrabold text-slate-200 mt-1">{reports.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Damaged assets</div>
        </div>
      </div>

      {/* AI Commander Tactical Briefing Card */}
      {aiBriefing && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Gemini 3.7 Flash Incident Commander Briefing
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
              Est. Window: {aiBriefing.estimatedEvacuationHours}h
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            {aiBriefing.executiveSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Critical Threats */}
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-900/60 space-y-1.5">
              <div className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Immediate Threat Vectors</span>
              </div>
              <ul className="space-y-1 text-xs text-red-200/90">
                {aiBriefing.criticalThreats.map((threat, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-red-400 font-bold">&bull;</span>
                    <span>{threat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tactical Resource Allocation */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/60 space-y-1.5">
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recommended Dispatch Actions</span>
              </div>
              <ul className="space-y-1 text-xs text-emerald-200/90">
                {aiBriefing.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: SOS Triage Queue (7 cols) + Rescue Unit Dispatch (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Emergency SOS Triage Feed (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
              <span>Active Distress Signal Triage Queue</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {pendingAlerts.length} Pending Actions
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition ${
                  alert.rescueStatus === 'RESCUED'
                    ? 'bg-slate-950/60 border-emerald-900/60 opacity-60'
                    : alert.priority === 'CRITICAL'
                    ? 'bg-red-950/40 border-red-700/80 shadow-lg'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{alert.userName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                        {alert.id}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-900 text-red-200">
                        {alert.priority}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{alert.location.address}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      alert.rescueStatus === 'RESCUED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : alert.rescueStatus === 'DISPATCHED'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                    }`}
                  >
                    {alert.rescueStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{alert.details}</p>

                {alert.medicalConditions && (
                  <div className="text-[11px] text-rose-300 mb-2 p-1.5 rounded bg-rose-950/40 border border-rose-900">
                    <strong>Medical Critical:</strong> {alert.medicalConditions}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="text-slate-400 font-mono text-[11px]">
                    <strong>{alert.peopleCount}</strong> people &bull; Batt: {alert.batteryLevel}% &bull; Hops:{' '}
                    {alert.hopCount}
                  </div>

                  {alert.rescueStatus !== 'RESCUED' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const firstAvail = availableTeams[0];
                          if (firstAvail) {
                            onDispatchTeam(firstAvail.id, alert.id);
                          } else {
                            onDispatchTeam(rescueTeams[0].id, alert.id);
                          }
                        }}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                      >
                        Dispatch Crew
                      </button>
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-3 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs"
                      >
                        Mark Rescued
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Rescue Units Status & Dispatch Control (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Deployed Rescue Teams (SDRF / NDRF)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {rescueTeams.length} Total Units
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {rescueTeams.map((team) => (
              <div
                key={team.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">{team.name}</div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      team.status === 'AVAILABLE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : team.status === 'DEPLOYED'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {team.status}
                  </span>
                </div>

                <div className="text-slate-300 text-xs">
                  Crew: <strong>{team.personnelCount} members</strong> &bull; Radio: {team.contactRadio}
                </div>

                <div className="text-[11px] text-slate-400">
                  <strong>Specialization:</strong> {team.type}
                </div>

                <div className="text-[10px] text-slate-500">
                  <strong>Equipment:</strong> {team.equipment?.join(', ')}
                </div>

                {team.assignedIncidentId && (
                  <div className="text-[11px] text-cyan-300 font-mono p-1.5 rounded bg-cyan-950/40 border border-cyan-900">
                    Active Assignment: <strong>{team.assignedIncidentId}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
