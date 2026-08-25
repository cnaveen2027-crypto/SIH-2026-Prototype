import React, { useState, useEffect } from 'react';
import { MeshNode, MeshMessage } from '../types';
import {
  Radio,
  WifiOff,
  Battery,
  Server,
  Send,
  RefreshCw,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { EmergencyNetworkService } from '../services/emergencyNetworkService';

interface MeshNetworkViewProps {
  nodes: MeshNode[];
  messages: MeshMessage[];
  onRelayMessage: (msgId: string) => void;
  onSendNewMeshMessage: (msg: MeshMessage) => void;
}

export const MeshNetworkView: React.FC<MeshNetworkViewProps> = ({
  nodes,
  messages,
  onRelayMessage,
  onSendNewMeshMessage,
}) => {
  const [selectedNode, setSelectedNode] = useState<MeshNode | null>(nodes[0] || null);
  const [activeSimulationPath, setActiveSimulationPath] = useState<string[]>([]);
  const [isSimulatingPacket, setIsSimulatingPacket] = useState(false);
  const [testPayload, setTestPayload] = useState('SOS: 3 People trapped at 4th Cross Lowland Basement. Water 1.8m.');

  // Find simulated path from first node to gateway
  const triggerSimulation = () => {
    setIsSimulatingPacket(true);
    const sourceNode = nodes.find((n) => !n.isGateway) || nodes[0];
    const path = EmergencyNetworkService.findPathToGateway(sourceNode.id, nodes);
    setActiveSimulationPath(path);

    // Create a new simulated message
    const msgId = `PKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMsg: MeshMessage = {
      id: msgId,
      messageId: msgId,
      senderId: sourceNode.id,
      senderName: sourceNode.name,
      timestamp: new Date().toISOString(),
      location: {
        lat: sourceNode.lat,
        lng: sourceNode.lng,
        address: 'Sector 4 Lowland Grid Node A',
        zone: 'Sector 4 Riverside Basin',
      },
      emergencyType: 'Trapped',
      priority: 'CRITICAL',
      payload: testPayload,
      payloadSummary: testPayload,
      hopCount: 0,
      maxHops: 5,
      ttlSeconds: 3600,
      path: [sourceNode.id],
      pathNodeIds: [sourceNode.id],
      status: 'OFFLINE',
    };

    onSendNewMeshMessage(newMsg);

    // Step-by-step propagation animation
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < path.length) {
        onRelayMessage(newMsg.id || newMsg.messageId);
      } else {
        clearInterval(interval);
        setIsSimulatingPacket(false);
      }
    }, 1200);
  };

  // Convert coords to percentage canvas
  const minLat = 12.9400;
  const maxLat = 12.9900;
  const minLng = 77.5650;
  const maxLng = 77.6150;

  function toCoords(lat: number, lng: number) {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(10, Math.min(90, x)),
      y: Math.max(10, Math.min(90, y)),
    };
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-mono mb-2">
            <Radio className="w-3.5 h-3.5" />
            <span>Store-and-Forward Delay-Tolerant Network (DTN)</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Offline Disaster Mesh Network Simulation
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Peer-to-peer radio topology routing distress packets across smartphones, drone relays, and satellite gateways.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={triggerSimulation}
          disabled={isSimulatingPacket}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
        >
          {isSimulatingPacket ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>Simulating Hop Propagation...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-slate-950" />
              <span>Send Test Mesh SOS Packet</span>
            </>
          )}
        </button>
      </div>

      {/* Mesh Topology Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden relative shadow-2xl">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Live Mesh Node Topology &amp; RF Propagation Links</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {nodes.length} Active Nodes &bull; {messages.length} Queued Packets
            </span>
          </div>

          <div className="relative w-full h-[420px] bg-[#0b101b] rounded-xl border border-slate-800/80 overflow-hidden">
            {/* SVG Link lines & radio waves */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <radialGradient id="nodeRange" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.2)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                </radialGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="210" x2="100%" y2="210" stroke="#1e293b" strokeDasharray="4,4" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1e293b" strokeDasharray="4,4" />

              {/* Links between connected peers */}
              {nodes.map((node) => {
                const c1 = toCoords(node.lat, node.lng);
                return node.connectedPeerIds.map((peerId) => {
                  const peer = nodes.find((n) => n.id === peerId);
                  if (!peer) return null;
                  const c2 = toCoords(peer.lat, peer.lng);

                  const isPathSegment =
                    activeSimulationPath.includes(node.id) && activeSimulationPath.includes(peer.id);

                  return (
                    <line
                      key={`${node.id}-${peer.id}`}
                      x1={`${c1.x}%`}
                      y1={`${c1.y}%`}
                      x2={`${c2.x}%`}
                      y2={`${c2.y}%`}
                      stroke={isPathSegment ? '#38bdf8' : '#0e7490'}
                      strokeWidth={isPathSegment ? 3.5 : 1.5}
                      strokeDasharray={isPathSegment ? 'none' : '4,3'}
                      strokeOpacity={isPathSegment ? 0.95 : 0.4}
                    />
                  );
                });
              })}

              {/* Radio Range Circles for Nodes */}
              {nodes.map((node) => {
                const c = toCoords(node.lat, node.lng);
                const r = node.isGateway ? '90' : node.type === 'drone_node' ? '110' : '50';
                return (
                  <circle
                    key={`range-${node.id}`}
                    cx={`${c.x}%`}
                    cy={`${c.y}%`}
                    r={r}
                    fill="url(#nodeRange)"
                    className={node.type === 'drone_node' ? 'animate-pulse' : ''}
                  />
                );
              })}
            </svg>

            {/* Interactive Node Markers */}
            {nodes.map((node) => {
              const c = toCoords(node.lat, node.lng);
              const isSelected = selectedNode?.id === node.id;
              const isInActivePath = activeSimulationPath.includes(node.id);

              return (
                <div
                  key={node.id}
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  onClick={() => setSelectedNode(node)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                      node.isGateway
                        ? 'bg-purple-600 border-purple-200 text-white shadow-lg shadow-purple-500/50 ring-2 ring-purple-400'
                        : node.type === 'drone_node'
                        ? 'bg-cyan-500 border-white text-slate-950 shadow-lg shadow-cyan-400/50 animate-bounce'
                        : isInActivePath
                        ? 'bg-amber-500 border-white text-slate-950 shadow-lg ring-2 ring-amber-400'
                        : 'bg-slate-800 border-cyan-500 text-cyan-300'
                    } ${isSelected ? 'scale-125 ring-4 ring-cyan-400' : ''}`}
                  >
                    <Radio className="w-4 h-4" />
                  </div>

                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap bg-slate-950/90 border border-slate-700 text-white rounded px-2 py-0.5 text-[10px] font-mono shadow-md pointer-events-none">
                    {node.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Simulation Trace Banner */}
          {activeSimulationPath.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs font-mono text-cyan-300 flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Active Packet Hop Route:</span>
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                {activeSimulationPath.map((nodeId, i) => {
                  const n = nodes.find((x) => x.id === nodeId);
                  return (
                    <React.Fragment key={nodeId}>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold">
                        {n?.name || nodeId}
                      </span>
                      {i < activeSimulationPath.length - 1 && (
                        <span className="text-slate-500">&rarr;</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Selected Node Telemetry & Packet Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Node Inspector */}
          {selectedNode ? (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    Node Telemetry
                  </span>
                  <h3 className="font-bold text-sm text-white">{selectedNode.name}</h3>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    selectedNode.isGateway
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  }`}
                >
                  {selectedNode.type}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Device ID:</span>
                  <span className="font-mono text-slate-300">{selectedNode.id}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Battery Level:</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1 font-mono">
                    <Battery className="w-3.5 h-3.5" />
                    <span>{selectedNode.battery}%</span>
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Radio Range:</span>
                  <span className="text-cyan-300 font-mono">{selectedNode.rangeMeters} meters</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Queued SOS Messages:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {selectedNode.storedMessageCount} packets
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-500">Connected Peers:</span>
                  <span className="text-slate-200 font-mono">
                    {selectedNode.connectedPeerIds.length} nearby nodes
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
              Click a mesh node on the map to inspect its packet queue.
            </div>
          )}

          {/* Live Packet Feed */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Store-and-Forward Message Queue</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {messages.length} Live Packets
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">No active packets in transit.</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-400 text-[11px] font-bold">{msg.id}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                          msg.status === 'GATEWAY_FOUND' || msg.status === 'RECEIVED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {msg.status} (Hops: {msg.hopCount})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2">{msg.payload}</p>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
                      <span>Sender: {msg.senderName}</span>
                      <span>TTL: {msg.ttlSeconds}s</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Technical Architecture Deep Dive Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
        <div className="font-bold text-slate-300 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hackathon Simulation Note:</span>
        </div>
        <p className="leading-relaxed">
          This module realistically simulates Delay-Tolerant Store-and-Forward Relaying (DTN RFC 5050). In native Android/embedded deployments, the same protocol routes through Wi-Fi Direct (Wi-Fi Aware NAN) and Bluetooth Low Energy (BLE 5.0 Long Range Coded PHY) without requiring internet or cellular base stations.
        </p>
      </div>
    </div>
  );
};
