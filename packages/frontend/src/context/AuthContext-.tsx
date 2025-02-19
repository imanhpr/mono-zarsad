import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./contexts";
import type ZarAPI from "../api/index";

export default function AuthContextProvider({
  children,
  zarAPI,
}: {
  children: ReactNode;
  zarAPI: ZarAPI;
}) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalCode: string;
  }>();
  useEffect(() => {
    setIsLoading(true);
    async function refreshToken() {
      console.log("1.Refresh Token");
      try {
        const response = await zarAPI.refresh();
        const token = response.data.token;
        setAccessToken(token);
        zarAPI.setAccessToken(token);
      } catch {
        setAccessToken(null);
        setIsLoading(false);
      }
    }

    refreshToken();
  }, [zarAPI]);

  useEffect(() => {
    async function getMe() {
      console.log("1.GetMe");
      const response = await zarAPI.getMe();
      setUser(response.data);
      setIsLoading(false);
    }
    if (accessToken) {
      getMe();
    }
  }, [accessToken, zarAPI]);
  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken: (payload) => {
          setAccessToken(payload);
          zarAPI.setAccessToken(payload);
        },
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
