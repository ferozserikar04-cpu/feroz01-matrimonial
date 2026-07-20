import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Capacitor } from '@capacitor/core';
import { 
  Heart, Smartphone, Sparkles, ShieldCheck, CheckSquare, Layers, 
  HelpCircle, Eye, EyeOff, Bell, UserCheck, RefreshCw, ChevronRight, Check
} from 'lucide-react';
import { ScreenId, UserProfile, AppNotification, PhotoItem, BiodataFile } from './types';
import { MOCK_PROFILES, MOCK_NOTIFICATIONS } from './data';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';

// Component Imports
import { AuthScreens } from './components/AuthScreens';
import { HomeScreen, SearchScreen, MatchScreen, NotificationsScreen } from './components/MainScreens';
import { DetailScreens, ReportUserDialog } from './components/DetailScreens';
import { ChatScreen, SettingsScreen, AdminDashboardScreen } from './components/CommunicationScreens';

export default function App() {
  // Navigation & State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [profiles, setProfiles] = useState<UserProfile[]>(MOCK_PROFILES);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>(MOCK_PROFILES[0]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [reportUserOpen, setReportUserOpen] = useState(false);
  
  // Custom Studio Simulation Controls
  const [globalBlurPhotos, setGlobalBlurPhotos] = useState(false);
  const [inAppToast, setInAppToast] = useState<{ title: string; desc: string } | null>(null);

  // Logged-in user's profile state representing Feroz Ahmad
  const [myProfile, setMyProfile] = useState<UserProfile>({
    id: 'user',
    name: 'Feroz Ahmad',
    gender: 'Male',
    age: 28,
    height: "5'11\"",
    religion: 'Islam',
    caste: 'Sunni',
    motherTongue: 'Hindi',
    profession: 'Tech Lead',
    income: '₹24,00,000 per annum',
    education: 'M.Tech Software Engineering',
    location: 'Delhi NCR, India',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80'
    ],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    verified: true,
    online: true,
    matchScore: 100,
    about: 'I am a highly educated and focused software engineer with deep interest in building secure applications. Living and working in Delhi NCR. Deeply passionate about photography, technology, and traveling.',
    familyType: 'Nuclear Family',
    familyValues: 'Moderate / Modern',
    fatherOccupation: 'Retired Government Officer',
    motherOccupation: 'Educator',
    siblings: '1 Younger sister (working in banking)',
    interests: ['Photography', 'Tech', 'Travel'],
    partnerExpectations: {
      ageRange: '23 - 27 years',
      heightRange: "5'2\" - 5'7\"",
      religion: 'Islam',
      education: 'Graduate / Postgraduate',
      incomeRange: 'Any'
    },
    photoItems: [
      {
        id: 'user-p1',
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
        isPrimary: true,
        zoom: 1,
        rotation: 0,
        xOffset: 0,
        yOffset: 0
      }
    ],
    biodataFile: null
  });

  // Real-time Firebase Synchronization
  useEffect(() => {
    // 1. Listen to Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'profiles', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setMyProfile(userDoc.data() as UserProfile);
          } else {
            const newBasicProfile: UserProfile = {
              id: user.uid,
              name: user.displayName || 'Matrimonial Candidate',
              gender: 'Female',
              age: 25,
              height: "5'5\"",
              religion: 'Hindu',
              caste: 'General',
              motherTongue: 'Hindi',
              profession: 'Professional',
              income: 'Under ₹5 Lakhs',
              education: 'Graduate',
              location: 'Delhi NCR, India',
              photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'],
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
              verified: true,
              online: true,
              matchScore: 92,
              about: 'Welcome! I am looking for a suitable partner with similar values.',
              familyType: 'Nuclear Family',
              familyValues: 'Moderate',
              fatherOccupation: 'Retired',
              motherOccupation: 'Home Maker',
              siblings: '1 sibling',
              interests: ['Travel', 'Music'],
              partnerExpectations: {
                ageRange: '25-30',
                heightRange: "5'6\" - 6'0\"",
                religion: 'Hindu',
                education: 'Graduate',
                incomeRange: 'Any'
              }
            };
            await setDoc(userDocRef, newBasicProfile);
            setMyProfile(newBasicProfile);
          }
          setIsLoggedIn(true);
          // Only auto-redirect to home from entry screens
          setCurrentScreen(prev => {
            if (prev === 'welcome' || prev === 'login' || prev === 'register' || prev === 'splash') {
              return 'home';
            }
            return prev;
          });
        } catch (err) {
          console.error('Error fetching/setting authenticated user profile:', err);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentScreen(prev => {
          if (prev !== 'login' && prev !== 'register' && prev !== 'splash') {
            return 'welcome';
          }
          return prev;
        });
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // 2. Listen to Profiles only when authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      setLoadingProfiles(false);
      return;
    }

    setLoadingProfiles(true);
    const unsubscribeProfiles = onSnapshot(collection(db, 'profiles'), async (snapshot) => {
      if (snapshot.empty) {
        console.log('Firestore profiles collection is empty. Seeding database with premium mock profiles...');
        try {
          for (const p of MOCK_PROFILES) {
            await setDoc(doc(db, 'profiles', p.id), p);
          }
        } catch (err) {
          console.error('Error seeding profiles:', err);
        }
      } else {
        const fetched: UserProfile[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push(docSnap.data() as UserProfile);
        });
        setProfiles(fetched);
        setLoadingProfiles(false);
      }
    }, (error) => {
      console.error('Profiles listener subscription error (safe fallback in place):', error);
      setLoadingProfiles(false);
    });

    return () => {
      unsubscribeProfiles();
    };
  }, [isLoggedIn]);

  // Auto-scroll or sync login states on specific navigations
  const handleLoginSuccess = (registeredProfile?: Partial<UserProfile>) => {
    if (registeredProfile) {
      setMyProfile(prev => ({
        ...prev,
        ...registeredProfile,
        // sync string values
        photos: registeredProfile.photoItems && registeredProfile.photoItems.length > 0
          ? registeredProfile.photoItems.map(p => p.url)
          : prev.photos,
        avatar: registeredProfile.photoItems && registeredProfile.photoItems.length > 0
          ? (registeredProfile.photoItems.find(p => p.isPrimary)?.url || registeredProfile.photoItems[0].url)
          : prev.avatar
      } as UserProfile));
    }
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
    setIsLoggedIn(false);
    setCurrentScreen('welcome');
  };

  const handleSelectProfile = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setCurrentScreen('profile');
  };

  // Toast dynamic notification triggers
  const triggerMatchNotification = () => {
    const newNotif: AppNotification = {
      id: `n-new-${Date.now()}`,
      type: 'match',
      title: 'Mutual Match Celebrated!',
      description: 'Zoya Khan accepted your request. Chat with her instantly!',
      timestamp: 'Just now',
      read: false,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80'
    };

    setNotifications(prev => [newNotif, ...prev]);
    setInAppToast({
      title: '💖 Compatibility Match Confirmed!',
      desc: 'Zoya Khan accepted your interest request.'
    });

    setTimeout(() => {
      setInAppToast(null);
    }, 4000);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Bottom Navigation tabs handler
  const renderBottomNav = () => {
    const mainBottomTabs: ScreenId[] = ['home', 'search', 'chat', 'settings'];
    if (!isLoggedIn || !mainBottomTabs.includes(currentScreen)) return null;

    return (
      <div className="bg-white border-t border-pink-100 h-16 shrink-0 flex items-center justify-around px-2 pb-1.5 shadow-md relative z-10">
        {[
          { id: 'home' as ScreenId, label: 'Matches', icon: Heart },
          { id: 'search' as ScreenId, label: 'Search', icon: Layers },
          { id: 'chat' as ScreenId, label: 'Safe Chats', icon: Smartphone, badgeCount: 2 },
          { id: 'settings' as ScreenId, label: 'Profile', icon: UserCheck }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = currentScreen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentScreen(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative transition duration-200"
            >
              <div className="relative flex items-center justify-center">
                <IconComp className={`w-5.5 h-5.5 transition ${isActive ? 'text-[#880E4F] fill-[#880E4F]/10 scale-110' : 'text-gray-400'}`} />
                {tab.badgeCount && tab.badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C2185B] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {tab.badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold mt-1 tracking-tight ${isActive ? 'text-[#880E4F]' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  // Direct active view dispatcher inside the phone mockup container
  const renderPhoneView = () => {
    switch (currentScreen) {
      case 'splash':
      case 'welcome':
      case 'login':
      case 'register':
        return (
          <AuthScreens 
            key={currentScreen}
            currentScreen={currentScreen} 
            onNavigate={setCurrentScreen} 
            onLoginSuccess={handleLoginSuccess} 
          />
        );
      case 'home':
        return (
          <HomeScreen 
            onNavigate={setCurrentScreen} 
            onSelectProfile={handleSelectProfile}
            notificationsCount={notifications.filter(n => !n.read).length}
            profiles={profiles}
          />
        );
      case 'search':
        return (
          <SearchScreen 
            onSelectProfile={handleSelectProfile} 
            profiles={profiles}
          />
        );
      case 'profile':
      case 'biodata':
        return (
          <DetailScreens
            profile={selectedProfile}
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            onOpenReport={() => setReportUserOpen(true)}
          />
        );
      case 'match':
        return (
          <MatchScreen 
            onNavigate={setCurrentScreen} 
            onSelectProfile={handleSelectProfile} 
            profiles={profiles}
          />
        );
      case 'chat':
        return (
          <ChatScreen 
            onNavigate={setCurrentScreen} 
            onSelectProfile={handleSelectProfile} 
            profiles={profiles}
          />
        );
      case 'notifications':
        return (
          <NotificationsScreen 
            notifications={notifications} 
            onMarkAllRead={handleMarkAllNotificationsRead} 
            onNavigate={setCurrentScreen} 
          />
        );
      case 'settings':
        return (
          <SettingsScreen 
            onNavigate={setCurrentScreen} 
            onLogout={handleLogout} 
            myProfile={myProfile}
            onUpdateProfile={setMyProfile}
          />
        );
      case 'admin':
        return (
          <AdminDashboardScreen 
            onNavigate={setCurrentScreen} 
          />
        );
      default:
        return null;
    }
  };

  // Screen-list item definitions for side panel checklist
  const SCREENS_CHECKLIST: { id: ScreenId; label: string; desc: string; category: string }[] = [
    { id: 'splash', label: '1. Splash Screen', desc: 'Center gold rings, infinite heartbeat & get-started trigger', category: 'Authentication' },
    { id: 'welcome', label: '2. Welcome Screen', desc: 'Secure value propositions, verified profile claims, log in/sign up buttons', category: 'Authentication' },
    { id: 'login', label: '3. Login Screen', desc: 'OTP bypass code verification, email/phone verification toggles', category: 'Authentication' },
    { id: 'register', label: '4. Registration (Multi-step)', desc: 'Education, career, community details, government ID selfie upload', category: 'Authentication' },
    { id: 'home', label: '5. Home Screen', desc: 'Daily hand-picked recommendations, verified check badges, online status', category: 'Core App' },
    { id: 'search', label: '6. Search with Filters', desc: 'Advanced search filters (religion, caste, mother tongue), instant result lists', category: 'Core App' },
    { id: 'profile', label: '7. Profile Screen', desc: 'Full profile cards, dynamic photo swiper, matching compatibility metrics', category: 'Candidate Details' },
    { id: 'biodata', label: '8. Biodata Viewer', desc: 'Classical printable South Asian PDF layout, complete family gotra details', category: 'Candidate Details' },
    { id: 'match', label: '9. Match Screen', desc: 'Celebratory mutual acceptor state showing connection anchors', category: 'Core App' },
    { id: 'chat', label: '10. Chat', desc: 'Interactive chat bar, parenting contact shortcuts, quick icebreaker chips', category: 'Communication' },
    { id: 'notifications', label: '11. Notifications', desc: 'Mutual like request approvals, verified badges logs, read triggers', category: 'Communication' },
    { id: 'settings', label: '12. Settings', desc: 'Photo visibility blurring shields, match settings preferences, logs out', category: 'Core App' },
    { id: 'report', label: '13. Report User', desc: 'Government compliance block and anonymous safety audit details', category: 'Candidate Details' },
    { id: 'admin', label: '14. Admin Panel Dashboard', desc: 'Operator queue matching metrics, weekly trends chart, ID approval card actions', category: 'Administration' }
  ];

  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    return (
      <div id="matrimonial-app-native-root" className={`min-h-screen w-full flex flex-col bg-white overflow-hidden relative ${globalBlurPhotos ? 'blur-protection-active' : ''}`}>
        {/* Style tag for photo blur */}
        <style>{`
          .blur-protection-active img {
            filter: blur(8px) grayscale(40%) !important;
            transition: filter 0.3s ease;
          }
          .blur-protection-active img:hover {
            filter: none !important;
          }
        `}</style>

        {/* In-app real-time Slide-in Toast Banner Notification overlay */}
        <AnimatePresence>
          {inAppToast && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 border border-pink-200 py-3 px-4.5 rounded-2xl shadow-2xl flex items-start gap-3 w-80 z-50 pointer-events-auto"
            >
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                <Heart className="w-4.5 h-4.5 text-[#880E4F] fill-[#880E4F]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-gray-900 leading-tight">{inAppToast.title}</h5>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">{inAppToast.desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active View */}
        <div className="flex-1 overflow-hidden relative">
          {renderPhoneView()}
        </div>

        {/* Navigation */}
        {renderBottomNav()}

        {/* Safety Compliance Report user Dialog overlays */}
        <AnimatePresence>
          {reportUserOpen && (
            <ReportUserDialog
              profile={selectedProfile}
              isOpen={reportUserOpen}
              onClose={() => setReportUserOpen(false)}
              onSubmitReport={() => {
                setReportUserOpen(false);
                setInAppToast({
                  title: 'Shield Protection Active',
                  desc: 'Safety Report successfully logged. Our safety auditors will inspect this profile immediately.'
                });
                setTimeout(() => setInAppToast(null), 4000);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div id="matrimonial-studio-workspace" className="min-h-screen bg-linear-to-br from-gray-900 via-slate-900 to-gray-950 font-sans text-gray-100 flex flex-col lg:flex-row relative overflow-hidden select-none">
      
      {/* Decorative ambient backdrop */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#880E4F]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT COLUMN: DESIGN STUDIO WORKSPACE CONTROL & REVIEW GUIDE */}
      <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between max-w-2xl border-b lg:border-b-0 lg:border-r border-gray-800/60 z-10 overflow-y-auto max-h-screen">
        <div className="space-y-6">
          {/* Header Branding */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-[#880E4F] to-[#AD1457] flex items-center justify-center shadow-lg border border-pink-500/20">
              <Heart className="w-5.5 h-5.5 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-pink-500/10 text-pink-400 px-2 py-0.5 rounded-md border border-pink-500/20">
                  UX Review Studio
                </span>
                <span className="text-[10px] font-semibold text-gray-400">v1.0.0</span>
              </div>
              <h1 className="text-xl font-black text-white tracking-tight">Feroz 01 Matrimonial</h1>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Welcome to the Feroz 01 premium matrimonial design playground. All 14 screens are fully interactive, designed with complete Material 3 principles. Click on any screen below to instantly render it inside the phone mockup, or navigate naturally within the mockup.
          </p>

          {/* Interactive Simulation Panel */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="text-yellow-400 w-4 h-4 fill-yellow-400" /> Interactive Simulation Panel
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                id="btn-trigger-notif"
                onClick={triggerMatchNotification}
                className="bg-[#880E4F]/20 hover:bg-[#880E4F]/30 border border-[#880E4F]/30 text-pink-300 text-[11px] font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5 text-pink-400" /> Simulate Mutual Match Notif
              </button>

              <button
                id="btn-toggle-blur"
                onClick={() => setGlobalBlurPhotos(!globalBlurPhotos)}
                className={`text-[11px] font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 border ${
                  globalBlurPhotos 
                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' 
                    : 'bg-slate-700/30 border-slate-700/50 text-gray-300 hover:bg-slate-700/50'
                }`}
              >
                {globalBlurPhotos ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-amber-400" /> Blur Privacy Shield (Active)
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-gray-400" /> Blur Privacy Shield (Inactive)
                  </>
                )}
              </button>

              <button
                id="btn-force-match"
                onClick={() => {
                  setIsLoggedIn(true);
                  setCurrentScreen('match');
                }}
                className="bg-purple-900/20 hover:bg-purple-900/30 border border-purple-900/30 text-purple-300 text-[11px] font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400" /> Force Match Celebration View
              </button>

              <button
                id="btn-reset-studio"
                onClick={() => {
                  handleLogout();
                  setCurrentScreen('splash');
                }}
                className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/50 text-gray-300 text-[11px] font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-400" /> Reset Studio State
              </button>
            </div>
          </div>

          {/* Checklist Screen Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <CheckSquare className="w-4.5 h-4.5 text-pink-500" /> Approved Screens Checklist
              </h3>
              <span className="text-[10px] text-pink-400 font-bold font-mono">14 / 14 Designed</span>
            </div>

            <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
              {SCREENS_CHECKLIST.map((screen) => {
                const isActive = currentScreen === screen.id;
                return (
                  <div
                    key={screen.id}
                    id={`screen-selector-${screen.id}`}
                    onClick={() => {
                      if (['home', 'search', 'profile', 'biodata', 'match', 'chat', 'notifications', 'settings', 'admin'].includes(screen.id)) {
                        setIsLoggedIn(true);
                      }
                      if (screen.id === 'report') {
                        setIsLoggedIn(true);
                        setSelectedProfile(MOCK_PROFILES[0]);
                        setCurrentScreen('profile');
                        setReportUserOpen(true);
                        return;
                      }
                      setCurrentScreen(screen.id);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition duration-200 ${
                      isActive 
                        ? 'bg-linear-to-r from-[#880E4F]/20 to-[#AD1457]/20 border-pink-500 text-white shadow-xs' 
                        : 'bg-slate-800/30 border-gray-800/60 hover:bg-slate-800/50 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-[#880E4F] text-white' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block">{screen.label}</span>
                        <span className="text-[10px] text-gray-400 block truncate">{screen.desc}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-800/60 text-[11px] text-gray-500 flex justify-between items-center">
          <span>Developed with Material 3 Principles</span>
          <span className="font-mono text-pink-400/80">Premium Quality</span>
        </div>
      </div>

      {/* RIGHT COLUMN: HIGH-FIDELITY ANDROID PHONE MOCKUP SHELL */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative min-h-[850px] lg:min-h-0 bg-linear-to-b from-slate-900 via-[#120B10] to-slate-950">
        
        {/* In-app real-time Slide-in Toast Banner Notification overlay */}
        <AnimatePresence>
          {inAppToast && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 border border-pink-200 py-3 px-4.5 rounded-2xl shadow-2xl flex items-start gap-3 w-80 z-50 pointer-events-auto"
            >
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                <Heart className="w-4.5 h-4.5 text-[#880E4F] fill-[#880E4F]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-gray-900 leading-tight">{inAppToast.title}</h5>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-normal">{inAppToast.desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Mobile Shield blur filter overlay helper wrapper */}
        <style>{`
          .blur-protection-active img {
            filter: blur(8px) grayscale(40%) !important;
            transition: filter 0.3s ease;
          }
          .blur-protection-active img:hover {
            filter: none !important;
          }
        `}</style>

        {/* PHONE MOCKUP CONTAINER */}
        <div className="relative">
          {/* Subtle Outer Glow Shadow ring */}
          <div className="absolute inset-0 bg-[#880E4F]/5 rounded-[50px] blur-2xl -z-1" />

          {/* Physical Phone Case Rim/Bezel */}
          <div className="w-[375px] h-[780px] bg-[#12131A] rounded-[52px] p-3.5 border-4 border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden relative select-none">
            
            {/* Top Ear Speaker & Camera notch bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7.5 w-40 bg-[#12131A] rounded-b-2xl z-40 flex items-center justify-center gap-1.5">
              <div className="w-12 h-1 bg-slate-800 rounded-full" /> {/* Speaker */}
              <div className="w-3.5 h-3.5 bg-slate-900 rounded-full border border-slate-800" /> {/* Punch Camera */}
            </div>

            {/* In-app view Frame area */}
            <div className={`flex-1 flex flex-col bg-white rounded-[38px] overflow-hidden relative border border-gray-200/40 ${globalBlurPhotos ? 'blur-protection-active' : ''}`}>
              
              {/* Android top System status bar */}
              <div className="h-7.5 shrink-0 bg-white border-b border-gray-50 flex items-center justify-between px-6 text-gray-600 font-sans font-bold text-[10px] select-none relative z-10">
                <span>10:30 AM</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <span>5G</span>
                  <span>98%</span>
                </div>
              </div>

              {/* ACTIVE APPMOBILE COMPONENT */}
              <div className="flex-1 overflow-hidden relative">
                {renderPhoneView()}
              </div>

              {/* Bottom active Navigation bar */}
              {renderBottomNav()}

              {/* Android System Home swipe indicator bar */}
              <div className="h-5.5 bg-white shrink-0 flex items-center justify-center select-none relative z-10 pb-1.5">
                <div className="w-28 h-1 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Compliance Report user Dialog overlays */}
      <AnimatePresence>
        {reportUserOpen && (
          <ReportUserDialog
            profile={selectedProfile}
            isOpen={reportUserOpen}
            onClose={() => setReportUserOpen(false)}
            onSubmitReport={() => {
              setReportUserOpen(false);
              setInAppToast({
                title: 'Shield Protection Active',
                desc: 'Safety Report successfully logged. Our safety auditors will inspect this profile immediately.'
              });
              setTimeout(() => setInAppToast(null), 4000);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

