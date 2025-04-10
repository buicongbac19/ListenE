export type ISegmentItem = {
  id: number;
  trackId: number;
  name: string;
  duration: string;
  audioUrl: string;
  transcript: string;
  completed?: boolean;
};
