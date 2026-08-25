import React, { useState } from 'react';
import {
  AppView,
  UserRole,
  InfrastructureReport,
  EmergencyAlert,
  MissingPerson,
  RescueTeam,
  MeshNode,
  DisasterZone,
  MeshMessage,
  ReportStatus,
} from './types';
import {
  INITIAL_INFRASTRUCTURE_REPORTS,
  INITIAL_EMERGENCY_ALERTS,
  INITIAL_MISSING_PERSONS,
  INITIAL_RESCUE_TEAMS,
  INITIAL_MESH_NODES,
  INITIAL_DISASTER_ZONES,
  INITIAL_MESH_MESSAGES,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { UnifiedDisasterMapView } from './components/UnifiedDisasterMapView';
import { ReportIssueView } from './components/ReportIssueView';
import { MyReportsView } from './components/MyReportsView';
import { EmergencySOSView } from './components/EmergencySOSView';
import { MeshNetworkView } from './components/MeshNetworkView';
import { MissingPersonView } from './components/MissingPersonView';
import { DisasterControlCentreView } from './components/DisasterControlCentreView';
import { MunicipalDashboardView } from './components/MunicipalDashboardView';
import { DisasterSimulationView } from './components/DisasterSimulationView';
import { SIHDemoHUD, SIH_DEMO_STEPS } from './components/SIHDemoHUD';
import confetti from 'canvas-confetti';

export function App() {
  // Navigation & Role State
  const [currentView, setCurrentView] = useState<AppView>('LANDING');
  const [userRole, setUserRole] = useState<UserRole>('CITIZEN');

  // Simulation & Disaster State
  const [isDisasterActive, setIsDisasterActive] = useState<boolean>(false);
  const [isInternetOnline, setIsInternetOnline] = useState<boolean>(true);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(1);

  // Core Data Collections
  const [reports, setReports] = useState<InfrastructureReport[]>(INITIAL_INFRASTRUCTURE_REPORTS);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(INITIAL_EMERGENCY_ALERTS);
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>(INITIAL_MISSING_PERSONS);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>(INITIAL_RESCUE_TEAMS);
  const [meshNodes, setMeshNodes] = useState<MeshNode[]>(INITIAL_MESH_NODES);
  const [disasterZones, setDisasterZones] = useState<DisasterZone[]>(INITIAL_DISASTER_ZONES);
  const [meshMessages, setMeshMessages] = useState<MeshMessage[]>(INITIAL_MESH_MESSAGES);

  // Selected item on map
  const [selectedReport, setSelectedReport] = useState<InfrastructureReport | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);

  // Handlers for Infrastructure Reports
  const handleAddReport = (newReport: InfrastructureReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleUpvoteReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const upvoted = !r.upvotedByUser;
          return {
            ...r,
            upvotes: upvoted ? r.upvotes + 1 : r.upvotes - 1,
            upvotedByUser: upvoted,
          };
        }
        return r;
      })
    );
  };

  const handleUpdateReportStatus = (reportId: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status,
            updatedAt: new Date().toISOString(),
            timeline: [
              ...r.timeline,
              {
                status,
                timestamp: new Date().toISOString(),
                updatedBy: 'Municipal Dispatch Desk',
                note: `Status escalated to ${status}. Crew assigned to site.`,
              },
            ],
          };
        }
        return r;
      })
    );
  };

  // Handlers for Emergency SOS
  const handleTriggerSOS = (newAlert: EmergencyAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);

    // Also inject into simulated mesh message queue if offline
    if (!isInternetOnline) {
      const newMeshMsg: MeshMessage = {
        id: `PKT-${newAlert.id}`,
        messageId: `PKT-${newAlert.id}`,
        senderId: newAlert.userId,
        senderName: newAlert.userName,
        timestamp: new Date().toISOString(),
        location: newAlert.location,
        emergencyType: newAlert.emergencyType,
        priority: newAlert.priority,
        payload: `${newAlert.emergencyType}: ${newAlert.details} (${newAlert.peopleCount} ppl)`,
        hopCount: 0,
        maxHops: 5,
        ttlSeconds: 3600,
        path: [newAlert.userId],
        status: 'OFFLINE',
      };
      setMeshMessages((prev) => [newMeshMsg, ...prev]);
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, rescueStatus: 'RESCUED', status: 'RECEIVED' } : a))
    );
  };

  const handleDispatchTeam = (teamId: string, alertId: string) => {
    setRescueTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, status: 'DEPLOYED', assignedIncidentId: alertId } : t))
    );
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, rescueStatus: 'DISPATCHED' } : a))
    );
  };

  // Handlers for Missing Persons
  const handleAddMissingPerson = (person: MissingPerson) => {
    setMissingPersons((prev) => [person, ...prev]);
  };

  const handleUpdateMissingPersonStatus = (id: string, newStatus: MissingPerson['status']) => {
    setMissingPersons((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  // Handlers for Mesh Network
  const handleRelayMessage = (msgId: string) => {
    setMeshMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId || m.messageId === msgId) {
          const nextHop = m.hopCount + 1;
          const status = nextHop >= 3 ? 'GATEWAY_FOUND' : 'RELAYING';
          return {
            ...m,
            hopCount: nextHop,
            status,
            path: [...m.path, `RelayNode_0${nextHop}`],
          };
        }
        return m;
      })
    );
  };

  const handleSendNewMeshMessage = (msg: MeshMessage) => {
    setMeshMessages((prev) => [msg, ...prev]);
  };

  // Stepper & SIH Demo Walkthrough Controls
  const handleStartSIHDemo = () => {
    setIsDemoActive(true);
    setCurrentDemoStep(1);
    setCurrentView('REPORT_ISSUE');
    setIsDisasterActive(false);
    setIsInternetOnline(true);
    confetti({
      particleCount: 80,
      spread: 60,
    });
  };

  const handleStepDemoNext = () => {
    const nextStep = currentDemoStep < 14 ? currentDemoStep + 1 : 1;
    setCurrentDemoStep(nextStep);

    const stepData = SIH_DEMO_STEPS.find((s) => s.step === nextStep);
    if (stepData) {
      setCurrentView(stepData.targetView);
      setIsDisasterActive(stepData.isDisaster);
      setIsInternetOnline(stepData.isOnline);
    }
  };

  const handleResetSimulation = () => {
    setIsDisasterActive(false);
    setIsInternetOnline(true);
    setIsDemoActive(false);
    setCurrentDemoStep(1);
    setReports(INITIAL_INFRASTRUCTURE_REPORTS);
    setAlerts(INITIAL_EMERGENCY_ALERTS);
    setMissingPersons(INITIAL_MISSING_PERSONS);
    setRescueTeams(INITIAL_RESCUE_TEAMS);
    setMeshMessages(INITIAL_MESH_MESSAGES);
    setCurrentView('LANDING');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Universal Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        setCurrentView={(view) => setCurrentView(view)}
        userRole={userRole}
        onSelectRole={(role) => setUserRole(role)}
        setUserRole={(role) => setUserRole(role)}
        isDisasterActive={isDisasterActive}
        onToggleDisaster={() => setIsDisasterActive(!isDisasterActive)}
        isInternetOnline={isInternetOnline}
        onToggleInternet={() => setIsInternetOnline(!isInternetOnline)}
        onStartSIHDemo={handleStartSIHDemo}
        onStartDemo={handleStartSIHDemo}
        isDemoActive={isDemoActive}
        activeSosCount={alerts.filter((a) => a.rescueStatus !== 'RESCUED').length}
      />

      {/* Interactive SIH Demo Walkthrough HUD Banner */}
      {isDemoActive && (
        <SIHDemoHUD
          currentStep={currentDemoStep}
          onSelectStep={(step) => setCurrentDemoStep(step)}
          onCloseDemo={() => setIsDemoActive(false)}
          onNavigate={(view) => setCurrentView(view)}
          setDisasterMode={(active) => setIsDisasterActive(active)}
          setInternetOnline={(online) => setIsInternetOnline(online)}
        />
      )}

      {/* Main Viewport Container */}
      <main className="flex-1">
        {currentView === 'LANDING' && (
          <LandingPage
            onLaunch={() => setCurrentView('MAP')}
            onStartDemo={handleStartSIHDemo}
          />
        )}

        {currentView === 'MAP' && (
          <div className="max-w-7xl mx-auto py-6 px-4">
            <UnifiedDisasterMapView
              reports={reports}
              alerts={alerts}
              missingPersons={missingPersons}
              rescueTeams={rescueTeams}
              meshNodes={meshNodes}
              disasterZones={disasterZones}
              isDisasterActive={isDisasterActive}
              userRole={userRole}
              onSelectReport={(r) => setSelectedReport(r)}
              onSelectAlert={(a) => setSelectedAlert(a)}
            />
          </div>
        )}

        {currentView === 'REPORT_ISSUE' && (
          <ReportIssueView
            onSubmitReport={handleAddReport}
            existingReports={reports}
            onNavigateToMyReports={() => setCurrentView('MY_REPORTS')}
          />
        )}

        {currentView === 'MY_REPORTS' && (
          <MyReportsView
            reports={reports}
            onUpvoteReport={handleUpvoteReport}
            onSelectReportOnMap={(r) => {
              setSelectedReport(r);
              setCurrentView('MAP');
            }}
          />
        )}

        {currentView === 'SOS' && (
          <EmergencySOSView
            onTriggerSOS={handleTriggerSOS}
            isInternetOnline={isInternetOnline}
            onNavigateToNetwork={() => setCurrentView('MESH_NETWORK')}
          />
        )}

        {currentView === 'MESH_NETWORK' && (
          <MeshNetworkView
            nodes={meshNodes}
            messages={meshMessages}
            onRelayMessage={handleRelayMessage}
            onSendNewMeshMessage={handleSendNewMeshMessage}
          />
        )}

        {currentView === 'MISSING_PERSONS' && (
          <MissingPersonView
            missingPersons={missingPersons}
            onAddMissingPerson={handleAddMissingPerson}
            onUpdateStatus={handleUpdateMissingPersonStatus}
          />
        )}

        {currentView === 'CONTROL_CENTRE' && (
          <DisasterControlCentreView
            alerts={alerts}
            reports={reports}
            missingPersons={missingPersons}
            rescueTeams={rescueTeams}
            meshNodes={meshNodes}
            disasterZones={disasterZones}
            onDispatchTeam={handleDispatchTeam}
            onResolveAlert={handleResolveAlert}
          />
        )}

        {currentView === 'MUNICIPAL_DASHBOARD' && (
          <MunicipalDashboardView
            reports={reports}
            onUpdateReportStatus={handleUpdateReportStatus}
            onSelectReportOnMap={(r) => {
              setSelectedReport(r);
              setCurrentView('MAP');
            }}
          />
        )}

        {currentView === 'SIMULATION' && (
          <DisasterSimulationView
            isDisasterActive={isDisasterActive}
            onToggleDisaster={() => setIsDisasterActive(!isDisasterActive)}
            isInternetOnline={isInternetOnline}
            onToggleInternet={() => setIsInternetOnline(!isInternetOnline)}
            onRunFullSIHDemo={handleStartSIHDemo}
            currentDemoStep={currentDemoStep}
            onStepDemoNext={handleStepDemoNext}
            onResetSimulation={handleResetSimulation}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CivicVision</span>
            <span>&bull;</span>
            <span>AI-Powered Urban Infrastructure &amp; Disaster Response Intelligence</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Smart India Hackathon 2026 Prototype &bull; Gemini 3.7 Flash &bull; Delay-Tolerant Mesh
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
