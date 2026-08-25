import React, { useState } from 'react';
import { EmergencyType, EmergencyAlert, LocationCoordinates, SeverityLevel } from '../types';
import {
  AlertTriangle,
  Radio,
  WifiOff,
  Battery,
  Users,
  MapPin,
  HeartPulse,
  Send,
  CheckCircle2,
  Shield,
  LifeBuoy,
  RefreshCw,
  PhoneCall,
} from 'lucide-react';

interface EmergencySOSViewProps {
  onTriggerSOS: (alert: EmergencyAlert) => void;
  isInternetOnline: boolean;
  onNavigateToNetwork: () => void;
}

export const EmergencySOSView: React.FC<EmergencySOSViewProps> = ({
  onTriggerSOS,
  isInternetOnline,
  onNavigateToNetwork,
}) => {
  const [emergencyType, setEmergencyType] = useState<EmergencyType>('Trapped');
  const [userName, setUserName] = useState('Ramesh Kulkarni');
  const [phone, setPhone] = useState('+91 98450 11204');
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [details, setDetails] = useState(
    'Basement and ground floor submerged under 1.8m rising floodwaters. Power cut, water rising.'
  );
  const [medicalConditions, setMedicalConditions] = useState(
    'Elderly grandmother with diabetic insulin requirement, 1 child with mild asthma'
  );
  const [batteryLevel, setBatteryLevel] = useState<number>(34);
  const [address, setAddress] = useState('Riverside Enclave, Flat 2B, Lowland Basin');
  const [lat, setLat] = useState<number>(12.9512);
  const [lng, setLng] = useState<number>(77.5891);

  const [isTransmitting, setIsTransmitting] = useState(false);
  const [activeSOSAlert, setActiveSOSAlert] = useState<EmergencyAlert | null>(null);

  const handleSendSOS = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);

    const alertId = `SOS-${Math.floor(900 + Math.random() * 99)}`;
    const priority: SeverityLevel =
      emergencyType === 'Trapped' || emergencyType === 'Medical assistance' || emergencyType === 'Need rescue'
        ? 'CRITICAL'
        : emergencyType === 'Missing person'
        ? 'HIGH'
        : 'LOW';

    const newAlert: EmergencyAlert = {
      id: alertId,
      userId: 'citizen_user_sos',
      userName,
      phone,
      emergencyType,
      priority,
      location: {
        lat,
        lng,
        address,
        zone: 'Sector 4 Riverside Basin',
      },
      peopleCount,
      details,
      medicalConditions: medicalConditions || undefined,
      batteryLevel,
      status: isInternetOnline ? 'RECEIVED' : 'OFFLINE',
      hopCount: 0,
      createdAt: new Date().toISOString(),
      rescueStatus: 'PENDING',
      offlineGenerated: !isInternetOnline,
    };

    setTimeout(() => {
      onTriggerSOS(newAlert);
      setActiveSOSAlert(newAlert);
      setIsTransmitting(false);
    }, 500);
  };

  const emergencyOptions: { type: EmergencyType; label: string; icon: any; color: string; desc: string }[] = [
    {
      type: 'Trapped',
      label: 'Trapped in Building / Flood',
      icon: AlertTriangle,
      color: 'border-red-500 bg-red-950/40 text-red-300',
      desc: 'Surrounded by rising water, collapsed entrance, or structural obstacle',
    },
    {
      type: 'Medical assistance',
      label: 'Medical Emergency / Trauma',
      icon: HeartPulse,
      color: 'border-rose-500 bg-rose-950/40 text-rose-300',
      desc: 'Critical injury, severe illness, dialysis/insulin requirement',
    },
    {
      type: 'Need rescue',
      label: 'Need Immediate Evacuation',
      icon: LifeBuoy,
      color: 'border-orange-500 bg-orange-950/40 text-orange-300',
      desc: 'Stranded on rooftop, islanded enclave, infants/elderly',
    },
    {
      type: 'Missing person',
      label: 'Missing Family Member',
      icon: Users,
      color: 'border-amber-500 bg-amber-950/40 text-amber-300',
      desc: 'Separated during evacuation or storm surge',
    },
    {
      type: 'Safe',
      label: 'I am Safe / In Shelter',
      icon: CheckCircle2,
      color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
      desc: 'Reached high ground or relief camp; inform responders',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Emergency Response &bull; 1-Touch Distress Channel</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Emergency SOS Distress Beacon</h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct link to municipal disaster responders. Functions even during cellular network blackouts via simulated peer-to-peer store-and-forward mesh.
        </p>
      </div>

      {/* Connectivity Status Banner */}
      <div
        className={`p-3.5 rounded-xl border mb-6 flex items-center justify-between text-xs font-mono ${
          isInternetOnline
            ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
            : 'bg-amber-950/70 border-amber-500 text-amber-200 animate-pulse'
        }`}
      >
        <div className="flex items-center gap-2">
          {isInternetOnline ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Cellular 5G / Broadband Grid: <strong>ONLINE</strong> (Direct Transmission)</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-amber-400" />
              <span>Cellular Grid: <strong>OFFLINE</strong> &bull; Emergency Mesh Store-and-Forward Relay Active!</span>
            </>
          )}
        </div>
        {!isInternetOnline && (
          <button
            onClick={onNavigateToNetwork}
            className="text-xs underline text-amber-300 hover:text-amber-100 font-sans"
          >
            View Mesh Map &rarr;
          </button>
        )}
      </div>

      {/* Active Alert Confirmation Card */}
      {activeSOSAlert ? (
        <div className="p-6 rounded-2xl bg-slate-900 border-2 border-red-500 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
              <span>SOS Alert Transmitted ({activeSOSAlert.id})</span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-red-950 text-red-300 font-mono text-xs border border-red-700">
              Status: {activeSOSAlert.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Emergency Type:</span>
              <div className="font-bold text-white text-sm mt-0.5">{activeSOSAlert.emergencyType}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Persons Trapped:</span>
              <div className="font-bold text-amber-400 text-sm mt-0.5">{activeSOSAlert.peopleCount} individuals</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400">Hop Count / Network:</span>
              <div className="font-bold text-cyan-400 font-mono text-sm mt-0.5">
                {activeSOSAlert.hopCount} Hops ({activeSOSAlert.offlineGenerated ? 'Mesh Relay' : '5G Direct'})
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-200">
            <strong>Incident Details:</strong> {activeSOSAlert.details}
            {activeSOSAlert.medicalConditions && (
              <div className="mt-1 text-red-300">
                <strong>Medical:</strong> {activeSOSAlert.medicalConditions}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>{activeSOSAlert.location.address}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToNetwork}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition"
              >
                Track Mesh Packet Path &rarr;
              </button>
              <button
                onClick={() => setActiveSOSAlert(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
              >
                Update / New SOS
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* SOS Submission Form */
        <form onSubmit={handleSendSOS} className="space-y-6">
          {/* Emergency Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              1. Select Emergency Classification
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {emergencyOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = emergencyType === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setEmergencyType(opt.type)}
                    className={`p-3.5 rounded-xl border text-left transition flex items-start gap-3 ${
                      isSelected
                        ? `${opt.color} border-2 shadow-lg ring-1 ring-white/20`
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-950/60 flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">{opt.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact & Location Details */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. Distress Details &amp; Critical Medical Context
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Your Name / Contact Person</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone / Radio ID</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Number of People Trapped</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500 font-mono"
                    required
                  />
                  <Users className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Exact Location / Landmark</label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white pl-8 outline-none focus:border-red-500 font-mono"
                  required
                />
                <MapPin className="w-4 h-4 text-red-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Distress Condition &amp; Rising Hazards
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                placeholder="e.g. Water reached 1.5m, roof access available, elderly person needs evacuation boat..."
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Medical Urgency / Medications Trapped
              </label>
              <input
                type="text"
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-red-500"
                placeholder="e.g. Diabetic insulin required, asthma inhaler, severe fracture..."
              />
            </div>

            {/* Battery Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5">
                  <Battery className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulated Device Battery Status:</span>
                </span>
                <span className="font-mono font-bold text-white">{batteryLevel}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Big High-Impact SOS Button */}
          <div className="text-center pt-2">
            <button
              type="submit"
              id="confirm-sos-btn"
              disabled={isTransmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-lg tracking-wide shadow-2xl shadow-red-600/40 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isTransmitting ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Transmitting Distress Signal...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                  <span>BROADCAST EMERGENCY SOS BEACON</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-500 mt-2">
              Transmits GPS telemetry and medical payload to nearest responders &amp; SDRF rescue units.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
