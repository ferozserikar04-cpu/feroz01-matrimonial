import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Phone, Video, Send, CheckCircle2, ChevronRight, UserX, Shield, Lock, Eye, Bell, Globe, Sparkles, Sliders, LogOut, ArrowLeft, BarChart3, Users, Clock, AlertOctagon, Heart, Check, Plus, Trash2, User, Share2, RefreshCw } from 'lucide-react';
import { UserProfile, ChatSession, Message, ScreenId, PhotoItem, BiodataFile } from '../types';
import { MOCK_CHATS, MOCK_PROFILES } from '../data';
import { UploadModule } from './UploadModule';

/* 10. CHAT SCREEN */
interface ChatScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectProfile: (profile: UserProfile) => void;
  profiles: UserProfile[];
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate, onSelectProfile, profiles }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [typedMessage, setTypedMessage] = useState('');

  useEffect(() => {
    const zoya = (profiles && profiles.find(p => p.id === '1')) || MOCK_PROFILES[0];
    const priya = (profiles && profiles.find(p => p.id === '3')) || MOCK_PROFILES[2];

    setChats([
      {
        id: 'c1',
        partner: zoya,
        lastMessage: 'Hi! Let me ask my family about this weekend. Will let you know!',
        lastMessageTime: '03:15 PM',
        unreadCount: 2,
        messages: [
          { id: 'm1', senderId: 'user', text: 'Hello Zoya, I reviewed your profile and really liked your interests, especially travel and music.', timestamp: '11:00 AM', isRead: true },
          { id: 'm2', senderId: zoya.id, text: 'Hi! Thanks for reaching out. Yes, I love traveling, just visited Himachal last month. What about you?', timestamp: '11:15 AM', isRead: true },
          { id: 'm3', senderId: 'user', text: 'That sounds amazing! I love trekking. I was thinking if we could connect over a brief phone call or video meet this weekend?', timestamp: '02:30 PM', isRead: true },
          { id: 'm4', senderId: zoya.id, text: 'Hi! Let me ask my family about this weekend. Will let you know!', timestamp: '03:15 PM', isRead: false }
        ]
      },
      {
        id: 'c2',
        partner: priya,
        lastMessage: 'That works perfectly. Talk to you soon!',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        messages: [
          { id: 'm5', senderId: priya.id, text: 'Hello, thank you for accepting my interest. My parents would love to talk to yours.', timestamp: '10:00 AM', isRead: true },
          { id: 'm6', senderId: 'user', text: 'That is great to hear, Priya. I can share my fathers number or they can call.', timestamp: '10:30 AM', isRead: true },
          { id: 'm7', senderId: priya.id, text: 'That works perfectly. Talk to you soon!', timestamp: '11:00 AM', isRead: true }
        ]
      }
    ]);
  }, [profiles]);
  
  const activeSession = chats.find(c => c.id === activeSessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !activeSessionId) return;

    setChats(prevChats => prevChats.map(session => {
      if (session.id === activeSessionId) {
        const newMsg: Message = {
          id: `m-new-${Date.now()}`,
          senderId: 'user',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true
        };
        return {
          ...session,
          lastMessage: text,
          lastMessageTime: newMsg.timestamp,
          messages: [...session.messages, newMsg]
        };
      }
      return session;
    }));

    setTypedMessage('');

    // Simulated responsive reply from Zoya / Partner after 1.5 seconds!
    setTimeout(() => {
      setChats(prevChats => prevChats.map(session => {
        if (session.id === activeSessionId) {
          const replyMsg: Message = {
            id: `m-reply-${Date.now()}`,
            senderId: session.partner.id,
            text: `Thank you for sharing! Let me check on this and speak with my family too. 😊`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false
          };
          return {
            ...session,
            lastMessage: replyMsg.text,
            lastMessageTime: replyMsg.timestamp,
            messages: [...session.messages, replyMsg]
          };
        }
        return session;
      }));
    }, 1500);
  };

  // Icebreaker triggers
  const ICEBREAKERS = [
    'Would love to discuss our matching family values!',
    'Can we exchange parent contact numbers?',
    'Shall we schedule a brief video connect this weekend?',
    'I really liked your biodata summary details.'
  ];

  return (
    <div id="chat-screen" className="flex flex-col h-full bg-[#FFF8FA] select-none">
      <AnimatePresence mode="wait">
        {!activeSessionId ? (
          // A. Chat List View
          <motion.div
            key="chat-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="bg-white border-b border-pink-100 px-4 py-4 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Active Safe Chats</h2>
              <span className="text-[10px] bg-green-100 text-green-800 font-extrabold px-2.5 py-1 rounded-full border border-green-200 uppercase tracking-widest font-mono">
                Encrypted
              </span>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
              {chats.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className="bg-white border border-pink-100/60 p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:border-pink-300 hover:shadow-xs transition duration-250"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar with online indicator dot */}
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-pink-100">
                      <img
                        src={session.partner.avatar}
                        alt={session.partner.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {session.partner.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    {/* Meta info text */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-800 text-sm">{session.partner.name}</span>
                        {session.partner.verified && (
                          <span className="bg-green-100 text-green-800 text-[8px] font-bold px-1 rounded-sm">Verified</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-medium truncate mt-0.5">{session.partner.profession}</p>
                      <p className="text-xs text-gray-500 font-semibold truncate mt-1 leading-tight">{session.lastMessage}</p>
                    </div>
                  </div>

                  {/* Badges/Time */}
                  <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                    <span className="text-[9px] text-gray-400 font-medium">{session.lastMessageTime}</span>
                    {session.unreadCount > 0 && (
                      <span className="bg-[#880E4F] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          // B. Active Chat Room View
          <motion.div
            key="chat-room"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full bg-[#FAF0F4]"
          >
            {/* Room Header bar */}
            <div className="bg-white border-b border-pink-100 px-3.5 py-3 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setActiveSessionId(null)}
                  className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-gray-700 hover:bg-pink-100"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>

                <div
                  className="flex items-center gap-2 cursor-pointer min-w-0"
                  onClick={() => onSelectProfile(activeSession!.partner)}
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-pink-100 shrink-0">
                    <img
                      src={activeSession!.partner.avatar}
                      alt={activeSession!.partner.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-gray-800 truncate leading-tight">{activeSession!.partner.name}</h3>
                    <span className="text-[9px] text-green-600 font-bold block leading-none mt-0.5">
                      {activeSession!.partner.online ? '• Active Now' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Action Calls */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => alert(`Initiating voice connection call with ${activeSession!.partner.name}`)}
                  className="w-8.5 h-8.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#880E4F] flex items-center justify-center border border-pink-100"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`Starting video connect invitation with ${activeSession!.partner.name}`)}
                  className="w-8.5 h-8.5 rounded-full bg-pink-50 hover:bg-pink-100 text-[#880E4F] flex items-center justify-center border border-pink-100"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable conversation bubbles */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              <div className="text-center py-2">
                <span className="inline-block px-3 py-1 bg-pink-100/60 border border-pink-200/50 text-[#880E4F] rounded-full text-[9px] font-black uppercase tracking-wider">
                  🔒 Family Connection Secure Lock
                </span>
              </div>

              {activeSession!.messages.map((msg) => {
                const isMe = msg.senderId === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-xs leading-normal shadow-2xs ${isMe ? 'bg-[#880E4F] text-white rounded-br-none' : 'bg-white text-gray-800 border border-pink-100/60 rounded-bl-none'}`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className={`text-[8px] font-bold mt-1 block text-right ${isMe ? 'text-pink-200/90' : 'text-gray-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Icebreakers Chips Carousels */}
            <div className="px-3.5 py-2 bg-[#FAF0F4] border-t border-pink-100 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none shrink-0">
              {ICEBREAKERS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="bg-white border border-pink-200 text-[#880E4F] text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-pink-50 transition shrink-0 shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Send Bar */}
            <div className="p-3 bg-white border-t border-pink-100 flex items-center gap-2.5 shrink-0">
              <input
                type="text"
                placeholder="Type elegant, polite message..."
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage(typedMessage);
                }}
                className="flex-1 bg-pink-50/40 border border-pink-100 rounded-full px-4.5 py-2.5 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#880E4F] text-gray-800"
              />
              <button
                onClick={() => handleSendMessage(typedMessage)}
                className="w-10 h-10 rounded-full bg-[#880E4F] hover:bg-[#AD1457] text-white flex items-center justify-center shrink-0 shadow-md transition"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* 12. SETTINGS SCREEN */
interface SettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
  myProfile: UserProfile;
  onUpdateProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onDeleteProfile?: () => Promise<void>;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onNavigate, 
  onLogout,
  myProfile,
  onUpdateProfile,
  onDeleteProfile
}) => {
  const [photoVisibility, setPhotoVisibility] = useState<'all' | 'verified' | 'blur'>('verified');
  const [pushNotifs, setPushNotifs] = useState(true);
  const [trustLevel, setTrustLevel] = useState(98);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(myProfile.name);
  const [editProfession, setEditProfession] = useState(myProfile.profession);
  const [editEducation, setEditEducation] = useState(myProfile.education);
  const [editLocation, setEditLocation] = useState(myProfile.location);
  const [editAbout, setEditAbout] = useState(myProfile.about);
  
  const [editPhotos, setEditPhotos] = useState<PhotoItem[]>(myProfile.photoItems || []);
  const [editBiodata, setEditBiodata] = useState<BiodataFile | null>(myProfile.biodataFile || null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deletion States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Sync edit state when myProfile prop changes (e.g. from registration)
  useEffect(() => {
    setEditName(myProfile.name);
    setEditProfession(myProfile.profession);
    setEditEducation(myProfile.education);
    setEditLocation(myProfile.location);
    setEditAbout(myProfile.about);
    setEditPhotos(myProfile.photoItems || []);
    setEditBiodata(myProfile.biodataFile || null);
  }, [myProfile]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = () => {
    onUpdateProfile(prev => ({
      ...prev,
      name: editName,
      profession: editProfession,
      education: editEducation,
      location: editLocation,
      about: editAbout,
      photoItems: editPhotos,
      biodataFile: editBiodata,
      // Sync list fields for standard display compatibility
      photos: editPhotos.length > 0 ? editPhotos.map(p => p.url) : prev.photos,
      avatar: editPhotos.length > 0 
        ? (editPhotos.find(p => p.isPrimary)?.url || editPhotos[0].url) 
        : prev.avatar
    }));
    setIsEditingProfile(false);
    triggerToast("Profile & documents updated.");
  };

  if (isEditingProfile) {
    return (
      <div id="settings-edit-profile-view" className="flex flex-col h-full bg-[#FFF8FA] select-none text-gray-700">
        {/* Header bar */}
        <div className="bg-white border-b border-pink-100 px-4 py-3.5 flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsEditingProfile(false)}
            className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-gray-700 border border-pink-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">Edit Profile & Documents</h2>
            <p className="text-[10px] text-gray-400">Update your matrimonial bio, photos, and biodata file</p>
          </div>
        </div>

        {/* Scrollable Form body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-white border border-pink-100 rounded-3xl p-4.5 space-y-4 shadow-2xs">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-pink-50 pb-2">
              <User className="w-4 h-4 text-[#C2185B]" /> Personal Bio Details
            </h4>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-3 bg-pink-50/10 border border-pink-100 focus:ring-1 focus:ring-[#880E4F] focus:outline-hidden rounded-xl text-xs font-medium text-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Profession</label>
                <input 
                  type="text" 
                  value={editProfession}
                  onChange={(e) => setEditProfession(e.target.value)}
                  className="w-full p-3 bg-pink-50/10 border border-pink-100 focus:ring-1 focus:ring-[#880E4F] focus:outline-hidden rounded-xl text-xs font-medium text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Education</label>
                <input 
                  type="text" 
                  value={editEducation}
                  onChange={(e) => setEditEducation(e.target.value)}
                  className="w-full p-3 bg-pink-50/10 border border-pink-100 focus:ring-1 focus:ring-[#880E4F] focus:outline-hidden rounded-xl text-xs font-medium text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Location</label>
              <input 
                type="text" 
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full p-3 bg-pink-50/10 border border-pink-100 focus:ring-1 focus:ring-[#880E4F] focus:outline-hidden rounded-xl text-xs font-medium text-gray-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">About Myself</label>
              <textarea 
                rows={4}
                value={editAbout}
                onChange={(e) => setEditAbout(e.target.value)}
                className="w-full p-3 bg-pink-50/10 border border-pink-100 focus:ring-1 focus:ring-[#880E4F] focus:outline-hidden rounded-xl text-xs font-medium text-gray-800 resize-none font-sans"
              />
            </div>
          </div>

          <UploadModule 
            photos={editPhotos}
            biodata={editBiodata}
            onChangePhotos={setEditPhotos}
            onChangeBiodata={setEditBiodata}
          />
        </div>

        {/* Footer sticky bar */}
        <div className="p-3 bg-white border-t border-pink-100 flex gap-2 shrink-0">
          <button
            onClick={() => setIsEditingProfile(false)}
            className="flex-1 py-3 bg-white border border-pink-100 hover:bg-gray-50 text-gray-600 font-bold rounded-2xl text-xs transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            className="flex-1 py-3 bg-[#880E4F] hover:bg-[#AD1457] text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4" /> Save Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="settings-screen" className="flex flex-col h-full bg-[#FFF8FA] select-none text-gray-700">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg z-50 flex items-center gap-1.5 backdrop-blur-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white border-b border-pink-100 px-4 py-3.5 flex items-center justify-between shrink-0">
        <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Account Settings</h2>
        <span className="text-[10px] bg-pink-100 text-[#880E4F] font-bold px-2.5 py-1 rounded-full uppercase">Feroz Elite</span>
      </div>

      {/* Settings body viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Profile Card Preview */}
        <div className="bg-white border border-pink-100 rounded-3xl p-4 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-13 h-13 rounded-full overflow-hidden border-2 border-[#880E4F] shrink-0 bg-gray-50 flex items-center justify-center relative">
              <img 
                src={myProfile.photos[0] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80'} 
                alt="My profile" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-extrabold text-gray-800 truncate">{myProfile.name}</h3>
              <p className="text-[10px] text-gray-400 truncate mt-0.5">{myProfile.profession} • {myProfile.location}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-block bg-[#880E4F]/10 text-[#880E4F] font-black text-[7px] px-1.5 py-0.5 rounded-sm">GOLD BADGE</span>
                {myProfile.biodataFile && (
                  <span className="inline-block bg-green-50 text-green-700 font-bold text-[7px] px-1.5 py-0.5 rounded-sm border border-green-100">BIODATA INCLUDED</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="shrink-0 bg-[#880E4F] hover:bg-[#AD1457] text-white font-extrabold text-[10px] px-3 py-2 rounded-xl transition shadow-xs"
          >
            Edit Info
          </button>
        </div>

        {/* Trust verification health card */}
        <div className="bg-white border border-pink-100 rounded-2xl p-4 shadow-2xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-4 h-4 text-[#C2185B]" /> Safe Trust Index
            </span>
            <span className="text-sm font-black text-green-600">{trustLevel}% Healthy</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full rounded-full" style={{ width: `${trustLevel}%` }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            Your profile carries our highest double-checked gold tick badge. Verified by Government ID & Employer verification.
          </p>
        </div>

        {/* 1. Photo Privacy Configurations */}
        <div className="bg-white border border-pink-100 rounded-2xl p-4 space-y-3.5">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider border-b border-pink-50 pb-2 flex items-center gap-1">
            <Lock className="w-4 h-4 text-gray-500" /> Photo Privacy Controls
          </h4>

          <div className="space-y-2">
            {[
              { id: 'all', title: 'Public Visibility', desc: 'All registered matrimonial users see clear photos.' },
              { id: 'verified', title: 'Verified Members Only', desc: 'Only members approved via Govt ID see clear photos.' },
              { id: 'blur', title: 'Protect Privacy / Auto-Blur', desc: 'Photos remain blurred; you approve individual requests.' }
            ].map((option) => (
              <label
                key={option.id}
                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${photoVisibility === option.id ? 'bg-pink-50/50 border-[#880E4F]/40' : 'bg-white border-pink-50 hover:bg-pink-50/10'}`}
              >
                <input
                  type="radio"
                  name="photo-visibility"
                  checked={photoVisibility === option.id}
                  onChange={() => setPhotoVisibility(option.id as any)}
                  className="w-4 h-4 accent-[#880E4F] mt-0.5"
                />
                <div>
                  <span className="font-bold text-gray-800 block leading-none mb-1">{option.title}</span>
                  <span className="text-[10px] text-gray-400 leading-normal block">{option.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 2. Partner Preferences Navigation */}
        <div className="bg-white border border-pink-100 rounded-2xl p-3.5 space-y-2.5">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider border-b border-pink-50 pb-2 flex items-center gap-1">
            <Sliders className="w-4 h-4 text-gray-500" /> Match Preferences
          </h4>

          <div className="space-y-1">
            {[
              { title: 'Community & Religion', val: 'Hindu, Sikh, Islam' },
              { title: 'Educational Alignment', val: 'B.Tech, MBA, MDS, Doctor' },
              { title: 'Residential Location Filter', val: 'Delhi NCR, Mumbai, Ahmedabad' },
              { title: 'Working Career Bracket', val: '₹12,00,000+ per annum' }
            ].map((pref, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 text-xs border-b border-pink-50/50">
                <div>
                  <span className="font-bold text-gray-700 block">{pref.title}</span>
                  <span className="text-[10px] text-gray-400">{pref.val}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Notifications settings */}
        <div className="bg-white border border-pink-100 rounded-2xl p-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-xs font-bold text-gray-800 block">Instant Matched Notifications</span>
              <span className="text-[10px] text-gray-400 block">Get sound alert when compatibility matches score 90%+</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={pushNotifs}
            onChange={() => setPushNotifs(!pushNotifs)}
            className="w-5 h-5 accent-[#880E4F]"
          />
        </div>

        {/* 3.5 Share App Card */}
        <div className="bg-linear-to-tr from-[#880E4F] to-[#AD1457] rounded-2xl p-4 text-white shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Share2 className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-yellow-300">Invite Family & Friends</h4>
              <p className="text-[10px] text-pink-50/95 leading-normal mt-0.5">
                Share Feroz 01 Matrimonial App to help friends and relatives find high-compatibility matrimonial proposals.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const shareData = {
                title: 'Feroz 01 Matrimonial App',
                text: 'Find your perfect premium lifepartner on Feroz 01 Matrimonial! Secure, double-checked, premium matches. Download our official Android App now.',
                url: 'https://play.google.com/store/apps/details?id=com.feroz01.matrimonial'
              };
              if (navigator.share) {
                navigator.share(shareData).catch(err => console.log('Error sharing:', err));
              } else {
                navigator.clipboard.writeText(shareData.url);
                triggerToast("App Play Store Link copied!");
              }
            }}
            className="w-full py-2.5 bg-white text-[#880E4F] hover:bg-pink-50 font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
          >
            <Share2 className="w-3.5 h-3.5" /> Share App Now
          </button>
        </div>

        {/* 3.2 Account & Security Settings */}
        <div className="bg-white border border-pink-100 rounded-2xl p-4 space-y-3 shadow-2xs">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider border-b border-pink-50 pb-2 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-[#880E4F]" /> Account & Security
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-gray-700 block">Matrimonial ID</span>
                <span className="text-[10px] text-gray-400 font-mono">F01-M-{myProfile.id.substring(0, 8).toUpperCase()}</span>
              </div>
              <span className="text-[9px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-bold">Verified Profile</span>
            </div>

            <div className="border-t border-pink-50/50 pt-2.5">
              <button
                onClick={() => {
                  setDeleteConfirmText('');
                  setDeleteError(null);
                  setIsDeleteModalOpen(true);
                }}
                className="w-full bg-red-50 hover:bg-red-100 border border-red-100/50 text-red-600 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-between gap-1.5 cursor-pointer active:scale-98"
              >
                <div className="flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>Delete My Profile</span>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Log out and Admin Bypass links */}
        <div className="space-y-2 pt-4">
          <button
            onClick={() => onNavigate('admin')}
            className="w-full bg-[#AD1457]/10 hover:bg-[#AD1457]/15 border border-[#AD1457]/20 text-[#AD1457] font-bold py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
          >
            Open Admin Operator Dashboard
          </button>

          <button
            onClick={onLogout}
            className="w-full bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 font-bold py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" /> Log Out Account
          </button>
        </div>
      </div>

      {/* DELETE ACCOUNT CONFIRMATION DIALOG MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 select-none backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col border border-pink-100"
            >
              {/* Header */}
              <div className="bg-red-50 border-b border-red-100 px-5 py-4 flex items-center gap-2">
                <div className="p-1.5 bg-red-100 text-red-700 rounded-full">
                  <AlertOctagon className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-[#880E4F] font-black text-sm uppercase tracking-wide">
                    Delete Profile Permanently
                  </h4>
                  <p className="text-[10px] text-red-500 font-bold">This operation is IRREVERSIBLE</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 text-gray-600">
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  Are you sure you want to permanently delete your profile? This action cannot be undone.
                </p>

                <div className="bg-red-50/50 border border-red-100/50 rounded-xl p-3 text-[10px] text-red-800 leading-normal space-y-1">
                  <span className="font-bold block">By proceeding, we will permanently purge:</span>
                  <ul className="list-disc list-inside space-y-0.5 font-medium">
                    <li>Your entire Firestore matrimonial profile info.</li>
                    <li>All 6 secure profile photos from Storage.</li>
                    <li>Your uploaded biodata document.</li>
                    <li>Your matches, chat histories, & preference entries.</li>
                    <li>Your Firebase Authentication credentials.</li>
                  </ul>
                </div>

                {deleteError && (
                  <div className="bg-red-50 text-red-600 text-[10px] font-bold p-3 rounded-xl border border-red-100 flex items-start gap-1.5">
                    <AlertOctagon className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{deleteError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE in capital letters"
                    disabled={isDeleting}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 uppercase tracking-widest focus:bg-white focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (!isDeleting) {
                      setIsDeleteModalOpen(false);
                      setDeleteConfirmText('');
                      setDeleteError(null);
                    }
                  }}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-500 font-black rounded-xl text-xs hover:bg-gray-100 transition cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  onClick={async () => {
                    if (onDeleteProfile) {
                      setIsDeleting(true);
                      setDeleteError(null);
                      try {
                        await onDeleteProfile();
                        setIsDeleteModalOpen(false);
                        triggerToast("Your profile was successfully deleted.");
                      } catch (err: any) {
                        setDeleteError(err.message || "An unexpected error occurred during account deletion.");
                        setIsDeleting(false);
                      }
                    } else {
                      setDeleteError("Deletion service is currently unavailable.");
                    }
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1 cursor-pointer active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Purging...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" /> Purge Profile
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* 14. ADMIN PANEL DASHBOARD SCREEN */
export const AdminDashboardScreen: React.FC<{
  onNavigate: (screen: ScreenId) => void;
}> = ({ onNavigate }) => {
  const [candidates, setCandidates] = useState<UserProfile[]>(MOCK_PROFILES);
  const [pendingTickets, setPendingTickets] = useState([
    { id: 't1', user: 'Rohan Verma', issue: 'Photo Blur Lock Request', type: 'System Audit', time: '1 hr ago' },
    { id: 't2', user: 'Ananya Iyer', issue: 'Government ID verification pending', type: 'ID verification', time: '4 hrs ago' }
  ]);

  const handleApproveId = (id: string) => {
    alert(`Approved and issued verified gold tick badge to profile ID: ${id}`);
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, verified: true } : c));
  };

  const handleFlagProfile = (id: string) => {
    alert(`Flagged profile ID: ${id} for safety audit inspection.`);
  };

  return (
    <div id="admin-dashboard-screen" className="flex flex-col h-full bg-slate-900 select-none text-slate-100">
      {/* Header bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-8.5 h-8.5 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-100 transition"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div>
            <h2 className="text-sm font-black text-slate-100 tracking-tight flex items-center gap-1">
              <Shield className="w-4.5 h-4.5 text-yellow-400 fill-yellow-400" /> Feroz 01 Operator Panel
            </h2>
            <span className="text-[9px] text-slate-400 uppercase font-mono block mt-0.5">Safety & Audits Control Center</span>
          </div>
        </div>

        <div className="bg-slate-700 border border-slate-600 px-2 py-0.5 rounded-sm">
          <span className="text-[10px] font-bold text-yellow-400 animate-pulse">LIVE CONNECTED</span>
        </div>
      </div>

      {/* Admin Content scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4.5">
        {/* Metric dashboard cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-xl">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">Total Verified Members</span>
            <span className="text-xl font-extrabold text-slate-100 block mt-1">1,248</span>
            <span className="text-[9px] text-green-400 font-bold block mt-0.5">↑ 12% This Week</span>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-xl">
            <span className="text-[9px] text-slate-400 font-bold block uppercase">Active Match Connections</span>
            <span className="text-xl font-extrabold text-slate-100 block mt-1">482</span>
            <span className="text-[9px] text-yellow-400 font-bold block mt-0.5">↑ 92% Compatibility rate</span>
          </div>
        </div>

        {/* Quick analytics simulation graph */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-3.5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-widest flex items-center gap-1">
              <BarChart3 className="w-4 h-4 text-pink-400" /> Weekly Matches Registered
            </span>
            <span className="text-[10px] text-slate-400">Past 5 Days</span>
          </div>

          {/* Inline SVG Chart bar plots */}
          <div className="h-20 flex items-end justify-between gap-2.5 pt-2">
            {[
              { day: 'Mon', h: '35%' },
              { day: 'Tue', h: '50%' },
              { day: 'Wed', h: '85%' },
              { day: 'Thu', h: '70%' },
              { day: 'Fri', h: '95%' }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full bg-pink-500 hover:bg-pink-400 transition-all rounded-t-sm" style={{ height: bar.h }} />
                <span className="text-[9px] text-slate-400 font-bold">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Approvals Queue Section */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Users className="w-4 h-4 text-yellow-400" /> Pending Verification Audits
          </span>

          <div className="space-y-3">
            {candidates.map((c) => (
              <div
                key={c.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-3 flex gap-3 items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-600 bg-slate-700">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                      {c.name} {c.verified && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                    </h5>
                    <span className="text-[10px] text-slate-400 block">{c.profession}</span>
                    <span className="text-[9px] text-yellow-400 font-semibold bg-yellow-500/10 px-1.5 py-0.5 rounded-sm block mt-1 w-max">Govt ID Match: Pending</span>
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  {!c.verified ? (
                    <button
                      onClick={() => handleApproveId(c.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-2.5 py-1.5 rounded-md text-[10px] shadow-xs flex items-center gap-0.5"
                    >
                      <Check className="w-3 h-3" /> Approve
                    </button>
                  ) : (
                    <span className="text-[10px] text-green-400 font-bold flex items-center gap-0.5 pr-2">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  )}
                  <button
                    onClick={() => handleFlagProfile(c.id)}
                    className="bg-red-900/40 hover:bg-red-900/60 text-red-300 font-bold px-2 py-1.5 rounded-md text-[10px]"
                  >
                    Flag/Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets Queue Section */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-4 h-4 text-pink-400" /> Recent Safety Flags
          </span>

          <div className="space-y-2.5">
            {pendingTickets.map((t) => (
              <div
                key={t.id}
                className="bg-slate-800 border border-slate-700/60 rounded-xl p-3 flex justify-between items-start"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded-sm">
                      {t.type}
                    </span>
                    <span className="text-[9px] text-slate-400">{t.time}</span>
                  </div>
                  <h6 className="text-xs font-bold text-slate-100">{t.user}</h6>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.issue}</p>
                </div>
                <button
                  onClick={() => {
                    alert(`Resolved safety flag for ${t.user}`);
                    setPendingTickets(prev => prev.filter(tick => tick.id !== t.id));
                  }}
                  className="text-[9px] font-black text-yellow-400 border border-yellow-400/20 px-2 py-1 rounded-sm hover:bg-yellow-400/10 transition"
                >
                  Resolve Flag
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
