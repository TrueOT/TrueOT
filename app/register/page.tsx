"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/actions";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(formData);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
  {/* Left side - Sidebar with image */}
  <div className="w-1/3 bg-gray-100 flex items-center justify-center h-screen">
    <img
      src="/OT.jpg" // Replace with the path to your image in the `public` folder
      alt="Sidebar Image"
      className="w-full h-full object-cover"
    />
  </div>


      {/* Right side - Registration Form */}
      <div className="flex flex-1 flex-col bg-white">
        {/* Logo */}
        <div className="flex justify-end p-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Registration Form */}
        <div className="flex flex-1 items-center justify-center px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Welcome Text */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold text-purple-600">
                Welcome to TrueOT
              </h1>
              <h2 className="text-xl text-purple-600 border-b border-purple-600 pb-2 inline-block">
                Create Account
              </h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
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
                    placeholder="Create a password"
                    className="border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-0"
                    required
                  />
                </div>
                <div>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
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
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <div className="text-center">
                <Link href="/login" className="text-purple-600 hover:underline text-sm">
                  Already have an account? Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
