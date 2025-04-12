export type ISessionItem = {
  id: number;
  name: string;
  progress?: number;
  completed?: boolean;
  orderInTopic: number;
  trackCount: number;
  topicId?: number;
};
