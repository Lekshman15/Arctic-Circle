import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi, usersApi, setToken, clearToken, ApiError, type PublicUser } from "@/lib/api";

export type UserRole = "admin" | "customer";

export type SessionUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  address: string;
};

type AuthResult = { success: boolean; role?: UserRole; error?: string };

type AuthContextType = {
  user: SessionUser | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (data: { name: string; email: string; phone: string; address: string; password: string }) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<SessionUser, "address" | "phone">>) => Promise<AuthResult>;
  changePassword: (current: string, next: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "ac_session";

function toSessionUser(u: PublicUser): SessionUser {
  return {
    id: u.id,
    role: u.role === "ADMIN" ? "admin" : "customer",
    name: u.name,
    email: u.email,
    phone: u.phone ?? "",
    address: u.address ?? "",
  };
}

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always start null — server and first client render must match
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // After mount, read the persisted session (client-only)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(SESSION_KEY);
  }, [user, hydrated]);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const { token, user: apiUser } = await authApi.login(email.trim(), password);
      setToken(token);
      const session = toSessionUser(apiUser);
      setUser(session);
      return { success: true, role: session.role };
    } catch (err) {
      return { success: false, error: errorMessage(err, "Invalid email or password.") };
    }
  };

  const signup = async (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
  }): Promise<AuthResult> => {
    try {
      const { token, user: apiUser } = await authApi.register(data);
      setToken(token);
      const session = toSessionUser(apiUser);
      setUser(session);
      return { success: true, role: session.role };
    } catch (err) {
      return { success: false, error: errorMessage(err, "Sign up failed.") };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const updateProfile = async (data: Partial<Pick<SessionUser, "address" | "phone">>): Promise<AuthResult> => {
    if (!user) return { success: false, error: "Not logged in." };
    try {
      const updated = await usersApi.updateMe(data);
      setUser(toSessionUser(updated));
      return { success: true };
    } catch (err) {
      return { success: false, error: errorMessage(err, "Could not update profile.") };
    }
  };

  const changePassword = async (current: string, next: string): Promise<AuthResult> => {
    if (!user) return { success: false, error: "Not logged in." };
    if (user.role === "admin") return { success: false, error: "Admin password cannot be changed here." };
    try {
      await usersApi.changePassword(current, next);
      return { success: true };
    } catch (err) {
      return { success: false, error: errorMessage(err, "Could not change password.") };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
