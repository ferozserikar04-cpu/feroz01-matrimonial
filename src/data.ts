import { UserProfile, ChatSession, AppNotification } from './types';

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: '1',
    name: 'Zoya Khan',
    gender: 'Female',
    age: 26,
    height: "5'5\"",
    religion: 'Islam',
    caste: 'Sunni Khan',
    sect: 'Sunni',
    motherTongue: 'Urdu',
    profession: 'Software Engineer',
    income: '₹18,00,000 per annum',
    education: 'B.Tech in Computer Science',
    location: 'Delhi, India',
    photos: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80'
    ],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    verified: true,
    online: true,
    matchScore: 95,
    about: 'Hi! I am Zoya, a software development engineer working with a leading multinational tech firm in Delhi. I am independent, family-oriented, and enjoy balancing work and personal life. I love exploring new cafes, reading modern fiction, and traveling. I am looking for an educated, career-oriented partner with a kind heart and a great sense of humor.',
    familyType: 'Nuclear Family',
    familyValues: 'Moderate / Modern',
    fatherOccupation: 'Retired Government Officer',
    motherOccupation: 'Home Maker',
    siblings: '1 Elder Brother (Married, living in UK)',
    interests: ['Travel', 'Reading', 'Gourmet Cooking', 'Indie Music', 'Photography'],
    partnerExpectations: {
      ageRange: '27 - 31 years',
      heightRange: "5'8\" - 6'2\"",
      religion: 'Islam',
      education: 'Masters or Equivalent B.Tech/MBA',
      incomeRange: '₹20,00,000+ per annum'
    }
  },
  {
    id: '2',
    name: 'Aarav Sharma',
    gender: 'Male',
    age: 28,
    height: "5'11\"",
    religion: 'Hindu',
    caste: 'Brahmin',
    motherTongue: 'Hindi',
    profession: 'Product Manager',
    income: '₹24,00,000 per annum',
    education: 'MBA from IIM, B.Tech from NIT',
    location: 'Mumbai, India',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80'
    ],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    verified: true,
    online: true,
    matchScore: 92,
    about: 'I am a progressive, down-to-earth person who believes in mutual respect and understanding. Currently working as a Senior Product Manager at a leading fintech startup in Mumbai. I am passionate about fitness, cycling on weekends, and learning about history. Looking for an understanding partner who values family, has her own professional aspirations, and appreciates the little things in life.',
    familyType: 'Joint Family',
    familyValues: 'Liberal / Progressive',
    fatherOccupation: 'Senior Advocate (High Court)',
    motherOccupation: 'College Professor',
    siblings: '1 Younger Sister (Pursuing Masters)',
    interests: ['Cycling', 'Fitness', 'History Podcasts', 'Investing', 'World Cinema'],
    partnerExpectations: {
      ageRange: '24 - 28 years',
      heightRange: "5'3\" - 5'8\"",
      religion: 'Hindu',
      education: 'Graduate / Post Graduate',
      incomeRange: 'No bar'
    }
  },
  {
    id: '3',
    name: 'Priya Patel',
    gender: 'Female',
    age: 27,
    height: "5'4\"",
    religion: 'Hindu',
    caste: 'Patel / Leva',
    motherTongue: 'Gujarati',
    profession: 'Dentist (Consultant)',
    income: '₹12,00,000 per annum',
    education: 'MDS in Orthodontics',
    location: 'Ahmedabad, India',
    photos: [
      'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
    ],
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150&auto=format&fit=crop&q=80',
    verified: true,
    online: false,
    matchScore: 89,
    about: 'Hello! I am a practicing consultant orthodontist based in Ahmedabad. I am a bubbly, cheerful person with a modern outlook on life, yet deeply rooted in Gujarati values. I enjoy organic gardening, cooking authentic cuisines, and practicing yoga. I am seeking an educated, broad-minded, and family-oriented partner who can be my best friend first.',
    familyType: 'Nuclear Family',
    familyValues: 'Traditional with modern blend',
    fatherOccupation: 'Businessman (Real Estate)',
    motherOccupation: 'Boutique Owner',
    siblings: 'None (Only Child)',
    interests: ['Yoga', 'Gardening', 'Cooking', 'Art & Craft', 'Folk Dance'],
    partnerExpectations: {
      ageRange: '27 - 31 years',
      heightRange: "5'7\" - 6'1\"",
      religion: 'Hindu',
      education: 'Doctor / Engineer / MBA',
      incomeRange: '₹15,00,000+ per annum'
    }
  },
  {
    id: '4',
    name: 'Kabir Mehta',
    gender: 'Male',
    age: 29,
    height: "6'0\"",
    religion: 'Sikh',
    caste: 'Khatri',
    motherTongue: 'Punjabi',
    profession: 'Tech Lead',
    income: '₹32,00,000 per annum',
    education: 'MS in Computer Science (USA)',
    location: 'Bangalore, India',
    photos: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80'
    ],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    verified: true,
    online: true,
    matchScore: 87,
    about: 'I am an energetic, warm-hearted individual who returned from the Seattle area recently to be closer to my parents. I work as a Tech Lead in a multinational cloud provider in Bangalore. I love trekking, experimental cooking, and hosting board game nights. Looking for a partner who is intellectual, values personal growth, and is excited about life.',
    familyType: 'Nuclear Family',
    familyValues: 'Modern',
    fatherOccupation: 'Retired Banker',
    motherOccupation: 'Social Worker',
    siblings: '1 Elder Sister (Resident Doctor in Canada)',
    interests: ['Trekking', 'Board Games', 'Live Music', 'Running', 'Cooking'],
    partnerExpectations: {
      ageRange: '25 - 29 years',
      heightRange: "5'3\" - 5'9\"",
      religion: 'Sikh / Punjabi',
      education: 'Graduate / Postgraduate',
      incomeRange: 'No bar'
    }
  },
  {
    id: '5',
    name: 'Ananya Iyer',
    gender: 'Female',
    age: 25,
    height: "5'3\"",
    religion: 'Hindu',
    caste: 'Iyer',
    motherTongue: 'Tamil',
    profession: 'Senior UX Designer',
    income: '₹15,00,000 per annum',
    education: 'Bachelor of Design (NID)',
    location: 'Chennai, India',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80'
    ],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    verified: true,
    online: false,
    matchScore: 84,
    about: 'Hi there, I am a creative soul based in Chennai working as a UX Designer. I love colors, aesthetics, typography, and visiting art exhibitions. I also play the Carnatic violin in my free time. I believe a perfect marriage is a partnership of equals where both can grow together and support each other\'s dreams.',
    familyType: 'Nuclear Family',
    familyValues: 'Liberal / Modern',
    fatherOccupation: 'CFO in Private Firm',
    motherOccupation: 'Carnatic Music Teacher',
    siblings: 'None',
    interests: ['Carnatic Violin', 'Sketching', 'Modern Art', 'Nature Walks', 'Cafe Hopping'],
    partnerExpectations: {
      ageRange: '26 - 30 years',
      heightRange: "5'6\" - 6'0\"",
      religion: 'Hindu',
      education: 'Any Professional Degree',
      incomeRange: '₹12,00,000+ per annum'
    }
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'match',
    title: 'New Perfect Match!',
    description: 'You have a 95% Match Score with Zoya Khan. View her biodata now!',
    timestamp: '10 mins ago',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'n2',
    type: 'like',
    title: 'Profile Liked',
    description: 'Aarav Sharma liked your profile and sent a connection request.',
    timestamp: '2 hours ago',
    read: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'n3',
    type: 'request',
    title: 'Biodata Access Approved',
    description: 'Priya Patel has approved your request to view her full biodata.',
    timestamp: 'Yesterday',
    read: true,
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Profile Verified!',
    description: 'Congratulations! Your Trust Badge level has increased. Your profile is now verified.',
    timestamp: '2 days ago',
    read: true
  }
];

