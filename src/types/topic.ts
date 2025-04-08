export type ITopicItem = {
  id: number;
  name: string;
  description: string;
  thumbnail?: File | string;
};

export type ITopicsFilterValue = string;

export type ITopicsFilters = {
  name?: string;
  search?: string;
};
