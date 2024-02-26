import { useEffect, useState } from "react";
import { socketInitialice } from "../utils/socket.initialize";

export const useSocketData = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    socketInitialice.on("mqttMessage", (message) => {
      setData(message);
      setIsLoading(false);
    });
  }, []);
  return {
    data,
    isLoading,
  };
};
