export type UserRole = 'CITIZEN' | 'OFFICIAL' | 'CONTROL_CENTRE' | 'MUNICIPAL_OFFICER' | 'DISASTER_COMMANDER' | 'RESCUE_RESPONDER';

export type AppView =
  | 'LANDING'
  | 'MAP'
  | 'REPORT_ISSUE'
  | 'MY_REPORTS'
  | 'SOS'
  | 'MESH_NETWORK'
  | 'MISSING_PERSONS'
  | 'CONTROL_CENTRE'
  | 'MUNICIPAL_DASHBOARD'
  | 'SIMULATION';

export type Department =
  | 'Roads & Highways'
  | 'Electrical & Power'
  | 'Water Supply & Sewage'
  | 'Sanitation & Waste Management'
  | 'Traffic & Transit Management'
  | 'Municipal Emergency Services'
  | 'Flood & Stormwater Dept'
  | 'Civil Engineering & Structural';

export type IssueCategory =
  | 'Pothole'
  | 'Road damage'
  | 'Broken streetlight'
  | 'Water leakage'
  | 'Garbage accumulation'
  | 'Damaged traffic signal'
  | 'Fallen tree'
  | 'Drainage blockage'
  | 'Public infrastructure damage'
  | 'Other';

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4';

export type ReportStatus =
  | 'REPORTED'
  | 'AI_ANALYZED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'VERIFIED';

export type EmergencyType =
  | 'Need rescue'
  | 'Medical assistance'
  | 'Trapped'
  | 'Missing person'
  | 'Safe';

export type MessageRelayStatus =
  | 'CREATED'
  | 'OFFLINE'
  | 'RELAYING'
  | 'GATEWAY_FOUND'
  | 'SENT'
  | 'RECEIVED';

export type DisasterType = 'NONE' | 'FLOOD' | 'CYCLONE' | 'EARTHQUAKE' | 'LANDSLIDE';

export type NodeType =
  | 'citizen_phone'
  | 'responder_radio'
  | 'drone_node'
  | 'wifi_hotspot'
  | 'gateway_tower';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  zone: string;
}

export interface AIAnalysisResult {
  issueType: IssueCategory;
  confidence: number; // 0 - 100
  severity: SeverityLevel;
  description: string;
  recommendedDepartment: Department;
  recommendedPriority: PriorityLevel;
  priorityScore: number; // 0 - 100
  safetyHazards: string[];
  estimatedRepairEffort: string;
  duplicateDetected?: boolean;
  matchedIncidentId?: string;
}

export interface StatusTimelineEntry {
  status: ReportStatus;
  timestamp: string;
  updatedBy: string;
  note: string;
}

export interface InfrastructureReport {
  id: string; // e.g. "CIV-101"
  ticketId: string; // e.g. "TKT-2026-889"
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: IssueCategory;
  imageUrl: string;
  location: LocationCoordinates;
  severity: SeverityLevel;
  priority: PriorityLevel;
  priorityScore: number; // 0-100
  priorityReason: string;
  assignedDepartment: Department;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  aiAnalysis?: AIAnalysisResult;
  mergedIntoIncidentId?: string;
  duplicateReportsCount?: number;
  upvotes: number;
  upvotedByUser?: boolean;
  timeline: StatusTimelineEntry[];
  officialNotes?: string;
  estimatedResolutionDays?: number;
}

export interface IncidentGroup {
  id: string; // e.g. "INC-204"
  title: string;
  category: IssueCategory;
  location: LocationCoordinates;
  primaryReportId: string;
  mergedReportIds: string[];
  reportCount: number;
  combinedPriorityScore: number;
  severity: SeverityLevel;
  assignedDepartment: Department;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyAlert {
  id: string; // e.g. "SOS-901"
  userId: string;
  userName: string;
  phone?: string;
  emergencyType: EmergencyType;
  priority: SeverityLevel;
  location: LocationCoordinates;
  peopleCount: number;
  details: string;
  medicalConditions?: string;
  batteryLevel: number;
  status: MessageRelayStatus;
  hopCount: number;
  relayedViaGateway?: string;
  createdAt: string;
  assignedRescueTeamId?: string;
  rescueStatus: 'PENDING' | 'DISPATCHED' | 'RESCUED';
  offlineGenerated: boolean;
}

export interface MeshNode {
  id: string;
  name: string;
  type: NodeType;
  lat: number;
  lng: number;
  battery: number;
  rangeMeters: number;
  isOnline: boolean;
  isGateway: boolean;
  connectedPeerIds: string[];
  storedMessageCount: number;
  hopsToGateway: number;
}

export interface MeshMessage {
  id?: string;
  messageId: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  location: LocationCoordinates;
  emergencyType: EmergencyType;
  priority: SeverityLevel;
  payload?: string;
  payloadSummary?: string;
  hopCount: number;
  maxHops: number;
  ttlSeconds?: number;
  path?: string[];
  pathNodeIds?: string[];
  status: MessageRelayStatus;
  currentCarrierNodeId?: string;
  deliveredAtGatewayId?: string;
}

export interface SightingReport {
  id: string;
  timestamp: string;
  reporterName: string;
  location: LocationCoordinates;
  description: string;
  verifiedByOfficial: boolean;
}

export interface MissingPerson {
  id: string; // e.g. "MP-402"
  name: string;
  age: number;
  gender: string;
  lastKnownLocation: LocationCoordinates;
  timeLastSeen?: string;
  lastSeenTime?: string;
  description?: string;
  clothing: string;
  photoUrl?: string;
  priority?: SeverityLevel;
  emergencyContact: string;
  status: 'MISSING' | 'SIGHTED' | 'RESCUED' | 'SAFE';
  reportedSightings?: SightingReport[];
  registeredByRole?: UserRole;
  reportedBy?: string;
  createdAt?: string;
  caseOfficer?: string;
  notes?: string;
  medicalConditions?: string;
}

export interface RescueTeam {
  id: string;
  name: string;
  type: 'Urban Search & Rescue' | 'Flood & Swiftwater' | 'Paramedic Unit' | 'Fire & Hazmat' | 'Drone Recon Squad';
  location: LocationCoordinates;
  personnelCount: number;
  status: 'AVAILABLE' | 'EN_ROUTE' | 'ON_SCENE' | 'STANDBY';
  assignedAlertId?: string;
  equipment: string[];
  contactRadio: string;
}

export interface DisasterZone {
  id: string;
  name: string;
  type: DisasterType;
  severity: SeverityLevel;
  polygon: { lat: number; lng: number }[];
  center: { lat: number; lng: number };
  radiusMeters: number;
  affectedPopulation: number;
  evacuationStatus: 'ADVISORY' | 'MANDATORY' | 'SHELTER_IN_PLACE' | 'ALL_CLEAR';
  waterLevelMeters?: number;
  windSpeedKmh?: number;
}

export interface DisasterState {
  activeDisaster: DisasterType;
  intensity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'CATASTROPHIC';
  startedAt?: string;
  isInternetBlackout: boolean;
  affectedZones: DisasterZone[];
  aiSituationSummary: string;
  keyActionDirectives: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  targetId: string;
  details: string;
}
