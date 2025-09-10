import { API_ROUTES, HANDLE_ERROR } from "./config";

import axiosInstance from "@/config/axios";

export const GET_INDEX_PAGE_DATA = async () => {
  try {
    const response = await axiosInstance.get(
      API_ROUTES.DASHBOARD.GET_INDEX_PAGE_DATA,
    );

    return response;
  } catch (error) {
    HANDLE_ERROR(error);
    throw error;
  }
};
