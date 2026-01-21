"use client"
import { ReactNode } from "react"
import { useAuthRedirect } from "../hooks/useAuthRedirect"

export default function AuthWrapper({ children }: { children: ReactNode }) {
  useAuthRedirect()
  return <>{children}</>
}