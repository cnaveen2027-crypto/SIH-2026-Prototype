import React, { useState } from 'react';
import { InfrastructureReport, ReportStatus } from '../types';
import {
  UserCheck,
  MapPin,
  Clock,
  ThumbsUp,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Shield,
  Layers,
  Search,
} from 'lucide-react';

interface MyReportsViewProps {
  reports: InfrastructureReport[];
  onUpvoteReport: (reportId: string) => void;
  onSelectReportOnMap: (report: InfrastructureReport) => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  reports,
  onUpvoteReport,
  onSelectReportOnMap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = reports.filter((r) => {
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    if (searchTerm) {
      const matchTitle = r.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchAddress = r.location.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTicket = r.ticketId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = r.category.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchTitle && !matchAddress && !matchTicket && !matchCategory) return false;
    }
    return true;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'REPORTED':
        return <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Reported</span>;
      case 'AI_ANALYZED':
        return <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[10px]">AI Analyzed</span>;
      case 'ASSIGNED':
        return <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-[10px]">Crew Assigned</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[10px] animate-pulse">In Progress</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-[10px]">Resolved</span>;
      case 'VERIFIED':
        return <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-200 font-mono text-[10px]">Verified Closed</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-blue-400" />
            <span>My Submitted Civic Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status tracking, AI engineering diagnostics, and municipal crew dispatch timeline.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ticket, road, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white pl-8 focus:border-blue-500 outline-none w-56 sm:w-64"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter my reports by status"
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="REPORTED">Reported</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
            <UserCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm">No reports found matching your criteria.</p>
          </div>
        ) : (
          filtered.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                {/* Left: Image thumbnail */}
                <div className="md:col-span-3">
                  <div className="relative rounded-lg overflow-hidden h-36 bg-slate-950 border border-slate-800">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 text-cyan-300 font-mono text-[10px] border border-cyan-700/50">
                        {report.ticketId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle: Details & AI Diagnostics (6 cols) */}
                <div className="md:col-span-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-400">{report.category}</span>
                    {getStatusBadge(report.status)}
                  </div>

                  <h3 className="text-sm font-bold text-white">{report.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{report.description}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>{report.location.address}</span>
                    </span>
                  </div>

                  {/* AI Metrics badge strip */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 text-[10px] font-mono">
                      Priority: {report.priorityScore}/100 ({report.priority})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-blue-300 border border-slate-800 text-[10px]">
                      Dept: {report.assignedDepartment}
                    </span>
                    {report.duplicateReportsCount && report.duplicateReportsCount > 1 && (
                      <span className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800 text-[10px] flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{report.duplicateReportsCount} citizen reports merged</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Timeline & Actions (3 cols) */}
                <div className="md:col-span-3 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                  {/* Status Timeline */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Dispatch Progress
                    </div>
                    <div className="space-y-1.5 text-[10px] text-slate-400">
                      {report.timeline.slice(-2).map((t, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-300">{t.status}:</strong> {t.note}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3">
                    <button
                      onClick={() => onUpvoteReport(report.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        report.upvotedByUser
                          ? 'bg-blue-600/30 text-blue-300 border-blue-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{report.upvotes} Upvotes</span>
                    </button>

                    <button
                      onClick={() => onSelectReportOnMap(report)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs flex items-center gap-1 transition"
                      title="View on Map"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
