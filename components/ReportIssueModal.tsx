import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useNotification } from './NotificationProvider';

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
  const { success, error } = useNotification();

  const generateUploadUrl = useMutation(api.api.generateUploadUrl);
  const createReport = useMutation(api.api.createReport);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    
    try {
      const postUrl = await generateUploadUrl();
      const res = await fetch(postUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      
      if (!res.ok) {
        error('Failed to upload screenshot');
        return;
      }
      
      const json = await res.json();
      if (json.storageId) {
        setScreenshotStorageId(json.storageId);
        setPreviewUrl(URL.createObjectURL(file));
        success('Screenshot uploaded successfully', { duration: 2000 });
      }
    } catch (err) {
      console.error('Upload failed', err);
      error('Failed to upload screenshot');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e && e.preventDefault();
    
    if (!title.trim()) {
      error('Please enter a report title');
      return;
    }
    
    if (!description.trim()) {
      error('Please enter a report description');
      return;
    }
    
    setSubmitting(true);
    try {
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('hmb_session_id') || undefined : undefined;
      await createReport({ title, description, category, severity: severity as "Low" | "Medium" | "High" | "Critical", pageUrl, screenshotStorageId, sessionToken });
      success('Thank you — report submitted successfully');
      onClose();
    } catch (err) {
      console.error('Create report failed', err);
      const payload = { title, description, category, severity, pageUrl: typeof window !== 'undefined' ? window.location.href : '', screenshotStorageId };
      const errObj: any = err || {};
      // Prefer server-provided message, but fall back to a generic one
      let friendly = (errObj && (errObj.message || errObj.error || errObj.toString())) || 'Failed to submit report — server error';
      // Keep message short for the toast
      if (typeof friendly === 'string' && friendly.length > 200) friendly = friendly.slice(0, 200) + '...';

      // Offer to copy full details for debugging
      try {
        error(friendly, {
          description: 'Tap "Copy details" to copy diagnostic info for the dev team.',
          action: {
            label: 'Copy details',
            onClick: async () => {
              try {
                await navigator.clipboard.writeText(JSON.stringify({ error: errObj, payload }, null, 2));
                success('Copied error details to clipboard');
              } catch (e) {
                console.error('Failed to copy details', e);
                error('Failed to copy details');
              }
            },
          },
        });
      } catch (e) {
        // If notifications fail, at least log to console
        console.error('Error showing notification', e);
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
            <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-3 border rounded-lg" placeholder="Brief title of the issue" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={5} className="w-full p-3 border rounded-lg" placeholder="Detailed description of what went wrong" />
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
            <input type="file" accept="image/*" onChange={handleFile} className="w-full" />
            {previewUrl && <img src={previewUrl} alt="preview" className="mt-2 max-h-40 rounded-md" />}
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-6 py-3 border rounded-lg font-bold text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-3 bg-black text-white rounded-lg font-bold text-sm disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssueModal;
