import { createContext } from "react";

const AuthCtx = createContext<{ username: string } | null>(null);

export { AuthCtx };
