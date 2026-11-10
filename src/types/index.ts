export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  currentWeight?: number;
  targetWeight?: number;
  height?: number;
  goal?: 'lose' | 'maintain' | 'gain' | string;
  notes?: string;
  photoURL?: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: string;
  ingredients: string[];
  imageUrl: string;
  authorId?: string;
  createdAt?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
  authorName: string;
  imageUrl: string;
  createdAt: string;
}

export interface Review {
  id: string;
  clientName: string;
  weightLost: string;
  story: string;
  imageUrl: string;
  source: 'whatsapp' | 'instagram' | 'tiktok' | 'direct';
  createdAt?: string;
}

export interface ChatThread {
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastUpdated: string;
  unreadDoctor: number;
  unreadUser: number;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface UserReport {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: string;
  weight: number;
  bmi: number;
  caloriesTarget: number;
  waterLiters?: number;
  notes?: string;
  createdAt: string;
}
