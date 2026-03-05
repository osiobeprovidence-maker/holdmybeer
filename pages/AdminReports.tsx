import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

const severityColor = (s: string) => {
  if (s === 'Critical') return 'bg-red-500';
  if (s === 'High') return 'bg-orange-400';
  if (s === 'Medium') return 'bg-yellow-300';
  return 'bg-gray-300';
};

const AdminReports: React.FC = () => {
  const reports = useQuery(api.api.getReports) ?? [];
  const updateStatus = useMutation(api.api.updateReportStatus);
  const deleteReport = useMutation(api.api.deleteReport);
  const [selected, setSelected] = useState<any | null>(null);

  const onChangeStatus = async (id: string, status: string) => {
    await updateStatus({ id, status });
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    await deleteReport({ id });
  };

  return (
    <div className="py-8 w-full max-w-5xl mx-auto px-4">
      <h1 className="text-4xl font-black mb-6">Reports</h1>
      <div className="grid grid-cols-1 gap-4">
        {reports.map((r: any) => (
          <div key={r._id} className="p-4 bg-white border rounded-lg flex items-start gap-4">
            <div className={`w-3 h-12 rounded ${severityColor(r.severity)}`} />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-[#666]">#{r._id} · {r.category}</div>
                  <h3 className="font-black text-lg">{r.title}</h3>
                  <div className="text-sm text-[#777] mt-1">Reported by: {r.userId || 'Anonymous'} · {new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <select value={r.status} onChange={(e) => onChangeStatus(r._id, e.target.value)} className="p-2 border rounded">
                    <option value="open">open</option>
                    <option value="investigating">investigating</option>
                    <option value="resolved">resolved</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => setSelected(r)} className="px-3 py-1 border rounded">View</button>
                    <button onClick={() => onDelete(r._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-[#444]">{r.description?.slice(0, 200)}{r.description && r.description.length > 200 ? '…' : ''}</p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white max-w-3xl w-full rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="text-sm text-[#666]">Close</button>
            </div>
            <p className="text-sm text-[#777] mb-4">By: {selected.userId || 'Anonymous'} · {new Date(selected.createdAt).toLocaleString()}</p>
            <p className="mb-4">{selected.description}</p>
            {selected.screenshotUrl && <img src={selected.screenshotUrl} alt="screenshot" className="max-h-96 rounded" />}
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
