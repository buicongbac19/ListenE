import { IPostUpdateTrackItem } from "./../types/track";
import axios from "../utils/axios";
import { endpoints } from "../utils/axios";

export async function deleteTrack(trackId: number) {
  const URL = `${endpoints.track.root}/${trackId}`;
  const response = await axios.delete(URL);
  return response;
}

export async function getDetailsTrack(trackId: number) {
  const URL = `${endpoints.track.root}/${trackId}`;
  const response = axios.get(URL);
  return response;
}

export async function updateTrack(trackId: number, data: IPostUpdateTrackItem) {
  const URL = `${endpoints.track.root}/${trackId}`;
  const response = await axios.put(URL, data);
  return response;
}
