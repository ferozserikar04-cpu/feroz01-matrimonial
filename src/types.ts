export type ScreenId =
  | 'splash'
  | 'welcome'
  | 'login'
  | 'register'
  | 'home'
  | 'search'
  | 'profile'
  | 'biodata'
  | 'match'
  | 'chat'
  | 'notifications'
  | 'settings'
  | 'report'
  | 'admin';

export interface PhotoItem {
  id: string;
  url: string;
  isPrimary: boolean;
  zoom: number;
  rotation: number;
  xOffset: number;
  yOffset: number;
}

export interface BiodataFile {
  name: string;
  type: 'pdf' | 'jpg' | 'png';
  url: string;
  size: string;
}

export interface UserProfile {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  height: string;
  religion: string;
  caste: string;
  sect?: string;
  motherTongue: string;
  profession: string;
  income: string;
  education: string;
  location: string;
  photos: string[];
  avatar: string;
  verified: boolean;
  online: boolean;
  matchScore: number;
  about: string;
  familyType: string;
  familyValues: string;
  fatherOccupation: string;
  motherOccupation: string;
  siblings: string;
  interests: string[];
  partnerExpectations: {
    ageRange: string;
    heightRange: string;
    religion: string;
    education: string;
    incomeRange: string;
  };
  photoItems?: PhotoItem[];
  biodataFile?: BiodataFile | null;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatSession {
  id: string;
  partner: UserProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface AppNotification {
  id: string;
  type: 'match' | 'like' | 'request' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
}

export interface RegistrationState {
  // Step 1: Account / Basic
  email?: string;
  password?: string;
  phone?: string;
  fullName?: string;
  gender?: 'Male' | 'Female';
  dateOfBirth?: string;
  // Step 2: Personal & Religion
  religion?: string;
  caste?: string;
  motherTongue?: string;
  location?: string;
  // Step 3: Education & Career
  education?: string;
  profession?: string;
  income?: string;
  // Step 4: Family & expectations
  aboutSelf?: string;
  // Step 5: Uploaded Media
  photos?: PhotoItem[];
  biodataFile?: BiodataFile | null;
}

