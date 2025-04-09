export type ITrackItem = {
  id: number;
  name: string;
  sessionId: number;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed?: boolean;
};
