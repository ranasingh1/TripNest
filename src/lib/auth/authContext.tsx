"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase-client";

interface CustomUser {
  displayName: string;
  email: string;
  uid: string;
}


interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<CustomUser>;
  signUp: (email: string, password: string, name: string) => Promise<CustomUser>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("token", token);

        setUser({
          displayName: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          uid: firebaseUser.uid,
        });
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<CustomUser> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    localStorage.setItem("token", token);

    const customUser = {
      displayName: result.user.displayName || "",
      email: result.user.email || "",
      uid: result.user.uid,
    };
    setUser(customUser);
    return customUser;
  };

  const signUp = async (email: string, password: string, name: string): Promise<CustomUser> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    const token = await result.user.getIdToken();
    localStorage.setItem("token", token);

    const customUser = {
      displayName: name,
      email: result.user.email || "",
      uid: result.user.uid,
    };
    setUser(customUser);
    return customUser;
  };

  const logOut = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const authValue: AuthContextType = { user, loading, signIn, signUp, logOut, resetPassword };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
