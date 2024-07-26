import { useState, useEffect } from "react";

const useNotifications = (isAuthor: boolean, joinRequests: string[]) => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthor && joinRequests.length > 0) {
      setNotifications((prevNotifications) => {
        const newNotifications = joinRequests.filter(
          (request) => !prevNotifications.includes(request)
        );
        return [...prevNotifications, ...newNotifications];
      });
    }
  }, [isAuthor, joinRequests]);

  const addNotification = (username: string) => {
    setNotifications((prevNotifications) => [...prevNotifications, username]);
  };

  const removeNotification = (username: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification !== username)
    );
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};

export default useNotifications;
