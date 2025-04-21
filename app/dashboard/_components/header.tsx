"use client"

export function Header() {
  return (
    <header className="h-16 border-b bg-white px-6">
      <div className="flex h-full items-center justify-end">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <img src="/avatar.png" alt="User avatar" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  )
}

