import React, { useState } from 'react';
import { InfrastructureReport, Department, ReportStatus } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Layers,
  ArrowUpRight,
  Filter,
  Search,
  MapPin,
  Eye,
} from 'lucide-react';

interface MunicipalDashboardViewProps {
  reports: InfrastructureReport[];
  onUpdateReportStatus: (reportId: string, status: ReportStatus) => void;
  onSelectReportOnMap: (report: InfrastructureReport) => void;
}

export const MunicipalDashboardView: React.FC<MunicipalDashboardViewProps> = ({
  reports,
  onUpdateReportStatus,
  onSelectReportOnMap,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Department Aggregation for Charts
  const departmentCounts: Record<string, number> = {};
  reports.forEach((r) => {
    departmentCounts[r.assignedDepartment] = (departmentCounts[r.assignedDepartment] || 0) + 1;
  });

  const departmentData = Object.keys(departmentCounts).map((dept) => ({
    name: dept.split(' ')[0], // Short name
    fullName: dept,
    count: departmentCounts[dept],
  }));

  // Severity Distribution for Pie Chart
  const severityCounts = {
    CRITICAL: reports.filter((r) => r.severity === 'CRITICAL').length,
    HIGH: reports.filter((r) => r.severity === 'HIGH').length,
    MEDIUM: reports.filter((r) => r.severity === 'MEDIUM').length,
    LOW: reports.filter((r) => r.severity === 'LOW').length,
  };

  const severityPieData = [
    { name: 'Critical (P1)', value: severityCounts.CRITICAL, color: '#ef4444' },
    { name: 'High (P2)', value: severityCounts.HIGH, color: '#f97316' },
    { name: 'Medium (P3)', value: severityCounts.MEDIUM, color: '#eab308' },
    { name: 'Low (P4)', value: severityCounts.LOW, color: '#10b981' },
  ];

  // Resolution Time Trend
  const resolutionTrendData = [
    { day: 'Mon', reported: 12, resolved: 10 },
    { day: 'Tue', reported: 19, resolved: 16 },
    { day: 'Wed', reported: 15, resolved: 14 },
    { day: 'Thu', reported: 22, resolved: 20 },
    { day: 'Fri', reported: 28, resolved: 25 },
    { day: 'Sat', reported: 18, resolved: 17 },
    { day: 'Sun', reported: 14, resolved: 15 },
  ];

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (selectedDept !== 'ALL' && r.assignedDepartment !== selectedDept) return false;
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    if (searchTerm) {
      const match =
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-mono mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Municipal Engineering &amp; Smart Governance Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Urban Infrastructure Operations &amp; AI Triage
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated Gemini classification, dynamic priority scoring, and cross-departmental SLA tracking.
          </p>
        </div>

        {/* Top Summary Metrics */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <div className="text-slate-500 text-[10px]">SLA On-Time</div>
            <div className="font-bold text-emerald-400 text-sm">93.8%</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <div className="text-slate-500 text-[10px]">Avg Repair Time</div>
            <div className="font-bold text-cyan-400 text-sm">4.2 hrs</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <div className="text-slate-500 text-[10px]">Duplicate Merges</div>
            <div className="font-bold text-purple-400 text-sm">38% saved</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 1: Department Workload */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Department Load Distribution
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Active Tickets</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Severity Distribution */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Severity Classification
            </span>
            <span className="text-[10px] text-slate-400 font-mono">AI Triage</span>
          </div>
          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>Crit</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>High</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Med</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Low</span>
          </div>
        </div>

        {/* Chart 3: Weekly Resolution Velocity */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Weekly Resolution Velocity
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Reported vs Fixed</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="reported" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Municipal Tickets Dispatch Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        {/* Table Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ticket, road, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white pl-8 focus:border-blue-500 outline-none w-56 sm:w-72"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Roads & Highways Department">Roads &amp; Highways</option>
              <option value="Water Supply & Sewerage Board">Water Supply &amp; Drainage</option>
              <option value="Electricity & Power Corporation">Electricity Board</option>
              <option value="Solid Waste & Sanitation">Sanitation</option>
              <option value="Traffic Management Authority">Traffic Management</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="AI_ANALYZED">AI Analyzed</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {filteredReports.length} Active Complaints
          </div>
        </div>

        {/* Table Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Ticket</th>
                <th className="py-2.5 px-3">Category &amp; Location</th>
                <th className="py-2.5 px-3">AI Priority</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-950/40 transition">
                  {/* Ticket */}
                  <td className="py-3 px-3">
                    <span className="font-mono text-cyan-300 font-bold">{report.ticketId}</span>
                    <div className="text-[10px] text-slate-500 font-mono">{report.id}</div>
                  </td>

                  {/* Category & Location */}
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-bold text-white truncate">{report.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-red-400 flex-shrink-0" />
                      <span>{report.location.address}</span>
                    </div>
                    {report.duplicateReportsCount && report.duplicateReportsCount > 1 && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-purple-400 font-mono">
                        <Layers className="w-2.5 h-2.5" />
                        <span>{report.duplicateReportsCount} merged reports</span>
                      </span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-mono font-bold px-1.5 py-0.2 rounded text-[10px] ${
                          report.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : report.severity === 'HIGH'
                            ? 'bg-orange-950 text-orange-300 border border-orange-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {report.priorityScore}/100 ({report.priority})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{report.priorityReason}</div>
                  </td>

                  {/* Department */}
                  <td className="py-3 px-3">
                    <span className="text-slate-300 font-medium">{report.assignedDepartment}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        report.status === 'RESOLVED' || report.status === 'VERIFIED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : report.status === 'IN_PROGRESS'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          : report.status === 'ASSIGNED'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>

                  {/* Action Controls */}
                  <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => onSelectReportOnMap(report)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[10px] font-mono"
                      title="Inspect on GIS Map"
                    >
                      Map
                    </button>

                    {report.status !== 'RESOLVED' && (
                      <button
                        onClick={() =>
                          onUpdateReportStatus(
                            report.id,
                            report.status === 'REPORTED' || report.status === 'AI_ANALYZED'
                              ? 'ASSIGNED'
                              : report.status === 'ASSIGNED'
                              ? 'IN_PROGRESS'
                              : 'RESOLVED'
                          )
                        }
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold"
                      >
                        {report.status === 'REPORTED' || report.status === 'AI_ANALYZED'
                          ? 'Assign Crew'
                          : report.status === 'ASSIGNED'
                          ? 'Start Work'
                          : 'Mark Fixed'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