export const MOCK_CHATS: ChatSession[] = [
  {
    id: 'c1',
    partner: MOCK_PROFILES[0], // Zoya Khan
    lastMessage: 'Hi! Let me ask my family about this weekend. Will let you know!',
    lastMessageTime: '03:15 PM',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'user', text: 'Hello Zoya, I reviewed your profile and really liked your interests, especially travel and music.', timestamp: '11:00 AM', isRead: true },
      { id: 'm2', senderId: '1', text: 'Hi! Thanks for reaching out. Yes, I love traveling, just visited Himachal last month. What about you?', timestamp: '11:15 AM', isRead: true },
      { id: 'm3', senderId: 'user', text: 'That sounds amazing! I love trekking. I was thinking if we could connect over a brief phone call or video meet this weekend?', timestamp: '02:30 PM', isRead: true },
      { id: 'm4', senderId: '1', text: 'Hi! Let me ask my family about this weekend. Will let you know!', timestamp: '03:15 PM', isRead: false }
    ]
  },
  {
    id: 'c2',
    partner: MOCK_PROFILES[2], // Priya Patel
    lastMessage: 'That works perfectly. Talk to you soon!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm5', senderId: '3', text: 'Hello, thank you for accepting my interest. My parents would love to talk to yours.', timestamp: '10:00 AM', isRead: true },
      { id: 'm6', senderId: 'user', text: 'That is great to hear, Priya. I can share my fathers number or they can call.', timestamp: '10:30 AM', isRead: true },
      { id: 'm7', senderId: '3', text: 'That works perfectly. Talk to you soon!', timestamp: '11:00 AM', isRead: true }
    ]
  }
];
