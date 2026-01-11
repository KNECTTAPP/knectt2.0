import { processUpdateHeaders } from "../utils/headerUtils";

export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    // Process headers once for all API calls
    await processUpdateHeaders(response.headers);

    const json = await response.json();
    return { data: json, status: response.status };
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
};
