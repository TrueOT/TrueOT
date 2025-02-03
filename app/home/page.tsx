import Image from "next/image"
import { Button } from "@/components/ui/button"


export default function Home() {
    return (
      <div className="relative min-h-screen">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            className="absolute w-full h-full"
            src="https://www.youtube.com/embed/GcKbdhv5x20?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playlist=GcKbdhv5x20&cc_load_policy=0&hl=en"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
  
        {/* Content Overlay */}
        <div className="relative z-10 min-h-screen bg-black/30">
          {/* Navigation */}
          <nav className="flex items-center justify-between p-4 lg:px-8">
            <div className="flex items-center gap-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CsqpYlYpvFyDMetwIRq0kmiCU7pel5.png"
                alt="TrueOT Logo"
                className="h-10 w-auto mix-blend-multiply dark:mix-blend-difference invert"
              />
            </div>
          </nav>
  
          {/* Hero Content */}
          <div className="flex flex-col items-center justify-center px-4 pt-32 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white text-shadow-lg mb-4">TrueOT Security for Vulnerability Management</h1>
            <p className="text-lg text-white text-shadow mb-8">Securing industrial operations, we empower a future of uninterrupted growth.</p>
            <Button className="bg-[#9333EA] hover:bg-[#8829e0] text-white px-16 py-3 rounded-md text-lg font-semibold w-full max-w-md">
              Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

