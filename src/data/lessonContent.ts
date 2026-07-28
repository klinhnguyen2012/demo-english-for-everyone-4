import type {
  FeedbackCategory,
  LessonContent,
  Rating,
} from '../types/lesson';

export const feedbackCategories: FeedbackCategory[] = [
  'Listening',
  'Fluency',
  'Interaction',
  'Vocabulary',
  'Grammar and accuracy',
  'Confidence',
];

export const feedbackRatings: Rating[] = [
  'Emerging',
  'Developing',
  'Strong',
];

export const lessonContent: LessonContent = {
  lessonTitle: 'Ami Connect English Demo Lesson',
  totalMinutes: 20,
  teacherNotes: [
    'Start with a relaxed tone and invite a full-sentence answer.',
    'Play the passage before revealing the transcript. Ask the student to listen for the main idea.',
    'Let the student choose freely, then ask for a reason and one example.',
    'Reveal each answer step only after the student has tried to add that part.',
    'Keep the exchange natural. Use the follow-up only after the student finishes speaking.',
    'Politely disagree with the student’s first choice so the student must respond and continue the conversation.',
    'Allow quiet planning time, then listen without interrupting until the timer ends.',
    'Choose ratings based on today’s conversation and keep the parent summary specific and encouraging.',
  ],
  welcome: {
    title: 'Let’s get started!',
    duration: 2,
    moods: [
      { label: 'Great', followUp: 'What was the best part of your day?' },
      { label: 'Okay', followUp: 'Did anything interesting happen?' },
      {
        label: 'Tired',
        followUp: 'What are you going to do after this lesson?',
      },
    ],
    prompt: 'How has your day been so far?',
  },
  listening: {
    title: 'Listen carefully',
    duration: 4,
    passage:
      'Hi, I’m Alex. I recently joined a new school, and at first I felt nervous because I didn’t know anyone. A few days later, I met someone who also enjoys basketball. We now practise together twice a week. Joining the team has helped me feel more confident and has made it easier to make new friends.',
    firstQuestion: {
      prompt: 'Why did Alex feel nervous?',
      options: [
        'He did not like basketball.',
        'He did not know anyone at the new school.',
        'He had too much homework.',
        'He could not join the team.',
      ],
      correctIndex: 1,
    },
    secondQuestion: {
      prompt: 'Alex practises basketball every day.',
      options: ['True', 'False'],
      correctIndex: 1,
    },
    speakingQuestion:
      'Have you ever felt nervous when meeting new people? What happened?',
    speakingTimerSeconds: 30,
  },
  topicChoice: {
    title: 'Choose your topic',
    duration: 3,
    topics: [
      {
        title: 'School life',
        prompt: 'What is one thing you would change about your school, and why?',
        vocabulary: [
          'school rules',
          'facilities',
          'timetable',
          'homework',
          'clubs',
        ],
      },
      {
        title: 'Technology',
        prompt: 'How does technology make your daily life easier?',
        vocabulary: [
          'communicate',
          'search for information',
          'save time',
          'stay organised',
          'solve problems',
        ],
      },
      {
        title: 'Free time',
        prompt: 'What activity can you spend hours doing, and why?',
        vocabulary: [
          'relaxing',
          'challenging',
          'creative',
          'spend time with',
          'improve at',
        ],
      },
    ],
    followUps: [
      'Can you give me an example?',
      'Why do you think so?',
      'How does it affect you?',
      'Would your friends agree?',
      'What are the advantages and disadvantages?',
    ],
    timing: {
      thinkSeconds: 120,
      speakSeconds: 60,
      guidance:
        'What to do? Give the student 2 minutes to think, then 1 minute to speak. Restart for each follow-up question.',
    },
  },
  strongerAnswer: {
    title: 'Build a stronger answer',
    duration: 4,
    teachingQuestion: 'Do you think students should have less homework?',
    steps: [
      {
        label: 'Answer',
        text: 'I think students should have less homework.',
      },
      {
        label: 'Reason',
        text: 'Because they also need time to rest.',
      },
      {
        label: 'Example',
        text: 'For example, some students study until late in the evening.',
      },
      { label: 'Ask Back', text: 'What do you think?' },
    ],
    speakingQuestion:
      'Is learning English online better than learning in a classroom?',
    phraseSupport: [
      'In my opinion…',
      'I think… because…',
      'For example…',
      'However…',
      'It depends on…',
      'What about you?',
    ],
  },
  teacherQuestions: {
    title: 'Let’s have a conversation',
    duration: 4,
    questions: [
      'What is something you are trying to improve at the moment?',
      'What makes someone a good teacher?',
      'What activity can you spend hours doing?',
      'What would you like to learn in the future?',
      'What is one problem technology can create?',
      'What makes a good friend?',
    ],
    followUps: [
      'Why is that important to you?',
      'Can you give me an example?',
      'Has your opinion changed?',
      'What would you do differently?',
      'Do you think other people agree?',
      'What about in the future?',
    ],
  },
  mission: {
    title: 'Plan a weekend together',
    duration: 5,
    scenario:
      'You and an English-speaking friend have one free afternoon. Choose an activity together.',
    options: [
      'Visit a science museum',
      'Play a sport',
      'Watch a movie and have dinner',
    ],
    checkpoints: [
      'State a preference',
      'Give a reason',
      'Respond to a different opinion',
      'Suggest another option',
      'Reach a final decision',
    ],
    expressions: [
      'I’d prefer…',
      'One reason is that…',
      'That sounds interesting, but…',
      'I see your point.',
      'How about…?',
      'Another option could be…',
      'Let’s choose…',
      'I agree because…',
    ],
    teacherNote:
      'Politely disagree with the student’s first choice so the student must respond and continue the conversation.',
    completionMessage: 'Mission completed!',
  },
  finalChallenge: {
    title: 'Your final challenge',
    duration: 3,
    prompt:
      'Imagine this is your first day at an international club. Introduce yourself, describe one interest, explain why you enjoy it and ask the teacher two questions.',
    timerSeconds: 90,
    keywords: [
      'usually',
      'currently',
      'interested in',
      'because',
      'for example',
      'in the future',
      'what about you',
    ],
  },
  feedback: {
    title: 'Teacher feedback',
    categories: feedbackCategories,
    ratings: feedbackRatings,
    guidance:
      'What to do? Complete all ratings and feedback notes, click Generate summary, then copy and send the summary to Ms. Soan.',
  },
};

export const lessonStages = [
  lessonContent.welcome,
  lessonContent.listening,
  lessonContent.topicChoice,
  lessonContent.strongerAnswer,
  lessonContent.teacherQuestions,
  lessonContent.mission,
  lessonContent.finalChallenge,
] as const;
