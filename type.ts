type Question = {
  questionId: number;
  questionFrontendId: number;
  acRate: number;
  difficulty: string;
  title: string;
  titleSlug: string;
};

type Subcriber = {};

export type DailyQuestion = {
  data: Date;
  userStatus: string;
  link: string;
  question: Question;
};

export type Difficulty = "easy" | "medium" | "hard"
