
import React from 'react';
import { Vendor, ServiceRequest, User } from '../types';

interface MyConnectionsProps {
  vendors: Vendor[];
  unlockedVendorIds: string[];
  serviceRequests: ServiceRequest[];
  currentUser: User | null;
  onVendorSelect: (vendor: Vendor) => void;
  protocolId: string;
}

const MyConnections: React.FC<MyConnectionsProps> = ({ 
  vendors, 
  unlockedVendorIds, 
  serviceRequests, 
  currentUser,
  onVendorSelect,
  protocolId
}) => {
  const connectedVendors = vendors.filter(v => unlockedVendorIds.includes(v.id));

  return (
    <div className="py-12 animate-in fade-in duration-700">
      <div className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <p className="text-[12px] font-bold text-[#86868b] uppercase tracking-[0.4em] mb-4">Historical Access</p>
          <h1 className="text-5xl md:text-8xl font-extrabold mb-6 tracking-tighter text-black uppercase leading-none">History</h1>
          <div className="flex flex-wrap items-center gap-4">
             <p className="text-[#86868b] font-bold uppercase text-[11px] tracking-widest opacity-50">Saved connection instances available on this device.</p>
             <div className="bg-black/5 px-3 py-1.5 rounded-full flex items-center gap-2 border border-black/5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-tighter font-mono">NODE ID: {protocolId}</span>
             </div>
          </div>
        </div>
        {!currentUser && (
          <div className="bg-[#f5f5f7] px-8 py-4 rounded-full border border-black/5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-black">Guest Session Active</p>
            <p className="text-[8px] font-black text-[#86868b] uppercase tracking-widest mt-1">Hardware Persistence Protocol</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10">
        {connectedVendors.map(vendor => {
          const request = serviceRequests.find(r => r.creatorId === vendor.id);

          return (
            <div key={vendor.id} className="apple-card p-6 md:p-12 apple-shadow flex flex-col md:flex-row gap-12 items-center">
              <div className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0">
                 <img src={vendor.avatar} className="w-full h-full rounded-[32px] md:rounded-[40px] object-cover apple-shadow" />
              </div>

              <div className="flex-grow text-center md:text-left">
                <p className="text-[10px] font-bold text-black uppercase tracking-widest mb-2 opacity-30">{vendor.category}</p>
                <h3 className="text-4xl font-extrabold text-black tracking-tight mb-8 uppercase">{vendor.businessName}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                  <div className="bg-[#f5f5f7] p-6 rounded-[32px] border border-black/5 flex flex-col justify-center">
                    <p className="text-[9px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Mobile Access</p>
                    <p className="text-xl font-extrabold text-black tracking-tight">{vendor.phone}</p>
                  </div>
                  <div className="flex gap-4">
                    <a href={`tel:${vendor.phone}`} className="flex-1 bg-black text-white rounded-[32px] flex items-center justify-center text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all">Call</a>
                    <a 
                      href={`https://wa.me/${vendor.phone?.replace('+', '').replace(/ /g, '')}`} 
                      target="_blank"
                      className="flex-1 bg-black text-white rounded-[32px] flex items-center justify-center text-[11px] font-black uppercase tracking-widest border border-black hover:bg-white hover:text-black transition-all"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-right hidden md:block">
                 <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Instance Date</p>
                 <p className="text-sm font-bold text-black uppercase">{new Date(request?.timestamp || Date.now()).toLocaleDateString()}</p>
                 <button onClick={() => onVendorSelect(vendor)} className="mt-8 text-black font-black text-[10px] uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-50 transition-all">Full Intent →</button>
              </div>
            </div>
          );
        })}

        {connectedVendors.length === 0 && (
          <div className="bg-[#f5f5f7] py-40 rounded-[60px] text-center px-12 border border-black/5">
            <h2 className="text-5xl font-extrabold text-black mb-6 tracking-tight opacity-10 uppercase">Null History</h2>
            <p className="text-[#86868b] font-bold uppercase tracking-widest text-[11px] max-w-md mx-auto mb-12 opacity-50">No instances discovered yet. Initiate a handshake on the home page to start.</p>
            <button onClick={() => window.location.hash = 'home'} className="btn-apple px-16 py-6 font-black">Discovered Experts</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyConnections;
