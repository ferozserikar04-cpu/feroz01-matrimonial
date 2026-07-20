import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Search, Filter, Bell, MapPin, CheckCircle, Award, SlidersHorizontal, ArrowRight, ArrowLeft, UserCheck, MessageSquare, ShieldAlert, Sparkles, X, ChevronRight, Bookmark, Share2, Download, Smartphone } from 'lucide-react';
import { UserProfile, AppNotification, ScreenId } from '../types';
import { MOCK_PROFILES } from '../data';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectProfile: (profile: UserProfile) => void;
  notificationsCount: number;
  profiles: UserProfile[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectProfile,
  notificationsCount,
  profiles
}) => {
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<'All' | 'Female' | 'Male'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recommendedProfiles = (profiles || []).filter(p => 
    selectedGenderFilter === 'All' ? true : p.gender === selectedGenderFilter
  );

  const handleShareApp = () => {
    const shareData = {
      title: 'Feroz 01 Matrimonial',
      text: 'Find your perfect premium lifepartner on Feroz 01 Matrimonial! Secure, double-checked, premium matches. Download our official Android App now.',
      url: 'https://play.google.com/store/apps/details?id=com.feroz01.matrimonial'
    };
    
    if (navigator.share) {
      navigator.share(shareData)
        .catch((err) => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(shareData.url);
      setToastMessage("App Link copied to clipboard!");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div id="home-screen" className="flex flex-col h-full bg-[#FFF8FA] select-none relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white text-[11px] px-4.5 py-2.5 rounded-2xl shadow-xl z-50 flex items-center gap-1.5 backdrop-blur-xs font-sans font-bold border border-white/10 animate-bounce">
          <Share2 className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Premium Elegant App Bar */}
      <div className="bg-white border-b border-pink-100 px-4 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#880E4F] to-[#C2185B] flex items-center justify-center shadow-xs">
            <Heart className="w-4.5 h-4.5 text-yellow-300 fill-yellow-300" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-gray-900 tracking-tight leading-none">Feroz 01</h1>
            <span className="text-[10px] text-pink-700 font-bold uppercase tracking-widest font-mono">Elite Partner</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleShareApp}
            className="w-8.5 h-8.5 rounded-full bg-pink-50/50 flex items-center justify-center border border-pink-100 text-gray-700 hover:bg-pink-100 transition"
            title="Share App"
          >
            <Share2 className="w-4.5 h-4.5 text-[#880E4F]" />
          </button>

          <button 
            onClick={() => onNavigate('search')}
            className="w-8.5 h-8.5 rounded-full bg-pink-50/50 flex items-center justify-center border border-pink-100 text-gray-700 hover:bg-pink-100 transition"
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => onNavigate('notifications')}
            className="w-8.5 h-8.5 rounded-full bg-pink-50/50 flex items-center justify-center border border-pink-100 text-gray-700 hover:bg-pink-100 transition relative"
          >
            <Bell className="w-4 h-4" />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C2185B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Premium Header Card */}
        <div className="bg-linear-to-r from-[#880E4F] to-[#AD1457] rounded-2xl p-4.5 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between relative z-1">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#F8BBD0] uppercase tracking-widest block font-mono">Welcome Back</span>
              <h3 className="text-lg font-extrabold">Hello, Feroz!</h3>
              <p className="text-xs text-pink-100/90 leading-normal max-w-[200px]">We curated 5 new elite profiles aligned with your family values today.</p>
            </div>
            <div className="bg-white/15 px-2 py-1.5 rounded-xl border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-yellow-300 block">Trust Level</span>
              <span className="text-sm font-extrabold text-white flex items-center justify-center gap-1">
                98% <CheckCircle className="w-3.5 h-3.5 text-green-300 fill-green-300" />
              </span>
            </div>
          </div>
        </div>

        {/* Native Android App Download Banner */}
        <div className="bg-white border border-pink-100 rounded-3xl p-4 flex items-center justify-between shadow-xs hover:shadow-md transition duration-300 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-gray-800">Feroz 01 Android App</h4>
                <span className="text-[8px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono">Official APK</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">Signed by GitHub Actions. Direct safe install on your phone.</p>
            </div>
          </div>
          <a
            href="https://github.com/ferozserikar04-cpu/feroz01-matrimonial/releases/latest/download/Feroz_01_Matrimonial.apk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-[#880E4F] hover:bg-[#AD1457] text-white text-[10px] font-black px-3.5 py-2 rounded-2xl transition shadow-xs active:scale-95 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800">Recommendations For You</span>
          <div className="flex gap-1.5">
            {['All', 'Female', 'Male'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenderFilter(g as any)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${selectedGenderFilter === g ? 'bg-[#880E4F] text-white border-transparent' : 'bg-white text-gray-500 border-pink-100'}`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Cards List (Stacked Material Cards) */}
        <div className="space-y-4">
          {recommendedProfiles.map((profile) => (
            <motion.div
              key={profile.id}
              whileHover={{ y: -3 }}
              className="bg-white border border-pink-100/70 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition duration-300"
            >
              {/* Profile Main Photo Container */}
              <div className="relative h-60 w-full bg-pink-100 cursor-pointer" onClick={() => onSelectProfile(profile)}>
                <img
                  src={profile.photos[0]}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                
                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Match compatibility score badge */}
                <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-gray-900">{profile.matchScore}% Match</span>
                </div>

                {/* Left side tags: Verified status */}
                <div className="absolute top-3.5 left-3.5 flex gap-1.5">
                  {profile.verified && (
                    <span className="bg-green-500 text-white px-2.5 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-xs">
                      <CheckCircle className="w-3 h-3 fill-white text-green-500" /> Verified
                    </span>
                  )}
                  {profile.online && (
                    <span className="bg-[#880E4F] text-white px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" /> Online
                    </span>
                  )}
                </div>

                {/* Bottom details Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h4 className="text-lg font-bold tracking-tight">{profile.name}</h4>
                    <span className="text-sm text-pink-200">({profile.age})</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 text-[10px] text-pink-100/95 font-medium mb-1.5">
                    <span>{profile.height}</span>
                    <span>•</span>
                    <span>{profile.religion} ({profile.caste})</span>
                    <span>•</span>
                    <span>{profile.motherTongue}</span>
                  </div>

                  <p className="text-[11px] text-gray-300/90 line-clamp-2 leading-relaxed">
                    {profile.about}
                  </p>
                </div>
              </div>

              {/* Action Bar (Material 3 Buttons) */}
              <div className="p-3.5 bg-white flex items-center justify-between border-t border-pink-50">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C2185B]" />
                  <span className="text-xs text-gray-500 font-medium">{profile.location}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectProfile(profile)}
                    className="px-3.5 py-1.5 text-xs font-bold text-[#880E4F] hover:bg-pink-50 rounded-full transition"
                  >
                    View Biodata
                  </button>
                  <button
                    onClick={() => onNavigate('match')}
                    className="px-4 py-1.5 bg-[#880E4F] text-white text-xs font-bold rounded-full shadow-xs hover:bg-[#AD1457] transition flex items-center gap-1"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" /> Connect
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* 6. SEARCH SCREEN WITH FILTERS */
export const SearchScreen: React.FC<{
  onSelectProfile: (profile: UserProfile) => void;
  profiles: UserProfile[];
}> = ({ onSelectProfile, profiles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [religionFilter, setReligionFilter] = useState('All');
  const [motherTongueFilter, setMotherTongueFilter] = useState('All');
  const [casteFilter, setCasteFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter logic
  const filteredProfiles = (profiles || []).filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          profile.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          profile.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesReligion = religionFilter === 'All' ? true : profile.religion === religionFilter;
    const matchesMotherTongue = motherTongueFilter === 'All' ? true : profile.motherTongue === motherTongueFilter;
    const matchesCaste = !casteFilter ? true : profile.caste.toLowerCase().includes(casteFilter.toLowerCase());

    return matchesSearch && matchesReligion && matchesMotherTongue && matchesCaste;
  });

  return (
    <div id="search-screen" className="flex flex-col h-full bg-[#FFF8FA] select-none">
      {/* Search Header Bar */}
      <div className="bg-white border-b border-pink-100 p-3.5 space-y-3 sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, location, job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-pink-50/50 border border-pink-100 rounded-full text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
            />
          </div>
          <button
            id="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`w-9.5 h-9.5 rounded-full border flex items-center justify-center transition ${showFilters ? 'bg-[#880E4F] text-white border-transparent' : 'bg-white border-pink-200 text-gray-700'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Expandable Advanced Filters Sheet */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-pink-50/40 p-3 rounded-2xl border border-pink-100/50 space-y-3"
            >
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Religion</label>
                  <select
                    value={religionFilter}
                    onChange={(e) => setReligionFilter(e.target.value)}
                    className="w-full p-2 bg-white border border-pink-100 rounded-xl text-xs"
                  >
                    <option value="All">All Religions</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Islam">Islam</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Christian">Christian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1">Mother Tongue</label>
                  <select
                    value={motherTongueFilter}
                    onChange={(e) => setMotherTongueFilter(e.target.value)}
                    className="w-full p-2 bg-white border border-pink-100 rounded-xl text-xs"
                  >
                    <option value="All">All Tongues</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">Caste / Sect Filter</label>
                <input
                  type="text"
                  placeholder="e.g. Brahmin, Sunni, Khan"
                  value={casteFilter}
                  onChange={(e) => setCasteFilter(e.target.value)}
                  className="w-full p-2 bg-white border border-pink-100 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-between items-center pt-1.5 border-t border-pink-100/50">
                <span className="text-[10px] text-gray-400">Filtering through 100+ profiles</span>
                <button
                  onClick={() => {
                    setReligionFilter('All');
                    setMotherTongueFilter('All');
                    setCasteFilter('');
                    setSearchQuery('');
                  }}
                  className="text-[10px] font-bold text-[#880E4F] hover:underline"
                >
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-gray-500">
            {filteredProfiles.length} {filteredProfiles.length === 1 ? 'Profile Match' : 'Profile Matches'} Found
          </span>
        </div>

        {filteredProfiles.length > 0 ? (
          <div className="space-y-3.5">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => onSelectProfile(profile)}
                className="bg-white border border-pink-100 rounded-2xl p-3.5 flex gap-3.5 cursor-pointer hover:border-pink-300 hover:shadow-xs transition"
              >
                {/* Micro avatar thumbnail */}
                <div className="relative w-20 h-20 rounded-xl bg-pink-50 shrink-0 overflow-hidden">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-1 right-1 bg-yellow-400 text-[8px] font-extrabold text-gray-900 px-1 rounded-sm">
                    {profile.matchScore}%
                  </div>
                </div>

                {/* Details text */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-gray-800 truncate">{profile.name}</h4>
                      {profile.verified && <CheckCircle className="w-3.5 h-3.5 text-green-500 fill-white" />}
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {profile.age} yrs • {profile.height} • {profile.religion}
                    </p>
                    <p className="text-[11px] text-gray-500 font-semibold truncate mt-1">
                      {profile.profession}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-pink-50/55">
                    <span className="text-[10px] text-gray-400 truncate max-w-[130px]">{profile.location}</span>
                    <span className="text-[10px] font-bold text-[#880E4F] flex items-center gap-0.5">
                      View full biodata <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-pink-100/50 flex items-center justify-center mb-4 border border-pink-100">
              <Filter className="w-8 h-8 text-pink-400" />
            </div>
            <h5 className="text-sm font-bold text-gray-700">No Matching Profiles</h5>
            <p className="text-xs text-gray-400 mt-1.5 max-w-[200px]">Try resetting your filters or adjusting your search phrase.</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* 9. MATCH SCREEN (Its a Match! Celebration) */
export const MatchScreen: React.FC<{
  onNavigate: (screen: ScreenId) => void;
  onSelectProfile: (profile: UserProfile) => void;
  profiles: UserProfile[];
}> = ({ onNavigate, onSelectProfile, profiles }) => {
  const matchProfile = (profiles && profiles.length > 0) ? profiles[0] : MOCK_PROFILES[0]; // Zoya Khan as matching celebration

  return (
    <div id="match-screen" className="flex flex-col h-full bg-linear-to-b from-[#880E4F] via-[#AD1457] to-[#880E4F] text-white justify-between p-6 select-none relative overflow-hidden">
      {/* Decorative Hearts behind */}
      <div className="absolute top-[30%] left-[-10%] w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[30%] right-[-10%] w-56 h-56 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header close */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/15 transition text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Alignment */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 shadow-md flex items-center gap-1"
        >
          <Sparkles className="w-4 h-4 fill-gray-900" /> Mutual Interest Accepted!
        </motion.div>

        <h2 className="text-3xl font-extrabold tracking-tight">It's a Perfect Match!</h2>
        <p className="text-xs text-pink-100/90 mt-2 max-w-xs leading-relaxed">
          Both you and Zoya Khan have accepted each other's connection interests.
        </p>

        {/* Dual Avatars Joining with glowing line */}
        <div className="flex items-center justify-center gap-6 my-10 relative">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80"
                alt="My Profile"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">YOU</span>
          </div>

          {/* Connected hearts animation center */}
          <div className="relative w-12 flex items-center justify-center">
            <div className="absolute w-24 border-t-2 border-dashed border-pink-300/60" />
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg relative z-1 border border-pink-200">
              <Heart className="w-5 h-5 text-[#880E4F] fill-[#880E4F] animate-pulse" />
            </div>
          </div>

          {/* Match Partner Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden shadow-lg">
              <img
                src={matchProfile.avatar}
                alt={matchProfile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">ZOYA</span>
          </div>
        </div>

        {/* Dynamic Commonalities Box */}
        <div className="bg-white/10 border border-white/15 p-4 rounded-2xl text-left space-y-2.5 w-full max-w-sm">
          <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest block font-mono">Core Compatibility Anchors</span>
          <div className="flex items-start gap-2 text-xs">
            <CheckCircle className="w-4 h-4 text-green-300 shrink-0 mt-0.5" />
            <p className="text-pink-100/90 leading-normal">Both families live in Delhi with deeply matching Moderate / Modern value structures.</p>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <CheckCircle className="w-4 h-4 text-green-300 shrink-0 mt-0.5" />
            <p className="text-pink-100/90 leading-normal">Highly aligned educational profile: Zoya holds a B.Tech and you hold an M.Tech.</p>
          </div>
        </div>
      </div>

      {/* Call to action footer buttons */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-3 pb-6">
        <button
          id="match-send-message-btn"
          onClick={() => onNavigate('chat')}
          className="w-full bg-white text-[#880E4F] font-bold py-3.5 px-6 rounded-full shadow-md hover:bg-pink-50 transition flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" /> Send Instant First Message
        </button>
        
        <button
          onClick={() => onSelectProfile(matchProfile)}
          className="w-full bg-transparent text-white border border-white/20 font-bold py-3 px-6 rounded-full hover:bg-white/10 transition"
        >
          Review Full Premium Biodata
        </button>
      </div>
    </div>
  );
};

/* 11. NOTIFICATIONS SCREEN */
interface NotificationsScreenProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onMarkAllRead,
  onNavigate
}) => {
  return (
    <div id="notifications-screen" className="flex flex-col h-full bg-[#FFF8FA] select-none">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 px-4 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-gray-700 hover:bg-pink-100 transition"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <h2 className="text-sm font-extrabold text-gray-800">Notifications</h2>
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-[10px] font-bold text-[#880E4F] hover:underline bg-pink-50 border border-pink-100 rounded-full px-3 py-1"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-2xl border transition flex gap-3 ${notif.read ? 'bg-white border-pink-100/50' : 'bg-pink-50/40 border-[#880E4F]/20 shadow-xs'}`}
            >
              {/* Avatar thumbnail */}
              {notif.avatar ? (
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-pink-100 border border-pink-200">
                  <img
                    src={notif.avatar}
                    alt="User"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#880E4F]/10 flex items-center justify-center shrink-0 border border-pink-200">
                  <Heart className="w-5 h-5 text-[#880E4F] fill-[#880E4F]" />
                </div>
              )}

              {/* Text / Actions info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-xs font-bold text-gray-800 leading-tight pr-2">{notif.title}</h4>
                  <span className="text-[9px] text-gray-400 shrink-0 font-medium">{notif.timestamp}</span>
                </div>
                
                <p className="text-xs text-gray-500 leading-normal">
                  {notif.description}
                </p>

                {/* Direct Action Buttons on requests */}
                {notif.type === 'like' && (
                  <div className="flex gap-2 mt-3 pt-2.5 border-t border-pink-100/50">
                    <button
                      onClick={() => onNavigate('match')}
                      className="px-3.5 py-1.5 bg-[#880E4F] text-white text-[10px] font-bold rounded-full shadow-xs hover:bg-[#AD1457] transition"
                    >
                      Accept Interest
                    </button>
                    <button
                      className="px-3 py-1.5 bg-white border border-pink-200 text-gray-600 text-[10px] font-bold rounded-full hover:bg-pink-50 transition"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-pink-100/40 flex items-center justify-center mb-3">
              <Bell className="w-8 h-8 text-pink-300" />
            </div>
            <h5 className="text-sm font-bold text-gray-700">All Caught Up</h5>
            <p className="text-xs text-gray-400 mt-1 max-w-[180px]">No new matrimonial notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
