import React, { useState } from 'react';
import {
  InfrastructureReport,
  EmergencyAlert,
  MissingPerson,
  RescueTeam,
  MeshNode,
  DisasterZone,
  UserRole,
} from '../types';
import {
  Layers,
  MapPin,
  AlertTriangle,
  LifeBuoy,
  Radio,
  ShieldAlert,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Compass,
  Maximize2,
  Minimize2,
  Navigation,
} from 'lucide-react';

interface UnifiedDisasterMapViewProps {
  reports: InfrastructureReport[];
  alerts: EmergencyAlert[];
  missingPersons: MissingPerson[];
  rescueTeams: RescueTeam[];
  meshNodes: MeshNode[];
  disasterZones: DisasterZone[];
  isDisasterActive: boolean;
  userRole: UserRole;
  onSelectReport?: (report: InfrastructureReport) => void;
  onSelectAlert?: (alert: EmergencyAlert) => void;
}

export const UnifiedDisasterMapView: React.FC<UnifiedDisasterMapViewProps> = ({
  reports,
  alerts,
  missingPersons,
  rescueTeams,
  meshNodes,
  disasterZones,
  isDisasterActive,
  userRole,
  onSelectReport,
  onSelectAlert,
}) => {
  // Layer toggles
  const [showInfrastructure, setShowInfrastructure] = useState(true);
  const [showSOSAlerts, setShowSOSAlerts] = useState(true);
  const [showMissingPersons, setShowMissingPersons] = useState(true);
  const [showRescueTeams, setShowRescueTeams] = useState(true);
  const [showMeshNodes, setShowMeshNodes] = useState(true);
  const [showDisasterZones, setShowDisasterZones] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Category & severity filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Selected item modal
  const [activeItem, setActiveItem] = useState<{
    type: 'report' | 'alert' | 'missing' | 'team' | 'node';
    data: any;
  } | null>(null);

  // Map viewport simulation coordinates (Bengaluru Urban bounding box)
  // Lat: 12.9400 to 12.9900 (Span: 0.0500)
  // Lng: 77.5650 to 77.6150 (Span: 0.0500)
  const minLat = 12.9400;
  const maxLat = 12.9900;
  const minLng = 77.5650;
  const maxLng = 77.6150;

  function toScreenCoords(lat: number, lng: number) {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    // Y inverted because SVG / CSS coords start top-left
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  }

  // Filtered infrastructure reports
  const filteredReports = reports.filter((r) => {
    if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
    if (selectedSeverity !== 'ALL' && r.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Map Control Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{isDisasterActive ? 'Disaster Situational Awareness GIS' : 'Metropolitan Infrastructure Map'}</span>
              <span
                className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                  isDisasterActive
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isDisasterActive ? 'Emergency Live GIS' : 'Normal Civic Mode'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive multi-layer geospatial engine with real-time hazard overlays.
            </p>
          </div>
        </div>

        {/* Layer Checkboxes */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowInfrastructure(!showInfrastructure)}
            className={`px-2.5 py-1 rounded-md border transition flex items-center gap-1.5 ${
              showInfrastructure
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Civic Issues ({filteredReports.length})</span>
          </button>

          <button
            onClick={() => setShowSOSAlerts(!showSOSAlerts)}
            className={`px-2.5 py-1 rounded-md border transition flex items-center gap-1.5 ${
              showSOSAlerts
                ? 'bg-red-600/30 text-red-300 border-red-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            <span>SOS Alerts ({alerts.length})</span>
          </button>

          <button
            onClick={() => setShowMissingPersons(!showMissingPersons)}
            className={`px-2.5 py-1 rounded-md border transition flex items-center gap-1.5 ${
              showMissingPersons
                ? 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Missing Persons ({missingPersons.length})</span>
          </button>

          <button
            onClick={() => setShowRescueTeams(!showRescueTeams)}
            className={`px-2.5 py-1 rounded-md border transition flex items-center gap-1.5 ${
              showRescueTeams
                ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Rescue Teams ({rescueTeams.length})</span>
          </button>

          <button
            onClick={() => setShowMeshNodes(!showMeshNodes)}
            className={`px-2.5 py-1 rounded-md border transition flex items-center gap-1.5 ${
              showMeshNodes
                ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Mesh Nodes ({meshNodes.length})</span>
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2.5 py-1 rounded-md border transition ${
              showHeatmap
                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            Heatmap: {showHeatmap ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Filter by issue category"
          className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
        >
          <option value="ALL">All Categories</option>
          <option value="Pothole">Pothole</option>
          <option value="Road damage">Road damage</option>
          <option value="Water leakage">Water leakage</option>
          <option value="Broken streetlight">Broken streetlight</option>
          <option value="Garbage accumulation">Garbage accumulation</option>
          <option value="Fallen tree">Fallen tree</option>
          <option value="Public infrastructure damage">Public infrastructure damage</option>
        </select>

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          aria-label="Filter by severity level"
          className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">🔴 Critical</option>
          <option value="HIGH">🟠 High</option>
          <option value="MEDIUM">🟡 Medium</option>
          <option value="LOW">🟢 Low</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          aria-label="Filter by report status"
          className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="REPORTED">Reported</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <div className="ml-auto text-[11px] text-slate-400 font-mono">
          Showing {filteredReports.length} incidents &bull; Lat 12.940° - 12.990° N
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[580px] bg-[#0c121e] overflow-hidden select-none">
        {/* SVG Basemap Grid / Water / Arterials */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(30, 58, 95, 0.25)" strokeWidth="1" />
            </pattern>
            {/* Flood gradient overlay */}
            <radialGradient id="floodGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.45)" />
              <stop offset="80%" stopColor="rgba(37, 99, 235, 0.25)" />
              <stop offset="100%" stopColor="rgba(29, 78, 216, 0)" />
            </radialGradient>
            {/* Heatmap gradient */}
            <radialGradient id="heatGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.6)" />
              <stop offset="50%" stopColor="rgba(249, 115, 22, 0.3)" />
              <stop offset="100%" stopColor="rgba(234, 179, 8, 0)" />
            </radialGradient>
          </defs>

          {/* Grid background */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Simulated River / Waterway */}
          <path
            d="M -10,480 C 200,450 350,520 600,460 C 850,400 1050,440 1200,420"
            fill="none"
            stroke="#172554"
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M -10,480 C 200,450 350,520 600,460 C 850,400 1050,440 1200,420"
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="22"
            strokeLinecap="round"
            strokeOpacity="0.4"
          />

          {/* Primary Arterial Road Network */}
          {/* Outer Ring Road loop */}
          <path
            d="M 80,100 Q 600,60 1100,120 Q 1150,500 800,530 Q 200,560 80,100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="8"
          />
          {/* Central Arterial North-South */}
          <line x1="580" y1="0" x2="580" y2="580" stroke="#334155" strokeWidth="5" strokeDasharray="6,4" />
          {/* East-West Highway */}
          <line x1="0" y1="290" x2="1200" y2="290" stroke="#334155" strokeWidth="5" strokeDasharray="6,4" />

          {/* Diagonal Transit Corridors */}
          <line x1="120" y1="120" x2="1050" y2="480" stroke="#1e293b" strokeWidth="4" />
          <line x1="1050" y1="120" x2="120" y2="480" stroke="#1e293b" strokeWidth="4" />

          {/* Mesh Network Topology Radio Links */}
          {showMeshNodes && (
            <g className="mesh-links">
              {meshNodes.map((node) => {
                const c1 = toScreenCoords(node.lat, node.lng);
                return node.connectedPeerIds.map((peerId) => {
                  const peer = meshNodes.find((n) => n.id === peerId);
                  if (!peer) return null;
                  const c2 = toScreenCoords(peer.lat, peer.lng);
                  return (
                    <line
                      key={`${node.id}-${peer.id}`}
                      x1={`${c1.x}%`}
                      y1={`${c1.y}%`}
                      x2={`${c2.x}%`}
                      y2={`${c2.y}%`}
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      strokeDasharray="4,3"
                      strokeOpacity="0.45"
                    />
                  );
                });
              })}
            </g>
          )}

          {/* Disaster Flood Inundation Zones */}
          {isDisasterActive && showDisasterZones && (
            <g className="disaster-zones">
              {disasterZones.map((zone) => {
                const center = toScreenCoords(zone.center.lat, zone.center.lng);
                return (
                  <g key={zone.id}>
                    <circle
                      cx={`${center.x}%`}
                      cy={`${center.y}%`}
                      r="120"
                      fill="url(#floodGrad)"
                      className="animate-pulse"
                    />
                    <circle
                      cx={`${center.x}%`}
                      cy={`${center.y}%`}
                      r="120"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="6,4"
                      strokeOpacity="0.8"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Heatmap overlay */}
          {showHeatmap && (
            <g className="heatmap-overlay">
              {filteredReports.map((r) => {
                const c = toScreenCoords(r.location.lat, r.location.lng);
                return (
                  <circle
                    key={`heat-${r.id}`}
                    cx={`${c.x}%`}
                    cy={`${c.y}%`}
                    r={r.severity === 'CRITICAL' ? '80' : r.severity === 'HIGH' ? '60' : '40'}
                    fill="url(#heatGrad)"
                    opacity="0.75"
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* Map District Labels */}
        <div className="absolute top-6 left-10 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider pointer-events-none">
          Sector 1 &bull; North Industrial Corridor
        </div>
        <div className="absolute top-6 right-10 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider pointer-events-none">
          Sector 2 &bull; East Tech Park
        </div>
        <div className="absolute bottom-6 left-10 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider pointer-events-none">
          Sector 4 &bull; Riverside Lowlands (Flood Zone)
        </div>
        <div className="absolute bottom-6 right-10 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider pointer-events-none">
          Sector 3 &bull; Central Government &amp; Hospital Hub
        </div>

        {/* 1. Infrastructure Report Markers */}
        {showInfrastructure &&
          filteredReports.map((report) => {
            const pos = toScreenCoords(report.location.lat, report.location.lng);
            const isCritical = report.severity === 'CRITICAL';
            const isHigh = report.severity === 'HIGH';
            const isResolved = report.status === 'RESOLVED';

            return (
              <div
                key={report.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => {
                  setActiveItem({ type: 'report', data: report });
                  if (onSelectReport) onSelectReport(report);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border transition-all duration-200 group-hover:scale-125 ${
                    isResolved
                      ? 'bg-emerald-600 border-emerald-300 text-white'
                      : isCritical
                      ? 'bg-red-600 border-white text-white animate-bounce'
                      : isHigh
                      ? 'bg-orange-500 border-white text-white'
                      : 'bg-amber-500 border-white text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                {/* Marker Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900/95 border border-slate-700 text-white rounded-lg p-2 text-xs shadow-2xl whitespace-nowrap z-30 pointer-events-none">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{report.category}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                      Score {report.priorityScore}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{report.location.address}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Status: {report.status}</div>
                </div>
              </div>
            );
          })}

        {/* 2. Emergency SOS Alert Markers */}
        {showSOSAlerts &&
          alerts.map((alert) => {
            const pos = toScreenCoords(alert.location.lat, alert.location.lng);
            return (
              <div
                key={alert.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => {
                  setActiveItem({ type: 'alert', data: alert });
                  if (onSelectAlert) onSelectAlert(alert);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white text-white flex items-center justify-center shadow-xl shadow-red-500/50 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 animate-ping"></span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-red-950/95 border border-red-500/60 text-white rounded-lg p-2 text-xs shadow-2xl whitespace-nowrap z-30 pointer-events-none">
                  <div className="font-bold text-red-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>SOS: {alert.emergencyType} ({alert.peopleCount} ppl)</span>
                  </div>
                  <div className="text-[11px] text-slate-200">{alert.userName}</div>
                  <div className="text-[10px] text-red-400">Hop: {alert.hopCount} &bull; Relay: {alert.status}</div>
                </div>
              </div>
            );
          })}

        {/* 3. Missing Person Sightings */}
        {showMissingPersons &&
          missingPersons.map((mp) => {
            const pos = toScreenCoords(mp.lastKnownLocation.lat, mp.lastKnownLocation.lng);
            return (
              <div
                key={mp.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => setActiveItem({ type: 'missing', data: mp })}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-15"
              >
                <div className="w-7 h-7 rounded-full bg-amber-600 border-2 border-white text-white flex items-center justify-center shadow-lg">
                  <LifeBuoy className="w-3.5 h-3.5" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 border border-amber-500 text-white rounded-lg p-2 text-xs shadow-2xl whitespace-nowrap z-30 pointer-events-none">
                  <div className="font-bold text-amber-400">Missing: {mp.name} (Age {mp.age})</div>
                  <div className="text-[11px] text-slate-300">Status: {mp.status}</div>
                </div>
              </div>
            );
          })}

        {/* 4. Rescue Teams */}
        {showRescueTeams &&
          rescueTeams.map((team) => {
            const pos = toScreenCoords(team.location.lat, team.location.lng);
            return (
              <div
                key={team.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => setActiveItem({ type: 'team', data: team })}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 border-2 border-emerald-200 text-white flex items-center justify-center shadow-lg">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-emerald-950 border border-emerald-500 text-white rounded-lg p-2 text-xs shadow-2xl whitespace-nowrap z-30 pointer-events-none">
                  <div className="font-bold text-emerald-300">{team.name}</div>
                  <div className="text-[11px] text-slate-300">Status: {team.status} ({team.personnelCount} crew)</div>
                </div>
              </div>
            );
          })}

        {/* 5. Mesh Communication Nodes */}
        {showMeshNodes &&
          meshNodes.map((node) => {
            const pos = toScreenCoords(node.lat, node.lng);
            return (
              <div
                key={node.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => setActiveItem({ type: 'node', data: node })}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border shadow-md ${
                    node.isGateway
                      ? 'bg-purple-600 border-purple-200 text-white ring-2 ring-purple-400/50'
                      : node.type === 'drone_node'
                      ? 'bg-cyan-500 border-cyan-100 text-slate-950 animate-pulse'
                      : 'bg-slate-800 border-cyan-400 text-cyan-300'
                  }`}
                >
                  <Radio className="w-3 h-3" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 border border-cyan-500 text-white rounded-lg p-2 text-xs shadow-2xl whitespace-nowrap z-30 pointer-events-none">
                  <div className="font-bold text-cyan-300">{node.name}</div>
                  <div className="text-[11px] text-slate-400">
                    Type: {node.type} &bull; Battery: {node.battery}%
                  </div>
                </div>
              </div>
            );
          })}

        {/* Map Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800/90 rounded-xl p-3 text-[11px] text-slate-300 backdrop-blur-md shadow-2xl z-25 max-w-xs">
          <div className="font-bold text-white mb-1.5 flex items-center justify-between">
            <span>GIS Map Legend</span>
            <span className="text-[10px] text-slate-500 font-mono">1:25,000</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white"></span>
              <span>Critical Hazard</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Resolved Ticket</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span>SOS Emergency</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span>Mesh Device Node</span>
            </div>
          </div>
        </div>

        {/* Selected Marker Inspector Sidebar */}
        {activeItem && (
          <div className="absolute top-4 right-4 w-80 bg-slate-950/95 border border-slate-700/80 rounded-xl p-4 text-white shadow-2xl backdrop-blur-md z-30 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                {activeItem.type.toUpperCase()} DETAILS
              </span>
              <button
                onClick={() => setActiveItem(null)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
              >
                &times; Close
              </button>
            </div>

            {activeItem.type === 'report' && (
              <div className="space-y-2.5 text-xs">
                <div className="font-bold text-sm text-white">{activeItem.data.title}</div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono text-[10px]">
                    {activeItem.data.ticketId}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-900/60 text-red-300 font-bold text-[10px]">
                    {activeItem.data.severity}
                  </span>
                  <span className="text-slate-400 text-[11px]">{activeItem.data.category}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{activeItem.data.description}</p>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                  <div className="text-slate-400 font-medium">Department: {activeItem.data.assignedDepartment}</div>
                  <div className="text-cyan-400 font-mono">Priority Score: {activeItem.data.priorityScore}/100 ({activeItem.data.priority})</div>
                </div>
                {activeItem.data.duplicateReportsCount > 1 && (
                  <div className="p-2 rounded bg-purple-950/40 border border-purple-800 text-purple-300 text-[10px]">
                    <strong>Duplicate Cluster:</strong> {activeItem.data.duplicateReportsCount} citizen reports merged into this incident.
                  </div>
                )}
              </div>
            )}

            {activeItem.type === 'alert' && (
              <div className="space-y-2.5 text-xs">
                <div className="font-bold text-sm text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>EMERGENCY SOS ALERT</span>
                </div>
                <div className="text-white font-medium">{activeItem.data.userName}</div>
                <div className="text-slate-300 text-[11px]">Location: {activeItem.data.location.address}</div>
                <div className="p-2 rounded bg-red-950/60 border border-red-800 text-red-200 text-[11px]">
                  <strong>Condition:</strong> {activeItem.data.details}
                  {activeItem.data.medicalConditions && (
                    <div className="mt-1 text-red-300"><strong>Medical:</strong> {activeItem.data.medicalConditions}</div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-1.5 rounded bg-slate-900">
                    <span className="text-slate-400">Heads:</span> <strong>{activeItem.data.peopleCount}</strong>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900">
                    <span className="text-slate-400">Hop Count:</span> <strong>{activeItem.data.hopCount}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeItem.type === 'team' && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-sm text-emerald-400">{activeItem.data.name}</div>
                <div className="text-slate-300">Type: {activeItem.data.type}</div>
                <div className="text-slate-300">Crew Size: {activeItem.data.personnelCount} members</div>
                <div className="text-cyan-400 font-mono">Radio: {activeItem.data.contactRadio}</div>
                <div className="text-slate-400 text-[10px]">Equipment: {activeItem.data.equipment?.join(', ')}</div>
              </div>
            )}

            {activeItem.type === 'node' && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-sm text-cyan-300">{activeItem.data.name}</div>
                <div className="text-slate-300">Node Type: {activeItem.data.type}</div>
                <div className="text-slate-300">Battery Level: {activeItem.data.battery}%</div>
                <div className="text-slate-300">RF Range: {activeItem.data.rangeMeters}m</div>
                <div className="text-amber-400">Stored Packets: {activeItem.data.storedMessageCount} in queue</div>
              </div>
            )}

            {activeItem.type === 'missing' && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-sm text-amber-300">{activeItem.data.name} (Age {activeItem.data.age})</div>
                <div className="text-slate-300">Last Seen: {activeItem.data.lastKnownLocation.address}</div>
                <div className="text-slate-300">Clothing: {activeItem.data.clothing}</div>
                <div className="text-red-400 font-medium">Contact: {activeItem.data.emergencyContact}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
