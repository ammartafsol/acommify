"use client";

import RenderToast from "@/components/atoms/RenderToast";
import config from "@/config";
import { getUniqueBrowserId } from "@/resources/utils/helper";
import { signOutRequest, updateUser } from "@/store/auth/authSlice";
import { setAvailableTokens } from "@/store/common/commonSlice";
import { useRouter } from "@/i18n/navigation";
import Cookies from "js-cookie";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state) => state?.authReducer);

  // Memoized logout handler to avoid duplication
  const handleLogout = useCallback(
    (message) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("acommify_blocked_notice", message);
      }
      RenderToast({
        type: "error",
        message,
        autoClose: 5000,
      });
      dispatch(signOutRequest());
      Cookies.remove("_xpdx_acom-web");
      Cookies.remove("_xpdx_rf_acom-web");
      Cookies.remove("_xpdx_u_acom-web");
      Cookies.remove("_pp_accepted", { path: "/" });
      router?.push("/login");
    },
    [dispatch, router]
  );

  const handleUpdateUser = useCallback(
    (data) => {
      console.log("Updating user with data:", data);

      dispatch(updateUser(data));
      dispatch(setAvailableTokens(data?.foodTokens?.availableTokens || 0));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    socket.current = io(config?.apiBaseUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const currentSocket = socket.current;

    // Connection event handler
    const handleConnect = () => {
      console.log("Socket connected:", {
        socketId: currentSocket.id,
        device: getUniqueBrowserId(),
        userId: user?._id,
      });

      // Join room after connection
      currentSocket.emit("join", {
        id: user?._id,
        device: getUniqueBrowserId(),
      });
    };

    // Error event handler
    const handleConnectError = (error) => {
      console.error("Socket connection error:", error);
    };

    // User blocked event handler
    const handleUserBlocked = () => {
      handleLogout("Your account has been blocked");
    };

    // User deleted event handler
    const handleUserDeleted = () => {
      handleLogout("Your account has been deleted");
    };

    const handleUserUpdates = (data) => {
      handleUpdateUser(data);
    };

    const handleAccountUpdate = (data) => {
      if (data?.status === "inactive") {
        handleLogout("Your account has been blocked");
        return;
      }
      handleUpdateUser(data);
    };

    // Register event listeners
    currentSocket.on("connect", handleConnect);
    currentSocket.on("connect_error", handleConnectError);
    currentSocket.on("user-blocked", handleUserBlocked);
    currentSocket.on("user-deleted", handleUserDeleted);
    currentSocket.on("user-updated", handleUserUpdates);
    currentSocket.on("updated-user", handleAccountUpdate);

    // Cleanup function
    return () => {
      if (currentSocket) {
        currentSocket.off("connect", handleConnect);
        currentSocket.off("connect_error", handleConnectError);
        currentSocket.off("user-blocked", handleUserBlocked);
        currentSocket.off("user-deleted", handleUserDeleted);
        currentSocket.off("user-updated", handleUserUpdates);
        currentSocket.off("updated-user", handleAccountUpdate);
        currentSocket.disconnect();
      }
    };
  }, [handleLogout, handleUpdateUser, user?._id]);

  // Provide the socket connection to children
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Custom hook to access the socket connection
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
