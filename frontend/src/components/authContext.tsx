import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getMe } from "../api/auth.api";

type User = {
    id: number;
    email: string;
    role: string;
};

type AuthContextType = {
    role: string;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    initialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        async function restoreSession() {
            console.log("AuthContext: restoreSession running");
            const token = localStorage.getItem("token");

            if (!token) {
                setInitialized(true);
                return;
            }

            try {
                const response = await getMe();
                setUser(response.user);
                localStorage.setItem("user", JSON.stringify(response.user));
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setInitialized(true);
            }
        }

        restoreSession();
    }, []);

    function login(token: string, user: User) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, initialized }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}