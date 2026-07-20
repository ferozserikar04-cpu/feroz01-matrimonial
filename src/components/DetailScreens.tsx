import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, MapPin, Heart, Share2, FileText, ArrowLeft, MessageSquare, AlertTriangle, CheckCircle, ChevronRight, Sparkles, Printer, FileDown, AlertCircle, Eye, UserPlus, Info, Check, UserMinus, X } from 'lucide-react';
import { UserProfile, ScreenId } from '../types';

interface DetailScreensProps {
  profile: UserProfile;
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenReport: () => void;
}

export const DetailScreens: React.FC<DetailScreensProps> = ({
  profile,
  currentScreen,
  onNavigate,
  onOpenReport
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [interestSent, setInterestSent] = useState(false);
  const [biodataUnlocked, setBiodataUnlocked] = useState(false);
  const [previewUploadedBiodata, setPreviewUploadedBiodata] = useState(false);

  // 7. PROFILE DETAILS SCREEN
  if (currentScreen === 'profile') {
    return (
      <div id="profile-details-screen" className="flex flex-col h-full bg-[#FFF8FA] select-none relative">
        {/* Header Photo Swiper */}
        <div className="relative h-80 bg-pink-100 shrink-0">
          <img
            src={profile.photos[activePhotoIndex]}
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />

          {/* Floating Back Button */}
          <button
            onClick={() => onNavigate('home')}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/35 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => alert('Profile link copied to clipboard!')}
              className="w-10 h-10 rounded-full bg-black/35 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition"
              title="Share Profile"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenReport}
              className="w-10 h-10 rounded-full bg-black/35 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition"
              title="Report User"
            >
              <AlertTriangle className="w-5 h-5" />
            </button>
          </div>

          {/* Swiper Indicators */}
          {profile.photos.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-1">
              {profile.photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activePhotoIndex ? 'bg-[#FFD54F] w-6' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}

          {/* Floating Verification Badge */}
          {profile.verified && (
            <div className="absolute bottom-5 left-4 bg-green-500 text-white px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-white fill-green-500" /> Government ID Verified
            </div>
          )}
        </div>

        {/* Scrollable details view */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          {/* Quick Header Summary */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900">{profile.name}</h3>
              <span className="text-sm font-semibold text-gray-500">({profile.age} yrs)</span>
            </div>

            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#C2185B]" /> {profile.location}
            </p>

            {/* Quick Badges Grid */}
            <div className="grid grid-cols-3 gap-2 mt-3.5">
              <div className="bg-white border border-pink-100 p-2 rounded-xl text-center shadow-2xs">
                <span className="text-[9px] text-gray-400 block font-semibold uppercase">Community</span>
                <span className="text-xs font-bold text-gray-800">{profile.religion}</span>
              </div>
              <div className="bg-white border border-pink-100 p-2 rounded-xl text-center shadow-2xs">
                <span className="text-[9px] text-gray-400 block font-semibold uppercase">Caste / Sect</span>
                <span className="text-xs font-bold text-gray-800 truncate block">{profile.caste}</span>
              </div>
              <div className="bg-white border border-pink-100 p-2 rounded-xl text-center shadow-2xs">
                <span className="text-[9px] text-gray-400 block font-semibold uppercase">Profession</span>
                <span className="text-xs font-bold text-[#880E4F] truncate block">{profile.profession.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Compatibility Match Card */}
          <div className="bg-linear-to-r from-[#880E4F] to-[#AD1457] rounded-2xl p-4 text-white shadow-xs">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 fill-yellow-300 animate-spin" /> Compatibility Match
              </span>
              <span className="text-sm font-black bg-white/15 px-2.5 py-0.5 rounded-full">{profile.matchScore}% Match Score</span>
            </div>
            <p className="text-xs text-pink-50/90 leading-relaxed">
              Based on common caste values, matching language ({profile.motherTongue}), educational compatibility, and mutual Delhi expectations.
            </p>
          </div>

          {/* About Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider font-sans">About Candidate</h4>
            <p className="text-xs text-gray-600 leading-relaxed bg-white border border-pink-100/40 p-3.5 rounded-2xl">
              {profile.about}
            </p>
          </div>

          {/* Uploaded Biodata File Card */}
          {profile.biodataFile && (
            <div className="bg-white border border-pink-100 rounded-3xl p-4 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#880E4F]/10 flex items-center justify-center text-[#880E4F] shrink-0 border border-pink-100/50">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-gray-800 truncate">Candidate Biodata Record</h4>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{profile.biodataFile.name} ({profile.biodataFile.size})</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewUploadedBiodata(true)}
                className="shrink-0 bg-[#880E4F] hover:bg-[#AD1457] text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full transition shadow-xs flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> View File
              </button>
            </div>
          )}

          {/* Essential Vitals list */}
          <div className="space-y-2 bg-white border border-pink-100/40 rounded-2xl p-4">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider font-sans border-b border-pink-50 pb-2 mb-2">Essential Particulars</h4>
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-2">
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Mother Tongue</span>
                <span className="text-xs font-bold text-gray-700">{profile.motherTongue}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Annual Personal Income</span>
                <span className="text-xs font-bold text-gray-700">{profile.income}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Education</span>
                <span className="text-xs font-bold text-gray-700 block truncate">{profile.education}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Height</span>
                <span className="text-xs font-bold text-gray-700">{profile.height}</span>
              </div>
            </div>
          </div>

          {/* Interests & Hobbies Chips */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider font-sans">Hobbies & Interests</h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-pink-50 text-[#880E4F] border border-pink-100/50 px-3 py-1 rounded-full text-xs font-bold"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Family Context Details */}
          <div className="space-y-2 bg-white border border-pink-100/40 rounded-2xl p-4">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider font-sans border-b border-pink-50 pb-2 mb-2">Family Context</h4>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Family Type & Values</span>
                <span className="text-xs font-bold text-gray-700">{profile.familyType} ({profile.familyValues})</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Father's Occupation</span>
                <span className="text-xs font-bold text-gray-700">{profile.fatherOccupation}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Mother's Occupation</span>
                <span className="text-xs font-bold text-gray-700">{profile.motherOccupation}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Siblings</span>
                <span className="text-xs font-bold text-gray-700">{profile.siblings}</span>
              </div>
            </div>
          </div>

          {/* Partner Expectations */}
          <div className="space-y-2 bg-white border border-pink-100/40 rounded-2xl p-4">
            <h4 className="text-xs font-black text-[#880E4F] uppercase tracking-wider font-sans border-b border-pink-50 pb-2 mb-2">Ideal Partner Expectations</h4>
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-2">
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Age Preferences</span>
                <span className="text-xs font-bold text-gray-700">{profile.partnerExpectations.ageRange}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Height Preferences</span>
                <span className="text-xs font-bold text-gray-700">{profile.partnerExpectations.heightRange}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Religion Preferance</span>
                <span className="text-xs font-bold text-gray-700">{profile.partnerExpectations.religion}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Income Expectations</span>
                <span className="text-xs font-bold text-gray-700">{profile.partnerExpectations.incomeRange}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action footer bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-pink-100 flex gap-2.5 items-center justify-between z-10 shadow-lg">
          <button
            onClick={() => {
              if (profile.biodataFile) {
                setPreviewUploadedBiodata(true);
              } else {
                onNavigate('biodata');
              }
            }}
            className="flex-1 py-3 bg-[#AD1457]/10 hover:bg-[#AD1457]/15 border border-[#AD1457]/20 text-[#AD1457] font-bold rounded-full text-xs transition flex items-center justify-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> View Full Biodata
          </button>
          
          <button
            id="profile-interest-btn"
            onClick={() => setInterestSent(true)}
            disabled={interestSent}
            className={`flex-1 py-3 font-bold rounded-full text-xs shadow-md transition flex items-center justify-center gap-1.5 ${interestSent ? 'bg-green-500 text-white shadow-none' : 'bg-[#880E4F] text-white hover:bg-[#AD1457]'}`}
          >
            {interestSent ? (
              <>
                <Check className="w-4 h-4" /> Connection Sent
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white" /> Send Interest
              </>
            )}
          </button>
        </div>

        {/* UPLOADED BIODATA PREVIEW MODAL */}
        {previewUploadedBiodata && profile.biodataFile && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 select-none">
            <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85%]">
              {/* Modal Header */}
              <div className="bg-pink-50 border-b border-pink-100 px-4 py-3 flex items-center justify-between shrink-0">
                <span className="text-[#880E4F] font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Candidate Biodata
                </span>
                <button 
                  onClick={() => setPreviewUploadedBiodata(false)}
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 border border-pink-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Document Content Viewport */}
              <div className="p-4 bg-slate-100 flex-1 overflow-y-auto flex items-center justify-center min-h-[300px]">
                {profile.biodataFile.type === 'pdf' ? (
                  /* PDF simulated page */
                  <div className="bg-white border-2 border-double border-amber-800/20 p-5 rounded-lg w-full max-w-[280px] shadow-sm text-[8px] space-y-3 relative font-serif text-gray-800">
                    <div className="text-center">
                      <span className="px-1 py-0.5 bg-amber-100 text-amber-900 rounded-sm text-[5px] font-black uppercase">श्री गणेशाय नमः • ॐ</span>
                      <h4 className="text-xs font-bold text-amber-950 mt-1 uppercase">Matrimonial Biodata</h4>
                      <div className="w-8 h-0.5 bg-amber-800/30 mx-auto mt-0.5" />
                    </div>

                    <div className="space-y-1.5 text-left text-[7px]">
                      <p><strong className="text-amber-950">Name:</strong> {profile.name}</p>
                      <p><strong className="text-amber-950">Age / Religion:</strong> {profile.age} Years / {profile.religion}</p>
                      <p><strong className="text-amber-950">Education:</strong> {profile.education}</p>
                      <p><strong className="text-amber-950">Profession:</strong> {profile.profession}</p>
                      <p><strong className="text-amber-950">Caste / Sect:</strong> {profile.caste}</p>
                      <p><strong className="text-amber-950">Location:</strong> {profile.location}</p>
                      <p><strong className="text-amber-950">About:</strong> {profile.about}</p>
                    </div>
                    <div className="border-t border-amber-800/10 pt-2 text-[6px] text-gray-400 text-center">
                      🔒 Certified Matrimonial Document - {profile.name}
                    </div>
                  </div>
                ) : (
                  /* Image file rendering */
                  <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden border border-gray-200 bg-white">
                    <img src={profile.biodataFile.url} alt="Biodata Preview" className="max-w-full max-h-[400px] object-contain" />
                  </div>
                )}
              </div>

              {/* Modal Actions Footer */}
              <div className="p-3 bg-gray-50 border-t border-pink-100 flex gap-2 shrink-0 font-sans">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!profile.biodataFile) return;
                    const link = document.createElement('a');
                    link.href = profile.biodataFile.url;
                    link.download = `Biodata_${profile.name}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex-1 py-2 bg-[#880E4F] hover:bg-[#AD1457] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (navigator.share) {
                      navigator.share({
                        title: `${profile.name} Matrimonial Biodata`,
                        text: `Review candidate biodata record of ${profile.name}`,
                        url: window.location.href,
                      }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Biodata link copied for sharing!");
                    }
                  }}
                  className="py-2 px-3 bg-white border border-pink-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-100 transition flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 8. BIODATA VIEWER SCREEN (Modern South Asian Matrimonial Digital Biodata)
  if (currentScreen === 'biodata') {
    return (
      <div id="biodata-viewer-screen" className="flex flex-col h-full bg-[#3E2723] select-none text-gray-800">
        {/* Navigation & Action Header */}
        <div className="bg-[#5D4037] px-4 py-3 flex items-center justify-between text-white border-b border-[#3E2723]/30">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('profile')}
              className="w-8.5 h-8.5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </button>
            <div>
              <h3 className="text-xs font-black tracking-wider uppercase font-mono">Premium Digital Biodata</h3>
              <p className="text-[10px] text-orange-200">Certified by Feroz 01</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => alert('Downloaded Biodata PDF to device storage!')}
              className="w-8.5 h-8.5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              title="Download PDF"
            >
              <FileDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert('Printed Digital Matrimonial Biodata')}
              className="w-8.5 h-8.5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              title="Print Biodata"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable digital PDF paper sheet page */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#4E342E]">
          {/* Classic Royal/Elegant Card Frame */}
          <div className="bg-[#FFFDF9] border-4 border-double border-amber-800/40 p-5 rounded-2xl shadow-2xl relative overflow-hidden font-sans">
            {/* Watermark Logo symbol */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none">
              <Heart className="w-96 h-96 text-red-900 fill-red-900" />
            </div>

            {/* Classical Border Accents */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-800/10 pointer-events-none rounded-xl" />

            {/* Traditional Top Header emblem */}
            <div className="text-center mb-6 relative">
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-300 mb-2">
                श्री गणेशाय नमः • ॐ
              </div>
              <h1 className="text-2xl font-black text-amber-900 tracking-tight font-serif uppercase">Matrimonial Biodata</h1>
              <div className="w-20 h-0.5 bg-amber-800/40 mx-auto mt-1.5" />
            </div>

            {/* Part 1: General Info Header */}
            <div className="flex gap-4 items-start pb-5 border-b border-amber-800/15 mb-4.5 relative z-1">
              <div className="w-24 h-24 rounded-lg bg-pink-50 overflow-hidden border border-amber-800/20 shrink-0 shadow-xs">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-amber-950 font-serif leading-none mb-1.5">{profile.name}</h2>
                <p className="text-xs text-amber-850 font-semibold mb-1">
                  Profession: <span className="font-bold text-[#880E4F]">{profile.profession}</span>
                </p>
                <p className="text-[11px] text-gray-500 leading-normal font-medium">
                  Currently residing in {profile.location}. Ready for quick alignment and family meetings.
                </p>
              </div>
            </div>

            {/* Part 2: Personal Particulars */}
            <div className="space-y-4 relative z-1">
              <div>
                <h3 className="text-xs font-black text-amber-950 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-sm border-l-4 border-amber-700 font-serif mb-2.5">
                  1. Personal Particulars
                </h3>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold w-1/3">Age / DOB</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.age} Years (18th August 1998)</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Height</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.height}</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Religion / Sect</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.religion} ({profile.sect || 'N/A'})</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Caste & Gotra</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.caste} • Bharadwaj Gotra</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Mother Tongue</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.motherTongue}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Part 3: Educational and Career details */}
              <div>
                <h3 className="text-xs font-black text-amber-950 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-sm border-l-4 border-amber-700 font-serif mb-2.5">
                  2. Educational & Career
                </h3>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold w-1/3">Education</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.education}</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Current Employer</td>
                      <td className="py-2 text-amber-950 font-bold">Multinational Tech Enterprise</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Designation</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.profession}</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Annual Income</td>
                      <td className="py-2 text-[#880E4F] font-black">{profile.income}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Part 4: Family Details */}
              <div>
                <h3 className="text-xs font-black text-amber-950 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-sm border-l-4 border-amber-700 font-serif mb-2.5">
                  3. Family Background
                </h3>
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold w-1/3">Father's Name</td>
                      <td className="py-2 text-amber-950 font-bold">Shri S. K. Sharma</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Father's Job</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.fatherOccupation}</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Mother's Job</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.motherOccupation}</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Family Type</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.familyType} • {profile.familyValues} Values</td>
                    </tr>
                    <tr className="border-b border-amber-800/5">
                      <td className="py-2 text-gray-500 font-semibold">Siblings Info</td>
                      <td className="py-2 text-amber-950 font-bold">{profile.siblings}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Verified Badge Footer */}
              <div className="pt-4 mt-2.5 border-t border-amber-800/20 text-center text-[10px] text-amber-900/60 font-bold flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-700 fill-amber-100" /> Digital Matrimonial Record Verified by Feroz 01 Core Team
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

/* 13. REPORT USER SCREEN (Slide-up modal dialog for Safety / Safe Connects) */
interface ReportUserProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: () => void;
}

export const ReportUserDialog: React.FC<ReportUserProps> = ({
  profile,
  isOpen,
  onClose,
  onSubmitReport
}) => {
  const [reportReason, setReportReason] = useState('fake');
  const [reportMessage, setReportMessage] = useState('');
  const [blockUser, setBlockUser] = useState(true);

  if (!isOpen) return null;

  return (
    <div id="report-user-dialog" className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 p-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-pink-100 flex flex-col max-h-[85%]"
      >
        {/* Header */}
        <div className="bg-pink-50 border-b border-pink-100 px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#880E4F]">
            <AlertCircle className="w-5 h-5" />
            <h4 className="text-xs font-black uppercase tracking-wider">Submit Safety Report</h4>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 border border-pink-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-gray-700">
          <div>
            <h5 className="text-xs font-bold text-gray-900">Report profile of {profile.name}</h5>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
              Feroz 01 safe connect guarantees elite background audits. Your reports are fully anonymous and private.
            </p>
          </div>

          {/* Reason Selection Radio */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-500 block uppercase">Select Safety Breach Type</span>
            
            <div className="space-y-1.5">
              {[
                { id: 'fake', label: 'Fake Profile / Misleading Details' },
                { id: 'money', label: 'Asking for financial assistance / scam' },
                { id: 'marry', label: 'Candidate is already married' },
                { id: 'chat', label: 'Abusive or highly aggressive chat messages' },
                { id: 'other', label: 'Other details (Describe below)' }
              ].map((reason) => (
                <label
                  key={reason.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${reportReason === reason.id ? 'bg-pink-50 border-[#880E4F]/50 font-semibold text-[#880E4F]' : 'bg-white border-pink-100/50 hover:bg-pink-50/20'}`}
                >
                  <input
                    type="radio"
                    name="report-reason"
                    checked={reportReason === reason.id}
                    onChange={() => setReportReason(reason.id)}
                    className="w-4 h-4 accent-[#880E4F]"
                  />
                  <span>{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Explanatory Message */}
          <div>
            <span className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Detailed Explanation (Optional)</span>
            <textarea
              rows={3}
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              placeholder="Provide context to assist our safety auditors..."
              className="w-full p-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F] resize-none text-gray-700"
            />
          </div>

          {/* Block user toggle */}
          <div className="flex items-center justify-between p-2.5 bg-pink-50/50 border border-pink-100/50 rounded-xl">
            <div>
              <span className="text-xs font-bold text-gray-800 block">Block Candidate Instantly</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">They will not see your profile anymore</span>
            </div>
            <input
              type="checkbox"
              checked={blockUser}
              onChange={() => setBlockUser(!blockUser)}
              className="w-5 h-5 accent-[#880E4F]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-white border-t border-pink-50 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-pink-200 text-gray-600 font-bold rounded-full text-xs hover:bg-pink-50"
          >
            Cancel
          </button>
          <button
            id="report-submit-btn"
            onClick={onSubmitReport}
            className="flex-1 py-2.5 bg-[#880E4F] text-white font-bold rounded-full text-xs shadow-md hover:bg-[#AD1457]"
          >
            Submit Safe Report
          </button>
        </div>
      </motion.div>
    </div>
  );
};
