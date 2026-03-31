// @MOCK_STORE - Replace with real auth when connecting backend
"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { User } from "../types"
import { MOCK_CURRENT_USER } from "../mock" // @MOCK_IMPORT

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_CURRENT_USER) // @MOCK_IMPORT
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (_email: string, _password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1200)) // @MOCK_DELAY
    setUser(MOCK_CURRENT_USER) // @MOCK_IMPORT
    setIsLoading(false)
    return true
  }, [])

  const signup = useCallback(async (_name: string, _email: string, _password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500)) // @MOCK_DELAY
    setUser(MOCK_CURRENT_USER) // @MOCK_IMPORT
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
