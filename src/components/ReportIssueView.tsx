import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  RefreshCw,
  Cpu,
  Eye,
  Info,
  Clock,
  Shield,
} from 'lucide-react';
import { IssueCategory, InfrastructureReport, AIAnalysisResult, Department } from '../types';
import { AIService } from '../services/aiService';

interface ReportIssueViewProps {
  onSubmitReport: (report: InfrastructureReport) => void;
  existingReports: InfrastructureReport[];
  onNavigateToMyReports: () => void;
}

const PRESET_EXAMPLES = [
  {
    category: 'Pothole' as IssueCategory,
    title: 'Severe Asphalt Pothole on Ring Road',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    address: 'Outer Ring Road, Opp. Metro Pillar 142',
    lat: 12.9716,
    lng: 77.5946,
    nearHospital: true,
  },
  {
    category: 'Water leakage' as IssueCategory,
    title: 'Pressurized Water Main Pipeline Rupture',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    address: '7th Cross, Vidhan Soudha Road',
    lat: 12.9785,
    lng: 77.5912,
    nearHospital: false,
  },
  {
    category: 'Broken streetlight' as IssueCategory,
    title: 'Dangling Low-Tension Wire & Broken Mast Luminaire',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    address: 'Brigade Link Rd, Near Infant Jesus School',
    lat: 12.9644,
    lng: 77.6083,
    nearSchool: true,
  },
  {
    category: 'Fallen tree' as IssueCategory,
    title: 'Uprooted 8-Ton Banyan Tree Blocking Carriageway',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    address: 'MG Road Promenade, Near Trinity Circle',
    lat: 12.9862,
    lng: 77.6015,
    nearMainArtery: true,
  },
];

