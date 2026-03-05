import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const ReferralPanel: React.FC<{ sessionToken?: string; currentUser?: any }> = ({ sessionToken, currentUser }) => {
  const history = useQuery(api.api.getReferralHistory, { sessionToken });

  const referralCode = currentUser?.referral_code || currentUser?.username || '';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://holdmybeer.app';
  const link = `${origin}/referral/${referralCode}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      alert('Referral link copied to clipboard');
    } catch (e) {
      alert('Copy failed — please copy manually');
    }
  };

  const share = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: 'Join HoldMyBeer', text: 'Join HoldMyBeer using my link', url: link });
      } catch (e) {
        // ignore
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 border border-black/5 shadow-sm">
      <h3 className="text-lg font-bold">Refer Friends</h3>
      <p className="text-sm text-gray-500 mt-2">Share your link and earn early access badges.</p>

      <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 w-full bg-gray-100 px-3 py-2 rounded text-sm break-all">{link}</div>
        <div className="flex gap-2">
          <button onClick={copyLink} className="px-3 py-2 bg-amber-400 rounded text-sm font-bold">Copy</button>
          <button onClick={share} className="px-3 py-2 bg-white border rounded text-sm font-bold">Share</button>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-sm">Referral History</h4>
        <div className="mt-2 text-sm text-gray-600">
          {!history && <div>Loading...</div>}
          {history && (history as any).length === 0 && <div className="text-gray-400">No referrals yet.</div>}
          {history && (history as any).length > 0 && (
            <ul className="mt-2 space-y-2">
              {(history as any).map((r: any) => (
                <li key={r.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{r.referredUsername || r.referredEmail || '—'}</div>
                    <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="text-sm text-gray-500">Joined</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralPanel;
