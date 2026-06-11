export interface User {
  id: string;
  first_name: string;
  last_name: string | null;
  username: string;
  email: string;
  gender: string;
  roles: string[];
  profile_picture_url: string | null;
}

export interface LevelSetting {
  level: string;
  true_score?: number;
  false_score?: number;
  remaining_questions: number;
}

export interface TopicInfo {
  id: string;
  name: string;
  max_attempts: number;
  remaining_attempts: number;
  level_settings: LevelSetting[];
}

export interface Character {
  id: string; // The mock ID or backend ID
  topicId: string;
  name: string;
  concept: string;
  image: string;
  topicName?: string;
  topicMaxAttempts?: number;
  topicLevelSettings?: LevelSetting[];
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  content: string;
  options: Option[];
}

export interface AttemptSession {
  id: string;
  topicId: string;
  level: string;
  requestedQuestions: number;
  expiresAt: string;
  isFinished: boolean;
  score: number;
}

export interface AttemptHistory {
  id: string;
  startedAt: string;
  topicName: string;
  selectedLevel: string;
  requestedQuestions: number;
  score: number | null;
}

export interface AttemptResult {
  isCorrect: boolean;
  isFinished: boolean;
  score: number;
}
