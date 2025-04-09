export type ITopicItem = {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  sessionCount: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  isFavorite?: boolean;
};

export type ITopicsFilterValue = string | string[];

export type ITopicsFilters = {
  name?: string;
  search?: string;
  skill?: string[];
};
