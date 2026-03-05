import React, { useState } from 'react';
import ReportIssueModal from './ReportIssueModal';

const ReportIssueButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white px-4 py-3 rounded-full shadow-lg"
      >
        Report Issue
      </button>
      {open && <ReportIssueModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default ReportIssueButton;
