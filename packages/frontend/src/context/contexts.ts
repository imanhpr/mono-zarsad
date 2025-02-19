import { createContext } from "react";

export type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (payload: string | null) => void;
  isLoading: boolean;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalCode: string;
  };
};
export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken() {
    throw new Error("Implement Me");
  },
  isLoading: true,
});

export const ShowSideBarContext = createContext<{
  showSideBar: boolean;
  setShowSideBar: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  showSideBar: false,
  setShowSideBar() {
    throw new Error("Not implemented");
  },
});
