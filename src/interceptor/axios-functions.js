"use client";
import axios from "axios";
import momentTimezone from "moment-timezone";
import { useDispatch, useSelector } from "react-redux";

import RenderToast from "@/components/atoms/RenderToast";
import { baseURL } from "@/resources/utils/helper";
import { signOutRequest, updateJWTTokens } from "@/store/auth/authSlice";
import Cookies from "js-cookie";
import { handleDecrypt, handleEncrypt } from "./encryption";
import { usePathname } from "@/i18n/navigation";

const useAxios = () => {
  const currentPath = usePathname();
  const dispatch = useDispatch();
  const { accessToken, refreshToken } = useSelector(
    (state) => state.authReducer
  );

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    if (!refreshToken) {
      RenderToast({
        message: "No refresh token found.",
        type: "error",
      });
      return null;
    }

    try {
      const response = await axios.get(baseURL("auth/refresh/token"), {
        token: refreshToken,
      });

      const data = response?.data;
      Cookies.set("_xpdx_acom-web", handleEncrypt(data?.token));
      Cookies.set("_xpdx_rf_acom-web", handleEncrypt(data?.refreshToken));
      dispatch(
        updateJWTTokens({
          accessToken: data.token,
          refreshToken: data.refreshToken,
        })
      );

      return data.token;
    } catch (error) {
      Cookies.remove("_xpdx_acom-web");
      Cookies.remove("_xpdx_rf_acom-web");
      Cookies.remove("_pp_accepted", { path: "/" });
      dispatch(signOutRequest());
      return null;
    }
  };

  const getErrorMsg = (error = null) => {
    if (error?.message === "Network Error") {
      return `Network Error : Please Check Your Network Connection`;
    }
    const message = error?.response?.data?.message?.error;
    let errorMessage = "";

    Array.isArray(message)
      ? message?.map(
          (item, i) => (errorMessage = `${errorMessage} • ${item} \n`)
        )
      : (errorMessage = message);
    return errorMessage;
  };

  // Function to handle API requests
  const handleRequest = async ({
    method = "",
    route = "",
    data = {},
    headers = {},
    showAlert = true,
    isFormData = false,
    signal,
  }) => {
    const url = baseURL(route);
    const _headers = {
      "ngrok-skip-browser-warning": "69420",
      Accept: "application/json",
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      timezone: momentTimezone.tz.guess(),
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...headers,
    };

    try {
      const response = await axios({
        method,
        url,
        data,
        headers: _headers,
        signal,
      });
      return { response: response?.data, error: null };
    } catch (error) {
      if (axios.isCancel(error)) {
        return {
          error: {
            code: "ERR_CANCELED",
            message: "Request cancelled",
          },
          response: null,
        };
      }
      const errorMessage = getErrorMsg(error);
      if (showAlert) {
        RenderToast({
          message: errorMessage || "An unexpected error occurred.",
          type: "error",
        });
      }

      if (error?.response?.status === 401 && currentPath !== "/login") {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          headers.Authorization = `Bearer ${newAccessToken}`;
          return await axios({ method, url, data, headers });
        }
      }
      return { error, response: null };
    }
  };

  return {
    Get: ({ route = "", headers = {}, showAlert = true, signal }) =>
      handleRequest({ method: "get", route, headers, showAlert, signal }),

    Post: ({
      route = "",
      data = {},
      headers = {},
      showAlert = true,
      isFormData = false,
      signal,
    }) =>
      handleRequest({
        method: "post",
        route,
        data,
        headers,
        showAlert,
        isFormData,
        signal,
      }),

    Put: ({
      route = "",
      data = {},
      headers = {},
      showAlert = true,
      isFormData = false,
      signal,
    }) =>
      handleRequest({
        method: "put",
        route,
        data,
        headers,
        showAlert,
        isFormData,
        signal,
      }),

    Patch: ({
      route = "",
      data = {},
      headers = {},
      showAlert = true,
      isFormData = false,
      signal,
    }) =>
      handleRequest({
        method: "patch",
        route,
        data,
        headers,
        showAlert,
        isFormData,
        signal,
      }),

    Delete: ({ route = "", headers = {}, showAlert = true, signal }) =>
      handleRequest({ method: "delete", route, headers, showAlert, signal }),
  };
};

export default useAxios;
