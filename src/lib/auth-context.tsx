import { createContext, useContext, useState, useEffect, useLayoutEffect, type ReactNode } from "react";

export type UserRole = "admin" | "customer";

export type SessionUser = {
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  address: string;
};

type AuthContextType = {
  user: SessionUser | null;
  login: (email: string, password: string) => { success: boolean; role?: UserRole; error?: string };
  signup: (data: { name: string; email: string; phone: string; address: string; password: string }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<Pick<SessionUser, "address" | "phone">>) => void;
  changePassword: (current: string, next: string) => { success: boolean; error?: string };
};

const ADMIN_EMAIL = "admin@arcticcircle.com";
const ADMIN_PASSWORD = "admin123";

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "ac_session";
const USERS_KEY = "ac_users";

type StoredUser = SessionUser & { password: string };

function loadUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always start null — server and first client render must match
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // After mount, read session from sessionStorage (client-only)
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

  const login = (email: string, password: string) => {
    // Check admin first
    if (
      (email.toLowerCase() === ADMIN_EMAIL || email.toLowerCase() === "admin") &&
      password === ADMIN_PASSWORD
    ) {
      const session: SessionUser = {
        role: "admin",
        name: "Admin",
        email: ADMIN_EMAIL,
        phone: "",
        address: "",
      };
      setUser(session);
      return { success: true, role: "admin" as UserRole };
    }

    // Check customer accounts
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const session: SessionUser = {
        role: "customer",
        name: found.name,
        email: found.email,
        phone: found.phone,
        address: found.address,
      };
      setUser(session);
      return { success: true, role: "customer" as UserRole };
    }

    return { success: false, error: "Invalid email or password." };
  };

  const signup = (data: { name: string; email: string; phone: string; address: string; password: string }) => {
    const users = loadUsers();
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "An account with this email already exists." };
    }
    const newUser: StoredUser = { ...data, role: "customer" };
    saveUsers([...users, newUser]);
    const session: SessionUser = {
      role: "customer",
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };
    setUser(session);
    return { success: true };
  };

  const logout = () => setUser(null);

  const updateProfile = (data: Partial<Pick<SessionUser, "address" | "phone">>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    // Also update in the users store
    const users = loadUsers();
    saveUsers(users.map((u) => (u.email === user.email ? { ...u, ...data } : u)));
  };

  const changePassword = (current: string, next: string) => {
    if (!user) return { success: false, error: "Not logged in." };
    if (user.role === "admin") return { success: false, error: "Admin password cannot be changed here." };
    const users = loadUsers();
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx === -1) return { success: false, error: "User not found." };
    if (users[idx].password !== current) return { success: false, error: "Current password is incorrect." };
    users[idx].password = next;
    saveUsers(users);
    return { success: true };
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