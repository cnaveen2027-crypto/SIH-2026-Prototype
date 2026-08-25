import React, { useState } from 'react';
import { MissingPerson } from '../types';
import {
  LifeBuoy,
  Search,
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Phone,
  Eye,
  Users,
} from 'lucide-react';

interface MissingPersonViewProps {
  missingPersons: MissingPerson[];
  onAddMissingPerson: (person: MissingPerson) => void;
  onUpdateStatus: (id: string, newStatus: MissingPerson['status']) => void;
}

export const MissingPersonView: React.FC<MissingPersonViewProps> = ({
  missingPersons,
  onAddMissingPerson,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  // New person form state
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState('Male');
  const [clothing, setClothing] = useState('Blue denim jacket, black trousers');
  const [lastSeenAddress, setLastSeenAddress] = useState('Sector 4 Riverside Promenade');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('+91 98450 99881');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  );

  const filtered = missingPersons.filter((p) => {
    if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
    if (searchTerm) {
      const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLoc = p.lastKnownLocation.address.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchName && !matchLoc) return false;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `MP-${Math.floor(100 + Math.random() * 900)}`;
    const newPerson: MissingPerson = {
      id: newId,
      name,
      age,
      gender,
      photoUrl,
      lastKnownLocation: {
        lat: 12.954,
        lng: 77.585,
        address: lastSeenAddress,
        zone: 'Sector 4 Riverside Basin',
      },
      lastSeenTime: new Date().toISOString(),
      clothing,
      medicalConditions: medicalConditions || undefined,
      reportedBy: 'Citizen Reporter',
      emergencyContact,
      status: 'MISSING',
      notes: 'Reported during sudden flood overwash.',
    };

    onAddMissingPerson(newPerson);
    setShowAddForm(false);
    // Reset form
    setName('');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono mb-2">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Disaster Family Reunification Registry</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Missing Persons &amp; Assistance Desk</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Log separated family members, cross-reference shelter sightings, and coordinate rescue verification.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Register Missing Person'}</span>
        </button>
      </div>

      {/* Add Missing Person Form Modal/Collapsible */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-4 animate-in fade-in"
        >
          <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <LifeBuoy className="w-4 h-4 text-amber-400" />
            <span>Register New Missing Person File</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                placeholder="e.g. Sumanth Hegde"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Last Known Location / Address</label>
              <input
                type="text"
                value={lastSeenAddress}
                onChange={(e) => setLastSeenAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Clothing / Distinctive Features</label>
              <input
                type="text"
                value={clothing}
                onChange={(e) => setClothing(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                placeholder="e.g. Yellow raincoat, glasses, scar on right arm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Medical Conditions / Critical Care</label>
              <input
                type="text"
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                placeholder="e.g. Needs asthma inhaler, hypertension"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Submit Missing Person Profile
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white pl-8 focus:border-amber-500 outline-none w-56 sm:w-64"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="MISSING">Missing</option>
            <option value="SIGHTED">Sighted in Shelter</option>
            <option value="RESCUED">Rescued by SDRF</option>
            <option value="SAFE">Confirmed Safe</option>
          </select>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          {filtered.length} Registered Individuals
        </div>
      </div>

      {/* Missing Persons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((person) => (
          <div
            key={person.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={person.photoUrl}
                  alt={person.name}
                  className="w-14 h-14 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white truncate">{person.name}</h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        person.status === 'MISSING'
                          ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                          : person.status === 'SIGHTED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {person.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Age {person.age} &bull; {person.gender}
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono mt-0.5 truncate">
                    ID: {person.id}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-300 line-clamp-1">{person.lastKnownLocation.address}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  <strong>Clothing:</strong> {person.clothing}
                </div>
                {person.medicalConditions && (
                  <div className="text-[11px] text-rose-300">
                    <strong>Medical:</strong> {person.medicalConditions}
                  </div>
                )}
                <div className="text-[11px] text-slate-400">
                  <strong>Emergency Contact:</strong> {person.emergencyContact}
                </div>
              </div>
            </div>

            {/* Quick Status Updater */}
            <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500">Update status:</span>
              <div className="flex gap-1.5">
                {person.status !== 'SAFE' && (
                  <button
                    onClick={() => onUpdateStatus(person.id, 'SAFE')}
                    className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-[10px] font-bold"
                  >
                    Mark Safe
                  </button>
                )}
                {person.status === 'MISSING' && (
                  <button
                    onClick={() => onUpdateStatus(person.id, 'SIGHTED')}
                    className="px-2 py-1 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700 text-[10px] font-bold"
                  >
                    Report Sighted
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
