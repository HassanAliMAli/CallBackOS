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

// Hardcoded demo user for hackathon
const DEMO_USER: User = {
  id: "hassan-001",
  name: "Hassan Ali",
  email: "hassan@callbackos.com",
  avatar: null,
  timezone: "Asia/Karachi",
  role: "Admin",
  plan: "Growth"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_USER)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (_email: string, _password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setUser(DEMO_USER)
    setIsLoading(false)
    return true
  }, [])

  const signup = useCallback(async (_name: string, _email: string, _password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setUser(DEMO_USER)
    setIsLoading(false)
    return true
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
