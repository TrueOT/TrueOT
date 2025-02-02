"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Sidebar with image */}
      <div className="w-64 bg-gray-100 flex items-center justify-center">
        <img
          src="/OT.png" // Replace with the path to your image in the `public` folder
          alt="Sidebar Image"
          width={1080} // Adjust width as needed
          height={1080} // Adjust height as needed
          className="object-contain"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-1 flex-col bg-white">
        {/* Logo */}
        <div className="flex justify-end p-4">
        <img
      src="/logo.png" // Replace with the path to your logo in the `public` folder
      alt="Logo"
      className="h-10 w-auto" // Adjust the height and width as needed
      />
          
        </div>

        {/* Login Form */}
        <div className="flex flex-1 items-center justify-center px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome Text */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold text-purple-600">
                Welcome to TrueOT Software Tool
              </h1>
              <h2 className="text-xl text-purple-600 border-b border-purple-600 pb-2 inline-block">
                Login Page
              </h2>
            </div>

            <form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0"
                  />
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">Login</Button>

              <div className="text-center">
                <Link href="/create-account" className="text-purple-600 hover:underline text-sm">
                  Don&apos;t Have an Account? Create Now
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