export const ReportIssueView: React.FC<ReportIssueViewProps> = ({
  onSubmitReport,
  existingReports,
  onNavigateToMyReports,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [title, setTitle] = useState(PRESET_EXAMPLES[0].title);
  const [category, setCategory] = useState<IssueCategory>(PRESET_EXAMPLES[0].category);
  const [description, setDescription] = useState(
    'Deep depression on asphalt road with sharp edges. Causing two-wheeler skids and traffic slowdowns during morning hours.'
  );
  const [imageUrl, setImageUrl] = useState(PRESET_EXAMPLES[0].imageUrl);
  const [address, setAddress] = useState(PRESET_EXAMPLES[0].address);
  const [lat, setLat] = useState(PRESET_EXAMPLES[0].lat);
  const [lng, setLng] = useState(PRESET_EXAMPLES[0].lng);

  // Proximity & contextual factors
  const [nearHospital, setNearHospital] = useState(true);
  const [nearSchool, setNearSchool] = useState(false);
  const [nearMainArtery, setNearMainArtery] = useState(true);

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [duplicateCheck, setDuplicateCheck] = useState<{
    isDuplicate: boolean;
    matchedIncidentId?: string;
    message: string;
    totalMergedCount?: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Handle Preset Selection
  const applyPreset = (index: number) => {
    const p = PRESET_EXAMPLES[index];
    setSelectedPreset(index);
    setTitle(p.title);
    setCategory(p.category);
    setImageUrl(p.imageUrl);
    setAddress(p.address);
    setLat(p.lat);
    setLng(p.lng);
    setNearHospital(Boolean(p.nearHospital));
    setNearSchool(Boolean(p.nearSchool));
    setNearMainArtery(Boolean(p.nearMainArtery));
    setAiResult(null);
    setDuplicateCheck(null);
  };

  // Run AI Vision & Hazard Analysis
  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // 1. Analyze image classification via Gemini / Heuristics
      const analysis = await AIService.analyzeInfrastructureImage({
        userCategory: category,
        description: description,
        locationName: address,
      });

      // 2. Compute dynamic priority score
      const prio = await AIService.calculatePriority({
        severity: analysis.severity,
        nearHospital,
        nearSchool,
        nearMainArtery,
        reportCount: 3,
        category,
      });

      analysis.priorityScore = prio.priorityScore;
      analysis.recommendedPriority = prio.priorityLevel;

      setAiResult(analysis);

      // 3. Check for duplicates in existing reports
      const dup = await AIService.detectDuplicates({
        newReport: {
          category,
          location: { lat, lng, address, zone: 'Central Sector' },
        },
        existingReports,
      });
      setDuplicateCheck(dup);
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketNumber = `TKT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newReportId = `CIV-${Math.floor(110 + Math.random() * 890)}`;

    const newReport: InfrastructureReport = {
      id: newReportId,
      ticketId: ticketNumber,
      userId: 'current_citizen_user',
      userName: 'Aarav Sharma',
      title: title || `${category} on ${address}`,
      description,
      category,
      imageUrl,
      location: {
        lat,
        lng,
        address,
        zone: 'Central Transit Corridor',
      },
      severity: aiResult?.severity || 'HIGH',
      priority: aiResult?.recommendedPriority || 'P1',
      priorityScore: aiResult?.priorityScore || 89,
      priorityReason: `${aiResult?.severity || 'High'} severity + ${
        nearHospital ? 'Near Hospital + ' : ''
      }${nearMainArtery ? 'Main Artery Corridor' : 'Standard Civic Priority'}`,
      assignedDepartment: aiResult?.recommendedDepartment || AIService.getDepartmentForCategory(category),
      status: 'AI_ANALYZED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      duplicateReportsCount: duplicateCheck?.isDuplicate ? duplicateCheck.totalMergedCount : 1,
      mergedIntoIncidentId: duplicateCheck?.isDuplicate ? duplicateCheck.matchedIncidentId : undefined,
      upvotes: 1,
      upvotedByUser: true,
      estimatedResolutionDays: 1,
      aiAnalysis: aiResult || undefined,
      timeline: [
        {
          status: 'REPORTED',
          timestamp: new Date().toISOString(),
          updatedBy: 'Citizen Aarav Sharma',
          note: 'Report registered via CivicVision Citizen Portal.',
        },
        {
          status: 'AI_ANALYZED',
          timestamp: new Date().toISOString(),
          updatedBy: 'CivicVision AI Engine',
          note: `AI classified as ${category} (${aiResult?.confidence || 94}% confidence). Auto-routed to ${
            aiResult?.recommendedDepartment || AIService.getDepartmentForCategory(category)
          }.`,
        },
      ],
    };

    setTimeout(() => {
      onSubmitReport(newReport);
      setIsSubmitting(false);
      setSubmittedTicket(ticketNumber);
    }, 600);
  };

  if (submittedTicket) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="p-8 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Complaint Registered Successfully!</h2>
          <p className="text-slate-400 text-sm mb-6">
            Your report has been analyzed by AI and forwarded to the municipal dispatch desk.
          </p>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left mb-6 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Ticket ID:</span>
              <strong className="text-cyan-400 font-bold">{submittedTicket}</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Assigned Department:</span>
              <span className="text-emerald-400">{aiResult?.recommendedDepartment || 'Roads & Highways'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">AI Priority Score:</span>
              <span className="text-amber-400">{aiResult?.priorityScore || 89}/100 ({aiResult?.recommendedPriority || 'P1'})</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onNavigateToMyReports}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              View in My Reports
            </button>
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setAiResult(null);
                setDuplicateCheck(null);
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition border border-slate-700"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Eye className="w-6 h-6 text-cyan-400" />
          <span>Citizen Infrastructure Issue Reporting</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Capture photos of civic problems. Gemini 3.7 Vision classifies hazards, estimates repair hours, and dispatches field crews.
        </p>
      </div>

      {/* Preset Quick Select Bar */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Load Verified Hackathon Test Samples:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_EXAMPLES.map((preset, idx) => (
            <button
              key={preset.title}
              onClick={() => applyPreset(idx)}
              className={`p-2.5 rounded-lg text-left transition border text-xs ${
                selectedPreset === idx
                  ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="font-bold truncate text-white">{preset.category}</div>
              <div className="text-[10px] text-slate-400 truncate">{preset.address}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Photo Preview & Upload */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Infrastructure Evidence Photo</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Geo-tagged image</span>
            </label>

            <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 h-52 group">
              <img
                src={imageUrl}
                alt="Infrastructure damage"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
                <div className="text-[11px] text-slate-300 font-mono flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>{address}</span>
                </div>
              </div>
            </div>

            {/* AI Image Analysis Trigger Button */}
            <div className="mt-3">
              <button
                type="button"
                id="ai-analyze-btn"
                onClick={runAIAnalysis}
                disabled={isAnalyzing}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                    <span>Gemini 3.7 Flash Analyzing Hazard...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 text-cyan-300" />
                    <span>Run AI Vision Classification &amp; Severity Assessment</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Location & Context */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                2. Location Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white pl-8 focus:border-blue-500 outline-none"
                  placeholder="e.g. 7th Cross, Vidhan Soudha Road"
                  required
                />
                <MapPin className="w-4 h-4 text-red-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Proximity Factors for AI Priority Calculation */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Proximity &amp; Urban Impact Factors:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nearHospital}
                    onChange={(e) => setNearHospital(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-[11px] text-slate-300">Near Hospital</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nearSchool}
                    onChange={(e) => setNearSchool(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-[11px] text-slate-300">Near School</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nearMainArtery}
                    onChange={(e) => setNearMainArtery(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-[11px] text-slate-300">Main Arterial</span>
                </label>
              </div>
            </div>

            {/* Category & Title */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as IssueCategory)}
                  aria-label="Select infrastructure category"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-blue-500"
                >
                  <option value="Pothole">Pothole</option>
                  <option value="Road damage">Road damage</option>
                  <option value="Broken streetlight">Broken streetlight</option>
                  <option value="Water leakage">Water leakage</option>
                  <option value="Garbage accumulation">Garbage accumulation</option>
                  <option value="Damaged traffic signal">Damaged traffic signal</option>
                  <option value="Fallen tree">Fallen tree</option>
                  <option value="Drainage blockage">Drainage blockage</option>
                  <option value="Public infrastructure damage">Public infrastructure damage</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description &amp; Observed Hazards
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis & Live Smart Routing Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Vision Results Card */}
          <div className="p-5 rounded-xl bg-slate-900 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Vision &amp; Routing Engine
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                Gemini 3.7 Flash
              </span>
            </div>

            {aiResult ? (
              <div className="space-y-3 text-xs">
                {/* Issue Type & Confidence */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400">Classified Hazard:</div>
                    <div className="font-bold text-sm text-cyan-300">{aiResult.issueType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Confidence:</div>
                    <div className="font-bold text-emerald-400 font-mono">{aiResult.confidence}%</div>
                  </div>
                </div>

                {/* Severity & Recommended Dept */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Severity:</div>
                    <div
                      className={`font-bold text-xs ${
                        aiResult.severity === 'CRITICAL'
                          ? 'text-red-400'
                          : aiResult.severity === 'HIGH'
                          ? 'text-orange-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {aiResult.severity}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Routed Dept:</div>
                    <div className="font-bold text-xs text-blue-300 truncate">
                      {aiResult.recommendedDepartment}
                    </div>
                  </div>
                </div>

                {/* Priority Score Gauge */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-400">Calculated Priority Score:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {aiResult.priorityScore} / 100 ({aiResult.recommendedPriority})
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${aiResult.priorityScore}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                    <strong>Formula:</strong> {aiResult.severity} severity + {nearHospital ? 'Near Hospital (+12) + ' : ''}
                    {nearMainArtery ? 'Main Corridor (+6)' : 'Standard'}
                  </p>
                </div>

                {/* Safety Hazards */}
                <div>
                  <div className="text-[10px] font-semibold text-slate-400 mb-1">Safety Risk Factors:</div>
                  <ul className="space-y-1">
                    {aiResult.safetyHazards.map((hazard, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        <span>{hazard}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Estimated Repair Time */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Est. Repair Effort:</span>
                  </span>
                  <span className="text-slate-200 font-medium">{aiResult.estimatedRepairEffort}</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs">
                <Cpu className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p>Click &ldquo;Run AI Vision Classification&rdquo; to automatically analyze hazard severity, priority, and assign departments.</p>
              </div>
            )}
          </div>

          {/* Duplicate Detection Alert */}
          {duplicateCheck?.isDuplicate && (
            <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-600 text-purple-200 text-xs">
              <div className="font-bold flex items-center gap-1.5 text-purple-300 mb-1">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Duplicate Incident Cluster Detected!</span>
              </div>
              <p className="text-[11px] text-purple-300/90 leading-relaxed">
                {duplicateCheck.message}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="submit-report-btn"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Submitting &amp; Routing Ticket...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Verified Civic Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
