import Image from "next/image"


export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          className="absolute w-full h-full"
          src="https://www.youtube.com/embed/GcKbdhv5x20?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playlist=GcKbdhv5x20"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            objectFit: "cover",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen bg-black/30">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-4 lg:px-8">
          <div className="flex items-center gap-2 text-white">
            <Image
              src="/logo.png"
              alt="TrueOT Logo"
              width={120}
              height={40}
              className="h-10 w-auto mix-blend-multiply dark:mix-blend-difference invert"
            />
          </div>
          <div className="hidden md:flex items-center gap-8 text-white">
            <a href="#" className="hover:text-gray-300">
              Home
            </a>
            <a href="#" className="hover:text-gray-300">
              About
            </a>
            <a href="#" className="hover:text-gray-300">
              Destination
            </a>
            <a href="#" className="hover:text-gray-300">
              Blog
            </a>
            <a href="#" className="hover:text-gray-300">
              Dashboard
            </a>
            <a href="#" className="hover:text-gray-300">
              Contact
            </a>
          </div>
          
        </nav>

        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center px-4 pt-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-shadow-lg mb-4">LETS ENJOY THE NATURE</h1>
          <p className="text-lg text-white text-shadow mb-8">Get the best prices on 2,000,000+ properties worldwide</p>
        </div>
      </div>
    </div>
  )
}

