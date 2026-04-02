"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { User } from "../types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default user for public app (no authentication)
const DEFAULT_USER: User = {
  id: "public-user",
  name: "CallbackOS User",
  email: "user@callbackos.com",
  avatar: null,
  timezone: "UTC",
  role: "Admin",
  plan: "Starter"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // For now, accept any credentials (demo mode)
      // TODO: Implement real authentication with D1
      setUser({
        ...DEFAULT_USER,
        email: email
      })
      return true
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // For now, accept any signup (demo mode)
      // TODO: Implement real user registration with D1
      setUser({
        ...DEFAULT_USER,
        name,
        email
      })
      return true
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
