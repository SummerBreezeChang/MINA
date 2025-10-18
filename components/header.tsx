export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 bg-background/70 backdrop-blur-xl shadow-[0_0_30px_rgba(96,165,250,0.05)]">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/mina-logo.png" alt="Mina" className="h-8" />
          </div>
        </div>
      </div>
    </header>
  )
}
