
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  points: number;
  completedChallenges: string[];
  badges: string[];
  avatarUrl?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'Waste' | 'Energy' | 'Transport' | 'Food';
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  requirement: number; // points needed
}

export interface EcoPost {
  id: string;
  userId: string;
  username: string;
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  hasLiked?: boolean;
}

export interface MarketItem {
  id: string;
  title: string;
  description: string;
  category: 'Books' | 'Dorm' | 'Clothing' | 'Electronics';
  type: 'Giveaway' | 'Swap';
  image: string;
  ownerUsername: string;
}

export interface CampusResource {
  id: string;
  name: string;
  type: 'Water' | 'Recycle' | 'Bike';
  lat: number;
  lng: number;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type View = 'dashboard' | 'challenges' | 'leaderboard' | 'map' | 'ai' | 'profile' | 'feed' | 'scanner' | 'market';
