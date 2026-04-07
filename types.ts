export enum UserRole {
  USER = 'USER',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profile?: HealthProfile;
}

export interface HealthProfile {
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  allergies: string[];
}

export interface DailyLog {
  date: string;
  steps: number;
  waterIntake: number; // ml
  sleepHours: number;
  mood: 'Happy' | 'Neutral' | 'Stressed' | 'Tired';
  caloriesBurned: number;
  heartRateAvg: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  patients: number;
}
