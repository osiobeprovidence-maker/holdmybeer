import React, { useState } from 'react';
import ReportIssueModal from './ReportIssueModal';

const ReportIssueButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Report an issue"
        className="fixed bottom-6 right-28 md:right-36 z-50 bg-black text-white px-4 py-3 rounded-full shadow-lg animate-bounce"
        style={{ animationDuration: '1.6s' }}
      >
        Report Issue
      </button>
      {open && <ReportIssueModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default ReportIssueButton;
