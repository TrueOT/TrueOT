"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: e.currentTarget.email.value.toLowerCase(),
        password: e.currentTarget.password.value,
        redirect: false,
        callbackUrl: "/executive-summary"
      })

      if (result?.error) {
        setError(result.error)
        return
      }

      if (result?.ok) {
        router.push("/executive-summary")
        router.refresh()
      }
    } catch (err) {
      setError("Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Sidebar with image */}
      <div className="w-1/3 bg-gray-100 flex items-center justify-center h-screen">
        <img
          src="/OT.jpg" // Make sure this image exists in your public folder
          alt="Sidebar Image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 flex-col bg-white">
        {/* Logo */}
        <div className="flex justify-end p-4">
          <img
            src="/logo.png" // Make sure this logo exists in your public folder
            alt="Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Login Form */}
        <div className="flex flex-1 items-center justify-center px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome Text */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold text-purple-600">Welcome to TrueOT</h1>
              <h2 className="text-xl text-purple-600 border-b border-purple-600 pb-2 inline-block">Sign In</h2>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="text-center">
                <Link href="/register" className="text-purple-600 hover:underline text-sm">
                  Don't have an account? Create one
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

