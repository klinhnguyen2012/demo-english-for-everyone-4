export type Rating = 'Emerging' | 'Developing' | 'Strong';

export type FeedbackCategory =
  | 'Listening'
  | 'Fluency'
  | 'Interaction'
  | 'Vocabulary'
  | 'Grammar and accuracy'
  | 'Confidence';

export interface FeedbackInput {
  ratings: Partial<Record<FeedbackCategory, Rating>>;
  strength1: string;
  strength2: string;
  nextStep: string;
  parentSummary: string;
}

export interface MoodOption {
  label: 'Great' | 'Okay' | 'Tired';
  followUp: string;
}

export interface ChoiceQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface TopicOption {
  title: string;
  prompt: string;
  vocabulary: string[];
}

export interface AnswerStep {
  label: 'Answer' | 'Reason' | 'Example' | 'Ask Back';
  text: string;
}

export interface LessonContent {
  lessonTitle: string;
  totalMinutes: number;
  teacherNotes: string[];
  welcome: {
    title: string;
    duration: number;
    moods: MoodOption[];
    prompt: string;
  };
  listening: {
    title: string;
    duration: number;
    passage: string;
    firstQuestion: ChoiceQuestion;
    secondQuestion: ChoiceQuestion;
    speakingQuestion: string;
    speakingTimerSeconds: number;
  };
  topicChoice: {
    title: string;
    duration: number;
    topics: TopicOption[];
    followUps: string[];
    timing: {
      thinkSeconds: number;
      speakSeconds: number;
      guidance: string;
    };
  };
  strongerAnswer: {
    title: string;
    duration: number;
    teachingQuestion: string;
    steps: AnswerStep[];
    speakingQuestion: string;
    phraseSupport: string[];
  };
  teacherQuestions: {
    title: string;
    duration: number;
    questions: string[];
    followUps: string[];
  };
  mission: {
    title: string;
    duration: number;
    scenario: string;
    options: string[];
    checkpoints: string[];
    expressions: string[];
    teacherNote: string;
    completionMessage: string;
  };
  finalChallenge: {
    title: string;
    duration: number;
    prompt: string;
    timerSeconds: number;
    keywords: string[];
  };
  feedback: {
    title: string;
    categories: FeedbackCategory[];
    ratings: Rating[];
  };
}
