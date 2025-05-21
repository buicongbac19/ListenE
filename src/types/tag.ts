export type ITagItem = {
  id: number;
  type: string;
  name: string;
};

export type FetchTagsParams = {
  page?: number;
  size?: number;
  type?: string;
  sortField?: string;
  sortDirection?: "asc" | "desc";
};
