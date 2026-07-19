import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Mail, Phone, ArrowRight, ArrowLeft, Check, User, MapPin, Briefcase, GraduationCap, Calendar, DollarSign, Sparkles, Upload, ShieldCheck, Lock, Smartphone } from 'lucide-react';
import { ScreenId, RegistrationState } from '../types';
import { UploadModule } from './UploadModule';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthScreensProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onLoginSuccess: (registeredProfile?: any) => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  currentScreen,
  onNavigate,
  onLoginSuccess,
}) => {
  // Login State
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Registration State
  const [regStep, setRegStep] = useState(1);
  const [regError, setRegError] = useState('');
  const [regData, setRegData] = useState<RegistrationState>({
    gender: 'Female',
    religion: 'Hindu',
    motherTongue: 'Hindi',
    photos: [],
    biodataFile: null
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput) {
      setLoginError('Please enter your details');
      return;
    }
    setLoginError('');

    if (loginMethod === 'email') {
      if (!loginPassword) {
        setLoginError('Please enter your password');
        return;
      }
      setIsLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, loginInput, loginPassword);
        const userDoc = await getDoc(doc(db, 'profiles', userCredential.user.uid));
        if (userDoc.exists()) {
          onLoginSuccess(userDoc.data());
        } else {
          onLoginSuccess({
            id: userCredential.user.uid,
            name: userCredential.user.displayName || 'Candidate User',
            email: userCredential.user.email
          });
        }
      } catch (err: any) {
        let msg = err.message || 'Authentication failed';
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          msg = 'Invalid email or password. Please try again.';
        }
        setLoginError(msg);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Real Phone OTP Flow
      setIsLoading(true);
      try {
        let phoneNumber = loginInput.trim();
        // Format to E.164 if it is a 10-digit number
        if (!phoneNumber.startsWith('+')) {
          const digits = phoneNumber.replace(/\D/g, '');
          if (digits.length === 10) {
            phoneNumber = `+91${digits}`;
          } else if (digits.length > 10) {
            phoneNumber = `+${digits}`;
          } else {
            throw new Error('Please enter phone number starting with country code, e.g. +91 98765 43210');
          }
        }

        // Initialize RecaptchaVerifier
        if (!(window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              // reCAPTCHA solved
            },
            'expired-callback': () => {
              setLoginError('reCAPTCHA expired. Please try again.');
            }
          });
        }

        const appVerifier = (window as any).recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        (window as any).confirmationResult = confirmationResult;
        setOtpSent(true);
      } catch (err: any) {
        setLoginError('Failed to send OTP: ' + (err.message || err));
        if ((window as any).recaptchaVerifier) {
          try {
            (window as any).recaptchaVerifier.clear();
            delete (window as any).recaptchaVerifier;
          } catch (e) {}
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setLoginError('Please enter a valid 6-digit verification code');
      return;
    }
    setLoginError('');
    setIsLoading(true);
    try {
      const confirmationResult = (window as any).confirmationResult;
      if (!confirmationResult) {
        throw new Error('No active verification session found. Please request OTP again.');
      }

      const userCredential = await confirmationResult.confirm(otpCode);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, 'profiles', uid));
      
      if (userDoc.exists()) {
        onLoginSuccess(userDoc.data());
      } else {
        const fallbackProfile = {
          id: uid,
          name: 'Phone User',
          phone: userCredential.user.phoneNumber,
          gender: 'Female' as const,
          age: 26,
          height: "5'4\"",
          religion: 'Hindu',
          caste: 'General',
          motherTongue: 'Hindi',
          profession: 'Consultant',
          income: '₹8,00,000 per annum',
          education: 'Graduate',
          location: 'Delhi NCR, India',
          photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'],
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          verified: true,
          online: true,
          matchScore: 88,
          about: 'Registered via verified Mobile OTP. Enthusiastic, family-oriented, and progressive.',
          familyType: 'Nuclear Family',
          familyValues: 'Moderate',
          fatherOccupation: 'Retired',
          motherOccupation: 'Home Maker',
          siblings: '1 sibling',
          interests: ['Music', 'Travel'],
          partnerExpectations: {
            ageRange: '25-30',
            heightRange: "5'7\" - 6'0\"",
            religion: 'Hindu',
            education: 'Graduate',
            incomeRange: 'Any'
          }
        };
        await setDoc(doc(db, 'profiles', uid), fallbackProfile);
        onLoginSuccess(fallbackProfile);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Verification failed. Please check your OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoginError('');
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, 'demo@feroz01.com', 'Password123');
      const userDoc = await getDoc(doc(db, 'profiles', userCredential.user.uid));
      if (userDoc.exists()) {
        onLoginSuccess(userDoc.data());
      } else {
        onLoginSuccess({ id: userCredential.user.uid, name: 'Feroz Ahmad' });
      }
    } catch (err: any) {
      // If user doesn't exist, register them dynamically
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, 'demo@feroz01.com', 'Password123');
        const demoProfile = {
          id: userCredential.user.uid,
          name: 'Feroz Ahmad',
          gender: 'Male' as const,
          age: 28,
          height: "5'11\"",
          religion: 'Islam',
          caste: 'Sunni',
          motherTongue: 'Hindi',
          profession: 'Tech Lead',
          income: '₹24,00,000 per annum',
          education: 'M.Tech Software Engineering',
          location: 'Delhi NCR, India',
          photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80'],
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
          }
        };
        await setDoc(doc(db, 'profiles', userCredential.user.uid), demoProfile);
        onLoginSuccess(demoProfile);
      } catch (innerErr: any) {
        setLoginError(innerErr.message || 'Demo guest login failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextRegStep = async () => {
    setRegError('');
    if (regStep < 4) {
      if (regStep === 1) {
        if (!regData.fullName?.trim()) {
          setRegError('Please enter your full name');
          return;
        }
        if (!regData.email?.trim()) {
          setRegError('Please enter your email address');
          return;
        }
        if (!regData.password || regData.password.length < 6) {
          setRegError('Password must be at least 6 characters');
          return;
        }
        if (!regData.phone?.trim()) {
          setRegError('Please enter your mobile number');
          return;
        }
      }
      setRegStep(prev => prev + 1);
    } else {
      setIsLoading(true);
      try {
        const email = regData.email || `${Date.now()}@feroz01.com`;
        const password = regData.password || 'Password123';
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        await updateProfile(userCredential.user, {
          displayName: regData.fullName || 'Candidate'
        });

        const createdProfile = {
          id: userCredential.user.uid,
          name: regData.fullName || 'New Candidate',
          gender: regData.gender || 'Female',
          religion: regData.religion || 'Hindu',
          caste: regData.caste || '',
          motherTongue: regData.motherTongue || 'Hindi',
          location: regData.location || 'Delhi NCR, India',
          education: regData.education || 'Graduate',
          profession: regData.profession || 'Professional',
          income: regData.income || '₹10,00,000 per annum',
          about: regData.aboutSelf || 'Hello, I have recently registered on Feroz 01 Matrimonial. I am looking for a suitable partner.',
          photos: (regData.photos && regData.photos.length > 0)
            ? regData.photos.map(p => p.url)
            : ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'],
          avatar: (regData.photos && regData.photos.length > 0)
            ? (regData.photos.find(p => p.isPrimary)?.url || regData.photos[0].url)
            : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          verified: true,
          online: true,
          matchScore: Math.floor(Math.random() * 25) + 75,
          familyType: 'Nuclear Family',
          familyValues: 'Moderate / Modern',
          fatherOccupation: 'Retired',
          motherOccupation: 'Home Maker',
          siblings: '1 sibling',
          interests: ['Reading', 'Travel', 'Music'],
          partnerExpectations: {
            ageRange: '23 - 29 years',
            heightRange: "5'2\" - 5'11\"",
            religion: regData.religion || 'Hindu',
            education: 'Graduate',
            incomeRange: 'Any'
          }
        };

        await setDoc(doc(db, 'profiles', userCredential.user.uid), createdProfile);
        onLoginSuccess(createdProfile);
      } catch (err: any) {
        let msg = err.message || 'Registration failed';
        if (err.code === 'auth/email-already-in-use') {
          msg = 'The email address is already in use by another account.';
        }
        setRegError(msg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevRegStep = () => {
    setRegError('');
    if (regStep > 1) {
      setRegStep(prev => prev - 1);
    } else {
      onNavigate('welcome');
    }
  };

  // 1. SPLASH SCREEN
  if (currentScreen === 'splash') {
    return (
      <div id="splash-screen" className="flex flex-col items-center justify-between h-full bg-linear-to-b from-[#880E4F] via-[#AD1457] to-[#880E4F] text-white p-6 select-none relative overflow-hidden">
        {/* Decorative Floating Circles */}
        <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#C2185B]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Brand Ring Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative mb-6 flex items-center justify-center"
          >
            <div className="w-28 h-28 rounded-full border-2 border-pink-300/30 flex items-center justify-center animate-pulse" />
            <div className="absolute w-24 h-24 rounded-full border-4 border-[#F8BBD0] flex items-center justify-center shadow-lg bg-white/5">
              <Heart className="w-12 h-12 text-[#FFD54F] fill-[#FFD54F]" />
            </div>
            {/* Tiny Sparkles around */}
            <Sparkles className="absolute top-2 right-2 w-6 h-6 text-yellow-300 animate-bounce" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-pink-100 to-yellow-100 font-sans"
          >
            Feroz 01
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.6 }}
            className="text-xs tracking-widest text-[#F8BBD0] mt-2 uppercase font-mono"
          >
            Matrimonial Elite
          </motion.p>
        </div>

        <div className="w-full max-w-xs flex flex-col items-center gap-6 pb-12">
          {/* Soft loading progress bar */}
          <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
              className="bg-linear-to-r from-[#FFD54F] to-[#F8BBD0] h-full rounded-full"
            />
          </div>

          <motion.button
            id="splash-get-started"
            onClick={() => onNavigate('welcome')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-[#880E4F] font-semibold py-3.5 px-6 rounded-full shadow-lg flex items-center justify-center gap-2 transition hover:bg-pink-50"
          >
            Get Started
            <ArrowRight className="w-5 h-5 text-[#880E4F]" />
          </motion.button>
        </div>
      </div>
    );
  }

  // 2. WELCOME SCREEN
  if (currentScreen === 'welcome') {
    return (
      <div id="welcome-screen" className="flex flex-col h-full bg-[#FFF8FA] p-6 justify-between select-none relative overflow-hidden">
        {/* Accent background element */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-linear-to-b from-pink-100/60 to-transparent pointer-events-none" />

        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          {/* Heart Emblem */}
          <div className="w-16 h-16 rounded-3xl bg-pink-100 flex items-center justify-center mb-6 shadow-xs border border-pink-200">
            <Heart className="w-8 h-8 text-[#C2185B]" />
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
            Find Your <span className="text-[#880E4F]">Soulmate</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-xs">
            Where hearts align. Discover premium, verified profiles tailored precisely to your background and family values.
          </p>

          {/* Quick value props */}
          <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-sm">
            <div className="bg-white border border-pink-100 p-3.5 rounded-2xl flex flex-col items-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-[#C2185B] mb-1" />
              <span className="text-xs font-semibold text-gray-800">100% Verified</span>
              <span className="text-[10px] text-gray-400">Govt ID & Photo</span>
            </div>
            <div className="bg-white border border-pink-100 p-3.5 rounded-2xl flex flex-col items-center shadow-xs">
              <Sparkles className="w-6 h-6 text-yellow-600 mb-1" />
              <span className="text-xs font-semibold text-gray-800">Smart Match</span>
              <span className="text-[10px] text-gray-400">90%+ Compatibility</span>
            </div>
          </div>
        </div>

        {/* Buttons section */}
        <div className="w-full max-w-sm mx-auto flex flex-col gap-3 pb-6">
          <button
            id="welcome-login-btn"
            onClick={() => onNavigate('login')}
            className="w-full bg-[#880E4F] text-white font-semibold py-3.5 px-6 rounded-full shadow-md flex items-center justify-center gap-2 hover:bg-[#AD1457] transition"
          >
            Log In to Account
          </button>
          <button
            id="welcome-register-btn"
            onClick={() => onNavigate('register')}
            className="w-full bg-white text-[#880E4F] font-semibold py-3.5 px-6 rounded-full border border-pink-200 shadow-xs flex items-center justify-center gap-2 hover:bg-pink-50/50 transition"
          >
            Register New Profile
          </button>

          <span className="text-[11px] text-gray-400 text-center mt-3 leading-tight block px-4">
            By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
          </span>

          <div className="mt-4 flex flex-col items-center justify-center gap-2 border-t border-pink-100 pt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Testing on a real phone?</span>
            <a
              href="/feroz01-matrimonial.apk"
              download="feroz01-matrimonial.apk"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-5 rounded-full shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Smartphone className="w-4 h-4 text-emerald-100 animate-bounce" />
              Download Signed Release APK
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. LOGIN SCREEN
  if (currentScreen === 'login') {
    return (
      <div id="login-screen" className="flex flex-col h-full bg-[#FFF8FA] p-6 justify-between select-none">
        {/* Header Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => onNavigate('welcome')}
            className="w-10 h-10 rounded-full bg-white border border-pink-100 flex items-center justify-center shadow-xs text-gray-600 hover:bg-pink-50 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-[#880E4F] uppercase tracking-wider font-mono">Feroz 01 Safe Connect</span>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Welcome Back</h3>
            <p className="text-sm text-gray-500 mt-1">Access verified matrimonial profiles instantly.</p>
          </div>

          {/* Toggle Phone/Email Login */}
          <div className="bg-pink-100/50 p-1.5 rounded-full flex gap-1 mb-5">
            <button
              onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition ${loginMethod === 'phone' ? 'bg-[#880E4F] text-white shadow-xs' : 'text-[#880E4F]'}`}
            >
              Phone Number
            </button>
            <button
              onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
              className={`flex-1 py-2 rounded-full text-xs font-bold transition ${loginMethod === 'email' ? 'bg-[#880E4F] text-white shadow-xs' : 'text-[#880E4F]'}`}
            >
              Email Address
            </button>
          </div>

          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            <div id="recaptcha-container"></div>
            {!otpSent ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    {loginMethod === 'phone' ? 'Enter Phone Number' : 'Enter Registered Email'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      {loginMethod === 'phone' ? <Phone className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                    </div>
                    <input
                      type={loginMethod === 'phone' ? 'tel' : 'email'}
                      placeholder={loginMethod === 'phone' ? '+91 98765 43210' : 'name@example.com'}
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-pink-100 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#880E4F]/30 focus:border-[#880E4F] text-gray-800 shadow-xs"
                    />
                  </div>
                </div>

                {loginMethod === 'email' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Enter Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-pink-100 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#880E4F]/30 focus:border-[#880E4F] text-gray-800 shadow-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-pink-50 border border-pink-100 p-3 rounded-xl text-center text-xs text-[#880E4F] font-medium flex items-center justify-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  We sent a 6-digit security code to your contact
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-widest text-lg font-bold py-3 bg-white border border-pink-100 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#880E4F]/30 focus:border-[#880E4F] text-gray-800 shadow-xs"
                  />
                </div>
              </motion.div>
            )}

            {loginError && (
              <p className="text-xs text-red-600 font-semibold mt-1">{loginError}</p>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#880E4F] text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-[#AD1457] transition flex items-center justify-center gap-2 disabled:bg-pink-300"
            >
              {isLoading ? 'Processing...' : (otpSent ? 'Verify & Continue' : (loginMethod === 'email' ? 'Login Securely' : 'Get Verification Code'))}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Bypass Banner */}
          <div className="mt-8 bg-amber-50 border border-amber-200/50 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Fast Demo Bypass
            </span>
            <p className="text-xs text-amber-700/80 mb-3">Skip verification steps to inspect all matrimonial views instantly.</p>
            <button
              id="login-demo-btn"
              onClick={handleDemoLogin}
              className="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-full text-xs shadow-xs hover:bg-amber-700 transition"
            >
              One-Click Guest Login
            </button>
          </div>
        </div>

        <div className="text-center pb-4">
          <span className="text-xs text-gray-500">
            Don't have an account?{' '}
            <span onClick={() => onNavigate('register')} className="text-[#880E4F] font-bold underline cursor-pointer hover:text-[#AD1457]">
              Register Free
            </span>
          </span>
        </div>
      </div>
    );
  }

  // 4. REGISTRATION SCREEN (Multi-step)
  if (currentScreen === 'register') {
    return (
      <div id="registration-screen" className="flex flex-col h-full bg-[#FFF8FA] justify-between select-none relative">
        {/* Navigation / Progress Header */}
        <div className="p-4 border-b border-pink-100 bg-white">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handlePrevRegStep}
              className="w-9 h-9 rounded-full bg-pink-50/50 flex items-center justify-center border border-pink-100/50 text-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-gray-800">Create Matrimonial Profile</span>
            <span className="text-xs font-semibold text-gray-400">Step {regStep} of 4</span>
          </div>

          {/* Multi-step indicator bar */}
          <div className="flex gap-1.5 h-1.5 w-full mt-3">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 rounded-full transition-all duration-300 ${step <= regStep ? 'bg-[#880E4F]' : 'bg-pink-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable multi-step form viewport */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 max-w-sm mx-auto w-full">
          {regStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="mb-2">
                <span className="text-[10px] font-bold text-[#880E4F] uppercase tracking-wider block">Step 1: Account Credentials</span>
                <h4 className="text-xl font-bold text-gray-800">Basic Personal Details</h4>
                <p className="text-xs text-gray-500 mt-0.5">Start building your profile for matching.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name (As on Government ID)</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={regData.fullName || ''}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => setRegData({ ...regData, gender: 'Female' })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${regData.gender === 'Female' ? 'bg-[#880E4F] text-white border-transparent' : 'bg-white text-gray-700 border-pink-100'}`}
                  >
                    Female
                  </button>
                  <button
                    onClick={() => setRegData({ ...regData, gender: 'Male' })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${regData.gender === 'Male' ? 'bg-[#880E4F] text-white border-transparent' : 'bg-white text-gray-700 border-pink-100'}`}
                  >
                    Male
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={regData.dateOfBirth || '1998-01-01'}
                    onChange={(e) => setRegData({ ...regData, dateOfBirth: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+91 99999 88888"
                    value={regData.phone || ''}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={regData.email || ''}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password (Min 6 characters)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regData.password || ''}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {regStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="mb-2">
                <span className="text-[10px] font-bold text-[#880E4F] uppercase tracking-wider block">Step 2: Community Vitals</span>
                <h4 className="text-xl font-bold text-gray-800">Religion & Location</h4>
                <p className="text-xs text-gray-500 mt-0.5">Help us filter matches by community preferences.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Religion</label>
                <select
                  value={regData.religion || ''}
                  onChange={(e) => setRegData({ ...regData, religion: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                >
                  <option value="Hindu">Hindu</option>
                  <option value="Islam">Islam</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Christian">Christian</option>
                  <option value="Jain">Jain</option>
                  <option value="Buddhist">Buddhist</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Caste / Sect (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Brahmin, Khatri, Sunni, etc."
                  value={regData.caste || ''}
                  onChange={(e) => setRegData({ ...regData, caste: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mother Tongue</label>
                <select
                  value={regData.motherTongue || ''}
                  onChange={(e) => setRegData({ ...regData, motherTongue: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                >
                  <option value="Hindi">Hindi</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Marathi">Marathi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Current Residential Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={regData.location || ''}
                    onChange={(e) => setRegData({ ...regData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {regStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="mb-2">
                <span className="text-[10px] font-bold text-[#880E4F] uppercase tracking-wider block">Step 3: Professional Background</span>
                <h4 className="text-xl font-bold text-gray-800">Education & Career</h4>
                <p className="text-xs text-gray-500 mt-0.5">Professional details are highly preferred for compatibility matching.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Highest Educational Degree</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. B.Tech / MBA / MDS"
                    value={regData.education || ''}
                    onChange={(e) => setRegData({ ...regData, education: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Profession / Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer / Consultant"
                    value={regData.profession || ''}
                    onChange={(e) => setRegData({ ...regData, profession: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Annual Personal Income</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <select
                    value={regData.income || ''}
                    onChange={(e) => setRegData({ ...regData, income: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F] appearance-none"
                  >
                    <option value="">Select Income Bracket</option>
                    <option value="Under ₹5 Lakhs">Under ₹5 Lakhs per annum</option>
                    <option value="₹5L - ₹10 Lakhs">₹5 Lakhs - ₹10 Lakhs p.a.</option>
                    <option value="₹10L - ₹18 Lakhs">₹10 Lakhs - ₹18 Lakhs p.a.</option>
                    <option value="₹18L - ₹30 Lakhs">₹18 Lakhs - ₹30 Lakhs p.a.</option>
                    <option value="₹30 Lakhs+">₹30 Lakhs+ p.a.</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {regStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="mb-2">
                <span className="text-[10px] font-bold text-[#880E4F] uppercase tracking-wider block">Step 4: Biodata Summary</span>
                <h4 className="text-xl font-bold text-gray-800">About & Expectations</h4>
                <p className="text-xs text-gray-500 mt-0.5">Let others know about your personality and goals.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">About Myself</label>
                <textarea
                  rows={4}
                  placeholder="Share a short bio about your personality, family, interests, and what you represent..."
                  value={regData.aboutSelf || ''}
                  onChange={(e) => setRegData({ ...regData, aboutSelf: e.target.value })}
                  className="w-full p-3 bg-white border border-pink-100 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F] resize-none font-sans"
                />
              </div>

              <div className="border-t border-pink-100/60 pt-4.5 space-y-3">
                <span className="block text-xs font-bold text-gray-600">Media & Biodata Upload</span>
                <UploadModule
                  photos={regData.photos || []}
                  biodata={regData.biodataFile || null}
                  onChangePhotos={(updater) => {
                    setRegData(prev => ({
                      ...prev,
                      photos: typeof updater === 'function' ? updater(prev.photos || []) : updater
                    }));
                  }}
                  onChangeBiodata={(updater) => {
                    setRegData(prev => ({
                      ...prev,
                      biodataFile: typeof updater === 'function' ? updater(prev.biodataFile || null) : updater
                    }));
                  }}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="consent-check"
                  defaultChecked
                  className="w-4 h-4 accent-[#880E4F] rounded-sm"
                />
                <label htmlFor="consent-check" className="text-[10px] text-gray-500 leading-tight">
                  I agree that the details provided are correct and I consent to Feroz 01 safety verification audits.
                </label>
              </div>
            </motion.div>
          )}
        </div>

        {regError && (
          <div className="mx-4 mb-2 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-center leading-snug">
            {regError}
          </div>
        )}

        {/* Footer controls */}
        <div className="p-4 bg-white border-t border-pink-100 flex gap-3">
          <button
            onClick={handlePrevRegStep}
            className="flex-1 py-3 bg-white border border-pink-200 text-[#880E4F] font-bold rounded-full text-xs shadow-xs hover:bg-pink-50/30 transition"
          >
            {regStep === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            id="register-next-btn"
            onClick={handleNextRegStep}
            className="flex-1 py-3 bg-[#880E4F] text-white font-bold rounded-full text-xs shadow-md hover:bg-[#AD1457] transition flex items-center justify-center gap-1.5"
          >
            {regStep === 4 ? 'Complete Profile' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
