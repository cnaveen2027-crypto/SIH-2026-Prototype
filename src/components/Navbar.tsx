import React from 'react';
import {
  ShieldAlert,
  Activity,
  Layers,
  AlertTriangle,
  Radio,
  FileText,
  UserCheck,
  Wifi,
  WifiOff,
  Sparkles,
  Home,
  LifeBuoy,
} from 'lucide-react';
import { UserRole, AppView } from '../types';

interface NavbarProps {
  currentView: AppView | string;
  onNavigate: (view: AppView) => void;
  setCurrentView?: (view: any) => void;
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  setUserRole?: (role: UserRole) => void;
  isInternetOnline: boolean;
  onToggleInternet: () => void;
  setIsInternetOnline?: (online: boolean) => void;
  isDisasterActive: boolean;
  onToggleDisaster: () => void;
  onStartSIHDemo: () => void;
  onStartDemo?: () => void;
  isDemoActive?: boolean;
  activeSosCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  setCurrentView,
  userRole,
  onSelectRole,
  setUserRole,
  isInternetOnline,
  onToggleInternet,
  setIsInternetOnline,
  isDisasterActive,
  onToggleDisaster,
  onStartSIHDemo,
  onStartDemo,
  isDemoActive = false,
  activeSosCount = 2,
}) => {
  // Safe helper to navigate views across different prop naming styles and view string formats
  const handleNavigate = (view: AppView) => {
    if (onNavigate) {
      onNavigate(view);
    } else if (setCurrentView) {
      setCurrentView(view);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    if (onSelectRole) {
      onSelectRole(role);
    } else if (setUserRole) {
      setUserRole(role);
    }
  };

  const handleToggleInternet = () => {
    if (onToggleInternet) {
      onToggleInternet();
    } else if (setIsInternetOnline) {
      setIsInternetOnline(!isInternetOnline);
    }
  };

  const handleStartDemo = () => {
    if (onStartSIHDemo) {
      onStartSIHDemo();
    } else if (onStartDemo) {
      onStartDemo();
    } else {
      handleNavigate('SIMULATION');
    }
  };

  const handleTriggerSOS = () => {
    handleNavigate('SOS');
  };

  const handleTriggerReport = () => {
    handleNavigate('REPORT_ISSUE');
  };

  const isViewActive = (targetView: AppView, legacyName?: string) => {
    return currentView === targetView || (legacyName && currentView === legacyName);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      {/* Top emergency flash strip when disaster mode is active */}
      {isDisasterActive && (
        <div className="bg-red-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              DISASTER RESPONSE ACTIVE: Category-3 Flood Protocol Initiated — Emergency Tactical GIS Online
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="bg-red-900/90 px-2 py-0.5 rounded text-[11px] font-mono">
              {activeSosCount} Active SOS Alerts
            </span>
            <button
              type="button"
              onClick={() => handleNavigate('CONTROL_CENTRE')}
              className="underline text-[11px] hover:text-red-100 font-bold cursor-pointer"
            >
              Incident Command &rarr;
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand logo & tagline */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none flex-shrink-0"
            onClick={() => handleNavigate('LANDING')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  CIVIC<span className="text-red-500">VISION</span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  AI + Mesh
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal hidden lg:block">
                Infrastructure &amp; Disaster Response Intelligence
              </p>
            </div>
          </div>

          {/* Action Buttons & Toggles */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap justify-end">
            {/* SIH DEMO MODE Button */}
            <button
              type="button"
              id="sih-demo-btn"
              onClick={handleStartDemo}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer ${
                isDemoActive
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-orange-500/20 hover:scale-105 active:scale-95'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
              <span>{isDemoActive ? 'SIH DEMO ACTIVE' : 'SIH DEMO MODE'}</span>
            </button>

            {/* Quick Report Issue Button */}
            <button
              type="button"
              id="nav-report-issue-btn"
              onClick={handleTriggerReport}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer ${
                isViewActive('REPORT_ISSUE')
                  ? 'bg-blue-500 text-white ring-1 ring-blue-300'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>

            {/* Emergency SOS Button */}
            <button
              type="button"
              id="main-sos-btn"
              onClick={handleTriggerSOS}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-red-600/30 transition cursor-pointer ${
                isViewActive('SOS')
                  ? 'bg-red-500 text-white ring-2 ring-red-300'
                  : 'bg-red-600 hover:bg-red-500 text-white animate-pulse hover:scale-105'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS EMERGENCY</span>
            </button>

            {/* Internet Connectivity Simulator Switch */}
            <button
              type="button"
              id="connectivity-toggle-btn"
              onClick={handleToggleInternet}
              title={
                isInternetOnline
                  ? 'Internet 5G Online (Click to simulate blackout outage)'
                  : 'Internet Blackout (Simulated Mesh Active)'
              }
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-mono border transition cursor-pointer ${
                isInternetOnline
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60'
                  : 'bg-amber-950/80 text-amber-300 border-amber-600 animate-pulse'
              }`}
            >
              {isInternetOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              )}
              <span className="hidden sm:inline">
                {isInternetOnline ? '5G: Online' : 'Blackout'}
              </span>
            </button>

            {/* Role Selector */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => handleRoleChange('CITIZEN')}
                className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  userRole === 'CITIZEN'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('OFFICIAL')}
                className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  userRole === 'OFFICIAL' || userRole === 'MUNICIPAL_OFFICER'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Official
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('CONTROL_CENTRE')}
                className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  userRole === 'CONTROL_CENTRE' || userRole === 'DISASTER_COMMANDER'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Command
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => handleNavigate('LANDING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
              isViewActive('LANDING', 'landing')
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('MAP')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
              isViewActive('MAP', 'disaster_map')
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Unified GIS Map</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('REPORT_ISSUE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
              isViewActive('REPORT_ISSUE', 'report_issue')
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report Issue</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('MY_REPORTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
              isViewActive('MY_REPORTS', 'my_reports')
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>My Reports</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('MUNICIPAL_DASHBOARD')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
              isViewActive('MUNICIPAL_DASHBOARD', 'dashboard')
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Municipal Desk</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('SOS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
              isViewActive('SOS', 'emergency_sos')
                ? 'bg-red-600/20 text-red-400 border border-red-500/30 font-bold'
                : 'text-red-300 hover:text-white hover:bg-red-950/40'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Emergency SOS</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('MESH_NETWORK')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
              isViewActive('MESH_NETWORK', 'emergency_network')
                ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Offline Mesh DTN</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('MISSING_PERSONS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
              isViewActive('MISSING_PERSONS', 'missing_persons')
                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Missing Persons</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('CONTROL_CENTRE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
              isViewActive('CONTROL_CENTRE', 'control_centre')
                ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Control Centre</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavigate('SIMULATION')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition cursor-pointer ${
              isViewActive('SIMULATION', 'disaster_simulation')
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Scenario Lab &amp; SIH Demo</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
