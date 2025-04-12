import { ITrackItem } from "./../types/track";
import axios from "../utils/axios";
import { endpoints } from "../utils/axios";

export async function createSessionTrack(
  sessionId: number,
  params: ITrackItem
) {
  const URL = `${endpoints.session.createTrack(sessionId)}`;
  const response = await axios.post(URL, params);
  return response;
}

export async function getListSessionTracks(sessonId: number) {
  const URL = `${endpoints.session.listTrack(sessonId)}`;
  const response = await axios.get(URL);
  return response;
}

export async function getDetailsSession(sessionId: number) {
  const URL = `${endpoints.session.root}/${sessionId}`;
  const response = await axios.get(URL);
  return response;
}
