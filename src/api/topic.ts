import { ITopicItem } from "./../types/topic";
import useSWR, { mutate } from "swr";
import { AxiosRequestConfig } from "axios";
import { useMemo, useCallback } from "react";

import axios, { fetcher, endpoints } from "../utils/axios";
import { stringifyRequestQuery } from "../utils/crud-helpers/crud-helper";
import {
  QueryState,
  BaseResponseWithPayload,
} from "..//utils/crud-helpers/model";

// ----------------------------------------------------------------------

export function useGetTopics(queryStage: QueryState) {
  const URL = `${endpoints.topic.root}?${stringifyRequestQuery(queryStage)}`;
  const config: AxiosRequestConfig = {
    method: "get",
  };

  const { data, isLoading, error, isValidating } = useSWR<
    BaseResponseWithPayload<ITopicItem[]>
  >([URL, config], fetcher, {
    revalidateOnFocus: false, // Optional: Disable automatic revalidation
    revalidateOnMount: true, // Luôn tải lại khi component mount
    revalidateIfStale: true, // Luôn tải lại nếu dữ liệu cũ
  });
  const refetchQuestions = useCallback(() => {
    mutate(
      [
        URL,
        {
          method: "get",
        },
      ],
      undefined,
      { revalidate: true }
    ); // Force re-fetch without using the cache
  }, [URL]);

  // Memoize the value to avoid unnecessary re-renders
  const memoizedValue = useMemo(() => {
    // Check if data is available and is of correct type
    const response = data as BaseResponseWithPayload<ITopicItem[]>;
    return {
      topics: response?.data ?? [], // Access the users from the response data
      topicsLoading: isLoading, // Loading is true if no data and no error
      topicsError: error, // Error object
      topicsValidating: isValidating, // SWR validating status
      topicsEmpty: !isValidating && !(response?.data?.length > 0), // Check if data is empty
      topicsTotal: response?.payload?.pagination?.total ?? 0, // Access total from pagination
      questionRefresh: refetchQuestions,
    };
  }, [data, error, isLoading, isValidating, refetchQuestions]);

  return memoizedValue;
}

export async function getAllTopics() {
  const URL = `${endpoints.topic.root}`;
  const res = await axios.get(URL);
  return res;
}

export async function updateOrCreateTopic(
  params: ITopicItem,
  isDelete: boolean = false
) {
  if (isDelete) {
    // delete
    const URL = `${endpoints.topic.root}/${params.id}`;
    const res = await axios.delete(URL);
    return res;
  }

  if (params.id) {
    // update
    const URL = `${endpoints.topic.root}/${params.id}`;
    const response = await axios.put(URL, params);
    return response;
  }

  // add
  const res = await axios.post(endpoints.topic.root, params);
  return res;
}

export async function getAllTopicSessions(topicId: number) {
  const URL = `${endpoints.topic.listSession(topicId)}`;
  const response = await axios.get(URL);
  return response;
}

export async function getDetailsTopic(topicId: number) {
  const URL = `${endpoints.topic.root}/${topicId}`;
  const response = await axios.get(URL);
  return response;
}
