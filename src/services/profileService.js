import { apiClient } from "./apiClient";
import EndUrl from "../utils/EndUrl";

export const getProfileData = async () => {
  const response = await apiClient(EndUrl.getprofile);
  return response?.data?.[0] || null;
};
