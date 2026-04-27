export function Nav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold text-foreground">SK</span>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {["projects", "about", "contact"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="capitalize transition-colors hover:text-foreground"
            >
              {section}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
