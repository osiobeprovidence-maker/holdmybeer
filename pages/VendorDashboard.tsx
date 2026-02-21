
import React, { useState } from 'react';
import { User, Category, Location, IDType, ServiceRequest } from '../types';
import { initializePaystack } from '../services/paymentService';

interface DashboardProps {
  user: User;
  onUpdateUser: (user: User) => void;
  unlockedVendors: User[];
  serviceRequests: ServiceRequest[];
  allUsers: User[];
}

type VerificationStep = 'phone' | 'otp' | 'name' | 'id_select' | 'id_number' | 'id_photo' | 'success';

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const VendorDashboard: React.FC<DashboardProps> = ({ user, onUpdateUser, unlockedVendors, serviceRequests, allUsers }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'spot' | 'portfolio' | 'verification'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  // Verification State
  const [kycStep, setKycStep] = useState<VerificationStep>(user.kycVerified ? 'success' : 'phone');
  const [phoneInput, setPhoneInput] = useState(user.phone || '');
  const [otpInput, setOtpInput] = useState('');
  const [nameInput, setNameInput] = useState(user.name || '');
  const [kycType, setKycType] = useState<IDType>('NIN');
  const [kycNumberInput, setKycNumberInput] = useState('');
  const [idPhoto, setIdPhoto] = useState<string | null>(null);

  // Spot Configuration State
  const [formData, setFormData] = useState({
    avatar: user.avatar || '',
    businessName: user.businessName || '',
    bio: user.bio || '',
    category: user.category || Category.DJ,
    location: user.location || Location.LAGOS_ISLAND,
    minPrice: user.priceRange?.[0] || 0,
    maxPrice: user.priceRange?.[1] || 0,
    availableToday: user.availableToday || false,
    availableDays: user.availableDays || ["Fri", "Sat", "Sun"],
    portfolio: user.portfolio || [],
    completedJobs: user.completedJobs || 0,
    avgDeliveryTime: user.avgDeliveryTime || '24h',
    topSkills: user.topSkills || [],
    services: user.services || [],
    experience: user.experience || '',
    industries: user.industries || [],
    socialLinks: user.socialLinks || {
      instagram: '',
      behance: '',
      youtube: '',
      tiktok: '',
      portfolio: ''
    }
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, avatar: url });
      // Update immediately across platform
      onUpdateUser({ ...user, avatar: url });
    }
  };

  const handleSaveSpot = () => {
    onUpdateUser({ 
      ...user, 
      ...formData, 
      location: formData.location as Location,
      priceRange: [formData.minPrice, formData.maxPrice] 
    });
    setIsEditing(false);
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day) 
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const currentCount = formData.portfolio.length;
      const remaining = 10 - currentCount;
      
      if (remaining <= 0) {
        alert("Portfolio limit reached (max 10 items).");
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remaining);
      if (files.length > remaining) {
        alert(`Only ${remaining} items were added. Portfolio limit is 10.`);
      }

      const newImages = filesToUpload.map((file: File) => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        portfolio: [...prev.portfolio, ...newImages]
      }));
    }
  };

  const removePortfolioItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };

  // Verification Logic Branching
  const sendCode = () => {
    if (phoneInput.length < 10) return alert("Enter valid phone.");
    setKycStep('otp');
  };

  const verifyOtp = () => {
    if (otpInput === '1234' || otpInput.length === 4) {
      setKycStep('name');
    } else {
      alert("Invalid code. Try 1234.");
    }
  };

  const submitName = () => {
    if (nameInput.length < 3) return alert("Enter legal name.");
    setKycStep('id_select');
  };

  const selectId = (type: IDType) => {
    setKycType(type);
    
    // SPECIFIC ASSET RULES:
    // 1. BVN: Number only
    // 2. Driver License: Photo only
    // 3. Passport, NIN, PVC: Number AND Photo
    
    if (type === 'BVN') {
      setKycStep('id_number');
    } else if (type === 'Driver License') {
      setKycStep('id_photo');
    } else {
      setKycStep('id_number');
    }
  };

  const submitIdNumber = () => {
    if (kycNumberInput.length < 5) return alert("Enter valid number.");
    
    if (kycType === 'BVN') {
      // BVN ends here
      finalizeVerification();
    } else {
      // Passport, NIN, PVC move to photo step
      setKycStep('id_photo');
    }
  };

  const handleKycPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIdPhoto(URL.createObjectURL(file));
  };

  const finalizeVerification = () => {
    onUpdateUser({ 
      ...user, 
      name: nameInput,
      phone: phoneInput,
      kycStatus: 'verified', 
      kycVerified: true, 
      kycType: kycType,
      kycNumber: kycNumberInput || 'ASSET-VERIFIED',
      trialStartDate: user.trialStartDate || Date.now()
    });
    setKycStep('success');
  };

  const handlePayment = () => {
    initializePaystack({
      email: user.email,
      amount: 7000,
      metadata: {
        user_id: user.id,
        payment_type: 'vendor_activation'
      },
      onSuccess: (reference) => {
        onUpdateUser({ ...user, isPaid: true });
        alert(`Payment successful! Ref: ${reference}. Your profile is now permanently active.`);
      },
      onClose: () => {
        console.log('Payment window closed');
      }
    });
  };

  const trialDaysLeft = Math.max(0, Math.ceil(((user.trialStartDate || Date.now()) + (7 * 24 * 60 * 60 * 1000) - Date.now()) / (24 * 60 * 60 * 1000)));
  const needsPayment = !user.isPaid && trialDaysLeft <= 0;

  return (
    <div className="pb-12 animate-in fade-in duration-700 max-w-5xl mx-auto px-6">
      {/* Payment Banner */}
      {!user.isPaid && (
        <div className={`mb-12 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 ${needsPayment ? 'bg-red-500 text-white' : 'bg-black text-white'}`}>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">
              {needsPayment ? 'Trial Expired' : 'Expert Protocol Trial'}
            </h3>
            <p className="text-sm font-bold opacity-70 uppercase tracking-widest">
              {needsPayment 
                ? 'Your 7-day trial has ended. Pay ₦7,000 to keep your profile active.' 
                : `You have ${trialDaysLeft} days left in your trial. One-time fee of ₦7,000 for permanent access.`}
            </p>
          </div>
          <button 
            onClick={handlePayment}
            className="bg-white text-black px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            Pay ₦7,000 Now
          </button>
        </div>
      )}

      {/* Infrastructure Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20 border-b border-black/5 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
           <div className="relative group">
             <img 
                src={formData.avatar || user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                className="w-20 h-20 md:w-24 md:h-24 rounded-[32px] md:rounded-[40px] object-cover border-4 border-white apple-shadow" 
             />
             <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[32px] md:rounded-[40px] opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
               <span className="text-[8px] font-black text-white uppercase tracking-widest">Change</span>
               <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
             </label>
           </div>
           <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">{user.businessName || user.name}</h1>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em]">{user.category || 'Standard User'}</span>
                 <div className={`w-2 h-2 rounded-full ${user.kycVerified ? 'bg-black' : 'bg-gray-200'}`} />
                 <span className="text-[10px] font-bold text-black uppercase tracking-widest">{user.kycVerified ? 'Verified Infrastructure' : 'Pending Check'}</span>
              </div>
           </div>
        </div>
        <button 
          onClick={() => onUpdateUser({ ...user, isCreator: !user.isCreator })}
          className={`w-full md:w-auto px-12 py-5 rounded-full font-black text-[12px] uppercase tracking-[0.2em] transition-all ${user.isCreator ? 'bg-black text-white' : 'bg-[#f5f5f7] text-black hover:bg-black hover:text-white'}`}
        >
          {user.isCreator ? 'Go Offline' : 'Activate Spot'}
        </button>
      </div>

      {/* Spot Controls */}
      <div className="flex gap-12 mb-16 border-b border-black/5 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          { id: 'overview', label: 'Analytics' },
          { id: 'spot', label: 'Configuration' },
          { id: 'portfolio', label: 'Work Gallery' },
          { id: 'verification', label: 'Identity' }
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-5 text-[12px] font-black uppercase tracking-[0.3em] relative transition-all ${activeTab === t.id ? 'text-black' : 'text-[#86868b] hover:text-black'}`}
          >
            {t.label}
            {activeTab === t.id && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black rounded-full" />}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          
          {activeTab === 'overview' && (
            <div className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#f5f5f7] p-8 md:p-12 rounded-[40px] md:rounded-[56px] apple-shadow">
                    <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-6">Total Connections</p>
                    <p className="text-5xl md:text-7xl font-black tracking-tighter">{user.totalUnlocks || 0}</p>
                    <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest mt-8">Instances reveals on platform</p>
                  </div>
                  <div className="bg-black p-8 md:p-12 rounded-[40px] md:rounded-[56px] text-white shadow-2xl">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">Reliability Score</p>
                    <p className="text-5xl md:text-7xl font-black tracking-tighter">{user.reliabilityScore || 70}%</p>
                    <div className="w-full bg-white/10 h-1 mt-8 rounded-full overflow-hidden">
                       <div className="bg-white h-full" style={{ width: `${user.reliabilityScore}%` }} />
                    </div>
                  </div>
               </div>

               <div className="bg-[#f5f5f7] p-8 md:p-12 rounded-[40px] md:rounded-[56px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                     <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Emergency Status</h3>
                     <p className="text-[#86868b] font-bold uppercase text-[10px] tracking-widest">Toggle "Active Now" for urgent requests.</p>
                  </div>
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl shadow-inner ${user.availableToday ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                     {user.availableToday ? '⚡️' : '💤'}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'spot' && (
            <div className="bg-white border border-black/5 p-8 md:p-16 rounded-[40px] md:rounded-[60px] apple-shadow">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Spot Protocol</h3>
                  <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-black uppercase tracking-[0.2em] text-[#86868b] border-b-2 border-transparent hover:border-black transition-all">
                     {isEditing ? 'Discard' : 'Edit Configuration'}
                  </button>
               </div>

               <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Brand / Stage Name</label>
                        <input disabled={!isEditing} value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} placeholder="Expert Alias" className="w-full bg-[#f5f5f7] border-none rounded-3xl p-6 font-bold text-black outline-none disabled:opacity-40" />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Service Category</label>
                        <select disabled={!isEditing} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-[#f5f5f7] border-none rounded-3xl p-6 font-bold text-black outline-none appearance-none disabled:opacity-40">
                           {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Lagos Area</label>
                        <select disabled={!isEditing} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value as any})} className="w-full bg-[#f5f5f7] border-none rounded-3xl p-6 font-bold text-black outline-none appearance-none disabled:opacity-40">
                           {Object.values(Location).map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                     </div>
                     <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Expert Bio</label>
                        <textarea 
                          disabled={!isEditing} 
                          value={formData.bio} 
                          onChange={e => setFormData({...formData, bio: e.target.value})} 
                          placeholder="Describe your expertise, equipment, and experience..." 
                          className="w-full bg-[#f5f5f7] border-none rounded-3xl p-6 font-bold text-black outline-none disabled:opacity-40 min-h-[120px] resize-none"
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Rate Engine (₦)</label>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
                           <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-black/20">₦</span>
                           <input type="number" disabled={!isEditing} value={formData.minPrice} onChange={e => setFormData({...formData, minPrice: Number(e.target.value)})} placeholder="Base" className="w-full bg-[#f5f5f7] rounded-3xl p-6 pl-12 font-bold text-black outline-none disabled:opacity-40" />
                        </div>
                        <div className="relative">
                           <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-black/20">₦</span>
                           <input type="number" disabled={!isEditing} value={formData.maxPrice} onChange={e => setFormData({...formData, maxPrice: Number(e.target.value)})} placeholder="Max" className="w-full bg-[#f5f5f7] rounded-3xl p-6 pl-12 font-bold text-black outline-none disabled:opacity-40" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4 block">Availability Pulse</label>
                     <div className="flex flex-wrap gap-3">
                        {DAYS.map(day => (
                          <button 
                            key={day}
                            disabled={!isEditing}
                            onClick={() => toggleDay(day)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-[11px] transition-all ${formData.availableDays.includes(day) ? 'bg-black text-white' : 'bg-[#f5f5f7] text-[#86868b]'}`}
                          >
                            {day}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* New Work Page Configuration Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12 border-t border-black/5">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Completed Jobs</label>
                      <input type="number" disabled={!isEditing} value={formData.completedJobs} onChange={e => setFormData({...formData, completedJobs: Number(e.target.value)})} className="w-full bg-[#f5f5f7] border-none rounded-3xl p-6 font-bold text-black outline-none disabled:opacity-40" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Avg Delivery Time</label>
                      <input disabled={!isEditing} value={formData.avgDeliveryTime} onChange={e => setFormData({...formData, avgDeliveryTime: e.target.value})} placeholder="e.g. 24h, 3 days" className="w-full bg-[#f5f5f7] border-none rounded-3xl p-6 font-bold text-black outline-none disabled:opacity-40" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Experience Level</label>
                      <input disabled={!isEditing} value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="e.g. 2 years, 40+ clients" className="w-full bg-[#f5f5f7] border-none rounded-3xl p-6 font-bold text-black outline-none disabled:opacity-40" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Top Skills (Comma separated)</label>
                      <input disabled={!isEditing} value={formData.topSkills.join(', ')} onChange={e => setFormData({...formData, topSkills: e.target.value.split(',').map(s => s.trim())})} placeholder="Skill 1, Skill 2" className="w-full bg-[#f5f5f7] border-none rounded-3xl p-6 font-bold text-black outline-none disabled:opacity-40" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Instagram Handle</label>
                      <input disabled={!isEditing} value={formData.socialLinks.instagram} onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, instagram: e.target.value}})} placeholder="@username" className="w-full bg-[#f5f5f7] border-none rounded-3xl p-6 font-bold text-black outline-none disabled:opacity-40" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[#86868b] uppercase tracking-widest ml-4">Portfolio Link</label>
                      <input disabled={!isEditing} value={formData.socialLinks.portfolio} onChange={e => setFormData({...formData, socialLinks: {...formData.socialLinks, portfolio: e.target.value}})} placeholder="https://..." className="w-full bg-[#f5f5f7] border-none rounded-3xl p-6 font-bold text-black outline-none disabled:opacity-40" />
                    </div>
                  </div>

                  {isEditing && (
                    <button onClick={handleSaveSpot} className="w-full btn-apple py-6 text-lg uppercase tracking-widest shadow-2xl mt-8">Apply Configuration</button>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-12">
               <div className="flex justify-between items-end">
                  <div>
                     <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Work Gallery</h3>
                     <p className="text-[#86868b] font-bold uppercase text-[10px] tracking-widest">Showcase your expert execution.</p>
                  </div>
                  <label className="btn-apple px-10 py-4 cursor-pointer">
                     Add Media
                     <input type="file" multiple className="hidden" accept="image/*,video/*" onChange={handlePortfolioUpload} />
                  </label>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {formData.portfolio.map((img, idx) => {
                    const isVideo = img?.toLowerCase().match(/\.(mp4|webm|ogg)$/) || img?.includes('video');
                    return (
                      <div key={idx} className="relative aspect-square rounded-[32px] overflow-hidden group bg-[#f5f5f7] apple-shadow">
                         {isVideo ? (
                           <video src={img} className="w-full h-full object-cover" />
                         ) : (
                           <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         )}
                         <button 
                           onClick={() => removePortfolioItem(idx)}
                           className="absolute top-4 right-4 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                         >
                            ✕
                         </button>
                      </div>
                    );
                  })}
                  {formData.portfolio.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-[#f5f5f7] rounded-[56px] border-4 border-dashed border-black/5">
                       <p className="text-6xl mb-6">📸</p>
                       <p className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.4em]">Gallery Empty. Add your proof of work.</p>
                    </div>
                  )}
               </div>
               
               {formData.portfolio.length > 0 && (
                 <button onClick={handleSaveSpot} className="w-full btn-apple py-6 uppercase tracking-widest mt-10">Save Gallery</button>
               )}
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="bg-[#f5f5f7] p-8 md:p-20 rounded-[40px] md:rounded-[64px] min-h-[500px] flex flex-col justify-center">
               {kycStep === 'phone' && (
                  <div className="animate-in slide-in-from-right-10">
                     <h3 className="text-3xl md:text-4xl font-black uppercase mb-10 tracking-tighter">Mobile Verification</h3>
                     <p className="text-[#86868b] font-bold uppercase text-[10px] tracking-widest mb-10">Enter your secure line to receive authentication.</p>
                     <input value={phoneInput} onChange={e => setPhoneInput(e.target.value)} placeholder="+234..." className="w-full bg-white rounded-3xl p-6 md:p-8 text-xl md:text-2xl font-black mb-10 outline-none border border-black/5" />
                     <button onClick={sendCode} className="w-full btn-apple py-7 uppercase tracking-widest text-lg">Initialize Signal</button>
                  </div>
               )}

               {kycStep === 'otp' && (
                  <div className="text-center animate-in slide-in-from-right-10">
                     <h3 className="text-2xl md:text-3xl font-black uppercase mb-10 tracking-tighter">Input Signal Code</h3>
                     <input value={otpInput} onChange={e => setOtpInput(e.target.value)} placeholder="0 0 0 0" maxLength={4} className="w-full bg-white rounded-3xl p-8 md:p-12 text-4xl md:text-6xl font-black text-center mb-10 outline-none tracking-[0.5em]" />
                     <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => setKycStep('phone')} className="w-full sm:w-auto px-10 py-4 font-black text-[#86868b] uppercase tracking-widest text-[11px]">Back</button>
                        <button onClick={verifyOtp} className="flex-grow btn-apple py-7 uppercase tracking-widest">Verify Hub</button>
                     </div>
                  </div>
               )}

               {kycStep === 'name' && (
                  <div className="animate-in slide-in-from-right-10">
                     <h3 className="text-3xl md:text-4xl font-black uppercase mb-10 tracking-tighter">Legal Identity</h3>
                     <p className="text-[#86868b] font-bold uppercase text-[10px] tracking-widest mb-10">Matches the name on your provided assets.</p>
                     <input value={nameInput} onChange={e => setNameInput(e.target.value)} placeholder="Full Legal Name" className="w-full bg-white rounded-3xl p-6 md:p-8 text-xl md:text-2xl font-black mb-10 outline-none border border-black/5" />
                     <button onClick={submitName} className="w-full btn-apple py-7 uppercase tracking-widest">Set Legal Handle</button>
                  </div>
               )}

               {kycStep === 'id_select' && (
                  <div className="animate-in slide-in-from-right-10">
                     <h3 className="text-2xl md:text-3xl font-black uppercase mb-12 tracking-tighter">Select Asset Type</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {[
                           { id: 'International Passport', label: 'Travel Access (Passport)' },
                           { id: 'NIN', label: 'NIN (National ID)' },
                           { id: 'PVC', label: 'Voter\'s Card (PVC)' },
                           { id: 'BVN', label: 'BVN (No Photo Required)' },
                           { id: 'Driver License', label: 'Driver License (No Number Required)' }
                        ].map(t => (
                           <button key={t.id} onClick={() => selectId(t.id as IDType)} className="p-6 md:p-10 rounded-[24px] md:rounded-[32px] bg-white border border-black/5 font-black uppercase tracking-widest text-[10px] md:text-[11px] text-left hover:border-black transition-all flex justify-between items-center group">
                               {t.label}
                               <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               {kycStep === 'id_number' && (
                  <div className="animate-in slide-in-from-right-10">
                     <h3 className="text-2xl md:text-3xl font-black uppercase mb-10 tracking-tighter">{kycType} Serial Number</h3>
                     <input value={kycNumberInput} onChange={e => setKycNumberInput(e.target.value)} placeholder={`Input your ${kycType} number`} className="w-full bg-white rounded-3xl p-6 md:p-8 text-xl md:text-2xl font-black mb-10 outline-none border border-black/5" />
                     <button onClick={submitIdNumber} className="w-full btn-apple py-7 uppercase tracking-widest">Register Asset Number</button>
                  </div>
               )}

               {kycStep === 'id_photo' && (
                  <div className="animate-in slide-in-from-right-10 text-center">
                     <h3 className="text-2xl md:text-3xl font-black uppercase mb-10 tracking-tighter">Capture Asset Visual</h3>
                     <p className="text-[#86868b] font-bold uppercase text-[10px] tracking-widest mb-10">Front page of your {kycType}.</p>
                     
                     {idPhoto ? (
                        <div className="relative aspect-video bg-black rounded-[32px] md:rounded-[48px] overflow-hidden mb-10 apple-shadow">
                           <img src={idPhoto} className="w-full h-full object-cover opacity-80" />
                           <button onClick={() => setIdPhoto(null)} className="absolute inset-0 flex items-center justify-center font-black text-white uppercase text-[11px] tracking-widest bg-black/40 opacity-0 hover:opacity-100 transition-opacity">Retake Scan</button>
                        </div>
                      ) : (
                        <label className="block aspect-video border-4 border-dashed border-black/10 rounded-[32px] md:rounded-[48px] flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-black/20 transition-all mb-10">
                           <span className="text-5xl md:text-6xl mb-6">🖼️</span>
                           <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#86868b]">Upload {kycType} Scan</span>
                           <input type="file" className="hidden" accept="image/*" onChange={handleKycPhotoUpload} />
                        </label>
                      )}
                      <button disabled={!idPhoto} onClick={finalizeVerification} className="w-full btn-apple py-7 uppercase tracking-widest disabled:opacity-20 shadow-2xl">Finalize Identity Protocol</button>
                  </div>
               )}

               {kycStep === 'success' && (
                  <div className="text-center py-12 md:py-24 animate-in zoom-in-95">
                     <div className="w-24 h-24 md:w-32 md:h-32 bg-black text-white flex items-center justify-center rounded-[32px] md:rounded-[40px] mx-auto mb-12 text-4xl md:text-5xl">✓</div>
                     <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">Identity Confirmed</h3>
                     <p className="text-[#86868b] font-bold uppercase text-[10px] md:text-[11px] tracking-[0.4em] mb-16 opacity-60">Your infrastructure layer is verified via {kycType}.</p>
                     <button onClick={() => setActiveTab('spot')} className="btn-apple px-12 md:px-20 py-7 uppercase tracking-widest shadow-2xl">Return to Spot Hub</button>
                  </div>
               )}
            </div>
          )}
        </div>

        {/* Status Sidebar */}
        <div className="space-y-10">
           <div className="bg-white border border-black/5 p-8 md:p-12 rounded-[40px] md:rounded-[56px] apple-shadow lg:sticky lg:top-32">
              <h4 className="text-[11px] font-black text-black uppercase tracking-[0.4em] mb-12 border-b border-black/5 pb-5">Live Hub Specs</h4>
              <div className="space-y-10">
                 <div>
                    <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-3">Verification Asset</p>
                    <p className="font-black text-black text-sm uppercase">{user.kycType || 'None'}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-3">Rate Bracket</p>
                    <p className="font-black text-black text-lg">
                       ₦{(user.priceRange?.[0] || 0).toLocaleString()} <span className="text-black/20">—</span> ₦{(user.priceRange?.[1] || 0).toLocaleString()}
                    </p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-3">Gallery Volume</p>
                    <p className="font-black text-black text-sm">{user.portfolio?.length || 0} Assets Uploaded</p>
                 </div>
                 <div className="pt-6">
                    <div className="flex gap-1.5">
                       {DAYS.map(d => (
                         <div key={d} className={`w-2.5 h-2.5 rounded-full ${user.availableDays?.includes(d) ? 'bg-black' : 'bg-[#f5f5f7]'}`} />
                       ))}
                    </div>
                    <p className="text-[9px] font-black text-[#86868b] uppercase tracking-widest mt-4">Active Days Pulse</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
