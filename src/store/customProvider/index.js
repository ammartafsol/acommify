"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import useAxios from "@/interceptor/axios-functions";
import { handleLanguageChange } from "@/resources/utils/helper";
import Aos from "aos";
import Cookies from "js-cookie";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import store, { persistor } from "..";
import { signOutRequest, updateUser } from "../auth/authSlice";
import { setAvailableTokens } from "../common/commonSlice";
import { SocketProvider } from "@/context/SocketContext";
import { useLocaleHistory } from "@/resources/hooks/useLocaleHistory";

export function CustomProvider({ children }) {
  useLocaleHistory(); // tracks route changes globally

  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <ApisProvider>{children}</ApisProvider>
        </SocketProvider>
      </PersistGate>
    </Provider>
  );
}

export default function ApisProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  let accessToken = Cookies.get("_xpdx_acom-web");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer);
  const { Get } = useAxios();

  const getCommonData = async () => {
    const [{ response: userResponse }] = await Promise?.all([
      Get({ route: "users/me" }),
    ]);
    if (userResponse?.status === "success") {
      dispatch(updateUser(userResponse?.data));
      dispatch(
        setAvailableTokens(userResponse?.data?.foodTokens?.availableTokens || 0)
      );
    }
  };

  useEffect(() => {
    if (accessToken && user?._id) {
      const preferredLanguage = user?.defaultLanguage || "en";
      let sessionLang = sessionStorage.getItem("preferredLanguage");
      if (!sessionLang) {
        sessionLang = preferredLanguage;
        sessionStorage.setItem("preferredLanguage", preferredLanguage);
      }

      if (sessionLang !== locale) {
        handleLanguageChange(router, pathname, sessionLang);
      }
    } else {
      sessionStorage.clear();
    }
  }, [locale, pathname, router, user, accessToken]);

  useEffect(() => {
    if (accessToken) {
      console.log("Authenticated");
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      dispatch(signOutRequest());
    } else {
      getCommonData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
