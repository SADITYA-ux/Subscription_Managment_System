import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type User = {
    id: number;
    email: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    initialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [initialized , setInitialized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setInitialized(true);
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

export function useAuth () {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}