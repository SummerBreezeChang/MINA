import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 shadow-[0_0_30px_rgba(96,165,250,0.05)] bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <img src="/images/mina-logo.png" alt="Mina" className="h-8" />
          </Link>
        </div>
      </div>
    </header>
  )
}
