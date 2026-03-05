import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

const categories = ['Bug', 'UI problem', 'Payment issue', 'Feature request', 'Other'];
const severities = ['Low', 'Medium', 'High', 'Critical'];

const ReportIssueModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [severity, setSeverity] = useState(severities[1]);
  const [screenshotStorageId, setScreenshotStorageId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const generateUploadUrl = useMutation(api.api.generateUploadUrl);
  const createReport = useMutation(api.api.createReport);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const postUrl = await generateUploadUrl();
      const res = await fetch(postUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      const json = await res.json();
      if (json.storageId) {
        setScreenshotStorageId(json.storageId);
        setPreviewUrl(URL.createObjectURL(file));
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload screenshot');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e && e.preventDefault();
    setSubmitting(true);
    try {
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('hmb_session_id') || undefined : undefined;
      await createReport({ title, description, category, severity, pageUrl, screenshotStorageId, sessionToken });
      alert('Thanks — report submitted');
      onClose();
    } catch (err) {
      console.error('Create report failed', err);
      try {
        // if Convex error object has message
        const msg = (err as any)?.message || JSON.stringify(err);
        alert(`Failed to submit report: ${msg}`);
      } catch (e) {
        alert('Failed to submit report');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black">Report an Issue</h3>
          <button onClick={onClose} className="text-sm text-[#666]">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={5} className="w-full p-3 border rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 border rounded-lg">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-1">Severity</label>
              <select value={severity} onChange={e => setSeverity(e.target.value)} className="w-full p-3 border rounded-lg">
                {severities.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Screenshot (optional)</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {previewUrl && <img src={previewUrl} alt="preview" className="mt-2 max-h-40 rounded-md" />}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-black text-white">{submitting ? 'Submitting...' : 'Submit'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueModal;
